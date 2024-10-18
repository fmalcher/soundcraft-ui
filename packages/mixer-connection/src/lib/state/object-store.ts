/**
 * Store for facade objects
 * This is used to cache channels and others so that they don't need to be recreated all the time.
 * This is just a wrapper around a "Map" object, but we like to keep it abstract.
 */
export class ObjectStore {
  private store = new Map<string, unknown>();

  get<T>(id: string) {
    return this.store.get(id) as T;
  }

  set(id: string, value: unknown) {
    this.store.set(id, value);
  }
}
