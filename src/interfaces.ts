export type DayState = 'pending' | 'draft' | 'inputted' | 'holiday' | 'unknown';
export type Page = 'list' | 'input' | 'confirm' | 'logout' | 'error';
export type Action = 'waiting' | 'autofill';

export interface DayInfo {
  inputButton: HTMLInputElement;
  checkbox: HTMLInputElement;
  isHoliday: boolean;
  isApplication: boolean;
  worked: number; // in minutes
  date: {
    day: number;
    month: number;
    year: number;
  };
  gateRecording?: {
    entryH: number;
    entryM: number;
    exitH: number;
    exitM: number;
  };
  state: DayState;
}

export interface State {
  action?: Action;
  days?: DayInfo[];
  page?: Page;
  updated?: number;
}

export interface MonthlyStats {
  average: number; // in minutes
  summary: {
    draft: number;
    inputted: number;
    holiday: number;
    pending: number;
  };
}
