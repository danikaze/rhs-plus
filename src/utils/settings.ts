import { log } from './log';

export type AutoFillAction = 'draft' | 'input';

export interface WeekDaySettings {
  offsetStart: number; // minutes after gate recording-in per week-day
  offsetEnd: number; // minutes before gate recording-out per week-day
  clipStart: string; // earliest time to input as start time
  clipEnd: string; // latest time to input as end time
}

export interface ColumnsSettings {
  date: boolean;
  weekday: boolean;
  inputButton: boolean;
  actionButton: boolean;
  status: boolean;
  substituteButton: boolean;
  attendanceClassification: boolean;
  workingHours: boolean;
  webRecording: boolean;
  gateRecording: boolean;
  accumulatedHolidaysData: boolean;
  totalWorkingHours: boolean;
  lateNightOvertime: boolean;
  holidayWork: boolean;
  rSatellite: boolean;
  application: boolean;
  trainDelay: boolean;
  report: boolean;
  excess: boolean;
}

export interface Settings {
  version: string;
  translate: boolean;
  autofillAction: AutoFillAction;
  dayType: { [type: string]: WeekDaySettings };
  weekDay: WeekDaySettings[];
  columns: ColumnsSettings;
}

export const defaultSettings: Settings = {
  version: APP_VERSION,
  translate: true,
  autofillAction: 'draft',
  dayType: {
    regular: { offsetStart: 0, offsetEnd: 0, clipStart: undefined, clipEnd: undefined },
    asakai: { offsetStart: 0, offsetEnd: 0, clipStart: undefined, clipEnd: undefined },
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
  columns: {
    date: true,
    weekday: true,
    inputButton: true,
    actionButton: true,
    status: true,
    substituteButton: true,
    attendanceClassification: true,
    workingHours: true,
    webRecording: true,
    gateRecording: true,
    accumulatedHolidaysData: true,
    totalWorkingHours: true,
    lateNightOvertime: true,
    holidayWork: true,
    rSatellite: true,
    application: true,
    trainDelay: true,
    report: true,
    excess: true,
  },
};

/**
 *
 */
export async function saveSettings(settings: Settings): Promise<void> {
  return new Promise<void>((resolve) => {
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
  return new Promise((resolve) => {
    chrome.storage.sync.get('settings', async ({ settings }) => {
      if (settings) {
        log('Settings loaded', settings);
        resolve(await upgradeSettings(settings));
      } else {
        log('No settings found, using default ones');
        resolve(defaultSettings);
      }
    });
  });
}

/**
 *
 */
async function upgradeSettings(settings: Settings): Promise<Settings> {
  if (settings.version === APP_VERSION) {
    return settings;
  }
  log(`Upgrading settings from ${settings.version} to ${APP_VERSION}`);

  // prior 0.3.0
  if (!settings.columns) {
    settings.columns = defaultSettings.columns;
  }

  // prior 0.5.0
  if (settings.translate === undefined) {
    settings.translate = defaultSettings.translate;
  }

  // prior 0.6.2
  if (settings.columns.rSatellite === undefined) {
    settings.columns.rSatellite = defaultSettings.columns.rSatellite;
  }

  // store update settings
  settings.version = APP_VERSION;
  await saveSettings(settings);

  return settings;
}
