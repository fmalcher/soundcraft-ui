import { Input, Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SendChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-prepost',
  templateUrl: './prepost.component.html',
  styleUrls: ['./prepost.component.css'],
})
export class PrepostComponent implements OnDestroy {
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
