---
sidebar_position: 3
---

# General Notes

- All channel objects are cached and treated as singletons. If you call `conn.master.input(3)` multiple times, each call returns the exact same object.
- Input values for fader levels and pan are restricted to the range of `0..1`. Most other values are not checked or sanitized in any way! Be sure to call the methods with valid values only.
- All fader ranges are expressed as values between `0` and `1` internally. This library refers to these as _linear values_. Most parameters are available in this format, which is useful if you want to create your own fader. For some parameters, we also process the values transformed to their physical unit, e.g. `dB` for fader values. This is useful if you want to display values to the user.
