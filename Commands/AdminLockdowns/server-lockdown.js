const { CommandInteraction, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'server-lockdown',
    description: "Закрыть все каналы сервера.",
    userPermissions: ['ADMINISTRATOR'],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async(client, interaction, args) => {

        const channels = [];

        interaction.guild.channels.cache.forEach((c) => {
            c.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                VIEW_CHANNEL: false,
            }).then(() => {
                    channels.push(`Канал ${c} успешно закрыт.`);
                }).catch(() => {
                    channels.push(`Канал ${c} не получилось закрыт.`);
                })

            const successEmbed = new MessageEmbed()
                .setDescription(channels.join("\n"))
                .setColor(client.color(interaction.guild))

            interaction.followUp({ embeds: [ successEmbed ] });
        })

    }
}