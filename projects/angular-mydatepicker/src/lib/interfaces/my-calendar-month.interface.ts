import { IMyDate } from './my-date.interface';

export interface IMyCalendarMonth {
  nbr: number;
  name: string;
  currMonth: boolean;
  selected: boolean;
  disabled: boolean;
  firstDate?: IMyDate;
  lastDate?: IMyDate;
}
