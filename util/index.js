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
        if (file.userPermissions) file.defaultPermission = false;
        arrayOfSlashCommands.push(file);
    });

    client.on('ready', async () => {
        await client.guilds.cache.forEach(guild => {
            guild.commands.set(arrayOfSlashCommands)
                .then((cmd) => {
                    const getRoles = (commandName) => {
                        const permissions = arrayOfSlashCommands.find(x => x.name === commandName).userPermissions;

                        if (!permissions) return null;
                        return guild.roles.cache.filter(x => x.permissions.has(permissions) && !x.managed);
                    };

                    const fullPermissions = cmd.reduce((accumulator, x) => {
                        const roles = getRoles(x.name);
                        if (!roles) return accumulator;

                        const permissions = roles.reduce((a, v) => {
                            return [
                                ...a,
                                {
                                    id: v.id,
                                    type: 'ROLE',
                                    permission: true,
                                }
                            ]
                        }, [])

                        return [
                            ...accumulator,
                            {
                                id: x.id,
                                permissions,
                            }
                        ]
                    }, [])

                    guild.commands.permissions.set({ fullPermissions });
                });
        });
            
        // await client.application.commands.set(arrayOfSlashCommands);
    })
};