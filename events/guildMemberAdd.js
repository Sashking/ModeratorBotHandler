const client = require('../index');
const roleSaveSchema = require('../models/roleSaves');

client.on('guildMemberAdd', (member) => {
    roleSaveSchema.findOne({ UserID: member.user.id }, (err, data) => {
        if (data) {
            data.Roles.forEach(r => {
                member.roles.add(member.guild.roles.cache.get(r));
            });
            data.delete();
        }
    })
})