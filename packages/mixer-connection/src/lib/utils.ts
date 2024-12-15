import { debounceTime, firstValueFrom, race, take, timer } from 'rxjs';
import { MixerStore } from './state/mixer-store';
import { ChannelType, FxType } from './types';

/** Clamp numeric value to min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Transform a given value to int, float or string
 * @param value
 */
export function transformStringValue(value: string) {
  if (value.match(/^-?\d+$/)) {
    return parseInt(value, 10);
  } else if (value.match(/^\d+\.\d+$/)) {
    return parseFloat(value);
  } else {
    return value;
  }
}

/**
 * Transform player time in seconds to human-readable format M:SS
 * @param value player time in seconds
 */
export function playerTimeToString(value: number) {
  if (value < 0) {
    return '';
  }
  const cleanValue = Math.floor(value);
  const minutes = Math.floor(cleanValue / 60);
  const seconds = cleanValue % 60;
  return `${minutes}:${seconds.toString().length === 1 ? '0' : ''}${seconds}`;
}

export function getLinkedChannelNumber(channel: number, stereoIndex: number): number {
  switch (stereoIndex) {
    case 1:
      return channel - 1;
    case 0:
      return channel + 1;
    default:
      return channel;
  }
}

/** Helper function to convert channel number into readable L/R value */
function numberToLR(channel: number): string {
  switch (channel) {
    case 1:
      return 'L';
    case 2:
      return 'R';
    default:
      return '';
  }
}

/** Helper function to convert FX type into readable name (Reverb, Chorus, ...) */
export function fxTypeToString(type: FxType): keyof typeof FxType {
  switch (type) {
    case FxType.None:
      return 'None';
    case FxType.Chorus:
      return 'Chorus';
    case FxType.Reverb:
      return 'Reverb';
    case FxType.Delay:
      return 'Delay';
    case FxType.Room:
      return 'Room';
  }
}

/**
 * Construct a human-readable name for a channel
 * based on the default labels from the web interface
 * @param type
 * @param channel
 * @returns
 */
export function constructReadableChannelName(type: ChannelType, channel: number): string {
  switch (type) {
    case 'i':
      return 'CH ' + channel;
    case 'a':
      return 'AUX ' + channel;
    case 'f':
      return 'FX ' + channel;
    case 's':
      return 'SUB ' + channel;
    case 'v':
      return 'VCA ' + channel;
    case 'l':
      return 'LINE IN ' + numberToLR(channel);
    case 'p':
      return 'PLAYER ' + numberToLR(channel);
  }
}

/**
 * Returns a Promise that fires when the mixer state hasn't changed for 25 ms OR when 250 ms timeout are over.
 * This makes sure that all initial params can be received by the mixer after connection init.
 * In case the state never stands still for 50 ms, the 250 ms timeout will emit finally.
 */
export function waitForInitParams(store: MixerStore): Promise<void> {
  return firstValueFrom(race(store.state$.pipe(debounceTime(25)), timer(250)));
}
