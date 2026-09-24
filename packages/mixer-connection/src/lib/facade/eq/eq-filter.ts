import { Observable, map } from 'rxjs';

import { MixerConnection } from '../../mixer-connection';
import { MixerStore } from '../../state/mixer-store';
import { selectRawValue } from '../../state/state-selectors';
import { clamp } from '../../utils';
import {
  faderValueToFrequency,
  frequencyToFaderValue,
} from '../../utils/value-converters/eq-converters';
import {
  EQ_FILTERS,
  EqFilterSlope,
  EqFilterType,
  eqFilterPath,
  slopeToValue,
  valueToSlope,
} from './eq-utils';

/**
 * Represents the high-pass or low-pass filter of the channel EQ.
 * A filter is switched off with a special raw frequency value:
 * `0` (20 Hz) for the high-pass filter, `1` (22050 Hz) for the low-pass filter.
 */
export class EqFilter {
  private range = EQ_FILTERS[this.type];

  /** Frequency of the filter in Hz (`20` for a switched off high-pass, `22050` for a switched off low-pass filter) */
  readonly frequency$ = this.selectParam('freq').pipe(map(v => faderValueToFrequency(v)));

  /** Whether the filter is switched on */
  readonly enabled$ = this.selectParam('freq').pipe(map(v => v !== this.range.offValue));

  /** Slope of the filter in dB/oct (`12`, `24` or `36`, Ui24R only) */
  readonly slope$ = this.selectParam('slope').pipe(map(v => valueToSlope(v)));

  /**
   * @param conn mixer connection
   * @param store mixer store
   * @param channelId channel ID in the state, e.g. `i.2`
   * @param linkedChannelIds IDs of this channel and its stereo-linked partner, read on every write
   * @param type `hpf` (high-pass) or `lpf` (low-pass)
   */
  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
    private channelId: string,
    private linkedChannelIds: () => string[],
    readonly type: EqFilterType,
  ) {}

  /**
   * Set the frequency of the filter and switch it on.
   * High-pass filter: between `20` and `1000` Hz (`20` switches it off).
   * Low-pass filter: between `1000` and `22050` Hz (`22050` switches it off).
   * @param hz frequency in Hz
   */
  setFrequency(hz: number) {
    const value = clamp(hz, this.range.minHz, this.range.maxHz);
    this.setParam('freq', frequencyToFaderValue(value));
  }

  /** Switch the filter off */
  disable() {
    this.setParam('freq', this.range.offValue);
  }

  /**
   * Set the slope of the filter (Ui24R only)
   * @param slope `12`, `24` or `36` dB/oct
   */
  setSlope(slope: EqFilterSlope) {
    this.setParam('slope', slopeToValue(slope));
  }

  private selectParam(param: 'freq' | 'slope'): Observable<number> {
    return this.store.state$.pipe(
      selectRawValue<number>(eqFilterPath(this.channelId, this.type, param)),
    );
  }

  private setParam(param: 'freq' | 'slope', value: number) {
    this.linkedChannelIds().forEach(cid => {
      this.conn.setd(eqFilterPath(cid, this.type, param), value);
    });
  }
}
