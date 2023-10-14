import { map, take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectPan, selectRawValue, selectSolo } from '../state/state-selectors';
import { ChannelType } from '../types';
import { clamp, getLinkedChannelNumber } from '../util';
import { Channel } from './channel';
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
  private constructChannelId(channelType: ChannelType, channel: number) {
    return `${channelType}.${channel - 1}`;
  }

  override fullChannelId = this.constructChannelId(this.channelType, this.channel);
  override faderLevelCommand = 'mix';

  /** SOLO value of the channel (`0` or `1`) */
  solo$ = this.store.state$.pipe(select(selectSolo(this.channelType, this.channel)));

  /** PAN value of the channel (between `0` and `1`) */
  pan$ = this.store.state$.pipe(
    select(selectPan(this.channelType, this.channel, this.busType, this.bus))
  );

  /** Assigned automix group (`a`, `b`, `none`) */
  automixGroup$ = this.store.state$.pipe(
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
    })
  );

  /** Automix weight (linear) for this channel (between `0` and `1`) */
  automixWeight$ = this.store.state$.pipe(selectRawValue<number>(`${this.fullChannelId}.amix`));

  /** Automix weight (dB) for this channel (between `-12` and `12` dB) */
  automixWeightDB$ = this.automixWeight$.pipe(map(v => linearMappingValueToRange(v, -12, 12)));

  constructor(conn: MixerConnection, store: MixerStore, channelType: ChannelType, channel: number) {
    super(conn, store, channelType, channel);

    // create list of channel IDs that are linked with this channel
    this.stereoIndex$
      .pipe(
        map(index => {
          const linkedChannelNumber = getLinkedChannelNumber(channel, index);
          if (linkedChannelNumber !== undefined) {
            return [this.constructChannelId(this.channelType, linkedChannelNumber)];
          } else {
            return [];
          }
        })
      )
      .subscribe(c => (this.linkedChannelIds = c));
  }

  /**
   * Set PAN value of the channel
   * @param value value between `0` and `1`
   */
  pan(value: number) {
    value = clamp(value, 0, 1);
    const command = `SETD^${this.fullChannelId}.pan^${value}`;
    this.conn.sendMessage(command);
  }

  /**
   * Set SOLO value for the channel
   * @param value SOLO value `0` or `1`
   */
  setSolo(value: number) {
    [...this.linkedChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.solo^${value}`;
      this.conn.sendMessage(command);
    });
  }

  /** Enable SOLO for the channel */
  solo() {
    this.setSolo(1);
  }

  /** Disable SOLO for the channel */
  unsolo() {
    this.setSolo(0);
  }

  /** Toggle SOLO status for the channel */
  toggleSolo() {
    this.solo$.pipe(take(1)).subscribe(solo => this.setSolo(solo ^ 1));
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

    [...this.linkedChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.amixgroup^${groupValue}`;
      this.conn.sendMessage(command);
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

    [...this.linkedChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.amix^${value}`;
      this.conn.sendMessage(command);
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
