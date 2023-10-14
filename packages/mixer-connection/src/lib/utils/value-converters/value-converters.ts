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
  // fallback
  return lut[0][resultIndex];
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

/** Lower bound (ms) for automix time fader */
const timeMsLowerBound = 20;
/** Upper bound (ms) for automix time fader */
const timeMsUpperBound = 4000;

/**
 * Convert time fader value from linear float value (between 0 and 1) to milliseconds between 20..4000 ms
 * @param value linear fader value
 */
export function faderValueToTimeMs(value: number) {
  return Math.round(
    (timeMsUpperBound - timeMsLowerBound) * Math.pow(value, 3.0517) + timeMsLowerBound
  );
}

/**
 * Convert milliseconds to linear time fader value (between 0 and 1)
 * @param timeMs time in milliseconds between 20..4000
 */
export function timeMsToFaderValue(timeMs: number) {
  const sanitizedTime = clamp(timeMs, timeMsLowerBound, timeMsUpperBound);
  const result = Math.pow(
    (sanitizedTime - timeMsLowerBound) / (timeMsUpperBound - timeMsLowerBound),
    0.32768620768751844
  );

  return Math.floor(result * 10000000) / 10000000;
  // 0.32768620768751844 = 1 / 3.0517
}

/*****************************************************/

/**
 * Linear scaling from range value (defined by upper and lower bound) to linear float value (between 0 and 1)
 * @param rangeValue dB value within bounds
 * @param lowerBound lower bound for range
 * @param upperBound upper bound for range
 */
export function linearMappingRangeToValue(
  rangeValue: number,
  lowerBound: number,
  upperBound: number
): number {
  const result = (rangeValue - lowerBound) / (upperBound - lowerBound);
  return clamp(result, 0, 1);
}

/**
 * Linear scaling from linear float value (between 0 and 1) to a range value (defined by upper and lower bound)
 * @param value linear value
 * @param lowerBound lower bound for range
 * @param upperBound upper bound for range
 */
export function linearMappingValueToRange(value: number, lowerBound: number, upperBound: number) {
  const result = Math.round((value * (upperBound - lowerBound) + lowerBound) * 10) / 10; // round to 1 decimal place
  return clamp(result, lowerBound, upperBound);
}
