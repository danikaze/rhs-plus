import { State } from '../interfaces';
import { Settings } from './settings';

export type AppMessage =
  | {
      action: 'openOptionsPage';
    }
  | {
      action: 'settingsUpdated';
      settings: Settings;
    }
  | {
      action: 'stateUpdated';
      state: State;
    };

/**
 * Just a wrapper over `runtime.sendMessage` to provide types
 */
export function sendMessage(message: AppMessage): void {
  chrome.runtime.sendMessage(message);
}
