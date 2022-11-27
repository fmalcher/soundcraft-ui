import { map } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { ChannelType } from '../types';
import { getLinkedChannelNumber } from '../util';
import { SendChannel } from './send-channel';

/**
 * Represents a channel on an FX bus
 */
export class FxChannel extends SendChannel {
  constructor(
    conn: MixerConnection,
    store: MixerStore,
    channelType: ChannelType,
    channel: number,
    bus: number
  ) {
    super(conn, store, channelType, channel, 'fx', bus);

    // create list of channel IDs that are linked with this channel
    this.stereoIndex$
      .pipe(
        map(index => {
          const linkedChannelNumber = getLinkedChannelNumber(channel, index);
          if (linkedChannelNumber !== undefined) {
            return [
              this.constructChannelId(
                this.channelType,
                linkedChannelNumber,
                this.busType,
                this.bus
              ),
            ];
          } else {
            return [];
          }
        })
      )
      .subscribe(c => (this.linkedChannelIds = c));
  }
}
