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



// ----- BING WEB SEARCH -----

'use strict';

let https = require('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
let subscriptionKey = '8c907728d7074a3aa9166441a36eabf2';

// Verify the endpoint URI.  At this writing, only one endpoint is used for Bing
// search APIs.  In the future, regional endpoints may be available.  If you
// encounter unexpected authorization errors, double-check this host against
// the endpoint for your Bing Web search instance in your Azure dashboard.
let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/news/search';

let term = 'indianapolis';

let response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        console.log('\nRelevant Headers:\n');
        for (var header in response.headers)
            // header keys are lower-cased by Node.js
            if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                 console.log(header + ": " + response.headers[header]);
        body = JSON.stringify(JSON.parse(body), null, '  ');
        console.log('\nJSON Response:\n');
        console.log(body);
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

let bing_web_search = function (search) {
  console.log('Searching the Web for: ' + term);
  let request_params = {
        method : 'GET',
        hostname : host,
        path : path + '?q=' + encodeURIComponent(search),
        headers : {
            'Ocp-Apim-Subscription-Key' : subscriptionKey,
        }
    };

    let req = https.request(request_params, response_handler);
    req.end();
}

if (subscriptionKey.length === 32) {
    bing_web_search(term);
} else {
    console.log('Invalid Bing Search API subscription key!');
    console.log('Please paste yours into the source code.');
}



// ----- -----



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

