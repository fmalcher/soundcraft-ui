import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-full-state',
  templateUrl: './full-state.component.html',
  styleUrls: ['./full-state.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullStateComponent {
  state$ = this.cs.conn.store.state$;
  countKeys$ = this.state$.pipe(map(state => Object.keys(state).length));

  constructor(private cs: ConnectionService) {}
}
