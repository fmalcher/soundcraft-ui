import { map, take } from 'rxjs/operators';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectFaderValue, selectMute } from '../state/state-selectors';
import { BusType, ChannelType } from '../types';
import { DBToFaderValue, faderValueToDB } from '../utils/value-converters';

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

  faderLevelDB$ = this.faderLevel$.pipe(map(v => faderValueToDB(v)));

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

  setFaderLevelDB(dbValue: number) {
    this.setFaderLevel(DBToFaderValue(dbValue));
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
