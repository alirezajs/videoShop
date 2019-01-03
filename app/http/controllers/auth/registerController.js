const controller = require('app/http/controllers/controller');
const passport = require('passport');

class registerController extends controller {

    showRegsitrationForm(req , res) {
        res.render('auth/register' , { messages : req.flash('errors') , recaptcha : this.recaptcha.render() });
    }

    registerProccess(req ,res , next) {
        this.recaptchaValidation(req , res)
            .then(result => this.validationData(req))
            .then(result => {
                if(result) this.register(req , res , next)
                else res.redirect('/register');
            })
            .catch(err => console.log(er));
    }


    validationData(req) {
        req.checkBody('name' , 'فیلد نام نمیتواند خالی بماند').notEmpty();
        req.checkBody('name' , 'فیلد نام نمیتواند کمتر از 5 کاراکتر باشد').isLength({ min : 5});
        req.checkBody('email' , 'فیلد نام نمیتواند خالی بماند').notEmpty();
        req.checkBody('email' , 'فیلد ایمیل معتبر نیست').isEmail();
        req.checkBody('password' , 'فیلد نام نمیتواند خالی بماند').notEmpty();
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

    register(req , res , next) {
        passport.authenticate('local.register' , { 
            successRedirect : '/',
            failureRedirect : '/register',
            failureFlash : true
        })(req, res , next);
    }

}

module.exports = new registerController();