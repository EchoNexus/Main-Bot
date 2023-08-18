require('dotenv').config();
const { ActivityType, setActivity} = require('discord.js')

module.exports = async (client) => {
try {
    client.user.setStatus('online');
    let status = [
        {
          name: '/help',
          type:  ActivityType.Listening,
        },
        {
          name: 'moderating',
          type:  ActivityType.Competing,
        },
    ];

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 10000);
  client.logger.log(`Changed ${client.user.tag} presence`, 'ready');
} catch (error) {
    client.logger.log("Error while changing presence", "error");
} {
}
};