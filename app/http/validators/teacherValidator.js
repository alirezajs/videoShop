const validator = require('./validator');
const { check } = require('express-validator/check');
const Teacher = require('app/models/teacher');
const path = require('path');

class registerValidator extends validator {

    handle() {
        return [
            check('fullName')
                .isLength({ min: 5 })
                .withMessage('نام و نام خانوادگی نمیتواند کمتر از 5 کاراکتر باشد')
                .custom(async (value, { req }) => {
                    if (req.query._method === 'put') {
                        let teacher = await Teacher.findById(req.params.id);
                        if (teacher.fullName === value) return;

                    }
                    let teacher = await Teacher.findOne({ slug: this.slug(value) });
                    if (teacher) {
                        throw new Error('چنین مدرسی قبلا با این نام در سایت قراد داده شده است')
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

            check('expertise')
                .not().isEmpty()
                .withMessage('فیلد تخصص نمیتواند خالی بماند'),

            check('tags')
                .not().isEmpty()
                .withMessage('فیلد تگ نمیتواند خالی بماند'),
        ]
    }


    slug(title) {
        return title.replace(/([^۰-۹آ-یa-z0-9]|-)+/g, "-")
    }
}

module.exports = new registerValidator();