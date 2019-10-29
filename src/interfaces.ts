export type DayState = 'pending' | 'draft' | 'inputted' | 'confirmed' | 'holiday' | 'unknown';
export type DayType = 'regular' | 'asakai' | 'holiday';
export type Page = 'list' | 'input' | 'confirm' | 'logout' | 'error' | 'batch';
export type Action = 'waiting' | 'autofill' | 'autoinput';

export interface InputHours {
  entryH: number;
  entryM: number;
  exitH: number;
  exitM: number;
}

export interface DateInfo {
  type: DayType;
  day: number;
  month: number;
  year: number;
}

export interface DayInfo {
  inputButton: HTMLInputElement;
  checkbox: HTMLInputElement;
  worked: number; // in minutes
  date: DateInfo;
  gateRecording?: InputHours;
  state: DayState;
  autoInput?: boolean;
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
