import { MixerModel } from './types';

export interface DeviceCapabilities {
  model: string;
  input: number;
  line: number;
  player: number;
  fx: number;
  sub: number;
  aux: number;
  vca: number;
  multitrack: boolean;
  masterDim: boolean;
}

export const DEVICE_CAPABILITIES: Readonly<Record<MixerModel, Readonly<DeviceCapabilities>>> = {
  ui12: {
    model: 'ui12',
    input: 8,
    line: 2,
    player: 2,
    fx: 4,
    sub: 4,
    aux: 4,
    vca: 0,
    multitrack: false,
    masterDim: false,
  },
  ui16: {
    model: 'ui16',
    input: 12,
    line: 2,
    player: 2,
    fx: 4,
    sub: 4,
    aux: 6,
    vca: 0,
    multitrack: false,
    masterDim: false,
  },
  ui24: {
    model: 'ui24',
    input: 24,
    line: 2,
    player: 2,
    fx: 4,
    sub: 6,
    aux: 10,
    vca: 6,
    multitrack: true,
    masterDim: true,
  },
};
