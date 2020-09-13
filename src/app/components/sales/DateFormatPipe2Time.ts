import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe2Time extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return super.transform(value, 'HH:mm');
  }
}
