'use strict';
const _ = require('lodash');
const donedone = require('../donedoneclient');
const slack = require('../slackclient');

const done_done_id = process.env.DONE_DONE_ID;
const triageId = process.env.TRIAGE_ID;

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

module.exports = slapp => {
  slapp.message('(.*)', ['direct_message'], (msg, text) => {
    if (msg.type === 'file_share') return; //only respond to text

    let doneDoneUser;
    let currentUser = slack.userbase.getUserById(msg.meta.user_id); //find the issue reporter

    donedone.client.getPeople(function(data){       //kinda sucks, but Full Name is best way
      doneDoneUser = data.filter(function(user) {   //to find donedone user that matches slack reporter
        return user.name === currentUser.real_name
      })[0];

      if (!doneDoneUser) {
        //can't find via full name.
        doneDoneUser = {
          id: done_done_id,
          name: currentUser.real_name //we'll append the reporters name in there later
        };

        msg.say(donedone.script.unlinkedAcocunt)
      }
      
      msg.say({
        text: `Issue: \`${text}\`\n${donedone.script.initialReaction}`,
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
      }).route('createMinimumTicket', { title: text, user: doneDoneUser });
    });
  });

  slapp.route('createMinimumTicket', (msg, state) => {
    let issue = state;

    if (msg.type !== 'action') {
      msg.say(donedone.script.invalidResponse)
        .route('createMinimumTicket', state, 30);
    }

    deleteExpiredButtons(msg);

    let answer = msg.body.actions[0].value;

    if (answer === 'cancel') {
      msg.say(donedone.script.cancelText);
      return;
    }

    issue.site = answer;

    msg.say({
      text: `${donedone.script.siteProvided(issue.site)} \n\n*If you'd like, upload a jpg or png file to include it as a screenshot (hint: you can upload multiple)*`
      //attachments: descriptionOptions
    }).route('improveDescription', { issue: issue });
  });

  slapp.route('improveDescription', (msg, state) => {
    let response;

    deleteExpiredButtons(msg);

    if (msg.type === 'action') {

      let answer = msg.body.actions[0].value;

      if (answer === 'continue') {

        if (state.issue.description || state.issue.screenshots && state.issue.screenshots.length > 0) {
          let response = donedone.script.finalReview;
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
          msg.say(donedone.script.invalidSubmission)
            .route('improveDescription', { issue: state.issue });
        }

      }
    } else if (msg.body.event.subtype == 'file_share') {
      const filetype = msg.body.event.file.filetype;
      let validScreenshot = _.includes(['png', 'jpg', 'jpeg'], filetype) && !_.includes(state.issue.screenshots, msg.body.event.file.permalink);

      state.issue.screenshots = state.issue.screenshots || [];

      if (validScreenshot) {
        state.issue.screenshots = state.issue.screenshots.concat(msg.body.event.file.permalink);
        response = donedone.script.happyScreenshotResponse;
      } else {
        response = donedone.script.sadScreenshotResponse;
      }
      msg.say({
        text: `${response}\n\nScreenshots added: ${state.issue.screenshots.length}\n\nYou can enter text to update the full description, upload a file to add another screenshot, or keep it movin\'`,
        attachments: descriptionOptions
      }).route('improveDescription', { issue: state.issue });
    } else {
      state.issue.description = msg.body.event.text;
      response = donedone.script.descriptionAdded;

      msg.say({
        text: `Description: \`${state.issue.description}\`\n\n${response}\nEntering text again will update the issue description, uploading a file will add a screenshot, or clicking continue will let you submit this ticket.`,
        attachments: descriptionOptions
      }).route('improveDescription', { issue: state.issue });
    }

    slapp.route('submitIssue', (msg, state) => {
      deleteExpiredButtons(msg);

      if (msg.type === 'action') {
        let answer = msg.body.actions[0].value;

        switch(answer) {
          case 'delete':
            state.issue.screenshots = [];

            msg.say('alright, screenshots erased. Let\'s try again');
            msg.say({
              text: `${donedone.script.resubmitMessage}\n\n*Upload a jpg or png file to include it as a screenshot (hint: you can upload multiple if you\'d like)*`,
              attachments: descriptionOptions
            }).route('improveDescription', { issue: state.issue });
            break;
          case 'cancel':
            response = donedone.script.cancelText;

            msg.respond(msg.body.response_url, {
              text: response,
              delete_original: true
            });
            return;
            break;
          default:
            donedone.client.createIssue({
              headers: {"Content-Type": "application/json" },
              data: {
                title: `(${state.issue.site}) ${state.issue.title}`,
                description: `${state.issue.description} \n\nScreenshots: ${state.issue.screenshotText}\n\nReported By ${state.issue.user.name}`,
                attachments: state.issue.attachments,
                priority_level_id: 1,
                fixer_id: triageId,
                tester_id: triageId,
                user_ids_to_cc: state.issue.user.id
              }
            }, (data) => {
              msg.say(`${donedone.script.issueSubmitted}\n\nfollow ${donedone.slackChannelLink} to track bug # ${data.order_number}`);
            }, () => {
              msg.say('noooooo something broke!! Complain to Content Ops directly! We gotta fix this!')
            });
            return;
            break;
        }
      } else {
        state.issue.description = msg.body.event.text;
        msg.say(donedone.script.updatedDescription)
          .route('submitIssue', { issue: state.issue })
      }
    });
  });
};

function deleteExpiredButtons(msg) {
  msg.respond(msg.body.response_url, {
    delete_original: true
  });
}