const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async(req,res)=>{
    // the express routers get separate params so we can't access them like that so you need to write: {mergeParams:true} like in line 2
    // console.log(req.params)
    const campground = await Campground.findById(req.params.id);
    // console.log(campground);
     const review = new Review(req.body.review);
     review.author = req.user._id
     campground.reviews.push(review);
     await review.save();
     await campground.save();
     req.flash('success','Created new review!')
     res.redirect(`/campgrounds/${campground._id}`);
 }

 module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params;
    //  console.log(req.originalUrl);
     await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
     await Review.findByIdAndDelete(reviewId);
     req.flash('success','Successfully deleted review')
     res.redirect(`/campgrounds/${id}`);
   
 }