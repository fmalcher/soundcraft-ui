import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectMatrix } from '../state/state-selectors';
import { AuxChannel } from './aux-channel';
import { setMatrixMode } from './matrix-utils';
import { MtxBus } from './mtx-bus';
import { mtxBusStoreId } from './object-store-ids';

/**
 * Represents an AUX bus
 */
export class AuxBus {
  /**
   * Whether this AUX bus is currently configured as a matrix bus (Ui24R only).
   * When `true`, this slot is a matrix and should be controlled through `conn.mtx(n)` instead.
   */
  readonly isMatrix$ = this.store.state$.pipe(select(selectMatrix(this.bus)));

  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
    private bus: number,
  ) {}

  /**
   * Get input channel on the AUX bus
   * @param channel Channel number
   */
  input(channel: number) {
    return this.store.objectStore.getOrCreate(
      `aux${this.bus}i${channel}`,
      () => new AuxChannel(this.conn, this.store, 'i', channel, this.bus),
    );
  }

  /**
   * Get line channel on the AUX bus
   * @param channel Channel number
   */
  line(channel: number) {
    return this.store.objectStore.getOrCreate(
      `aux${this.bus}l${channel}`,
      () => new AuxChannel(this.conn, this.store, 'l', channel, this.bus),
    );
  }

  /**
   * Get player channel on the AUX bus
   * @param channel Channel number
   */
  player(channel: number) {
    return this.store.objectStore.getOrCreate(
      `aux${this.bus}p${channel}`,
      () => new AuxChannel(this.conn, this.store, 'p', channel, this.bus),
    );
  }

  /**
   * Get FX channel on the AUX bus
   * @param channel Channel number
   */
  fx(channel: number) {
    return this.store.objectStore.getOrCreate(
      `aux${this.bus}f${channel}`,
      () => new AuxChannel(this.conn, this.store, 'f', channel, this.bus),
    );
  }

  /**
   * Switch this AUX bus to a matrix bus (Ui24R only).
   * When this bus is stereo-linked, the linked neighbour is switched as well.
   * @returns the matrix bus (`MtxBus`) for the same slot
   */
  switchToMatrix(): MtxBus {
    setMatrixMode(this.conn, this.store, this.bus, true);
    return this.store.objectStore.getOrCreate(
      mtxBusStoreId(this.bus),
      () => new MtxBus(this.conn, this.store, this.bus),
    );
  }
}
