import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectPan } from '../state/state-selectors';
import { ChannelType } from '../types';
import { SendChannel } from './send-channel';

/**
 * Represents a channel on an AUX bus
 */
export class AuxChannel extends SendChannel {
  pan$ = this.store.state$.pipe(
    select(selectPan(this.channelType, this.channel, this.busType, this.bus))
  );

  constructor(
    conn: MixerConnection,
    store: MixerStore,
    channelType: ChannelType,
    channel: number,
    bus: number
  ) {
    super(conn, store, channelType, channel, 'aux', bus);
  }

  setPan(value: number) {
    const command = `SETD^${this.fullChannelId}.pan^${value}`;
    this.conn.sendMessage(command);
  }

  setPostproc(value: number) {
    const command = `SETD^${this.fullChannelId}.postproc^${value}`;
    this.conn.sendMessage(command);
  }

  postproc() {
    this.setPostproc(1);
  }

  preproc() {
    this.setPostproc(0);
  }
}
