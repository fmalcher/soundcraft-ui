import { map, take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import {
  select,
  selectBoolean,
  selectPan,
  selectRawValue,
  selectSolo,
} from '../state/state-selectors';
import { ChannelType } from '../types';
import { clamp, getLinkedChannelNumber, roundToThreeDecimals } from '../utils';
import { Channel } from './channel';
import { constructMasterChannelId } from './channel-id';
import { PannableChannel } from './interfaces';
import { AutomixGroupId } from './automix-controller';
import {
  linearMappingRangeToValue,
  linearMappingValueToRange,
} from '../utils/value-converters/value-converters';

/**
 * Represents a channel on the master bus
 */
export class MasterChannel extends Channel implements PannableChannel {
  protected override fullChannelId = constructMasterChannelId(this.channelType, this.channel);
  override faderLevelCommand = 'mix';

  /** SOLO state of the channel */
  readonly solo$ = this.store.state$.pipe(select(selectSolo(this.channelType, this.channel)));

  /** PAN value of the channel (between `0` and `1`) */
  readonly pan$ = this.store.state$.pipe(
    select(selectPan(this.channelType, this.channel, this.busType, this.bus)),
  );

  /** Assigned automix group (`a`, `b`, `none`) */
  readonly automixGroup$ = this.store.state$.pipe(
    selectRawValue<number>(`${this.fullChannelId}.amixgroup`),
    map((groupId): AutomixGroupId | 'none' => {
      switch (groupId) {
        case 0:
          return 'a';
        case 1:
          return 'b';
        default:
          return 'none';
      }
    }),
  );

  /** Automix weight (linear) for this channel (between `0` and `1`) */
  readonly automixWeight$ = this.store.state$.pipe(
    selectRawValue<number>(`${this.fullChannelId}.amix`),
  );

  /** Automix weight (dB) for this channel (between `-12` and `12` dB) */
  readonly automixWeightDB$ = this.automixWeight$.pipe(
    map(v => linearMappingValueToRange(v, -12, 12)),
  );

  /** Multitrack selection state for the channel */
  readonly multiTrackSelected$ = this.store.state$.pipe(
    selectBoolean(`${this.fullChannelId}.mtkrec`),
  );

  constructor(conn: MixerConnection, store: MixerStore, channelType: ChannelType, channel: number) {
    super(conn, store, channelType, channel);
    this.linkedChannelIds = [this.fullChannelId];

    // create list of channel IDs that are linked with this channel
    this.stereoIndex$
      .pipe(
        map(index => {
          const linkedChannelNumber = getLinkedChannelNumber(channel, index);
          if (linkedChannelNumber !== undefined) {
            return [
              this.fullChannelId,
              constructMasterChannelId(this.channelType, linkedChannelNumber),
            ];
          } else {
            return [this.fullChannelId];
          }
        }),
      )
      .subscribe(c => (this.linkedChannelIds = c));
  }

  /**
   * Set PAN value of the channel
   * @param value value between `0` and `1`
   */
  setPan(value: number) {
    value = clamp(value, 0, 1);
    value = roundToThreeDecimals(value);
    this.conn.setd(`${this.fullChannelId}.pan`, value);
  }

  /**
   * Relatively change PAN value of the channel
   * @param offset offset to change (final values are between `0` and `1`)
   */
  changePan(offset: number) {
    this.pan$.pipe(take(1)).subscribe(v => this.setPan(v + offset));
  }

  /**
   * Set SOLO state for the channel
   * @param value SOLO state
   */
  setSolo(value: boolean) {
    this.linkedChannelIds.forEach(cid => {
      this.conn.setdBool(`${cid}.solo`, value);
    });
  }

  /** Enable SOLO for the channel */
  solo() {
    this.setSolo(true);
  }

  /** Disable SOLO for the channel */
  unsolo() {
    this.setSolo(false);
  }

  /** Toggle SOLO state for the channel */
  toggleSolo() {
    this.solo$.pipe(take(1)).subscribe(solo => this.setSolo(!solo));
  }

  private multiTrackAssertChannelType() {
    if (this.channelType !== 'i' && this.channelType !== 'l') {
      throw new Error('Multitrack recording can only be used with input and line channels');
    }
  }

  private multiTrackSetSelection(value: boolean) {
    this.multiTrackAssertChannelType();

    this.conn.setdBool(`${this.fullChannelId}.mtkrec`, value);
  }

  /** Select this channel for multitrack recording */
  multiTrackSelect() {
    this.multiTrackSetSelection(true);
  }

  /** Remove this channel from multitrack recording */
  multiTrackUnselect() {
    this.multiTrackSetSelection(false);
  }

  /** Toggle multitrack recording for this channel */
  multiTrackToggle() {
    this.multiTrackAssertChannelType();
    this.multiTrackSelected$
      .pipe(take(1))
      .subscribe(selected => this.multiTrackSetSelection(!selected));
  }

  /** Assign this channel to an automix group. This also includes stereo-linked channels.
   * @param group `a` or `b` for automix groups. `none` to remove from all groups.
   */
  automixAssignGroup(group: AutomixGroupId | 'none') {
    if (this.channelType !== 'i') {
      throw new Error('Automix can only be used with input channels');
    }

    let groupValue = -1;
    switch (group) {
      case 'a':
        groupValue = 0;
        break;
      case 'b':
        groupValue = 1;
        break;
      case 'none':
        groupValue = -1;
        break;
    }

    this.linkedChannelIds.forEach(cid => {
      this.conn.setd(`${cid}.amixgroup`, groupValue);
    });
  }

  /** Remove this channel from the automix group */
  automixRemove() {
    this.automixAssignGroup('none');
  }

  /**
   * Set automix weight (linear) for the channel
   * @param value value between `0` and `1`
   */
  automixSetWeight(value: number) {
    value = clamp(value, 0, 1);

    this.linkedChannelIds.forEach(cid => {
      this.conn.setd(`${cid}.amix`, value);
    });
  }

  /**
   * Set automix weight (dB) for the channel
   * @param value value between `-12` and `12`
   */
  automixSetWeightDB(dbValue: number) {
    this.automixSetWeight(linearMappingRangeToValue(dbValue, -12, 12));
  }

  /**
   * Change the automix weight relatively by adding a given value
   * @param offsetDB value (dB) to add to the current value
   */
  automixChangeWeightDB(offsetDB: number) {
    this.automixWeightDB$.pipe(take(1)).subscribe(v => this.automixSetWeightDB(v + offsetDB));
  }
}
