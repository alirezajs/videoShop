const controller = require('app/http/controllers/controller');
const passport = require('passport');

class registerController extends controller {

    showRegsitrationForm(req, res) {
        const title = "صفحه عضویت";

        res.render('home/auth/register', {
            recaptcha: this.recaptcha.render(),
            title: title
        });
    }

    async  registerProccess(req, res, next) {

        await this.recaptchaValidation(req, res);
        let result = await this.validationData(req)
        if (result) {
            return this.register(req, res, next)
        }
        req.flash('formData', req.body);

        return res.redirect('/auth/register');
    }

    register(req, res, next) {
        passport.authenticate('local.register', {
            successRedirect: '/',
            failureRedirect: '/auth/register',
            failureFlash: true
        })(req, res, next);
    }

}

module.exports = new registerController();