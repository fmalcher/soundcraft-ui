import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { filter } from 'rxjs';
import { MixerConnection } from './mixer-connection';
import { ConnectionStatus } from './types';
import { MockWebSocket } from './utils/mock-websocket';

describe('MixerConnection', () => {
  let conn: MixerConnection;
  let wsMock: MockWebSocket;

  beforeEach(() => {
    vi.useFakeTimers();

    const WebSocketCtor = MockWebSocket.withCapture(instance => {
      wsMock = instance;
    });

    conn = new MixerConnection({
      targetIP: '192.168.1.1',
      webSocketCtor: WebSocketCtor as unknown as typeof WebSocket,
    });
  });

  afterEach(() => vi.useRealTimers());

  describe('constructor', () => {
    it('should have initial status Close', () => {
      expect(conn.status).toBe(ConnectionStatus.Close);
    });
  });

  describe('connect()', () => {
    it('should emit Opening status', () => {
      let status: ConnectionStatus | undefined;
      conn.status$.subscribe(e => (status = e.type));

      conn.connect();

      expect(status).toBe(ConnectionStatus.Opening);
    });

    it('should create WebSocket with correct URL', () => {
      conn.connect();

      expect(wsMock.url).toBe('ws://192.168.1.1');
    });

    describe('when connected', () => {
      beforeEach(async () => {
        const connectPromise = conn.connect();
        wsMock.simulateOpen();
        await connectPromise;
      });

      it('should emit Open status', () => {
        expect(conn.status).toBe(ConnectionStatus.Open);
      });

      it('should emit inbound messages with 3::: prefix stripped', () => {
        const messages: string[] = [];
        conn.inbound$.subscribe(msg => messages.push(msg));

        wsMock.simulateMessage('3:::SETD^i.0.mix^0.5');

        expect(messages).toEqual(['SETD^i.0.mix^0.5']);
      });

      it('should ignore messages without 3::: prefix', () => {
        const messages: string[] = [];
        conn.inbound$.subscribe(msg => messages.push(msg));

        wsMock.simulateMessage('2::');
        wsMock.simulateMessage('1::');

        expect(messages).toEqual([]);
      });

      it('should split multi-line messages into separate emissions', () => {
        const messages: string[] = [];
        conn.inbound$.subscribe(msg => messages.push(msg));

        wsMock.simulateMessage('3:::SETD^i.0.mix^0.5\nSETD^i.1.mix^0.8');

        expect(messages).toEqual(['SETD^i.0.mix^0.5', 'SETD^i.1.mix^0.8']);
      });
    });
  });

  describe('sendMessage()', () => {
    it('should emit on outbound$', () => {
      const messages: string[] = [];
      conn.outbound$.subscribe(msg => messages.push(msg));

      conn.sendMessage('SETD^m.mix^0.5');

      expect(messages).toEqual(['SETD^m.mix^0.5']);
    });

    it('should emit on allMessages$', () => {
      const messages: string[] = [];
      conn.allMessages$.subscribe(msg => messages.push(msg));

      conn.sendMessage('SETD^m.mix^0.5');

      expect(messages).toEqual(['SETD^m.mix^0.5']);
    });

    it('should send message through the WebSocket', async () => {
      const connectPromise = conn.connect();
      wsMock.simulateOpen();
      await connectPromise;

      conn.sendMessage('SETD^m.mix^0.5');

      expect(wsMock.send).toHaveBeenCalledWith('3:::SETD^m.mix^0.5');
    });
  });

  describe('disconnect()', () => {
    beforeEach(async () => {
      const connectPromise = conn.connect();
      wsMock.simulateOpen();
      await connectPromise;
    });

    it('should call close() on the WebSocket', () => {
      conn.disconnect();

      expect(wsMock.close).toHaveBeenCalled();
    });

    it('should emit Closing and Close status', () => {
      const statuses: ConnectionStatus[] = [];
      conn.status$.subscribe(e => statuses.push(e.type));

      conn.disconnect();

      expect(statuses).toContain(ConnectionStatus.Closing);
      expect(statuses).toContain(ConnectionStatus.Close);
    });
  });

  describe('keepalive', () => {
    beforeEach(async () => {
      const connectPromise = conn.connect();
      wsMock.simulateOpen();
      await connectPromise;
    });

    it('should send ALIVE messages every 1000ms after connection opens', async () => {
      const aliveMessages: string[] = [];
      conn.outbound$.pipe(filter(msg => msg === 'ALIVE')).subscribe(msg => aliveMessages.push(msg));

      await vi.advanceTimersByTimeAsync(3000);

      expect(aliveMessages.length).toBe(3);
    });

    it('should stop keepalive after disconnect', async () => {
      const aliveMessages: string[] = [];
      conn.outbound$.pipe(filter(msg => msg === 'ALIVE')).subscribe(msg => aliveMessages.push(msg));

      await vi.advanceTimersByTimeAsync(2000);
      expect(aliveMessages.length).toBe(2);

      conn.disconnect();

      await vi.advanceTimersByTimeAsync(3000);
      expect(aliveMessages.length).toBe(2);
    });
  });
});
