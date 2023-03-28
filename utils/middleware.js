const { reviewJoiSchema, campgroundJoiSchema } = require('./joiSchemas');
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('./ExpressError');

//middleware to check user authentication
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in');
        return res.redirect('/login')
    };
    next();
}

//Campgrounds - middleware to validate on serverside that the forms comply with the schema. Uses Joi
module.exports.campgroundValidate = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//Campgrounds - middleware that checks if the author of the campground matches with the user attempting the action
module.exports.isCampAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp.author.equals(req.user.id)) {
        req.flash('error', "you don't have permissions to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//Reviews - middleware to validate on serverside that the forms comply with the schema. Uses Joi
module.exports.reviewValidate = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//Reviews - middleware that checks if the author of the review matches with the user attempting the action
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user.id)) {
        req.flash('error', "you don't have permissions to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
