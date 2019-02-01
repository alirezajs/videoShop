const express = require('express');
const router = express.Router();

// Controllers
const courseController = require('app/http/controllers/api/v0.0.1/courseController');
const authController = require('app/http/controllers/api/v0.0.1/authController');

//validator 
const loginValidator = require('app/http/validators/loginValidator');

router.get('/courses' , courseController.courses);
router.get('/courses/:course' , courseController.singleCourse);
router.get('/courses/:course/comments' , courseController.commentForSingleCourse);



router.post('/login' , loginValidator.handle() , authController.login);

module.exports = router;