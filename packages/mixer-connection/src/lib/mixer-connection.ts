import {
  interval,
  merge,
  Subject,
  Subscription,
  filter,
  switchMap,
  takeUntil,
  tap,
  map,
  retry,
  timer,
  firstValueFrom,
  take,
  delay,
} from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { ConnectionEvent, ConnectionStatus, SoundcraftUIOptions } from './types';

export class MixerConnection {
  /** time to wait before reconnecting after an error */
  private reconnectTime = 2000;

  /** period time for the keepalive interval messages */
  private keepaliveTime = 1000;

  private socket$: WebSocketSubject<string>;

  /**
   * closing the socket is not enough to finally end the connection.
   * socket$.complete() only works if the socket is open.
   * However, if there's a timed reconnect running, it will try to reconnect.
   * socket$.complete() will have no effect.
   * We have a separate notifier here to destroy the timed reconnect when the user actually wants to close everything
   */
  private forceClose$ = new Subject<void>();

  /**
   * internal message streams.
   * can be fed from anywhere inside this class but must not be exposed
   */
  private statusSubject$ = new Subject<ConnectionEvent>();
  private outboundSubject$ = new Subject<string>();
  private inboundSubject$ = new Subject<string>();

  /**
   * active subscription that pipes socket messages into the inbound stream.
   * Used to guard against parallel connections when connect() is called multiple times.
   */
  private socketSubscription?: Subscription;

  private _status: ConnectionStatus = ConnectionStatus.Close;

  /** public message streams */

  /** Connection status stream */
  status$ = this.statusSubject$.asObservable();

  /** Connection status */
  get status() {
    return this._status;
  }

  /** All outbound messages (from client to mixer) */
  outbound$ = this.outboundSubject$.asObservable();

  /** All inbound messages (from mixer to client) */
  inbound$ = this.inboundSubject$.asObservable();

  /** combined stream of inbound and outbound messages */
  allMessages$ = merge(this.outbound$, this.inbound$);

  constructor(options: SoundcraftUIOptions) {
    // track connection status in synchronously readable field
    this.statusSubject$.subscribe(status => {
      this._status = status.type;
    });

    /**
     * Wire up the websocket connection object.
     * The connection will be established on first subscribe
     */
    this.socket$ = webSocket<string>({
      url: `ws://${options.targetIP}`,
      WebSocketCtor: options.webSocketCtor || WebSocket,
      serializer: msg => `3:::${msg}`,
      deserializer: ({ data }) => data,
      openObserver: {
        next: () => this.statusSubject$.next({ type: ConnectionStatus.Open }),
      },
      closingObserver: {
        next: () => this.statusSubject$.next({ type: ConnectionStatus.Closing }),
      },
      closeObserver: {
        next: () => this.statusSubject$.next({ type: ConnectionStatus.Close }),
      },
    });

    /**
     * Keepalive interval
     * start on connect, stop on disconnect
     */
    const open$ = this.status$.pipe(filter(e => e.type === ConnectionStatus.Open));
    const close$ = this.status$.pipe(filter(e => e.type === ConnectionStatus.Close));

    open$
      .pipe(
        switchMap(() => interval(this.keepaliveTime).pipe(takeUntil(close$))),
        map(() => 'ALIVE'),
      )
      .subscribe(msg => this.outboundSubject$.next(msg));

    /** Send outbound messages to mixer */
    this.outbound$.subscribe(this.socket$);
  }

  /** Returns a promise that resolves when the connection status becomes Open */
  private waitForOpenStatus(): Promise<void> {
    return firstValueFrom(
      this.status$.pipe(
        filter(status => status.type === ConnectionStatus.Open),
        map(() => {
          return;
        }),
      ),
    );
  }

