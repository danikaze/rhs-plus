import { InputHours, DateInfo } from '../interfaces';
import { error, log, warn } from '../utils/log';
import { updateState, getState } from '../utils/state';
import { getDayInfo, getDaysToFill, isAutoFilling } from '../utils/state-queries';
import { Settings } from '../utils/settings';

const MIN_IN_HOUR = 60;

/**
 * From the list page, set the state action to auto-filling and
 * get the first day to fill, and start with it
 */
export async function autoFillList(settings: Settings) {
  const days = getDaysToFill();

  if (!days.length) {
    log('Nothing to autofill in the list. Stopping');
    await resetStateAction(settings);
    return;
  }

  log('Autofilling day hours from the list');
  await updateState(settings, { action: 'autofill' });
  days[0].inputButton.click();
}

/**
 * In the input page, insert the data and submit it
 */
export async function autoFillInput(settings: Settings) {
  if (!isAutoFilling()) return;

  const data = getDayInfo(document.querySelector<HTMLElement>('#HD > tbody > tr > td').innerText);
  if (!data.autoInput) return;

  const errors = Array.from(document.getElementsByClassName('error')) as HTMLElement[];
  if (errors.length > 0) {
    const errorDetails = errors.map((error) => `- ${error.innerText}`).join('\n');
    error(
      `Error while autofilling hours for ${data.date.year}-${data.date.month}-${data.date.day} (${data.date.type}). Skipping\n${errorDetails}`
    );

    data.autoInput = false;
    await updateState(settings);

    (document.querySelector('[name="btnGoBack0"]') as HTMLElement).click();
    return;
  }

  log(
    `Autofilling day hours of ${data.date.year}-${data.date.month}-${data.date.day} (${data.date.type})`
  );

  if (!data) {
    error('Day not found');
    await resetStateAction(settings);
  }

  const input = getDayInputHours(data.gateRecording, data.date, settings);
  if (input) {
    (document.getElementById('KNMTMRNGSTD') as HTMLSelectElement).value = String(
      input.entryDay || 0
    );
    (document.getElementById('KNMTMRNGSTH') as HTMLInputElement).value = String(input.entryH);
    (document.getElementById('KNMTMRNGSTM') as HTMLInputElement).value = String(input.entryM);
    (document.getElementById('KNMTMRNGETD') as HTMLSelectElement).value = String(
      input.exitDay || 0
    );
    (document.getElementById('KNMTMRNGETH') as HTMLInputElement).value = String(input.exitH);
    (document.getElementById('KNMTMRNGETM') as HTMLInputElement).value = String(input.exitM);
    // if there's no gate recording data and it's not a weekday, we don't touch it
  } else if (data.date.type !== 'holiday') {
    data.state = 'unknown';
    await updateState(settings);

    (document.querySelector('[name="btnGoBack0"]') as HTMLElement).click();
    return;
  }

  if (settings.autoCheckSatellite) {
    const checked = data.date.type !== 'holiday' && data.gateRecording === undefined;
    (document.getElementById('GI_CHECKBOX13_Seq0') as HTMLInputElement).checked = checked;
  }

  document.getElementById('btnNext0').click();
}

/**
 * In the input confirmation page, submit the data
 */
export async function autoFillConfirm(settings: Settings) {
  if (!isAutoFilling()) return;

  const day = getDayInfo(document.getElementById('daily_aera_inside').innerText);
  log(`Confirming day hours of ${day.date.year}-${day.date.month}-${day.date.day}`);

  const button =
    INPUT_TYPE === 'draft'
      ? document.getElementById('dSave0')
      : document.getElementById('dSubmission0');

  day.autoInput = false;
  await updateState(settings);
  button.click();
}

/**
 *
 */
export async function resetStateAction(settings: Settings) {
  log('Stopping autofill');

  const state = getState();
  state.action = 'waiting';
  getDaysToFill().forEach((day) => {
    delete day.autoInput;
  });

  await updateState(settings);
}

