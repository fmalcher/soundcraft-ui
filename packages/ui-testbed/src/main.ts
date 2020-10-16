import { MixerConnection } from 'fmalcher/soundcraft-ui-connection';

import * as express from 'express';

const app = express();

const connection = new MixerConnection('10.75.23.95');
connection.connect();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to ui-testbed!' });
});

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
