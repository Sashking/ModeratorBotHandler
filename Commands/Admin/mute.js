const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const guildSettingsSchema = require('../../models/guildSettings');

module.exports = {
    name: 'mute',
    description: "Замутить участника сервера.",
    options: [
        {
            name: 'участник',
            description: 'Укажите участника',
            type: 'USER',
            required: true
        },
        {
            name: 'причина',
            description: 'Можете указать причину мута',
            type: 'STRING',
            required: false,
        },
    ],
    userPermissions: ['MANAGE_ROLES'],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {

        const botMissingPermissionsEmbed = new MessageEmbed()
            .setDescription('У меня не хватает прав, чтобы выдать роль этому участнику!')
            .setColor(client.color(interaction.guild))
        
        let [ target, reason ] = args;
        const targetMember = interaction.guild.members.cache.get(target);
        reason = reason || "Причина не указана.";

        function createMuteRole() {
            const muteRole = interaction.guild.roles.create({ 
                name: 'Замучен',
                color: '#9c3b3b',
                mentionable: false,
                position: interaction.guild.me.roles.highest - 1,
            });

            return muteRole;
        }

        let muteRoleID;
        guildSettingsSchema.findOne({ GuildID: interaction.guild.id }, (err, data) => {

            if (data) {
                if (data.MuteRoleID) {
                    if (!interaction.guild.roles.cache.get(data.MuteRoleID)) {
                        createMuteRole()
                            .then((r) => {
                                data.MuteRoleID = r.id;
                                data.save();
                            })
                    } else muteRoleID = data.MuteRoleID;
                } else {
                    muteRoleID = createMuteRole()
                        .then((r) => {
                            data.MuteRoleID = r.id;
                            data.save();
                        })
                }
            } else {
                muteRoleID = createMuteRole()
                    .then((r) => {
                        new guildSettingsSchema({
                            GuildID: interaction.guild.id,
                            LinkProtection: false,
                            MuteRoleID: r.id
                        }).save();
                    })
            }

        }).then(async (x) => {

            interaction.guild.channels.cache.forEach((c) => {
                c.permissionOverwrites.edit(
                    interaction.guild.roles.cache.get(muteRoleID),
                    {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                    }
                )
            })

            if (!targetMember || targetMember.roles.highest.position >= interaction.guild.me.roles.highest.position)
                return interaction.followUp({ embeds: [ botMissingPermissionsEmbed ] });

            const targetEmbed = new MessageEmbed()
                .setAuthor(`Вас замутили на сервере ${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
                .addField('Причина', reason)
                .addField('Замутил', `${interaction.user}`)
                .setColor(client.color(interaction.guild))

            const role = interaction.guild.roles.cache.get(muteRoleID);

            await targetMember.user.send({ embeds: [ targetEmbed ] }).catch(() => {});
            await targetMember.roles.add(role);

            const embed = new MessageEmbed()
                .setDescription(`${targetMember} успешно замучен!`)
                .setColor(client.color(interaction.guild))

            interaction.followUp({ embeds: [ embed ] });

        })

    }
}