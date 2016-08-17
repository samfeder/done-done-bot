'use strict';
const express = require('express');
const Slapp = require('slapp');
const BeepBoopConvoStore = require('slapp-convo-beepboop');
const BeepBoopContext = require('slapp-context-beepboop');
if (!process.env.PORT) throw Error('PORT missing but required');

let slapp = Slapp({
  convo_store: BeepBoopConvoStore(),
  context: BeepBoopContext()
});

require('./flows')(slapp);
var app = slapp.attachToExpress(express());

slapp.message('deh (.*)', ['direct_message'], (msg, text, match1) => {
  console.log('received message' + msg);
  msg.say('How are you?').route('handleHi', { what: match1 })
});

slapp.route('handleHi', (msg, state) => {
  msg.say(':smile: ' + state.what)
});

app.get('/', function(req, res) {
  res.send('Hello')
});

console.log('Listening on :' + process.env.PORT);
app.listen(process.env.PORT);
