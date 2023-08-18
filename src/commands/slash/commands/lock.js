const { EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType } = require("discord.js");
const Guilds = require("../../../models/Guilds");

module.exports = {
    name: 'lock',
    description: 'Lock a channel',
    options: [
        {
            name: 'channel',
            description: 'The channel you want to lock',
            required: true,
            type: ApplicationCommandOptionType.Channel,
        },
        {
            name: 'reason',
            description: 'The reason for this action',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    callback: async (client, interaction, prefix) => {
        const noPermEmbed = new EmbedBuilder()
        .setTitle('Insufficent permissions')
        .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ format: 'png', size: 2048 })})
        .setColor(client.config.customization.embedColor)
        .setDescription(`You do not have enough permissions to run this command, if you think this was a mistake please contact the server admin.`)
        .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
        .setTimestamp();
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels) && !interaction.member.roles.cache.has(Guilds.findOne({guildId: interaction.guild.id}).modRole)) {
            return interaction.reply({embeds: [noPermEmbed]})
        }

        let reason = interaction.options.get('reason')?.value || "No reason provided."

        let channel = interaction.options.get('channel').value;
        let targetChannel = client.channels.cache.get(channel);

        client.manager.lock(client, interaction.guild, interaction.user.id, targetChannel, reason)
        interaction.reply({
            content: `I have locked <#${channel}> for you.`,
            ephemeral: true,
        })
}
}