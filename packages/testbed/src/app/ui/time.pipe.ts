import { Pipe, PipeTransform } from '@angular/core';
import { playerTimeToString } from 'soundcraft-ui-connection';

@Pipe({
  name: 'time',
  standalone: true,
})
export class TimePipe implements PipeTransform {
  transform(value: number): string {
    return playerTimeToString(value);
  }
}
