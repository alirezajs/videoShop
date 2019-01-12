const controller = require('app/http/controllers/controller');

class indexController extends controller {
    index(req , res) {
        res.render('admin/index');
    }

   
}

module.exports = new indexController();