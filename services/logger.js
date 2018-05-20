const winston = require('winston');

module.exports = {
    info: (log) => {
        winston.log('info', log);
    }
}