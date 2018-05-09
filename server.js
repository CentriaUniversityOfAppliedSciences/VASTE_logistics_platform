'use strict';

const express = require('express');

// Constants
const PORT = 8100;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => 
{
  res.send('This is Vaste!\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);