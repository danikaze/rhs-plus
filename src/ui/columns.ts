// tslint:disable: no-magic-numbers
import { ColumnsSettings } from '../utils/settings';

// list of columns and their colspan
const COLUMNS_ORDER: [keyof ColumnsSettings, number][] = [
  ['date', 1],
  ['weekday', 1],
  ['inputButton', 1],
  ['actionButton', 1],
  ['status', 1],
  ['substituteButton', 1],
  ['attendanceClassification', 1],
  ['workingHours', 1],
  ['webRecording', 1],
  ['gateRecording', 1],
  ['accumulatedHolidaysData', 3],
  ['totalWorkingHours', 1],
  ['lateNightOvertime', 1],
  ['holidayWork', 1],
  ['application', 1],
  ['trainDelay', 1],
  ['report', 1],
  ['excess', 1],
];

// list of column indexes (i.e. [a, b, c, d, d, d, e, f...])
// calculated from the columnsOrder and their colspan
const columnNames = (() => {
  const cols: (keyof ColumnsSettings)[] = [];
  for (const [name, colspan] of COLUMNS_ORDER) {
    for (let i = 0; i < colspan; i++) {
      cols.push(name);
    }
  }
  return cols;
})();

class RhsTable {
  private readonly allRows: HTMLTableCellElement[][] = [];
  private readonly dataRows: HTMLTableCellElement[][] = [];

  constructor(table: HTMLTableElement) {
    const rows = Array.from(table.querySelectorAll('tr'));
    for (const row of rows) {
      const rawRow = Array.from(row.children) as HTMLTableCellElement[];
      this.allRows.push(rawRow);
      if (rawRow[0].className.includes('header')) continue;
      this.dataRows.push(rawRow);
    }
  }

  public hideColumns(hiddenColumns: (keyof ColumnsSettings)[]): void {
    for (const cells of this.allRows) {
      let i = 0;
      for (const cell of cells) {
        if (hiddenColumns.includes(columnNames[i])) {
          cell.style.display = 'none';
        }
        i += cell.colSpan;
      }
    }
  }

  public getDataRow(index: number): RhsTableRow | undefined {
    const row = this.dataRows[index];
    if (!row) return;
    return new RhsTableRow(row);
  }
}

class RhsTableRow {
  private readonly row: HTMLTableCellElement[];

  constructor(row: HTMLTableCellElement[]) {
    this.row = row;
  }

  public getCell(column: keyof ColumnsSettings, sub: number = 0): HTMLTableCellElement | undefined {
    let index = 0;
    for (let i = 0; i <= sub; i++) {
      index = columnNames.indexOf(column, index);
      if (index === -1) return;
    }

    return this.row[index];
  }
}

export const rhsTable = new RhsTable(document.querySelector('table#APPROVALGRD'));
