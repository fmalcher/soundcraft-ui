import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConnectionService } from '../../connection.service';
import { InputComponent } from '../../ui/input/input.component';

@Component({
  selector: 'soundcraft-ui-shows',
  templateUrl: './shows.component.html',
  standalone: true,
  imports: [AsyncPipe, NgIf, InputComponent],
})
export class ShowsComponent {
  cs = inject(ConnectionService);
  showCtrl = this.cs.conn.shows;
  showFromInput = 'testshow';

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
