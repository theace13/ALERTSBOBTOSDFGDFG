const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the bot\'s ping'),
    async execute(interaction) {
        let circles = {
            good: '<:High:1165973626688905296>',
            okay: '<:Mid:1165973618505830430>',
            bad: '<:Low:1165973621919981628>',
        };

        await interaction.deferReply();

        const pinging = await interaction.editReply('Pinging...');

        const ws = interaction.client.ws.ping;
        const msgEdit = Date.now() - pinging.createdTimestamp;

        let days = Math.floor(interaction.client.uptime / 86400000);
        let hours = Math.floor((interaction.client.uptime / 3600000) % 24);
        let minutes = Math.floor((interaction.client.uptime / 60000) % 60);
        let seconds = Math.floor((interaction.client.uptime / 1000) % 60);

        const wsEmoji = ws <= 100 ? circles.good : ws <= 200 ? circles.okay : circles.bad;
        const msgEmoji = msgEdit <= 200 ? circles.good : circles.bad;

        await interaction.editReply({
            content: '',
            embeds: [
                {
                    title: 'Bot Ping Information',
                    color: 0x3498db,
                    fields: [
                        {
                            name: 'WebSocket',
                            value: `${wsEmoji} \`${ws}ms\``,
                        },
                        {
                            name: 'API Latency',
                            value: `${msgEmoji} \`${msgEdit}ms\``,
                        },
                        {
                            name: 'Bot Uptime',
                            value: `<:Timer:1165973623861952583> \`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds\``,
                        },
                    ],
                },
            ],
        });
    },
};
