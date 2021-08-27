const { CommandInteraction, Client, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const guildSettingsSchema = require('../../models/guildSettings');

module.exports = {
    name: 'settings',
    description: "Настройте параметры этого сервера.",
    userPermissions: ['ADMINISTRATOR'],

    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async(client, interaction, args) => {

        guildSettingsSchema.findOne({ GuildID: interaction.guild.id }, async (err, data) => {
            if (!data) {
                data = new guildSettingsSchema({
                    GuildID: interaction.guild.id,
                    LinkProtection: false,
                    MuteRoleID: "",
                })
                await data.save();
            }

            const linkProtectionButton = new MessageButton()
                .setCustomId('linkProtection')
                .setLabel('Защита от ссылок')
                .setStyle('PRIMARY')

            const linkProtectionOptions = [ "Выкл.", "Инвайт ссылки", "Все ссылки" ]

            async function generateMessage() {
                let linkProtection = linkProtectionOptions[data.LinkProtection];

                const embed = new MessageEmbed()
                    .addField("Защита от ссылок", `\` ${ linkProtection } \``)
                    .setColor(client.color(interaction.guild))

                const row = new MessageActionRow()
                    .addComponents(linkProtectionButton)

                return {
                    embeds: [ embed ],
                    components: [ row ]
                };
            }


            let msg = await generateMessage()
            await interaction.followUp(msg);

            const filter = c => c.customId === 'linkProtection' && c.member.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter });

            collector.on('collect', async collected => {

                if (collected.isButton()) {
                    if (collected.customId === 'linkProtection') {
                        if (data.LinkProtection + 1 < linkProtectionOptions.length) data.LinkProtection++;
                        else data.LinkProtection = 0;
                        data.save().then(async () => {
                            let m = await generateMessage();
                            await collected.update(m);
                        })
                    }
                }

            })

        });

    }
}