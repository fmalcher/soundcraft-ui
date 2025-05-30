import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ConnectionService } from '../../connection.service';
import { VuMeter } from '../../ui/vu-meter/vu-meter';
import { map } from 'rxjs';
import { vuValueToDB } from 'soundcraft-ui-connection';

@Component({
  selector: 'sui-vu-page',
  templateUrl: './vu-page.html',
  styleUrl: './vu-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, JsonPipe, VuMeter],
})
export class VuPage {
  vuProcessor = inject(ConnectionService).conn.vuProcessor;

  vuData$ = this.vuProcessor.vuData$;
  readonly fullStateVisible = signal(false);

  inputChannels = [
    { vuData: this.vuProcessor.input(1), label: 'Input 1', type: 'input' },
    { vuData: this.vuProcessor.input(2), label: 'Input 2', type: 'input' },
    { vuData: this.vuProcessor.player(1), label: 'Player L', type: 'input' },
    { vuData: this.vuProcessor.player(2), label: 'Player R', type: 'input' },
    { vuData: this.vuProcessor.line(1), label: 'Line L', type: 'input' },
    { vuData: this.vuProcessor.line(2), label: 'Line R', type: 'input' },
  ];

  auxChannels = [
    { vuData: this.vuProcessor.aux(1), label: 'AUX 1', type: 'aux' },
    { vuData: this.vuProcessor.aux(2), label: 'AUX 2', type: 'aux' },
  ];

  stereoChannels = [
    { vuData: this.vuProcessor.master(), label: 'Master', type: 'stereo' },
    { vuData: this.vuProcessor.fx(1), label: 'FX 1', type: 'stereo' },
    { vuData: this.vuProcessor.fx(2), label: 'FX 2', type: 'stereo' },
    { vuData: this.vuProcessor.sub(1), label: 'Sub group 1', type: 'stereo' },
    { vuData: this.vuProcessor.sub(2), label: 'Sub group 2', type: 'stereo' },
  ];

  masterPostFaderLDB$ = this.vuProcessor.master().pipe(map(data => vuValueToDB(data.vuPostFaderL)));
}
