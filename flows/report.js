'use strict';
const _ = require('lodash');
const DONE_DONE_KEY = process.env.DONE_DONE_KEY;
const DONE_DONE_USERNAME = process.env.DONE_DONE_USERNAME;

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
    }).route('handleIssue', { title: text });
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
          let screenshotText = state.issue.screenshots && state.issue.screenshots.join('\n');
          let description = screenshotText
            ? `${state.issue.description || ''} \n\nScreenshots:\n${screenshotText}`
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
            msg.say(_.shuffle(script.issueSubmitted)[0] + '\nfollow #tissues4yourissues to track your bug.');
            //make API request
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