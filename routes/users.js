const express = require('express');
const router = express.Router({ mergeParams: true });

const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

const controllerUser = require('../controllers/users');

router.route('/register')
    //Renders register page
    .get(controllerUser.renderRegister)
    //Creates a new user
    .post(catchAsync(controllerUser.createNew));


router.route('/login')
    //Renders login page
    .get(controllerUser.renderLogin)
    //Logs in user
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), controllerUser.login);

//Logs out user
router.get('/logout', controllerUser.logout);

module.exports = router;