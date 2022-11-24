import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Hello from server');
});
server.listen(process.env.port || 4000, () => {
  console.log('server ready');
});
