import { DayInfo, DayState } from '../interfaces';
import { getState } from '../utils/state';

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
  return getState().days.filter(day => day.autoInput);
}

export function getDraftableDays(): DayInfo[] {
  return getState().days.filter(
    day =>
      day.state !== 'inputted' &&
      day.state !== 'confirmed' &&
      (day.gateRecording || day.date.type === 'holiday')
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
  return getState().days.filter(day => day.state === state);
}
