import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Component, input } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { PostProcessableChannel } from 'soundcraft-ui-connection';
import { MixerButton } from '../mixer-button/mixer-button';

@Component({
  selector: 'sui-postproc-controls',
  templateUrl: './postproc-controls.html',
  imports: [MixerButton],
})
export class PostprocControls {
  readonly channel = input.required<PostProcessableChannel>();

  readonly postProc = toSignal(
    toObservable(this.channel).pipe(
      switchMap(channel => channel.postProc$),
      map(e => !!e),
    ),
    { initialValue: false },
  );

  toggle() {
    if (this.postProc()) {
      this.channel().preProc();
    } else {
      this.channel().postProc();
    }
  }
}
