const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createNew = async (req, res) => {
    const foundCamp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    foundCamp.reviews.push(review);
    review.save();
    foundCamp.save();
    req.flash('success', 'Succesfully created new review!');
    res.redirect(`/campgrounds/${foundCamp._id}`)
}
module.exports.delete = async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, { pull: { reviews: req.params.reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Succesfully deleted review');
    res.redirect(`/campgrounds/${req.params.id}`);
}