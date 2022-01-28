import { Component, Input } from '@angular/core';
import { Channel, MasterChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-solo-button',
  templateUrl: './solo-button.component.html',
  styleUrls: ['./solo-button.component.css'],
})
export class SoloButtonComponent {
  @Input() channel?: MasterChannel;
  @Input() label: string = '';
}
