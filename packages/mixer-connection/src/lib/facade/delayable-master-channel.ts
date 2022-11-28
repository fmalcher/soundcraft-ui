import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectDelayValue } from '../state/state-selectors';
import { ChannelType } from '../types';
import { sanitizeDelayValue } from '../utils/value-converters/value-converters';
import { MasterChannel } from './master-channel';

/**
 * Represents a channel on the master bus that can be delayed (input, line and aux)
 */
export class DelayableMasterChannel extends MasterChannel {
  /** Delay value of the channel (between `0` and `500` ms) */
  delay$ = this.store.state$.pipe(select(selectDelayValue(this.channelType, this.channel)));

  /** default delay value (ms) for input channels */
  private delayMaxValueMs = 250;

  constructor(conn: MixerConnection, store: MixerStore, channelType: ChannelType, channel: number) {
    super(conn, store, channelType, channel);

    // AUX master channels can be delayed by 500 ms, input channels just allow 250 ms
    if (channelType === 'a') {
      this.delayMaxValueMs = 500;
    }
  }

  /**
   * Set delay of the channel in millseconds.
   * Input channels allow a maximum of 250 ms, AUX master channels can be delayed by 500 ms.
   * @param ms delay in milliseconds
   */
  setDelay(ms: number) {
    const value = sanitizeDelayValue(ms, this.delayMaxValueMs);

    const command = `SETD^${this.fullChannelId}.delay^${value}`;
    this.conn.sendMessage(command);
  }
}
