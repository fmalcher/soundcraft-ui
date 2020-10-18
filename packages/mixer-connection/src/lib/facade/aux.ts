import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { AuxChannel } from './aux-channel';

/**
 * Represents an AUX bus
 */
export class Aux {
  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
    private bus: number
  ) {}

  input(channel: number) {
    return new AuxChannel(this.conn, this.store, 'i', channel, this.bus);
  }

  line(channel: number) {
    return new AuxChannel(this.conn, this.store, 'l', channel, this.bus);
  }

  player(channel: number) {
    return new AuxChannel(this.conn, this.store, 'p', channel, this.bus);
  }

  fx(channel: number) {
    return new AuxChannel(this.conn, this.store, 'a', channel, this.bus);
  }
}
