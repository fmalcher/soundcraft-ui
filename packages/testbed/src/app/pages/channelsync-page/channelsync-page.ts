import { Component, inject } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';

import { ConnectionService } from '../../connection.service';
import { map } from 'rxjs';
import { isChannel, isDelayableMasterChannel, isMasterChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'sui-channelsync-page',
  templateUrl: './channelsync-page.html',
  imports: [AsyncPipe, JsonPipe],
})
export class ChannelsyncPage {
  channelSync = inject(ConnectionService).conn.channelSync;
  syncState$ = inject(ConnectionService).conn.store.syncState$;

  syncIds = ['SYNC_ID', 'foo', 'bar'];
  channelIndexes$ = inject(ConnectionService).conn.deviceInfo.model$.pipe(
    map(model => {
      let length = 54; // ui24
      if (model === 'ui16') {
        length = 30;
      }
      if (model === 'ui12') {
        length = 24;
      }

      return [-1, ...Array.from({ length }, (_, i) => i), 100];
    })
  );

  isChannel = isChannel;
  isMasterChannel = isMasterChannel;
  isDelayableMasterChannel = isDelayableMasterChannel;
}
