import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { FxType, fxTypeToString } from 'soundcraft-ui-connection';

import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'sui-fx-settings',
  templateUrl: './fx-settings.component.html',
  standalone: true,
  imports: [AsyncPipe],
})
export class FxSettingsComponent {
  cs = inject(ConnectionService);

  buses = [
    { label: 'FX 1', fx: this.cs.conn.fx(1) },
    { label: 'FX 2', fx: this.cs.conn.fx(2) },
    { label: 'FX 3', fx: this.cs.conn.fx(3) },
    { label: 'FX 4', fx: this.cs.conn.fx(4) },
  ];

  withFxType(fxType$: Observable<FxType>): Observable<string> {
    return fxType$.pipe(map(v => fxTypeToString(v)));
  }
}
