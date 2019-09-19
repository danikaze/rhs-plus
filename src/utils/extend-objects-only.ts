import { isObject } from 'vanilla-type-check/isObject';

/**
 * Deep extends objects (like jQuery.extend) but simply assign arrays
 * @param args List of objects to extend. Use a new object `{}` as the first argument to clone
 */
export function extendObjectsOnly<T>(...args: Partial<T>[]): Partial<T> {
  let target = args[0];

  if (!isObject(target)) {
    target = {};
  }

  for (let i = 1; i < args.length; i++) {
    const source = args[i];

    // ignore null/undefined source objects
    // tslint:disable-next-line:triple-equals
    if (source == undefined) {
      continue;
    }

    // extend the target
    Object.keys(source).forEach(key => {
      const value = source[key];

      // prevent infinite loops
      if (value === target) {
        return;
      }

      if (isObject(value)) {
        target[key] = extendObjectsOnly(target[key], value);
        // ignore undefined values (will copy null ones)
      } else if (value !== undefined) {
        target[key] = value;
      }
    });
  }

  return target;
}
