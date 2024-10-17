---
sidebar_position: 3
---

# General Notes

- All channel objects are cached and treated as singletons. If you call `conn.master.input(3)` multiple times, each call returns the exact same object.
- Input values for fader levels and pan are restricted to the range of `0..1`. All other values are not checked or sanitized in any way! Be sure to call the methods with valid values only.
