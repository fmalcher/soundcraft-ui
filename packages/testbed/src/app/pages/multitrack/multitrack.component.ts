import { Component } from '@angular/core';
import { map } from 'rxjs';
import { MtkState, PlayerState } from 'soundcraft-ui-connection';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-multitrack',
  templateUrl: './multitrack.component.html',
  styleUrls: ['./multitrack.component.scss'],
})
export class MultitrackComponent {
  mtk = this.cs.conn.recorderMultiTrack;
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

  constructor(private cs: ConnectionService) {}
}
