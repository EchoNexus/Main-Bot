const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const Guilds = require("../../models/Guilds");

module.exports = {
    name: 'lock',
    aliases: ['close', 'l'],
    description: 'Lock a channel',
    callback: async (message, args, client, prefix) => {
        const noPermEmbed = new EmbedBuilder()
        .setTitle('Insufficent permissions')
        .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({ format: 'png', size: 2048 })})
        .setColor(client.config.customization.embedColor)
        .setDescription(`You do not have enough permissions to run this command, if you think this was a mistake please contact the server admin.`)
        .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
        .setTimestamp();
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels) && !message.member.roles.cache.has(Guilds.findOne({guildId: message.guild.id}).modRole)) {
            return message.reply({embeds: [noPermEmbed]})
        }

        let reason = args.slice(1).join(' ') || "No reason provided.";

        let channel;

        if (message.mentions.channels.size > 0) {
            channel = message.mentions.channels.first();
        } else {
        const channelId = args[0];
        if (!message.guild.channels.cache.get(channelId) === undefined) {
            channel = message.guild.channels.cache.get(channelId);
        } else {
            channel = message.channel;
            reason = args.join(' ') || "No reason provided.";
        }
        }   

        client.manager.lock(client, message.guild, message.author.id, channel, reason)
}
}