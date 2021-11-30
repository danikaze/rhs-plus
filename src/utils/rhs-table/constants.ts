// tslint:disable: no-magic-numbers
import { ColumnsSettings } from '../settings';

interface RhsTableColumnDefinition {
  id: keyof ColumnsSettings;
  name: string;
  colspan: number;
}

// list of columns and their colspan
export const COLUMNS_DEFINITION: Record<keyof ColumnsSettings, RhsTableColumnDefinition> = {
  date: {
    id: 'date',
    name: 'Date',
    colspan: 1,
  },
  weekday: {
    id: 'weekday',
    name: 'Weekday',
    colspan: 1,
  },
  inputButton: {
    id: 'inputButton',
    name: 'Input button',
    colspan: 1,
  },
  actionButton: {
    id: 'actionButton',
    name: 'Action Button',
    colspan: 1,
  },
  status: {
    id: 'status',
    name: 'Status',
    colspan: 1,
  },
  substituteButton: {
    id: 'substituteButton',
    name: 'Substitute button',
    colspan: 1,
  },
  attendanceClassification: {
    id: 'attendanceClassification',
    name: 'Attendance classification',
    colspan: 1,
  },
  workingHours: {
    id: 'workingHours',
    name: 'Working hours',
    colspan: 1,
  },
  webRecording: {
    id: 'webRecording',
    name: 'Web Recording',
    colspan: 1,
  },
  gateRecording: {
    id: 'gateRecording',
    name: 'Gate Recording',
    colspan: 1,
  },
  accumulatedHolidaysData: {
    id: 'accumulatedHolidaysData',
    name: 'Data of Accumulated Holidays',
    colspan: 3,
  },
  totalWorkingHours: {
    id: 'totalWorkingHours',
    name: 'Total Working Hours',
    colspan: 1,
  },
  lateNightOvertime: {
    id: 'lateNightOvertime',
    name: 'Late-night overtime',
    colspan: 1,
  },
  holidayWork: {
    id: 'holidayWork',
    name: 'Holiday work',
    colspan: 1,
  },
  rSatellite: {
    id: 'rSatellite',
    name: 'R-Satellite',
    colspan: 1,
  },
  application: {
    id: 'application',
    name: 'Application',
    colspan: 1,
  },
  trainDelay: {
    id: 'trainDelay',
    name: 'Train delay',
    colspan: 1,
  },
  report: {
    id: 'report',
    name: 'Report',
    colspan: 1,
  },
  excess: {
    id: 'excess',
    name: 'Excess of statutory working hours',
    colspan: 1,
  },
};

/**
 * RHS displays different columns depending on the status
 */
export function getColumsDefinition(): RhsTableColumnDefinition[] {
  const notSubmitted = document.querySelector('[id^="BTNDCDS"]') !== null;

  const cols = [
    COLUMNS_DEFINITION.date,
    COLUMNS_DEFINITION.weekday,
    COLUMNS_DEFINITION.inputButton,
  ];

  if (notSubmitted) {
    cols.push(COLUMNS_DEFINITION.actionButton);
  }

  cols.push(
    COLUMNS_DEFINITION.status,
    COLUMNS_DEFINITION.substituteButton,
    COLUMNS_DEFINITION.attendanceClassification,
    COLUMNS_DEFINITION.workingHours,
    COLUMNS_DEFINITION.webRecording,
    COLUMNS_DEFINITION.gateRecording,
    COLUMNS_DEFINITION.accumulatedHolidaysData,
    COLUMNS_DEFINITION.totalWorkingHours,
    COLUMNS_DEFINITION.lateNightOvertime,
    COLUMNS_DEFINITION.holidayWork,
    COLUMNS_DEFINITION.rSatellite,
    COLUMNS_DEFINITION.application,
    COLUMNS_DEFINITION.trainDelay,
    COLUMNS_DEFINITION.report,
    COLUMNS_DEFINITION.excess
  );

  return cols;
}

// list of column indexes (i.e. [a, b, c, d, d, d, e, f...])
// calculated from the columnsOrder and their colspan
export const COLUMN_IDS = (() => {
  const def = getColumsDefinition();
  const cols: (keyof ColumnsSettings)[] = [];
  for (const { id, colspan } of def) {
    for (let i = 0; i < colspan; i++) {
      cols.push(id);
    }
  }
  return cols;
})();
