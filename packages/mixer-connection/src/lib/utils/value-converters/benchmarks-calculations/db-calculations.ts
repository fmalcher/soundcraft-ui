/******************************************************/

import { clamp } from '../../../util';

/**
 * Calculation functions for dB / linear conversion.
 * LUT should be preferred over those direct calculations
 */

function valueToLIN(value: number) {
  return (
    (value < 0.055 ? Math.sin(28.559933214452666 * value) : 1) *
    Math.exp(
      (23.90844819639692 +
        (-26.23877598214595 + (12.195249692570245 - 0.4878099877028098 * value) * value) * value) *
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

/******************************************************/

const gainValueSteps = [
  -5, -5, -3, -3, -1, -1, 1, 1, 3, 3, 5, 5, 7, 7, 9, 9, 11, 11, 13, 13, 15, 15, 17, 17, 19, 19, 21,
  21, 23, 23, 25, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
  46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
];

export function gainValueToDBCALC(value: number): number {
  value = (64 * value) | 0;
  if (value < 0) {
    value = 0;
  }
  if (value > 63) {
    value = 63;
  }
  return gainValueSteps[value] - 1;
}
