const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, ChatInputCommandInteraction, ComponentType } = require('discord.js');
const authSchema = require('../../schemas/authSchema');

module.exports = {
   data: new SlashCommandBuilder()
   .setName('auth-setup')
   .setDescription('Configure setup the emoji user authentication for seamless indentity verification using emojis.')
   .setDMPermission(false)
   .addChannelOption(option => option
      .setName('channel')
      .setDescription('Please indicate the channel where you would like the emoji authenticator to be send.')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText))
   .addRoleOption(option => option
      .setName('role')
      .setDescription('Please specity the role you would like the user to receive after successfuly authenticating.')
      .setRequired(true)),
      /**
       * 
       * @param {ChatInputCommandInteraction} interaction 
       * @returns
       */
      async execute(interaction) {
        
        const { options, guild } = interaction;
        
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: 'The user authentication system cannot be setup because you dont have the necessary permissions to do so.', ephemeral: true });

        const channel = options.getChannel('channel');
        const role = options.getRole('role');

        authSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
            if(!data) {
                authSchema.create({
                    Guild: guild.id,
                    Channel: channel.id,
                    Role: role.id
                });
            } else {
                await interaction.reply({ content: 'You have a user authentication system in place. To restart it, use the /auth-disable command', ephemeral: true });
                return;
            };
                
            const sillyFace = new ButtonBuilder()
            .setCustomId('sillyFace')
            .setEmoji('<:sillyface:1166060244363915364>')
            .setStyle(ButtonStyle.Primary);
            
            const nerdface = new ButtonBuilder()
            .setCustomId('nerdFace')
            .setEmoji('<:nerdface:1166060703552123021>')
            .setStyle(ButtonStyle.Primary);

            const laughface = new ButtonBuilder()
            .setCustomId('laughFace')
            .setEmoji('<:pngtransparentlaughingemojifacew:1166061366449275012>')
            .setStyle(ButtonStyle.Primary);

            const heartface = new ButtonBuilder()
            .setCustomId('heartFace')
            .setEmoji('<:heartface:1166061881899884736>')
            .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder()
            .addComponents(sillyFace, nerdface, laughface, heartface);

            const embed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Authentication System')
            .setDescription('Select the **laugh** emoji as a way to verify that you are human.');
                

            await channel.send({ embeds: [embed], components: [row] });

            await interaction.reply({ content: `Your have successfully setup the authentication system.`, ephemeral: true });
       });

       const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10000000 });

       collector.on('collect', async(i) => {
         if(i.customId === 'laughFace') {

            const member = i.member;
            if (member) {
                await member.roles.add(role);
                await i.reply({ content: 'You have been successfully verified.', ephemeral: true });
             }; 
         };
       });

       collector.on('end', collected => {
         console.log(`${collected.size} collected interactions`)
      });
    },
};