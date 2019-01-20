const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controllers/admin/adminController');
const courseController = require('app/http/controllers/admin/courseController');
const episodesController = require('app/http/controllers/admin/episodesController');

// validators 
const courseValidator = require('app/http/validators/courseValidator');
const episodesValidator=require('app/http/validators/episodesValidator');

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

//Courses Routes
router.get('/courses', courseController.index);
router.get('/courses/create', courseController.create);
router.post('/courses/create',
    upload.single('images'),
    convertFileToField.handle,
    courseValidator.handle(),
    courseController.store
);
router.get('/courses/:id/edit', courseController.edit);
router.put('/courses/:id',
    upload.single('images'),
    convertFileToField.handle,
    courseValidator.handle(),
    courseController.update
);

//Episode Routes
router.get('/episodes', episodesController.index);
router.get('/episodes/create', episodesController.create);
router.post('/episodes/create',
    episodesValidator.handle(),
    episodesController.store
);
router.get('/episodes/:id/edit', episodesController.edit);
router.put('/episodes/:id',
    episodesValidator.handle(),
    episodesController.update
);
router.delete('/episodes/:id', episodesController.destroy)

module.exports = router;