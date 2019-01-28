const validator = require('./validator');
const { check } = require('express-validator/check');
const Permission = require('app/models/permission');

class permissionValidator extends validator {

    handle() {
        return [
            check('name')
                .isLength({ min: 3 })
                .withMessage('عنوان نمیتواند کمتر از 3 کاراکتر باشد')
                .custom(async (value, { req }) => {
                    if (req.query._method === 'put') {
                        let permission = await Permission.findById(req.params.id);
                        if (permission.name === value) return;
                    }

                    let permission = await Permission.findOne({ name: value });
                    if (permission) {
                        throw new Error('چنین دسته ای با این عنوان قبلا در سایت قرار داد شده است')
                    }
                }),

            check('label')
                .not().isEmpty()
                .withMessage('فیلد توضیح نمی تواند خالی باشد')
        ]
    }
   
}

module.exports = new permissionValidator();