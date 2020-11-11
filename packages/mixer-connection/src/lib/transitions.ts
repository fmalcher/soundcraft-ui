import { interval, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
} from 'rxjs/operators';
import { MixerConnection } from './mixer-connection';
import { ConnectionStatus } from './types';
import { easingFunctions, Easings } from './utils/transitions/easings';

/**
 * Meta info object for a fade transition
 */
export interface TransitionSource {
  targetValue: number;
  fadeTime: number;
  easing: Easings;
  fps: number;
}

/**
 * Create a stream of fader values based on a stream of transition sources
 * @param transitionSources$ Stream of transition source objects
 * @param faderLevel$ Stream of fader levels. This will be used as the source value for each incoming transition
 * @param conn MixerConnection
 */
export function sourcesToTransition(
  transitionSources$: Observable<TransitionSource>,
  faderLevel$: Observable<number>,
  conn: MixerConnection
) {
  return transitionSources$.pipe(
    withLatestFrom(faderLevel$),
    switchMap(([{ targetValue, fadeTime, easing, fps }, sourceValue]) =>
      generateTransition(sourceValue, targetValue, fadeTime, easing, fps).pipe(
        takeUntil(conn.status$.pipe(filter(s => s.type === ConnectionStatus.Close)))
      )
    )
  );
}

/**
 * Generate discrete steps for a transition
 * @param sourceValue current value of the fader ("where to fade from")
 * @param targetValue target value of the fader ("where to fade to")
 * @param fadeTime fade time in milliseconds
 * @param easing Easing function info, one of the "Easings" enum
 * @param fps frames per seconds
 */
export function generateTransition(
  sourceValue: number,
  targetValue: number,
  fadeTime: number,
  easing: Easings,
  fps: number
): Observable<number> {
  fadeTime = Math.max(fadeTime, fps); // fade time must not be smaller than fps
  const stepTime = Math.round(1000 / fps);
  const steps = Math.round(fadeTime / stepTime);

  easing = easing || Easings.Linear;
  const easingFn = easingFunctions[easing] || easingFunctions[Easings.Linear];

  return interval(stepTime).pipe(
    take(steps),
    map(i => easingFn((i + 1) / steps) * (targetValue - sourceValue) + sourceValue),
    distinctUntilChanged()
  );
}
