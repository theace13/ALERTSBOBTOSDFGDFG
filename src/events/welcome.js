const { EmbedBuilder } = require('discord.js');
const welcomeSchema = require('../schemas/authSchema');

const welcomeMessages = [
    `Welcome to the server`,
    `Hey there, welcome`,
    `Howdy, glad you're here`,
]

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const guildId = member.guild.id;

        welcomeSchema.findOne({ Guild: guildId }, (err, data) => {
            if (data) {
                const channelId = data.Channel;
                const channel = member.guild.channels.cache.get(channelId);

                if (channel) {
                    const memberUsername = member.user.username;
                    const memberThumbnail = member.user.displayAvatarURL({ size: 256 });

                    const randomMessageIndex = Math.floor(Math.random() * welcomeMessages.length);
                    const randomMessage = welcomeMessages[randomMessageIndex];
                    const guildName = member.guild.name;

                    const userEmbed = new EmbedBuilder()
                        .setTitle(`${memberUsername}`)
                        .setDescription(`${randomMessage}\n\n>> | Enjoy!!`)
                        .setImage(memberThumbnail)
                        .setTimestamp()
                        .setFooter({ text: `Welcome to ${guildName}!` })
                        .setColor('Blue')

                    channel.send({
                        embeds: [userEmbed]
                    });
                }
            }
        });
    }
}