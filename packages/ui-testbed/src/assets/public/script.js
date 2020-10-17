function send(path) {
  return fetch('/api/' + path, {
    method: 'POST',
  });
}
