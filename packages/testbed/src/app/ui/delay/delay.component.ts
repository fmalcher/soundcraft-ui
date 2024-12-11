import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { DelayableMasterChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'sui-delay',
  templateUrl: './delay.component.html',
  styleUrls: ['./delay.component.css'],
  imports: [AsyncPipe],
})
export class DelayComponent {
  channel = input.required<DelayableMasterChannel>();
  maxValue = input(250);

  setDelay(level: string) {
    this.channel().setDelay(Number(level));
  }

  changeDelay(offset: number) {
    this.channel().changeDelay(offset);
  }
}
