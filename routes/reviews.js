const express = require('express');
const router= express.Router({mergeParams:true});

const {campgroundSchema, reviewSchema} = require('../schemas.js');

const Campground = require('../models/campground');
const Review = require('../models/review');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateReview = (req,res,next)=>{
    const {error} =reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req,res)=>{
    // the express routers get separate params so we can't access them like that so you need to write: {mergeParams:true} like in line 2
    // console.log(req.params)
    const campground = await Campground.findById(req.params.id);
    // console.log(campground);
     const review = new Review(req.body.review);
     campground.reviews.push(review);
     await review.save();
     await campground.save();
     req.flash('success','Created new review!')
     res.redirect(`/campgrounds/${campground._id}`);
 }))
 
 router.delete('/:reviewId',catchAsync(async(req,res)=>{
     const {id, reviewId} = req.params;
     await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
     await Review.findByIdAndDelete(reviewId);
     req.flash('success','Successfully deleted review')
     res.redirect(`/campgrounds/${id}`);
 }))

 module.exports = router;