const User = require('../models/user');

//Renders register page
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

//Creates new user
module.exports.createNew = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    };
}

//Renders login page
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

//Logs in user
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back');
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//Logs out user
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'logged out succesfully');
    res.redirect('/campgrounds');

    //this is the code for the latest version of passport. Had to downgrade it to evoide a bug around cookies for the 'returnTo' feature when loggin in
    // req.logOut((err) => {
    //     if (err) {
    //         return next(err);
    //     }
    //     req.flash('success', 'logged out succesfully');
    //     res.redirect('/campgrounds');
    // });
}