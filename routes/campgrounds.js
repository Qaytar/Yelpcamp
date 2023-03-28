const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isCampAuthor, campgroundValidate } = require('../utils/middleware');

const controllerCamp = require('../controllers/campgrounds');
//cloudinary
const { storage } = require('../cloudinary/index');
//multer
const multer = require('multer');
const upload = multer({ storage });



router.route('/')
    //Renders index page to show all camps
    .get(catchAsync(controllerCamp.renderIndex))
    //Creates a new camp (using data from NewForm)
    .post(isLoggedIn, upload.array('image'), campgroundValidate, catchAsync(controllerCamp.createNew));



//Renders form page to create new camp
router.get('/new', isLoggedIn, controllerCamp.renderNewForm);

//Renders form page to edit a camp 
router.get('/:id/edit', isLoggedIn, isCampAuthor, catchAsync(controllerCamp.renderEditForm));

router.route('/:id')
    //Renders show page of a camp
    .get(catchAsync(controllerCamp.renderShow))
    //Edits a camp (using data from EditForm)
    .put(isLoggedIn, isCampAuthor, upload.array('image'), campgroundValidate, catchAsync(controllerCamp.edit))
    //Deletes a camp
    .delete(isLoggedIn, isCampAuthor, catchAsync(controllerCamp.delete));






module.exports = router;