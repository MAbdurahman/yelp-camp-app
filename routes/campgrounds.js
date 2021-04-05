//**************** imports ****************//
const express = require('express');
//**************** variables ****************//
const r = express.Router();

//**************** campgrounds routes ****************//
router.get(
	'/campgrounds',
	catchAsync(async (req, res) => {
		const campgrounds = await Campground.find({});
		res.render('campgrounds/index', { campgrounds });
		res.statusCode = 200;
	})
);
router.get('/campgrounds/new', (req, res) => {
	res.render('campgrounds/new');
	res.statusCode = 200;
});
router.post(
	'/campgrounds',
	validateCampground,
	catchAsync(async (req, res, next) => {
		const campground = new Campground(req.body.campground);
		await campground.save();
		res.redirect(`/campgrounds/${campground._id}`);
		res.statusCode = 308;
	})
);
router.get(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id).populate('reviews');
		res.render('campgrounds/show', { campground });
		res.statusCode = 200;
	})
);
router.get(
	'/campgrounds/:id/edit',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const campground = await Campground.findById(id);
		res.render('campgrounds/edit', { campground });
		res.statusCode = 200;
	})
);
router.put(
	'/campgrounds/:id',
	validateCampground,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const editedCampground = await Campground.findByIdAndUpdate(id, {
			...req.body.campground,
		});
		res.redirect(`/campgrounds/${editedCampground._id}`);
		res.statusCode = 308;
	})
);
router.delete(
	'/campgrounds/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Campground.findByIdAndDelete(id);
		res.redirect('/campgrounds');
		res.statusCode = 308;
	})
);
