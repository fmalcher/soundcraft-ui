import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { FxChannel } from './fx-channel';

/**
 * Represents an FX bus
 */
export class Fx {
  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
    private bus: number
  ) {}

  input(channel: number) {
    return new FxChannel(this.conn, this.store, 'i', channel, this.bus);
  }

  line(channel: number) {
    return new FxChannel(this.conn, this.store, 'l', channel, this.bus);
  }

  player(channel: number) {
    return new FxChannel(this.conn, this.store, 'p', channel, this.bus);
  }

  sub(channel: number) {
    return new FxChannel(this.conn, this.store, 's', channel, this.bus);
  }
}
