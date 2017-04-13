// Data accessing and parsing script

/* Loads and parses the data files and then supplies the callback with the data in a easy to use form
*/
function loadData(callback){
	d3.csv("CO2Emissions.csv", function(error, data){
		callback(data);
	});
}

/* Parses the json files for iso2 to iso3 and continent to iso2 and create data structure 
*	of information about the country(iso3), its iso2, and its continent
*/
function loadCountryCodeMapping(continentData, iso3Data){
	log(continentData);
	log(iso3Data);

	
}

function loadJsonTest(){
	d3.json("continent.json", function(error, continentData){
		d3.json("iso3.json", function(error, iso3Data){
			loadCountryCodeMapping(continentData, iso3Data);
		});
	});
}