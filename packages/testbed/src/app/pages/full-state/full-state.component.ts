import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'sui-full-state',
  templateUrl: './full-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, JsonPipe],
})
export class FullStateComponent {
  cs = inject(ConnectionService);

  state$ = this.cs.conn.store.state$;
  countKeys$ = this.state$.pipe(map(state => Object.keys(state).length));
}
