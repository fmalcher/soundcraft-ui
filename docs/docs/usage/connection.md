---
sidebar_position: 1
---

# Initialization and connection

To get started, you need an instance of the `SoundcraftUI` class.
It must be initialized with the IP adress of the mixer. This can be done by either directly passing the mixer IP as a parameter or by using an options object.
After this, the `SoundcraftUI` instance offers three methods to control the connection.

```ts
import { SoundcraftUI } from 'soundcraft-ui-connection';

const conn = new SoundcraftUI(mixerIP);
// OR
const conn = new SoundcraftUI({ targetIP: mixerIP });

conn.connect(); // open connection

conn.disconnect(); // close connection
conn.reconnect(); // close connection and reconnect after timeout
```

All three methods return a Promise that resolves when the operation has finished.
This is useful when you want to wait for the connection to be open before you start using the mixer.
Please note that these Promises will not reject on errors.
If you want to receive errors, use the `status$` Observable instead.
