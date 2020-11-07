# [0.5.1](https://github.com/fmalcher/soundcraft-ui/compare/0.5.0...0.5.1) (2020-11-07)

- fix: use correct import path for rxjs/webSocket

# [0.5.0](https://github.com/fmalcher/soundcraft-ui/compare/0.4.0...0.5.0) (2020-11-07)

- add timed transitions with different easings
- add relative fader value changes
- add subscribable player infos

# [0.4.0](https://github.com/fmalcher/soundcraft-ui/compare/0.3.0...0.4.0) (2020-11-03)

- add PRE/POST toggle for send channels
- rename facade methods and align with README
- add inline documentation for all public facade properties and methods
- add tests for all possible outbound messages

In theory, this is a breaking change. Since this library is not stable yet, we don't bump a major version now.

# [0.3.0](https://github.com/fmalcher/soundcraft-ui/compare/0.2.1...0.3.0) (2020-11-01)

- add dB value converter functions
- get and set fader levels in dB

# [0.2.1](https://github.com/fmalcher/soundcraft-ui/compare/0.2.0...0.2.1) (2020-11-01)

- use [isomorphic-ws](https://github.com/heineiuo/isomorphic-ws) for WebSocket abstraction across platforms
- remove debug output

# [0.2.0](https://github.com/fmalcher/soundcraft-ui/compare/0.1.0...0.2.0) (2020-11-01)

- documentation
- compatible with browser environment
- new fully-featured browser testbed
- bugs fixed
- own implementation for object-path utils

# [0.1.0](https://github.com/fmalcher/soundcraft-ui/releases/tag/0.1.0) (2020-10-30)

This is the first working version of the library. There is a lot still missing but you can already use it to connect to the mixer, send commands and receive feedback.
