import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { MixerButtonComponent } from './ui/mixer-button/mixer-button.component';
import { ConnectionComponent } from './pages/connection/connection.component';
import { MasterBusComponent } from './pages/master-bus/master-bus.component';
import { MuteButtonComponent } from './ui/mute-button/mute-button.component';
import { SoloButtonComponent } from './ui/solo-button/solo-button.component';
import { FaderLevelComponent } from './ui/fader-level/fader-level.component';
import { PanComponent } from './ui/pan/pan.component';
import { AuxBusComponent } from './pages/aux-bus/aux-bus.component';
import { PrepostComponent } from './ui/prepost/prepost.component';
import { FullStateComponent } from './pages/full-state/full-state.component';
import { FxBusComponent } from './pages/fx-bus/fx-bus.component';
import { MasterComponent } from './pages/master/master.component';
import { PlayerComponent } from './pages/player/player.component';
import { InputComponent } from './ui/input/input.component';
import { TransitionComponent } from './ui/transition/transition.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TimePipe } from './ui/time.pipe';
import { MuteGroupsComponent } from './pages/mute-groups/mute-groups.component';
import { VolumebusComponent } from './pages/volumebus/volumebus.component';
import { ShowsComponent } from './pages/shows/shows.component';
import { HwchannelsComponent } from './pages/hwchannels/hwchannels.component';
import { DelayComponent } from './ui/delay/delay.component';

const routes: Routes = [
  { path: '', redirectTo: 'connection', pathMatch: 'full' },
  { path: 'connection', component: ConnectionComponent },
  { path: 'master', component: MasterComponent },
  { path: 'masterbus', component: MasterBusComponent },
  { path: 'auxbus/:bus', component: AuxBusComponent },
  { path: 'fxbus/:bus', component: FxBusComponent },
  { path: 'player', component: PlayerComponent },
  { path: 'mutegroups', component: MuteGroupsComponent },
  { path: 'volumebus', component: VolumebusComponent },
  { path: 'shows', component: ShowsComponent },
  { path: 'hwchannels', component: HwchannelsComponent },
  { path: 'fullstate', component: FullStateComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MixerButtonComponent,
    ConnectionComponent,
    MasterBusComponent,
    MuteButtonComponent,
    SoloButtonComponent,
    FaderLevelComponent,
    PanComponent,
    AuxBusComponent,
    PrepostComponent,
    FullStateComponent,
    FxBusComponent,
    MasterComponent,
    PlayerComponent,
    InputComponent,
    TransitionComponent,
    TimePipe,
    MuteGroupsComponent,
    VolumebusComponent,
    ShowsComponent,
    HwchannelsComponent,
    DelayComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
