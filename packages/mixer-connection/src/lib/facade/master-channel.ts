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
  solo$ = this.store.state$.pipe(
    select(selectSolo(this.channelType, this.channel))
  );

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

  setPan(value: number) {
    const command = `SETD^${this.fullChannelId}.pan^${value}`;
    this.conn.sendMessage(command);
  }

  setSolo(value: number) {
    const command = `SETD^${this.fullChannelId}.solo^${value}`;
    this.conn.sendMessage(command);
  }

  solo() {
    this.setSolo(1);
  }

  unsolo() {
    this.setSolo(0);
  }

  toggleSolo() {
    this.solo$.pipe(take(1)).subscribe(solo => this.setSolo(solo ^ 1));
  }
}
