import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PannableChannel } from 'soundcraft-ui-connection';
import { RandomIdDirective } from '../../random-id.directive';

@Component({
  selector: 'sui-pan-controls',
  templateUrl: './pan-controls.html',
  styleUrl: './pan-controls.css',
  imports: [AsyncPipe, RandomIdDirective],
})
export class PanControls {
  readonly channel = input.required<PannableChannel>();

  setPan(value: string) {
    this.channel().setPan(Number(value));
  }
}
