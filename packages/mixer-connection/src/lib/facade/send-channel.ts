import { take } from 'rxjs/operators';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectPost } from '../state/state-selectors';
import { TransitionRegistry } from '../transitions';
import { BusType, ChannelType } from '../types';
import { Channel } from './channel';

/**
 * Represents a channel on a send bus (AUX or FX).
 * Used as super class for Aux and Fx
 */
export class SendChannel extends Channel {
  faderLevelCommand = 'value';

  /** PRE/POST value of the channel (`1` (POST) or `0` (PRE)) */
  post$ = this.store.state$.pipe(
    select(selectPost(this.channelType, this.channel, this.busType, this.bus))
  );

  constructor(
    conn: MixerConnection,
    store: MixerStore,
    transitions: TransitionRegistry,
    channelType: ChannelType,
    channel: number,
    busType: BusType,
    bus: number
  ) {
    super(conn, store, transitions, channelType, channel, busType, bus);
    this.fullChannelId = `${this.fullChannelId}.${busType}.${bus - 1}`;
  }

  /**
   * Set PRE/POST value for the channel
   * @param value `1` (POST) or `0` (PRE)
   */
  setPost(value: number) {
    const command = `SETD^${this.fullChannelId}.post^${value}`;
    this.conn.sendMessage(command);
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
