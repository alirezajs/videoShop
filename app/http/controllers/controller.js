const autoBind = require('auto-bind');
const Recaptcha = require('express-recaptcha').Recaptcha;

module.exports = class controller {
    constructor() {
        autoBind(this);
        this.recaptchaConfig();
    }

    recaptchaConfig() {
        this.recaptcha = new Recaptcha(
            '6LcsaVcUAAAAAL7Onj_lTp7wYZyMpzK3ZXQ3xrDg',
            '6LcsaVcUAAAAAH__aEv9-X6agk1zQgCJ8v9PPr0K' , 
            { hl : 'fa' }
        );
    }

    recaptchaValidation(req , res) {
        return new Promise((resolve , reject) => {
            this.recaptcha.verify(req , (err , data) => {
                if(err) {
                    req.flash('errors' , 'گزینه امنیتی مربوط به شناسایی روبات خاموش است، لطفا از فعال بودن آن اطمینان حاصل نمایید و مجدد امتحان کنید');
                    res.redirect(req.url);
                } else resolve(true);
            })
        })
    }
}