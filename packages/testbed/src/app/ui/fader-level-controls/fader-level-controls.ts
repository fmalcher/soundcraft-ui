import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FadeableChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'sui-fader-level-controls',
  templateUrl: './fader-level-controls.html',
  styleUrl: './fader-level-controls.css',
  imports: [AsyncPipe],
})
export class FaderLevelControls {
  readonly channel = input.required<FadeableChannel>();

  setFaderLevel(level: string) {
    this.channel().setFaderLevel(Number(level));
  }
}
