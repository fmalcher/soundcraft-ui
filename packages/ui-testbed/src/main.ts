import { SoundcraftUI } from 'soundcraft-ui-connection';

import * as express from 'express';

const app = express();
const api = express();
app.use('/api', api);

app.use('/', express.static(__dirname + '/assets/public'));

let sui: SoundcraftUI;

/*******************************/

const logObserver = (prefix: string) => ({ next: e => console.log(prefix, e) });

/*sui.store.getFaderValue('i', 3).subscribe(logObserver('Master CH3'));
sui.store.getFaderValue('f', 2).subscribe(logObserver('Master FX2'));
sui.store.getFaderValue('i', 3, 'aux', 4).subscribe(logObserver('AUX4 CH3'));
sui.store.getFaderValue('i', 3, 'fx', 1).subscribe(logObserver('FX1 CH3'));

sui.state.getMute('i', 5).subscribe(logObserver('Master CH5 Mute'));
sui.state.getMute('i', 3, 'aux', 4).subscribe(logObserver('AUX4 CH3 Mute'));

sui.state.getSolo('i', 3).subscribe(logObserver('Master CH3 Solo'));

sui.store.getPan('i', 3).subscribe(logObserver('Master CH3 Pan'));
sui.store.getPan('i', 3, 'aux', 4).subscribe(logObserver('AUX4 CH3 Pan'));*/

/*******************************/

api.post('/disconnect', (req, res) => res.send(sui.disconnect()));
api.post('/connect', (req, res) => {
  sui && sui.connect();
  res.send();
});
api.post('/connect/:ip', (req, res) => {
  const ip = req.params.ip;
  sui = new SoundcraftUI(ip);
  sui.status$.subscribe(logObserver('STATUS'));
  sui.connect();

  res.send();
});

// Master
api.post('/master/dim', (req, res) => res.send(sui.master.dim()));
api.post('/master/undim', (req, res) => res.send(sui.master.undim()));

api.post('/master/pan/:value', (req, res) => {
  const value = parseFloat(req.params.value);
  res.send(sui.master.pan(value));
});

api.post('/master/setfaderlevel/:value', (req, res) => {
  const value = parseFloat(req.params.value);
  res.send(sui.master.setFaderLevel(value));
});

const methodMap = {
  mute: 'mute',
  unmute: 'unmute',
  togglemute: 'toggleMute',
  solo: 'solo',
  unsolo: 'unsolo',
  togglesolo: 'toggleSolo',
  pre: 'pre',
  post: 'post',
  preproc: 'preproc',
  postproc: 'postproc',
  play: 'play',
  pause: 'pause',
  stop: 'stop',
  prev: 'prev',
  next: 'next',
  manual: 'manual',
  auto: 'auto',
};

// Master Faders
['input', 'line', 'player', 'fx', 'aux', 'vca'].forEach(ctype => {
  api.post(`/master/${ctype}/:ch/setfaderlevel/:value`, (req, res) => {
    const ch = parseInt(req.params.ch, 10);
    const value = parseFloat(req.params.value);
    res.send(sui.master[ctype](ch).setFaderLevel(value));
  });

  api.post(`/master/${ctype}/:ch/:method`, (req, res) => {
    const ch = parseInt(req.params.ch, 10);
    const methodName = methodMap[req.params.method];
    res.send(sui.master[ctype](ch)[methodName]());
  });
});

// AUX Faders
['input', 'line', 'player', 'fx'].forEach(ctype => {
  api.post(`/aux/:bus/${ctype}/:ch/setfaderlevel/:value`, (req, res) => {
    const bus = parseInt(req.params.bus, 10);
    const ch = parseInt(req.params.ch, 10);
    const value = parseFloat(req.params.value);
    res.send(sui.aux(bus)[ctype](ch).setFaderLevel(value));
  });

  api.post(`/aux/:bus/${ctype}/:ch/:method`, (req, res) => {
    const bus = parseInt(req.params.bus, 10);
    const ch = parseInt(req.params.ch, 10);
    const methodName = methodMap[req.params.method];
    res.send(sui.aux(bus)[ctype](ch)[methodName]());
  });
});

// FX Faders
['input', 'line', 'player', 'sub'].forEach(ctype => {
  api.post(`/fx/:bus/${ctype}/:ch/setfaderlevel/:value`, (req, res) => {
    const bus = parseInt(req.params.bus, 10);
    const ch = parseInt(req.params.ch, 10);
    const value = parseFloat(req.params.value);
    res.send(sui.fx(bus)[ctype](ch).setFaderLevel(value));
  });

  api.post(`/fx/:bus/${ctype}/:ch/:method`, (req, res) => {
    const bus = parseInt(req.params.bus, 10);
    const ch = parseInt(req.params.ch, 10);
    const methodName = methodMap[req.params.method];
    res.send(sui.fx(bus)[ctype](ch)[methodName]());
  });
});

// Player
api.post(`/player/:method`, (req, res) => {
  const bus = parseInt(req.params.bus, 10);
  const ch = parseInt(req.params.ch, 10);
  const methodName = methodMap[req.params.method];
  res.send(sui.player[methodName]());
});

api.post(`/player/setshuffle/:value`, (req, res) => {
  const value = parseInt(req.params.value, 10);
  res.send(sui.player.setShuffle(value));
});

api.post(`/player/loadplaylist/:playlist`, (req, res) => {
  res.send(sui.player.loadPlaylist(req.params.playlist));
});

api.post(`/player/loadtrack/:playlist/:track`, (req, res) => {
  res.send(sui.player.loadTrack(req.params.playlist, req.params.track));
});

/*******************************/

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
