---
sidebar_position: 7
---

# Channel Sync

Channel Sync allows the synchronization of channel selection across multiple clients. When enabled, selecting a channel in the Web UI will automatically select the same channel in all other clients that share the same SYNC ID.
This feature also supports grouping, where different SYNC IDs can be assigned to different groups of clients, ensuring that channel selection is synchronized within each group independently.

Channel Sync must be enabled on each client individually:

- Settings > Local > Sync Selected Channel

The default SYNC ID is `SYNC_ID`, but you can customize it to any value you prefer.
Clients with the same SYNC ID will sync their selected channel.

A `ChannelSync` class instance is available through `conn.channelSync`. This class allows you to select channels and read the current selection.

## Usage with Channel Objects and Types

The `ChannelSync` class offers methods to select channels and retrieve selected objects. Each method call can receive an optional `syncId`. If none is provided, it will use the default value `SYNC_ID`. Note that you cannot set a SYNC ID globally like in the web app; it must be specified in every call. This design allows the library to interact with multiple sync groups simultaneously.

| Call on `ChannelSync`                            | Description                                                                                                                                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getSelectedChannel(syncId)`                     | Get the currently selected channel object on the master bus as an Observable stream of `FadeableChannel`. Emits `null` when no channel is available for the currently selected index. |
| `selectChannel('master', syncId)`                | Select the master fader                                                                                                                                                               |
| `selectChannel(channelType, channelNum, syncId)` | Select a channel by type and number, see table below for possible channel type values                                                                                                 |

The `FadeableChannel` interface includes only a subset of fields and methods that all faders share.

`ChannelType` is a union type with the following possible values:

| Value | Description |     | Value | Description |
| ----- | ----------- | --- | ----- | ----------- |
| `i`   | Input       |     | `s`   | Subgroup    |
| `l`   | Line        |     | `a`   | AUX         |
| `p`   | Player      |     | `v`   | VCA         |
| `f`   | FX          |     |       |             |

### Examples

```ts
// Select the master fader
conn.channelSync.selectChannel('master');

// Select the master fader with a custom SYNC ID
conn.channelSync.selectChannel('master', 'abc');

// Select input channel 3
conn.channelSync.selectChannel('i', 3);

// Select input channel 10 with a custom SYNC ID
conn.channelSync.selectChannel('i', 10, 'abc');

// Select Player L
conn.channelSync.selectChannel('p', 1);

// Select AUX 2
conn.channelSync.selectChannel('a', 2);
```

## Usage with Channel Index

Internally, channels are identified by their index on the master bus, counted from left to right. Refer to the big table below for the complete mapping between index and exact channel in the different hardware models. The library automatically reflects the current hardware model so that we can work with the human-readable interface described above.

The following methods allow working with the raw index values. The `syncId` is optional and defaults to `SYNC_ID` if not provided.

| Call on `ChannelSync`               | Description                                                             |
| ----------------------------------- | ----------------------------------------------------------------------- |
| `getSelectedChannelIndex(syncId)`   | Get the index of the currently selected channel as an Observable stream |
| `selectChannelIndex(index, syncId)` | Select a channel by index                                               |

A full record stream of all SYNC IDs and their current values is available through the `MixerStore` class:

```ts
conn.store.syncState$.subscribe(/* ... */);

// Structure:
// { "SYNC_ID": 3, "anotherSyncId": 10 }
```

### Index/Channel Mapping

| Index | Channel Ui24R | Channel Ui16 | Channel Ui12 |
| ----- | ------------- | ------------ | ------------ |
| `-1`  | Master        | Master       | Master       |
| `0`   | CH 1          | CH 1         | CH 1         |
| `1`   | CH 2          | CH 2         | CH 2         |
| `2`   | CH 3          | CH 3         | CH 3         |
| `3`   | CH 4          | CH 4         | CH 4         |
| `4`   | CH 5          | CH 5         | CH 5         |
| `5`   | CH 6          | CH 6         | CH 6         |
| `6`   | CH 7          | CH 7         | CH 7         |
| `7`   | CH 8          | CH 8         | CH 8         |
| `8`   | CH 9          | CH 9         | Line In L    |
| `9`   | CH 10         | CH 10        | Line In R    |
| `10`  | CH 11         | CH 11        | Player L     |
| `11`  | CH 12         | CH 12        | Player R     |
| `12`  | CH 13         | Line In L    | FX 1         |
| `13`  | CH 14         | Line In R    | FX 2         |
| `14`  | CH 15         | Player L     | FX 3         |
| `15`  | CH 16         | Player R     | FX 4         |
| `16`  | CH 17         | FX 1         | SUB 1        |
| `17`  | CH 18         | FX 2         | SUB 2        |
| `18`  | CH 19         | FX 3         | SUB 3        |
| `19`  | CH 20         | FX 4         | SUB 4        |
| `20`  | CH 21         | SUB 1        | AUX 1        |
| `21`  | CH 22         | SUB 2        | AUX 2        |
| `22`  | CH 23         | SUB 3        | AUX 3        |
| `23`  | CH 24         | SUB 4        | AUX 4        |
| `24`  | Line In L     | AUX 1        |              |
| `25`  | Line In R     | AUX 2        |              |
| `26`  | Player L      | AUX 3        |              |
| `27`  | Player R      | AUX 4        |              |
| `28`  | FX 1          | AUX 5        |              |
| `29`  | FX 2          | AUX 6        |              |
| `30`  | FX 3          |              |              |
| `31`  | FX 4          |              |              |
| `32`  | SUB 1         |              |              |
| `33`  | SUB 2         |              |              |
| `34`  | SUB 3         |              |              |
| `35`  | SUB 4         |              |              |
| `36`  | SUB 5         |              |              |
| `37`  | SUB 6         |              |              |
| `38`  | AUX 1         |              |              |
| `39`  | AUX 2         |              |              |
| `40`  | AUX 3         |              |              |
| `41`  | AUX 4         |              |              |
| `42`  | AUX 5         |              |              |
| `43`  | AUX 6         |              |              |
| `44`  | AUX 7         |              |              |
| `45`  | AUX 8         |              |              |
| `46`  | AUX 9         |              |              |
| `47`  | AUX 10        |              |              |
| `48`  | VCA 1         |              |              |
| `49`  | VCA 2         |              |              |
| `50`  | VCA 3         |              |              |
| `51`  | VCA 4         |              |              |
| `52`  | VCA 5         |              |              |
| `53`  | VCA 6         |              |              |
