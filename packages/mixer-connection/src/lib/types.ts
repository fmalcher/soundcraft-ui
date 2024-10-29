export type ChannelType = 'i' | 'l' | 'p' | 'f' | 's' | 'a' | 'v';
export type BusType = 'master' | 'aux' | 'fx';

export interface SoundcraftUIOptions {
  /** IP address of the mixer */
  targetIP: string;
  /**
   * A WebSocket constructor to use. This is useful for situations like using a
   * WebSocket impl in Node (WebSocket is a DOM API), or for mocking a WebSocket
   * for testing purposes. By default, this library uses `WebSocket`
   * in the browser and falls back to `ws` on Node.js.
   */
  webSocketCtor?: { new (url: string, protocols?: string | string[]): WebSocket };
}

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

export enum FxType {
  None = -1,
  Reverb = 0,
  Delay = 1,
  Chorus = 2,
  Room = 3,
}

export type MixerModel = 'ui12' | 'ui16' | 'ui24';
