import { take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectPost } from '../state/state-selectors';
import { BusType, ChannelType } from '../types';
import { Channel } from './channel';

/**
 * Represents a channel on a send bus (AUX or FX).
 * Used as super class for Aux and Fx
 */
export class SendChannel extends Channel {
  protected constructChannelId(
    channelType: ChannelType,
    channel: number,
    busType: BusType,
    bus: number
  ) {
    return `${channelType}.${channel - 1}.${busType}.${bus - 1}`;
  }

  override fullChannelId = this.constructChannelId(
    this.channelType,
    this.channel,
    this.busType,
    this.bus
  );
  override faderLevelCommand = 'value';

  /** PRE/POST value of the channel (`1` (POST) or `0` (PRE)) */
  post$ = this.store.state$.pipe(
    select(selectPost(this.channelType, this.channel, this.busType, this.bus))
  );

  constructor(
    conn: MixerConnection,
    store: MixerStore,
    channelType: ChannelType,
    channel: number,
    busType: BusType,
    bus: number
  ) {
    super(conn, store, channelType, channel, busType, bus);
  }

  /**
   * Set PRE/POST value for the channel
   * @param value `1` (POST) or `0` (PRE)
   */
  setPost(value: number) {
    [...this.linkedChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.post^${value}`;
      this.conn.sendMessage(command);
    });
  }

  /** Set AUX channel to POST */
  post() {
    this.setPost(1);
  }

  /** Set AUX channel to PRE */
  pre() {
    this.setPost(0);
  }

  /** Toggle PRE/POST status of the channel */
  togglePost() {
    this.post$.pipe(take(1)).subscribe(post => this.setPost(post ^ 1));
  }
}
