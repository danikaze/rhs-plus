import { State } from '../interfaces';
import { detectPage } from '../rhs/detect-page';
import { updateUi } from '../ui';
import { log } from './log';
import { extendObjectsOnly } from './extend-objects-only';
import { Settings } from './settings';

let state: State;

export async function initState(): Promise<State> {
  if (!state) {
    state = await loadState();
    state.page = detectPage();
    log(`Current page detected: ${state.page}`);
  }

  return state;
}

export function getState(): State {
  return state;
}

export async function updateState(settings: Settings, update?: Partial<State>): Promise<State> {
  extendObjectsOnly(state, update);
  state.updated = new Date().getTime();
  updateUi(settings, state);
  await saveState();

  return state;
}

export function clearState(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.clear(() => {
      resolve();
      log('State reset.');
    });
  });
}

async function loadState(): Promise<State> {
  return new Promise((resolve) => {
    chrome.storage.local.get({ state: { updated: 0 } }, (result) => {
      const loaded = result.state;
      if (loaded.updated + STATE_TIMEOUT < new Date().getTime()) {
        log('State expired. Creating new one.');
        resolve({});
      } else {
        log('State loaded', loaded);
        resolve(loaded);
      }
    });
  });
}

function saveState(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ state }, () => {
      resolve();
      log('State stored', state);
    });
  });
}
