import { Component, OnInit, Input } from '@angular/core';
import { Channel } from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-mute-button',
  templateUrl: './mute-button.component.html',
  styleUrls: ['./mute-button.component.css'],
})
export class MuteButtonComponent implements OnInit {
  @Input() channel: Channel;
  @Input() label: string;

  constructor() {}

  ngOnInit(): void {}
}
