const express = require('express');
const router = express.Router();

const HomeController = require('app/http/controllers/api/v0.0.1/homeController');
const commentValidator = require('app/http/validators/commentValidator');

router.get('/user', HomeController.user);
router.get('/user/history', HomeController.history);
router.post("/comment", commentValidator.handle(), HomeController.comment);

module.exports = router;