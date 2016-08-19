'use strict';
const _ = require('lodash');
const user = process.env.DONE_DONE_USERNAME;
const password = process.env.DONE_DONE_PASSWORD;
const rosie_name = process.env.DONE_DONE_FULL_NAME;
const done_done_id = process.env.DONE_DONE_ID;

const Client = require('node-rest-client').Client;
const options_auth = { user, password };

const client = new Client(options_auth);
var urlBase = "https://amcsvod.mydonedone.com/issuetracker/api/v2";

client.registerMethod("createIssue", `${urlBase}/projects/52172/issues.json`, "POST");
client.registerMethod("getPeople", `${urlBase}/projects/52172/people.json`, "GET");
const triageId = process.env.TRIAGE_ID;

//Direct Slack Client
const RtmClient = require('@slack/client').RtmClient;
const token = process.env.SLACK_TOKEN || '';
const rtm = new RtmClient(token, { logLevel: 'error' });

rtm.start();

const descriptionOptions = [{
  text: '',
  callback_id: 'description_callback',
  actions: [
    { name: 'answer', text: 'Continue', type: 'button', value: 'continue' },
    { name: 'answer', text: 'Cancel/Start Over', type: 'button', value: 'cancel' }
  ]
}];

const submittalOptions = [{
  text: '',
  callback_id: 'submittal_callback',
  actions: [
    { name: 'answer', text: 'Submit', type: 'button', value: 'submit' },
    { name: 'answer', text: 'Reset Screenshots', type: 'button', value: 'delete' },
    { name: 'answer', text: 'Cancel', type: 'button', value: 'cancel' }
  ]
}];

