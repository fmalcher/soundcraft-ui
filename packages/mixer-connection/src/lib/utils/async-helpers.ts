/**
 * Returns a promise that resolves delayed by `delayMs` milliseconds
 */
export function resolveDelayed(delayMs: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(() => resolve(), delayMs));
}
