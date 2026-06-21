/**
 * Builders for the cache ids that must be shared between accessors.
 *
 * Most cache ids are built inline at their single call site. Only the two below are
 * produced by more than one accessor and therefore need a single source of truth, so
 * that the accessors resolve to the very same cached instance:
 *  - `conn.aux(n)` and `mtx.switchToAux()`
 *  - `conn.mtx(n)` and `aux.switchToMatrix()`
 */

/** cache id for an AuxBus */
export function auxBusStoreId(bus: number) {
  return 'auxbus' + bus;
}

/** cache id for an MtxBus */
export function mtxBusStoreId(bus: number) {
  return 'mtxbus' + bus;
}