module.exports = (slapp, script) => {
  slapp.message('(.*)', ['direct_message'], (msg, text) => {
    if (msg.type === 'file_share') return; //only respond to text
    let doneDoneUser;
    let currentUser = rtm.dataStore.getUserById(msg.meta.user_id);

    client.methods.getPeople(function(data){
      doneDoneUser = data.filter(function(user) {
        return user.name === currentUser.real_name
      })[0];

      if (!doneDoneUser) {
        //can't find via full name.
        doneDoneUser = {
          id: done_done_id,
          name: rosie_name
        };

        msg.say('Well this is awkward :frown:... I can\'t find your done done account to CC you on this issue. We use the full names you signed up with on Slack and Done Done to match you! So please make sure those are identical :key:! That or go bother Sam F :smiley:')
      }

      
      msg.say({
        text: `Issue: \`${text}\`\n${_.shuffle(script.initialReaction)[0]}`,
        attachments: [{
          text: '',
          callback_id: 'report_issue_callback',
          actions: [
            { name: 'answer', text: 'Shudder', type: 'button', value: 'Shudder' },
            { name: 'answer', text: 'SundanceNow', type: 'button', value: 'SundanceNow' },
            { name: 'answer', text: 'Both Sites', type: 'button', value: 'Both Sites' },
            { name: 'answer', text: 'Cancel / Start Over', type: 'button', value: 'cancel' }
          ]
        }]
      }).route('handleIssue', { title: text, user: doneDoneUser });
    });
  });

  slapp.route('handleIssue', (msg, state) => {
    let issue = state || {};

    if (msg.type !== 'action') {
      return handleNonButton();
    }

    let answer = msg.body.actions[0].value;
    if (answer === 'cancel') {
      msg.respond(msg.body.response_url, {
        text: _.shuffle(script.cancelText)[0],
        delete_original: true
      });
      // notice we did NOT specify a route because the conversation is over
      return;
    }

    issue.site = answer;

    msg.say({
      text: `${script.siteProvided(issue.site)} \n\n*Upload a jpg or png file to include it as a screenshot (hint: you can upload multiple if you\'d like)*`,
      attachments: descriptionOptions
    }).route('improveDescription', { issue: issue });

    function handleNonButton() {
      const furtherInstruction = _.shuffle(script.invalidResponse)[0];
      msg
        .say(script.furtherInstruction)
        .route('handleIssue', state, 30);
      return;
    }
  });

  slapp.route('improveDescription', (msg, state) => {
    let response;

    state.issue = state.issue || {};

    if (msg.type === 'action') {
      let answer = msg.body.actions[0].value;
      if (answer === 'cancel') {
        response = _.shuffle(script.cancelText)[0];

        msg.respond(msg.body.response_url, {
          text: response,
          delete_original: true
        });
        return;
      }
      if (answer === 'continue') {
        if (state.issue.description || state.issue.screenshots && state.issue.screenshots.length > 0) {
          let response = _.shuffle(script.finalReview)[0];
          let title = `(${state.issue.site}) ${state.issue.title}`;
          state.issue.screenshotText = state.issue.screenshots && state.issue.screenshots.join('\n');
          let description = state.issue.screenshotText
            ? `${state.issue.description || ''} \n\nScreenshots:\n${state.issue.screenshotText}`
            : state.issue.description;

          msg.say({
            text: `${response}\n
        Title: ${title}
        Description: ${description}`,
            attachments: submittalOptions
          }).route('submitIssue', { issue: state.issue });
        } else {
          msg.say(_.shuffle(script.invalidSubmission)[0])
            .route('improveDescription', { issue: state.issue });
        }

      }
    } else if (msg.body.event.subtype == 'file_share') {
      const filetype = msg.body.event.file.filetype;
      let validScreenshot = _.includes(['png', 'jpg', 'jpeg'], filetype) && !_.includes(state.issue.screenshots, msg.body.event.file.permalink);

      state.issue.screenshots = state.issue.screenshots || [];

      if (validScreenshot) {
        state.issue.screenshots = state.issue.screenshots.concat(msg.body.event.file.permalink);
        response = _.shuffle(script.happyScreenshotResponse)[0];
      } else {
        response = _.shuffle(script.sadScreenshotResponse)[0];
      }

      msg.say({
        text: `${response}\n\nScreenshots added: ${state.issue.screenshots.length}\n\nYou can enter text to update the full description, upload a file to add another screenshot, or keep it movin\'`,
        attachments: descriptionOptions
      }).route('improveDescription', { issue: state.issue });
    } else {
      state.issue.description = msg.body.event.text;
      response = _.shuffle(script.descriptionAdded)[0];

      msg.say({
        text: `Description: \`${state.issue.description}\`\n\n${response}\nEntering text again will update the issue description, uploading a file will add a screenshot, or clicking continue will let you submit this ticket.`,
        attachments: descriptionOptions
      }).route('improveDescription', { issue: state.issue });
    }
    slapp.route('submitIssue', (msg, state) => {
      if (msg.type === 'action') {
        let answer = msg.body.actions[0].value;

        switch(answer) {
          case 'delete':
            state.issue.screenshots = [];

            msg.say('alright, screenshots erased. Let\'s try again');
            msg.say({
              text: `${_.shuffle(script.resubmitMessage)[0]}\n\n*Upload a jpg or png file to include it as a screenshot (hint: you can upload multiple if you\'d like)*`,
              attachments: descriptionOptions
            }).route('improveDescription', { issue: state.issue });
            break;
          case 'cancel':
            response = _.shuffle(script.cancelText)[0];

            msg.respond(msg.body.response_url, {
              text: response,
              delete_original: true
            });
            return;
            break;
          default:
            client.methods.createIssue({
              headers: {"Content-Type": "application/json" },
              data: {
                title: `(${state.issue.site}) ${state.issue.title}`,
                description: `${state.issue.description} \n\nScreenshots: ${state.issue.screenshotText}`,
                attachments: state.issue.attachments,
                priority_level_id: 1,
                fixer_id: triageId,
                tester_id: triageId,
                user_ids_to_cc: state.issue.user.id
              }
            }, (data) => {
              msg.say(_.shuffle(script.issueSubmitted)[0] + '\nfollow #tissues4yourissues to track your bug.');
            }, error => {
              msg.say('noooooo something broke!! Complain to Content Ops directly! We gotta fix this!')
            });
            return;
            break;
        }
      } else {
        state.issue.description = msg.body.event.text;
        msg.say(script.updatedDescription)
          .route('submitIssue', { issue: state.issue })
      }
    });
  });
};