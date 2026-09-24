import { Observable, map, take } from 'rxjs';

import { MixerConnection } from '../../mixer-connection';
import { MixerStore } from '../../state/mixer-store';
import { selectRawValue } from '../../state/state-selectors';
import { clamp } from '../../utils';
import {
  eqGainDBToFaderValue,
  faderValueToEqGainDB,
  faderValueToFrequency,
  faderValueToQ,
  frequencyToFaderValue,
  qToFaderValue,
} from '../../utils/value-converters/eq-converters';
import { EqBandParam, assertEqBand, eqBandPath } from './eq-utils';

/**
 * Represents one band (bell filter) of the parametric channel EQ
 */
export class EqBand {
  /** Center frequency of the band in Hz (between `20` and `22050`) */
  readonly frequency$ = this.selectParam('freq').pipe(map(v => faderValueToFrequency(v)));

  /** Bandwidth of the band as Q value (between `0.05` and `15`, higher values are narrower) */
  readonly q$ = this.selectParam('q').pipe(map(v => faderValueToQ(v)));

  /** Linear gain of the band (between `0` and `1`, `0.5` is 0 dB) */
  readonly gain$ = this.selectParam('gain');

  /** Gain of the band in dB (between `-20` and `20`) */
  readonly gainDB$ = this.gain$.pipe(map(v => faderValueToEqGainDB(v)));

  /**
   * @param conn mixer connection
   * @param store mixer store
   * @param channelId channel ID in the state, e.g. `i.2`
   * @param linkedChannelIds IDs of this channel and its stereo-linked partner, read on every write
   * @param band band number, between `1` and `4`
   */
  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
    private channelId: string,
    private linkedChannelIds: () => string[],
    readonly band: number,
  ) {
    assertEqBand(band);
  }

  /**
   * Set the center frequency of the band
   * @param hz frequency between `20` and `22050` Hz
   */
  setFrequency(hz: number) {
    this.setParam('freq', frequencyToFaderValue(hz));
  }

  /**
   * Set the bandwidth of the band
   * @param q Q value between `0.05` and `15` (higher values are narrower)
   */
  setQ(q: number) {
    this.setParam('q', qToFaderValue(q));
  }

  /**
   * Set the linear gain of the band
   * @param value value between `0` and `1` (`0.5` is 0 dB)
   */
  setGain(value: number) {
    this.setParam('gain', clamp(value, 0, 1));
  }

  /**
   * Set the gain of the band in dB
   * @param dbValue value between `-20` and `20`
   */
  setGainDB(dbValue: number) {
    this.setParam('gain', eqGainDBToFaderValue(dbValue));
  }

  /**
   * Change the gain of the band relatively by adding a given value
   * @param offsetDB value (dB) to add to the current value
   */
  changeGainDB(offsetDB: number) {
    this.gainDB$.pipe(take(1)).subscribe(v => this.setGainDB(v + offsetDB));
  }

  private selectParam(param: EqBandParam): Observable<number> {
    return this.store.state$.pipe(
      selectRawValue<number>(eqBandPath(this.channelId, this.band, param)),
    );
  }

  private setParam(param: EqBandParam, value: number) {
    this.linkedChannelIds().forEach(cid => {
      this.conn.setd(eqBandPath(cid, this.band, param), value);
    });
  }
}
