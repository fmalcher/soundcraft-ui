/**
 * Toggle a bit of `value`
 * @param value Source value
 * @param bitIndex Bit index, right to left
 */
export function toggleBit(value: number, bitIndex: number) {
  if (bitIndex < 0) {
    return value;
  }
  return value ^ (1 << bitIndex);
}

/**
 * Change a bit of `value` to 0
 * @param value Source value
 * @param bitIndex Bit index, right to left
 */
export function clearBit(value: number, bitIndex: number) {
  if (bitIndex < 0) {
    return value;
  }
  return value & ~(1 << bitIndex);
}

/**
 * Change a bit of `value` to 1
 * @param value Source value
 * @param bitIndex Bit index, right to left
 */
export function setBit(value: number, bitIndex: number) {
  if (bitIndex < 0) {
    return value;
  }
  return value | (1 << bitIndex);
}

/**
 * Return the value of a specific bit in `value`
 * @param value Source value
 * @param bitIndex Bit index, right to left
 */
export function getValueOfBit(value: number, bitIndex: number) {
  if (bitIndex < 0) {
    return value;
  }
  return value & (1 << bitIndex) ? 1 : 0;
}
