const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require('../utils/catchAsync');
const { reviewValidate, isLoggedIn, isReviewAuthor } = require('../utils/middleware');

const controllerReview = require('../controllers/reviews');

//Creates a new review
router.post('/', isLoggedIn, reviewValidate, catchAsync(controllerReview.createNew));

//Deletes a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(controllerReview.delete));

module.exports = router;