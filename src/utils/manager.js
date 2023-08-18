const { EmbedBuilder } = require("discord.js");
const Guilds = require('../models/Guilds');
const Warns = require('../models/Warns');
const WarnLog = require('../models/WarnLog')

module.exports = class Manager {
    static warn (client, guild, moderator, target, reason) {
        const warns = Warns.findOne({guildId: guild.id, userId: target});
        const modLog = client.channels.cache.get(Guilds.findOne({guildId: guild.id}).modlog);
        if (!warns) {
            const newWarnLog = new WarnLog({
                guildId: guild.id,
                userId: target,
                moderator: moderator,
                reason: reason,
            });
            newWarnLog.save();
            const newWarns = new Warns({
                guildId: guild.id,
                userId: target,
                amount: 1,
            });
            newWarns.save();
            const warnEmbed = new EmbedBuilder()
            .setTitle(`You have been warned in ${guild.name}`)
            .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`<@!${moderator}> gave you a warning for "${reason}". \nTotal warnings: ${newWarns.amount}`)
            .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp()
            client.users.send(target, {embeds: [warnEmbed]});
            const logEmbed = new EmbedBuilder()
            .setTitle("Server Member Warned")
            .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`<@!${moderator}> gave <@!${target}> 1 warning for "${reason}". \nTotal warnings: ${newWarns.amount}`)
            .setFooter({text: `${client.config.branding.name} logging`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp()
            if (modLog) modLog.send({embeds: [logEmbed]});
        } else {
            const newWarnLog = new WarnLog({
                guildId: guild.id,
                userId: target,
                moderator: moderator,
                reason: reason,
            });
            newWarnLog.save();
            warns.amount += 1;
            warns.save();
            const warnEmbed = new EmbedBuilder()
            .setTitle(`You have been warned in ${guild.name}`)
            .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`<@!${moderator}> gave you a warning for "${reason}". \nTotal warnings: ${warns.amount}`)
            .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp()
            client.users.send(target, {embeds: [warnEmbed]});
            const logEmbed = new EmbedBuilder()
            .setTitle("Server Member Warned")
            .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`<@!${moderator}> gave <@!${target}> 1 warning for "${reason}". \nTotal warnings: ${warns.amount}`)
            .setFooter({text: `${client.config.branding.name} logging`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp()
            if (modLog) modLog.send({embeds: [logEmbed]});
        }
    }

    static kick (client, guild, moderator, target, reason) {


        const modLog = client.channels.cache.get(Guilds.findOne({guildId: guild.id}).modlog);
        const kickEmbed = new EmbedBuilder()
            .setTitle(`You have been kicked from ${guild.name}`)
            .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`<@!${moderator}> kicked you for "${reason}".`)
            .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp()
            const kickUser = guild.members.fetch(target);
            kickUser.kick();
            client.users.send(target, {embeds: [kickEmbed]});
            const logEmbed = new EmbedBuilder()
            .setTitle("Server Member Kicked")
            .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`<@!${moderator}> kicked <@!${target}> for "${reason}".`)
            .setFooter({text: `${client.config.branding.name} logging`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp()
            if (modLog) modLog.send({embeds: [logEmbed]});
    }
    
    static ban (client, guild, moderator, target, reason) {
        const modLog = client.channels.cache.get(Guilds.findOne({guildId: guild.id}).modlog);
        const banEmbed = new EmbedBuilder()
            .setTitle(`You have been banned from ${guild.name}`)
            .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`<@!${moderator}> banned you for "${reason}".`)
            .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp()
            const banUser = client.users.cache.get(target);
            const mod = client.users.cache.get(moderator)
            guild.members.ban(banUser, {reason: `[${mod.username}] - ${reason}`});
            client.users.send(target, {embeds: [banEmbed]});
            const logEmbed = new EmbedBuilder()
            .setTitle("Server Member Banned")
            .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`<@!${moderator}> banned <@!${target}> for "${reason}".`)
            .setFooter({text: `${client.config.branding.name} logging`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp()
            if (modLog) modLog.send({embeds: [logEmbed]});
    }

    static unban (client, guild, moderator, target, reason) {
        const modLog = client.channels.cache.get(Guilds.findOne({guildId: guild.id}).modlog);
        const unbanEmbed = new EmbedBuilder()
            .setTitle(`You have been unbanned from ${guild.name}`)
            .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`<@!${moderator}> unbanned you for "${reason}".`)
            .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp()
            const unbanUser = client.users.cache.get(target);
            guild.members.unban(unbanUser);
            client.users.send(target, {embeds: [unbanEmbed]});
            const logEmbed = new EmbedBuilder()
            .setTitle("Server Member Unbanned")
            .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
            .setColor(client.config.customization.embedColor)
            .setDescription(`<@!${moderator}> unbanned <@!${target}> for "${reason}".`)
            .setFooter({text: `${client.config.branding.name} logging`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
            .setTimestamp()
            if (modLog) modLog.send({embeds: [logEmbed]});
    }

    static lock (client, guild, moderator, channel, reason) {
        channel.permissionOverwrites.edit(Guilds.findOne({guildId: guild.id}).mainRole || guild.id, { SendMessages: false });
        const lockedEmbed = new EmbedBuilder()
        .setTitle("Channel Locked")
        .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
        .setColor(client.config.customization.embedColor)
        .setDescription(`<@!${moderator}> locked <#${channel.id}> for "${reason}".`)
        .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
        .setTimestamp()
        const modLog = client.channels.cache.get(Guilds.findOne({guildId: guild.id}).modlog);
        const logEmbed = new EmbedBuilder()
        .setTitle("Server Channel Locked")
        .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
        .setColor(client.config.customization.embedColor)
        .setDescription(`<@!${moderator}> locked <#${channel.id}> for "${reason}".`)
        .setFooter({text: `${client.config.branding.name} logging`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
        .setTimestamp()
        if (modLog) modLog.send({embeds: [logEmbed]});
        channel.send({embeds: [lockedEmbed]});
    }

    static unlock (client, guild, moderator, channel, reason) {
        channel.permissionOverwrites.edit(Guilds.findOne({guildId: guild.id}).mainRole || guild.id, { SendMessages: true });
        const unlockedEmbed = new EmbedBuilder()
        .setTitle("Channel Unlocked")
        .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
        .setColor(client.config.customization.embedColor)
        .setDescription(`<@!${moderator}> unlocked <#${channel.id}> for "${reason}".`)
        .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
        .setTimestamp()
        const modLog = client.channels.cache.get(Guilds.findOne({guildId: guild.id}).modlog);
        const logEmbed = new EmbedBuilder()
        .setTitle("Server Channel Unlocked")
        .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
        .setColor(client.config.customization.embedColor)
        .setDescription(`<@!${moderator}> unlocked <#${channel.id}> for "${reason}".`)
        .setFooter({text: `${client.config.branding.name} logging`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
        .setTimestamp()
        if (modLog) modLog.send({embeds: [logEmbed]});
        channel.send({embeds: [unlockedEmbed]});
    }

    static hide (client, guild, moderator, channel, reason) {
        channel.permissionOverwrites.edit(Guilds.findOne({guildId: guild.id}).mainRole || guild.id, { ViewChannel: false });
        const modLog = client.channels.cache.get(Guilds.findOne({guildId: guild.id}).modlog);
        const logEmbed = new EmbedBuilder()
        .setTitle("Server Channel Hidden")
        .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
        .setColor(client.config.customization.embedColor)
        .setDescription(`<@!${moderator}> hid <#${channel.id}> for "${reason}".`)
        .setFooter({text: `${client.config.branding.name} logging`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
        .setTimestamp()
        if (modLog) modLog.send({embeds: [logEmbed]});
    }

    static unhide (client, guild, moderator, channel, reason) {
        channel.permissionOverwrites.edit(Guilds.findOne({guildId: guild.id}).mainRole || guild.id, { ViewChannel: true });
        const modLog = client.channels.cache.get(Guilds.findOne({guildId: guild.id}).modlog);
        const logEmbed = new EmbedBuilder()
        .setTitle("Server Channel Unhidden")
        .setAuthor({name: guild.name, iconURL: guild.iconURL({ format: 'png', size: 2048 })})
        .setColor(client.config.customization.embedColor)
        .setDescription(`<@!${moderator}> unhid <#${channel.id}> for "${reason}".`)
        .setFooter({text: `${client.config.branding.name} logging`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
        .setTimestamp()
        channel.send({embeds: [unlockedEmbed]});
    }
}