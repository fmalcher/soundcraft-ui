import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { DelayableMasterChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'sui-delay',
  templateUrl: './delay-controls.html',
  styleUrl: './delay-controls.css',
  imports: [AsyncPipe],
})
export class DelayControls {
  readonly channel = input.required<DelayableMasterChannel>();
  readonly maxValue = input(250);

  setDelay(level: string) {
    this.channel().setDelay(Number(level));
  }

  changeDelay(offset: number) {
    this.channel().changeDelay(offset);
  }
}
