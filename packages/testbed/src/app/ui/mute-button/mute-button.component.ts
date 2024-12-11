import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Channel } from 'soundcraft-ui-connection';
import { MixerButtonComponent } from '../mixer-button/mixer-button.component';

@Component({
  selector: 'sui-mute-button',
  templateUrl: './mute-button.component.html',
  styleUrls: ['./mute-button.component.css'],
  imports: [AsyncPipe, MixerButtonComponent],
})
export class MuteButtonComponent {
  channel = input.required<Channel>();
  label = input('');
}
