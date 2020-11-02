import { dBLinearLUT } from './db-lut';

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
    return i === 0 || sourceVal === lut[i][sourceIndex]
      ? lut[i][resultIndex]
      : Math.round(
          (lut[i - 1][resultIndex] +
            ((lut[i][resultIndex] - lut[i - 1][resultIndex]) *
              (sourceVal - lut[i - 1][sourceIndex])) /
              (lut[i][sourceIndex] - lut[i - 1][sourceIndex])) *
            10
        ) / 10;
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
 * @param value fader value in dB
 */
export function faderValueToDB(value: number) {
  return findInLUT(dBLinearLUT, value, 1, 0);
}

/******************************************************/

/**
 * Calculation functions for dB / linear conversion.
 * LUT should be preferred over those direct calculations
 */

function valueToLIN(value: number) {
  return (
    (value < 0.055 ? Math.sin(28.559933214452666 * value) : 1) *
    Math.exp(
      (23.90844819639692 +
        (-26.23877598214595 +
          (12.195249692570245 - 0.4878099877028098 * value) * value) *
          value) *
        value
    ) *
    2.676529517952372e-4
  );
}

export function DBToFaderValueCALC(value: number) {
  if (value <= -200) {
    return 0;
  }
  if (value >= 10) {
    return 1;
  }
  value = Math.pow(10, value / 20);
  let b = 0;
  let c = 1;
  for (let i = 0; i < 128; i++) {
    const f = 0.5 * (b + c);
    const lin = valueToLIN(f);
    if (Math.abs(lin - value) < 1e-10) {
      return f;
    }
    if (lin > value) {
      c = f;
    } else {
      b = f;
    }
  }
  return (b + c) / 2;
}

export function faderValueToDBCALC(value: number) {
  const lin = valueToLIN(value);
  if (!lin) {
    return -Infinity;
  }
  return ((((20 * Math.log(lin)) / Math.log(10)) * 10 + 0.45) | 0) / 10;
}
