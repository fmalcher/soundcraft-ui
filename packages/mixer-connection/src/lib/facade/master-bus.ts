import { map, take } from 'rxjs/operators';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import {
  select,
  selectMasterDim,
  selectMasterPan,
  selectMasterValue,
} from '../state/state-selectors';
import { DBToFaderValue, faderValueToDB } from '../utils/value-converters';
import { MasterChannel } from './master-channel';

/**
 * Represents the master bus
 */
export class MasterBus {
  /** Linear level of the master fader (between `0` and `1`) */
  faderLevel$ = this.state.state$.pipe(select(selectMasterValue()));

  /** dB level of the master fader (between `-Infinity` and `10`) */
  faderLevelDB$ = this.faderLevel$.pipe(map(v => faderValueToDB(v)));

  /** PAN value of the master (between `0` and `1`) */
  pan$ = this.state.state$.pipe(select(selectMasterPan()));

  /** DIM value of the master (`0` or `1`) */
  dim$ = this.state.state$.pipe(select(selectMasterDim()));

  constructor(private conn: MixerConnection, private state: MixerStore) {}

  /** Fader getters */

  /**
   * Get input channel on the master bus
   * @param channel Channel number
   */
  input(channel: number) {
    return new MasterChannel(this.conn, this.state, 'i', channel);
  }

  /**
   * Get line channel on the master bus
   * @param channel Channel number
   */
  line(channel: number) {
    return new MasterChannel(this.conn, this.state, 'l', channel);
  }

  /**
   * Get player channel on the master bus
   * @param channel Channel number
   */
  player(channel: number) {
    return new MasterChannel(this.conn, this.state, 'p', channel);
  }

  /**
   * Get AUX output channel on the master bus
   * @param channel Channel number
   */
  aux(channel: number) {
    return new MasterChannel(this.conn, this.state, 'a', channel);
  }

  /**
   * Get FX channel on the master bus
   * @param channel Channel number
   */
  fx(channel: number) {
    return new MasterChannel(this.conn, this.state, 'f', channel);
  }

  /**
   * Get sub group channel on the master bus
   * @param channel Channel number
   */
  sub(channel: number) {
    return new MasterChannel(this.conn, this.state, 's', channel);
  }

  /**
   * Get VCA channel on the master bus
   * @param channel Channel number
   */
  vca(channel: number) {
    return new MasterChannel(this.conn, this.state, 'v', channel);
  }

  /** Master actions */

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
