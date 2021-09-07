            const { CommandInteraction, Client, MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: 'channel-lockdown',
    description: "Закрыть канал.",
    userPermissions: ['MANAGE_CHANNELS'],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async(client, interaction, args) => {

        await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            VIEW_CHANNEL: false,
        });

        const successEmbed = new MessageEmbed()
            .setDescription(`Канал ${interaction.channel} успешно закрыт.`)
            .setColor(client.color(interaction.guild))

        await interaction.followUp({ embeds: [ successEmbed ] });

    }
}