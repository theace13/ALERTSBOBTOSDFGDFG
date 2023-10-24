const { Client, GatewayIntentBits, EmbedBuilder, Permissions, MessageManager, Collection, InteractionType } = require('discord.js');
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync('./src/functions').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./src/commands');

(async () => {
    for (const file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, './src/events');
    client.handleCommands(commandFolders, './src/commands');
    client.login(process.env.token);
})();
