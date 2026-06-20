import { map } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectMatrix } from '../state/state-selectors';
import { AuxChannel } from './aux-channel';
import { setMatrixMode } from './matrix-utils';
import { MtxBus } from './mtx-bus';

/**
 * Represents an AUX bus
 */
export class AuxBus {
  /**
   * Whether this AUX bus is currently configured as a matrix bus (Ui24R only).
   * When `true`, this slot is a matrix and should be controlled through `conn.mtx(n)` instead.
   */
  isMatrix$ = this.store.state$.pipe(select(selectMatrix(this.bus)), map(Boolean));

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

  /**
   * Switch this AUX bus to a matrix bus (Ui24R only).
   * When this bus is stereo-linked, the linked neighbour is switched as well.
   * @returns the matrix bus (`MtxBus`) for the same slot
   */
  switchToMatrix(): MtxBus {
    setMatrixMode(this.conn, this.store, this.bus, 1);
    return new MtxBus(this.conn, this.store, this.bus);
  }
}
