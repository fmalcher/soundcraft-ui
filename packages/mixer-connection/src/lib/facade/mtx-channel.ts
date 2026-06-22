import { Observable, Subject, map, take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { selectRawValue } from '../state/state-selectors';
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

  /** MUTE value of the matrix source (`0` or `1`) */
  readonly mute$ = this.store.state$.pipe(selectRawValue<number>(`${this.fullChannelId}.mute`, 0));

  /** PAN value of the matrix source (between `0` and `1`) */
  readonly pan$ = this.store.state$.pipe(selectRawValue<number>(`${this.fullChannelId}.pan`, 0));

  /** PRE/POST PROC value of the matrix source (`1` (POST PROC) or `0` (PRE PROC)) */
  readonly postProc$ = this.store.state$.pipe(
    selectRawValue<number>(`${this.fullChannelId}.postproc`, 0),
  );

  /** all linked channels (mirror on the stereo-linked matrix output and stereo-link neighbour) */
  protected linkedChannelIds: string[] = [];

  /** channels that mirror the PAN value (the stereo-linked matrix output, but not a neighbour source) */
  protected panLinkChannelIds: string[] = [];

  private transitionSources$ = new Subject<TransitionSource>();

  constructor(
    protected conn: MixerConnection,
    protected store: MixerStore,
    protected fullChannelId: string,
    storeId: string,
  ) {
    // lookup object in the store and use existing object if possible
    const storedObject = this.store.objectStore.get<MtxChannel>(storeId);
    if (storedObject) {
      return storedObject;
    } else {
      this.store.objectStore.set(storeId, this);
    }

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
    [...this.linkedChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.value^${value}`;
      this.conn.sendMessage(command);
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
   * Set MUTE value for the matrix source
   * @param value MUTE value `0` or `1`
   */
  setMute(value: number) {
    [...this.linkedChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.mute^${value}`;
      this.conn.sendMessage(command);
    });
  }

  /** Enable MUTE for the matrix source */
  mute() {
    this.setMute(1);
  }

  /** Disable MUTE for the matrix source */
  unmute() {
    this.setMute(0);
  }

  /** Toggle MUTE status for the matrix source */
  toggleMute() {
    this.mute$.pipe(take(1)).subscribe(mute => this.setMute(mute ^ 1));
  }

  /**
   * Set PAN value of the matrix source.
   * This only works for stereo-linked matrix buses, not for mono matrix.
   * @param value value between `0` and `1`
   */
  setPan(value: number) {
    value = clamp(value, 0, 1);
    value = roundToThreeDecimals(value);
    [...this.panLinkChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.pan^${value}`;
      this.conn.sendMessage(command);
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
   * Set PRE/POST PROC value for the matrix source
   * @param value `1` (POST PROC) or `0` (PRE PROC)
   */
  setPostProc(value: number) {
    [...this.linkedChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.postproc^${value}`;
      this.conn.sendMessage(command);
    });
  }

  /** Set matrix source to POST PROC */
  postProc() {
    this.setPostProc(1);
  }

  /** Set matrix source to PRE PROC */
  preProc() {
    this.setPostProc(0);
  }
}
