//----- NEXT STEPS -----
//2) Render Bing Results
// 
//3) STYLE (see CSS notes)!!! 
// yelp places headers should link to Yelp

let SEARCH_CITY;
let CITIES = [
	{city: "New York, NY", path: "nyc"},
	{city: "Chicago, IL", path: "chicago"},
	{city: "Boston, MA", path: "boston"},
	{city: "Miami, FL", path: "miami"},
	{city: "Nashville, TN", path: "nashville"},




];


function takeSearchTerm(searchCity){
	for (let i=0; i<CITIES.length; i++){
		if (searchCity == CITIES[i]['city']){
			SEARCH_CITY = CITIES[i];
		}
	}
}

//function that handles the click of the Submit button
function handleSubmitClick(){
	$('.js-search-buttons').on('click','.js-city-button', e => {

		console.log('handleSubmitClick ran');
		e.preventDefault();
		e.stopPropagation();
		let searchText = $(e.currentTarget).text();
		takeSearchTerm(searchText);
		cityYelpPlaces();
		cityYelpEvents();
		cityTwitterResults();
		handleTabs();

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
            	location: SEARCH_CITY['city']
            },
            success: function(res) {
                // console.log(res);
            	renderYelpPlacesHtml(res, searchTerms[i]);
            	$('.js-yelp-tabs :first-child').addClass("current");
				$('.js-yelp-results ul:first-of-type').addClass("current");


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
			location: SEARCH_CITY['city']
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
	let searchTerm=`#${SEARCH_CITY['path']}`;
	$.ajax({
            url: "/searchTwitter",
            type: 'POST',
            data: {
            	search: SEARCH_CITY['path'],
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
		htmlToRender += `
		<li class="list-container">
			<a class="results-img-link" href=${res[i]['url']} target="_blank"><img class="results-img" src=${res[i]['image_url']}></a>
			<a class="results-link" href=${res[i]['url']} target="_blank">${res[i]['name']}</a>
		</li>`;


	}
	let headerTab =`
	<li class="tab-link" data-tab="${searchTerm.replace(/\s+/g, '')}">${searchTerm}</li>`;
	let htmlToPass = 
		// <h3 class="yelp-results-header">${searchTerm}</h3>
		`
		<ul class="yelp-results-list" id="${searchTerm.replace(/\s+/g, '')}">
			${htmlToRender}
		</ul>`;
	$('.js-yelp-tabs').append(headerTab);
	$('.js-yelp-results').append(htmlToPass);
}

//function to structure and render HTML for YelpEvents results
//TO-DO: modify terms to be more descriptive and to have less redundancy
function renderYelpEventsHtml(res){
	console.log('renderYelpEventsHtml ran');
	let htmlToRender = "";
	let numberOfResults = 5;
	for (let i=0; i<numberOfResults; i++){
		htmlToRender += `
		<li class="list-container">
			<a class="results-img-link" href=${res[i]['url']} target="_blank"><img class="results-img" src=${res[i]['image_url']}></a>
			<a class="results-link" href=${res[i]['url']} target="_blank">${res[i]['name']}</a>
		</li>`
	}
	let htmlToPass = `
		<h3 class="yelp-results-header">events</h3>
		<ul class="yelp-events-list">
			${htmlToRender}
		</ul>`;
	$('.js-yelp-events').append(htmlToPass);
}

//takes in tweets object and current tweet and reformats it to include links
function tweetFormat(tweet){
	console.log("tweetFormat ran");
	let tweetText = tweet.text;
	let hashtags = tweet.entities.hashtags;
	let urls = tweet.entities.urls;
	let userMentions = tweet.entities.user_mentions;

  	for (let i=0; i<hashtags.length; i++){
    	tweetText = tweetText.replace(`#${hashtags[i].text}`, `<a href=https://twitter.com/search?q=%23${hashtags[i].text} target="_blank">#${hashtags[i].text}</a>`);
  	}
  	for (let i=0; i<urls.length; i++){
    	tweetText = tweetText.replace(`${urls[i].url}`, `<a href=${urls[i].url} target="_blank">${urls[i].url}</a>`);
  	}
  	for (let i=0; i<userMentions.length; i++){
    	tweetText = tweetText.replace(`@${userMentions[i].screen_name}`, `<a href=https://twitter.com/search?q=%40${userMentions[i].screen_name} target="_blank">@${userMentions[i].screen_name}</a>`);
  	}
	return tweetText;
}

//function to stucutre and render HTML for Twitter Results
//TO-DO: insert anchor links
//TO-DO: include user images
function renderTwitterHtml(res, searchTerm){
	console.log('renderTwitterHtml ran');
	let htmlToRender = "";
	let numberOfResults = 5;
	for (let i=0; i<Math.min(numberOfResults, res.statuses.length); i++){
		let currentTweet = res.statuses[i];
		// let currentTweet = `${res.statuses[i].text}`;
		let formattedTweet = tweetFormat(currentTweet);
		htmlToRender += `<li>${formattedTweet}</li>`
	}
	let htmlToPass = `
		<h3><a href="https://twitter.com/search/?q=%23${SEARCH_CITY['path']}" target="_blank">${searchTerm}</a></h3>
		<ul>
			${htmlToRender}
		</ul>`;
	console.log(htmlToPass);
	$('.js-twitter-results').append(htmlToPass);
}

//changes tab results content
function handleTabs(){
	console.log('handleTabs ran');
	$('ul.js-yelp-tabs').on('click', '.tab-link', function(){
		console.log('tab clicked');
		let tab_id = $(this).attr('data-tab');
		$('ul.js-yelp-tabs li').removeClass('current');
		$('.yelp-results-list').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	});
}

function renderButtons(cities){
	let citiesButtons = "";
	for (let i=0; i<cities.length; i++){
		citiesButtons += `
		<button class="js-city-button city-button" type="submit" value=${cities[i]['city']}>${cities[i]['city']}</button>
		`
	}
	$('.js-search-buttons').html(citiesButtons);
}

handleSubmitClick();
renderButtons(CITIES);