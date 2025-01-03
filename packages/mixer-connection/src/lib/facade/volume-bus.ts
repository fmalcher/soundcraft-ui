import { Subject, map, of, take } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectVolumeBusValue } from '../state/state-selectors';
import { sourcesToTransition, TransitionSource } from '../transitions';
import { clamp, constructReadableChannelName } from '../utils';
import { resolveDelayed } from '../utils/async-helpers';
import { Easings } from '../utils/transitions/easings';
import { DBToFaderValue, faderValueToDB } from '../utils/value-converters';
import { FadeableChannel } from './interfaces';
import { VolumeBusType } from '../types';

/**
 * Represents a volume bus like headphones or solo
 */
export class VolumeBus implements FadeableChannel {
  private transitionSources$ = new Subject<TransitionSource>();

  /** Linear level of the volume bus (between `0` and `1`) */
  faderLevel$ = this.store.state$.pipe(
    select(selectVolumeBusValue(this.busName, this.busId ? this.busId - 1 : undefined))
  );

  /** dB level of the volume bus (between `-Infinity` and `10`) */
  faderLevelDB$ = this.faderLevel$.pipe(map(v => faderValueToDB(v)));

  name$ = of(constructReadableChannelName(this.busName, this.busId || -1));

  constructor(
    protected conn: MixerConnection,
    protected store: MixerStore,
    protected busName: VolumeBusType,
    protected busId?: number
  ) {
    // lookup channel in the store and use existing object if possible
    const storeId = 'volume-' + this.busName + this.busId;
    const storedObject = this.store.objectStore.get<VolumeBus>(storeId);
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
   * Set linear level of the bus volume
   * @param value value between `0` and `1`
   */
  setFaderLevel(value: number) {
    value = clamp(value, 0, 1);
    this.setFaderLevelRaw(value);
  }

  private setFaderLevelRaw(value: number) {
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
   * @param offsetDB value (dB) to add to the current value
   */
  changeFaderLevelDB(offsetDB: number) {
    this.faderLevelDB$
      .pipe(take(1))
      .subscribe(v => this.setFaderLevelDB(Math.max(v, -100) + offsetDB));
  }
}
