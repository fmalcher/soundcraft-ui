import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'sui-shows',
  templateUrl: './shows.component.html',
  styleUrl: './shows.component.scss',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
})
export class ShowsComponent {
  cs = inject(ConnectionService);
  showCtrl = this.cs.conn.shows;

  formData = {
    show: 'testshow',
    snapshot: '',
    cue: '',
  };

  loadShow() {
    if (this.formData.show) {
      this.showCtrl.loadShow(this.formData.show);
    }
  }

  loadSnapshot() {
    if (this.formData.show && this.formData.snapshot) {
      this.showCtrl.loadSnapshot(this.formData.show, this.formData.snapshot);
    }
  }

  loadCue() {
    if (this.formData.show && this.formData.cue) {
      this.showCtrl.loadCue(this.formData.show, this.formData.cue);
    }
  }

  saveSnapshot() {
    if (this.formData.show && this.formData.snapshot) {
      this.showCtrl.saveSnapshot(this.formData.show, this.formData.snapshot);
    }
  }
}
