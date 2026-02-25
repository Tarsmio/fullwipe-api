const winston = require('winston')

const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `[${level.toUpperCase()}] (${timestamp}) : ${message}`;
  });

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: `./log/logs-${Date.now().toString()}.log`,
        }),
        new winston.transports.File({
            level: 'error',
            filename: `./log/errors/err-logs-${Date.now().toString()}`
        })
    ]
})

module.exports = logger