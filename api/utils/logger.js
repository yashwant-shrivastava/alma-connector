const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;

class Logger {
    constructor(name) {
         this.myFormat = printf(({ level, message, label, timestamp }) => {
          return `${timestamp} [${label}] ${level}: ${JSON.stringify(message)}`;
        });

        this.logger = createLogger({
            format: combine(
                label({ label: name }),
                timestamp(),
                 winston.format.colorize(),
                format.json(),
                this.myFormat
            ),
            transports: [
                new transports.Console()
            ]
        });
    }

    info(message) {
        this.logger.info(message);
    }

    error(message) {
        this.logger.error(message);
    }

    warn(message) {
        this.logger.warn(message);
    }

    http(message) {
        this.logger.http(message);
    }

    verbose(message) {
        this.logger.verbose(message);
    }

    silly(message) {
        this.logger.silly(message);
    }

    silly(message) {
        this.logger.silly(message);
    }
}


module.exports = Logger;
