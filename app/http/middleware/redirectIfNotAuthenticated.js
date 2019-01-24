
const User = require('app/models/user');
const middleware = require('./middleware');

class redirectIfAuthenticated extends middleware {
    
    handle(req , res ,next) {
        if(req.isAuthenticated())
            return next();
    
        return res.redirect('/login');
    }


}


module.exports = new redirectIfAuthenticated();