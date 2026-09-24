import { map, take } from 'rxjs';

import { MixerConnection } from '../../mixer-connection';
import { MixerStore } from '../../state/mixer-store';
import { selectRawValue } from '../../state/state-selectors';
import { ChannelType } from '../../types';
import { EqBand } from './eq-band';
import { EqFilter } from './eq-filter';
import {
  assertEqBand,
  assertEqChannelType,
  assertLowPassChannelType,
  eqBypassPath,
} from './eq-utils';

/**
 * Represents the parametric EQ of a channel on the master bus:
 * four bands, a high-pass filter and (on input channels) a low-pass filter.
 * Available for input, line, player, FX and sub group channels.
 */
export class ChannelEq {
  private bands: EqBand[] = [];
  private lowPass?: EqFilter;

  /** Whether the EQ is switched on (the inverted bypass switch of the mixer) */
  readonly enabled$ = this.store.state$.pipe(
    selectRawValue<number>(eqBypassPath(this.channelId)),
    map(bypass => !bypass),
  );

  /** High-pass filter */
  readonly hpf = new EqFilter(this.conn, this.store, this.channelId, this.linkedChannelIds, 'hpf');

  /**
   * @param conn mixer connection
   * @param store mixer store
   * @param channelType type of the channel (`i`, `l`, `p`, `f` or `s`)
   * @param channelId channel ID in the state, e.g. `i.2`
   * @param linkedChannelIds IDs of this channel and its stereo-linked partner, read on every write
   */
  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
    private channelType: ChannelType,
    private channelId: string,
    private linkedChannelIds: () => string[],
  ) {
    assertEqChannelType(channelType);
  }

  /**
   * Low-pass filter (Ui24R only).
   * Only input channels have a low-pass filter, other channel types throw an error.
   */
  get lpf(): EqFilter {
    assertLowPassChannelType(this.channelType);
    if (!this.lowPass) {
      this.lowPass = new EqFilter(
        this.conn,
        this.store,
        this.channelId,
        this.linkedChannelIds,
        'lpf',
      );
    }
    return this.lowPass;
  }

  /**
   * Get an EQ band
   * @param band band number, between `1` and `4`
   */
  band(band: number): EqBand {
    assertEqBand(band);
    if (!this.bands[band]) {
      this.bands[band] = new EqBand(
        this.conn,
        this.store,
        this.channelId,
        this.linkedChannelIds,
        band,
      );
    }
    return this.bands[band];
  }

  /**
   * Switch the EQ on or off
   * @param value `true` to switch the EQ on, `false` to bypass it
   */
  setEnabled(value: boolean) {
    this.linkedChannelIds().forEach(cid => {
      this.conn.setdBool(eqBypassPath(cid), !value);
    });
  }

  /** Switch the EQ on */
  enable() {
    this.setEnabled(true);
  }

  /** Switch the EQ off (bypass) */
  disable() {
    this.setEnabled(false);
  }

  /** Toggle the EQ on/off */
  toggle() {
    this.enabled$.pipe(take(1)).subscribe(enabled => this.setEnabled(!enabled));
  }
}
