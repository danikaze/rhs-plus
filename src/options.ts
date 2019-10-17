import {
  Settings,
  loadSettings,
  WeekDaySettings,
  defaultSettings,
  saveSettings,
  AutoFillAction,
} from './utils/settings';
import { createElement } from './utils/dom';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let lastSettings: Settings;

document.addEventListener('DOMContentLoaded', async () => {
  // input the version
  document.getElementById('app-version').innerText = APP_VERSION;

  // create the per-week table HTML based on the first day (Sunday)
  const day = document.getElementById('day-0');
  for (let i = 1; i < DAY_NAMES.length; i++) {
    createElement('tr', {
      id: `day-${i}`,
      innerHTML: day.innerHTML.replace(DAY_NAMES[0], DAY_NAMES[i]),
      insertTo: day.parentElement,
    });
  }

  // set buttons behavior
  document.getElementById('btn-save').addEventListener('click', saveValues);
  document.getElementById('btn-restore').addEventListener('click', restoreValues);
  document.getElementById('btn-default').addEventListener('click', setDefaultValues);

  // populate tables
  lastSettings = await loadSettings();
  populateValues(lastSettings);
});

function populateValues(settings: Settings): void {
  (document.getElementById('autofill-action') as HTMLInputElement).value = settings.autofillAction;
  populatePerDayTypeTable(settings);
  populatePerWeekTable(settings);
  M.AutoInit();
}

/**
 * Fill the values of the per day type table
 */
function populatePerDayTypeTable(settings: Settings): void {
  Object.keys(settings.dayType).forEach(type => {
    const tr = document.getElementById(`day-${type}`) as HTMLTableRowElement;
    const day = settings.dayType[type];
    populateDayRow(tr, day);
  });
}

/**
 * Fill the values of the per week-day table
 */
function populatePerWeekTable(settings: Settings) {
  for (let i = 0; i < DAY_NAMES.length; i++) {
    const tr = document.getElementById(`day-${i}`) as HTMLTableRowElement;
    const day = settings.weekDay[i];
    populateDayRow(tr, day);
  }
}

/**
 * Fill the values of one day row with the provided settings
 */
function populateDayRow(tr: HTMLTableRowElement, settings: WeekDaySettings) {
  if (!settings) return;
  tr.querySelector<HTMLInputElement>('.offset-start').value = String(settings.offsetStart);
  tr.querySelector<HTMLInputElement>('.offset-end').value = String(settings.offsetEnd);
  tr.querySelector<HTMLInputElement>('.clip-start').value = settings.clipStart || '';
  tr.querySelector<HTMLInputElement>('.clip-end').value = settings.clipEnd || '';
}

function readDayRow(tr: HTMLTableRowElement): WeekDaySettings {
  return {
    offsetStart: Number(tr.querySelector<HTMLInputElement>('.offset-start').value),
    offsetEnd: Number(tr.querySelector<HTMLInputElement>('.offset-end').value),
    clipStart: tr.querySelector<HTMLInputElement>('.clip-start').value,
    clipEnd: tr.querySelector<HTMLInputElement>('.clip-end').value,
  };
}

/**
 * Read and save the current values as settings
 */
async function saveValues() {
  const settings: Settings = {
    autofillAction: (document.getElementById('autofill-action') as HTMLInputElement)
      .value as AutoFillAction,
    dayType: {},
    weekDay: [],
  };

  // get values by day type
  let rows = Array.from(document.querySelectorAll('#settings-day-type tbody tr'));
  rows.forEach((tr: HTMLTableRowElement) => {
    try {
      const key = tr.id.match(/day-(.*)/)[1];
      if (!key) return;
      settings.dayType[key] = readDayRow(tr);
    } catch (e) {
      return;
    }
  });

  // get values by week day
  rows = Array.from(document.querySelectorAll('#settings-week-day tbody tr'));
  rows.forEach((tr: HTMLTableRowElement) => {
    try {
      const key = Number(tr.id.match(/day-(\d)/)[1]);
      if (key === undefined) return;
      settings.weekDay[key] = readDayRow(tr);
    } catch (e) {
      return;
    }
  });

  lastSettings = settings;
  await saveSettings(settings);
  toast('Saved!');
}

/**
 * Undo all the changes
 */
function restoreValues() {
  populateValues(lastSettings);
  toast('Values restored!');
}

/**
 * Restore all the settings with the default values
 */
async function setDefaultValues() {
  populateValues(defaultSettings);
  await saveSettings(defaultSettings);
  toast('Settings set as default values!');
}

function toast(text: string): void {
  M.toast({
    html: text,
    displayLength: 2000,
  });
}
