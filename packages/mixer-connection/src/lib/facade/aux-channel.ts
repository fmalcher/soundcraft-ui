import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectPan } from '../state/state-selectors';
import { TransitionRegistry } from '../transitions';
import { ChannelType } from '../types';
import { PannableChannel } from './interfaces';
import { SendChannel } from './send-channel';

/**
 * Represents a channel on an AUX bus
 */
export class AuxChannel extends SendChannel implements PannableChannel {
  /** PAN value of the AUX channel (between `0` and `1`) */
  pan$ = this.store.state$.pipe(
    select(selectPan(this.channelType, this.channel, this.busType, this.bus))
  );

  constructor(
    conn: MixerConnection,
    store: MixerStore,
    transitions: TransitionRegistry,
    channelType: ChannelType,
    channel: number,
    bus: number
  ) {
    super(conn, store, transitions, channelType, channel, 'aux', bus);
  }

  /**
   * Set PAN value of the AUX channel.
   * This only works for stereo-linked AUX buses, not for mono AUX.
   * @param value value between `0` and `1`
   */
  pan(value: number) {
    const command = `SETD^${this.fullChannelId}.pan^${value}`;
    this.conn.sendMessage(command);
  }

  /**
   * Set PRE/POST PROC value for the AUX channel
   * @param value `1` (POST PROC) or `0` (PRE PROC)
   */
  setPostProc(value: number) {
    const command = `SETD^${this.fullChannelId}.postproc^${value}`;
    this.conn.sendMessage(command);
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
