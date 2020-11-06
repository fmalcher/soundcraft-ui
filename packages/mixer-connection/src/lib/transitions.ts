import { interval, Observable, Subject, merge } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  groupBy,
  map,
  mergeMap,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { MixerConnection } from './mixer-connection';
import { ConnectionStatus } from './types';
import { easingFunctions, Easings } from './utils/transitions/easings';

export interface TransitionSource {
  fullChannelId: string;
  faderLevelCommand: string;
  sourceValue: number;
  targetValue: number;
  fadeTime: number;
  easing: Easings;
  fps: number;
}

export class TransitionRegistry {
  private sources$ = new Subject<TransitionSource>();
  private stopTransitions$ = new Subject();

  constructor(private conn: MixerConnection) {
    /**
     * Group the transition sources by channel. This allows us to cancel a running transition on a specific channel when a new one appears (using switchMap).
     * All other running transitions are not affected by this.
     */
    this.sources$
      .pipe(
        groupBy(s => s.fullChannelId),
        mergeMap(sourcesPerChannel$ =>
          sourcesPerChannel$.pipe(
            switchMap(source =>
              this.generateTransition(source).pipe(
                map(value =>
                  this.buildLevelCommand(
                    source.fullChannelId,
                    source.faderLevelCommand,
                    value
                  )
                )
              )
            )
          )
        ),
        // stop all transitions when notifier calls or when connection is closed
        takeUntil(
          merge(
            this.stopTransitions$,
            this.conn.status$.pipe(
              filter(e => e.type === ConnectionStatus.Close)
            )
          )
        )
      )
      .subscribe(command => this.conn.sendMessage(command));
  }

  /**
   * Add a new transition to perform
   * @param source A TransitionSource object with all metadata about the transition
   */
  addTransition(source: TransitionSource) {
    this.sources$.next(source);
  }

  /** Stop all running transitions */
  stopAll() {
    this.stopTransitions$.next(null);
  }

  /** Generate command to set the fader level */
  private buildLevelCommand(
    fullChannelId: string,
    faderLevelCommand: string,
    value: number
  ) {
    return `SETD^${fullChannelId}.${faderLevelCommand}^${value}`;
  }

  /**
   * Perform the transition by generating the discrete steps
   * @param source TransitionSource object with metadata about the transition
   */
  private generateTransition({
    sourceValue,
    targetValue,
    fadeTime,
    easing,
    fps,
  }: TransitionSource): Observable<number> {
    fadeTime = Math.max(fadeTime, fps); // fade time must not be smaller than fps
    const stepTime = Math.round(1000 / fps);
    const steps = Math.round(fadeTime / stepTime);

    easing = easing || Easings.Linear;
    const easingFn = easingFunctions[easing] || easingFunctions[Easings.Linear];

    return interval(stepTime).pipe(
      take(steps),
      map(
        i =>
          easingFn((i + 1) / steps) * (targetValue - sourceValue) + sourceValue
      ),
      distinctUntilChanged()
    );
  }
}
