import { Injectable } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';

@Injectable()

export class AppDateAdapter extends NativeDateAdapter {

  public createDate(year: number, month: number, date: number): Date {

    const localDate = super.createDate(year, month, date);
    let hourNow = new Date().getHours();
    let minutesNow = new Date().getMinutes();
    let secondsNow = new Date().getSeconds();

    localDate.setHours(hourNow)
    localDate.setMinutes(minutesNow)
    localDate.setSeconds(secondsNow)
  
    return new Date(localDate); // utcDate
  }


  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
  format(date: Date, displayFormat: string): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    } else if (displayFormat === 'inputMonth') {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return this._to2digit(month) + '/' + year;
    } else {
      return date.toDateString();
    }
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}
export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
  },
  display: {
    dateInput: 'input',
    monthYearLabel: 'inputMonth',
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  }
};