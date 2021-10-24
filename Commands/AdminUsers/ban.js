const { CommandInteraction, Client, MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: 'ban',
    description: "Забанить участника сервера.",
    options: [
        {
            name: 'участник',
            description: 'Укажите участника',
            type: 'USER',
            required: true
        },
        {
            name: 'причина',
            description: 'Можете указать причину бана',
            type: 'STRING',
            required: false,
        },
    ],
    userPermissions: ['BAN_MEMBERS'],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {

        const botMissingPermissionsEmbed = new MessageEmbed()
            .setDescription('У меня не хватает прав, чтобы забанить этого участника!')
            .setColor(client.color(interaction.guild))
        
        let [ target, reason ] = args;
        const targetMember = interaction.guild.members.cache.get(target);
        reason = reason || "Причина не указана.";

        if (!targetMember || !targetMember.bannable)
            return interaction.followUp({ embeds: [ botMissingPermissionsEmbed ] });

        const targetEmbed = new MessageEmbed()
            .setAuthor(`Вас забанили на сервере ${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
            .addField('Причина', reason)
            .addField('Забанил', `${interaction.user}`)
            .setColor(client.color(interaction.guild))

        await targetMember.user.send({ embeds: [ targetEmbed ] }).catch(() => {});
        await interaction.guild.members.ban(targetMember.user, { reason: reason });

        const embed = new MessageEmbed()
            .setDescription(`${targetMember} успешно забанен!`)
            .setColor(client.color(interaction.guild))

        interaction.followUp({ embeds: [ embed ] });

    }
}