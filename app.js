//**************** imports ****************//
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campgrounds');

//**************** variables ****************//
const app = express();
const port = process.env.Port || 3000;

//**************** database connection ****************//
mongoose
	.connect('mongodb://localhost:27017/yelp-camp', {
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
// Views folder and EJS setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//**************** app middleware ****************//
//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//**************** app routes ****************//
app.get('/', (req, res) => {
	res.render('home');
	res.statusCode = 200;
	console.log('home request...');
});
app.get('/campgrounds', async (req, res) => {
	const campgrounds = await Campground.find({});
   res.render('campgrounds/index', { campgrounds });
	res.statusCode = 200;
	console.log('campgrounds request...');
});
app.get('/campgrounds/:id', async (req, res) => {
   const { id } =req.params;
	const campground = await Campground.findById(id);
	res.render('campgrounds/show', { campground });
	res.statusCode = 200;
	console.log('campground id request...');
});







//**************** app listening ****************//
app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`);
});