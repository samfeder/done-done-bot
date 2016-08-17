'use strict';

module.exports = (slapp) => {

  let helpMessage = `Thanks for using me! Done Done Bot! Let's get things done (done!). Let me know what's wrong by just typing your problem:
  \`\`\`
  ex: Deathgasm isn't playing in Safari
  \`\`\`
  Follow the prompts and feel free to ping @samfeder or #contentops for questions about how I work.`;

  slapp.message('helpMessage', ['direct_message'], (msg, text) => {
    msg.say(helpMessage)
  });

  slapp.event('bb.team_added', function(msg) {
    slapp.client.im.open({ token: msg.meta.bot_token, user: msg.meta.user_id }, (err, data) => {
      if (err) {
        return console.error(err)
      }
      let channel = data.channel.id;

      msg.say({ channel: channel, text: 'Thanks for adding me to your team!' });
      msg.say({ channel: channel, text: helpMessage });
    })
  })
};