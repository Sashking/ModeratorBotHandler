const { CommandInteraction, Client, MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: 'kick',
    description: "Кикнуть участника сервера.",
    options: [
        {
            name: 'участник',
            description: 'Укажите участника',
            type: 'USER',
            required: true
        },
        {
            name: 'причина',
            description: 'Можете указать причину кика',
            type: 'STRING',
            required: false,
        },
    ],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {

        const userMissingPermissionsEmbed = new MessageEmbed()
            .setDescription('У вас не хватает прав.')
            .setColor(client.color(interaction.guild))

        const botMissingPermissionsEmbed = new MessageEmbed()
            .setDescription('У меня не хватает прав, чтобы забанить этого участника!')
            .setColor(client.color(interaction.guild))
        
        if (!interaction.member.permissions.has('BAN_MEMBERS'))
            return interaction.followUp({ embeds: [ userMissingPermissionsEmbed ] });
        
        let [ target, reason ] = args;
        const targetMember = interaction.guild.members.cache.get(target);
        reason = reason || "Причина не указана.";

        if (!targetMember || !targetMember.kickable)
            return interaction.followUp({ embeds: [ botMissingPermissionsEmbed ] });

        const targetEmbed = new MessageEmbed()
            .setAuthor(`Вас кикнули с сервера ${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true }))
            .addField('Причина', reason)
            .addField('Кикнул', `${interaction.user}`)
            .setColor(client.color(interaction.guild))

        await targetMember.user.send({ embeds: [ targetEmbed ] }).catch(() => {});
        await interaction.guild.members.kick(targetMember.user, reason);

        const embed = new MessageEmbed()
            .setDescription(`${targetMember} успешно кикнут!`)
            .setColor(client.color(interaction.guild))

        interaction.followUp({ embeds: [ embed ] });

    }
}