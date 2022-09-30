// tslint:disable: no-console

const MAX_LOGS_TO_STORE = 200;
const PREFIX = '[RHS+]';
const queueToStore: StoredLog[] = [];
let syncing = false;

export function log(...args: unknown[]) {
  storeLog('log', ...args);
  if (VERBOSE) console.info(PREFIX, ...args);
}

export function warn(...args: unknown[]) {
  storeLog('warn', ...args);
  if (VERBOSE) console.warn(PREFIX, ...args);
}

export function error(...args: unknown[]) {
  storeLog('error', ...args);
  if (VERBOSE) console.error(PREFIX, ...args);
}

export type LogLevel = 'log' | 'warn' | 'error';
export interface StoredLog {
  time: number;
  level: LogLevel;
  args: unknown[];
}

async function storeLog(level: LogLevel, ...args: unknown[]): Promise<void> {
  const time = Date.now();
  const data: StoredLog = {
    level,
    args,
    time,
  };
  queueToStore.push(data);

  if (syncing) return;

  syncing = true;
  await syncLogs();
  syncing = false;
}

async function syncLogs(): Promise<void> {
  // move queueToStore data to dataToSync to avoid async problems
  const dataToSync: StoredLog[] = [];
  while (queueToStore.length) {
    dataToSync.unshift(queueToStore.pop());
  }

  // get the last state
  let logs = await readLogs();
  logs.push(...dataToSync);
  logs.sort((a, b) => b.time - a.time);

  while (logs.length > MAX_LOGS_TO_STORE) {
    logs.pop();
  }

  return new Promise<void>((resolve) => {
    chrome.storage.local.set({ logs }, () => {
      if (queueToStore.length > 0) {
        syncLogs().then(resolve);
      } else {
        resolve();
      }
    });
  });
}

export async function readLogs(): Promise<StoredLog[]> {
  return new Promise<StoredLog[]>((resolve) => {
    chrome.storage.local.get('logs', ({ logs }) => resolve(logs || []));
  });
}
