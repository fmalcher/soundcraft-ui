---
sidebar_position: 1
---

# 2-Track USB Recorder

The following commands control the dual-track USB recorder in the media player section.
The `DualTrackRecorder` object can be accessed through `conn.recorderDualTrack`.

| Call on `DualTrackRecorder` | Description                       |
| --------------------------- | --------------------------------- |
| `recording$`                | Recording state (`0` or `1`)      |
| `busy$`                     | Recording busy state (`0` or `1`) |
| `recordToggle()`            | Toggle recording                  |
| `recordStart()`             | Start recording                   |
| `recordStop()`              | Stop recording                    |
