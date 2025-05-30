import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Channel } from 'soundcraft-ui-connection';
import { MixerButton } from '../mixer-button/mixer-button';

@Component({
  selector: 'sui-mute-button',
  templateUrl: './mute-button.html',
  styleUrl: './mute-button.css',
  imports: [AsyncPipe, MixerButton],
})
export class MuteButton {
  readonly channel = input.required<Channel>();
  readonly label = input('');
}
