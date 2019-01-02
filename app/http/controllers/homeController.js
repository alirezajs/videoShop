const controller = require('app/http/controllers/controller');

class homeController extends controller {
    
    index(req , res) {
        res.render('home');
    }

}

module.exports = new homeController();