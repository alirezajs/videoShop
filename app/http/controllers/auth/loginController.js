const controller = require('app/http/controllers/controller');
const passport = require('passport');

class loginController extends controller {
    
    showLoginForm(req , res) {
        res.render('auth/login' , { errors : req.flash('errors') ,recaptcha : this.recaptcha.render() });
    }

    loginProccess(req  ,res , next) {
        this.recaptchaValidation(req , res)
            .then(result => this.validationData(req))
            .then(result => {
                if(result) this.login(req, res , next)
                else res.redirect('/login');
            })
            .catch(err => console.log(err));
    }

    
    validationData(req) {
        req.checkBody('email' , 'فیلد ایمیل معتبر نیست').isEmail();
        req.checkBody('password' , 'فیلد پسورد نمیتواند کمتر از 8 کاراکتر باشد').isLength({ min : 8});

        return req.getValidationResult()
            .then(result => {
                const errors = result.array();
                const messages = [];
                errors.forEach(err => messages.push(err.msg));

                if(errors.length == 0) 
                    return true;
                
                req.flash('errors' , messages)
                return false;
            })
            .catch(err => console.log(err));
    }

    login(req ,res , next) {
        passport.authenticate('local.login' , { 
            successRedirect : '/',
            failureRedirect : '/login',
            failureFlash : true
        })(req, res , next);
    }

}

module.exports = new loginController();