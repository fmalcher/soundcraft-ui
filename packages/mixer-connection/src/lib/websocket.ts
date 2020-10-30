export const websocketCtor =
  (typeof window !== 'undefined' && window.WebSocket) || require('ws');
