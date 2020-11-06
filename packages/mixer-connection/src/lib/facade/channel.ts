import { map, take } from 'rxjs/operators';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectFaderValue, selectMute } from '../state/state-selectors';
import { TransitionRegistry } from '../transitions';
import { BusType, ChannelType } from '../types';
import { Easings } from '../utils/transitions/easings';
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
    protected transitions: TransitionRegistry,
    protected channelType: ChannelType,
    protected channel: number,
    protected busType: BusType = 'master',
    protected bus: number = 0
  ) {}

  /**
   * Perform fader transition to linear value
   * @param targetValue Target value as linear value (between 0 and 1)
   * @param fadeTime Fade time in ms
   * @param easing Easing characteristic, as an entry of the `Easings` enum. Defaults to `Linear`
   * @param fps Frames per second, defaults to 25
   */
  fadeTo(
    targetValue: number,
    fadeTime: number,
    easing: Easings = Easings.Linear,
    fps: number = 25
  ) {
    this.faderLevel$.pipe(take(1)).subscribe(sourceValue => {
      this.transitions.addTransition({
        sourceValue,
        targetValue,
        fadeTime,
        easing,
        fps,
        fullChannelId: this.fullChannelId,
        faderLevelCommand: this.faderLevelCommand,
      });
    });
  }

  /**
   * Perform fader transition to dB value
   * @param targetValueDB Target value as dB value (between -Infinity and 10)
   * @param fadeTime Fade time in ms
   * @param easing Easing characteristic, as an entry of the `Easings` enum. Defaults to `Linear`
   * @param fps Frames per second, defaults to 25
   */
  fadeToDB(
    targetValueDB: number,
    fadeTime: number,
    easing: Easings = Easings.Linear,
    fps: number = 25
  ) {
    const targetValue = DBToFaderValue(targetValueDB);
    return this.fadeTo(targetValue, fadeTime, easing, fps);
  }

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
