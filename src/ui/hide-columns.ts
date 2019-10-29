import { ColumnsSettings } from '../utils/settings';
import { log } from '../utils/log';

const columnsOrder = [
  'date',
  'weekday',
  'inputButton',
  'actionButton',
  'status',
  'substituteButton',
  'attendanceClassification',
  'workingHours',
  'webRecording',
  'gateRecording',
  'totalWorkingHours',
  'lateNightOvertime',
  'holidayWork',
  'application',
  'trainDelay',
  'report',
  'excess',
];

export function hideColumns(settings: ColumnsSettings): void {
  const hiddenColumns = Object.keys(settings).filter(column => !settings[column]);

  if (hiddenColumns.length === 0) {
    return;
  }
  log(`Hidding columns: ${hiddenColumns.join(', ')}`);

  const tbody = document.querySelector('#APPROVALGRD tbody');
  hiddenColumns.forEach(column => {
    if (!settings[column]) {
      const index = columnsOrder.indexOf(column);
      if (index !== -1) {
        Array.from(tbody.querySelectorAll(`tr > :nth-child(${index + 1})`)).forEach(
          (td: HTMLTableCellElement) => {
            td.style.display = 'none';
          }
        );
      }
    }
  });
}
