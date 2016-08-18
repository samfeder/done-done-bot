'use strict';
const _ = require('lodash');

const initialReaction = [
  'You don\'t say. What a pity! Let me know what site that\'s happening on.',
  'Whoa, really? Which site are you seeing that on?',
  'Ugh, had a feeling that would happen, where did you see that?',
  'Pretty sure that\'s Sam\'s fault... Typical. Which site this time?',
  'Awwwwwwkward.......... Which site?',
  'That\'s a feature, not a bug! Just kidding, which site is that on again?',
  'oh, yikes ... Please don\'t tell Linda :sweat_smile:. Which site?'
];
const invalidResponse = [
  'Please tell me which site :face_with_rolling_eyes:',
  'Click one of those buttons, bro.',
  ':thinking_face: how can I make this any easier for you? Choose a site.',
  'http://oi54.tinypic.com/10htykz.jpg you messin\' with me?',
  'If you don\'t tell me which site, we\'re dueling :crossed_swords:',
  ':weary: why aren\'t you telling me which site?!',
  'Gonna get pretty :saltysal: if you don\'t tell me which site.'
];
const cancelText = [
  'Cancelling issue report #keelinThanksYou :key:. Just type out your issue if you\'d like to report something else \`ex: Writer\'s Room Season 1 isn\'t showing\`',
  '...false alarm? No worries :robot_face:, just ping me with an issue if you have one',
  ':thinking_face: what ever happened to that boy who cried wolf? Cancelling issue.',
  'Fine, leave me like they all do. I DON\'T NEED YOUR ISSUES!',
  '**cracks a :bl:** sounds good to me :slightly_smiling_face:.'
];

const happyScreenshotResponse = [
  'yummy screenshot! :robot_face:',
  'Awesome! I love screenshots, this is going to make our content ops guys soooo happy! :kissing_closed_eyes:',
  ':heart_eyes: WOW! You\'re making the content ops team\'s job so easy, thanks!',
  ':v: dat screenshot doe. ',
  ':eyes: ahhh I seeeeee now. Thanks for that!'
];

const sadScreenshotResponse = [
  'What is this garbage file :punch:? Give me a png or a jpeg/jpg.',
  ':face_with_rolling_eyes: Do you even screenshot? I need png, jpg, or jpeg.',
  ':middle_finger: that\'s not a png, jpg, or jpeg. Try again.',
  'Oh tha... :rage: WAIT A MINUTE! THIS FILE ISN\'t VALID! GIVE ME A PNG, JPG, or JPEG!',
  'Awesome! A scree........ :trollface: you got me! Alright now give me the real one, jpg, png, or jpeg plz.'
];

const descriptionAdded = [
  'AHH! That makes so much more sense :smile:, thanks for that description',
  'ohhh ok, I think contentops can figure this out now. :stuck_out_tongue_winking_eye:',
  ':smile_cat: got it! Good description.'
];

const finalReview = [
  'allllllrighty then, here\'s the bug I have from you so far...',
  'Wow :smiley: thanks for all that! Let me just make sure I have this right.',
  ':surfer: gnarly brah :the_horns:! Mind just taking a last look at this?',
  ':pray: bless up homie, just confirm that all of this is right and we\'ll get crackin\'.'
];

const resubmitMessage = [
  'No worries, everyone makes mistakes! Enter some text for a new description or upload a file to add as a screenie! :smile:',
  'allllright allllright :smile_cat: I\'ll give you another chance, update the subscription or upload some new screenshots',
  ':zipper_mouth_face: I won\'t  tell anyone! :face_with_rolling_eyes: let\'s start over. Enter some text to update the subscription of upload some screenshots.'
];

const readyToSubmit = [
  'YESSS! Let\'s submit this suckaaaaa!',
  'Whoaaaa yeaaaaah I\'m ready to submit this bug :)',
  'Heyyooooooo let\'s go! SUBMIT THAT BUG! SUBMIT THAT BUG!',
  'WOOT WOOT :smile: let\'s post that sucka.'
];

const updatedDescription = [
  'alright, description updated.',
  'gotcha, I\'ve updated the description.',
  'you know it homie :v:, description now updated',
  ':eyes: got it, new description logged.'
];

const invalidSubmission = [
  'whoaaa, you need a description or a screenshot to move on hombre :mx:',
  'hey bud :frowning:, we need to talk... I need a longer description and/or a screenshot or we cannot proceed.',
  'love the enthusiasm, but I need a full description or a screenshot of the problem else we ain\'t reporting nothing',
  'NICE TRY! I need a description and/or a scrrenshot or you ain\'t goin\' nowhere.'
];

