const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('app/http/controllers/homeController');
const courseController = require('app/http/controllers/courseController');
const userController = require('app/http/controllers/userController');


// validators 
const commentValidator = require('app/http/validators/commentValidator');

//Middlewears
const redirectIfNotAuthenticated = require('app/http/middleware/redirectIfNotAuthenticated');

// Home Routes
router.get('/', homeController.index);

router.get('/about-me', homeController.about);
router.get('/courses', courseController.index);
router.get('/courses/:course', courseController.single);
router.get('/download/:episode', courseController.download);
router.post('/courses/payment', courseController.payment);

router.post("/comment", redirectIfNotAuthenticated.handle, commentValidator.handle(), homeController.comment);
router.get('/courses/payment/checker', redirectIfNotAuthenticated.handle, courseController.checker);

router.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});


router.get('/user/panel', userController.index)
router.get('/user/panel/history', userController.history)



module.exports = router;