const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/yelp-camp');

// bind() lets you create a new function with its this value set to a provided value
// Because browser implementations require that console.error()’s this value be set to
//  the console object, the call to bind() generates a new function that does just that.
const db=mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

const app = express();

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig={
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
      
        httpOnly: true,     // for extra security (it actually defaults to true)
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate())) //adds the strategy and specifies the authentication method

passport.serializeUser(User.serializeUser()); //serialization is about how we store the user in session
passport.deserializeUser(User.deserializeUser()); //deserialization is about how we get the user out of the session


app.use((req,res,next)=>{
    console.log(req.session);
    if(!['/login','/'].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user; //it'll be available on all the requests and it'll let us get the information if and who is signed in
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// app.get('/fakeUser', async(req,res)=>{
//     const user = new User({email: 'ha@gmail.com', username:'haha'});
//     const newUser = await User.register(user, 'SomePassword');
//     res.send(newUser);
// })


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/',(req,res)=>{
    res.render('home')
})

app.all('*',(req,res,next)=>{
    next( new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500}= err;
    if(!err.message) err.message ='Oh No, Something Went Wrong!';
    res.status(statusCode).render('error',{err})
})

app.listen(3000,()=>{
    console.log('Serving on port 3000')
})