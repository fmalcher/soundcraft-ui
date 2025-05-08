import { combineLatest, map, take } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectPan, selectStereoIndex } from '../state/state-selectors';
import { ChannelType } from '../types';
import { clamp, getLinkedChannelNumber, roundToThreeDecimals } from '../utils';
import { PannableChannel } from './interfaces';
import { SendChannel } from './send-channel';

/**
 * Represents a channel on an AUX bus
 */
export class AuxChannel extends SendChannel implements PannableChannel {
  /** when the AUX bus is stereo-linked, this contains the ID of this channel on the linked bus */
  private auxLinkChannelIds: string[] = [];

  /** PAN value of the AUX channel (between `0` and `1`) */
  pan$ = this.store.state$.pipe(
    select(selectPan(this.channelType, this.channel, this.busType, this.bus))
  );

  constructor(
    conn: MixerConnection,
    store: MixerStore,
    channelType: ChannelType,
    channel: number,
    bus: number
  ) {
    super(conn, store, channelType, channel, 'aux', bus);

    /**
     * create list of linked channels.
     * this is relatively complex because it can be up to three channels:
     * - the direct neighbour channel on this bus
     * - the corresponding channels on the stereo-linked AUX bus
     */
    combineLatest([this.store.state$.pipe(select(selectStereoIndex('a', bus))), this.stereoIndex$])
      .pipe(
        map(([auxIndex, channelIndex]) => {
          const linkedAuxNo = getLinkedChannelNumber(bus, auxIndex);
          const linkedChNo = getLinkedChannelNumber(channel, channelIndex);

          const allChannelIds = []; // all linked channels on this bus and on the linked bus
          const auxLinkChannelIds = []; // this channel on the linked bus

          // add linked channel on this bus
          if (linkedChNo !== undefined) {
            allChannelIds.push(this.constructChannelId(channelType, linkedChNo, this.busType, bus));
          }

          // add this channel on linked AUX bus
          if (linkedAuxNo !== undefined) {
            const cid = this.constructChannelId(channelType, channel, this.busType, linkedAuxNo);
            allChannelIds.push(cid);
            auxLinkChannelIds.push(cid);
          }

          // add linked channel on linked AUX bus
          if (linkedAuxNo !== undefined && linkedChNo !== undefined) {
            allChannelIds.push(
              this.constructChannelId(channelType, linkedChNo, this.busType, linkedAuxNo)
            );
          }
          return { allChannelIds, auxLinkChannelIds };
        })
      )
      .subscribe(result => {
        this.linkedChannelIds = result.allChannelIds;
        this.auxLinkChannelIds = result.auxLinkChannelIds;
      });
  }

  /**
   * Set PAN value of the AUX channel.
   * This only works for stereo-linked AUX buses, not for mono AUX.
   * @param value value between `0` and `1`
   */
  setPan(value: number) {
    value = clamp(value, 0, 1);
    value = roundToThreeDecimals(value);
    [...this.auxLinkChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.pan^${value}`;
      this.conn.sendMessage(command);
    });
  }

  /**
   * Relatively change PAN value of the AUX channel.
   * This only works for stereo-linked AUX buses, not for mono AUX.
   * @param offset offset to change (final values are between `0` and `1`)
   */
  changePan(offset: number) {
    this.pan$.pipe(take(1)).subscribe(v => this.setPan(v + offset));
  }

  /**
   * Set PRE/POST PROC value for the AUX channel
   * @param value `1` (POST PROC) or `0` (PRE PROC)
   */
  setPostProc(value: number) {
    [...this.linkedChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.postproc^${value}`;
      this.conn.sendMessage(command);
    });
  }

  /** Set AUX channel to POST PROC */
  postProc() {
    this.setPostProc(1);
  }

  /** Set AUX channel to PRE PROC */
  preProc() {
    this.setPostProc(0);
  }
}
