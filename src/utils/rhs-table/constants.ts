// tslint:disable: no-magic-numbers
import { ColumnsSettings } from '../settings';

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
export const COLUMN_NAMES = (() => {
  const cols: (keyof ColumnsSettings)[] = [];
  for (const [name, colspan] of COLUMNS_ORDER) {
    for (let i = 0; i < colspan; i++) {
      cols.push(name);
    }
  }
  return cols;
})();
