const { Schema, model } = require('mongoose');

const guildsSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  modLog: {
    type: String,
    required: true,
  },
  mainRole: {
    type: String,
    required: true,
  },
  modRole: {
    type: String,
    required: true,
  },
  backupCode: {
    type: String,
    required: true,
  },
});

module.exports = model('Guilds', guildsSchema);