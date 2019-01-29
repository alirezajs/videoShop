const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('app/http/controllers/admin/adminController');
const courseController = require('app/http/controllers/admin/courseController');
const episodeController = require('app/http/controllers/admin/episodeController');
const commentController = require('app/http/controllers/admin/commentController');
const categoryController = require('app/http/controllers/admin/categoryController');
const userController = require('app/http/controllers/admin/userController');
const permissionController = require('app/http/controllers/admin/permissionController');
const roleController = require('app/http/controllers/admin/roleController');

// validators 
const courseValidator = require('app/http/validators/courseValidator');
const episodeValidator = require('app/http/validators/episodeValidator');
const categoryValidator = require('app/http/validators/categoryValidator');
const registerValidator = require('app/http/validators/registerValidator');
const permissionValidator = require('app/http/validators/permissionValidator');
const roleValidator = require('app/http/validators/roleValidator');

// Helpers
const upload = require('app/helpers/uploadImage');
const gate = require('app/helpers/gate');

// Middlewares
const convertFileToField = require('app/http/middleware/convertFileToField')

router.use((req , res , next) => {
    res.locals.layout = "admin/master";
    next();
})

// Admin Routes
router.get('/' , adminController.index);

// Course Routes
router.get('/courses' , gate.can('show-courses') , courseController.index);
router.get('/courses/create' , courseController.create);
router.post('/courses/create' ,
    upload.single('images') ,
    convertFileToField.handle ,
    courseValidator.handle() ,
    courseController.store
);
router.get('/courses/:id/edit' , courseController.edit);
router.put('/courses/:id' ,
    upload.single('images') ,
    convertFileToField.handle ,
    courseValidator.handle() ,    
    courseController.update
);
router.delete('/courses/:id' , courseController.destroy);


router.get('/users' , userController.index);
router.get('/users/create' , userController.create);
router.post('/users' , registerValidator.handle() , userController.store);
router.delete('/users/:id' , userController.destroy);
router.get('/users/:id/toggleadmin' , userController.toggleadmin);
router.get('/users/:id/addrole' , userController.addrole);
router.put('/users/:id/addrole' , userController.storeRoleForUser);

// Permission Routes
router.get('/users/permissions' , permissionController.index);
router.get('/users/permissions/create' , permissionController.create);
router.post('/users/permissions/create' , permissionValidator.handle() , permissionController.store );
router.get('/users/permissions/:id/edit' , permissionController.edit);
router.put('/users/permissions/:id' , permissionValidator.handle() , permissionController.update );
router.delete('/users/permissions/:id' , permissionController.destroy);

// Role Routes
router.get('/users/roles' , roleController.index);
router.get('/users/roles/create' , roleController.create);
router.post('/users/roles/create' , roleValidator.handle() , roleController.store );
router.get('/users/roles/:id/edit' , roleController.edit);
router.put('/users/roles/:id' , roleValidator.handle() , roleController.update );
router.delete('/users/roles/:id' , roleController.destroy);



// Episode Routes
router.get('/episodes' , episodeController.index);
router.get('/episodes/create' , episodeController.create);
router.post('/episodes/create' , episodeValidator.handle() , episodeController.store );
router.get('/episodes/:id/edit' , episodeController.edit);
router.put('/episodes/:id' , episodeValidator.handle() , episodeController.update );
router.delete('/episodes/:id' , episodeController.destroy);

// Category Routes
router.get('/categories' , categoryController.index);
router.get('/categories/create' , categoryController.create);
router.post('/categories/create' , categoryValidator.handle() , categoryController.store );
router.get('/categories/:id/edit' , categoryController.edit);
router.put('/categories/:id' , categoryValidator.handle() , categoryController.update );
router.delete('/categories/:id' , categoryController.destroy);

router.get('/comments/approved' , gate.can('show-approved-comments') , commentController.approved);
router.get('/comments' , gate.can('show-comments') , commentController.index);
router.put('/comments/:id/approved' , commentController.update );
router.delete('/comments/:id' , commentController.destroy);

router.post('/upload-image' , upload.single('upload') , adminController.uploadImage);
module.exports = router;