import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { ChannelType } from '../types';
import { SendChannel } from './send-channel';

/**
 * Represents a channel on an AUX bus
 */
export class AuxChannel extends SendChannel {
  constructor(
    conn: MixerConnection,
    state: MixerStore,
    channelType: ChannelType,
    channel: number,
    bus: number
  ) {
    super(conn, state, channelType, channel, 'aux', bus);
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
