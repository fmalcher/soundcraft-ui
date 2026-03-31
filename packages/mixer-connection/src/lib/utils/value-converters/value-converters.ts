import { clamp } from '../../utils';

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

/*****************************************************/

/**
 * Transfer function of the Soundcraft UI mixer fader.
 * Converts a fader position (0..1) to a linear amplitude value.
 *
 * @param v fader position between 0 and 1
 */
function faderToLinearAmplitude(v: number): number {
  return (
    (v < 0.055 ? Math.sin(28.559933214452666 * v) : 1) *
    Math.exp(
      (23.90844819639692 +
        (-26.23877598214595 + (12.195249692570245 - 0.4878099877028098 * v) * v) * v) *
        v,
    ) *
    2.676529517952372e-4
  );
}

/**
 * Derivative of faderToLinearAmplitude, used by Newton's method to invert the transfer function.
 *
 * @param v fader position between 0 and 1
 */
function faderToLinearAmplitudeDeriv(v: number): number {
  const P =
    (23.90844819639692 +
      (-26.23877598214595 + (12.195249692570245 - 0.4878099877028098 * v) * v) * v) *
    v;
  const Pprime =
    23.90844819639692 + (-52.4775519642919 + (36.58574907771074 - 1.9512399508112392 * v) * v) * v;
  const expP = Math.exp(P);

  if (v < 0.055) {
    const wv = 28.559933214452666 * v;
    return (
      2.676529517952372e-4 * expP * (28.559933214452666 * Math.cos(wv) + Math.sin(wv) * Pprime)
    );
  }
  return 2.676529517952372e-4 * expP * Pprime;
}

/**
 * Convert fader value from dB to linear float value between 0 and 1.
 * Uses Newton's method to numerically invert the faderToLinearAmplitude transfer function
 *
 * @param dbValue fader value in dB
 */
export function DBToFaderValue(dbValue: number): number {
  if (dbValue <= -200) return 0;
  if (dbValue >= 10) return 1;

  const target = Math.pow(10, dbValue / 20);

  // Newton's method: find v where faderToLinearAmplitude(v) = target
  let v = 0.5;
  for (let i = 0; i < 20; i++) {
    const delta = (faderToLinearAmplitude(v) - target) / faderToLinearAmplitudeDeriv(v);
    v -= delta;
    if (v < 0) v = 1e-10;
    if (v > 1) v = 1;
    if (Math.abs(delta) < 1e-15) break;
  }
  // Round to 11 decimal places to ensure consistent results across platforms.
  // Transcendental functions (exp, sin, cos) are not required by IEEE 754 to produce
  // bit-identical results, so the last digits of the Newton result can vary.
  return Math.round(v * 1e11) / 1e11;
}

/**
 * Convert fader value from linear float value (between 0 and 1) to dB value.
 * Direct calculation using the faderToLinearAmplitude transfer function
 *
 * @param value linear fader value
 */
export function faderValueToDB(value: number): number {
  const lin = faderToLinearAmplitude(value);
  if (lin < 1e-10) return -Infinity;
  return Math.round(20 * Math.log10(lin) * 10) / 10 || 0;
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
    (timeMsUpperBound - timeMsLowerBound) * Math.pow(value, 3.0517) + timeMsLowerBound,
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
    0.32768620768751844,
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
  upperBound: number,
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
export function linearMappingValueToRange(
  value: number,
  lowerBound: number,
  upperBound: number,
): number {
  const result = Math.round((value * (upperBound - lowerBound) + lowerBound) * 10) / 10; // round to 1 decimal place
  return clamp(result, lowerBound, upperBound);
}
