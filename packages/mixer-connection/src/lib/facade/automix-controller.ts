import { map, take } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { selectRawValue } from '../state/state-selectors';
import { faderValueToTimeMs, timeMsToFaderValue } from '../utils/value-converters/value-converters';

export type AutomixGroupId = 'a' | 'b';

export class AutomixGroup {
  /** Active state of this automix group (`0` or `1`) */
  state$ = this.store.state$.pipe(selectRawValue<number>(`automix.${this.group}.on`));

  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
    private group: AutomixGroupId
  ) {}

  private setState(value: number) {
    this.conn.sendMessage(`SETD^automix.${this.group}.on^${value}`);
  }

  /** Enable this automix group */
  enable() {
    this.setState(1);
  }

  /** Disable this automix group */
  disable() {
    this.setState(0);
  }

  /** Toggle the state of this automix group */
  toggle() {
    this.state$.pipe(take(1)).subscribe(value => this.setState(value ^ 1));
  }
}

/**
 * Controller for Automix settings
 */
export class AutomixController {
  /** Global response time (linear, between `0` and `1`) */
  responseTime$ = this.store.state$.pipe(selectRawValue<number>('automix.time'));

  /** Global response time in milliseconds (between `20` and `4000` ms) */
  responseTimeMs$ = this.responseTime$.pipe(map(v => faderValueToTimeMs(v)));

  /**
   * Set global response time (linear)
   * @param value linear value between `0` and `1`
   */
  setResponseTime(value: number) {
    this.conn.sendMessage(`SETD^automix.time^${value}`);
  }

  /**
   * Set global response time (ms)
   * @param value milliseconds value between `20` and `4000`
   */
  setResponseTimeMs(timeMs: number) {
    this.setResponseTime(timeMsToFaderValue(timeMs));
  }

  /** Access to automix groups `a` and `b` */
  groups: { [Id in AutomixGroupId]: AutomixGroup } = {
    a: new AutomixGroup(this.conn, this.store, 'a'),
    b: new AutomixGroup(this.conn, this.store, 'b'),
  };

  constructor(private conn: MixerConnection, private store: MixerStore) {}
}
