const { SlashCommandBuilder } = require('discord.js');
const authSchema = require('../../schemas/authSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('auth-disable')
        .setDescription('Disable the emoji user authentication system')
        .setDefaultPermission(false), // setDMPermission הוחלפה ב-setDefaultPermission
    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return await interaction.reply({
                content: 'The user authentication system cannot be disabled because you do not have the necessary permissions to do so.',
                ephemeral: true,
            });
        }

        authSchema.deleteMany({ Guild: interaction.guild.id }, async (err, data) => {
            console.log("The user authentication system has been successfully disabled.");
            await interaction.reply('The user authentication system has been successfully disabled.');
        });
        
        
        const channel = interaction.channel;

        try {
            const messages = await channel.messages.fetch(); // תשימו לב שנכנס לתוך messages, כדי לא לקבל שגיאות.
            const authSetupMessage = messages.find((msg) =>
                msg.embeds.length && msg.embeds[0].title === 'Authentication System'
            );

            if (authSetupMessage) {
                await authSetupMessage.delete();
            }

        } catch (error) {
            console.error('Error deleting auth-setup embed', error); // תיקנתי את "erorr" ל-"error"
        }
    },
};