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
  payload: any;
}

export type ConnectionEvent = ConnectionStatusEvent | ConnectionErrorEvent;

export enum PlayerState {
  Stopped = 0,
  Playing = 2,
  Paused = 3,
}
