const autoBind = require('auto-bind');

module.exports = class controller {
    constructor() {
        autoBind(this);
    }

    failed(msg, res, statusCode = 500) {
        res.status(statusCode).json({
            data: msg,
            status: 'error',
            statusCode: statusCode
        })
    }
}