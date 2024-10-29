---
sidebar_position: 3
title: WebSocket implementation
---

# Using a different WebSocket implementation

This library uses the WebSocket protocol to communicate with the mixer.
While this usually works well in a browser environment with the original `WebSocket` constructor available, things can get difficult on other platforms like Node.js.
Under the hood, we use the [`modern-isomorphic-ws`](https://github.com/JoCat/modern-isomorphic-ws/) package to automatically fall back to `ws` on Node.js.

There might be platforms or scenarios where this doesn't work as intended.
If you want to use another WebSocket implementation or e.g. want explicitly use the DOM API, you can specify the WebSocket constructor in the options:

```ts
const conn = new SoundcraftUI({
  targetIP: '192.168.1.123',
  webSocketCtor: WebSocket,
});
```
