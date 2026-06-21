import { map } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectMatrix } from '../state/state-selectors';
import { AuxBus } from './aux-bus';
import { setMatrixMode } from './matrix-utils';
import { MtxBusChannel } from './mtx-bus-channel';
import { MtxMasterChannel } from './mtx-master-channel';
import { auxBusStoreId } from './object-store-ids';

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
  ) {}

  /**
   * Get an AUX bus as a source on the matrix
   * @param channel AUX bus number
   */
  aux(channel: number) {
    return this.store.objectStore.getOrCreate(
      `mtx${this.bus}a${channel}`,
      () => new MtxBusChannel(this.conn, this.store, 'a', channel, this.bus),
    );
  }

  /**
   * Get a subgroup as a source on the matrix
   * @param channel Subgroup number
   */
  sub(channel: number) {
    return this.store.objectStore.getOrCreate(
      `mtx${this.bus}s${channel}`,
      () => new MtxBusChannel(this.conn, this.store, 's', channel, this.bus),
    );
  }

  /**
   * Get the master mix as a source on the matrix
   */
  master() {
    return this.store.objectStore.getOrCreate(
      `mtxmaster${this.bus}`,
      () => new MtxMasterChannel(this.conn, this.store, this.bus),
    );
  }

  /**
   * Switch this matrix bus to a regular AUX bus (Ui24R only).
   * When this bus is stereo-linked, the linked neighbour is switched as well.
   * @returns the AUX bus (`AuxBus`) for the same slot
   */
  switchToAux(): AuxBus {
    setMatrixMode(this.conn, this.store, this.bus, 0);
    return this.store.objectStore.getOrCreate(
      auxBusStoreId(this.bus),
      () => new AuxBus(this.conn, this.store, this.bus),
    );
  }
}
