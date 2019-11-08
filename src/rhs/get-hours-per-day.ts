// tslint:disable: no-magic-numbers
import { DayState, DayInfo, InputHours } from '../interfaces';
import { getChild } from '../utils/dom';

/**
 * Get all the available information for days from the list page
 */
export function getHoursPerDay(currentInfo?: DayInfo[]): DayInfo[] {
  const dateElem = document.querySelector('.sp_kintai_kikan') as HTMLElement;
  const year = Number(/(\d+)\//.exec(dateElem.innerText)[1]);

  const tr = Array.from(document.querySelectorAll('#APPROVALGRD tr')).filter(
    tr =>
      !tr.children[0].classList.contains('mg_header') &&
      !tr.children[0].classList.contains('mg_sum')
  );
  const daysInfo = tr.map(getDayRowInfo.bind(null, year)) as DayInfo[];

  if (currentInfo) {
    currentInfo.forEach(day => {
      const newDay = daysInfo.find(
        newDay =>
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
function getDayRowInfo(year: number, tr: HTMLTableRowElement): DayInfo {
  const dateText = getChild(tr, 0).innerText.toLowerCase();
  const dateMatch = dateText.match(/(\d+)\/(\d+)/);
  const month = Number(dateMatch[1]);
  const day = Number(dateMatch[2]);
  const isHoliday = dateText.indexOf('holiday') !== -1;
  const isAsakai = (() => {
    const cell = getChild(tr, 6);
    const opt = cell.querySelector<HTMLOptionElement>('option[selected]');
    if (opt) {
      return opt.innerText.match(/asakai/i) !== null;
    }
    return cell.innerText.match(/asakai/i) !== null;
  })();
  const inputButton = getChild(getChild(tr, 2), 0) as HTMLInputElement;
  const checkbox = getChild(tr, 0).querySelector('input');
  const state = getRowStatus(tr);
  const workedTimeMatch = getChild(tr, 10).innerText.match(/(\d+):(\d+)/);
  const worked = workedTimeMatch ? Number(workedTimeMatch[1]) * 60 + Number(workedTimeMatch[2]) : 0;

  return {
    inputButton,
    checkbox,
    state,
    worked,
    date: {
      year,
      month,
      day,
      type: isHoliday ? 'holiday' : isAsakai ? 'asakai' : 'regular',
    },
    gateRecording: getGateRecording(tr),
  };
}

/**
 * Get the day recording data for a day
 */
function getGateRecording(tr: HTMLTableRowElement): InputHours {
  const text = getChild(tr, 9).innerText;
  const hours = /(\d+):(\d+)[^\d]*(\d+):(\d+)/.exec(text);
  if (!hours) return;
  const entryDay = /Prev day.*--/i.test(text) ? -1 : /Next day.*--/i.test(text) ? 1 : 0;
  const exitDay = /--.*Prev day/i.test(text) ? -1 : /--.*Next day/i.test(text) ? 1 : 0;

  return {
    entryDay,
    exitDay,
    entryH: Number(hours[1]),
    entryM: Number(hours[2]),
    exitH: Number(hours[3]),
    exitM: Number(hours[4]),
  };
}

/**
 * Get the status of a day application
 */
function getRowStatus(tr): DayState {
  const map: { [k: string]: DayState } = {
    mg_app_approved: 'holiday',
    mg_dc_saved: 'inputted',
    mg_dc_confirmed: 'confirmed',
    mg_saved: 'draft',
    mg_normal: 'pending',
  };
  const statusClass = tr.children[4].className.toLowerCase();
  return map[statusClass];
}
