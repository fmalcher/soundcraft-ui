import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { PlayerState } from 'soundcraft-ui-connection';

import { ConnectionService } from '../../connection.service';
import { InputField } from '../../ui/input-field/input-field';
import { MixerButton } from '../../ui/mixer-button/mixer-button';
import { TimePipe } from '../../ui/time.pipe';

@Component({
  selector: 'sui-player-page',
  templateUrl: './player-page.html',
  imports: [AsyncPipe, MixerButton, InputField, TimePipe],
})
export class PlayerPage {
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
