import { Pipe } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'utcDate',
})
export class UtcDatePipe {
  transform(date: string): any {
    const utcDate = moment.utc(date).format('DD/MM/YYYY');
    const utcHour = moment.utc(date).format('HH:mm');

    return {
      date: utcDate,
      hour: utcHour,
    };
  }
}