/**
 * Return the input hours for one day from the gate recording, after applying the settings
 */
function getDayInputHours(
  gateRecording: InputHours,
  dateInfo: DateInfo,
  settings: Settings
): InputHours | undefined {
  if (!gateRecording && settings.useDefaultTime === 'no') return;
  const dayDate = new Date(`${dateInfo.year}-${dateInfo.month}-${dateInfo.day}`);
  if (!gateRecording) {
    const daySetting =
      settings.useDefaultTime === 'perDayType'
        ? settings.dayType[dateInfo.type]
        : settings.weekDay[dayDate.getDay()];
    if (!daySetting) return;

    try {
      const entry = timeToObject(daySetting.defaultStart);
      const exit = timeToObject(daySetting.defaultEnd);
      return entry && exit
        ? {
            entryH: entry[0],
            entryM: entry[1],
            exitH: exit[0],
            exitM: exit[1],
          }
        : undefined;
    } catch (e) {
      warn(e);
    }
  }
  const weekDaySettings = settings.weekDay[dayDate.getDay()];
  const dayTypeSettings = settings.dayType[dateInfo.type];

  let hours = gateRecording;
  hours = clipStartTime(hours, weekDaySettings.clipStart);
  hours = clipEndTime(hours, weekDaySettings.clipEnd);
  hours = clipStartTime(hours, dayTypeSettings && dayTypeSettings.clipStart);
  hours = clipEndTime(hours, dayTypeSettings && dayTypeSettings.clipEnd);

  const entryTime = addMinutes(
    'entry',
    Math.max(weekDaySettings.offsetStart, (dayTypeSettings && dayTypeSettings.offsetStart) || 0),
    hours
  );
  const exitTime = addMinutes(
    'exit',
    -Math.max(weekDaySettings.offsetEnd, (dayTypeSettings && dayTypeSettings.offsetEnd) || 0),
    hours
  );

  return {
    ...gateRecording,
    ...entryTime,
    ...exitTime,
  };
}

type EntryTime = Pick<InputHours, 'entryH' | 'entryM'>;
type ExitTime = Pick<InputHours, 'exitH' | 'exitM'>;

function addMinutes(prefix: 'entry', offset: number, time: EntryTime): EntryTime;
function addMinutes(prefix: 'exit', offset: number, time: ExitTime): ExitTime;
function addMinutes(prefix: string, offset: number, time: InputHours): EntryTime | ExitTime {
  let m = time[`${prefix}M`] + offset;
  let h = time[`${prefix}H`];

  while (m < 0) {
    m += MIN_IN_HOUR;
    h--;
  }
  while (m > MIN_IN_HOUR) {
    m -= MIN_IN_HOUR;
    h++;
  }

  return {
    [`${prefix}H`]: h,
    [`${prefix}M`]: m,
  } as EntryTime | ExitTime;
}

function timeToObject(time: string | undefined): [number, number] | undefined {
  if (!time) return;
  const [h, m] = time.split(':').map((s) => Number(s));
  if (isNaN(h) || isNaN(m)) throw new Error(`Wrong time: "${time}"`);

  return [h, m];
}

function clipStartTime(gateRecording: InputHours, clipTime: string): InputHours {
  if (!clipTime) {
    return gateRecording;
  }
  const [minH, minM] = clipTime.split(':').map((s) => Number(s));

  return {
    ...gateRecording,
    entryH: Math.max(gateRecording.entryH, minH),
    entryM:
      gateRecording.entryH > minH ? gateRecording.entryM : Math.max(gateRecording.entryM, minM),
  };
}

function clipEndTime(gateRecording: InputHours, clipTime: string): InputHours {
  if (!clipTime) {
    return gateRecording;
  }
  const [maxH, maxM] = clipTime.split(':').map((s) => Number(s));

  return {
    ...gateRecording,
    exitH: Math.min(gateRecording.exitH, maxH),
    exitM: gateRecording.exitH < maxH ? gateRecording.exitM : Math.min(gateRecording.exitM, maxM),
  };
}
