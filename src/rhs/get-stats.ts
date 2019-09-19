import { MonthlyStats, State } from '../interfaces';
import { getDaysByState } from '../utils/state-queries';

export function getStats(state: State): MonthlyStats {
  return {
    average: getAverage(state),
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

function getAverage(state: State) {
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
