const http = require('http');
const port = process.env.PORT || 6000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  const msg = 'Hello World!\n'
  res.end(msg);
});

server.listen(port, () => {
  console.log(`Server running on http://0.0.0.0:${port}/`);
});
