require('dotenv').config();
const DiscoMod = require('./structures/client');
const client = new DiscoMod();
client.connect(process.env.TOKEN)