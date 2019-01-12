const database = require('./database');
const session = require('./session');
const layout = require('./layout');
const service = require('./service');
const project = require('./project');

module.exports = {
    database,
    session,
    layout,
    service,
    port : process.env.APPLICATION_PORT,
    cookie_secretkey : process.env.COOKIE_SECRETKEY,
    project
}