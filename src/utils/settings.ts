import { log } from './log';

export type AutoFillAction = 'draft' | 'input';

export interface WeekDaySettings {
  offsetStart: number; // minutes after gate recording-in per week-day
  offsetEnd: number; // minutes before gate recording-out per week-day
  clipStart: string; // earliest time to input as start time
  clipEnd: string; // latest time to input as end time
}

export interface Settings {
  autofillAction: AutoFillAction;
  dayType: { [type: string]: WeekDaySettings };
  weekDay: WeekDaySettings[];
}

export const defaultSettings: Settings = {
  autofillAction: 'draft',
  dayType: {
    regular: { offsetStart: 0, offsetEnd: 0, clipStart: '09:00', clipEnd: undefined },
    asakai: { offsetStart: 0, offsetEnd: 0, clipStart: '08:00', clipEnd: undefined },
  },
  weekDay: [
    { offsetStart: 0, offsetEnd: 0, clipStart: undefined, clipEnd: undefined },
    { offsetStart: 0, offsetEnd: 0, clipStart: undefined, clipEnd: undefined },
    { offsetStart: 0, offsetEnd: 0, clipStart: undefined, clipEnd: undefined },
    { offsetStart: 0, offsetEnd: 0, clipStart: undefined, clipEnd: undefined },
    { offsetStart: 0, offsetEnd: 0, clipStart: undefined, clipEnd: undefined },
    { offsetStart: 0, offsetEnd: 0, clipStart: undefined, clipEnd: undefined },
    { offsetStart: 0, offsetEnd: 0, clipStart: undefined, clipEnd: undefined },
  ],
};

/**
 *
 */
export async function saveSettings(settings: Settings): Promise<void> {
  return new Promise<void>(resolve => {
    chrome.storage.sync.set({ settings }, () => {
      resolve();
      log('Settings stored', settings);
    });
  });
}

/**
 *
 */
export async function loadSettings(): Promise<Settings> {
  return new Promise(resolve => {
    chrome.storage.sync.get('settings', ({ settings }) => {
      if (settings) {
        log('Settings loaded', settings);
        resolve(settings);
      } else {
        log('No settings found, using default ones');
        resolve(defaultSettings);
      }
    });
  });
}
