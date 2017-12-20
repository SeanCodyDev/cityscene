// accessing the 'express' library/module and assigning it to a variable called express
// assigning a new variable called router to the Router() method in the express library
var express = require('express');
var router = express.Router();
let clientId = "UOBAEUmUOVAEQxP4LskuZg";
let clientSecret = "ZNesuC7oiYsEI2B5newNlH6GLiqvEMvm5J0wZD2VDbvLBmUjzuWHH3EWfPV8O5kT";
let clientToken = "Y1Mxz-Uxsiib0t4sEi45_7M3Gciauu-QmJFSfSnzL6KwRmwkaWtM1oF7q5K2Zvymt5rPTonkDNZphoD9OFdHT5HVEc1FaOCM-b3YRXc7Ht3fW5ONb0GqBdcaPH0xWnYx";
//accessed the 'yelp-fusion' library (kinda mysterious) and provides the client token
const yelp = require('yelp-fusion');
//is this a circular reference since there are two references to 'client'?
const client = yelp.client(clientToken);



/* GET home page. */

// invokes the client search method in 'yelp-fusion' THEN renders a results
// how are these different params used???
// how is the render method working???
router.get('/', function(req, res, next) {
	client.search({
		term:'coffee',
		location: 'indianapolis, in'
	}).then(response => {
		// console.log(response.jsonBody.businesses);
  		res.render('index', { title: 'Sean', place: response.jsonBody.businesses });




	});


});

//Yelp router
router.post('/search', function(req, res, next) {

	console.log(req.body);
	console.log(req.body.search);

	console.log('hello from client');
	client.search({
		term: req.body.search,
		location: req.body.location
		// location: 'indianapolis, in'
	}).then(response => {
		console.log(response.jsonBody.businesses);
  		// res.render('index', { title: 'Sean', color: 'blue', place: response.jsonBody.businesses }); 

  		let yelpResponse = response.jsonBody.businesses;
  		clientTwitter.get(`https://api.twitter.com/1.1/search/tweets.json?q=%23${req.body.search}`, function(error, tweets, response) {
  			if(error) throw error;
	  console.log(tweets);  // The results. 
	  // console.log(response);  // Raw response object. 

		// res.json(response.jsonBody.businesses);
		console.log(typeof yelpResponse);
		res.json({'yelp': yelpResponse, 'twitter': tweets});

});
	});

	}
);



var Twitter = require('twitter');

var clientTwitter = new Twitter({
  consumer_key: 'tTZIiRLPCuQuy31QRoOAzDgze',
  consumer_secret: 'GIEmXCIAvt5lWMkGTxqBSOiTNa6Bajdnj4Nkhg6ceqjeU9SIS6',
  access_token_key: '218720772-Q9e5eOWgeqSDVzI4DXPQLGcXLUuFEhf1W6sOFSuT',
  access_token_secret: 'rp0xYbJ18FgGpDs4SCl0PQKyFPYnxgIHvn4zIwRVuDjW9'
});


//replace indianapolis with searchword
router.get('/silly', function(req, res, next) {
	console.log('silly');
	clientTwitter.get('https://api.twitter.com/1.1/search/tweets.json?q=%23indianapolis', function(error, tweets, response) {
	  if(error) throw error;
	  console.log(tweets);  // The favorites. 
	  // console.log(response);  // Raw response object. 
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

