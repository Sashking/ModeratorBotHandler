// Imports
const { Client, Collection } = require("discord.js");

// Client Initialisation
const client = new Client({ partials: [ 'CHANNEL', 'MESSAGE', 'GUILD_MEMBER', 'REACTION' ], intents: [ "GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGES" ] });
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.color = (guild) => guild.me.displayHexColor === "000000" ? "#ffffff" : guild.me.displayHexColor;

// .env Variables
require('dotenv').config();
const token = process.env.TOKEN;
const mongo = process.env.MONGO;

// Initializing the Project
require("./util/index")(client);
require("./util/mongoose")(mongo);

client.login(token).then(() => {});