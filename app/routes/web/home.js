const express = require('express');
const router = express.Router();

// Controllers
const homeController = require('app/http/controllers/homeController');
const courseController = require('app/http/controllers/courseController');



// Home Routes
router.get('/', homeController.index);

router.get('/about-me', homeController.about);
router.get('/courses', courseController.index);
router.get('/courses/:course', courseController.single);


router.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('remember_token');
    res.redirect('/');
});




module.exports = router;