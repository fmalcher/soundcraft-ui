import { take } from 'rxjs/operators';
import { MixerConnection } from './mixer-connection';
import { MixerStore } from './mixer-store';
import { BusType, ChannelType } from './types';

export class Channel {
  private busIdentifier: string;

  constructor(
    private conn: MixerConnection,
    private state: MixerStore,
    private channelType: ChannelType,
    private channel: number,
    private busType: BusType = 'master',
    private bus: number = 0
  ) {
    if (busType === 'aux' || busType == 'fx') {
      this.busIdentifier = `${busType}.${bus}`;
    }
  }

  private setMute(value: number) {
    const command = `SETD^${this.channelType}.${
      this.channel - 1
    }.mute^${value}`;
    this.conn.sendMessage(command);
  }

  mute() {
    this.setMute(1);
  }

  unmute() {
    this.setMute(0);
  }

  toggleMute() {
    this.state
      .getMute(this.channelType, this.channel, this.busType, this.bus)
      .pipe(take(1))
      .subscribe(mute => this.setMute((mute + 1) % 2));
  }
}
