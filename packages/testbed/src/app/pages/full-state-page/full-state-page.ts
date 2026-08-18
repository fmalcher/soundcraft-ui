import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'sui-full-state-page',
  templateUrl: './full-state-page.html',
  imports: [JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullStatePage {
  cs = inject(ConnectionService);

  state = toSignal(this.cs.connection.store.state$, { initialValue: {} });
  countKeys = computed(() => Object.keys(this.state()).length);

  exportState() {
    const json = JSON.stringify(this.state(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `mixer-state-${new Date().toISOString()}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }
}
