import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'soundcraft-ui-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit {
  @Input() value: string;
  @Input() label: string;
  @Input() buttonLabel: string;
  @Output() valueChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
}
