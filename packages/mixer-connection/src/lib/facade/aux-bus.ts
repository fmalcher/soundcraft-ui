import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { AuxChannel } from './aux-channel';

/**
 * Represents an AUX bus
 */
export class AuxBus {
  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
    private bus: number,
  ) {
    // lookup object in the store and use existing object if possible
    const storeId = 'auxbus' + bus;
    const storedObject = this.store.objectStore.get<AuxBus>(storeId);
    if (storedObject) {
      return storedObject;
    } else {
      this.store.objectStore.set(storeId, this);
    }
  }

  /**
   * Get input channel on the AUX bus
   * @param channel Channel number
   */
  input(channel: number) {
    return new AuxChannel(this.conn, this.store, 'i', channel, this.bus);
  }

  /**
   * Get line channel on the AUX bus
   * @param channel Channel number
   */
  line(channel: number) {
    return new AuxChannel(this.conn, this.store, 'l', channel, this.bus);
  }

  /**
   * Get player channel on the AUX bus
   * @param channel Channel number
   */
  player(channel: number) {
    return new AuxChannel(this.conn, this.store, 'p', channel, this.bus);
  }

  /**
   * Get FX channel on the AUX bus
   * @param channel Channel number
   */
  fx(channel: number) {
    return new AuxChannel(this.conn, this.store, 'f', channel, this.bus);
  }
}
