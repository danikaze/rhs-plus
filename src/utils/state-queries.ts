import { DayInfo, DayState } from '../interfaces';
import { getState } from '../utils/state';

export function getNextDayToFill(): DayInfo {
  const day = getState().days.find(day => day.state === 'pending');

  if (!day || (!day.gateRecording && day.date.type !== 'holiday')) {
    return;
  }

  return day;
}

export function getDayInfo(year: number, month: number, day: number): DayInfo {
  return getState().days.find(
    ({ date }) => date.day === day && date.month === month && date.year === year
  );
}

export function getDaysByState(state: DayState): DayInfo[] {
  return getState().days.filter(day => day.state === state);
}
