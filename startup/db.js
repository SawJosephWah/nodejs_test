const mongoose = require('mongoose');
const logger = require('../util/loggerConfig');
const config = require('config');
//...
const dbConfig = config.get('server.dbConfig.host');

module.exports = () => {
    mongoose.connect(dbConfig)
        .then(() => {
            logger.info(`Connected to ${dbConfig} successfully`)
        })
}