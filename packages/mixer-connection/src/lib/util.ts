/**
 * Transform a given value to int, float or string
 * @param value
 */
export function transformStringValue(value: string) {
  if (value.match(/^-?\d+$/)) {
    return parseInt(value, 10);
  } else if (value.match(/^\d+\.\d+$/)) {
    return parseFloat(value);
  } else {
    return value;
  }
}
