# soundcraft-ui-connection

[![npm](https://img.shields.io/npm/v/soundcraft-ui-connection.svg)](https://www.npmjs.com/package/soundcraft-ui-connection)

This library provides a generic connection interface for the Soundcraft Ui series audio mixers (Ui12, Ui16 and Ui24R).

## Full documentation

**👉 [https://fmalcher.github.io/soundcraft-ui](https://fmalcher.github.io/soundcraft-ui)**

## Installation

```sh
npm i soundcraft-ui-connection
```

## Initialization and connection

```ts
import { SoundcraftUI } from 'soundcraft-ui-connection';

const conn = new SoundcraftUI(mixerIP);
conn.connect();

conn.disconnect(); // close connection
conn.reconnect(); // close connection and reconnect after timeout
```

## Use commands and feedback

The `SoundcraftUI` object exposes commands and feedback in a human-readable and object-oriented structure.
Feedback is published as streams that you can subscribe to. This uses the Observable object from [RxJS](https://rxjs.dev/).

```ts
conn.master.setFaderLavel(0.5);
conn.master.input(5).solo();
conn.aux(3).input(2).mute();

conn.master.faderLevel$.subscribe(value => {
  // ...
});
```

## License

MIT
