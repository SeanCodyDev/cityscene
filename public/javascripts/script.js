//----- NEXT STEPS -----
//2) Render Bing Results
// Modify Twitter branch to modify city text to remove spaces, characters, and state code (e.g. 'New York, NY' >> newyork), or just use the yelp path
// cityYelpEvents should take in the CITIES['path'] and use the Yelp events API
// SEARCH_CITY should point to an index in the CITIES array, not just the text from the button
//3) STYLE!!! 
//https://www.npmjs.com/package/node-bing-api


let SEARCH_CITY = "";
let CITIES = [
	{city: "New York, NY", path: "nyc"},
	{city: "Chicago, IL", path: "chicago"},
	{city: "Boston, MA", path: "boston"},
	{city: "Miami, FL", path: "miami"},
	{city: "Nashville, TN", path: "nashville"},




];

//function that takes in a city search term and assigns it so a global variable SEARCH_TERM
// Ideally, this takes in a search term and somehow validates it before assigning it to SEARCH_CITY
// As for creating an MVP, it may be simpler to create hard-coded button options for popular US destinations (e.g. New York, NY; Nashville, TN, etc.)
// function takeSearchTerm(){
// 	console.log('takeSearchTerm ran');
// 	SEARCH_CITY = $(this).attr("value");
// 	// $('#js-query').val("");
// 	console.log(`SEARCH_CITY is ${SEARCH_CITY}`);

// };

//function that handles the click of the Submit button
function handleSubmitClick(){
	$('.js-search-form').on('click','.js-city-button', e => {

		console.log('handleSubmitClick ran');
		e.preventDefault();
		e.stopPropagation();
		SEARCH_CITY = $(e.currentTarget).text();
		console.log(`SEARCH_CITY is ${SEARCH_CITY}`);
		// takeSearchTerm();
		cityYelpPlaces();
		cityYelpEvents();
		cityTwitterResults();

		});
};


//function that returns search results for city for coffee, bars, restaurants, and things to do
//Known Issues: None
function cityYelpPlaces(){
	console.log('cityYelpPlaces ran');
	$('.js-yelp-results').html(``);
	let searchTerms = ['coffee', 'restaurants', 'nightlife', 'things to do'];
	let resultsToRender = ``;
	for (let i=0; i<searchTerms.length; i++){
		$.ajax({
            url: "/searchYelpPlaces",
            type: 'POST',
            data: {
            	search: searchTerms[i],
            	location: SEARCH_CITY
            },
            success: function(res) {
                // console.log(res);
            	renderYelpPlacesHtml(res, searchTerms[i]);

            }
        });

	}
};

//function that returns event results for city
//this uses a different API endpoint than the search API
//currently hardcoded to test "indianapolis-in-us"
//Known Issues: currently not working... see routes/index.js
function cityYelpEvents(){
	console.log('cityYelpEvents ran');
	$('.js-yelp-events').html(``);
	let resultsToRender = ``;
	$.ajax({
		url: "/searchYelpEvents",
		type: 'POST',
		data: {
			search: "events",
			location: SEARCH_CITY
		},
		success: function(res) {
                console.log(res);
                renderYelpEventsHtml(res);

            }
        });

};

// HOW do we display these results in the typical Twitter styling, including anchor links to handles and hashtags???
// Tweet HTML/CSS: https://codepen.io/jsweetie/pen/dXLyYG, 
//If there is a space in the city name (e.g. New York), the space needs to be removed - this can be addressed with hard-coded button search options
function cityTwitterResults(){
	console.log('cityTwitterResults ran');
	$('.js-twitter-results').html(``);
	let resultsToRender = ``;
	let searchTerm=`#${SEARCH_CITY}`;
	$.ajax({
            url: "/searchTwitter",
            type: 'POST',
            data: {
            	search: SEARCH_CITY,
            	result_type: "popular"
            },
            success: function(res) {
            	console.log(res);
            	renderTwitterHtml(res, searchTerm);
            }
        });

}

//function to structure and render HTML for YelpPlaces results
//TO-DO: modify terms to be more descriptive and to have less redundancy
function renderYelpPlacesHtml(res, searchTerm){
	console.log('renderYelpPlacesHtml ran');
	let htmlToRender = "";
	let numberOfResults = 5;
	for (let i=0; i<numberOfResults; i++){
		htmlToRender += `<a href=${res[i]['url']} target="_blank"><li><img class="results-img" src=${res[i]['image_url']}>${res[i]['name']}</li></a>`
	}
	let htmlToPass = `
		<h2>${searchTerm}</h2>
		<ul>
			${htmlToRender}
		</ul>`;
	$('.js-yelp-results').append(htmlToPass);
}

//function to structure and render HTML for YelpEvents results
//TO-DO: modify terms to be more descriptive and to have less redundancy
function renderYelpEventsHtml(res){
	console.log('renderYelpEventsHtml ran');
	let htmlToRender = "";
	let numberOfResults = 5;
	for (let i=0; i<numberOfResults; i++){
		htmlToRender += `<a href=${res[i]['url']} target="_blank"><li><img class="results-img" src=${res[i]['image_url']}>${res[i]['name']}</li></a>`
	}
	let htmlToPass = `
		<h2>Events</h2>
		<ul>
			${htmlToRender}
		</ul>`;
	$('.js-yelp-events').append(htmlToPass);
}


//function to stucutre and render HTML for Twitter Results
//TO-DO: insert anchor links
//TO-DO: include user images
function renderTwitterHtml(res, searchTerm){
	console.log('renderTwitterHtml ran');
	let htmlToRender = "";
	let numberOfResults = 5;
	for (let i=0; i<Math.min(numberOfResults, res.statuses.length); i++){
		htmlToRender += `<li>${res.statuses[i].text}</li>`
	}
	let htmlToPass = `
		<h2><a href="https://twitter.com/search/?q=%23${SEARCH_CITY}" target="_blank">${searchTerm}</a></h2>
		<ul>
			${htmlToRender}
		</ul>`;
	console.log(htmlToPass);
	$('.js-twitter-results').append(htmlToPass);
}

function renderButtons(cities){
	let citiesButtons = "";
	for (let i=0; i<cities.length; i++){
		citiesButtons += `
		<button class="js-city-button" type="submit" value=${cities[i]['city']}>${cities[i]['city']}</button>
		`
	}
	$('.js-search-form').html(citiesButtons);
}

handleSubmitClick();
renderButtons(CITIES);