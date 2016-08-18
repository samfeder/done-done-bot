'use strict';

module.exports = (slapp) => {

  let helpMessage = `Thanks for using me! Done Done Bot! Let's get things done (done!). Let me know what's wrong by just typing your problem:
  \`\`\`
  ex: Deathgasm isn't playing in Safari
  \`\`\`
  Follow the prompts and feel free to ping @samfeder or #contentops for questions about how I work.`;

  function channelMessage(channelName) {
    return `Hey there ${channelName}! I'm Rosie! 
    
    I'm here to make reporting content-related issues super easy! Whether a video isn't playing, subtitles are missing, you find a typo somewhere... Anything, please let me know about it and contentops will fix it up in a jiffy!
    
    If you want to report something, just open a direct message conversation with me and tell me your issue.
    `;
  }


  slapp.command('/donedonehelp', (msg, text) => {
    msg.respond(msg.body.channel_name == 'directmessage' ? helpMessage : channelMessage(msg.body.channel_name));
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