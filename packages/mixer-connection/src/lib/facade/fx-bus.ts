import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectFxBpm, selectFxType } from '../state/state-selectors';
import { clamp } from '../utils';
import { FxChannel } from './fx-channel';

/**
 * Represents an FX bus
 */
export class FxBus {
  /**
   * Selected FX type (Reverb, Delay, Chorus, Room).
   * The numeric value can be matched using the `FxType` enum.
   */
  fxType$ = this.store.state$.pipe(select(selectFxType(this.bus)));

  /**
   * BPM value of this FX.
   * This setting is always present but might not be actually used if the selected FX does not have a BPM setting.
   */
  bpm$ = this.store.state$.pipe(select(selectFxBpm(this.bus)));

  constructor(private conn: MixerConnection, private store: MixerStore, private bus: number) {
    // lookup object in the store and use existing object if possible
    const storeId = 'fxbus' + bus;
    const storedObject = this.store.objectStore.get<FxBus>(storeId);
    if (storedObject) {
      return storedObject;
    } else {
      this.store.objectStore.set(storeId, this);
    }
  }

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

  /**
   * Set BPM value of this FX (between `20` and `400`)
   * This setting is always present but might not be actually used if the selected FX does not have a BPM setting.
   */
  setBpm(value: number) {
    value = clamp(value, 20, 400);
    value = Math.round(value); // make integer

    this.conn.sendMessage(`SETD^f.${this.bus - 1}.bpm^${value}`);
  }
}
