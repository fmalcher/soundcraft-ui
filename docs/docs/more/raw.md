---
sidebar_position: 2
title: Raw messages and state
---

# Working with raw messages and state

The `MixerStore` object exposes raw streams with messages and state data. You can use them for debugging purposes or for integration in other services:

- `conn.store.messages$`: Stream of all raw `SETD` and `SETS` messages (inbound and outbound)
- `conn.store.state$`: Stream of state objects, derived from the messages

In much the same way you can send raw messages to the mixer:

```ts
conn.conn.sendMessage('SETD^m.mix^0.4');
conn.conn.sendMessage('SETD^i.2.mute^0');
```

:::warning

**Please prefer the human-readable interface over using the raw format!** If you're missing any features, please [file an issue](https://github.com/fmalcher/soundcraft-ui/issues) or [Pull Request](https://github.com/fmalcher/soundcraft-ui/pulls).

:::
