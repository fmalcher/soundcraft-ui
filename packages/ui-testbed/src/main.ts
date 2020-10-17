import { SoundcraftUI } from 'fmalcher/soundcraft-ui-connection';

import * as express from 'express';

const app = express();
const api = express();
app.use('/api', api);

app.use('/', express.static(__dirname + '/assets/public'));

const sui = new SoundcraftUI('10.75.23.95');
sui.connect();

/*******************************/

api.post('/connect', (req, res, next) => {
  sui.connect();
  res.send();
});

api.post('/disconnect', (req, res, next) => {
  sui.disconnect();
  res.send();
});

api.post('/dim/:value', (req, res, next) => {
  sui.dim(req.params.value);
  res.send();
});

/*******************************/

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
