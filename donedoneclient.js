const user = process.env.DONE_DONE_USERNAME;
const password = process.env.DONE_DONE_PASSWORD;
const projectId = process.env.DONE_DONE_PROJECT_ID;

const issuesChannel = process.env.DONE_DONE_CHANNEL_NAME;
const issuesChannelId = process.env.DONE_DONE_CHANNEL_ID;

const Client = require('node-rest-client').Client;
const options_auth = { user, password };

const client = new Client(options_auth);

const urlBase = "https://amcsvod.mydonedone.com/issuetracker/api/v2/projects/" + projectId;

client.registerMethod("createIssue", `${urlBase}/issues.json`, "POST");
client.registerMethod("getPeople", `${urlBase}/people.json`, "GET");

module.exports.client = client.methods;
module.exports.slackChannelLink = `<#${issuesChannelId}|${issuesChannel}>`;