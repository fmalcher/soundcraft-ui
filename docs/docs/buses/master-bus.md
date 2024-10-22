---
sidebar_position: 2
---

# Master Bus

A `MasterChannel` represents a channel on the master bus.
Get access to an instance of `MasterChannel` first:

| Call                    | Description                    |
| ----------------------- | ------------------------------ |
| `conn.master.input(2)`  | Input 2 on master bus          |
| `conn.master.line(1)`   | Line Input 1 on master bus     |
| `conn.master.player(1)` | Player channel 1 on master bus |
| `conn.master.aux(2)`    | AUX channel 2 on master bus    |
| `conn.master.fx(3)`     | FX channel 3 on master bus     |
| `conn.master.sub(3)`    | Sub group 3 on master bus      |
| `conn.master.vca(4)`    | VCA 4 on master bus            |

The `MasterChannel` exposes the following operations:

| Call on `MasterChannel`          | Description                               |
| -------------------------------- | ----------------------------------------- |
| _all generic channel operations_ |                                           |
| `pan$`                           | Get pan value (between `0` and `1`)       |
| `pan(value)`                     | Set pan for channel (between `0` and `1`) |
| `solo$`                          | Get solo status (`0` or `1`)              |
| `setSolo(value)`                 | Set solo for channel (`0` or `1`)         |
| `solo()`                         | Enable solo                               |
| `unsolo()`                       | Disable solo                              |
| `toggleSolo()`                   | Toggle solo status                        |

For `input`, `line` and `aux` master channels, the bus returns a `DelayableMasterChannel` object which is a subtype of `MasterChannel`.
It contains the following members:

| Call on channel           | Description                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| _all from master channel_ |                                                                                                                              |
| `setDelay(ms)`            | Set delay of the channel in milliseconds (between `0` and `250` (for `input` or `line` inputs) or `500` (for `aux` outputs)) |
| `changeDelay(offsetMs)`   | Change channel delay relatively by adding a given value in milliseconds                                                      |
| `delay$`                  | Get channel delay in milliseconds                                                                                            |

Input channels on the master bus also support [automix](../features/automix) and [multitrack](../recording-playback/multitrack) settings, see separate sections.
