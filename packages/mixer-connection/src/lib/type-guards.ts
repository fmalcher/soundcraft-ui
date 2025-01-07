import { DelayableMasterChannel, MasterBus, MasterChannel } from './facade';
import { Channel } from './facade/channel';

/** Asserts that the given object is an instance of `Channel` */
export function isChannel(ch: unknown): ch is Channel {
  return ch instanceof Channel;
}

/** Asserts that the given object is an instance of `MasterChannel` */
export function isMasterChannel(ch: unknown): ch is MasterChannel {
  return ch instanceof MasterChannel;
}

/** Asserts that the given object is an instance of `DelayableMasterChannel` */
export function isDelayableMasterChannel(ch: unknown): ch is DelayableMasterChannel {
  return ch instanceof DelayableMasterChannel;
}

/** Asserts that the given object is an instance of `MasterBus` */
export function isMaster(ch: unknown): ch is MasterBus {
  return ch instanceof MasterBus;
}
