const { CommandInteraction, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    description: "Shows bot's current ping.",

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {

        const embed = new MessageEmbed()
            .setDescription(`🏓 Пинг бота: **${ client.ws.ping } мс**\n<:cpu:861537122766028871> Использование памяти: **${ (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) } МБ**`)
            .setColor(client.color(interaction.guild))

        interaction.followUp({ embeds: [ embed ] });

    }
}