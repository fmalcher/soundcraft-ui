import { Component, Input } from '@angular/core';
import { FadeableChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-fader-level',
  templateUrl: './fader-level.component.html',
  styleUrls: ['./fader-level.component.css'],
})
export class FaderLevelComponent {
  @Input() channel?: FadeableChannel;

  setFaderLevel(level: string) {
    this.channel && this.channel.setFaderLevel(Number(level));
  }
}
