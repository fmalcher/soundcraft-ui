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

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'master', pathMatch: 'full' },
  { path: 'master', component: MasterComponent },
  { path: 'masterbus', component: MasterBusComponent },
  { path: 'auxbus/:bus', component: AuxBusComponent },
  { path: 'fxbus/:bus', component: FxBusComponent },
  { path: 'player', component: PlayerComponent },
  { path: 'multitrack', component: MultitrackComponent },
  { path: 'mutegroups', component: MuteGroupsComponent },
  { path: 'volumebus', component: VolumebusComponent },
  { path: 'shows', component: ShowsComponent },
  { path: 'hwchannels', component: HwchannelsComponent },
  { path: 'automix', component: AutomixComponent },
  { path: 'fullstate', component: FullStateComponent },
];
