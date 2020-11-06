import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { TransitionRegistry } from '../transitions';
import { ChannelType } from '../types';
import { SendChannel } from './send-channel';

/**
 * Represents a channel on an FX bus
 */
export class FxChannel extends SendChannel {
  constructor(
    conn: MixerConnection,
    store: MixerStore,
    transitions: TransitionRegistry,
    channelType: ChannelType,
    channel: number,
    bus: number
  ) {
    super(conn, store, transitions, channelType, channel, 'fx', bus);
  }
}
