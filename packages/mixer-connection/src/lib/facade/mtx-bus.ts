import { map } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectMatrix } from '../state/state-selectors';
import { AuxBus } from './aux-bus';
import { setMatrixMode } from './matrix-utils';
import { MtxBusChannel } from './mtx-bus-channel';
import { MtxMasterChannel } from './mtx-master-channel';

/**
 * Represents a matrix bus.
 * A matrix bus is an AUX bus that has been converted into a matrix.
 * Unlike a regular AUX bus, a matrix routes other buses (AUX buses, subgroups
 * and the master mix) to an AUX output. Matrix buses are only available on the Ui24R.
 *
 * The matrix output (level, name, mute, solo, delay) is controlled like an AUX
 * output via `conn.master.mtx(n)`.
 */
export class MtxBus {
  /** Whether this bus is currently configured as a matrix bus (Ui24R only) */
  isMatrix$ = this.store.state$.pipe(select(selectMatrix(this.bus)), map(Boolean));

  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
    private bus: number,
  ) {
    // lookup object in the store and use existing object if possible
    const storeId = 'mtxbus' + bus;
    const storedObject = this.store.objectStore.get<MtxBus>(storeId);
    if (storedObject) {
      return storedObject;
    } else {
      this.store.objectStore.set(storeId, this);
    }
  }

  /**
   * Get an AUX bus as a source on the matrix
   * @param channel AUX bus number
   */
  aux(channel: number) {
    return new MtxBusChannel(this.conn, this.store, 'a', channel, this.bus);
  }

  /**
   * Get a subgroup as a source on the matrix
   * @param channel Subgroup number
   */
  sub(channel: number) {
    return new MtxBusChannel(this.conn, this.store, 's', channel, this.bus);
  }

  /**
   * Get the master mix as a source on the matrix
   */
  master() {
    return new MtxMasterChannel(this.conn, this.store, this.bus);
  }

  /**
   * Switch this matrix bus to a regular AUX bus (Ui24R only).
   * When this bus is stereo-linked, the linked neighbour is switched as well.
   * @returns the AUX bus (`AuxBus`) for the same slot
   */
  switchToAux(): AuxBus {
    setMatrixMode(this.conn, this.store, this.bus, 0);
    return new AuxBus(this.conn, this.store, this.bus);
  }
}
