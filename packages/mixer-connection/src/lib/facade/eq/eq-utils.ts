import { ChannelType } from '../../types';
import { clamp } from '../../utils';
import { EQ_FREQUENCY_MAX, EQ_FREQUENCY_MIN } from '../../utils/value-converters/eq-converters';

/** Parameters of an EQ band */
export type EqBandParam = 'freq' | 'q' | 'gain';

/** High-pass (`hpf`) or low-pass (`lpf`) filter */
export type EqFilterType = 'hpf' | 'lpf';

/** Filter slope in dB/oct */
export type EqFilterSlope = 12 | 24 | 36;

/** Number of parametric EQ bands (`eq.b1` .. `eq.b4`) */
export const EQ_BAND_COUNT = 4;

/** Channel types with a parametric EQ: input, line, player, FX and sub group */
const EQ_CHANNEL_TYPES: ChannelType[] = ['i', 'l', 'p', 'f', 's'];

/** Frequency range of the filters and the raw value that switches them off */
export const EQ_FILTERS: Readonly<
  Record<EqFilterType, Readonly<{ minHz: number; maxHz: number; offValue: number }>>
> = {
  hpf: { minHz: EQ_FREQUENCY_MIN, maxHz: 1000, offValue: 0 },
  lpf: { minHz: 1000, maxHz: EQ_FREQUENCY_MAX, offValue: 1 },
};

const SLOPES: EqFilterSlope[] = [12, 24, 36];

/** State path of the EQ bypass switch, e.g. `i.2.eq.bypass` */
export function eqBypassPath(channelId: string): string {
  return `${channelId}.eq.bypass`;
}

/** State path of an EQ band parameter, e.g. `i.2.eq.b1.freq` */
export function eqBandPath(channelId: string, band: number, param: EqBandParam): string {
  return `${channelId}.eq.b${band}.${param}`;
}

/** State path of a filter parameter, e.g. `i.2.eq.hpf.freq` */
export function eqFilterPath(
  channelId: string,
  type: EqFilterType,
  param: 'freq' | 'slope',
): string {
  return `${channelId}.eq.${type}.${param}`;
}

/** Throw if the channel type has no parametric EQ (AUX and VCA channels) */
export function assertEqChannelType(type: ChannelType): void {
  if (!EQ_CHANNEL_TYPES.includes(type)) {
    throw new Error('EQ is only available for input, line, player, FX and sub group channels');
  }
}

/** Throw if the channel type has no low-pass filter (only input channels have one) */
export function assertLowPassChannelType(type: ChannelType): void {
  if (type !== 'i') {
    throw new Error('The low-pass filter is only available for input channels');
  }
}

/** Throw if the band number is not between 1 and 4 */
export function assertEqBand(band: number): void {
  if (!Number.isInteger(band) || band < 1 || band > EQ_BAND_COUNT) {
    throw new Error('EQ band must be between 1 and 4.');
  }
}

/** Convert a filter slope (12, 24 or 36 dB/oct) to the raw value `0`, `1` or `2` */
export function slopeToValue(slope: EqFilterSlope): number {
  const index = SLOPES.indexOf(slope);
  if (index < 0) {
    throw new Error('Filter slope must be 12, 24 or 36 dB/oct.');
  }
  return index;
}

/** Convert a raw slope value (`0`, `1` or `2`) to the filter slope in dB/oct */
export function valueToSlope(value: number): EqFilterSlope {
  return SLOPES[clamp(Math.round(value), 0, SLOPES.length - 1)];
}
