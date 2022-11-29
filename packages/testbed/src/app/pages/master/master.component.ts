import { Component } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css'],
})
export class MasterComponent {
  master = this.cs.conn.master;

  delays = [
    {
      side: 'L',
      data$: this.master.delayL$,
      setDelay: (v: number) => this.master.setDelayL(v),
      changeDelay: (v: number) => this.master.changeDelayL(v),
    },
    {
      side: 'R',
      data$: this.master.delayR$,
      setDelay: (v: number) => this.master.setDelayR(v),
      changeDelay: (v: number) => this.master.changeDelayR(v),
    },
  ];

  constructor(private cs: ConnectionService) {}
}
