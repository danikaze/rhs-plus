import { getRhsTable } from '../utils/rhs-table';

export function enableMultiCheck() {
  let lastClickedRow = -1;
  const rhsTable = getRhsTable();
  const cbs: HTMLInputElement[] | undefined = [];

  for (let i = 0; i < rhsTable.length; i++) {
    const row = rhsTable.getDataRow(i);
    cbs[i] = row.getCheckbox();
    if (!cbs[i]) continue;
    cbs[i].addEventListener('click', (ev) => {
      if (lastClickedRow === -1 || !ev.shiftKey) {
        lastClickedRow = i;
        return;
      }

      const end = Math.max(i, lastClickedRow);
      const checked = cbs[i].checked;
      for (let j = Math.min(i, lastClickedRow); j < end; j++) {
        if (!cbs[j]) continue;
        cbs[j].checked = checked;
      }
      lastClickedRow = i;
    });
  }
}
