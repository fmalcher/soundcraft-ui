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

const routes: Routes = [
  { path: '', redirectTo: 'connection', pathMatch: 'full' },
  { path: 'connection', component: ConnectionComponent },
  { path: 'master', component: MasterComponent },
  { path: 'masterbus', component: MasterBusComponent },
  { path: 'auxbus/:bus', component: AuxBusComponent },
  { path: 'fxbus/:bus', component: FxBusComponent },
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
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
