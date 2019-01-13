const validator = require('./validator');
const { check } = require('express-validator/check');

class courseValidator extends validator {

    handle() {
        return [
            check('title')
            .isLength({ min: 8 })
            .withMessage('فیلد عنوان نمیتواند کمتر از 5 کاراکتر باشد'),
            check('type')
                .not().isEmpty()
                .withMessage('فیلد دوره نمیتواند خالی باشد'),
            check('body')
                .isLength({ min: 20 })
                .withMessage('فیلد توضیحات نمیتواند کمتر از 20 کاراکتر باشد'),
            check('price')
            .not().isEmpty()
            .withMessage('فیلد قیمت نمیتواند خالی باشد'),
            check('tags')
            .not().isEmpty()
            .withMessage('فیلد تگ نمیتواند خالی باشد'),
        ]
    }
}

module.exports = new registerValidator();