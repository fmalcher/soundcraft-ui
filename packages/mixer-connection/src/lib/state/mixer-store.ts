import { connectable, filter, map, ReplaySubject, scan, share } from 'rxjs';

import { transformStringValue } from '../utils';
import { MixerConnection } from '../mixer-connection';
import { ChannelStore } from './channel-store';

export class MixerStore {
  /** Internal filtered stream of matched SETD and SETS messages */
  private setdSetsMessageMatches$ = this.conn.allMessages$.pipe(
    map(msg => msg.match(/(SETD|SETS)\^([a-zA-Z0-9.]+)\^(.*)/)),
    filter((e): e is RegExpMatchArray => !!e),
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

  readonly channelStore = new ChannelStore();

  constructor(private conn: MixerConnection) {
    // start producing state values
    this.state$.connect();
  }
}
