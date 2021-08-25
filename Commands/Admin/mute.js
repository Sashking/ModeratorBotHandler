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

        let muteRole;
        guildSettingsSchema.findOne({ GuildID: interaction.guild.id }, (err, data) => {
            if (data) {
                if (data.MuteRoleID) {
                    muteRole = data.MuteRoleID;
                } else {
                    interaction.guild.roles.create(
                        { 
                            name: 'Замучен',
                            color: '#9c3b3b',
                            mentionable: false,
                            position: interaction.guild.me.roles.highest - 1,
                        }).then((role) => {
                            data.MuteRoleID = muteRole.id;
                            muteRole = role;
                            data.save();
                        })
                }
            } else {
                interaction.guild.roles.create(
                    { 
                        name: 'Замучен',
                        color: '#9c3b3b',
                        mentionable: false,
                        position: interaction.guild.me.roles.highest - 1,
                    }).then((role) => {
                        console.log(role);
                        muteRole = role;

                        new guildSettingsSchema({
                            GuildID: interaction.guild.id,
                            LinkProtection: false,
                            MuteRoleID: muteRole.id
                        }).save();
                    })
            }
        });

        if (!targetMember || targetMember.roles.highest.position >= interaction.guild.me.roles.highest.position)
            return interaction.followUp({ embeds: [ botMissingPermissionsEmbed ] });

        const targetEmbed = new MessageEmbed()
            .setAuthor(`Вас замутили на сервере ${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
            .addField('Причина', reason)
            .addField('Замутил', `${interaction.user}`)
            .setColor(client.color(interaction.guild))

        await targetMember.user.send({ embeds: [ targetEmbed ] }).catch(() => {});
        await targetMember.roles.add(muteRole.id);

        const embed = new MessageEmbed()
            .setDescription(`${targetMember} успешно замучен!`)
            .setColor(client.color(interaction.guild))

        interaction.followUp({ embeds: [ embed ] });

    }
}