const client = require('../index');
const guildSettingsSchema = require('../models/guildSettings');

client.on('messageCreate', (message) => {
    guildSettingsSchema.findOne({ GuildID: message.guild.id }, (err, data) => {
        if (data) {
            if (data.LinkProtection === 1) {

                // if (message.member.permissions.has('MANAGE_MESSAGES')) return;
                if (/(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.+)/gm.test(message.content.toString()))
                    message.delete().then(() => {});

            } else if (data.LinkProtection === 2) {

                // if (message.member.permissions.has('MANAGE_MESSAGES')) return;
                if (/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(message.content.toString()))
                    message.delete().then(() => {});

            }
        }
    })
})