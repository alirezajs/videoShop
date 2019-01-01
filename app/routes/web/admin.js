const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controllers/admin/adminController');


// Admin Routes
router.get('/' , adminController.index);
router.get('/course' , adminController.courses);


module.exports = router;