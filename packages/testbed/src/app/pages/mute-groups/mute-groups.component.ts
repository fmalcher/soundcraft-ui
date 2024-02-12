import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MuteGroup, MuteGroupID } from 'soundcraft-ui-connection';
import { ConnectionService } from '../../connection.service';
import { MixerButtonComponent } from '../../ui/mixer-button/mixer-button.component';

@Component({
  selector: 'sui-mute-groups',
  templateUrl: './mute-groups.component.html',
  standalone: true,
  imports: [AsyncPipe, MixerButtonComponent],
})
export class MuteGroupsComponent {
  cs = inject(ConnectionService);

  groups: MuteGroup[] = [1, 2, 3, 4, 5, 6, 'fx', 'all'].map((id: MuteGroupID) =>
    this.cs.conn.muteGroup(id)
  );

  clearMuteGroups() {
    this.cs.conn.clearMuteGroups();
  }
}
