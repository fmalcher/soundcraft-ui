import { Component, computed, input, signal } from '@angular/core';
import { Field, form, max, min } from '@angular/forms/signals';
import { Easings, FadeableChannel, faderValueToDB } from 'soundcraft-ui-connection';

@Component({
  selector: 'sui-transition-controls',
  templateUrl: './transition-controls.html',
  styleUrl: './transition-controls.css',
  imports: [Field],
})
export class TransitionControls {
  readonly channel = input.required<FadeableChannel>();

  private readonly formData = signal({
    targetValue: 0.7634,
    fadeTime: 2000,
    easing: Easings.EaseOut,
  });

  readonly form = form(this.formData, path => {
    min(path.targetValue, 0);
    max(path.targetValue, 1);
    min(path.fadeTime, 100);
    max(path.fadeTime, 30000);
  });

  readonly targetValueDB = computed(() => faderValueToDB(this.form.targetValue().value()));

  easingOptions = [
    { label: 'Linear', value: Easings.Linear },
    { label: 'EaseIn', value: Easings.EaseIn },
    { label: 'EaseOut', value: Easings.EaseOut },
    { label: 'EaseInOut', value: Easings.EaseInOut },
  ];

  setEasing(e: Event) {
    this.form.easing().value.set(Number((e.target as any).value));
  }

  fade() {
    const { targetValue, fadeTime, easing } = this.formData();
    this.channel().fadeTo(targetValue, fadeTime, easing);
    /*.then(() => {
      console.log('FADE finished', { targetValue, fadeTime, easing, channel: this.channel });
    });*/

    return false;
  }
}
