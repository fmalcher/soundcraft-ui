import { take } from 'rxjs/operators';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectPan, selectSolo } from '../state/state-selectors';
import { ChannelType } from '../types';
import { Channel } from './channel';

/**
 * Represents a channel on the master bus
 */
export class MasterChannel extends Channel {
  /** SOLO value of the channel (`0` or `1`) */
  solo$ = this.store.state$.pipe(
    select(selectSolo(this.channelType, this.channel))
  );

  /** PAN value of the channel (between `0` and `1`) */
  pan$ = this.store.state$.pipe(
    select(selectPan(this.channelType, this.channel, this.busType, this.bus))
  );

  constructor(
    conn: MixerConnection,
    store: MixerStore,
    channelType: ChannelType,
    channel: number
  ) {
    super(conn, store, channelType, channel);
  }

  /**
   * Set PAN value of the channel
   * @param value value between `0` and `1`
   */
  pan(value: number) {
    const command = `SETD^${this.fullChannelId}.pan^${value}`;
    this.conn.sendMessage(command);
  }

  /**
   * Set SOLO value for the channel
   * @param value SOLO value `0` or `1`
   */
  setSolo(value: number) {
    const command = `SETD^${this.fullChannelId}.solo^${value}`;
    this.conn.sendMessage(command);
  }

  /** Enable SOLO for the channel */
  solo() {
    this.setSolo(1);
  }

  /** Disable SOLO for the channel */
  unsolo() {
    this.setSolo(0);
  }

  /** Toggle SOLO status for the channel */
  toggleSolo() {
    this.solo$.pipe(take(1)).subscribe(solo => this.setSolo(solo ^ 1));
  }
}
