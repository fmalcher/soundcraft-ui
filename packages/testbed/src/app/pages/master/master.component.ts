import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css'],
})
export class MasterComponent implements OnInit {
  master = this.cs.conn.master;

  constructor(private cs: ConnectionService) {}

  ngOnInit(): void {}
}
