const { EmbedBuilder } = require("discord.js");

module.exports = async (client, message) => {
    if (message.author.bot) return;
    const prefix = "!"
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|!)\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        command.callback(message, args, client, prefix);
    } catch (error) {
        client.logger.log(`Error while running a command: ${error}`, "error");
        const embed = new EmbedBuilder();
        embed.setDescription("There was an error, the developers have been contatced immediatly.");
        return message.channel.send({ embeds: [embed] });
    }
}