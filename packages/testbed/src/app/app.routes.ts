import { Routes } from '@angular/router';
import { MasterPage } from './pages/master-page/master-page';
import { MasterBusPage } from './pages/master-bus-page/master-bus-page';
import { AutomixPage } from './pages/automix-page/automix-page';
import { AuxBusPage } from './pages/aux-bus-page/aux-bus-page';
import { ChannelsyncPage } from './pages/channelsync-page/channelsync-page';
import { FullStatePage } from './pages/full-state-page/full-state-page';
import { FxBusPage } from './pages/fx-bus-page/fx-bus-page';
import { FxSettingsPage } from './pages/fx-settings-page/fx-settings-page';
import { HwchannelsPage } from './pages/hwchannels-page/hwchannels-page';
import { MultitrackPage } from './pages/multitrack-page/multitrack-page';
import { MuteGroupsPage } from './pages/mute-groups-page/mute-groups-page';
import { PlayerPage } from './pages/player-page/player-page';
import { ShowsPage } from './pages/shows-page/shows-page';
import { VolumebusPage } from './pages/volumebus-page/volumebus-page';
import { VuPage } from './pages/vu-page/vu-page';

export const routes: Routes = [
  { path: '', redirectTo: 'master', pathMatch: 'full' },
  { path: 'master', component: MasterPage, title: 'Master' },
  { path: 'masterbus', component: MasterBusPage, title: 'Master bus' },
  { path: 'auxbus/:bus', component: AuxBusPage, title: 'AUX bus' },
  { path: 'fxbus/:bus', component: FxBusPage, title: 'FX bus' },
  { path: 'fx', component: FxSettingsPage, title: 'FX Settings' },
  { path: 'player', component: PlayerPage, title: 'Player/Rec' },
  { path: 'multitrack', component: MultitrackPage, title: 'Multitrack' },
  { path: 'mutegroups', component: MuteGroupsPage, title: 'MUTE Groups' },
  { path: 'volumebus', component: VolumebusPage, title: 'Volume Buses' },
  { path: 'shows', component: ShowsPage, title: 'Shows' },
  { path: 'hwchannels', component: HwchannelsPage, title: 'HW Channels' },
  { path: 'automix', component: AutomixPage, title: 'Automix' },
  { path: 'channelsync', component: ChannelsyncPage, title: 'Channel Sync' },
  { path: 'fullstate', component: FullStatePage, title: 'Full state' },
  { path: 'vu', component: VuPage, title: 'VU' },
];
