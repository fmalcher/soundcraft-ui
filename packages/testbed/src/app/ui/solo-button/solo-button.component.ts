import { Component, OnInit, Input } from '@angular/core';
import { Channel, MasterChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-solo-button',
  templateUrl: './solo-button.component.html',
  styleUrls: ['./solo-button.component.css'],
})
export class SoloButtonComponent implements OnInit {
  @Input() channel: MasterChannel;
  @Input() label: string;

  constructor() {}

  ngOnInit(): void {}
}
