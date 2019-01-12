const User = require('app/models/user');
const middleware = require('./middleware');

class redirectIfNotAdmin extends middleware {

    handle(req, res, next) {
        if (req.isAuthenticated() && req.User.admin)
            return next();

        res.redirect('/')
    }


}


module.exports = new redirectIfNotAdmin();