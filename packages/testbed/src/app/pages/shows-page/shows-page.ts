import { AsyncPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import { ConnectionService } from '../../connection.service';
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'sui-shows-page',
  templateUrl: './shows-page.html',
  styleUrl: './shows-page.scss',
  imports: [AsyncPipe, JsonPipe, KeyValuePipe, FormField],
})
export class ShowsPage {
  cs = inject(ConnectionService);
  showCtrl = this.cs.connection.shows;

  formData = signal({
    show: 'testshow',
    snapshot: '',
    cue: '',
  });

  showsForm = form(this.formData);

  /** keep shows in the order received instead of the keyvalue pipe's default alphabetical sort */
  keepOrder = () => 0;

  /** toggle for showing the raw JSON of the show listing */
  showRawJson = signal(false);

  toggleRawJson() {
    this.showRawJson.update(v => !v);
  }

  loadShow() {
    const show = this.formData().show;
    if (show) {
      this.showCtrl.loadShow(show);
    }
  }

  loadSnapshot() {
    const show = this.formData().show;
    const snapshot = this.showsForm.snapshot().value();
    if (show && snapshot) {
      this.showCtrl.loadSnapshot(show, snapshot);
    }
  }

  loadCue() {
    const show = this.formData().show;
    const cue = this.formData().cue;
    if (show && cue) {
      this.showCtrl.loadCue(show, cue);
    }
  }

  saveSnapshot() {
    const show = this.formData().show;
    const snapshot = this.formData().snapshot;
    if (show && snapshot) {
      this.showCtrl.saveSnapshot(show, snapshot);
    }
  }

  saveCue() {
    const show = this.formData().show;
    const cue = this.formData().cue;
    if (show && cue) {
      this.showCtrl.saveCue(show, cue);
    }
  }
}
