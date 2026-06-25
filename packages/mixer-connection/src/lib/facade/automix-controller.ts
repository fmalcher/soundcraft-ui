import { map, take } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { selectBoolean, selectRawValue } from '../state/state-selectors';
import { faderValueToTimeMs, timeMsToFaderValue } from '../utils/value-converters/value-converters';

export type AutomixGroupId = 'a' | 'b';

export class AutomixGroup {
  /** Active state of this automix group */
  readonly state$ = this.store.state$.pipe(selectBoolean(`automix.${this.group}.on`));

  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
    private group: AutomixGroupId,
  ) {}

  private setState(value: boolean) {
    this.conn.setdBool(`automix.${this.group}.on`, value);
  }

  /** Enable this automix group */
  enable() {
    this.setState(true);
  }

  /** Disable this automix group */
  disable() {
    this.setState(false);
  }

  /** Toggle the state of this automix group */
  toggle() {
    this.state$.pipe(take(1)).subscribe(value => this.setState(!value));
  }
}

/**
 * Controller for Automix settings
 */
export class AutomixController {
  /** Global response time (linear, between `0` and `1`) */
  readonly responseTime$ = this.store.state$.pipe(selectRawValue<number>('automix.time'));

  /** Global response time in milliseconds (between `20` and `4000` ms) */
  readonly responseTimeMs$ = this.responseTime$.pipe(map(v => faderValueToTimeMs(v)));

  /**
   * Set global response time (linear)
   * @param value linear value between `0` and `1`
   */
  setResponseTime(value: number) {
    this.conn.setd('automix.time', value);
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

  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
  ) {}
}
