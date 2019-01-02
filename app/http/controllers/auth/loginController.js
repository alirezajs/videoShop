const controller = require('app/http/controllers/controller');

class loginController extends controller {
    
    showLoginForm(req , res) {
        res.render('auth/login');
    }

}

module.exports = new loginController();