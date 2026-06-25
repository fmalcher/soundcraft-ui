import { take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectPost } from '../state/state-selectors';
import { BusType, ChannelType } from '../types';
import { Channel } from './channel';
import { constructSendChannelId } from './channel-id';

/**
 * Represents a channel on a send bus (AUX or FX).
 * Used as super class for Aux and Fx
 */
export class SendChannel extends Channel {
  protected override fullChannelId = constructSendChannelId(
    this.channelType,
    this.channel,
    this.busType,
    this.bus,
  );
  override faderLevelCommand = 'value';

  /** PRE/POST state of the channel (`false` for PRE, `true` for POST) */
  readonly post$ = this.store.state$.pipe(
    select(selectPost(this.channelType, this.channel, this.busType, this.bus)),
  );

  constructor(
    conn: MixerConnection,
    store: MixerStore,
    channelType: ChannelType,
    channel: number,
    busType: BusType,
    bus: number,
  ) {
    super(conn, store, channelType, channel, busType, bus);
    this.linkedChannelIds = [this.fullChannelId];
  }

  /**
   * Set PRE/POST state for the channel
   * @param value POST (`true`) or PRE (`false`)
   */
  setPost(value: boolean) {
    this.linkedChannelIds.forEach(cid => {
      this.conn.setdBool(`${cid}.post`, value);
    });
  }

  /** Set AUX channel to POST */
  post() {
    this.setPost(true);
  }

  /** Set AUX channel to PRE */
  pre() {
    this.setPost(false);
  }

  /** Toggle PRE/POST state of the channel */
  togglePost() {
    this.post$.pipe(take(1)).subscribe(post => this.setPost(!post));
  }
}
