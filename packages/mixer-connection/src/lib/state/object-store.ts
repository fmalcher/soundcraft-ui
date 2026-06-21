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

  /**
   * Return the cached object for the given id or create it (and cache it) using the factory.
   * Caching lives in the accessor methods of the facades, so that constructors always
   * run exactly once and never re-run their side effects on a cached instance.
   */
  getOrCreate<T>(id: string, factory: () => T): T {
    const existing = this.store.get(id) as T;
    if (existing) {
      return existing;
    }
    const created = factory();
    this.store.set(id, created);
    return created;
  }
}
