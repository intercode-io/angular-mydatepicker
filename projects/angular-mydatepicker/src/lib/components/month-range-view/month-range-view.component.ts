import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation} from "@angular/core";
import {IMyCalendarMonth} from "../../interfaces/my-calendar-month.interface";
import {IMyOptions} from "../../interfaces/my-options.interface";
import {KeyCode} from "../../enums/key-code.enum";
import {UtilService} from "../../services/angular-mydatepicker.util.service";
import {OPTS, MONTHS} from "../../constants/constants";
import { IMyDate } from '../../interfaces/my-date.interface';
import { IMyDateRange } from '../../interfaces/my-date-range.interface';
import { IMyWeek } from '../../interfaces/my-week.interface';

@Component({
  selector: "lib-month-range-view",
  templateUrl: "./month-range-view.component.html",
  providers: [UtilService],
  encapsulation: ViewEncapsulation.None
})
export class MonthRangeViewComponent implements OnChanges {
  @Input() opts: IMyOptions;
  @Input() months: Array<Array<IMyCalendarMonth>>;
  @Input() selectedDate: IMyDate;
  @Input() selectedDateRange: IMyDateRange;
  @Output() monthRangeCellClicked: EventEmitter<IMyCalendarMonth> = new EventEmitter<IMyCalendarMonth>();
  @Output() monthCellKeyDown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  constructor(private utilService: UtilService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty(OPTS)) {
      this.opts = changes[OPTS].currentValue;
    }
    if (changes.hasOwnProperty(MONTHS)) {
      console.log('months');
      console.log(this.months);
      this.months = changes[MONTHS].currentValue;
    }
  }

  onMonthCellClicked(event: any, cell: IMyCalendarMonth): void {
    event.stopPropagation();

    if (cell.disabled) {
      return;
    }

    this.monthRangeCellClicked.emit(cell);
  }

  onMonthCellKeyDown(event: KeyboardEvent, cell: IMyCalendarMonth) {
    const keyCode: number = this.utilService.getKeyCodeFromEvent(event);
    if (keyCode !== KeyCode.tab) {
      event.preventDefault();

      if (keyCode === KeyCode.enter || keyCode === KeyCode.space) {
        this.onMonthCellClicked(event, cell);
      }
      else if (this.opts.moveFocusByArrowKeys) {
        this.monthCellKeyDown.emit(event);
      }
    }
  }

  isDateInRange(date: IMyDate): boolean {
    return this.utilService.isDateInRange(date, this.selectedDateRange);
  }

  isDateSame(date: IMyDate): boolean {
    return this.utilService.isDateSame(this.selectedDate, date);
  }

  isDateRangeBeginOrEndSame(date: IMyDate): boolean {
    let range = this.selectedDateRange;

    // Makind styling think of end date as inlcuded into date range, without mutation
    if (this.opts.monthMode) {
      range = {
        begin: this.selectedDateRange.begin,
        end: {
          ...this.selectedDateRange.end,
          day: 1
        }
      };
    }
    return this.utilService.isDateRangeBeginOrEndSame(range, date);
  }

  onDayCellMouseEnter(cell: any): void {
    if (this.utilService.isInitializedDate(this.selectedDateRange.begin) && !this.utilService.isInitializedDate(this.selectedDateRange.end)) {
      for (const quarter of this.months) {
        for (const m of quarter) {
          m.range = this.utilService.isDateSameOrEarlier(this.selectedDateRange.begin, m.firstDate) && this.utilService.isDateSameOrEarlier(m.firstDate, cell.firstDate);
        }
      }
    }
  }

  onDayCellMouseLeave(): void {
    for (const quarter of this.months) {
      for (const m of quarter) {
        m.range = false;
      }
    }
  }
}
