const logger = require('../util/loggerConfig');

module.exports = (err, req, res, next) => {
    // logger.error('hello world');
    // logger.add(new winston.transports.MongoDB(options));
    return res.send('Internal server error.');
}