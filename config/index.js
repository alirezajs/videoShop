const database = require('./database');
const session = require('./session');
const layout = require('./layout');
const service = require('./service');

module.exports = {
    database,
    session,
    layout,
    service,
    port : process.env.APPLICATION_PORT,
    cookie_sercretkey : process.env.COOKIE_SECRETKEY
}