import { DayState, DateInfo, InputHours } from '../../interfaces';
import { ColumnsSettings } from '../settings';
import { COLUMN_IDS } from './constants';

export class RhsTableRow {
  private static readonly CLASS_STATE_MAP: { [k: string]: DayState } = {
    mg_app_approved: 'holiday',
    mg_dc_saved: 'inputted',
    mg_dc_confirmed: 'confirmed',
    mg_saved: 'draft',
    mg_normal: 'pending',
  };
  private readonly row: HTMLTableCellElement[];

  constructor(row: HTMLTableCellElement[]) {
    this.row = row;
  }

  public getCell(column: keyof ColumnsSettings, sub: number = 0): HTMLTableCellElement | undefined {
    let index = 0;
    for (let i = 0; i <= sub; i++) {
      index = COLUMN_IDS.indexOf(column, index);
      if (index === -1) return;
    }

    return this.row[index];
  }

  public getCheckbox(): HTMLInputElement | null {
    return this.getCell('date').querySelector('input');
  }

  public getInputButton(): HTMLInputElement | null {
    return this.getCell('inputButton').querySelector('input');
  }

  public getDate(year: number): DateInfo {
    const dateText = this.getCell('date')!.innerText.toLowerCase();
    const dateMatch = dateText.match(/(\d+)\/(\d+)/);
    const month = Number(dateMatch[1]);
    const day = Number(dateMatch[2]);

    const isHoliday = dateText.indexOf('holiday') !== -1;
    const isAsakai = (() => {
      const cell = this.getCell('attendanceClassification');
      const opt = cell.querySelector<HTMLOptionElement>('option[selected]');
      if (opt) {
        return opt.innerText.match(/asakai/i) !== null;
      }
      return cell.innerText.match(/asakai/i) !== null;
    })();

    const type = isHoliday ? 'holiday' : isAsakai ? 'asakai' : 'regular';

    return { day, month, year, type };
  }

  public getState(): DayState {
    const statusClass = this.getCell('status').className.toLowerCase();
    return RhsTableRow.CLASS_STATE_MAP[statusClass];
  }

  public getWorkedMinutes(): number {
    const workedTimeMatch = this.getCell('totalWorkingHours').innerText.match(/(\d+):(\d+)/);
    // tslint:disable-next-line:no-magic-numbers
    return workedTimeMatch ? Number(workedTimeMatch[1]) * 60 + Number(workedTimeMatch[2]) : 0;
  }

  public getGateRecording(): InputHours {
    const cell = this.getCell('gateRecording');
    const text = cell.innerText;
    const hours = /(\d+):(\d+)[^\d]*(\d+):(\d+)/.exec(text);
    if (!hours) return;
    const entryDay = /Prev day.*--/i.test(text) ? -1 : /Next day.*--/i.test(text) ? 1 : 0;
    const exitDay = /--.*Prev day/i.test(text) ? -1 : /--.*Next day/i.test(text) ? 1 : 0;

    // tslint:disable:no-magic-numbers
    return {
      entryDay,
      exitDay,
      entryH: Number(hours[1]),
      entryM: Number(hours[2]),
      exitH: Number(hours[3]),
      exitM: Number(hours[4]),
    };
  }
}
