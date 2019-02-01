const express = require('express');
const router = express.Router();

// Controllers
const courseController = require('app/http/controllers/api/v0.0.1/courseController');

router.get('/courses' , courseController.courses);
router.get('/courses/:course' , courseController.singleCourse);
router.get('/courses/:course/comments' , courseController.commentForSingleCourse);

module.exports = router;