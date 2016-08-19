const RtmClient = require('@slack/client').RtmClient;
const token = process.env.SLACK_TOKEN || '';
const rtm = new RtmClient(token, { logLevel: 'error' });

rtm.start();

module.exports.userbase = rtm.dataStore;