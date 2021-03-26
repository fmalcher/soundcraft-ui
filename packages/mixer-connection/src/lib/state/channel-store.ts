import { FadeableChannel } from '../facade/interfaces';

/**
 * Store for channel objects.
 * This is used to cache channel objects so that they don't need to be recreated all the time.
 * This is just a wrapper around a "Map" object, but we like to keep it abstract.
 */
export class ChannelStore {
  private store = new Map<string, FadeableChannel>();

  get<T extends FadeableChannel>(id: string) {
    return this.store.get(id) as T;
  }

  set(id: string, value: FadeableChannel) {
    this.store.set(id, value);
  }
}
