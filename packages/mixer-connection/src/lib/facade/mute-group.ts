import { map, take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { selectRawValue } from '../state/state-selectors';
import { clearBit, getValueOfBit, setBit, toggleBit } from '../utils/bitmask';

export type MuteGroupID = number | 'all' | 'fx';

function groupIDToIndex(id: MuteGroupID): number {
  switch (id) {
    case 'all':
      return 23;
    case 'fx':
      return 22;
    default:
      return id - 1;
  }
}

/**
 * Represents a MUTE group and related mute groupings like "MUTE ALL" and "MUTE FX"
 */
export class MuteGroup {
  private groupIndex: number;

  constructor(private conn: MixerConnection, private store: MixerStore, readonly id: MuteGroupID) {
    this.groupIndex = groupIDToIndex(id);
  }

  private mgMask$ = this.store.state$.pipe(selectRawValue<number>('mgmask'));

  /** MUTE state of the group (`0` or `1`) */
  state$ = this.mgMask$.pipe(map(value => getValueOfBit(value, this.groupIndex)));

  /** Mute the MUTE group */
  mute() {
    this.mgMask$.pipe(take(1)).subscribe(mask => this.setMgMask(setBit(mask, this.groupIndex)));
  }

  /** Unmute the MUTE group */
  unmute() {
    this.mgMask$.pipe(take(1)).subscribe(mask => this.setMgMask(clearBit(mask, this.groupIndex)));
  }

  /** Toggle the MUTE group */
  toggle() {
    this.mgMask$.pipe(take(1)).subscribe(mask => this.setMgMask(toggleBit(mask, this.groupIndex)));
  }

  private setMgMask(mask: number) {
    const command = `SETD^mgmask^${mask}`;
    this.conn.sendMessage(command);
  }
}
