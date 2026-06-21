import { BusType, ChannelType } from '../types';

/** construct the channel id for a master channel, e.g. `i.0` */
export function constructMasterChannelId(channelType: ChannelType, channel: number) {
  return `${channelType}.${channel - 1}`;
}

/** construct the channel id for a send (AUX/FX) channel, e.g. `i.0.aux.2` */
export function constructSendChannelId(
  channelType: ChannelType,
  channel: number,
  busType: BusType,
  bus: number,
) {
  return `${channelType}.${channel - 1}.${busType}.${bus - 1}`;
}
