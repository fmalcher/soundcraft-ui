import { clamp } from '../../util';
import { dBLinearLUT } from './db-lut';

/**
 * Sanitize and convert a channel delay value from milliseconds to raw seconds
 * @param valueMs value in milliseconds
 * @param maximumMs maximum allowed value
 * @returns value in seconds
 */
export function sanitizeDelayValue(valueMs: number, maximumMs: number): number {
  // fit into range
  const value = clamp(valueMs, 0, maximumMs);

  // raw data is in seconds
  return value / 1000;
}

/**
 * Helper function for lookup in the LUT.
 * First, find the position which is closest to the requested source value.
 * Then do linear interpolation to find a closer value.
 *
 * @param lut Lookup table as nested array
 * @param sourceVal source value to convert
 * @param sourceIndex column index of the source values
 * @param resultIndex column index of the result values
 */
function findInLUT(
  lut: [number, number][],
  sourceVal: number,
  sourceIndex: 0 | 1,
  resultIndex: 0 | 1
) {
  for (let i = 0; i < lut.length; i++) {
    if (lut[i][sourceIndex] < sourceVal) {
      continue;
    }
    if (i === 0 || i === 1 || sourceVal === lut[i][sourceIndex]) {
      return lut[i][resultIndex];
    } else {
      return (
        lut[i - 1][resultIndex] +
        ((lut[i][resultIndex] - lut[i - 1][resultIndex]) * (sourceVal - lut[i - 1][sourceIndex])) /
          (lut[i][sourceIndex] - lut[i - 1][sourceIndex])
      );
    }
  }
}

/**
 * Convert fader value from dB to linear float value between 0 and 1
 * @param value fader value in dB
 */
export function DBToFaderValue(dbValue: number) {
  return findInLUT(dBLinearLUT, dbValue, 0, 1);
}

/**
 * Convert fader value from linear float value (between 0 and 1) to dB value
 * @param value linear fader value
 */
export function faderValueToDB(value: number) {
  const dbValue = findInLUT(dBLinearLUT, value, 1, 0);
  return Math.round(dbValue * 10) / 10;
}

/*****************************************************/

/**
 * Convert gain from dB to linear float value between 0 and 1
 * @param value gain value in dB
 */
export function DBToGainValue(gain: number): number {
  const result = (gain + 6) / 63;
  return clamp(result, 0, 1);
}

/**
 * Convert gain from linear float value (between 0 and 1) to dB value (between -6 and 57)
 * @param value linear gain value
 */
export function gainValueToDB(value: number): number {
  const result = Math.round((value * 63 - 6) * 10) / 10; // round to 1 decimal place
  return clamp(result, -6, 57);
}
