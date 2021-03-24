//**************** imports ****************//
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

//**************** variables ****************//
const app = express();
const port = process.env.Port || 3000;



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





//**************** app listening ****************//
app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`);
});