import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FxChannel } from 'soundcraft-ui-connection';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-fx-bus',
  templateUrl: './fx-bus.component.html',
  styleUrls: ['./fx-bus.component.css'],
})
export class FxBusComponent implements OnInit {
  channels$: Observable<{ channel: FxChannel; label: string }[]>;

  constructor(private cs: ConnectionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.channels$ = this.route.paramMap.pipe(
      map(params => +params.get('bus')),
      map(bus => [
        { channel: this.cs.conn.fx(bus).input(2), label: 'Input 2' },
        { channel: this.cs.conn.fx(bus).line(1), label: 'Line 1' },
        { channel: this.cs.conn.fx(bus).player(1), label: 'Player 1' },
        { channel: this.cs.conn.fx(bus).sub(3), label: 'Sub group 3' },
      ])
    );
  }
}
