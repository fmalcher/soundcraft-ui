import { AsyncPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'sui-shows-page',
  templateUrl: './shows-page.html',
  styleUrl: './shows-page.scss',
  imports: [AsyncPipe, JsonPipe, KeyValuePipe, FormsModule],
})
export class ShowsPage {
  cs = inject(ConnectionService);
  showCtrl = this.cs.conn!.shows;

  formData = {
    show: 'testshow',
    snapshot: '',
    cue: '',
  };

  /** keep shows in the order received instead of the keyvalue pipe's default alphabetical sort */
  keepOrder = () => 0;

  /** toggle for showing the raw JSON of the show listing */
  showRawJson = signal(false);

  toggleRawJson() {
    this.showRawJson.update(v => !v);
  }

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

  saveCue() {
    if (this.formData.show && this.formData.cue) {
      this.showCtrl.saveCue(this.formData.show, this.formData.cue);
    }
  }
}
