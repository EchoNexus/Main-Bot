const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const mongoose = require("mongoose");

class MusicBot extends Client {
  constructor() {
    super({
      allowedMentions: {
        parse: ["everyone", "roles", "users"],
      },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
      ],
    });
    this.slashCommands = new Collection();
    this.config = require("../config/config");
    this.owner = this.config.staff.owner;
    this.prefix = this.config.main.prefix;
    this.embedColor = this.config.customization.embedColor;
    this.aliases = new Collection();
    this.commands = new Collection();
    this.logger = require("../utils/logger.js");
    this.emoji = require("../config/emoji.json");
    this.manager = require('../utils/manager');
    if (!this.token) this.token = this.config.token;

    this.rest.on("rateLimited", (info) => {
      this.logger.log(info, "log");
    });

    /**
     *  Mongose for data base
     */
    mongoose.connect(this.config.database.url);
    mongoose.set("strictQuery", true);
    mongoose.connection.on("connected", () => {
      this.logger.log("[DB] DATABASE CONNECTED", "ready");
    });
    mongoose.connection.on("err", (err) => {
      console.log(`Mongoose connection error: \n ${err.stack}`, "error");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
    });

    ["commands", "slashCommand", "events", "errorHandler"].forEach((handler) => {
      require(`../handlers/${handler}`)(this);
    });
  }
  connect(token) {
    return super.login(token);
  }
}

module.exports = MusicBot;
