//---- NEXT STEPS ----
//limit to first 5 results

console.log('hello');
let SEARCH_CITY = "";

//function that takes in a city search term and assigns it so a global variable SEARCH_TERM
//future feature needs to validate input against cities in Google Maps
function takeSearchTerm(){
	console.log('takeSearchTerm ran');
	SEARCH_CITY = $('#js-query').val();
	$('#js-query').val("");
	console.log(`SEARCH_CITY is ${SEARCH_CITY}`);

};

//function that handles the click of the submit button
function handleSubmitClick(){
	$('#js-query-button').click(e => {
		console.log('handleSubmitClick ran');
		e.preventDefault();
		takeSearchTerm();
		cityYelpResults();
		});
};


//function that returns serach results for city for coffee, bars, restaurants, and things to do
function cityYelpResults(){
	console.log('cityYelpResults ran');
	$('.js-results').html(``);
	let searchTerms = ['coffee', 'restaurants', 'nightlife', 'things to do'];
	let resultsToRender = ``;
	for (let i=0; i<searchTerms.length; i++){
		$.ajax({
            url: "/search",
            type: 'POST',
            data: {
            	search: searchTerms[i],
            	location: SEARCH_CITY
            },
            success: function(res) {
                // console.log(res);
            	let htmlPassed = renderHtml(res, searchTerms[i]);
            	resultsToRender += htmlPassed;
            	console.log(resultsToRender);
            	// $('.js-results').html(resultsToRender);
            	//ERROR: resultsToRender is not being updated outside of this callback function
            	//ALTERNATIVE: In renderHtml function, clear current results div and render in that function
            }
        });

	}
	console.log(resultsToRender);
	$('.js-results').html(`<p>lorem ipsum</p> ${resultsToRender}`);
};

// $('button').click((e)=>{
// 	// e.preventDefault();
// 	// let searchTerm = $('#js-query').val();
// 	$.ajax({
//             url: "/search",
//             type: 'POST',
//             data: {
//             	search: searchTerm	
//             },
//             success: function(res) {
//                 console.log(res);
//                 $('.js-results').html(res);
//             	renderHtml(res);
//             }
//         });
//  })

//function to structure HTML for results
//TO-DO: modify terms to be more descriptive and to have less redundancy
function renderHtml(res, searchTerm){
	console.log('renderHtml ran');
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
	$('.js-results').append(htmlToPass);
}

handleSubmitClick();