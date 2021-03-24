//**************** imports ****************//
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

//**************** variables ****************//
const app = express();
const port = process.env.Port || 3000;



//**************** app routes ****************//
app.get('/', (req, res) => {
	res.send(`<h1>yelp-camp-app</h1>`);
	res.statusCode = 200;
	console.log('yelp-camp-app request...');
});





//**************** app listening ****************//
app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`);
});