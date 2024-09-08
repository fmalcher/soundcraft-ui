import { linearMappingValueToRange } from '../utils/value-converters/value-converters';
import { VuData } from './vu.types';

/** convert linear VU value (between `0`..`1`) to dB (between `-80`..`0`)
 *
 * ```ts
 * // Example
 * conn.vuProcessor.master().pipe(
 *   map(data => vuValueToDB(data.vuPostFaderL))
 * );
 * ```
 */
export function vuValueToDB(linearValue: number) {
  return linearMappingValueToRange(linearValue, -80, 0);
}

/** convert base64 VU data to array */
export function vuMessageToArray(vuMessage: string): Uint8Array {
  /**
   * We did not use this line on purpose:
   * // return Uint8Array.from(atob(vuMessage), char => char.charCodeAt(0));
   * Even though it might look more elegant, it performed considerably worse in our benchmarks (with 1,000,000 entries in an array):
   * - Uint8Array.from(): 14.089s
   * - for loop: 845.428ms
   */
  const bytes = atob(vuMessage);
  const length = bytes.length;
  const result = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    result[i] = bytes.charCodeAt(i);
  }
  return result;
}

/** convert VU message array to actual VU information represented as an object of type `VuData` */
export function parseVuMessageArray(rawVuData: Uint8Array): VuData {
  // the message describes VU info in this order
  const channelTypes: { key: keyof VuData; amount: number; blockSize: number }[] = [
    { key: 'input', amount: rawVuData[0], blockSize: 6 },
    { key: 'player', amount: rawVuData[1], blockSize: 6 },
    { key: 'sub', amount: rawVuData[2], blockSize: 7 },
    { key: 'fx', amount: rawVuData[3], blockSize: 7 },
    { key: 'aux', amount: rawVuData[4], blockSize: 5 },
    { key: 'master', amount: rawVuData[5], blockSize: 5 },
    { key: 'line', amount: rawVuData[6], blockSize: 6 },
  ];

  // result object, will be populated below
  const result: VuData = {
    input: [],
    player: [],
    sub: [],
    fx: [],
    aux: [],
    master: [],
    line: [],
  };

  const normalizeFactor = 0.004167508166392142;

  let currentIndex = 8; // skip preample block
  // go through channel types ...
  channelTypes.forEach(channelType => {
    // ... and go through all channels of this type to capture VU info from the bytes
    for (let i = 0; i < (channelType.amount || 0); i++) {
      switch (channelType.key) {
        case 'input':
        case 'player':
        case 'line': {
          result[channelType.key].push({
            vuPre: rawVuData[currentIndex + 0] * normalizeFactor,
            vuPost: rawVuData[currentIndex + 1] * normalizeFactor,
            vuPostFader: rawVuData[currentIndex + 2] * normalizeFactor,
          });
          break;
        }
        case 'aux': {
          result[channelType.key].push({
            vuPost: rawVuData[currentIndex + 0] * normalizeFactor,
            vuPostFader: rawVuData[currentIndex + 1] * normalizeFactor,
          });
          break;
        }
        case 'fx':
        case 'sub': {
          result[channelType.key].push({
            vuPostL: rawVuData[currentIndex + 0] * normalizeFactor,
            vuPostR: rawVuData[currentIndex + 1] * normalizeFactor,
            vuPostFaderL: rawVuData[currentIndex + 2] * normalizeFactor,
            vuPostFaderR: rawVuData[currentIndex + 3] * normalizeFactor,
          });
          break;
        }
        case 'master': {
          result[channelType.key].push({
            vuPost: rawVuData[currentIndex + 0] * normalizeFactor,
            vuPostFader: rawVuData[currentIndex + 1] * normalizeFactor,
          });
          break;
        }
      }

      currentIndex += channelType.blockSize; // move forward to next block
    }
  });

  return result;
}
