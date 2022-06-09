const {campgroundSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        // console.log(req.path, req.originalUrl) //the originalUrl will include the route (e.g. /camgrounds/new),and path won't (/new)
        // returnTo allows us to save the end of the URL;
        // req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login')
    }
    next();
}
module.exports.isLoggedInDelete = (req,res,next) =>{
    // console.log("REQ.USER:   ",req.user);
    const {id} = req.params;
    req.session.returnTo = `/campgrounds/${id}`
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login')
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{
    // console.log(req.body)
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=> el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


module.exports.isAuthor = async (req,res,next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) =>{
    try{
        const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        // if(req.originalUrl.includes('_method=DELETE')){
            // req.session.returnTo = `/campgrounds/${id}`;
        // }
        req.flash('error','You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}catch(e){
    console.log(e,'ERROR IN MODULE isReviewAuthor')
}
}

module.exports.validateReview = (req,res,next)=>{
    const {error} =reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(',');
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}