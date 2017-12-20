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
  		res.json(response.jsonBody.businesses);



	});

	}
);











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

