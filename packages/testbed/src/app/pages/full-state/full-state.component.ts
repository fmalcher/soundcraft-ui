import { Component } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-full-state',
  templateUrl: './full-state.component.html',
  styleUrls: ['./full-state.component.css'],
})
export class FullStateComponent {
  state$ = this.cs.conn.store.state$;

  constructor(private cs: ConnectionService) {}
}
