import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { MtkState } from 'soundcraft-ui-connection';
import { ConnectionService } from '../../connection.service';
import { MixerButtonComponent } from '../../ui/mixer-button/mixer-button.component';
import { TimePipe } from '../../ui/time.pipe';

@Component({
  selector: 'soundcraft-ui-multitrack',
  templateUrl: './multitrack.component.html',
  standalone: true,
  imports: [AsyncPipe, TimePipe, MixerButtonComponent],
})
export class MultitrackComponent {
  mtk = inject(ConnectionService).conn.recorderMultiTrack;

  state$ = this.mtk.state$.pipe(
    map(s => {
      switch (s) {
        case MtkState.Playing:
          return 'PLAYING';
        case MtkState.Stopped:
          return 'STOPPED';
        case MtkState.Paused:
          return 'PAUSED';
      }
    })
  );
}
