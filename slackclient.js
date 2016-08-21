const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;

const token = process.env.SLACK_TOKEN || '';
const rtm = new RtmClient(token, { logLevel: 'error' });
const web = new WebClient(token);

rtm.start();

module.exports.userbase = rtm.dataStore;
module.exports.chat = rtm._chat;
module.exports.web = web;