const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const Guilds = require("../../models/Guilds");

module.exports = {
    name: 'warn',
    aliases: ['warning', "w"],
    description: 'Warn a server member',
    callback: async (message, args, client, prefix) => {
        const noPermEmbed = new EmbedBuilder()
        .setTitle('Insufficent permissions')
        .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({ format: 'png', size: 2048 })})
        .setColor(client.config.customization.embedColor)
        .setDescription(`You do not have enough permissions to run this command, if you think this was a mistake please contact the server admin.`)
        .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
        .setTimestamp();
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers) && !message.member.roles.cache.has(Guilds.findOne({guildId: message.guild.id}).modRole)) {
            return message.reply({embeds: [noPermEmbed]})
        }

        let reason = args.slice(1).join(' ') || "No reason provided.";

        let user;

        if (message.mentions.users.size > 0) {
            const Suser = message.mentions.users.first();
            user = Suser.id;
        } else {
        const userId = args[0];
        if (!client.users.cache.get(userId) === undefined) {
            user = args[0];
        } else {
            const noSelfEmbed = new EmbedBuilder()
            .setTitle("Wrong arguments")
            .setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`You did not provide all required arguments, correct syntax: \`\`\`${prefix}warn <user> <reason (optional)>\`\`\``)
            .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp();
            message.reply({embeds: [noSelfEmbed]});
            return;
        }
        }   

        client.manager.warn(client, message.guild, message.author.id, user, reason)
}
}