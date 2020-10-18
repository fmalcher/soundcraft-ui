import { fromEvent, interval, merge, Observable, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/websocket';
import {
  mergeMap,
  filter,
  switchMap,
  takeUntil,
  mapTo,
  tap,
  map,
  retryWhen,
  delay,
  retry,
  share,
} from 'rxjs/operators';
import * as WebSocket from 'ws';

export class MixerConnection {
  private outboundSubject$: Subject<string>;
  private socket$: WebSocketSubject<string>;

  outbound$: Observable<string>;
  inbound$: Observable<string>;
  allMessages$: Observable<string>;

  constructor(private targetIP: string) {
    const connect$ = new Subject();
    const disconnect$ = new Subject();

    this.socket$ = webSocket<string>({
      url: `ws://${this.targetIP}/socket.io/1/websocket/${
        Math.random() * 10000
      }`,
      WebSocketCtor: WebSocket,
      serializer: data => data,
      deserializer: ({ data }) => data,
      openObserver: connect$,
      closeObserver: disconnect$,
    });

    this.outboundSubject$ = new Subject<string>();
    this.outbound$ = this.outboundSubject$.asObservable();

    this.inbound$ = this.socket$.pipe(mergeMap(message => message.split('\n')));

    this.allMessages$ = merge(this.outbound$, this.inbound$).pipe(share());

    this.allMessages$
      .pipe(filter(m => m.startsWith('SETD')))
      .subscribe(e => console.log('MSG', e));

    /**
     * Keepalive interval
     * every 2 seconds
     * start on connect, stop on disconnect
     */
    connect$
      .pipe(
        switchMap(() => interval(2000).pipe(takeUntil(disconnect$))),
        mapTo('ALIVE')
      )
      .subscribe(this.outboundSubject$);

    connect$.subscribe(e => console.log('Connected'));
    disconnect$.subscribe(e => console.log('Disconnected'));

    /**
     * Send outbound messages
     */
    this.outbound$
      .pipe(
        tap(msg => console.log(new Date(), 'SENDING:', msg)), // log message
        map(msg => `3:::${msg}`)
      )
      .subscribe(this.socket$);
  }

  /**
   * Connect to socket and retry every 5 seconds if connection lost
   */
  connect() {
    this.socket$
      .pipe(
        retryWhen(n$ =>
          n$.pipe(
            delay(5000),
            tap(() => console.log('Reconnect'))
          )
        )
      )
      .subscribe();
  }

  /**
   * Disconnect from socket
   */
  disconnect() {
    this.socket$.complete();
  }

  /**
   * Send command to the mixer
   * @param msg
   */
  sendMessage(msg: string) {
    this.outboundSubject$.next(msg);
  }
}
