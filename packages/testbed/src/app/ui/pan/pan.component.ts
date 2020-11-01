import { Component, OnInit, Input } from '@angular/core';
import { MasterChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-pan',
  templateUrl: './pan.component.html',
  styleUrls: ['./pan.component.css'],
})
export class PanComponent implements OnInit {
  @Input() channel: MasterChannel;

  constructor() {}

  ngOnInit(): void {}
}
