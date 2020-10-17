import { OperatorFunction, pipe } from 'rxjs';
import { filter, map, scan, shareReplay } from 'rxjs/operators';
import * as immutable from 'object-path-immutable';

import { MixerState } from './mixer-state.models';

/**
 * Transform a given value to int, float or string
 * @param value
 */
function transformStringValue(value: string) {
  if (value.match(/^-?\d+$/)) {
    return parseInt(value, 10);
  } else if (value.match(/^\d+\.\d+$/)) {
    return parseFloat(value);
  } else {
    return value;
  }
}

/**
 * RxJS operator to reduce messages to a state object
 */
export const reduceState: OperatorFunction<string, MixerState> = pipe(
  map(msg => msg.match(/(SETD|SETS)\^([a-zA-Z0-9.]+)\^(.+)/)),
  filter(e => !!e),
  map(([, , path, value]) => ({
    path: path.split('.').map(transformStringValue),
    value: transformStringValue(value),
  })),
  scan((acc, { path, value }) => immutable.set(acc, path, value), {}),
  shareReplay(1)
);
