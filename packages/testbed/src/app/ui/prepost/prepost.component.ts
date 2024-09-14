import { AsyncPipe, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SendChannel } from 'soundcraft-ui-connection';
import { MixerButtonComponent } from '../mixer-button/mixer-button.component';

@Component({
  selector: 'sui-prepost',
  templateUrl: './prepost.component.html',
  styleUrls: ['./prepost.component.css'],
  standalone: true,
  imports: [MixerButtonComponent, NgClass, AsyncPipe],
})
export class PrepostComponent implements OnInit, OnDestroy {
  channel = input.required<SendChannel>();

  post = false;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.channel()
      .post$.pipe(takeUntil(this.destroy$))
      .subscribe(value => (this.post = !!value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
