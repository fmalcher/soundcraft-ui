/**
 * Read from an object based on the given key
 *
 * @param obj Object to read from
 * @param path Path in the nested object where the value can be found
 * @param defaultValue Default value will be returned, when the given path is not available
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getValueFromObject<T>(obj: any, key: string, defaultValue?: T): T {
  return (obj[key] ?? defaultValue) as T;
}

/** Build dot-separated state path from single entries, just for convenience  */
export function joinStatePath(...path: (string | number)[]): string {
  return path.join('.');
}
