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
        
        const [ target, reason ] = args;
        const targetMember = interaction.guild.members.cache.get(target);

        if (!targetMember || !targetMember.bannable)
            return interaction.followUp({ embeds: [ botMissingPermissionsEmbed ] });

        await interaction.guild.members.ban(targetMember.user, { reason: reason || "Причина не указана." });

        const embed = new MessageEmbed()
            .setDescription(`${targetMember} успешно забанен!`)
            .setColor(client.color(interaction.guild))

        interaction.followUp({ embeds: [ embed ] });

    }
}