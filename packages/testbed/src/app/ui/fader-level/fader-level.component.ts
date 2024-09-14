import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FadeableChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'sui-fader-level',
  templateUrl: './fader-level.component.html',
  styleUrls: ['./fader-level.component.css'],
  standalone: true,
  imports: [AsyncPipe],
})
export class FaderLevelComponent {
  channel = input.required<FadeableChannel>();

  setFaderLevel(level: string) {
    this.channel().setFaderLevel(Number(level));
  }
}
