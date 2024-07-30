import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { MtkState } from 'soundcraft-ui-connection';
import { ConnectionService } from '../../connection.service';
import { MixerButtonComponent } from '../../ui/mixer-button/mixer-button.component';
import { TimePipe } from '../../ui/time.pipe';

@Component({
  selector: 'sui-multitrack',
  templateUrl: './multitrack.component.html',
  standalone: true,
  imports: [AsyncPipe, TimePipe, MixerButtonComponent],
})
export class MultitrackComponent {
  private cs = inject(ConnectionService);
  mtk = this.cs.conn.recorderMultiTrack;
  master = this.cs.conn.master;

  channels = [
    { channel: this.master.input(1), label: 'Input 1' },
    { channel: this.master.input(2), label: 'Input 2' },
    { channel: this.master.input(3), label: 'Input 3' },
    { channel: this.master.line(1), label: 'Line 1' },
    { channel: this.master.line(2), label: 'Line 2' },
  ];

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
