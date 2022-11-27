import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuxChannel } from 'soundcraft-ui-connection';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-aux-bus',
  templateUrl: './aux-bus.component.html',
  styleUrls: ['./aux-bus.component.css'],
})
export class AuxBusComponent {
  channels$: Observable<{ channel: AuxChannel; label: string }[]>;

  constructor(private cs: ConnectionService, private route: ActivatedRoute) {
    this.channels$ = this.route.paramMap.pipe(
      map(params => +params.get('bus')),
      map(bus => [
        { channel: this.cs.conn.aux(bus).input(2), label: 'Input 2' },
        { channel: this.cs.conn.aux(bus).line(1), label: 'Line 1' },
        { channel: this.cs.conn.aux(bus).player(1), label: 'Player 1' },
        { channel: this.cs.conn.aux(bus).fx(2), label: 'FX 2' },
      ])
    );
  }
}
