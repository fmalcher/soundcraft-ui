import { vi } from 'vitest';

/**
 * Mock WebSocket for testing MixerConnection without a real network connection.
 * Implements the subset of the WebSocket API that rxjs/webSocket relies on
 * (direct onopen/onclose/onmessage/onerror handlers, not addEventListener).
 *
 * Pass as `webSocketCtor` in SoundcraftUIOptions to inject it.
 * Use `simulateOpen()`, `simulateMessage()`, or `simulateClose()`
 * to drive the connection lifecycle from tests.
 */
export class MockWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = MockWebSocket.CONNECTING;
  readonly OPEN = MockWebSocket.OPEN;
  readonly CLOSING = MockWebSocket.CLOSING;
  readonly CLOSED = MockWebSocket.CLOSED;

  url: string;
  readyState = MockWebSocket.CONNECTING;
  binaryType = 'blob';

  // Direct event handlers (used by rxjs/webSocket)
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  send = vi.fn();
  close = vi.fn(() => {
    this.readyState = MockWebSocket.CLOSING;
    this.onclose?.(new CloseEvent('close'));
    this.readyState = MockWebSocket.CLOSED;
  });

  /**
   * Creates a subclass that calls `onCapture` with each new instance.
   * Use this to get a reference to the WebSocket created internally by rxjs.
   */
  static withCapture(onCapture: (instance: MockWebSocket) => void) {
    return class extends MockWebSocket {
      constructor(url: string) {
        super(url);
        onCapture(this);
      }
    };
  }

  constructor(url: string) {
    this.url = url;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addEventListener() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  removeEventListener() {}

  simulateOpen() {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.(new Event('open'));
  }

  simulateMessage(data: string) {
    this.onmessage?.(new MessageEvent('message', { data }));
  }

  simulateClose() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new CloseEvent('close'));
  }
}
