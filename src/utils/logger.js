const chalk = import("chalk");
const moment = require("moment");

module.exports = class Logger {
	static log (content, type = "log") {
		const date = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
		switch (type) {
	
		case "log": {
			return console.log(`${content}`);
		}
		case "warn": {
			return console.log(`${content}`);
		}
		case "error": {
			return console.log(`${content}`);
		}
		case "debug": {
			return console.log(`${content}`);
		}
		case "cmd": {
			return console.log(`${content}`);
		}
		case "event": {
			return console.log(`${content}`);
		}
		case "ready": {
			return console.log(`${content}`);
		} 
		default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
		}
	}
};