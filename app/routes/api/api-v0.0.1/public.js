const express = require('express');
const router = express.Router();

// Controllers
const courseController = require('app/http/controllers/api/v0.0.1/courseController');
const categoryController = require('app/http/controllers/api/v0.0.1/categoryController');

const authController = require('app/http/controllers/api/v0.0.1/authController');

//validator 
const loginValidator = require('app/http/validators/loginValidator');
const registerValidator = require('app/http/validators/registerValidator');

router.get('/courses' , courseController.courses);
router.get('/courses/:course' , courseController.singleCourse);
router.get('/courses/:course/comments' , courseController.commentForSingleCourse);

router.get('/categories' , categoryController.categories);

router.post('/user/login' , loginValidator.handle() , authController.login);
router.post('/user/register' , registerValidator.handle() , authController.register);
module.exports = router;