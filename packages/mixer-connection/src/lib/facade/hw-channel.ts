import { map, take } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectGain, selectPhantom } from '../state/state-selectors';
import { clamp } from '../util';
import { DBToGainValue, gainValueToDB } from '../utils/value-converters/value-converters';

/**
 * Represents a hardware input on the mixer
 */
export class HwChannel {
  fullChannelId = `hw.${this.channel - 1}`;

  /** Phantom power state of the channel (`0` or `1`) */
  phantom$ = this.store.state$.pipe(select(selectPhantom(this.channel)));

  /** Linear gain level of the channel (between `0` and `1`) */
  gain$ = this.store.state$.pipe(select(selectGain(this.channel)));

  /** dB gain level of the channel (between `-6` and `57`) */
  gainDB$ = this.gain$.pipe(map(v => gainValueToDB(v)));

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

  /**
   * Set gain level (linear) for the channel
   * @param value value between `0` and `1`
   */
  setGain(value: number) {
    value = clamp(value, 0, 1);
    const command = `SETD^${this.fullChannelId}.gain^${value}`;
    this.conn.sendMessage(command);
  }

  /**
   * Set gain level (dB) for the channel
   * @param value value between `-6` and `57`
   */
  setGainDB(dbValue: number) {
    this.setGain(DBToGainValue(dbValue));
  }

  /**
   * Change the gain value relatively by adding a given value
   * @param offsetDB value (dB) to add to the current value
   */
  changeGainDB(offsetDB: number) {
    this.gainDB$.pipe(take(1)).subscribe(v => this.setGainDB(v + offsetDB));
  }
}
