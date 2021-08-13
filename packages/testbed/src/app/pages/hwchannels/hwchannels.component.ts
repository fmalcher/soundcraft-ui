import { Component } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-hwchannels',
  templateUrl: './hwchannels.component.html',
  styleUrls: ['./hwchannels.component.css'],
})
export class HwchannelsComponent {
  constructor(public cs: ConnectionService) {}
}
