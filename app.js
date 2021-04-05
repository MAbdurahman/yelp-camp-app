//**************** imports ****************//
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Campground = require('./models/campgrounds');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

//**************** variables ****************//
const app = express();
const port = process.env.Port || 3000;

//**************** database connection ****************//
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('mongodb connected with mongoose...');
});
//**************** app configurations ****************//
// Views folder and EJS
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//**************** app middleware ****************//
//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
//**************** app helper functions ****************//
const validateCampground = (req, res, next) => {

	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);

	} else {
		next();
	}
}

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}

}
//**************** app routes ****************//
app.get('/', (req, res) => {
	res.render('home');
	res.statusCode = 200;

});

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res) => {
	const campground = await Campground.findById(req.params.id);
	const review = new Review(req.body.review);
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
	
}));
app.delete(
	'/campgrounds/:id/reviews/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
		await Review.findByIdAndDelete(reviewId);
		res.redirect(`/campgrounds/${id}`);
	})
);
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) {
		err.message = 'A Malfunction Error Occurred!';
	}
	res.status(statusCode).render('error', {err});
});
//**************** app listening ****************//
app.listen(port, () => {
	console.log(`app listening at - http://localhost:${port}`);
});
