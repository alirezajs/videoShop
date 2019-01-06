const controller = require('app/http/controllers/controller');
const passport = require('passport');

class registerController extends controller {

    showRegsitrationForm(req , res) {
        res.render('auth/register' , { errors : req.flash('errors') , recaptcha : this.recaptcha.render() });
    }

    registerProccess(req ,res , next) {
        this.recaptchaValidation(req , res)
            .then(result => this.validationData(req))
            .then(result => {
                if(result) this.register(req , res , next)
                else res.redirect('/register');
            })
            .catch(err => console.log(err));
    }
    
    register(req , res , next) {
        passport.authenticate('local.register' , { 
            successRedirect : '/',
            failureRedirect : '/register',
            failureFlash : true
        })(req, res , next);
    }

}

module.exports = new registerController();