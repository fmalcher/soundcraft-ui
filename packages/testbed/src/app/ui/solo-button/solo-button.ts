import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MasterChannel } from 'soundcraft-ui-connection';
import { MixerButton } from '../mixer-button/mixer-button';

@Component({
  selector: 'sui-solo-button',
  templateUrl: './solo-button.html',
  styleUrl: './solo-button.css',
  imports: [MixerButton, AsyncPipe],
})
export class SoloButton {
  readonly channel = input.required<MasterChannel>();
  readonly label = input('');
}
