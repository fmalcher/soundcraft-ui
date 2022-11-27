import { take } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectPhantom } from '../state/state-selectors';

/**
 * Represents a hardware input on the mixer
 */
export class HwChannel {
  fullChannelId = `hw.${this.channel - 1}`;

  /** Phantom power state of the channel (`0` or `1`) */
  phantom$ = this.store.state$.pipe(select(selectPhantom(this.channel)));

  constructor(
    protected conn: MixerConnection,
    protected store: MixerStore,
    protected channel: number
  ) {
    // lookup channel in the store and use existing object if possible
    const storeId = 'hw' + channel;
    const storedChannel = this.store.channelStore.get<HwChannel>(storeId);
    if (storedChannel) {
      return storedChannel;
    } else {
      this.store.channelStore.set(storeId, this);
    }
  }

  /**
   * Set phantom power state for the channel
   * @param value `0` or `1`
   */
  setPhantom(value: number) {
    const command = `SETD^${this.fullChannelId}.phantom^${value}`;
    this.conn.sendMessage(command);
  }

  /** Switch ON phantom power for the channel */
  phantomOn() {
    this.setPhantom(1);
  }

  /** Switch OFF phantom power for the channel */
  phantomOff() {
    this.setPhantom(0);
  }

  /** Toggle phantom power for the channel */
  togglePhantom() {
    this.phantom$.pipe(take(1)).subscribe(phantomOn => this.setPhantom(phantomOn ^ 1));
  }
}
