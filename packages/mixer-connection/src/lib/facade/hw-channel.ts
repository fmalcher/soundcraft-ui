import { map, switchMap, take } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectGain, selectPhantom } from '../state/state-selectors';
import { clamp, roundToThreeDecimals } from '../utils';
import {
  linearMappingRangeToValue,
  linearMappingValueToRange,
} from '../utils/value-converters/value-converters';
import { DeviceInfo } from './device-info';

/**
 * Represents a hardware input on the mixer
 */
export class HwChannel {
  protected fullChannelId = `hw.${this.channel - 1}`;

  /** Phantom power state of the channel */
  readonly phantom$ = this.deviceInfo.model$.pipe(
    switchMap(model => {
      switch (model) {
        case 'ui24':
          return this.store.state$.pipe(select(selectPhantom(this.channel, 'hw')));
        case 'ui16':
        case 'ui12':
          return this.store.state$.pipe(select(selectPhantom(this.channel, 'i')));
      }
    }),
  );

  /** Linear gain level of the channel (between `0` and `1`) */
  readonly gain$ = this.deviceInfo.model$.pipe(
    switchMap(model => {
      switch (model) {
        case 'ui24':
          return this.store.state$.pipe(select(selectGain(this.channel, 'hw')));
        case 'ui16':
        case 'ui12':
          return this.store.state$.pipe(select(selectGain(this.channel, 'i')));
      }
    }),
  );

  /** dB gain level of the channel */
  readonly gainDB$ = this.deviceInfo.model$.pipe(
    switchMap(model => {
      switch (model) {
        case 'ui24':
          // ui24 gain range: -6..57 dB
          return this.gain$.pipe(map(v => linearMappingValueToRange(v, -6, 57)));
        case 'ui16':
        case 'ui12':
          // ui12 and ui16 gain range: -40..50 dB
          return this.gain$.pipe(map(v => linearMappingValueToRange(v, -40, 50)));
      }
    }),
  );

  constructor(
    protected conn: MixerConnection,
    protected store: MixerStore,
    protected deviceInfo: DeviceInfo,
    protected channel: number,
  ) {
    // change full channel ID according to device model
    this.deviceInfo.model$.subscribe(model => {
      switch (model) {
        case 'ui24':
          this.fullChannelId = `hw.${this.channel - 1}`;
          return;
        case 'ui16':
        case 'ui12':
          this.fullChannelId = `i.${this.channel - 1}`;
          return;
      }
    });
  }

  /**
   * Set phantom power state for the channel
   * @param value phantom power state
   */
  setPhantom(value: boolean) {
    this.conn.setdBool(`${this.fullChannelId}.phantom`, value);
  }

  /** Switch ON phantom power for the channel */
  phantomOn() {
    this.setPhantom(true);
  }

  /** Switch OFF phantom power for the channel */
  phantomOff() {
    this.setPhantom(false);
  }

  /** Toggle phantom power for the channel */
  togglePhantom() {
    this.phantom$.pipe(take(1)).subscribe(phantomOn => this.setPhantom(!phantomOn));
  }

  /**
   * Set gain level (linear) for the channel
   * @param value value between `0` and `1`
   */
  setGain(value: number) {
    value = clamp(value, 0, 1);
    this.conn.setd(`${this.fullChannelId}.gain`, value);
  }

  /**
   * Change the gain value relatively by adding a given linear value
   * @param offset value to add to the current linear gain value
   */
  changeGain(offset: number) {
    this.gain$.pipe(take(1)).subscribe(v => this.setGain(roundToThreeDecimals(v + offset)));
  }

  /**
   * Set gain level (dB) for the channel
   * @param value value between `-6` and `57`
   */
  setGainDB(dbValue: number) {
    switch (this.deviceInfo.model) {
      case 'ui24':
        // ui24 gain range: -6..57 dB
        this.setGain(linearMappingRangeToValue(dbValue, -6, 57));
        return;
      case 'ui16':
      case 'ui12':
        // ui12 and ui16 gain range: -40..50 dB
        this.setGain(linearMappingRangeToValue(dbValue, -40, 50));
        return;
    }
  }

  /**
   * Change the gain value relatively by adding a given value
   * @param offsetDB value (dB) to add to the current value
   */
  changeGainDB(offsetDB: number) {
    this.gainDB$.pipe(take(1)).subscribe(v => this.setGainDB(v + offsetDB));
  }
}