  /** Connect to socket and retry if connection lost */
  connect() {
    // Guard against parallel connections:
    // every additional call would create another socket subscription,
    // causing all inbound messages to be processed multiple times.
    if (this.socketSubscription && !this.socketSubscription.closed) {
      if (this._status === ConnectionStatus.Open) {
        return Promise.resolve();
      }
      // a connection attempt is already in progress: wait for it to open
      return this.waitForOpenStatus();
    }

    this.statusSubject$.next({ type: ConnectionStatus.Opening });
    const messages$ = this.socket$.pipe(
      tap({
        // report errors
        error: payload =>
          this.statusSubject$.next({
            type: ConnectionStatus.Error,
            payload,
          }),
      }),
      // reconnect on error
      retry({
        delay: () =>
          timer(this.reconnectTime).pipe(
            takeUntil(this.forceClose$),
            tap(() => this.statusSubject$.next({ type: ConnectionStatus.Reconnecting })),
          ),
      }),
      filter(message => message.startsWith('3:::')), // only use messages with `3:::` prefix
      map(message => message.slice(4)), // remove prefix
    );

    // Send all messages to our global stream that survives reconnects.
    // One raw message can contain multiple lines with commands: split them into single emissions.
    // Single-line messages are the common case (every VU frame, every SETD/SETS),
    // so they take an allocation-free fast path.
    this.socketSubscription = messages$.subscribe(message => {
      if (message.includes('\n')) {
        for (const line of message.split('\n')) {
          this.inboundSubject$.next(line);
        }
      } else {
        this.inboundSubject$.next(message);
      }
    });

    // return promise that resolves when the connection is open
    return this.waitForOpenStatus();

    /*
    // Keep for later: echo
    this.socket$
      .pipe(
        filter(msg => msg === '2::')
        // tap(msg => console.log('ECHO', msg))
      )
      .subscribe(msg => this.socket$.next(msg)); */

    /*
    // Keep for later: initialization messages
    this.socket$
      .pipe(
        filter(msg => msg === '1::'),
        mergeMapTo([
          'SERIAL',
          `USERTIME^${Date.now()}^-60`,
          'MEDIA_GET_PLISTS',
        ])
      )
      .subscribe(msg => this.socket$.next(msg));*/
  }

  /** Disconnect from socket */
  disconnect() {
    this.socket$.complete();
    this.forceClose$.next();

    // return promise that resolves when the connection is closed
    return firstValueFrom(
      this.status$.pipe(
        filter(status => status.type === ConnectionStatus.Close),
        map(() => {
          return;
        }),
      ),
    );
  }

  /**
   * Reconnect to the mixer:
   * disconnect, then wait 1 second before connecting again
   */
  reconnect() {
    this.status$
      .pipe(
        filter(e => e.type === ConnectionStatus.Close),
        take(1),
        delay(1000),
      )
      .subscribe(() => this.connect());

    this.disconnect();

    // return promise that resolves when the connection is open again
    return this.waitForOpenStatus();
  }

  /**
   * Send command to the mixer
   * @param msg Message to send, e.g. `SETD^i.2.mute^1`
   */
  sendMessage(msg: string) {
    this.outboundSubject$.next(msg);
  }

  /**
   * Send a `SETD` command to the mixer.
   * `SETD` messages carry numeric (data) values, e.g. fader levels, mute states or gains.
   * @param path Parameter path, e.g. `i.2.mute`
   * @param value Numeric value to set
   */
  setd(path: string, value: number) {
    this.sendMessage(`SETD^${path}^${value}`);
  }

  /**
   * Send a `SETD` command with a boolean (on/off) value to the mixer.
   * The boolean is converted to the numeric `0`/`1` the protocol expects.
   * @param path Parameter path, e.g. `i.2.mute`
   * @param value Boolean value to set
   */
  setdBool(path: string, value: boolean) {
    this.sendMessage(`SETD^${path}^${Number(value)}`);
  }

  /**
   * Send a `SETS` command to the mixer.
   * `SETS` messages carry string values, e.g. channel names.
   * @param path Parameter path, e.g. `i.2.name`
   * @param value String value to set
   */
  sets(path: string, value: string) {
    this.sendMessage(`SETS^${path}^${value}`);
  }
}
