import {Component, OnInit} from '@angular/core';
import {IAngularMyDpOptions, IMyDateModel, IMyCalendarViewChanged, IMyRangeDateSelection} from '../../../projects/angular-mydatepicker/src/public-api';

@Component({
  selector: 'date-picker-inline',
  templateUrl: './date-picker-inline.html',
  styleUrls: ['./date-picker-inline.css']
})
export class DatePickerInline implements OnInit {
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    monthMode: true,
    defaultView: 2,
    inline: true,
    dateFormat: 'dd.mm.yyyy',
  };

  public selectedTextNormal: string = '';

  public validDate: boolean = false;
  public inputText: string = "";

  public model: IMyDateModel = null;   // not initial date set

  constructor() {
  }

  ngOnInit(): void {
    console.log('onInit(): DatePickerInline');
  }

  onDateRange(checked: boolean): void {
    this.model = null;
    let copy = this.getCopyOfOptions();
    copy.dateRange = checked;
    this.myDatePickerOptions = copy;
  }

  onSubmit(): void {
    console.log('onSubmit(): model: ', this.model);
  }

  onTodayPlus3(): void {
    let today: Date = new Date();
    let date: Date = new Date();
    date.setDate(date.getDate() + 3);

    this.model = {isRange: true, singleDate: null, dateRange: {
      beginDate: {year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate()},
      endDate: {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}
    }};
  }

  onYesterdayPlus3(): void {
    let today: Date = new Date();
    today.setDate(today.getDate() - 1);

    let date: Date = new Date();
    date.setDate(date.getDate() + 2);
    
    this.model = {isRange: true, singleDate: null, dateRange: {
      beginDate: {year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate()},
      endDate: {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()}
    }}; 
  }

  // callbacks
  onDateChanged(event: IMyDateModel): void {
    console.log('onDateChanged(): ', event);
    if (!event.isRange) {
      let {date, jsDate, formatted, epoc} = event.singleDate;
      if (formatted !== '') {
        this.selectedTextNormal = 'Formatted: ' + formatted + ' - epoc timestamp: ' + epoc;
        this.validDate = true;
        this.inputText = formatted;
      }
      else {
        this.selectedTextNormal = '';
      }
    }
    else {
      let {formatted} = event.dateRange;
      if (formatted !== '') {
        this.selectedTextNormal = 'Formatted: ' + formatted;
        this.validDate = true;
        this.inputText = formatted;
      }
      else {
        this.selectedTextNormal = '';
      }
    }
  }

  onCalendarViewChanged(event: IMyCalendarViewChanged): void {
    console.log('onCalendarViewChanged(): Year: ', event.year, ' - month: ', event.month, ' - first: ', event.first, ' - last: ', event.last);
  }

  onDateRangeSelection(event: IMyRangeDateSelection): void {
    console.log('onDateRangeSelection(): event: ', event);
  }

  getCopyOfOptions(): IAngularMyDpOptions {
    return JSON.parse(JSON.stringify(this.myDatePickerOptions));
  }
}
