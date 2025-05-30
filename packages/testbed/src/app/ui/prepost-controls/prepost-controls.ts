import { AsyncPipe } from '@angular/common';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Component, input } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { SendChannel } from 'soundcraft-ui-connection';
import { MixerButton } from '../mixer-button/mixer-button';

@Component({
  selector: 'sui-prepost-controls',
  templateUrl: './prepost-controls.html',
  styleUrl: './prepost-controls.css',
  imports: [MixerButton, AsyncPipe],
})
export class PrepostControls {
  readonly channel = input.required<SendChannel>();

  readonly post = toSignal(
    toObservable(this.channel).pipe(
      switchMap(channel => channel.post$),
      map(e => !!e)
    ),
    { initialValue: false }
  );
}
