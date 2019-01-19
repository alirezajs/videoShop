const User = require('app/models/user');
const middleware = require('./middleware');

module.exports = new class errorHandler {


    async error404(req, res, nextf) {
        try {
            res.statusCode = 404;
            throw new Error('چنین صفحه ای یافت نشد');
        } catch (err) {
            next(err)
        }
    }

    async handler(err, req, res, next) {
        const statusCode = res.statusCode || 500;
        const message = err.message || '';
        const stack = err.stack || '';

        const layouts = {
            layout: 'errors/master',
            extractScripts: false,
            extractStyles: false
        }

        if (config.debug) return res.render('errors/stack', { ...layouts, message, stack });

        return res.render(`errors/${statusCode}`, { ...layouts, message, stack })
    }



}