export type DayState =
  | 'approving' // holiday applied but not yet approved
  | 'pending' // not input yet
  | 'draft' // saved as draft
  | 'inputted' // input completed
  | 'confirmed' //
  | 'holiday' // confirmed holiday
  | 'unknown';
export type DayType = 'regular' | 'asakai' | 'holiday';
export type Page = 'list' | 'input' | 'confirm' | 'logout' | 'error' | 'batch' | 'wagedetail';
export type Action = 'waiting' | 'autofill' | 'autoinput';
export type InputOffsetDay = -1 | 0 | 1;
export type Minutes = number;

export interface InputHours {
  entryH: number;
  entryM: number;
  entryDay?: InputOffsetDay;
  exitH: number;
  exitM: number;
  exitDay?: InputOffsetDay;
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
  worked: Minutes;
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
  // average worked time until current day
  workedAverage: Minutes;
  // average worked time including the rest of the month
  projectedAverage: Minutes;
  summary: {
    draft: number;
    inputted: number;
    holiday: number;
    pending: number;
  };
}
