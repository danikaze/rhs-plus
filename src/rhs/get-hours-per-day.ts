// tslint:disable: no-magic-numbers
import { DayInfo } from '../interfaces';
import { getRhsTable } from '../utils/rhs-table';

/**
 * Get all the available information for days from the list page
 */
export function getHoursPerDay(currentInfo?: DayInfo[]): DayInfo[] {
  const dateElem = document.querySelector('.sp_kintai_kikan') as HTMLElement;
  const year = Number(/(\d+)\//.exec(dateElem.innerText)[1]);

  const tr = Array.from(document.querySelectorAll('#APPROVALGRD tr')).filter(
    (tr) =>
      !tr.children[0].classList.contains('mg_header') &&
      !tr.children[0].classList.contains('mg_sum')
  );
  const daysInfo = tr.map(getDayRowInfo.bind(null, year)) as DayInfo[];

  if (currentInfo) {
    currentInfo.forEach((day) => {
      const newDay = daysInfo.find(
        (newDay) =>
          newDay.date.day === day.date.day &&
          newDay.date.month === day.date.month &&
          newDay.date.year === day.date.year
      );
      // add existing info that can't be retrieved from the page (internal info set by this widget)
      if (newDay) {
        newDay.autoInput = day.autoInput;
      }
    });
  }

  return daysInfo;
}

/**
 * Get information from one row
 */
function getDayRowInfo(year: number, tr: HTMLTableRowElement, rowIndex: number): DayInfo {
  const row = getRhsTable().getDataRow(rowIndex);

  const date = row.getDate(year);
  const inputButton = row.getInputButton();
  const checkbox = row.getCheckbox();
  const state = row.getState();
  const worked = row.getWorkedMinutes();
  const gateRecording = row.getGateRecording();

  return {
    inputButton,
    checkbox,
    state,
    worked,
    date,
    gateRecording,
  };
}
