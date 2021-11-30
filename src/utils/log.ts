// tslint:disable: no-console
const prefix = '[RHS+]';

export function log(...args) {
  if (VERBOSE) console.info(prefix, ...args);
}

export function warn(...args) {
  if (VERBOSE) console.warn(prefix, ...args);
}

export function error(...args) {
  if (VERBOSE) console.error(prefix, ...args);
}
