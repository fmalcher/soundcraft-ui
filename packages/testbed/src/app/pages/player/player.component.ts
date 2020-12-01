import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { PlayerState } from 'soundcraft-ui-connection';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
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

  constructor(private cs: ConnectionService) {}

  ngOnInit(): void {}

  loadTrack(track: string) {
    if (!this.playlistFromInput) {
      return;
    }
    this.player.loadTrack(this.playlistFromInput, track);
  }
}
