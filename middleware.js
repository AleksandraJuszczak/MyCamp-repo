module.exports.isLoggedIn = (req,res,next) =>{
    // console.log("REQ.USER:   ",req.user);
    if(!req.isAuthenticated()){
        // console.log(req.path, req.originalUrl) //the originalUrl will include the route (e.g. /camgrounds/new),and path won't (/new)
        // returnTo allows us to save the end of the URL
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login')
    }
    next();
}