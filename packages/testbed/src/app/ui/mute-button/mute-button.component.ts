import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Channel } from 'soundcraft-ui-connection';
import { MixerButtonComponent } from '../mixer-button/mixer-button.component';

@Component({
  selector: 'soundcraft-ui-mute-button',
  templateUrl: './mute-button.component.html',
  styleUrls: ['./mute-button.component.css'],
  standalone: true,
  imports: [AsyncPipe, NgIf, MixerButtonComponent],
})
export class MuteButtonComponent {
  @Input() channel?: Channel;
  @Input() label = '';
}
