---
sidebar_position: 2
---

# MUTE Groups

The mixer supports up to 6 MUTE groups.
Functions "MUTE ALL" and "MUTE FX" are also expressed as logical MUTE groups, internally.

First, get access to a `MuteGroup` object:

| Call                    | Description          |
| ----------------------- | -------------------- |
| `conn.muteGroup(1)`     | Mute Group 1         |
| `conn.muteGroup(2)`     | Mute Group 2         |
| `conn.muteGroup('fx')`  | Group for "MUTE FX"  |
| `conn.muteGroup('all')` | Group for "MUTE ALL" |

`MuteGroup` supports the following operations:

| Call on `MuteGroup` | Description                  |
| ------------------- | ---------------------------- |
| `state$`            | Get MUTE status (`0` or `1`) |
| `mute()`            | Mute the group               |
| `unmute()`          | Unmute the group             |
| `toggle()`          | Toggle mute group            |

Call `conn.clearMuteGroups()` to disable all MUTE groups.
This behaves differently from the "CLEAR MUTE" button in the Soundcraft Web App which also clears channel mutes.
