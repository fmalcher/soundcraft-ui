import { Routes } from '@angular/router';
import { AuxBusComponent } from './pages/aux-bus/aux-bus.component';
import { FullStateComponent } from './pages/full-state/full-state.component';
import { FxBusComponent } from './pages/fx-bus/fx-bus.component';
import { HwchannelsComponent } from './pages/hwchannels/hwchannels.component';
import { MasterBusComponent } from './pages/master-bus/master-bus.component';
import { MasterComponent } from './pages/master/master.component';
import { MultitrackComponent } from './pages/multitrack/multitrack.component';
import { MuteGroupsComponent } from './pages/mute-groups/mute-groups.component';
import { PlayerComponent } from './pages/player/player.component';
import { ShowsComponent } from './pages/shows/shows.component';
import { VolumebusComponent } from './pages/volumebus/volumebus.component';
import { AutomixComponent } from './pages/automix/automix.component';
import { VuComponent } from './pages/vu/vu.component';
import { FxSettingsComponent } from './pages/fx-settings/fx-settings.component';
import { ChannelsyncComponent } from './pages/channelsync/channelsync.component';

export const routes: Routes = [
  { path: '', redirectTo: 'master', pathMatch: 'full' },
  { path: 'master', component: MasterComponent, title: 'Master' },
  { path: 'masterbus', component: MasterBusComponent, title: 'Master bus' },
  { path: 'auxbus/:bus', component: AuxBusComponent, title: 'AUX bus' },
  { path: 'fxbus/:bus', component: FxBusComponent, title: 'FX bus' },
  { path: 'fx', component: FxSettingsComponent, title: 'FX Settings' },
  { path: 'player', component: PlayerComponent, title: 'Player/Rec' },
  { path: 'multitrack', component: MultitrackComponent, title: 'Multitrack' },
  { path: 'mutegroups', component: MuteGroupsComponent, title: 'MUTE Groups' },
  { path: 'volumebus', component: VolumebusComponent, title: 'Volume Buses' },
  { path: 'shows', component: ShowsComponent, title: 'Shows' },
  { path: 'hwchannels', component: HwchannelsComponent, title: 'HW Channels' },
  { path: 'automix', component: AutomixComponent, title: 'Automix' },
  { path: 'channelsync', component: ChannelsyncComponent, title: 'Channel Sync' },
  { path: 'fullstate', component: FullStateComponent, title: 'Full state' },
  { path: 'vu', component: VuComponent, title: 'VU' },
];
