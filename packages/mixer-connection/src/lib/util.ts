/** Clamp numeric value to min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

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

/**
 * Transform player time in seconds to human-readable format M:SS
 * @param value player time in seconds
 */
export function playerTimeToString(value: number) {
  if (value < 0) {
    return '';
  }
  const cleanValue = Math.floor(value);
  const minutes = Math.floor(cleanValue / 60);
  const seconds = cleanValue % 60;
  return `${minutes}:${seconds.toString().length === 1 ? '0' : ''}${seconds}`;
}

export function getLinkedChannelNumber(channel: number, stereoIndex: number): number {
  switch (stereoIndex) {
    case 1:
      return channel - 1;
    case 0:
      return channel + 1;
  }
}
