import { Component } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css'],
})
export class ShowsComponent {
  showCtrl = this.cs.conn.shows;
  showFromInput = 'testshow';

  constructor(private cs: ConnectionService) {}

  loadShow(show: string) {
    if (!show) {
      return;
    }
    this.showCtrl.loadShow(show);
  }

  loadSnapshot(snapshot: string) {
    if (!this.showFromInput) {
      return;
    }
    this.showCtrl.loadSnapshot(this.showFromInput, snapshot);
  }

  loadCue(cue: string) {
    if (!this.showFromInput) {
      return;
    }
    this.showCtrl.loadCue(this.showFromInput, cue);
  }
}
