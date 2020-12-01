import { Component, OnInit } from '@angular/core';
import { MuteGroup, MuteGroupID } from 'soundcraft-ui-connection';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-mute-groups',
  templateUrl: './mute-groups.component.html',
  styleUrls: ['./mute-groups.component.css'],
})
export class MuteGroupsComponent implements OnInit {
  groups: MuteGroup[] = [1, 2, 3, 4, 5, 6, 'fx', 'all'].map((id: MuteGroupID) =>
    this.cs.conn.muteGroup(id)
  );

  constructor(private cs: ConnectionService) {}

  ngOnInit(): void {}

  clearMuteGroups() {
    this.cs.conn.clearMuteGroups();
  }
}
