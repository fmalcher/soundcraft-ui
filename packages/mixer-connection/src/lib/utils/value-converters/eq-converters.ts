import { clamp } from '../../utils';
import { linearMappingRangeToValue, linearMappingValueToRange } from './value-converters';

/*
 * Conversions for the parametric channel EQ.
 * The curves are the ones the mixer's web app uses (`VtoFREQ`, `VtoQ`, `VtoEQGAIN20`).
 * They reproduce the raw default values of a Ui24R exactly, e.g. 200 Hz = 0.3286901902 and Q 1 = 0.5252185347.
 */

/** Lowest EQ frequency (Hz), raw value `0` */
export const EQ_FREQUENCY_MIN = 20;
/** Highest EQ frequency (Hz), raw value `1` */
export const EQ_FREQUENCY_MAX = 22050;
/** Lowest EQ bandwidth (Q), raw value `0` */
export const EQ_Q_MIN = 0.05;
/** Highest EQ bandwidth (Q), raw value `1` */
export const EQ_Q_MAX = 15;
/** Lowest EQ band gain (dB), raw value `0` */
export const EQ_GAIN_MIN_DB = -20;
/** Highest EQ band gain (dB), raw value `1` */
export const EQ_GAIN_MAX_DB = 20;

/** The mixer stores raw values with 10 decimals */
function roundToTenDecimals(value: number): number {
  return Math.round(value * 1e10) / 1e10;
}

/**
 * Convert an EQ frequency in Hz to a linear value between `0` and `1` (logarithmic scale)
 * @param hz frequency between `20` and `22050` Hz
 */
export function frequencyToFaderValue(hz: number): number {
  const value = clamp(hz, EQ_FREQUENCY_MIN, EQ_FREQUENCY_MAX);
  return roundToTenDecimals(
    Math.log(value / EQ_FREQUENCY_MIN) / Math.log(EQ_FREQUENCY_MAX / EQ_FREQUENCY_MIN),
  );
}

/**
 * Convert a linear value between `0` and `1` to an EQ frequency in Hz (logarithmic scale)
 * @param value linear value
 * @returns frequency between `20` and `22050` Hz, rounded to whole Hz
 */
export function faderValueToFrequency(value: number): number {
  const v = clamp(value, 0, 1);
  return Math.round(EQ_FREQUENCY_MIN * Math.pow(EQ_FREQUENCY_MAX / EQ_FREQUENCY_MIN, v));
}

/**
 * Convert an EQ bandwidth (Q) to a linear value between `0` and `1` (logarithmic scale)
 * @param q Q between `0.05` and `15` (higher values are narrower)
 */
export function qToFaderValue(q: number): number {
  const value = clamp(q, EQ_Q_MIN, EQ_Q_MAX);
  return roundToTenDecimals(Math.log(value / EQ_Q_MIN) / Math.log(EQ_Q_MAX / EQ_Q_MIN));
}

/**
 * Convert a linear value between `0` and `1` to an EQ bandwidth (Q) (logarithmic scale)
 * @param value linear value
 * @returns Q between `0.05` and `15`, rounded to two decimals
 */
export function faderValueToQ(value: number): number {
  const v = clamp(value, 0, 1);
  return Math.round(EQ_Q_MIN * Math.pow(EQ_Q_MAX / EQ_Q_MIN, v) * 100) / 100;
}

/**
 * Convert an EQ band gain in dB to a linear value between `0` and `1`
 * @param dbValue gain between `-20` and `20` dB
 */
export function eqGainDBToFaderValue(dbValue: number): number {
  return linearMappingRangeToValue(dbValue, EQ_GAIN_MIN_DB, EQ_GAIN_MAX_DB);
}

/**
 * Convert a linear value between `0` and `1` to an EQ band gain in dB
 * @param value linear value
 * @returns gain between `-20` and `20` dB, rounded to one decimal
 */
export function faderValueToEqGainDB(value: number): number {
  return linearMappingValueToRange(value, EQ_GAIN_MIN_DB, EQ_GAIN_MAX_DB);
}
