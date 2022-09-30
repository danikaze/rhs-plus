/**
 * Return the first non `null` argument
 */
export function coalesce<T>(...args: T[]): T | null {
  for (const arg of args) {
    if (arg !== null) return arg;
  }
  return null;
}
