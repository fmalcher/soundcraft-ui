import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectPost } from '../state/state-selectors';
import { BusType, ChannelType } from '../types';
import { Channel } from './channel';

/**
 * Represents a channel on a send bus (AUX or FX).
 * Used as super class for Aux and Fx
 */
export class SendChannel extends Channel {
  post$ = this.store.state$.pipe(
    select(selectPost(this.channelType, this.channel, this.busType, this.bus))
  );

  constructor(
    conn: MixerConnection,
    state: MixerStore,
    channelType: ChannelType,
    channel: number,
    busType: BusType,
    bus: number
  ) {
    super(conn, state, channelType, channel, busType, bus);
    this.fullChannelId = `${this.fullChannelId}.${busType}.${bus - 1}`;
  }

  setPost(value: number) {
    const command = `SETD^${this.fullChannelId}.post^${value}`;
    this.conn.sendMessage(command);
  }

  post() {
    this.setPost(1);
  }

  pre() {
    this.setPost(0);
  }
}
