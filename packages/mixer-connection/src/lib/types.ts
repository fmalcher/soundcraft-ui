export type ChannelType = 'i' | 'l' | 'p' | 'f' | 's' | 'a' | 'v';
export type BusType = 'master' | 'aux' | 'fx';

export enum ConnectionStatus {
  Opening = 'OPENING',
  Open = 'OPEN',
  Close = 'CLOSE',
  Closing = 'CLOSING',
  Error = 'ERROR',
  Reconnecting = 'RECONNECTING',
}

export interface ConnectionStatusEvent {
  type: ConnectionStatus;
}

export interface ConnectionErrorEvent extends ConnectionStatusEvent {
  type: ConnectionStatus.Error;
  payload: unknown;
}

export type ConnectionEvent = ConnectionStatusEvent | ConnectionErrorEvent;

export enum PlayerState {
  Stopped = 0,
  Playing = 2,
  Paused = 3,
}

export enum MtkState {
  Stopped = 0,
  Paused = 1,
  Playing = 2,
}

export type MixerModel = 'ui12' | 'ui16' | 'ui24';
