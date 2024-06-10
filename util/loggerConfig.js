const winston = require('winston');
// require('winston-mongodb');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: 'log/logger.log'
        })
        // new winston.transports.MongoDB({
        //     db: 'mongodb://localhost:27017/test',
        //     collection: 'joseph-logs',
        //     level: 'info'
        // })
    ],
});

module.exports = logger;
