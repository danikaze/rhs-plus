import { DayInfo, DayState, DateInfo, State } from '../interfaces';
import { getState } from '../utils/state';
import { Settings } from './settings';

const ONE_DAY_MS = 86400000;
const DAY_SUN = 0;
const DAY_SAT = 6;

export function isAutoFilling(): boolean {
  const state = getState();
  return state.action === 'autofill' && getDaysToFill().length > 0;
}

export function isAutoDraftInput(): boolean {
  return getState().action === 'autoinput';
}

export function isWaiting(): boolean {
  return getState().action === 'waiting';
}

export function getDaysToFill(): DayInfo[] {
  return getState().days.filter((day) => day.autoInput);
}

export function getDraftableDays(settings: Settings): DayInfo[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  function isBeforeToday(date: DateInfo): boolean {
    return (
      date.year < year ||
      (date.year <= year && date.month < month) ||
      (date.year <= year && date.month <= month && date.day < day)
    );
  }

  return getState().days.filter(
    (day) =>
      isBeforeToday(day.date) &&
      day.state !== 'inputted' &&
      day.state !== 'confirmed' &&
      (day.gateRecording || settings.useDefaultTime !== 'no' || day.date.type === 'holiday')
  );
}

export function getDayInfo(date: string): DayInfo;
export function getDayInfo(year: number, month: number, day: number): DayInfo;
export function getDayInfo(year: number | string, month?: number, day?: number): DayInfo {
  // tslint:disable: no-magic-numbers
  let y: number;
  let m: number;
  let d: number;

  if (typeof year === 'string') {
    const match = /(\d+)\/(\d+)\/(\d+)/.exec(year);
    if (!match) return;
    y = Number(match[1]);
    m = Number(match[2]);
    d = Number(match[3]);
  } else {
    y = year;
    m = month;
    d = day;
  }

  return getState().days.find(({ date }) => date.day === d && date.month === m && date.year === y);
}

export function getDaysByState(state: DayState): DayInfo[] {
  return getState().days.filter((day) => day.state === state);
}

/**
 * Get the next working day with the time set as 'HH:MM'
 */
export function getNextWorkingDay(state: State, time: string): Date {
  const now = new Date();
  const nowStr = now.toLocaleString('ja');

  function toDate(date: DayInfo['date']): Date {
    return new Date(
      nowStr
        .replace(/\d{4}\/\d{1,2}\/\d{1,2}/, `${date.year}/${date.month}/${date.day}`)
        .replace(/\d\d:\d\d:\d\d/, `${time}:00`)
    );
  }

  const nextDayInfo =
    state.days &&
    state.days.find(({ date }) => {
      if (date.type === 'holiday') return false;
      if (toDate(date).getTime() < now.getTime()) return false;
      return true;
    });
  const nextDay = nextDayInfo && toDate(nextDayInfo.date);

  if (nextDay) return nextDay;

  // if there's no information (last working day of this month),
  // just return the next weekday of the next month
  const from = (state.days ? toDate(state.days[state.days.length - 1].date) : now) || now;
  do {
    from.setTime(from.getTime() + ONE_DAY_MS);
  } while (from.getDay() === DAY_SUN || from.getDay() === DAY_SAT);
  return from;
}
