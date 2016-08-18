const _ = require('lodash');

module.exports.initialReaction = [
  'You don\'t say. What a pity! Let me know what site that\'s happening on.',
  'Whoa, really? Which site are you seeing that on?',
  'Ugh, had a feeling that would happen, where did you see that?',
  'Pretty sure that\'s Sam\'s fault... Typical. Which site this time?',
  'Awwwwwwkward.......... Which site?',
  'That\'s a feature, not a bug! Just kidding, which site is that on again?',
  'oh, yikes ... Please don\'t tell Linda :sweat_smile:. Which site?'
];
module.exports.invalidResponse = [
  'Please tell me which site :face_with_rolling_eyes:',
  'Click one of those buttons, bro.',
  ':thinking_face: how can I make this any easier for you? Choose a site.',
  'http://oi54.tinypic.com/10htykz.jpg you messin\' with me?',
  'If you don\'t tell me which site, we\'re dueling :crossed_swords:',
  ':weary: why aren\'t you telling me which site?!',
  'Gonna get pretty :saltysal: if you don\'t tell me which site.'
];
module.exports.cancelText = [
  'Cancelling issue report #keelinThanksYou :key:. Just type out your issue if you\'d like to report something else \`ex: Writer\'s Room Season 1 isn\'t showing\`',
  '...false alarm? No worries :robot_face:, just ping me with an issue if you have one',
  ':thinking_face: what ever happened to that boy who cried wolf? Cancelling issue.',
  'Fine, leave me like they all do. I DON\'T NEED YOUR ISSUES!',
  '**cracks a :bl:** sounds good to me :slightly_smiling_face:.'
];

module.exports.happyScreenshotResponse = [
  'yummy screenshot! :robot_face:',
  'Awesome! I love screenshots, this is going to make our content ops guys soooo happy! :kissing_closed_eyes:',
  ':heart_eyes: WOW! You\'re making the content ops team\'s job so easy, thanks!',
  ':v: dat screenshot doe. ',
  ':eyes: ahhh I seeeeee now. Thanks for that!'
];

module.exports.sadScreenshotResponse = [
  'What is this garbage file :punch:? Give me a png or a jpeg/jpg.',
  ':face_with_rolling_eyes: Do you even screenshot? I need png, jpg, or jpeg.',
  ':middle_finger: that\'s not a png, jpg, or jpeg. Try again.',
  'Oh tha... :rage: WAIT A MINUTE! THIS FILE ISN\'t VALID! GIVE ME A PNG, JPG, or JPEG!',
  'Awesome! A scree........ :trollface: you got me! Alright now give me the real one, jpg, png, or jpeg plz.'
];

module.exports.descriptionAdded = [
  'AHH! That makes so much more sense :smile:, thanks for that description',
  'ohhh ok, I think contentops can figure this out now. :stuck_out_tongue_winking_eye:',
  ':smile_cat: got it! Good description.'
];

module.exports.finalReview = [
  'allllllrighty then, here\'s the bug I have from you so far...',
  'Wow :smiley: thanks for all that! Let me just make sure I have this right.',
  ':surfer: gnarly brah :the_horns:! Mind just taking a last look at this?',
  ':pray: bless up homie, just confirm that all of this is right and we\'ll get crackin\'.'
];

module.exports.resubmitMessage = [
  'No worries, everyone makes mistakes! Enter some text for a new description or upload a file to add as a screenie! :smile:',
  'allllright allllright :smile_cat: I\'ll give you another chance, update the subscription or upload some new screenshots',
  ':zipper_mouth_face: I won\'t  tell anyone! :face_with_rolling_eyes: let\'s start over. Enter some text to update the subscription of upload some screenshots.'
];

module.exports.issueSubmitted = [
  'YESSS! submitting this suckaaaaa! Success.',
  'Whoaaaa yeaaaaah submitting this bug :)',
  'Heyyooooooo let\'s go! SUBMIT THAT BUG! SUBMIT THAT BUG!',
  'WOOT WOOT :smile: let\'s post that sucka.'
];

module.exports.updatedDescription = [
  'alright, description updated.',
  'gotcha, I\'ve updated the description.',
  'you know it homie :v:, description now updated',
  ':eyes: got it, new description logged.'
];

module.exports.invalidSubmission = [
  'whoaaa, you need a description or a screenshot to move on hombre :mx:',
  'hey bud :frowning:, we need to talk... I need a longer description and/or a screenshot or we cannot proceed.',
  'love the enthusiasm, but I need a full description or a screenshot of the problem else we ain\'t reporting nothing',
  'NICE TRY! I need a description and/or a screenshot or you ain\'t goin\' nowhere.'
];

module.exports.siteProvided = site => {
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
