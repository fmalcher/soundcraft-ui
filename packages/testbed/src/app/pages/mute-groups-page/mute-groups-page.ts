import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MuteGroup, MuteGroupID } from 'soundcraft-ui-connection';
import { ConnectionService } from '../../connection.service';
import { MixerButton } from '../../ui/mixer-button/mixer-button';

@Component({
  selector: 'sui-mute-groups-page',
  templateUrl: './mute-groups-page.html',
  imports: [AsyncPipe, MixerButton],
})
export class MuteGroupsPage {
  cs = inject(ConnectionService);

  groups: MuteGroup[] = [1, 2, 3, 4, 5, 6, 'fx', 'all'].map((id: MuteGroupID) =>
    this.cs.conn.muteGroup(id)
  );

  clearMuteGroups() {
    this.cs.conn.clearMuteGroups();
  }
}
