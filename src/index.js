const express = require('express');
const path = require('path');
const app = express();

const ASSETS_DIR = process.env.ASSETS_DIR ?? '/assets'
const PORT = process.env.PORT ?? 80;
const HOST = process.env.HOST ?? '0.0.0.0'

app.use(express.static(ASSETS_DIR));

app.get('/*', function (req, res) {
  res.sendFile(path.join(ASSETS_DIR, 'index.html'));
});


app.listen(PORT, HOST);