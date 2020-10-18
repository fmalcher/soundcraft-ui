import { take } from 'rxjs/operators';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import {
  select,
  selectFaderValue,
  selectMute,
  selectPan,
} from '../state/state-selectors';
import { BusType, ChannelType } from '../types';

/**
 * Represents a single channel with a fader
 */
export class Channel {
  protected fullChannelId = `${this.channelType}.${this.channel - 1}`;
  protected faderLevelCommand = 'mix';

  faderLevel$ = this.store.state$.pipe(
    select(
      selectFaderValue(this.channelType, this.channel, this.busType, this.bus)
    )
  );

  pan$ = this.store.state$.pipe(
    select(selectPan(this.channelType, this.channel, this.busType, this.bus))
  );

  mute$ = this.store.state$.pipe(
    select(selectMute(this.channelType, this.channel, this.busType, this.bus))
  );

  constructor(
    protected conn: MixerConnection,
    protected store: MixerStore,
    protected channelType: ChannelType,
    protected channel: number,
    protected busType: BusType = 'master',
    protected bus: number = 0
  ) {}

  setFaderLevel(value: number) {
    const command = `SETD^${this.fullChannelId}.${this.faderLevelCommand}^${value}`;
    this.conn.sendMessage(command);
  }

  setMute(value: number) {
    const command = `SETD^${this.fullChannelId}.mute^${value}`;
    this.conn.sendMessage(command);
  }

  mute() {
    this.setMute(1);
  }

  unmute() {
    this.setMute(0);
  }

  toggleMute() {
    this.mute$.pipe(take(1)).subscribe(mute => this.setMute(mute ^ 1));
  }
}
