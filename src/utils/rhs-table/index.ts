import { ColumnsSettings } from '../settings';
import { COLUMN_NAMES } from './constants';
import { RhsTableRow } from './rhs-table-row';

class RhsTable implements Iterable<RhsTableRow> {
  public readonly length: number;
  private readonly allRows: HTMLTableCellElement[][] = [];
  private readonly dataRows: HTMLTableCellElement[][] = [];

  constructor(table: HTMLTableElement) {
    const rows = Array.from(table.querySelectorAll('tr'));
    for (const row of rows) {
      const rawRow = Array.from(row.children) as HTMLTableCellElement[];
      this.allRows.push(rawRow);
      const classes = rawRow[0].className;
      if (classes.includes('header') || classes.includes('sum')) continue;
      this.dataRows.push(rawRow);
    }
    this.length = this.dataRows.length;
  }

  public hideColumns(hiddenColumns: (keyof ColumnsSettings)[]): void {
    for (const cells of this.allRows) {
      let i = 0;
      for (const cell of cells) {
        if (hiddenColumns.includes(COLUMN_NAMES[i])) {
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

  public [Symbol.iterator](): Iterator<RhsTableRow> {
    let row = 0;
    return {
      next: () => {
        row++;
        return {
          done: row === this.dataRows.length,
          value: this.getDataRow(row),
        };
      },
    };
  }
}

let rhsTable: RhsTable;

export function getRhsTable() {
  if (!rhsTable) {
    rhsTable = new RhsTable(document.querySelector('table#APPROVALGRD'));
  }
  return rhsTable;
}
