import {
  interval,
  merge,
  Subject,
  mergeMap,
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
import ws from 'isomorphic-ws';

import { ConnectionEvent, ConnectionStatus } from './types';

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
   * can be fed from anywhere inside this class
   * but must not be exposed
   */
  private statusSubject$ = new Subject<ConnectionEvent>();
  private outboundSubject$ = new Subject<string>();
  private inboundSubject$ = new Subject<string>();

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

  constructor(private targetIP: string) {
    // track connection status in synchronously readable field
    this.statusSubject$.subscribe(status => {
      this._status = status.type;
    });

    /**
     * Wire up the websocket connection object.
     * The connection will be established on first subscribe
     */
    this.socket$ = webSocket<string>({
      url: `ws://${this.targetIP}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      WebSocketCtor: ws as any, // cast necessary since ws object is not fully compatible to WebSocket
      serializer: data => data,
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
        map(() => 'ALIVE')
      )
      .subscribe(msg => this.outboundSubject$.next(msg));

    /** Send outbound messages to mixer */
    this.outbound$
      .pipe(
        map(msg => `3:::${msg}`)
        // tap(msg => console.log(new Date(), 'SENDING:', msg)) // log message
      )
      .subscribe(this.socket$);
  }

  /** Connect to socket and retry if connection lost */
  connect() {
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
            tap(() => this.statusSubject$.next({ type: ConnectionStatus.Reconnecting }))
          ),
      }),
      // parse messages (only use those with `3:::` prefix)
      map(message => {
        const match = message.match(/^(3:::)([\s\S]*)/);
        return match && match[2];
      }),
      filter((e): e is string => !!e),
      mergeMap(message => message.split('\n')) // one message can contain multiple lines with commands. split them into single emissions
    );

    // send all messages to our global stream that survives reconnects
    messages$.subscribe(msg => this.inboundSubject$.next(msg));

    // return promise that resolves when the connection is open
    return firstValueFrom(
      this.status$.pipe(
        filter(status => status.type === ConnectionStatus.Open),
        map(() => {
          return;
        })
      )
    );

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
        })
      )
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
        delay(1000)
      )
      .subscribe(() => this.connect());

    this.disconnect();

    // return promise that resolves when the connection is open again
    return firstValueFrom(
      this.status$.pipe(
        filter(status => status.type === ConnectionStatus.Open),
        map(() => {
          return;
        })
      )
    );
  }

  /**
   * Send command to the mixer
   * @param msg Message to send
   */
  sendMessage(msg: string) {
    this.outboundSubject$.next(msg);
  }
}
