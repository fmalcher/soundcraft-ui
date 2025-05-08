import { Subject, map, of, take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import {
  select,
  selectMasterDelay,
  selectMasterDim,
  selectMasterPan,
  selectMasterValue,
} from '../state/state-selectors';
import { sourcesToTransition, TransitionSource } from '../transitions';
import { clamp, roundToThreeDecimals } from '../utils';
import { resolveDelayed } from '../utils/async-helpers';
import { Easings } from '../utils/transitions/easings';
import { DBToFaderValue, faderValueToDB } from '../utils/value-converters';
import { sanitizeDelayValue } from '../utils/value-converters/value-converters';
import { DelayableMasterChannel } from './delayable-master-channel';
import { FadeableChannel, PannableChannel } from './interfaces';
import { MasterChannel } from './master-channel';

/**
 * Represents the master bus
 */
export class MasterBus implements FadeableChannel, PannableChannel {
  name$ = of('MASTER');

  /** Linear level of the master fader (between `0` and `1`) */
  faderLevel$ = this.store.state$.pipe(select(selectMasterValue()));

  /** dB level of the master fader (between `-Infinity` and `10`) */
  faderLevelDB$ = this.faderLevel$.pipe(map(v => faderValueToDB(v)));

  /** PAN value of the master (between `0` and `1`) */
  pan$ = this.store.state$.pipe(select(selectMasterPan()));

  /** DIM value of the master (`0` or `1`) */
  dim$ = this.store.state$.pipe(select(selectMasterDim()));

  /** LEFT DELAY (ms) of the master */
  delayL$ = this.store.state$.pipe(select(selectMasterDelay('L')));
  /** RIGHT DELAY (ms) of the master */
  delayR$ = this.store.state$.pipe(select(selectMasterDelay('R')));

  private transitionSources$ = new Subject<TransitionSource>();

  constructor(private conn: MixerConnection, private store: MixerStore) {
    // create transition steps and set master fader level accordingly
    sourcesToTransition(this.transitionSources$, this.faderLevel$, conn).subscribe(v =>
      this.setFaderLevelRaw(v)
    );
  }

  /** Fader getters */

  /**
   * Get input channel on the master bus
   * @param channel Channel number
   */
  input(channel: number) {
    return new DelayableMasterChannel(this.conn, this.store, 'i', channel);
  }

  /**
   * Get line channel on the master bus
   * @param channel Channel number
   */
  line(channel: number) {
    return new DelayableMasterChannel(this.conn, this.store, 'l', channel);
  }

  /**
   * Get player channel on the master bus
   * @param channel Channel number
   */
  player(channel: number) {
    return new MasterChannel(this.conn, this.store, 'p', channel);
  }

  /**
   * Get AUX output channel on the master bus
   * @param channel Channel number
   */
  aux(channel: number) {
    return new DelayableMasterChannel(this.conn, this.store, 'a', channel);
  }

  /**
   * Get FX channel on the master bus
   * @param channel Channel number
   */
  fx(channel: number) {
    return new MasterChannel(this.conn, this.store, 'f', channel);
  }

  /**
   * Get sub group channel on the master bus
   * @param channel Channel number
   */
  sub(channel: number) {
    return new MasterChannel(this.conn, this.store, 's', channel);
  }

  /**
   * Get VCA channel on the master bus
   * @param channel Channel number
   */
  vca(channel: number) {
    return new MasterChannel(this.conn, this.store, 'v', channel);
  }

  /** Master actions */

  /**
   * Perform fader transition to linear value
   * @param targetValue Target value as linear value (between 0 and 1)
   * @param fadeTime Fade time in ms
   * @param easing Easing characteristic, as an entry of the `Easings` enum. Defaults to `Linear`
   * @param fps Frames per second, defaults to 25
   */
  fadeTo(targetValue: number, fadeTime: number, easing: Easings = Easings.Linear, fps = 25) {
    targetValue = clamp(targetValue, 0, 1);
    this.transitionSources$.next({
      targetValue,
      fadeTime,
      easing,
      fps,
    });
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
   * Set linear level of the master fader
   * @param value value between `0` and `1`
   */
  setFaderLevel(value: number) {
    value = clamp(value, 0, 1);
    this.setFaderLevelRaw(value);
  }

  private setFaderLevelRaw(value: number) {
    const command = `SETD^m.mix^${value}`;
    this.conn.sendMessage(command);
  }

  /**
   * Set dB level of the master fader
   * @param dbValue value between `-Infinity` and `10`
   */
  setFaderLevelDB(dbValue: number) {
    this.setFaderLevel(DBToFaderValue(dbValue));
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
   * Set PAN value for the master
   * @param value value between `0` and `1`
   */
  setPan(value: number) {
    value = clamp(value, 0, 1);
    value = roundToThreeDecimals(value);
    const command = `SETD^m.pan^${value}`;
    this.conn.sendMessage(command);
  }

  /**
   * Relatively change PAN value for the master
   * @param offset offset to change (final values are between `0` and `1`)
   */
  changePan(offset: number) {
    this.pan$.pipe(take(1)).subscribe(v => this.setPan(v + offset));
  }

  /**
   * Set DIM value for the master
   * @param value DIM value `0` or `1`
   */
  setDim(value: number) {
    const command = `SETD^m.dim^${value}`;
    this.conn.sendMessage(command);
  }

  /** Enable DIM on the master */
  dim() {
    this.setDim(1);
  }

  /** Disable DIM on the master */
  undim() {
    this.setDim(0);
  }

  /** Toggle DIM on the master */
  toggleDim() {
    this.dim$.pipe(take(1)).subscribe(dim => this.setDim(dim ^ 1));
  }

  /** Set LEFT DELAY (ms) for master output. Maximum 500 ms */
  setDelayL(ms: number) {
    this.setDelay(ms, 'L');
  }

  /** Set RIGHT DELAY (ms) for master output. Maximum 500 ms */
  setDelayR(ms: number) {
    this.setDelay(ms, 'R');
  }

  /**
   * Relatively change LEFT DELAY (ms) for master output. Maximum 500 ms
   * @param offsetMs value (ms) to add to the current value
   */
  changeDelayL(offsetMs: number) {
    this.delayL$.pipe(take(1)).subscribe(value => this.setDelayL(value + offsetMs));
  }

  /**
   * Relatively change RIGHT DELAY (ms) for master output. Maximum 500 ms
   * @param offsetMs value (ms) to add to the current value
   */
  changeDelayR(offsetMs: number) {
    this.delayR$.pipe(take(1)).subscribe(value => this.setDelayR(value + offsetMs));
  }

  private setDelay(ms: number, side: 'L' | 'R') {
    const value = sanitizeDelayValue(ms, 500);
    this.conn.sendMessage(`SETD^m.delay${side}^${value}`);
  }
}
