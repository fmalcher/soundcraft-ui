import { Observable, Subject, map, take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { selectBoolean, selectRawValue } from '../state/state-selectors';
import { sourcesToTransition, TransitionSource } from '../transitions';
import { clamp, roundToThreeDecimals } from '../utils';
import { resolveDelayed } from '../utils/async-helpers';
import { Easings } from '../utils/transitions/easings';
import { DBToFaderValue, faderValueToDB } from '../utils/value-converters';
import { FadeableChannel, PannableChannel, PostProcessableChannel } from './interfaces';

/**
 * Base class for all sources routed to a matrix bus.
 * A matrix source can be an AUX bus or subgroup (`MtxBusChannel`) or the
 * master mix (`MtxMasterChannel`). Matrix buses are only available on the Ui24R.
 *
 * The level, MUTE and PAN observables are derived purely from the `fullChannelId`,
 * because the matrix state always lives at `<fullChannelId>.value/.mute/.pan`.
 * The concrete subclass only has to provide the `fullChannelId` and override `name$`,
 * which is the one source that can't be derived from the id (the master source has no
 * channel index and therefore no name path).
 */
export abstract class MtxChannel
  implements FadeableChannel, PannableChannel, PostProcessableChannel
{
  /** Name of the matrix source (provided by the concrete subclass) */
  abstract readonly name$: Observable<string>;

  /** Linear level of the matrix source (between `0` and `1`) */
  readonly faderLevel$ = this.store.state$.pipe(
    selectRawValue<number>(`${this.fullChannelId}.value`),
  );

  /** dB level of the matrix source (between `-Infinity` and `10`) */
  readonly faderLevelDB$ = this.faderLevel$.pipe(map(v => faderValueToDB(v)));

  /** MUTE state of the matrix source */
  readonly mute$ = this.store.state$.pipe(selectBoolean(`${this.fullChannelId}.mute`));

  /** PAN value of the matrix source (between `0` and `1`) */
  readonly pan$ = this.store.state$.pipe(selectRawValue<number>(`${this.fullChannelId}.pan`, 0));

  /** PRE/POST PROC state of the matrix source (`false` for PRE PROC, `true` for POST PROC) */
  readonly postProc$ = this.store.state$.pipe(selectBoolean(`${this.fullChannelId}.postproc`));

  /** all linked channels (mirror on the stereo-linked matrix output and stereo-link neighbour) */
  protected linkedChannelIds: string[] = [this.fullChannelId];

  /** channels that mirror the PAN value (the stereo-linked matrix output, but not a neighbour source) */
  protected panLinkChannelIds: string[] = [this.fullChannelId];

  private transitionSources$ = new Subject<TransitionSource>();

  constructor(
    protected conn: MixerConnection,
    protected store: MixerStore,
    protected fullChannelId: string,
  ) {
    // create transition steps and set fader level accordingly
    sourcesToTransition(this.transitionSources$, this.faderLevel$, conn).subscribe(v =>
      this.setFaderLevelRaw(v),
    );
  }

  /**
   * Perform fader transition to linear value
   * @param targetValue Target value as linear value (between 0 and 1)
   * @param fadeTime Fade time in ms
   * @param easing Easing characteristic, as an entry of the `Easings` enum. Defaults to `Linear`
   * @param fps Frames per second, defaults to 25
   */
  fadeTo(targetValue: number, fadeTime: number, easing: Easings = Easings.Linear, fps = 25) {
    targetValue = clamp(targetValue, 0, 1);
    this.transitionSources$.next({ targetValue, fadeTime, easing, fps });
    return resolveDelayed(fadeTime);
  }

  /**
   * Perform fader transition to dB value
   * @param targetValueDB Target value as dB value (between -Infinity and 10)
   * @param fadeTime Fade time in ms
   * @param easing Easing characteristic, as an entry of the `Easings` enum. Defaults to `Linear`
   * @param fps Frames per second, defaults to 25
   */
  fadeToDB(targetValueDB: number, fadeTime: number, easing: Easings = Easings.Linear, fps = 25) {
    const targetValue = DBToFaderValue(targetValueDB);
    return this.fadeTo(targetValue, fadeTime, easing, fps);
  }

  /**
   * Set linear level of the matrix source
   * @param value value between `0` and `1`
   */
  setFaderLevel(value: number) {
    value = clamp(value, 0, 1);
    this.setFaderLevelRaw(value);
  }

  private setFaderLevelRaw(value: number) {
    this.linkedChannelIds.forEach(cid => {
      this.conn.setd(`${cid}.value`, value);
    });
  }

  /**
   * Set dB level of the matrix source
   * @param value value between `-Infinity` and `10`
   */
  setFaderLevelDB(dbValue: number) {
    this.setFaderLevel(DBToFaderValue(dbValue));
  }

  /**
   * Change the fader value relatively by adding a given linear value
   * @param offset value to add to the current linear fader value
   */
  changeFaderLevel(offset: number) {
    this.faderLevel$
      .pipe(take(1))
      .subscribe(v => this.setFaderLevel(roundToThreeDecimals(v + offset)));
  }

  /**
   * Change the fader value relatively by adding a given value
   * @param offsetDB value (dB) to add to the current value
   */
  changeFaderLevelDB(offsetDB: number) {
    this.faderLevelDB$
      .pipe(take(1))
      .subscribe(v => this.setFaderLevelDB(Math.max(v, -100) + offsetDB));
  }

  /**
   * Set MUTE state for the matrix source
   * @param value MUTE state
   */
  setMute(value: boolean) {
    this.linkedChannelIds.forEach(cid => {
      this.conn.setdBool(`${cid}.mute`, value);
    });
  }

  /** Enable MUTE for the matrix source */
  mute() {
    this.setMute(true);
  }

  /** Disable MUTE for the matrix source */
  unmute() {
    this.setMute(false);
  }

  /** Toggle MUTE state for the matrix source */
  toggleMute() {
    this.mute$.pipe(take(1)).subscribe(mute => this.setMute(!mute));
  }

  /**
   * Set PAN value of the matrix source.
   * This only works for stereo-linked matrix buses, not for mono matrix.
   * @param value value between `0` and `1`
   */
  setPan(value: number) {
    value = clamp(value, 0, 1);
    value = roundToThreeDecimals(value);
    this.panLinkChannelIds.forEach(cid => {
      this.conn.setd(`${cid}.pan`, value);
    });
  }

  /**
   * Relatively change PAN value of the matrix source.
   * This only works for stereo-linked matrix buses, not for mono matrix.
   * @param offset offset to change (final values are between `0` and `1`)
   */
  changePan(offset: number) {
    this.pan$.pipe(take(1)).subscribe(v => this.setPan(v + offset));
  }

  /**
   * Set PRE/POST PROC state for the matrix source
   * @param value POST PROC (`true`) or PRE PROC (`false`)
   */
  setPostProc(value: boolean) {
    this.linkedChannelIds.forEach(cid => {
      this.conn.setdBool(`${cid}.postproc`, value);
    });
  }

  /** Set matrix source to POST PROC */
  postProc() {
    this.setPostProc(true);
  }

  /** Set matrix source to PRE PROC */
  preProc() {
    this.setPostProc(false);
  }
}
