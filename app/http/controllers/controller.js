const autoBind = require('auto-bind');
const Recaptcha = require('express-recaptcha').Recaptcha;
const { validationResult } = require('express-validator/check');

module.exports = class controller {
    constructor() {
        autoBind(this);
        this.recaptchaConfig();
    }

    recaptchaConfig() {
        this.recaptcha = new Recaptcha(
            config.service.recaptcha.clinet_key,
            config.service.recaptcha.secret_key,
            { ...config.service.recaptcha.options }
        );
    }

    recaptchaValidation(req, res) {

        return new Promise((resolve, reject) => {
            if (config.project.mode == "prod") {
                this.recaptcha.verify(req, (err, data) => {
                    if (err) {
                        req.flash('errors', 'گزینه امنیتی مربوط به شناسایی روبات خاموش است، لطفا از فعال بودن آن اطمینان حاصل نمایید و مجدد امتحان کنید');
                        this.back(req, res)
                    } else resolve(true);
                })
            }
            else {
                resolve(true);
            }
        })


    }

    async validationData(req) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const errors = result.array();
            const messages = [];

            errors.forEach(err => messages.push(err.msg));

            req.flash('errors', messages)

            return false;
        }

        return true;
    }

    back(req, res) {
        return res.redirect(req.header('Referer') || '/');
    }

}