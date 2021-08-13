import { HwChannel } from '../facade/hw-channel';
import { FadeableChannel } from '../facade/interfaces';

type StorableChannel = FadeableChannel | HwChannel;

/**
 * Store for channel objects.
 * This is used to cache channel objects so that they don't need to be recreated all the time.
 * This is just a wrapper around a "Map" object, but we like to keep it abstract.
 */
export class ChannelStore {
  private store = new Map<string, StorableChannel>();

  get<T extends StorableChannel>(id: string) {
    return this.store.get(id) as T;
  }

  set(id: string, value: StorableChannel) {
    this.store.set(id, value);
  }
}
