import { ConnectableObservable, Observable } from 'rxjs';
import { filter, map, publishReplay, scan } from 'rxjs/operators';
import { setObjectPath } from '../utils/object-path';

import { transformStringValue } from '../util';
import { MixerConnection } from '../mixer-connection';
import { ChannelStore } from './channel-store';

export class MixerStore {
  /**
   * The full mixer state.
   * Updates whenever the state changes
   */
  readonly state$ = this.conn.allMessages$.pipe(
    map(msg => msg.match(/(SETD|SETS)\^([a-zA-Z0-9.]+)\^(.*)/)),
    filter(e => !!e),
    map(([, , path, value]) => ({
      path: path.split('.').map(transformStringValue),
      value: transformStringValue(value),
    })),
    scan((acc, { path, value }) => setObjectPath(acc, path, value), {}),
    publishReplay(1)
  );

  channelStore = new ChannelStore();

  constructor(private conn: MixerConnection) {
    // start producing state values
    (this.state$ as ConnectableObservable<any>).connect();
  }
}
