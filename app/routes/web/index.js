const express = require('express');
const router = express.Router();




// Middlewares
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');
const redirectIfNotAdmin = require('app/http/middleware/redirectIfNotAdmin');

// Admin Router
const adminRouter = require('app/routes/web/admin');
router.use('/admin', redirectIfNotAdmin.handle, adminRouter);


// Home Router
const homeRouter = require('app/routes/web/home');
router.use('/', homeRouter);



// Home Router
const authRouter = require('app/routes/web/auth');
router.use('/auth', redirectIfAuthenticated.handle, authRouter);


module.exports = router;