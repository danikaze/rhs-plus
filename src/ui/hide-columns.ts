import { ColumnsSettings } from '../utils/settings';
import { log } from '../utils/log';
import { rhsTable } from './columns';

export function hideColumns(settings: ColumnsSettings): void {
  const hiddenColumns = Object.keys(settings).filter(
    column => !settings[column]
  ) as (keyof ColumnsSettings)[];

  if (hiddenColumns.length === 0) {
    return;
  }

  log(`Hidding columns: ${hiddenColumns.join(', ')}`);
  rhsTable.hideColumns(hiddenColumns);
}
