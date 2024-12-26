import { filter, map, Observable, withLatestFrom } from 'rxjs';

import { FadeableChannel } from './interfaces';
import { SoundcraftUI } from '../soundcraft-ui';
import { channelToIndex, indexToChannel } from '../utils/channel-sync-mapping';
import { ChannelType } from '../types';

export class ChannelSync {
  private readonly defaultSyncId = 'SYNC_ID';

  constructor(private sui: SoundcraftUI) {}

  /**
   * Get index of the currently selected channel as an Observable stream, from left to right on the master bus.
   * @param syncId SYNC ID to use (default: 'SYNC_ID')
   * @returns
   */
  getSelectedChannelIndex(syncId?: string): Observable<number> {
    const finalSyncId = syncId || this.defaultSyncId;
    return this.sui.store.syncState$.pipe(
      map(syncState => syncState[finalSyncId]),
      filter(index => index !== undefined)
    );
  }

  /**
   * Get the currently selected channel object on the master bus as an Observable stream.
   * It emits `FadeableChannel` objects. Note that this interface does not contain all fields of a channel but only the subset that all fadeable objects share.
   * @param syncId SYNC ID to use (default: 'SYNC_ID')
   * @returns
   */
  getSelectedChannel(syncId?: string): Observable<FadeableChannel | null> {
    return this.getSelectedChannelIndex(syncId).pipe(
      withLatestFrom(this.sui.deviceInfo.model$),
      map(([index, model]) => indexToChannel(this.sui, model, index))
    );
  }

  /**
   * Select a channel by index. All clients with the same SYNC ID will select the same channel.
   * @param index Zero-based index of the channel to select, from left to right on the master bus
   * @param syncId SYNC ID to use (default: 'SYNC_ID')
   */
  selectChannelIndex(index: number, syncId?: string): void {
    const message = `BMSG^SYNC^${syncId || this.defaultSyncId}^${index}`;
    this.sui.conn.sendMessage(message);
  }

  /**
   * Select a channel by type and number. All clients with the same SYNC ID will select the same channel.
   * @param type Channel type (`i`, `l`, `p`, `f`, `s`, `a`, `v`, `master`)
   * @param num Channel number
   * @param syncId SYNC ID to use (default: 'SYNC_ID')
   *
   * @example
   * ```ts
   * // Select input 1
   * selectChannel('i', 1)
   *
   * // Select input 1 with SYNC ID 'mySyncId'
   * selectChannel('i', 1, 'mySyncId')
   *
   * // Select master
   * selectChannel('master')
   *
   * // Select master with SYNC ID 'mySyncId'
   * selectChannel('master', 'mySyncId')
   * ```
   */
  selectChannel(type: 'master', syncId?: string): void;
  selectChannel(type: ChannelType, num: number, syncId?: string): void;
  selectChannel(type: ChannelType | 'master', numOrSyncId?: number | string, syncId?: string) {
    const model = this.sui.deviceInfo.model;
    if (!model) {
      return;
    }

    // SIGNATURE #1: selectChannel(type: 'master', syncId?: string): void;
    // `numOrSyncId` is the optional SYNC ID
    // `syncId` is always undefined
    if (type === 'master' && typeof numOrSyncId !== 'number' && syncId === undefined) {
      const index = channelToIndex(model, 'master');
      if (index !== null) {
        this.selectChannelIndex(index, numOrSyncId);
        return;
      }
    }

    // SIGNATURE #2: selectChannel(type: ChannelType, num: number, syncId?: string): void;
    // `numOrSyncId` is the channel number
    // `syncId` is the optional SYNC ID
    if (type !== 'master' && typeof numOrSyncId === 'number') {
      const index = channelToIndex(model, type, numOrSyncId);
      if (index !== null) {
        this.selectChannelIndex(index, syncId);
        return;
      }
    }

    throw new Error('Invalid arguments or channel not found');
  }
}
