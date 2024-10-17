---
sidebar_position: 0
---

# Stereo Link

All commands respect the stereo link settings: If a channel is linked, all actions like fader level, mute, solo, etc. will be mirrored to the linked channel.
This also applies to stereo-linked AUX buses so that the corresponding channel on a linked AUX bus mirrors the actions.

**Examples:**

| Links              | Action                           | Result                             |
| ------------------ | -------------------------------- | ---------------------------------- |
| CH 3/4             | MUTE CH 3                        | MUTE CH 3/4                        |
| AUX 1/2            | Fader level change CH 5 on AUX 1 | Fader level change CH 5 on AUX 1/2 |
| CH 3/4 and AUX 1/2 | MUTE CH 3 on AUX 1               | MUTE CH 3/4 on AUX 1/2             |

This behavior matches the way the original web app handles stereo-linking.
