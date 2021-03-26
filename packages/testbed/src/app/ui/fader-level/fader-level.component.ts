import { Component, OnInit, Input } from '@angular/core';
import { FadeableChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-fader-level',
  templateUrl: './fader-level.component.html',
  styleUrls: ['./fader-level.component.css'],
})
export class FaderLevelComponent implements OnInit {
  @Input() channel: FadeableChannel;

  constructor() {}

  ngOnInit(): void {}
}
