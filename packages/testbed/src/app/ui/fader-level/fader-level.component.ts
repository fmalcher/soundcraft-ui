import { Component, OnInit, Input } from '@angular/core';
import { Channel, MasterBus } from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-fader-level',
  templateUrl: './fader-level.component.html',
  styleUrls: ['./fader-level.component.css'],
})
export class FaderLevelComponent implements OnInit {
  @Input() channel: Channel | MasterBus;

  constructor() {}

  ngOnInit(): void {}
}
