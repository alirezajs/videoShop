const controller = require('app/http/controllers/controller');
const User=require('app/models/user');
class homeController extends controller {

    index(req, res) {
        res.render('home/index');
    }

}

module.exports = new homeController();