const express = require('express');
const router = express.Router();

const HomeController = require('app/http/controllers/api/v0.0.1/homeController');


router.get('/user' , HomeController.user);
router.get('/user/history' , HomeController.history);

module.exports = router;