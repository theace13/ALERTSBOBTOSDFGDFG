const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const welcomeSchema = require('../../schemas/authSchema')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome-setup')
        .setDescription('Setup a welcome message for you guild')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Please indicate the channel where yuo would like the welcome message to be sent.')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
            ),
        async execute(interaction) {
            
            const channel = interaction.options.getChannel('channel')

            welcomeSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {

                if (!data) {
                    await welcomeSchema.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id,
                    });
                } else {
                    await interaction.reply({
                        content: 'You have a welcome message system in place.',
                        ephemeral: true
                    });
                    return;
                }


                await interaction.reply({
                    content: `The welcome messages system has been successfully implemented within ${channel}`,
                    ephemeral: true
                })
            })
        }
}