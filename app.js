if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

const passport = require('passport');
const LocalPassport = require('passport-local');
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');

const helmet = require('helmet');


//Connects to mongoDb
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('mongo connection open')
    })
    .catch(() => {
        console.log('mongo connection error')
        console.log(err)
    })

//Express config
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//use express to parse URL data coming from http requests
app.use(express.urlencoded({ extended: true }))
//enables method override in forms, to be able to send PUT and DELETE requests
app.use(methodOverride('_method'));
//tell express we want to use ejs-mate's engine instead of the default one
app.engine('ejs', ejsMate);
//enabling the public directory
app.use(express.static(path.join(__dirname, 'public')))
//express-mongo-sanitize: prevents queries to have prohibited carachters to prevent injection
app.use(mongoSanitize());


//express-session config
const sessionConfig = {
    //changing the default name as a security measure
    name: 'sesh',
    secret: 'secret123456',
    resave: false,
    saveUninitialized: true,
    cookie: {
        //this line prevents attacks to access the session cookie via scripts, as these can only be accessed via HTTP only
        httpOnly: true,
        //uncomment follwong line when in production, so that session only works in HTTPS
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
//calling flash
app.use(flash());

//initialize helmet security package
app.use(helmet({ contentSecurityPolicy: false }));

//initialize passport tool for auth
app.use(passport.initialize());
//enables persistent login sessions (vs users having to login every single time)
app.use(passport.session());
//config passport tool
passport.use(new LocalPassport(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware passing in data to all templates
app.use((req, res, next) => {
    //req.user
    res.locals.currentUser = req.user;
    //flash keys
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//Routes. see folder routes 
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes);

//default response if a request doesn't hit any route
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) message = 'unknown error';
    res.status(statusCode).render('error', { err });
})

//Listening to port 3000
app.listen(3000, () => {
    console.log('listening port 3000')
});