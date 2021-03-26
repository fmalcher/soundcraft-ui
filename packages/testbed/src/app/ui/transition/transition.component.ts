import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  Channel,
  Easings,
  FadeableChannel,
  faderValueToDB,
  MasterBus,
  VolumeBus,
} from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.css'],
})
export class TransitionComponent implements OnInit {
  @Input() channel: FadeableChannel;

  form: FormGroup;
  easingOptions = [
    { label: 'Linear', value: Easings.Linear },
    { label: 'EaseIn', value: Easings.EaseIn },
    { label: 'EaseOut', value: Easings.EaseOut },
    { label: 'EaseInOut', value: Easings.EaseInOut },
  ];

  constructor() {}

  ngOnInit(): void {
    this.form = new FormGroup({
      targetValue: new FormControl(0.7634),
      fadeTime: new FormControl(2000),
      easing: new FormControl(Easings.EaseOut),
    });
  }

  fade() {
    const { targetValue, fadeTime, easing } = this.form.value;
    this.channel.fadeTo(targetValue, fadeTime, Number(easing));
  }

  get targetValueDB() {
    return faderValueToDB(this.form.get('targetValue').value);
  }
}
