import { Pipe, PipeTransform } from '@angular/core';
import { playerTimeToString } from 'soundcraft-ui-connection';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(value: number): string {
    return playerTimeToString(value);
  }
}
