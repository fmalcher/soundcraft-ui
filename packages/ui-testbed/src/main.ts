import { SoundcraftUI } from 'fmalcher/soundcraft-ui-connection';

import * as express from 'express';

const app = express();
const api = express();
app.use('/api', api);

app.use('/', express.static(__dirname + '/assets/public'));

const sui = new SoundcraftUI('10.75.23.95');
sui.connect();

/*******************************/

const logObserver = (prefix: string) => ({ next: e => console.log(prefix, e) });

sui.state.getFaderValue('i', 3).subscribe(logObserver('Master CH3'));
sui.state.getFaderValue('f', 2).subscribe(logObserver('Master FX2'));
sui.state.getFaderValue('i', 3, 'aux', 4).subscribe(logObserver('AUX4 CH3'));
sui.state.getFaderValue('i', 3, 'fx', 1).subscribe(logObserver('FX1 CH3'));

sui.state.getMute('i', 3).subscribe(logObserver('Master CH3 Mute'));
sui.state.getMute('i', 3, 'aux', 4).subscribe(logObserver('AUX4 CH3 Mute'));

sui.state.getSolo('i', 3).subscribe(logObserver('Master CH3 Solo'));

sui.state.getPan('i', 3).subscribe(logObserver('Master CH3 Pan'));
sui.state.getPan('i', 3, 'aux', 4).subscribe(logObserver('AUX4 CH3 Pan'));

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
