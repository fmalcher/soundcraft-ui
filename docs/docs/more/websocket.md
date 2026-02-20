---
sidebar_position: 3
title: WebSocket implementation
---

# Using a different WebSocket implementation

This library uses the WebSocket protocol to communicate with the mixer.
It uses the native `WebSocket` constructor which is available in browsers and in Node.js (v22+).

There might be platforms or scenarios where this doesn't work as intended.
If you want to use another WebSocket implementation, you can specify the WebSocket constructor in the options:

```ts
const conn = new SoundcraftUI({
  targetIP: '192.168.1.123',
  webSocketCtor: MyCustomWebSocket,
});
```
