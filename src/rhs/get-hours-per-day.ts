// tslint:disable: no-magic-numbers
import { DayState, DayInfo } from '../interfaces';

/**
 * Get all the available information from days
 */
export function getHoursPerDay(): DayInfo[] {
  const dateElem = document.querySelector('.sp_kintai_kikan') as HTMLElement;
  const year = Number(/(\d+)\//.exec(dateElem.innerText)[1]);

  const tr = Array.from(document.querySelectorAll('#APPROVALGRD tr')).filter(
    tr =>
      !tr.children[0].classList.contains('mg_header') &&
      !tr.children[0].classList.contains('mg_sum')
  );
  return tr.map(getDayRowInfo.bind(null, year));
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
  const isApplication = getChild(tr, 0).innerText.match(/holiday/i) !== null;
  const inputButton = getChild(getChild(tr, 2), 0) as HTMLInputElement;
  const checkbox = getChild(tr, 0).querySelector('input');
  const gateRecording = /(\d+):(\d+)[^\d]*(\d+):(\d+)/.exec(getChild(tr, 9).innerText);
  const state = getRowStatus(tr);
  const workedTimeMatch = getChild(tr, 10).innerText.match(/(\d+):(\d+)/);
  const worked = workedTimeMatch ? Number(workedTimeMatch[1]) * 60 + Number(workedTimeMatch[2]) : 0;

  return {
    inputButton,
    checkbox,
    state,
    isHoliday,
    isApplication,
    worked,
    date: {
      year,
      month,
      day,
    },
    gateRecording: gateRecording && {
      entryH: Number(gateRecording[1]),
      entryM: Number(gateRecording[2]),
      exitH: Number(gateRecording[3]),
      exitM: Number(gateRecording[4]),
    },
  };
}

/**
 * Return a child of an HTMLElement as a HTMLElement
 */
function getChild(elem: HTMLElement, n: number): HTMLElement {
  return elem.children[n] as HTMLElement;
}

/**
 * Get the status of a day application
 */
function getRowStatus(tr): DayState {
  const map: { [k: string]: DayState } = {
    mg_app_approved: 'holiday',
    mg_dc_saved: 'inputted',
    mg_saved: 'draft',
    mg_normal: 'pending',
  };
  const statusClass = tr.children[4].className.toLowerCase();
  const classes = Object.keys(map);

  for (const c of classes) {
    if (statusClass === c) return map[c];
  }
}
