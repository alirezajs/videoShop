const controller = require('app/http/controllers/controller');

class homeController extends controller {

    index(req, res) {
        res.render('home', { user: req.user });
    }

}

module.exports = new homeController();