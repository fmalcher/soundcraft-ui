import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Easings, FadeableChannel, faderValueToDB } from 'soundcraft-ui-connection';

@Component({
  selector: 'sui-transition',
  templateUrl: './transition.component.html',
  styleUrls: ['./transition.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
})
export class TransitionComponent {
  @Input() channel?: FadeableChannel;

  form = new FormGroup({
    targetValue: new FormControl(0.7634, { nonNullable: true }),
    fadeTime: new FormControl(2000, { nonNullable: true }),
    easing: new FormControl(Easings.EaseOut, { nonNullable: true }),
  });

  easingOptions = [
    { label: 'Linear', value: Easings.Linear },
    { label: 'EaseIn', value: Easings.EaseIn },
    { label: 'EaseOut', value: Easings.EaseOut },
    { label: 'EaseInOut', value: Easings.EaseInOut },
  ];

  fade() {
    if (!this.channel) {
      return;
    }
    const { targetValue, fadeTime, easing } = this.form.value;
    this.channel.fadeTo(targetValue, fadeTime, Number(easing)).then(() => {
      console.log('FADE finished', { targetValue, fadeTime, easing, channel: this.channel });
    });
  }

  get targetValueDB() {
    return faderValueToDB(this.form.controls.targetValue.value);
  }
}
