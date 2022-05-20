import { log } from './log';
import { sendMessage } from './send-message';

export type AutoFillAction = 'draft' | 'input';
export type UseDefaultTime = 'no' | 'perDayType' | 'perWeekDay';

export interface WeekDaySettings {
  defaultStart: string | undefined; // default time to input when no gate time is recorded
  defaultEnd: string | undefined; // default time to input when no gate time is recorded
  offsetStart: number; // minutes after gate recording-in per week-day
  offsetEnd: number; // minutes before gate recording-out per week-day
  clipStart: string | undefined; // earliest time to input as start time
  clipEnd: string | undefined; // latest time to input as end time
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
  updateLegend: boolean;
  autofillAction: AutoFillAction;
  dayType: { [type: string]: WeekDaySettings };
  weekDay: WeekDaySettings[];
  columns: ColumnsSettings;
  useDefaultTime: UseDefaultTime;
  reminderEnabled: boolean;
  reminderTime: string | undefined;
}

export const defaultSettings: Settings = {
  version: APP_VERSION,
  translate: true,
  updateLegend: true,
  autofillAction: 'draft',
  dayType: {
    regular: {
      defaultStart: '09:00',
      defaultEnd: '17:30',
      offsetStart: 0,
      offsetEnd: 0,
      clipStart: undefined,
      clipEnd: undefined,
    },
    asakai: {
      defaultStart: '08:00',
      defaultEnd: '16:30',
      offsetStart: 0,
      offsetEnd: 0,
      clipStart: undefined,
      clipEnd: undefined,
    },
  },
  weekDay: [
    // Sunday
    {
      defaultStart: undefined,
      defaultEnd: undefined,
      offsetStart: 0,
      offsetEnd: 0,
      clipStart: undefined,
      clipEnd: undefined,
    },
    // Monday
    {
      defaultStart: '08:00',
      defaultEnd: '16:30',
      offsetStart: 0,
      offsetEnd: 0,
      clipStart: undefined,
      clipEnd: undefined,
    },
    // Tuesday
    {
      defaultStart: '09:00',
      defaultEnd: '17:30',
      offsetStart: 0,
      offsetEnd: 0,
      clipStart: undefined,
      clipEnd: undefined,
    },
    // Wednesday
    {
      defaultStart: '09:00',
      defaultEnd: '17:30',
      offsetStart: 0,
      offsetEnd: 0,
      clipStart: undefined,
      clipEnd: undefined,
    },
    // Thursday
    {
      defaultStart: '09:00',
      defaultEnd: '17:30',
      offsetStart: 0,
      offsetEnd: 0,
      clipStart: undefined,
      clipEnd: undefined,
    },
    // Friday
    {
      defaultStart: '09:00',
      defaultEnd: '17:30',
      offsetStart: 0,
      offsetEnd: 0,
      clipStart: undefined,
      clipEnd: undefined,
    },
    // Saturday
    {
      defaultStart: undefined,
      defaultEnd: undefined,
      offsetStart: 0,
      offsetEnd: 0,
      clipStart: undefined,
      clipEnd: undefined,
    },
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
  useDefaultTime: 'perDayType',
  reminderEnabled: true,
  reminderTime: '17:00',
};

/**
 *
 */
export async function saveSettings(settings: Settings): Promise<void> {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set({ settings }, () => {
      resolve();
      log('Settings stored', settings);
      sendMessage({ settings, action: 'settingsUpdated' });
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

  // prior 0.6.5
  if (settings.useDefaultTime === undefined) {
    settings.useDefaultTime = defaultSettings.useDefaultTime;
  }
  settings.weekDay.forEach((day, i) => {
    if (day.defaultStart === undefined) {
      day.defaultStart = defaultSettings.weekDay[i].defaultStart;
    }
    if (day.defaultEnd === undefined) {
      day.defaultEnd = defaultSettings.weekDay[i].defaultEnd;
    }
  });
  Object.entries(settings.dayType).forEach(([type, day]) => {
    if (day.defaultStart === undefined) {
      day.defaultStart = defaultSettings.weekDay[type].defaultStart;
    }
    if (day.defaultEnd === undefined) {
      day.defaultEnd = defaultSettings.weekDay[type].defaultEnd;
    }
  });
  if (settings.reminderEnabled === undefined) {
    settings.reminderEnabled = defaultSettings.reminderEnabled;
  }
  if (settings.reminderTime === undefined) {
    settings.reminderTime = defaultSettings.reminderTime;
  }

  // store update settings
  settings.version = APP_VERSION;
  await saveSettings(settings);

  return settings;
}
