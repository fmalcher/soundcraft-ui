import { combineLatest, map } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectRawValue, selectStereoIndex } from '../state/state-selectors';
import { ChannelType } from '../types';
import { getDefaultChannelName, getLinkedChannelNumber, sanitizeChannelName } from '../utils';
import { joinStatePath } from '../utils/state-utils';
import { constructMtxChannelId } from './channel-id';
import { MtxChannel } from './mtx-channel';

/**
 * Represents an AUX bus (`a`) or subgroup (`s`) source routed to a matrix bus.
 * For the master source use `MtxMasterChannel`.
 * Matrix buses are only available on the Ui24R.
 */
export class MtxBusChannel extends MtxChannel {
  // Channel name is only available directly in the channel, e.g. `a.1.name`.
  readonly name$ = this.store.state$.pipe(
    selectRawValue<string>(joinStatePath(this.channelType, this.channel - 1, 'name')),
    map(name => name || getDefaultChannelName(this.channelType, this.channel)),
  );

  constructor(
    conn: MixerConnection,
    store: MixerStore,
    private channelType: ChannelType,
    private channel: number,
    private bus: number,
  ) {
    super(conn, store, constructMtxChannelId(channelType, channel, bus));

    /**
     * create list of linked channels.
     * Just like for AUX buses this can be up to three channels:
     * - the direct neighbour source channel (only AUX sources can be stereo-linked)
     * - this channel on the stereo-linked matrix output (matrix outputs live in `a` slots)
     * - the neighbour source channel on the linked matrix output
     */
    const stereoIndex$ = store.state$.pipe(select(selectStereoIndex(channelType, channel)));
    combineLatest([store.state$.pipe(select(selectStereoIndex('a', bus))), stereoIndex$])
      .pipe(
        map(([mtxIndex, channelIndex]) => {
          const linkedMtxNo = getLinkedChannelNumber(bus, mtxIndex);
          const linkedChNo = getLinkedChannelNumber(channel, channelIndex);

          const allChannelIds = [this.fullChannelId]; // all linked channels on this matrix and on the linked matrix
          const mtxLinkChannelIds = [this.fullChannelId]; // this channel on the linked matrix output

          // add linked source channel on this matrix
          if (linkedChNo !== undefined) {
            allChannelIds.push(constructMtxChannelId(channelType, linkedChNo, bus));
          }

          // add this channel on linked matrix output
          if (linkedMtxNo !== undefined) {
            const cid = constructMtxChannelId(channelType, channel, linkedMtxNo);
            allChannelIds.push(cid);
            mtxLinkChannelIds.push(cid);
          }

          // add linked source channel on linked matrix output
          if (linkedMtxNo !== undefined && linkedChNo !== undefined) {
            allChannelIds.push(constructMtxChannelId(channelType, linkedChNo, linkedMtxNo));
          }
          return { allChannelIds, mtxLinkChannelIds };
        }),
      )
      .subscribe(result => {
        this.linkedChannelIds = result.allChannelIds;
        this.panLinkChannelIds = result.mtxLinkChannelIds;
      });
  }

  /** Set name of the matrix source channel (the underlying AUX bus or subgroup) */
  setName(name: string) {
    name = sanitizeChannelName(name);
    const path = joinStatePath(this.channelType, this.channel - 1, 'name');
    this.conn.sets(path, name);
  }
}
