---
sidebar_position: 4
---

# Device Info

The mixer exposes the following information about the device:

| Call                        | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `conn.deviceInfo.model$`    | Hardware model (`ui12`, `ui16`, `ui24`) as observable stream |
| `conn.deviceInfo.model`     | Hardware model (`ui12`, `ui16`, `ui24`) as synchronous value |
| `conn.deviceInfo.firmware$` | Firmware version                                             |
