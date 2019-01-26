const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controllers/admin/adminController');
const courseController = require('app/http/controllers/admin/courseController');
const episodeController = require('app/http/controllers/admin/episodeController');
const commentController = require('app/http/controllers/admin/commentController');
const categoryController = require('app/http/controllers/admin/categoryController');

// validators 
const courseValidator = require('app/http/validators/courseValidator');
const episodesValidator = require('app/http/validators/episodesValidator');
const categoryValidator = require('app/http/validators/categoryValidator');

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
router.get('/episodes', episodeController.index);
router.get('/episodes/create', episodeController.create);
router.post('/episodes/create',
    episodesValidator.handle(),
    episodeController.store
);
router.get('/episodes/:id/edit', episodeController.edit);
router.put('/episodes/:id',
    episodesValidator.handle(),
    episodeController.update
);
router.delete('/episodes/:id', episodeController.destroy)

// Category Routes
router.get('/categories', categoryController.index);
router.get('/categories/create', categoryController.create);
router.post('/categories/create', categoryValidator.handle(), categoryController.store);
router.get('/categories/:id/edit', categoryController.edit);
router.put('/categories/:id', categoryValidator.handle(), categoryController.update);
router.delete('/categories/:id', categoryController.destroy);


//CommentSCategory
router.get('/comments/approved', commentController.approved);
router.get('/comments', commentController.index);
router.put('/comments/:id/approved', commentController.update);
router.delete('/comments/:id', commentController.destroy);

router.post("/upload-image",
    upload.single('upload'),
    adminController.uploadImage)
module.exports = router;