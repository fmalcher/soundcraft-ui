export function getObjectPath<T>(
  obj: any,
  path: (string | number)[] = [],
  defaultValue?: T
): T {
  if (obj === undefined) {
    return;
  }
  let subObj = obj;
  for (let i = 0; i < path.length; i++) {
    subObj = subObj[path[i]];
    if (subObj === undefined) {
      return defaultValue;
    }
  }
  return subObj as T;
}

export function getAddressableValue<S, K extends keyof S>(
  source: S,
  key: K,
  nextKey?: string | number
): any {
  if (source !== undefined && source.hasOwnProperty(key)) {
    return getObjectPath(source, [key as string | number]);
  }
  if (!nextKey) return undefined;
  if (Number.isInteger(Number(nextKey))) return [];
}

export function setObjectPath(
  source: any,
  path: (string | number)[],
  value: any
): any {
  const [key, ...remainingPath] = path;
  const oldValueOfKey = getAddressableValue(source, key, remainingPath[0]);
  const newValueOfKey =
    remainingPath.length > 0
      ? setObjectPath(oldValueOfKey, remainingPath, value)
      : value;

  const currentValue = getObjectPath(source, [key as string | number]);
  if (
    source !== undefined &&
    source.hasOwnProperty(key) &&
    currentValue === newValueOfKey
  )
    return source;

  if (Array.isArray(source) && !Number.isInteger(Number(key))) return source;
  const newSource = Object.assign(Array.isArray(source) ? [] : {}, source);
  newSource[key] = newValueOfKey;
  return newSource;
}
