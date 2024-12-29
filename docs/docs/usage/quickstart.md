---
sidebar_position: 0
---

# Quick Start

**This Quick Start Guide will help you get started with this library by creating a simple Node.js script to toggle MUTE on a master channel.**

First, ensure that the [Node.js runtime](https://nodejs.org/en) is installed on your machine.
Create a new folder and initialize a new NPM project:

```bash
mkdir soundcraft-quickstart
cd soundcraft-quickstart
npm init -y
```

Install the library:

```bash
npm install soundcraft-ui-connection
```

Create an `index.mjs` file for your script. Import the `SoundcraftUI` class from the package and create an instance with the IP address of the mixer. Use the `conn.connect()` method to connect to the mixer, which returns a Promise that resolves when the connection is established.

Finally, set an interval to toggle MUTE every 1000 ms:

```javascript
import { SoundcraftUI } from 'soundcraft-ui-connection';

const conn = new SoundcraftUI('192.168.1.111');
await conn.connect();

setInterval(() => {
  conn.master.input(2).toggleMute();
}, 1000);
```

You can run the script from the command line:

```bash
node index.mjs
```

Open the Soundcraft Web App to see Channel 2 mute and unmute every second.

🎉 **Congratulations! You have successfully set up a new project with our library.**
