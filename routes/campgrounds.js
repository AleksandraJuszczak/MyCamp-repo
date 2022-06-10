const express = require('express');
const router = express.Router({mergeParams:true});
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')
const multer  = require('multer');
const {storage} = require('../cloudinary');  //Node automatically looks for index.js so we don't need to write /index
const upload = multer({ storage });

const Campground = require('../models/campground');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(
        isLoggedIn, 
        upload.array('image'),
        validateCampground, 
        catchAsync(campgrounds.createCampground))
    


router.get('/new',
    isLoggedIn, 
    campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(
        isLoggedIn, 
        isAuthor, 
        upload.array('image'),
        validateCampground, 
        catchAsync(campgrounds.updateCampground))
    .delete(
        isLoggedIn, 
        isAuthor, 
        catchAsync(campgrounds.deleteCampground))



router.get('/:id/edit', 
    isLoggedIn, 
    isAuthor, 
    catchAsync(campgrounds.renderEditForm));


module.exports = router;