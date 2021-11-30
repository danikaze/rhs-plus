import { classes } from '../ui/styles';
import { applyStyle, createElement } from '../utils/dom';
import { getRhsTable } from '../utils/rhs-table';

/**
 * Align all checkboxes of the RhsTable vertically for better usability
 */
export function alignCheckboxes() {
  const rhsTable = getRhsTable();

  for (let i = 0; i < rhsTable.length; i++) {
    const row = rhsTable.getDataRow(i);
    const cell = row.getCell('date');
    const cb = row.getCheckbox();
    const label = cell.querySelector('label');
    if (!cb || !label) continue;

    cell.innerHTML = '';
    const container = createElement('div', { style: classes.dateCol, insertTo: cell });
    applyStyle(cb, classes.dateCheckbox);
    applyStyle(label, classes.dateLabel);
    container.appendChild(cb);
    container.appendChild(label);
  }
}
