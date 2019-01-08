const express = require('express');
const router = express.Router();

// Admin Router
const adminRouter = require('app/routes/web/admin');
router.use('/admin', adminRouter);

// Home Router
const homeRouter = require('app/routes/web/home');
router.use('/', homeRouter);


// Middlewares
const redirectIfAuthenticated = require('app/http/middleware/redirectIfAuthenticated');

// Home Router
const authRouter = require('app/routes/web/auth');
router.use('/auth', redirectIfAuthenticated.handle, authRouter);


module.exports = router;