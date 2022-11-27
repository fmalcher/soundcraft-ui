import { Subject, map, take } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectVolumeBusValue } from '../state/state-selectors';
import { sourcesToTransition, TransitionSource } from '../transitions';
import { Easings } from '../utils/transitions/easings';
import { DBToFaderValue, faderValueToDB } from '../utils/value-converters';
import { FadeableChannel } from './interfaces';

/**
 * Represents a volume bus like headphones or solo
 */
export class VolumeBus implements FadeableChannel {
  private transitionSources$ = new Subject<TransitionSource>();

  /** Linear level of the volume bus (between `0` and `1`) */
  faderLevel$ = this.store.state$.pipe(select(selectVolumeBusValue(this.busName, this.busId - 1)));

  /** dB level of the volume bus (between `-Infinity` and `10`) */
  faderLevelDB$ = this.faderLevel$.pipe(map(v => faderValueToDB(v)));

  constructor(
    protected conn: MixerConnection,
    protected store: MixerStore,
    protected busName: string,
    protected busId?: number
  ) {
    // lookup channel in the store and use existing object if possible
    const storeId = 'volume-' + this.busName + this.busId;
    const storedChannel = this.store.channelStore.get<VolumeBus>(storeId);
    if (storedChannel) {
      return storedChannel;
    } else {
      this.store.channelStore.set(storeId, this);
    }

    // create transition steps and set fader level accordingly
    sourcesToTransition(this.transitionSources$, this.faderLevel$, conn).subscribe(v =>
      this.setFaderLevel(v)
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
    this.transitionSources$.next({
      targetValue,
      fadeTime,
      easing,
      fps,
    });
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
   * Set linear level of the bus volume
   * @param value value between `0` and `1`
   */
  setFaderLevel(value: number) {
    const bus = `${this.busName}${this.busId ? '.' + (this.busId - 1) : ''}`;
    const command = `SETD^settings.${bus}^${value}`;
    this.conn.sendMessage(command);
  }

  /**
   * Set dB level of the bus volume
   * @param value value between `-Infinity` and `10`
   */
  setFaderLevelDB(dbValue: number) {
    this.setFaderLevel(DBToFaderValue(dbValue));
  }

  /**
   * Change the volume fader value relatively by adding a given value
   * @param dbValueToAdd Value (dB) to add to the current value
   */
  changeFaderLevelDB(dbValueToAdd: number) {
    this.faderLevelDB$
      .pipe(
        take(1),
        map(value => Math.max(value + dbValueToAdd, -100))
      )
      .subscribe(v => this.setFaderLevelDB(v));
  }
}
