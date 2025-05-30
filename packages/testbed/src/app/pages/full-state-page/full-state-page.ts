import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'sui-full-state-page',
  templateUrl: './full-state-page.html',
  imports: [AsyncPipe, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullStatePage {
  cs = inject(ConnectionService);

  state$ = this.cs.conn.store.state$;
  countKeys$ = this.state$.pipe(map(state => Object.keys(state).length));
}
