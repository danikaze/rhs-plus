import { State } from '../interfaces';
import { extendObjectsOnly } from './extend-objects-only';
import { detectPage } from '../rhs/detect-page';
import { log } from './log';
import { updateUi } from '../ui';

let state: State;

export async function initState(): Promise<State> {
  if (!state) {
    state = await loadState();
    state.page = detectPage();
  }

  return state;
}

export function getState(): State {
  return state;
}

export async function updateState(update?: Partial<State>): Promise<State> {
  extendObjectsOnly(state, update);
  state.updated = new Date().getTime();
  updateUi(state);
  await saveState();

  return state;
}

async function loadState(): Promise<State> {
  return new Promise(resolve => {
    chrome.storage.local.get({ state: { updated: 0 } }, result => {
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
  return new Promise(resolve => {
    chrome.storage.local.set({ state }, () => {
      resolve();
      log('State stored', state);
    });
  });
}
