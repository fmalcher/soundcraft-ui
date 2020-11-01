import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  player = this.cs.conn.player;

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
