const config = require("../config/config");
const { EmbedBuilder } = require("discord.js");
const chalk = import("chalk");
/**
 * @param {Discord.Client} client
 */

module.exports = async (client) => {
    process.on("beforeExit", (code) => {
        // If You Want You Can Use
        console.log("[AntiCrash] | [BeforeExit_Logs] | [Start] : ===============");
        console.log(code);
        console.log("[AntiCrash] | [BeforeExit_Logs] | [End] : ===============");
    });
    process.on("exit", (error) => {
        // If You Want You Can Use
        console.log("[AntiCrash] | [Exit_Logs] | [Start]  : ===============");
        console.log(error);
        console.log("[AntiCrash] | [Exit_Logs] | [End] : ===============");
    });
    process.on("unhandledRejection", async (reason, promise) => {
        // Needed
        console.log("[AntiCrash] | [UnhandledRejection_Logs] | [start] : ===============");
        console.log(reason);
        console.log("[AntiCrash] | [UnhandledRejection_Logs] | [end] : ===============");

        const errEmbed = new EmbedBuilder()
            .setColor("#000000")
            .setTitle(`An Error Occured:`)
            .setDescription(`\`\`\`${reason}\`\`\``)
            .setTimestamp();
    });
    process.on("rejectionHandled", (promise) => {
        // If You Want You Can Use
        console.log("[AntiCrash] | [RejectionHandled_Logs] | [Start] : ===============");
        console.log(promise);
        console.log("[AntiCrash] | [RejectionHandled_Logs] | [End] : ===============");
    });
    process.on("uncaughtException", (err, origin) => {
        // Needed
        console.log("[AntiCrash] | [UncaughtException_Logs] | [Start] : ===============");
        console.log(err);
        console.log("[AntiCrash] | [UncaughtException_Logs] | [End] : ===============");
    });
    process.on("uncaughtExceptionMonitor", (err, origin) => {
        // Needed
        console.log("[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [Start] : ===============");
        console.log(err);
        console.log("[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [End] : ===============");
    });
    process.on("warning", (warning) => {
        // If You Want You Can Use
        console.log("[AntiCrash] | [Warning_Logs] | [Start] : ===============");
        console.log(warning);
        console.log("[AntiCrash] | [Warning_Logs] | [End] : ===============");
    });
    // process.on('SIGINT', () => { // If You Want You Can Use
    //   console.log(chalk.yellow('☆・[AntiCrash] | [SIGINT]・☆'));
    // });

    client.logger.log(`Loaded ErrorHandler (AntiCrash)`);
};
