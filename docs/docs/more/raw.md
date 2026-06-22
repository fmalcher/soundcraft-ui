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

For the two most common commands there are typed helpers that build the message string for you. They make the distinction between numeric and string values explicit:

- `conn.conn.setd(path, value)`: send a `SETD` command. `SETD` messages carry **numeric** values, e.g. fader levels, mute states or gains.
- `conn.conn.sets(path, value)`: send a `SETS` command. `SETS` messages carry **string** values, e.g. channel names.

```ts
conn.conn.setd('m.mix', 0.4);
conn.conn.setd('i.2.mute', 0);
conn.conn.sets('i.2.name', 'Vocals');
```

:::warning

**Please prefer the human-readable interface over using the raw format!** If you're missing any features, please [file an issue](https://github.com/fmalcher/soundcraft-ui/issues) or [Pull Request](https://github.com/fmalcher/soundcraft-ui/pulls).

:::
