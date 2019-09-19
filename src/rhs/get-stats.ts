import { MonthlyStats, State } from '../interfaces';

export function getStats(state: State): MonthlyStats {
  return {
    average: getAverage(state),
    summary: getSummary(state),
  };
}

function getSummary(state: State) {
  return {
    draft: state.days.filter(day => day.state === 'draft').length,
    inputted: state.days.filter(day => day.state === 'inputted').length,
    holiday: state.days.filter(day => day.state === 'holiday').length,
    pending: state.days.filter(day => day.state === 'pending').length,
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
