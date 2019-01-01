const controller = require('app/http/controllers/controller');

class indexController extends controller {
    index(req , res) {
        res.json('Admin Page');
    }

    courses(req , res) {
        res.json('course Page');
    }
}

module.exports = new indexController();