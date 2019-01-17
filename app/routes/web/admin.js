const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controllers/admin/adminController');
const courseController = require('app/http/controllers/admin/courseController');

// validators 
const courseValidator = require('app/http/validators/courseValidator');

//Middlewears
const convertFileToField = require('app/http/middleware/convertFileToField')

//helpers
const upload = require('app/helpers/uploadImage')

router.use((req, res, next) => {
    res.locals.layout = "admin/master";
    next();
})

// Admin Routes
router.get('/', adminController.index);
router.get('/courses', courseController.index);
router.get('/courses/create', courseController.create);
router.post('/courses/create', upload.single('images'), convertFileToField.handle, courseValidator.handle(), courseController.store);
router.delete('/courses/:id', courseController.destroy)

module.exports = router;