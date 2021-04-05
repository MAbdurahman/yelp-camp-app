//**************** imports ****************//
const express = require('express');
const Campground = require('../models/campgrounds');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

//**************** variables ****************//
const router = express.Router({mergeParams: true});





//**************** app helper functions ****************//
const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

//**************** reviews routes ****************//
router.post(
	'/',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = new Review(req.body.review);
		campground.reviews.push(review);
		await review.save();
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
	})
);
router.delete(
	'/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		res.redirect(`/campgrounds/${id}`);
	})
);



module.exports = router;