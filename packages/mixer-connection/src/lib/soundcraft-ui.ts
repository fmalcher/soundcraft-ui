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

export class SoundcraftUI {
  readonly conn = new MixerConnection(this.targetIP);
  readonly store = new MixerStore(this.conn);

  deviceInfo = new DeviceInfo(this.store);

  /** Connection status */
  status$ = this.conn.status$;

  /** Master bus */
  master = new MasterBus(this.conn, this.store);

  /** Media player */
  player = new Player(this.conn, this.store);

  /** 2-track recorder */
  recorderDualTrack = new DualTrackRecorder(this.conn, this.store);

  /** multitrack recorder */
  recorderMultiTrack = new MultiTrackRecorder(this.conn, this.store);

  /** SOLO and Headphone buses */
  volume = {
    solo: new VolumeBus(this.conn, this.store, 'solovol'),
    headphone: (id: number) => new VolumeBus(this.conn, this.store, 'hpvol', id),
  };

  /** Show controller (Shows, Snapshots, Cues) */
  shows = new ShowController(this.conn, this.store);

  constructor(private targetIP: string) {}

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
   * @param id ID of the group: 1..6, all, fx
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

  /** Connect to the mixer. Returns a Promise that resolves when the connection is open. */
  connect(): Promise<void> {
    return this.conn.connect();
  }

  /** Disconnect from the mixer. Returns a Promise that resolves when the connection is closed. */
  disconnect(): Promise<void> {
    return this.conn.disconnect();
  }

  /**
   * Reconnect to the mixer after 1 second.
   * Returns a Promise that resolves when the connection is open again.
   */
  reconnect(): Promise<void> {
    return this.conn.reconnect();
  }
}
