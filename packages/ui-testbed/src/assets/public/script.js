function send(path) {
  return fetch('/api/' + path, {
    method: 'POST',
  });
}

const testSections = [
  {
    name: 'Generic',
    buttons: [
      { label: 'Connect', path: 'connect' },
      { label: 'Disconnect', path: 'disconnect' },
    ],
  },
  {
    name: 'Master',
    buttons: [
      { label: 'master.setFaderLevel(0.5)', path: 'master/setfaderlevel/0.5' },
      { label: 'master.setFaderLevel(0.2)', path: 'master/setfaderlevel/0.2' },
      { label: 'master.dim()', path: 'master/dim' },
      { label: 'master.undim()', path: 'master/undim' },
      { label: 'master.pan(0.5)', path: 'master/pan/0.5' },
      { label: 'master.pan(1)', path: 'master/pan/1' },
    ],
  },
  {
    name: 'Master Faders',
    buttons: ['input', 'line', 'player', 'fx', 'aux', 'vca']
      .map(ctype => [
        {
          label: `master.${ctype}(1).setFaderLevel(0.5)`,
          path: `master/${ctype}/1/setfaderlevel/0.5`,
        },
        {
          label: `master.${ctype}(1).setFaderLevel(0.2)`,
          path: `master/${ctype}/1/setfaderlevel/0.2`,
        },
        {
          label: `master.${ctype}(1).mute()`,
          path: `master/${ctype}/1/mute`,
        },
        {
          label: `master.${ctype}(1).unmute()`,
          path: `master/${ctype}/1/unmute`,
        },
        {
          label: `master.${ctype}(1).toggleMute()`,
          path: `master/${ctype}/1/togglemute`,
        },
        {
          label: `master.${ctype}(1).solo()`,
          path: `master/${ctype}/1/solo`,
        },
        {
          label: `master.${ctype}(1).unsolo()`,
          path: `master/${ctype}/1/unsolo`,
        },
        {
          label: `master.${ctype}(1).toggleSolo()`,
          path: `master/${ctype}/1/togglesolo`,
        },
      ])
      .reduce((acc, item) => [...acc, ...item], []),
  },
  {
    name: 'AUX Faders',
    buttons: ['input', 'line', 'player', 'fx']
      .map(ctype => [
        {
          label: `aux(5).${ctype}(1).setFaderLevel(0.5)`,
          path: `aux/5/${ctype}/1/setfaderlevel/0.5`,
        },
        {
          label: `aux(5).${ctype}(1).setFaderLevel(0.2)`,
          path: `aux/5/${ctype}/1/setfaderlevel/0.2`,
        },
        {
          label: `aux(5).${ctype}(1).mute()`,
          path: `aux/5/${ctype}/1/mute`,
        },
        {
          label: `aux(5).${ctype}(1).unmute()`,
          path: `aux/5/${ctype}/1/unmute`,
        },
        {
          label: `aux(5).${ctype}(1).toggleMute()`,
          path: `aux/5/${ctype}/1/togglemute`,
        },
        {
          label: `aux(5).${ctype}(1).pre()`,
          path: `aux/5/${ctype}/1/pre`,
        },
        {
          label: `aux(5).${ctype}(1).post()`,
          path: `aux/5/${ctype}/1/post`,
        },
        {
          label: `aux(5).${ctype}(1).postproc()`,
          path: `aux/5/${ctype}/1/postproc`,
        },
        {
          label: `aux(5).${ctype}(1).preproc()`,
          path: `aux/5/${ctype}/1/preproc`,
        },
      ])
      .reduce((acc, item) => [...acc, ...item], []),
  },
  {
    name: 'FX Faders',
    buttons: ['input', 'line', 'player', 'sub']
      .map(ctype => [
        {
          label: `fx(2).${ctype}(1).setFaderLevel(0.5)`,
          path: `fx/2/${ctype}/1/setfaderlevel/0.5`,
        },
        {
          label: `fx(2).${ctype}(1).setFaderLevel(0.2)`,
          path: `fx/2/${ctype}/1/setfaderlevel/0.2`,
        },
        {
          label: `fx(2).${ctype}(1).mute()`,
          path: `fx/2/${ctype}/1/mute`,
        },
        {
          label: `fx(2).${ctype}(1).unmute()`,
          path: `fx/2/${ctype}/1/unmute`,
        },
        {
          label: `fx(2).${ctype}(1).toggleMute()`,
          path: `fx/2/${ctype}/1/togglemute`,
        },
        {
          label: `fx(2).${ctype}(1).pre()`,
          path: `fx/2/${ctype}/1/pre`,
        },
        {
          label: `fx(2).${ctype}(1).post()`,
          path: `fx/2/${ctype}/1/post`,
        },
      ])
      .reduce((acc, item) => [...acc, ...item], []),
  },
  {
    name: 'Media Player',
    buttons: [
      { label: 'player.play()', path: 'player/play' },
      { label: 'player.pause()', path: 'player/pause' },
      { label: 'player.stop()', path: 'player/stop' },
      { label: 'player.prev()', path: 'player/prev' },
      { label: 'player.next()', path: 'player/next' },
      {
        label: "player.loadPlaylist('~root~')",
        path: 'player/loadplaylist/~root~',
      },
      {
        label: "player.loadTrack('~root~', 'Power_Shutoff.mp3')",
        path: 'player/loadtrack/~root~/Power_Shutoff.mp3',
      },
      { label: 'player.setShuffle(1)', path: 'player/setshuffle/1' },
      { label: 'player.setShuffle(0)', path: 'player/setshuffle/0' },
      { label: 'player.manual()', path: 'player/manual' },
      { label: 'player.auto()', path: 'player/auto' },
    ],
  },
];

const container = document.querySelector('#container');

testSections.forEach(section => {
  const div = document.createElement('div');

  const rows = section.buttons.reduce(
    (result, button) =>
      (result += `<tr><td class="label">${button.label}</td><td><button onclick="send('${button.path}')">Send</button></td>`),
    ''
  );

  div.innerHTML = `<h2>${section.name}</h2><table>${rows}</table>`;
  container.appendChild(div);
});
