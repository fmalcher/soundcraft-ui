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
  faderLevel$ = this.state.state$.pipe(select(selectMasterValue()));
  faderLevelDB$ = this.faderLevel$.pipe(map(v => faderValueToDB(v)));

  pan$ = this.state.state$.pipe(select(selectMasterPan()));
  dim$ = this.state.state$.pipe(select(selectMasterDim()));

  constructor(private conn: MixerConnection, private state: MixerStore) {}

  /** Fader getters */

  input(channel: number) {
    return new MasterChannel(this.conn, this.state, 'i', channel);
  }

  line(channel: number) {
    return new MasterChannel(this.conn, this.state, 'l', channel);
  }

  player(channel: number) {
    return new MasterChannel(this.conn, this.state, 'p', channel);
  }

  aux(channel: number) {
    return new MasterChannel(this.conn, this.state, 'a', channel);
  }

  fx(channel: number) {
    return new MasterChannel(this.conn, this.state, 'f', channel);
  }

  sub(channel: number) {
    return new MasterChannel(this.conn, this.state, 's', channel);
  }

  vca(channel: number) {
    return new MasterChannel(this.conn, this.state, 'v', channel);
  }

  /** Master actions */

  setFaderLevel(value: number) {
    const command = `SETD^m.mix^${value}`;
    this.conn.sendMessage(command);
  }

  setFaderLevelDB(dbValue: number) {
    this.setFaderLevel(DBToFaderValue(dbValue));
  }

  pan(value: number) {
    const command = `SETD^m.pan^${value}`;
    this.conn.sendMessage(command);
  }

  setDim(value: number) {
    const command = `SETD^m.dim^${value}`;
    this.conn.sendMessage(command);
  }

  dim() {
    this.setDim(1);
  }

  undim() {
    this.setDim(0);
  }

  toggleDim() {
    this.dim$.pipe(take(1)).subscribe(dim => this.setDim(dim ^ 1));
  }
}
