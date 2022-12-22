import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FadeableChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-fader-level',
  templateUrl: './fader-level.component.html',
  styleUrls: ['./fader-level.component.css'],
  standalone: true,
  imports: [AsyncPipe, NgIf],
})
export class FaderLevelComponent {
  @Input() channel?: FadeableChannel;

  setFaderLevel(level: string) {
    this.channel && this.channel.setFaderLevel(Number(level));
  }
}
