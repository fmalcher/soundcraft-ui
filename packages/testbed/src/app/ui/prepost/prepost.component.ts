import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Input, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SendChannel } from 'soundcraft-ui-connection';
import { MixerButtonComponent } from '../mixer-button/mixer-button.component';

@Component({
  selector: 'soundcraft-ui-prepost',
  templateUrl: './prepost.component.html',
  styleUrls: ['./prepost.component.css'],
  standalone: true,
  imports: [MixerButtonComponent, NgClass, NgIf, NgFor, AsyncPipe],
})
export class PrepostComponent implements OnInit, OnDestroy {
  @Input() channel?: SendChannel;

  post: boolean = false;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.channel &&
      this.channel.post$.pipe(takeUntil(this.destroy$)).subscribe(value => (this.post = !!value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
