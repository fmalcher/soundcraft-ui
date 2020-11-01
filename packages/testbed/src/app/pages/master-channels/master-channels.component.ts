import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-master-channels',
  templateUrl: './master-channels.component.html',
  styleUrls: ['./master-channels.component.css'],
})
export class MasterChannelsComponent implements OnInit {
  master = this.cs.conn.master;

  channels = [
    { channel: this.master.input(2), label: 'Input 2' },
    { channel: this.master.line(1), label: 'Line 1' },
    { channel: this.master.player(1), label: 'Player 1' },
    { channel: this.master.fx(2), label: 'FX 2' },
    { channel: this.master.sub(3), label: 'Sub group 3' },
    { channel: this.master.aux(2), label: 'AUX 2', noPan: true },
    { channel: this.master.vca(4), label: 'VCA 4', noPan: true },
  ];

  constructor(private cs: ConnectionService) {}

  ngOnInit(): void {}
}
