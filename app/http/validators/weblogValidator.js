const validator = require('./validator');
const { check } = require('express-validator/check');
const Weblog = require('app/models/weblog');
const path = require('path');
class courseValidator extends validator {

    handle() {
        return [
            check('title')
                .isLength({ min: 5 })
                .withMessage('عنوان نمیتواند کمتر از 5 کاراکتر باشد')
                .custom(async (value, { req }) => {
                    if (req.query._method === 'put') {
                        let weblog = await Weblog.findById(req.params.id);
                        if (weblog.title === value) return;

                    }
                    let weblog = await Weblog.findOne({ slug: this.slug(value) });
                    if (weblog) {
                        throw new Error('چنین  پستی با همین عنوان قبلا در سایت قرار داد شده است')
                    }
                }),

            check('images')
                .custom(async (value, { req }) => {

                    if (req.query._method === 'put' && value === undefined)
                        return;

                    if (!value)
                        throw new Error('وارد کردن تصویر الزامی است');
                    let fileExt = ['.png', '.jpg', '.jpeg', '.svg'];
                    if (!fileExt.includes(path.extname(value).toLowerCase()))
                        throw new Error('پسوند فایل وارد شده از پسوند های تصاویر نیست')
                }),
         
            check('body')
                .isLength({ min: 20 })
                .withMessage('متن دوره نمیتواند کمتر از 20 کاراکتر باشد'),


            check('tags')
                .not().isEmpty()
                .withMessage('فیلد تگ نمیتواند خالی بماند'),
        ]
    }


    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }
}

module.exports = new courseValidator();