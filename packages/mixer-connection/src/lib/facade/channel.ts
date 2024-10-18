import { Subject, map, take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import {
  select,
  selectChannelName,
  selectFaderValue,
  selectMute,
  selectStereoIndex,
} from '../state/state-selectors';
import { sourcesToTransition, TransitionSource } from '../transitions';
import { BusType, ChannelType } from '../types';
import { clamp, constructReadableChannelName } from '../utils';
import { resolveDelayed } from '../utils/async-helpers';
import { Easings } from '../utils/transitions/easings';
import { DBToFaderValue, faderValueToDB } from '../utils/value-converters';
import { FadeableChannel } from './interfaces';

/**
 * Represents a single channel with a fader
 */
export class Channel implements FadeableChannel {
  fullChannelId = `${this.channelType}.${this.channel - 1}`;
  protected faderLevelCommand = 'mix';
  protected linkedChannelIds: string[] = [];

  private transitionSources$ = new Subject<TransitionSource>();

  /** Index of this channel in the stereolink compound (0 = I'm first, 1 = I'm second, -1 = not linked) */
  protected stereoIndex$ = this.store.state$.pipe(
    select(selectStereoIndex(this.channelType, this.channel))
  );

  /** Linear level of the channel (between `0` and `1`) */
  faderLevel$ = this.store.state$.pipe(
    select(selectFaderValue(this.channelType, this.channel, this.busType, this.bus))
  );

  /** dB level of the channel (between `-Infinity` and `10`) */
  faderLevelDB$ = this.faderLevel$.pipe(map(v => faderValueToDB(v)));

  /** MUTE value of the channel (`0` or `1`) */
  mute$ = this.store.state$.pipe(
    select(selectMute(this.channelType, this.channel, this.busType, this.bus))
  );

  /** Name of the channel */
  name$ = this.store.state$.pipe(
    select(selectChannelName(this.channelType, this.channel, this.busType, this.bus)),
    map(name => name || constructReadableChannelName(this.channelType, this.channel))
  );

  constructor(
    protected conn: MixerConnection,
    protected store: MixerStore,
    protected channelType: ChannelType,
    protected channel: number,
    protected busType: BusType = 'master',
    protected bus = 0
  ) {
    // lookup channel in the store and use existing object if possible
    const storeId = busType + bus + channelType + channel;
    const storedObject = this.store.objectStore.get<Channel>(storeId);
    if (storedObject) {
      return storedObject;
    } else {
      this.store.objectStore.set(storeId, this);
    }

    // create transition steps and set fader level accordingly
    sourcesToTransition(this.transitionSources$, this.faderLevel$, conn).subscribe(v =>
      this.setFaderLevelRaw(v)
    );
  }

  /**
   * Perform fader transition to linear value
   * @param targetValue Target value as linear value (between 0 and 1)
   * @param fadeTime Fade time in ms
   * @param easing Easing characteristic, as an entry of the `Easings` enum. Defaults to `Linear`
   * @param fps Frames per second, defaults to 25
   */
  fadeTo(targetValue: number, fadeTime: number, easing: Easings = Easings.Linear, fps = 25) {
    targetValue = clamp(targetValue, 0, 1);
    this.transitionSources$.next({
      targetValue,
      fadeTime,
      easing,
      fps,
    });
    return resolveDelayed(fadeTime);
  }

  /**
   * Perform fader transition to dB value
   * @param targetValueDB Target value as dB value (between -Infinity and 10)
   * @param fadeTime Fade time in ms
   * @param easing Easing characteristic, as an entry of the `Easings` enum. Defaults to `Linear`
   * @param fps Frames per second, defaults to 25
   */
  fadeToDB(targetValueDB: number, fadeTime: number, easing: Easings = Easings.Linear, fps = 25) {
    const targetValue = DBToFaderValue(targetValueDB);
    return this.fadeTo(targetValue, fadeTime, easing, fps);
  }

  /**
   * Set linear level of the channel fader
   * @param value value between `0` and `1`
   */
  setFaderLevel(value: number) {
    value = clamp(value, 0, 1);
    this.setFaderLevelRaw(value);
  }

  private setFaderLevelRaw(value: number) {
    [...this.linkedChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.${this.faderLevelCommand}^${value}`;
      this.conn.sendMessage(command);
    });
  }

  /**
   * Set dB level of the channel fader
   * @param value value between `-Infinity` and `10`
   */
  setFaderLevelDB(dbValue: number) {
    this.setFaderLevel(DBToFaderValue(dbValue));
  }

  /**
   * Change the fader value relatively by adding a given value
   * @param offsetDB value (dB) to add to the current value
   */
  changeFaderLevelDB(offsetDB: number) {
    this.faderLevelDB$
      .pipe(take(1))
      .subscribe(v => this.setFaderLevelDB(Math.max(v, -100) + offsetDB));
  }

  /**
   * Set MUTE value for the channel
   * @param value MUTE value `0` or `1`
   */
  setMute(value: number) {
    [...this.linkedChannelIds, this.fullChannelId].forEach(cid => {
      const command = `SETD^${cid}.mute^${value}`;
      this.conn.sendMessage(command);
    });
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
