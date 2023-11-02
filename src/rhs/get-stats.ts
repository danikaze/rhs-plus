import { DayInfo, MonthlyStats, State } from '../interfaces';
import { getDaysByState } from '../utils/state-queries';

export function getStats(state: State): MonthlyStats {
  return {
    workedAverage: getWorkedAverage(state),
    projectedAverage: getProjectedAverage(state),
    summary: getSummary(),
  };
}

function getSummary() {
  return {
    draft: getDaysByState('draft').length,
    inputted: getDaysByState('inputted').length,
    holiday: getDaysByState('holiday').length,
    pending: getDaysByState('pending').length,
  };
}

function isFutureDay({ date }: DayInfo): boolean {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  if (date.year < year) return false;
  if (date.year > year) return true;
  if (date.month < month) return false;
  if (date.month > month) return true;
  if (date.day > day) return true;
  return false;
}

function getWorkedAverage(state: State) {
  if (!state || !state.days) {
    return;
  }

  let days = 0;
  let time = 0;

  for (const day of state.days) {
    if (isFutureDay(day)) break;
    if (day.worked) {
      days++;
      time += day.worked;
    }
  }

  return time / days;
}

function getProjectedAverage(state: State) {
  if (!state || !state.days) {
    return;
  }

  let days = 0;
  let time = 0;

  for (const day of state.days) {
    if (day.worked) {
      days++;
      time += day.worked;
    }
  }

  return time / days;
}
