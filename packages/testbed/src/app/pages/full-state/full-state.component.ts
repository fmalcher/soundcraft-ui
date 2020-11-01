import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-full-state',
  templateUrl: './full-state.component.html',
  styleUrls: ['./full-state.component.css'],
})
export class FullStateComponent implements OnInit {
  state$ = this.cs.conn.store.state$;

  constructor(private cs: ConnectionService) {}

  ngOnInit(): void {}
}
