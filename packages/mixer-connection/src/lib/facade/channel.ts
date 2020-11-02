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

  /** Linear level of the channel (between `0` and `1`) */
  faderLevel$ = this.store.state$.pipe(
    select(
      selectFaderValue(this.channelType, this.channel, this.busType, this.bus)
    )
  );

  /** dB level of the channel (between `-Infinity` and `10`) */
  faderLevelDB$ = this.faderLevel$.pipe(map(v => faderValueToDB(v)));

  /** MUTE value of the channel (`0` or `1`) */
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

  /**
   * Set linear level of the channel fader
   * @param value value between `0` and `1`
   */
  setFaderLevel(value: number) {
    const command = `SETD^${this.fullChannelId}.${this.faderLevelCommand}^${value}`;
    this.conn.sendMessage(command);
  }

  /**
   * Set dB level of the channel fader
   * @param value value between `-Infinity` and `10`
   */
  setFaderLevelDB(dbValue: number) {
    this.setFaderLevel(DBToFaderValue(dbValue));
  }

  /**
   * Set MUTE value for the channel
   * @param value MUTE value `0` or `1`
   */
  setMute(value: number) {
    const command = `SETD^${this.fullChannelId}.mute^${value}`;
    this.conn.sendMessage(command);
  }

  /** Enable MUTE for the channel */
  mute() {
    this.setMute(1);
  }

  /** Disable MUTE for the channel */
  unmute() {
    this.setMute(0);
  }

  /** Toggle MUTE status for the channel */
  toggleMute() {
    this.mute$.pipe(take(1)).subscribe(mute => this.setMute(mute ^ 1));
  }
}
