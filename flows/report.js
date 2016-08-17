'use strict';
const _ = require('lodash');

const initialReaction = ['You don\'t say. What a pity!', 'Really? Where are you seeing that?', 'which site?', 'Ugh, had a feeling that would happen, where did you see that?', 'Pretty sure that\'s Sam\'s fault... Typical. Which site this time?'];
const invalidResponse = ['Please tell me which site :face_with_rolling_eyes:', 'Click one of those buttons, bro.', ':thinking_face: how can I make this any easier for you? Choose a site.', 'http://oi54.tinypic.com/10htykz.jpg you messin\' with me?'];

const descriptionOptions = [{
  text: '',
  callback_id: 'description_callback',
  actions: [
    { name: 'answer', text: 'Cancel/Start Over', type: 'button', value: 'cancel' }
  ]
}];

module.exports = (slapp) => {
  slapp.message('.*', ['direct_message'], (msg, text) => {
    const sassyResponse = _.shuffle(initialReaction)[0];
    
    msg.say({
      text: `\`${text}\`? ` + sassyResponse,
      attachments: [{
        text: '',
        fallback: sassyResponse,
        callback_id: 'report_issue_callback',
        actions: [
          { name: 'answer', text: 'Shudder', type: 'button', value: 'shudder' },
          { name: 'answer', text: 'SundanceNow', type: 'button', value: 'sundance' },
          { name: 'answer', text: 'Cancel/Start Over', type: 'button', value: 'cancel' }
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
      return cancelIssue();
    }

    issue.site = answer;
    const siteProvided = 'I knew that site was no good. Can I get a more detailed description of the issue?';
    msg.say({
      text: siteProvided + ' *Upload a jpg or png file to include it as a screenshot (hint: you can upload multiple if you\'d like)',
      attachments: descriptionOptions
    }).route('improveDescription', { issue: issue });

    function handleNonButton() {
      const furtherInstruction = _.shuffle(invalidResponse)[0];
      msg
        .say(furtherInstruction)
        .route('handleIssue', state, 30);
      return;
    }

    function cancelIssue() {
      msg.respond(msg.body.response_url, {
        text: 'Cancelling issue report #keelinThanksYou :key:. Just ' +
        'type out your issue if you\'d like to report something else ' +
        '\`ex: Writer\'s Room Season 1 isn\'t showing\`',
        delete_original: true
      });
      // notice we did NOT specify a route because the conversation is over
      return
    }
  });

  slapp.route('improveDescription', (msg, state) => {
    if (msg.body.event.subtype == 'file_share') {
      const filetype = msg.body.event.file.filetype;
      if (_.includes(['png', 'jpg', 'jpeg'], filetype)) {
        state.issue.screenshot = state.issue.screenshot || [];
        state.issue.screenshot = state.issue.screenshot.concat(msg.body.event.file.permalink);
        msg.say('Mmmmm yummy screenshot!').route('handleIssue', { title: text });
      } else {
        msg.say('What is this garbage file? Give me a png or a jpeg/jpg.').route('handleIssue', state);
      }
    }
  });
};