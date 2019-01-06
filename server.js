require('app-module-path').addPath(__dirname)
const App = require('./app');
global.config = require("./config/index")
new App();