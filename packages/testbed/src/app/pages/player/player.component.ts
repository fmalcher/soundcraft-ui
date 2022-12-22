import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { PlayerState } from 'soundcraft-ui-connection';

import { ConnectionService } from '../../connection.service';
import { InputComponent } from '../../ui/input/input.component';
import { MixerButtonComponent } from '../../ui/mixer-button/mixer-button.component';
import { TimePipe } from '../../ui/time.pipe';

@Component({
  selector: 'soundcraft-ui-player',
  templateUrl: './player.component.html',
  standalone: true,
  imports: [AsyncPipe, MixerButtonComponent, InputComponent, NgIf, TimePipe],
})
export class PlayerComponent {
  cs = inject(ConnectionService);

  rec = this.cs.conn.recorderDualTrack;
  player = this.cs.conn.player;
  playerState$ = this.player.state$.pipe(
    map(s => {
      switch (s) {
        case PlayerState.Playing:
          return 'PLAYING';
        case PlayerState.Stopped:
          return 'STOPPED';
        case PlayerState.Paused:
          return 'PAUSED';
      }
    })
  );

  playlistFromInput = '~all~';

  loadTrack(track: string) {
    if (!this.playlistFromInput) {
      return;
    }
    this.player.loadTrack(this.playlistFromInput, track);
  }
}
