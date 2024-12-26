import { FadeableChannel } from '../facade';
import { SoundcraftUI } from '../soundcraft-ui';
import { ChannelType, MixerModel } from '../types';

const channelIndexMapping: { [key in MixerModel]: Record<number, [ChannelType, number]> } = {
  ui24: {
    0: ['i', 1],
    1: ['i', 2],
    2: ['i', 3],
    3: ['i', 4],
    4: ['i', 5],
    5: ['i', 6],
    6: ['i', 7],
    7: ['i', 8],
    8: ['i', 9],
    9: ['i', 10],
    10: ['i', 11],
    11: ['i', 12],
    12: ['i', 13],
    13: ['i', 14],
    14: ['i', 15],
    15: ['i', 16],
    16: ['i', 17],
    17: ['i', 18],
    18: ['i', 19],
    19: ['i', 20],
    20: ['i', 21],
    21: ['i', 22],
    22: ['i', 23],
    23: ['i', 24],
    24: ['l', 1],
    25: ['l', 2],
    26: ['p', 1],
    27: ['p', 2],
    28: ['f', 1],
    29: ['f', 2],
    30: ['f', 3],
    31: ['f', 4],
    32: ['s', 1],
    33: ['s', 2],
    34: ['s', 3],
    35: ['s', 4],
    36: ['s', 5],
    37: ['s', 6],
    38: ['a', 1],
    39: ['a', 2],
    40: ['a', 3],
    41: ['a', 4],
    42: ['a', 5],
    43: ['a', 6],
    44: ['a', 7],
    45: ['a', 8],
    46: ['a', 9],
    47: ['a', 10],
    48: ['v', 1],
    49: ['v', 2],
    50: ['v', 3],
    51: ['v', 4],
    52: ['v', 5],
    53: ['v', 6],
  },

  ui16: {
    0: ['i', 1],
    1: ['i', 2],
    2: ['i', 3],
    3: ['i', 4],
    4: ['i', 5],
    5: ['i', 6],
    6: ['i', 7],
    7: ['i', 8],
    8: ['i', 9],
    9: ['i', 10],
    10: ['i', 11],
    11: ['i', 12],
    12: ['l', 1],
    13: ['l', 2],
    14: ['p', 1],
    15: ['p', 2],
    16: ['f', 1],
    17: ['f', 2],
    18: ['f', 3],
    19: ['f', 4],
    20: ['s', 1],
    21: ['s', 2],
    22: ['s', 3],
    23: ['s', 4],
    24: ['a', 1],
    25: ['a', 2],
    26: ['a', 3],
    27: ['a', 4],
    28: ['a', 5],
    29: ['a', 6],
  },

  ui12: {
    0: ['i', 1],
    1: ['i', 2],
    2: ['i', 3],
    3: ['i', 4],
    4: ['i', 5],
    5: ['i', 6],
    6: ['i', 7],
    7: ['i', 8],
    8: ['l', 1],
    9: ['l', 2],
    10: ['p', 1],
    11: ['p', 2],
    12: ['f', 1],
    13: ['f', 2],
    14: ['f', 3],
    15: ['f', 4],
    16: ['s', 1],
    17: ['s', 2],
    18: ['s', 3],
    19: ['s', 4],
    20: ['a', 1],
    21: ['a', 2],
    22: ['a', 3],
    23: ['a', 4],
  },
};

/**
 * Get channel mapping for a mixer model.
 * @param model Mixer model
 */
function getChannelMappingForModel(model: MixerModel): Record<number, [ChannelType, number]> {
  return channelIndexMapping[model];
}

/**
 * Convert channel index to FadeableChannel on the master bus.
 * @param sui Soundcraft UI instance
 * @param model Mixer model
 * @param index Channel index
 */
export function indexToChannel(
  sui: SoundcraftUI,
  model: MixerModel,
  index: number
): FadeableChannel | null {
  const mapping = getChannelMappingForModel(model);

  if (index === -1) {
    return sui.master;
  }

  if (mapping[index] !== undefined) {
    const [type, num] = mapping[index];
    switch (type) {
      case 'i':
        return sui.master.input(num);
      case 'l':
        return sui.master.line(num);
      case 'p':
        return sui.master.player(num);
      case 'f':
        return sui.master.fx(num);
      case 's':
        return sui.master.sub(num);
      case 'a':
        return sui.master.aux(num);
      case 'v':
        return sui.master.vca(num);
    }
  }

  return null;
}

export function channelToIndex(model: MixerModel, type: 'master'): number | null;
export function channelToIndex(model: MixerModel, type: ChannelType, num: number): number | null;
export function channelToIndex(
  model: MixerModel,
  type: ChannelType | 'master',
  num?: number
): number | null {
  if (type !== 'master' && num === undefined) {
    throw new Error('Channel number is required');
  }

  const mapping = channelIndexMapping[model];
  if (type === 'master') {
    return -1;
  }

  for (const [index, [t, n]] of Object.entries(mapping)) {
    if (t === type && n === num) {
      return +index;
    }
  }

  return null;
}
