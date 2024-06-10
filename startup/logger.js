const logger = require('../util/loggerConfig')

module.exports = () => {
    process.on('uncaughtException', (err) => {
        logger.info(err.message);
    });
    process.on('unhandledRejection', (err) => {
        throw new Error(err.message);
    });
}