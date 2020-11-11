import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { FxChannel } from './fx-channel';

/**
 * Represents an FX bus
 */
export class FxBus {
  constructor(private conn: MixerConnection, private store: MixerStore, private bus: number) {}

  /**
   * Get input channel on the FX bus
   * @param channel Channel number
   */
  input(channel: number) {
    return new FxChannel(this.conn, this.store, 'i', channel, this.bus);
  }

  /**
   * Get line channel on the FX bus
   * @param channel Channel number
   */
  line(channel: number) {
    return new FxChannel(this.conn, this.store, 'l', channel, this.bus);
  }

  /**
   * Get player channel on the FX bus
   * @param channel Channel number
   */
  player(channel: number) {
    return new FxChannel(this.conn, this.store, 'p', channel, this.bus);
  }

  /**
   * Get sub group channel on the FX bus
   * @param channel Channel number
   */
  sub(channel: number) {
    return new FxChannel(this.conn, this.store, 's', channel, this.bus);
  }
}
