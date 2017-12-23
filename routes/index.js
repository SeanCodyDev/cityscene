// ----- REQUIRE EXPRESS -----
var express = require('express');
var router = express.Router();

// ----- YELP LIBRARY AND AUTHENTICATION -----
let clientId = "UOBAEUmUOVAEQxP4LskuZg";
let clientSecret = "ZNesuC7oiYsEI2B5newNlH6GLiqvEMvm5J0wZD2VDbvLBmUjzuWHH3EWfPV8O5kT";
let clientToken = "Y1Mxz-Uxsiib0t4sEi45_7M3Gciauu-QmJFSfSnzL6KwRmwkaWtM1oF7q5K2Zvymt5rPTonkDNZphoD9OFdHT5HVEc1FaOCM-b3YRXc7Ht3fW5ONb0GqBdcaPH0xWnYx";
const yelp = require('yelp-fusion');
const client = yelp.client(clientToken);

// ----- TWITTER LIBRARY AND AUTHENTICATION -----
var Twitter = require('twitter');
var clientTwitter = new Twitter({
  consumer_key: 'tTZIiRLPCuQuy31QRoOAzDgze',
  consumer_secret: 'GIEmXCIAvt5lWMkGTxqBSOiTNa6Bajdnj4Nkhg6ceqjeU9SIS6',
  access_token_key: '218720772-Q9e5eOWgeqSDVzI4DXPQLGcXLUuFEhf1W6sOFSuT',
  access_token_secret: 'rp0xYbJ18FgGpDs4SCl0PQKyFPYnxgIHvn4zIwRVuDjW9'
});

// ----- BING LIBRARY AND AUTHENTICATION -----
var Bing = require('node-bing-api')({ accKey: "your-account-key" });
// Need BING account key - is this actually required? May need a stack overflow question


/* GET home page. */
// IS THIS EVEN RELEVANT FOR ANYTHING?
router.get('/', function(req, res, next) {
	client.search({
		term:'coffee',
		location: 'indianapolis, in'
	}).then(response => {
  		res.render('index', { title: 'Sean', place: response.jsonBody.businesses });
	});
});




// ----- YELP PLACES ROUTER -----
router.post('/searchYelpPlaces', function(req, res, next) {

	// console.log(req.body);
	// console.log(req.body.search);
	console.log('hello from YelpPlaces Router');

	client.search({
		term: req.body.search,
		location: req.body.location
	}).then(response => {
		let yelpResponse = response.jsonBody.businesses;
		console.log(typeof yelpResponse);
		//QUESTION: what does this line specifically do???
		res.json(yelpResponse);
	});
});




// ----- YELP EVENTS ROUTER -----
// in progress - this is currently using the yelp search API, although the events API is preferred; the events API is
// not part of the tonybadguy yelp-fusion library
// url: 'https://api.yelp.com/v3/events'
router.post('/searchYelpEvents', function(req, res, next) {

	console.log('hello from YelpEvents Router');
	console.log(req.body.location);

	client.search({
		term: req.body.search,
		location: req.body.location
	}).then(response => {
		let yelpResponse = response.jsonBody.businesses;
		console.log(yelpResponse);
		res.json(yelpResponse);
	});
});


// ----- TWITTER ROUTER -----
router.post('/searchTwitter', function(req, res, next) {

	console.log('hello from Twitter Router');
	// console.log(req.body);

  	clientTwitter.get(`https://api.twitter.com/1.1/search/tweets.json?q=%23${req.body.search}&result_type=${req.body.result_type}`, function(error, tweets, response) {
  		if(error) throw error;
	  	// console.log(tweets);  // The results. 
	  	// console.log(response);  // Raw response object. 
		res.json(tweets);
	});
});





yelp.accessToken(clientId, clientSecret).then(response => {

  client.search({
    term:'coffee',
    location: 'indianapolis, in'
  }).then(response => {
    // console.log(response.jsonBody.businesses);
  });
}).catch(e => {
  console.log(e);
});

module.exports = router;