const siteProvided = site => {
  const singleSite = [
    `${site}? I knew that site was no good.`,
    `Typical ${site}.`,
    `${site}! You\'re so much better than that!`,
    `:neutral_face: I thought ${site} was bug free!`
  ];

  const bothSites = [
    `whoa, both of em? We\'ll jump on this right away!`,
    `AYYYEEE!!! :scream_cat: That\'s not good `,
    `Double the trouble :bug: :bug:! Both sites, eh?`,
    `You GOTSTA be kiddng me! :hushed:`
  ];

  const askForDescription = [
    `Can I get a more detailed description of the issue? Maybe a link if you have one?`,
    `I'm going to need a full description of this problemo. If there\'s a link, can I have that too? Hope that's cool :worried:`,
    `Can I get a longer description of this bug? If possible, linking me to it can be helpful! Gracias :hugging_face:`,
    `Can you give me a fuller description of this issue, maybe a link too? Thanks! :sunglasses:`
  ];

  let response = (site === 'Both Sites' ? _.shuffle(bothSites)[0] : _.shuffle(singleSite)[0]);
  return `${response} ${_.shuffle(askForDescription)[0]}`
};

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

module.exports = (slapp) => {
  slapp.message('(.*)', ['direct_message'], (msg, text) => {
    if (msg.type === 'file_share') return;
    const sassyIntro = _.shuffle(initialReaction)[0];

    msg.say({
      text: `Issue: \`${text}\`
      ${sassyIntro}`,
      attachments: [{
        text: '',
        fallback: sassyIntro,
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
        text: _.shuffle(cancelText)[0],
        delete_original: true
      });
      // notice we did NOT specify a route because the conversation is over
      return;
    }

    issue.site = answer;

    msg.say({
      text: `${siteProvided(issue.site)} 
      
      *Upload a jpg or png file to include it as a screenshot (hint: you can upload multiple if you\'d like)*`,
      attachments: descriptionOptions
    }).route('improveDescription', { issue: issue });

    function handleNonButton() {
      const furtherInstruction = _.shuffle(invalidResponse)[0];
      msg
        .say(furtherInstruction)
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
        response = _.shuffle(cancelText)[0];

        msg.respond(msg.body.response_url, {
          text: response,
          delete_original: true
        });
        return;
      }
      if (answer === 'continue') {
        if (state.issue.description || state.issue.screenshots && state.issue.screenshots.length > 0) {
          let response = _.shuffle(finalReview)[0];
          let title = `(${state.issue.site}) ${state.issue.title}`;
          let screenshotText = state.issue.screenshots && state.issue.screenshots.join('\n');
          let description = screenshotText
            ? `${state.issue.description} \n\nScreenshots:\n${screenshotText}`
            : state.issue.description;

          msg.say({
            text: `${response}\n
        Title: ${title}
        Description: ${description}`,
            attachments: submittalOptions
          }).route('submitIssue', { issue: state.issue });
        } else {
          msg.say(_.shuffle(invalidSubmission)[0])
            .route('improveDescription', { issue: state.issue });
        }

      }
    } else if (msg.body.event.subtype == 'file_share') {
      const filetype = msg.body.event.file.filetype;
      let validScreenshot = _.includes(['png', 'jpg', 'jpeg'], filetype) && !_.includes(state.issue.screenshots, msg.body.event.file.permalink);

      state.issue.screenshots = state.issue.screenshots || [];

      if (validScreenshot) {
        state.issue.screenshots = state.issue.screenshots.concat(msg.body.event.file.permalink);
        response = _.shuffle(happyScreenshotResponse)[0];
      } else {
        response = _.shuffle(sadScreenshotResponse)[0];
      }

      msg.say({
        text: `${response}
        
        Screenshots added: ${state.issue.screenshots.length} 
        
        You can enter text to update the full description, upload a file to add another screenshot, or keep it movin\'`,
        attachments: descriptionOptions
      }).route('improveDescription', { issue: state.issue });
    } else {
      state.issue.description = msg.body.event.text;
      response = _.shuffle(descriptionAdded)[0];

      msg.say({
        text: `Description: \`${state.issue.description}\` 
        
        ${response}\nEntering text again will update the issue description, uploading a file will add a screenshot, or clicking continue will let you submit this ticket.`,
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
              text: `${_.shuffle(resubmitMessage)[0]} 
        
              *Upload a jpg or png file to include it as a screenshot (hint: you can upload multiple if you\'d like)*`,
              attachments: descriptionOptions
            }).route('improveDescription', { issue: state.issue });
            break;
          case 'cancel':
            response = _.shuffle(cancelText)[0];

            msg.respond(msg.body.response_url, {
              text: response,
              delete_original: true
            });
            return;
            break;
          default:
            console.log('make API request');
            break;
        }
      } else {
        state.issue.description = msg.body.event.text;
        msg.say(updatedDescription)
          .route('submitIssue', { issue: state.issue })
      }
    });
  });
};