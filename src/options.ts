import {
  Settings,
  loadSettings,
  WeekDaySettings,
  defaultSettings,
  saveSettings,
  AutoFillAction,
} from './utils/settings';
import { createElement } from './utils/dom';
import { clearState } from './utils/state';
import { toCamelCase } from './utils/to-camel-case';
import { toKebabCase } from './utils/to-kebab-case';
import { COLUMNS_DEFINITION } from './utils/rhs-table/constants';

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

  // create the list of columns
  const columnsContainer = document.getElementById('settings-columns');
  Object.values(COLUMNS_DEFINITION).forEach(({ id, name }) => {
    createElement('p', {
      insertTo: columnsContainer,
      innerHTML: `<label>
      <input type="checkbox" class="filled-in" id="column-${toKebabCase(id)}" />
      <span>${name}</span>
    </label>`,
    });
  });

  // set buttons behavior
  document.getElementById('btn-save').addEventListener('click', saveValues);
  document.getElementById('btn-restore').addEventListener('click', restoreValues);
  document.getElementById('btn-default').addEventListener('click', setDefaultValues);
  document.getElementById('btn-reset').addEventListener('click', resetState);

  // populate tables
  lastSettings = await loadSettings();
  populateValues(lastSettings);
});

function populateValues(settings: Settings): void {
  (document.getElementById('translate') as HTMLInputElement).checked = settings.translate;
  (document.getElementById('update-legend') as HTMLInputElement).checked = settings.updateLegend;
  (document.getElementById('autofill-action') as HTMLInputElement).value = settings.autofillAction;
  populatePerDayTypeTable(settings);
  populatePerWeekTable(settings);
  populateDisplayedColumns(settings);
  M.AutoInit();
}

/**
 * Fill the values of the per day type table
 */
function populatePerDayTypeTable(settings: Settings): void {
  Object.keys(settings.dayType).forEach((type) => {
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
 * Fill the values of the displayed columns
 */
function populateDisplayedColumns(settings: Settings) {
  Object.keys(settings.columns).forEach((name) => {
    if (settings.columns[name]) {
      const input = document.getElementById(`column-${toKebabCase(name)}`) as HTMLInputElement;
      input.checked = true;
    }
  });
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
    version: APP_VERSION,
    translate: (document.getElementById('translate') as HTMLInputElement).checked,
    updateLegend: (document.getElementById('update-legend') as HTMLInputElement).checked,
    autofillAction: (document.getElementById('autofill-action') as HTMLInputElement)
      .value as AutoFillAction,
    dayType: {},
    weekDay: [],
    columns: {
      date: false,
      weekday: false,
      inputButton: false,
      actionButton: false,
      status: false,
      substituteButton: false,
      attendanceClassification: false,
      workingHours: false,
      webRecording: false,
      gateRecording: false,
      accumulatedHolidaysData: false,
      totalWorkingHours: false,
      lateNightOvertime: false,
      holidayWork: false,
      rSatellite: false,
      application: false,
      trainDelay: false,
      report: false,
      excess: false,
    },
  };

  //

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

  // get visible headers
  Array.from(document.querySelectorAll('[id^="column-"]')).forEach((input: HTMLInputElement) => {
    const name = toCamelCase(input.id.replace(/^column-/, ''));
    const value = input.checked;
    settings.columns[name] = value;
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

/**
 * Reset the state
 */
async function resetState() {
  await clearState();
  toast('State reset!');
}

function toast(text: string): void {
  M.toast({
    html: text,
    displayLength: 2000,
  });
}
