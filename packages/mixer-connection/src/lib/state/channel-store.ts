import { Channel } from '../facade/channel';

/**
 * Store for channel objects.
 * This is used to cache channel objects so that they don't need to be recreated all the time.
 * This is just a wrapper around a "Map" object, but we like to keep it abstract.
 */
export class ChannelStore {
  private store = new Map<string, Channel>();

  get(id: string) {
    return this.store.get(id);
  }

  set(id: string, value: Channel) {
    this.store.set(id, value);
  }
}
