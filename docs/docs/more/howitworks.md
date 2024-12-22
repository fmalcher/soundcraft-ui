---
sidebar_position: 4
title: How this library works
---

# How this library works

The original web application for the Soundcraft Ui mixers uses a WebSocket connection to communicate with the mixer hardware.

This library replicates the communication protocol used by the original web interface, allowing interaction with the mixer using JavaScript/TypeScript. It establishes a WebSocket connection to the mixer and provides an object-oriented interface to control all aspects of the hardware.

When an action is performed, a text-based message is sent to the mixer. For example, calling `conn.master.input(1).mute()` to mute the first channel on the master bus sends the following message:

```
SETD^i.0.mute^1
```

This message indicates a state change. All other connected clients receive the same message after the mixer state has changed. When a new connection is initialized, the mixer sends its full state to the client as individual messages in this format. This ensures that all clients are always aware of the mixer's current state. Incoming and outgoing messages continuously update the state.

The library exposes these state changes as Observable objects that can be subscribed to. Most messages follow the format `SETD^key^value`. All messages (incoming and outgoing) are parsed to extract the key and value, updating the internal state object accordingly. The Observable stream then emits the state change.

For example, subscribing to `conn.master.input(1).faderLevel$` will emit `0.5` when the following message is received: `SETD^i.0.mix^0.5`.

The goal of this library is to provide a thin wrapper around the original protocol, staying as close as possible to the protocol. This makes it easier to interact with the mixer without needing to create or parse raw messages.

## Further reading

- Blog post about manually connecting to the mixer: [https://blechtrottel.net/en/jswebsockets.html](https://blechtrottel.net/en/jswebsockets.html)
