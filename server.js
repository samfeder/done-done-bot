'use strict';
const express = require('express');
const Slapp = require('slapp');
const script = require('./conversation');
const BeepBoopConvoStore = require('slapp-convo-beepboop');
const BeepBoopContext = require('slapp-context-beepboop');

if (!process.env.PORT) throw Error('PORT missing but required');

let slapp = Slapp({
  convo_store: BeepBoopConvoStore(),
  context: BeepBoopContext()
});

require('./flows')(slapp);
let app = slapp.attachToExpress(express());

app.get('/', function (req, res) {
  res.send('Up and running')
});

console.log('Listening on :' + process.env.PORT);

app.listen(process.env.PORT);
