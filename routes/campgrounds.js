//**************** imports ****************//
const express = require('express');
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campgrounds');
//**************** variables ****************//
const router = express.Router();

//**************** helper functions ****************//
const validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
//**************** campgrounds routes ****************//
router.get(
	'/',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
		res.statusCode = 200;
	})
);
router.get('/new', (req, res) => {
	res.render('campgrounds/new');
	res.statusCode = 200;
});
router.post(
	'/',
	validateCampground,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		req.flash('success', 'New Campground successfully made!');
		res.redirect(`/campgrounds/${campground._id}`);
		res.statusCode = 308;
	})
);
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id).populate('reviews');
		if (!campground) {
			req.flash('error', 'Cannot find that campground!');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/show', { campground });
		res.statusCode = 200;
	})
);
router.get(
	'/:id/edit',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		if (!campground) {
			req.flash('error', 'Cannot find that campground!');
			return res.redirect('/campgrounds');
		}
		res.render('campgrounds/edit', { campground });
		res.statusCode = 200;
	})
);
router.put(
	'/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const editedCampground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		req.flash('success', 'Campground successfully updated!');
		res.redirect(`/campgrounds/${editedCampground._id}`);
		res.statusCode = 308;
	})
);
router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		req.flash('success', 'Successfully deleted campground');
		res.redirect('/campgrounds');
		res.statusCode = 308;
	})
);

module.exports = router;
