const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('app/http/controllers/homeController');
const courseController = require('app/http/controllers/courseController');


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

router.post("/comment", redirectIfNotAuthenticated.handle, commentValidator.handle(), homeController.comment);



router.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});




module.exports = router;