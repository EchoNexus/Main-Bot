module.exports = {
  name: 'join',
  description: 'Join servers based on user count',
  async callback(message, args) {
    const totalUsers = message.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const joinThreshold = 1000;

    if (totalUsers >= joinThreshold) {
      return message.reply(`The total user count (${totalUsers}) is already greater than or equal to the threshold (${joinThreshold}).`);
    }

    let joinCount = 0;

    if (args[0] === 'invite') {
      const inviteLink = args[1];
      try {
        const invite = await message.client.fetchInvite(inviteLink);
        const guild = invite.guild;
        if (guild.memberCount < joinThreshold) {
          await guild.members.fetch({ withPresences: true, force: true });
          joinCount = 1;
          console.log(`Joined guild: ${guild.name} (${guild.memberCount} members)`);
        }
      } catch (error) {
        console.error(`Error joining guild from invite: ${inviteLink}`);
        console.error(error);
      }
    } else if (args[0] === 'id') {
      const serverId = args[1];
      const guild = message.client.guilds.cache.get(serverId);
      if (guild && guild.memberCount < joinThreshold) {
        try {
          await guild.members.fetch({ withPresences: true, force: true });
          joinCount = 1;
          console.log(`Joined guild: ${guild.name} (${guild.memberCount} members)`);
        } catch (error) {
          console.error(`Error joining guild by ID: ${serverId}`);
          console.error(error);
        }
      }
    }

    if (joinCount === 0) {
      return message.author.send(`No eligible servers to join.`);
    }

    message.author.send(`${joinCount} guilds joined.`);
  },
};
﻿
