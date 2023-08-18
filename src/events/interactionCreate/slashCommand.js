const { InteractionType, EmbedBuilder } = require("discord.js");

module.exports = async (client, interaction) => {
    if (!interaction.type === InteractionType.ApplicationCommand) return;
    const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;
    if (command.userPerms) {
        if (command.botPerms) {
            if (
              !interaction.guild.members.me.permissions.has(
                PermissionsBitField.resolve(command.botPerms || [])
              )
            ) {
              embed.setDescription(
                `I don't have **\`${
                  command.botPerms
                }\`** permission in ${interaction.channel.toString()} to execute this **\`${
                  command.name
                }\`** command.`
              );
              return interaction.reply({ embeds: [embed] });
            }
          }
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.resolve(command.userPerms || [])
          )
        ) {
          embed.setDescription(
            `You don't have **\`${
              command.userPerms
            }\`** permission in ${interaction.channel.toString()} to execute this **\`${
              command.name
            }\`** command.`
          );
          return interaction.reply({ embeds: [embed] });
        }
      }
      try {
        const prefix = client.config.main.prefix;
        await command.callback(client, interaction, prefix);
      } catch (error) {
        const errorEmbed = new EmbedBuilder()
        .setTitle("Error")
        .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL({ format: 'png', size: 2048 })})
        .setColor(client.config.customization.embedColor)
        .setDescription(`We are very sorry but it seems like an error has occurred, if this keeps happening consider contacting support.`)
        .setFooter({text: `${client.config.branding.name}`, iconURL: client.user.displayAvatarURL({ format: 'png', size: 2048 })})
        .setTimestamp()
        if (interaction.replied) {
          await interaction
            .editReply({
              embeds: [errorEmbed],
            })
            .catch(() => {});
        } else {
          await interaction
            .reply({
              ephemeral: true,
              embeds: [errorEmbed],
            })
            .catch(() => {});
        }
        console.error(error);
      }
}