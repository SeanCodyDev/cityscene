console.log('hello');
let SEARCH_TERM = "";
//on ANY button click, the AJAX method is called
//function that takes in a city search term and assigns it so a global variable SEARCH_TERM
function takeSearchTerm(){
	console.log('takeSearchTerm ran');
};

//function that handles the click of the submit button
function handleSubmitClick(){
	console.log('handleSubmitClick ran');
};


//function that returns serach results for city for coffee, bars, restaurants, and things to do
function cityYelpResults(){
	console.log('cityYelpResults ran');
};

$('button').click((e)=>{
	e.preventDefault();
	let searchTerm = $('#js-query').val();
	$.ajax({
            url: "/search",
            type: 'POST',
            data: {
            	search: searchTerm	
            },
            success: function(res) {
                console.log(res);
                $('.js-results').html(res);
            	renderHtml(res);
            }
        });
 })

//function to structure HTML for results
function renderHtml(res){
	let htmlToRender = "";
	for (let i=0; i<res.length; i++){
	htmlToRender +=
	`
		<li>${res[i]['name']}<img src=${res[i]['image_url']}/></li>
		`}
	$('.js-results').html(`<ul>${htmlToRender}</ul>`);
}