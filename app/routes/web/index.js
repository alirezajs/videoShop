const express = require('express');
const router = express.Router();




// Middlewares
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');
const redirectIfNotAdmin = require('app/http/middleware/redirectIfNotAdmin');
const errorHandler = require('app/http/middleware/errorHandler');
const i18n = require("i18n");

router.use((req, res ,next) => {
    try {
        let lang = req.signedCookies.lang;
        if(i18n.getLocales().includes(lang)) 
            req.setLocale(lang)
        else 
            req.setLocale(i18n.getLocale());
        next();
    } catch (err) {
        next(err);
    }
})

router.get('/lang/:lang' , (req, res) => {
    let lang = req.params.lang;
    if(i18n.getLocales().includes(lang))
        res.cookie('lang' , lang , { maxAge : 1000 * 60  * 60 * 24 * 90 , signed : true})
        
    res.redirect(req.header('Referer') || '/');
})

// Admin Router
const adminRouter = require('app/routes/web/admin');
router.use('/admin', redirectIfNotAdmin.handle, adminRouter);


// Home Router
const homeRouter = require('app/routes/web/home');
router.use('/', homeRouter);



// Home Router
const authRouter = require('app/routes/web/auth');
router.use('/auth', redirectIfAuthenticated.handle, authRouter);

//Handle Error
router.all('*', errorHandler.error404);
router.use(errorHandler.handler);

module.exports = router;