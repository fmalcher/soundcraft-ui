import { Observable } from 'rxjs';
import { filter, map, scan, shareReplay } from 'rxjs/operators';
import * as immutable from 'object-path-immutable';

import { transformStringValue } from '../util';

export class MixerStore {
  readonly state$ = this.rawMessages$.pipe(
    map(msg => msg.match(/(SETD|SETS)\^([a-zA-Z0-9.]+)\^(.+)/)),
    filter(e => !!e),
    map(([, , path, value]) => ({
      path: path.split('.').map(transformStringValue),
      value: transformStringValue(value),
    })),
    scan((acc, { path, value }) => immutable.set(acc, path, value), {}),
    shareReplay(1)
  );

  constructor(private rawMessages$: Observable<string>) {}
}
