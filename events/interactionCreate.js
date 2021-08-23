const client = require('../index')

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.defer().catch(() => {});

        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return interaction.followUp({ content: 'Произошла ошибка!' });

        const args = [];
        interaction.options.array().map((x) => {
            args.push(x.value);
        });

        cmd.run(client, interaction, args);
    }
})