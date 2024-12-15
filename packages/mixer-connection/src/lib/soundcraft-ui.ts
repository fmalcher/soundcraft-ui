import { Observable } from 'rxjs';

import { AutomixController } from './facade/automix-controller';
import { AuxBus } from './facade/aux-bus';
import { DeviceInfo } from './facade/device-info';
import { DualTrackRecorder } from './facade/dual-track-recorder';
import { FxBus } from './facade/fx-bus';
import { HwChannel } from './facade/hw-channel';
import { MasterBus } from './facade/master-bus';
import { MultiTrackRecorder } from './facade/multi-track-recorder';
import { MuteGroup, MuteGroupID } from './facade/mute-group';
import { Player } from './facade/player';
import { ShowController } from './facade/show-controller';
import { VolumeBus } from './facade/volume-bus';
import { MixerConnection } from './mixer-connection';
import { MixerStore } from './state/mixer-store';
import { ConnectionEvent, SoundcraftUIOptions } from './types';
import { VuProcessor } from './vu/vu-processor';
import { waitForInitParams } from './utils';

export class SoundcraftUI {
  private _options: SoundcraftUIOptions;

  /**
   * Get mixer options as a read-only copy.
   * Options can only be set once at initialization and cannot be changed later.
   */
  get options(): Readonly<SoundcraftUIOptions> {
    return Object.freeze({ ...this._options });
  }

  readonly conn: MixerConnection;
  readonly store: MixerStore;

  /** Information about hardware and software of the mixer */
  readonly deviceInfo: DeviceInfo;

  /** Connection status */
  readonly status$: Observable<ConnectionEvent>;

  /** VU meter information for master channels */
  readonly vuProcessor: VuProcessor;

  /** Master bus */
  readonly master: MasterBus;

  /** Media player */
  readonly player: Player;

  /** 2-track recorder */
  readonly recorderDualTrack: DualTrackRecorder;

  /** multitrack recorder */
  readonly recorderMultiTrack: MultiTrackRecorder;

  /** SOLO and Headphone buses */
  readonly volume: { solo: VolumeBus; headphone: (id: number) => VolumeBus };

  /** Show controller (Shows, Snapshots, Cues) */
  readonly shows: ShowController;

  /** Automix controller */
  readonly automix: AutomixController;

  /**
   * Create a new instance to connect to a Soundcraft Ui mixer.
   * The IP address of the mixer is a required parameter.
   * You can either pass it in directly or as part of an options object:
   *
   * ```ts
   * new SoundcraftUI('192.168.1.123');
   * new SoundcraftUI({ targetIP: '192.168.1.123' });
   * ```
   */
  constructor(options: SoundcraftUIOptions);
  constructor(targetIP: string);
  constructor(targetIPOrOpts: string | SoundcraftUIOptions) {
    // build options object
    if (typeof targetIPOrOpts === 'string') {
      this._options = { targetIP: targetIPOrOpts };
    } else {
      this._options = targetIPOrOpts;
    }

    this.conn = new MixerConnection(this._options);

    this.store = new MixerStore(this.conn);
    this.deviceInfo = new DeviceInfo(this.store);
    this.status$ = this.conn.status$;
    this.vuProcessor = new VuProcessor(this.conn);
    this.master = new MasterBus(this.conn, this.store);
    this.player = new Player(this.conn, this.store);
    this.recorderDualTrack = new DualTrackRecorder(this.conn, this.store);
    this.recorderMultiTrack = new MultiTrackRecorder(this.conn, this.store);
    this.volume = {
      solo: new VolumeBus(this.conn, this.store, 'solovol'),
      headphone: (id: number) => new VolumeBus(this.conn, this.store, 'hpvol', id),
    };
    this.shows = new ShowController(this.conn, this.store);
    this.automix = new AutomixController(this.conn, this.store);
  }

  /**
   * Get AUX bus
   * @param bus Bus number
   */
  aux(bus: number) {
    return new AuxBus(this.conn, this.store, bus);
  }

  /**
   * Get FX bus
   * @param bus Bus number
   */
  fx(bus: number) {
    return new FxBus(this.conn, this.store, bus);
  }

  /**
   * Get MUTE group or related groupings (MUTE ALL and MUTE FX)
   * @param id ID of the group: `1`..`6`, `all`, `fx`
   */
  muteGroup(id: MuteGroupID) {
    return new MuteGroup(this.conn, this.store, id);
  }

  /** Unmute all mute groups, "MUTE ALL" and "MUTE FX" */
  clearMuteGroups() {
    this.conn.sendMessage('SETD^mgmask^0');
  }

  /**
   * Get hardware channel. With 1:1 patching, those are the same as input channels.
   * However, if patched differently, HW channel 1 still is the first input on the hardware.
   *
   * @param channel Channel number
   */
  hw(channel: number) {
    return new HwChannel(this.conn, this.store, this.deviceInfo, channel);
  }

  /** Connect to the mixer. Returns a Promise that resolves when the connection is open and the initial params have likely been received by the mixer. */
  async connect(): Promise<void> {
    await this.conn.connect();
    await waitForInitParams(this.store);
  }

  /** Disconnect from the mixer. Returns a Promise that resolves when the connection is closed. */
  disconnect(): Promise<void> {
    return this.conn.disconnect();
  }

  /**
   * Reconnect to the mixer after 1 second.
   * Returns a Promise that resolves when the connection is open again and the initial params have likely been received by the mixer.
   */
  async reconnect(): Promise<void> {
    await this.conn.reconnect();
    await waitForInitParams(this.store);
  }
}
