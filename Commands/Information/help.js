const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const { readdirSync } = require("fs");

module.exports = {
    name: 'help',
    description: "Список всех доступных команд бота на данный момент.",

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {

        const categoryNames = {
            Information: "ℹ Информационные команды",
            Config: "⚙ Настройки"
        }

        let categories = [];
        readdirSync('commands').forEach((dir) => {
            let commands = [];
            readdirSync(`commands/${dir}`).forEach((cmd) => {
                const cmdName = cmd.toString().replace(".js", "");
                commands.push(`**\` ${cmdName} \`**`);
            })

            categories.push({
                name: categoryNames[dir.toString()],
                value: commands.join(" ") + "\n** **"
            });
        });

        const mainMenuEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
            .addFields(categories)
            .setColor(client.color(interaction.guild))


        interaction.followUp({ embeds: [ mainMenuEmbed ] });

    }
}