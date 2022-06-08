const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');

router.get('/register', (req,res)=>{
    res.render('users/register')
})

router.post('/register', catchAsync(async(req,res)=>{
    try{
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err=>{
        if(err) return next(err);
         // console.log(registeredUser);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('campgrounds');
    });
   
    } catch(e){
        req.flash('error', e.message)
        res.redirect('register')
    }
}));

router.get('/login', (req,res)=>{
    res.render('users/login');
});

router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect: '/login', failureMessage: true, keepSessionInfo: true}), (req,res)=>{
    req.flash('success', 'Welcome Back!');
    // console.log(`SESSION:      `, req.session);
    // if (req.session.returnTo === '/xxx') {
       
    //     res.redirect('/campgrounds') 
    // } else{
    //     const redirectUrl = req.session.returnTo;
    //     delete req.session.returnTo;
    //     res.redirect(redirectUrl)
    // };
    
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

router.get('/logout', (req,res)=>{
    // Since version 0.6.0 of Passport, req.logout is asynchronous . 
    // Upgrading to 0.6.0 will require applications to pass a callback to req#logout.
    req.logout((err)=>{
        if(err) return next(err);
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds')
    });
})

module.exports = router;