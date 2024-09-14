import { Component, input, output } from '@angular/core';

@Component({
  selector: 'sui-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  standalone: true,
  imports: [],
})
export class InputComponent {
  value = input('');
  label = input('');
  buttonLabel = input('');
  valueChange = output<string>();
}
