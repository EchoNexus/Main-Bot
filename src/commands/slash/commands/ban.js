const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const Guilds = require("../../../models/Guilds");

module.exports = {
    name: 'ban',
    description: 'Ban a user',
    options: [
        {
            name: 'user',
            description: 'The user you want to ban',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'reason',
            description: 'The reason for this action',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async (client, interaction, prefix) => {
        const targetUser = interaction.options.getMember('user')

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.reply(
        "You can't ban that user because they're the server owner."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.reply(
        "You can't ban that user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.reply(
        "I can't ban that user because they have the same/higher role than me."
      );
      return;
    }

        const noPermEmbed = new EmbedBuilder()
        .setTitle('Insufficent permissions')
        .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ format: 'png', size: 2048 })})
        .setColor(client.config.customization.embedColor)
        .setDescription(`You do not have enough permissions to run this command, if you think this was a mistake please contact the server admin.`)
        .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
        .setTimestamp();
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) && !interaction.member.roles.cache.has(Guilds.findOne({guildId: interaction.guild.id}).modRole)) {
            return interaction.reply({embeds: [noPermEmbed]})
        }

        let reason = interaction.options.get('reason')?.value || "No reason provided.";
        let user = interaction.options.get('user').value;
        const noPermEmbed2 = new EmbedBuilder()
            .setTitle('Insufficent permissions')
            .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`I do not have enough permissions to run this command, if you think this was a mistake please contact the server admin.`)
            .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp();
        client.manager.ban(client, interaction.guild, interaction.user.id, user, reason)
        interaction.reply({content: `I have banned <@${user}> for you.`, ephemeral: true})
}
}