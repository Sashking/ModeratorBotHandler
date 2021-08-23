// glob promise settings
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

module.exports = async (client) => {
    // Events
    const eventFiles = await globPromise(`${process.cwd()}/Events/*.js`);
    eventFiles.map((value) => require(value));

    // Slash Commands
    const slashCommands = await globPromise(`${process.cwd()}/Commands/*/*.js`);
    const arrayOfSlashCommands = [];

    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;

        client.slashCommands.set(file.name, file);
        arrayOfSlashCommands.push(file);
    });

    client.on('ready', async () => {
        await client.guilds.cache.get("878966242340397076").commands.set(arrayOfSlashCommands);
        // await client.application.commands.set(arrayOfSlashCommands);
    })
};