//**************** imports ****************//
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { campgroundSchema, reviewSchema } = require('./schemas');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

//**************** variables ****************//
const app = express();
const port = process.env.Port || 3000;
const sessionConfig = {
	secret: 'thisshouldbeabettersecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};

//**************** database connection ****************//
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
//**************** app routes ****************//
app.get('/', (req, res) => {
	res.render('home');
	res.statusCode = 200;
});
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
