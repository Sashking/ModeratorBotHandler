
const client = require('../index')


client.on('message', (message) => { 
    if (message.content.includes('discord.gg/'||'youtube.com/')) { 
      message.delete() 
        .then(message.channel.send('**Ссылка удалена**:\n**рекламная ссылка**'))
    }
  })