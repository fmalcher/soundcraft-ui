import { debounceTime, firstValueFrom, race, timer } from 'rxjs';
import { MixerStore } from './state/mixer-store';
import { ChannelType, FxType, VolumeBusType } from './types';

/** Clamp numeric value to min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Round a number to three decimal places */
export function roundToThreeDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
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

/**
 * Get the number of the channel that is stereo-linked to the given channel.
 * Returns `undefined` when the channel is not linked (stereo index `-1`),
 * so callers can skip adding a linked channel in that case.
 * @param channel Channel number
 * @param stereoIndex Stereo index of the channel (`0` = first, `1` = second, `-1` = not linked)
 */
export function getLinkedChannelNumber(channel: number, stereoIndex: number): number | undefined {
  switch (stereoIndex) {
    case 1:
      return channel - 1;
    case 0:
      return channel + 1;
    default:
      return undefined;
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
 * Sanitize a channel name before sending it to the mixer:
 * removes the reserved `^` separator, limits the length to 20 characters
 * and converts the name to uppercase.
 * @param name raw channel name
 */
export function sanitizeChannelName(name: string): string {
  return name
    .replace(/[\^]/gi, '') // ^ sign is not allowed
    .substring(0, 20)
    .toUpperCase();
}

/**
 * Construct the default human-readable name for a channel,
 * based on the default labels from the web interface
 * @param type channel type
 * @param channel channel number
 */
export function getDefaultChannelName(type: ChannelType, channel: number): string {
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
 * Construct the default human-readable name for a matrix bus output (Ui24R only).
 * A matrix lives in the same `a` slot as the AUX it replaced, but uses a different
 * default label.
 * @param channel matrix bus number
 */
export function getDefaultMatrixName(channel: number): string {
  return 'MTX ' + channel;
}

/**
 * Construct the default human-readable name for a volume bus (solo or headphones),
 * based on the default labels from the web interface
 * @param type volume bus type
 * @param busId volume bus number
 */
export function getDefaultVolumeBusName(type: VolumeBusType, busId: number): string {
  switch (type) {
    case 'solovol':
      return 'SOLO LEVEL';
    case 'hpvol':
      return `HEADPHONE ${busId} LEVEL`;
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
