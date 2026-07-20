import { AsyncPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { map } from 'rxjs';
import { PlayerState } from 'soundcraft-ui-connection';

import { ConnectionService } from '../../connection.service';
import { InputField } from '../../ui/input-field/input-field';
import { MixerButton } from '../../ui/mixer-button/mixer-button';
import { TimePipe } from '../../ui/time.pipe';

@Component({
  selector: 'sui-player-page',
  templateUrl: './player-page.html',
  styleUrl: './player-page.scss',
  imports: [AsyncPipe, JsonPipe, KeyValuePipe, MixerButton, InputField, TimePipe],
})
export class PlayerPage {
  cs = inject(ConnectionService);

  rec = this.cs.connection.recorderDualTrack;
  player = this.cs.connection.player;
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
    }),
  );

  playlistFromInput = '~all~';

  /** toggle for showing the raw JSON of the playlist listing */
  showRawJson = signal(false);

  toggleRawJson() {
    this.showRawJson.update(v => !v);
  }

  /** keep playlists in the order received instead of the keyvalue pipe's default alphabetical sort */
  keepOrder = () => 0;

  loadTrack(track: string) {
    if (!this.playlistFromInput) {
      return;
    }
    this.player.loadTrack(this.playlistFromInput, track);
  }
}
