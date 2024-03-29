import express from 'express';
import path from 'path';

const app = express();

const ASSETS_DIR = process.env.ASSETS_DIR ?? '/assets';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 80;
const HOST = process.env.HOST ?? '0.0.0.0';
// const BACKEND_HOST = process.env.BACKEND_HOST;
// if (!BACKEND_HOST) {
//   throw new Error('Backend host not defined');
// }

app.use(express.static(ASSETS_DIR));

app.get('/*', function (req, res) {
  res.sendFile(path.join(ASSETS_DIR, 'index.html'));
});


const server = app.listen(PORT, HOST);

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
});
