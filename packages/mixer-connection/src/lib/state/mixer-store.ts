import { connectable, filter, map, ReplaySubject, scan, share } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { ObjectStore } from './object-store';

export class MixerStore {
  /** Stream of raw SETD and SETS messages */
  readonly messages$ = this.conn.allMessages$.pipe(
    filter(msg => msg.startsWith('SETD^') || msg.startsWith('SETS^')),
    share(),
  );

  /** The full mixer state as a flat mutable object. Updates whenever the state changes. */
  readonly state$ = connectable(
    this.messages$.pipe(
      scan(
        (acc, msg) => {
          // message format: SETD^path^value or SETS^path^value.
          // 'SETD'/'SETS' are 4 chars, so the first '^' is at index 4 and the path starts at 5.
          // The value may itself contain '^', so it is taken as everything after the second '^'.
          const sep = msg.indexOf('^', 5);
          const type = msg.slice(0, 4);
          const path = msg.slice(5, sep);
          const value = msg.slice(sep + 1);

          // SETD always carries numeric values, SETS always carries strings.
          // mutable implementation
          acc[path] = type === 'SETD' ? Number(value) : value;
          return acc;
        },
        {} as Record<string, number | string>,
      ),
    ),
    { connector: () => new ReplaySubject(1) },
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
        {} as Record<string, number>,
      ),
    ),
    { connector: () => new ReplaySubject(1) },
  );

  readonly objectStore = new ObjectStore();

  constructor(private conn: MixerConnection) {
    // start producing state values
    this.state$.connect();
    this.syncState$.connect();
  }
}
