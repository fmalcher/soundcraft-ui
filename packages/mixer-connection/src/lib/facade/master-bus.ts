import { Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import {
  select,
  selectMasterDim,
  selectMasterPan,
  selectMasterValue,
} from '../state/state-selectors';
import { sourcesToTransition, TransitionSource } from '../transitions';
import { Easings } from '../utils/transitions/easings';
import { DBToFaderValue, faderValueToDB } from '../utils/value-converters';
import { FadeableChannel, PannableChannel } from './interfaces';
import { MasterChannel } from './master-channel';

/**
 * Represents the master bus
 */
export class MasterBus implements FadeableChannel, PannableChannel {
  /** Linear level of the master fader (between `0` and `1`) */
  faderLevel$ = this.store.state$.pipe(select(selectMasterValue()));

  /** dB level of the master fader (between `-Infinity` and `10`) */
  faderLevelDB$ = this.faderLevel$.pipe(map(v => faderValueToDB(v)));

  /** PAN value of the master (between `0` and `1`) */
  pan$ = this.store.state$.pipe(select(selectMasterPan()));

  /** DIM value of the master (`0` or `1`) */
  dim$ = this.store.state$.pipe(select(selectMasterDim()));

  private transitionSources$ = new Subject<TransitionSource>();

  constructor(private conn: MixerConnection, private store: MixerStore) {
    // create transition steps and set master fader level accordingly
    sourcesToTransition(this.transitionSources$, this.faderLevel$, conn).subscribe(v =>
      this.setFaderLevel(v)
    );
  }

  /** Fader getters */

  /**
   * Get input channel on the master bus
   * @param channel Channel number
   */
  input(channel: number) {
    return new MasterChannel(this.conn, this.store, 'i', channel);
  }

  /**
   * Get line channel on the master bus
   * @param channel Channel number
   */
  line(channel: number) {
    return new MasterChannel(this.conn, this.store, 'l', channel);
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
    return new MasterChannel(this.conn, this.store, 'a', channel);
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
    this.transitionSources$.next({
      targetValue,
      fadeTime,
      easing,
      fps,
    });
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
    const command = `SETD^m.mix^${value}`;
    this.conn.sendMessage(command);
  }

  /**
   * Set dB level of the master fader
   * @param value value between `-Infinity` and `10`
   */
  setFaderLevelDB(dbValue: number) {
    this.setFaderLevel(DBToFaderValue(dbValue));
  }

  /**
   * Change the fader value relatively by adding a given value
   * @param dbValueToAdd Value (dB) to add to the current value
   */
  changeFaderLevelDB(dbValueToAdd: number) {
    this.faderLevelDB$
      .pipe(
        take(1),
        map(value => Math.max(value + dbValueToAdd, -100))
      )
      .subscribe(v => this.setFaderLevelDB(v));
  }

  /**
   * Set PAN value for the master
   * @param value value between `0` and `1`
   */
  pan(value: number) {
    const command = `SETD^m.pan^${value}`;
    this.conn.sendMessage(command);
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
}
