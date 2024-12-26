import { connectable, filter, map, ReplaySubject, scan, share } from 'rxjs';

import { transformStringValue } from '../utils';
import { MixerConnection } from '../mixer-connection';
import { ObjectStore } from './object-store';

export class MixerStore {
  /** Internal filtered stream of matched SETD and SETS messages */
  private setdSetsMessageMatches$ = this.conn.allMessages$.pipe(
    map(msg => msg.match(/(SETD|SETS)\^([a-zA-Z0-9.]+)\^(.*)/)),
    filter((e): e is RegExpMatchArray => e !== null),
    share()
  );

  /** Stream of raw SETD and SETS messages */
  readonly messages$ = this.setdSetsMessageMatches$.pipe(map(([msg]) => msg));

  /** The full mixer state as a flat object. Updates whenever the state changes. */
  readonly state$ = connectable(
    this.setdSetsMessageMatches$.pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      scan((acc: any, [, , path, value]) => {
        // mutable implementation
        acc[path] = transformStringValue(value);
        return acc;

        // Alternative immutable implementation
        // return { ...acc, [path]: transformStringValue(value) };
      }, {})
    ),
    { connector: () => new ReplaySubject(1) }
  );

  /**
   * Stream of channel sync states.
   * Each value is an object with syncId keys and index values.
   */
  readonly syncState$ = connectable(
    this.conn.allMessages$.pipe(
      // message format: BMSG^SYNC^<syncId>^<index>
      filter(msg => msg.startsWith('BMSG^SYNC^')),
      map(message => message.slice(10).split('^')),
      scan(
        (acc, [syncId, index]) => ({ ...acc, [syncId]: parseInt(index, 10) }),
        {} as Record<string, number>
      )
    ),
    { connector: () => new ReplaySubject(1) }
  );

  readonly objectStore = new ObjectStore();

  constructor(private conn: MixerConnection) {
    // start producing state values
    this.state$.connect();
    this.syncState$.connect();
  }
}
