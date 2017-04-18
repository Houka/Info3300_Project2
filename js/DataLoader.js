// Data accessing and parsing script

/* Loads and parses the data files and then supplies the callback with the data in a easy to use form

	data is an array of form:
	[{
		co2:[{year:1960, co2:3}...]
		continent:"OC"
		democracy:[{year:1960, democracy:3}...]
		iso2:"AU"
		iso3:"AUS"
	}...]
*/
function loadData(callback){
	d3.csv("continent.csv", function(error, continentData){
		d3.json("iso3.json", function(error, iso3Data){
			d3.json("countryNames.json", function(error, countryNamesData){
				var countryCodeMapping = parseCountryCodeMapping(continentData, iso3Data, countryNamesData);
				d3.csv("CO2Emissions.csv", function(error, co2Data){
					d3.csv("politics.csv", function(error, politicsData){
						var data = [];

						// parse the political data down to extract out useable data only
						var parsedPoliticData = [];
						var nestedPoliticsData = d3.nest().key(function(d){ return d.SCODE;}).entries(politicsData);
						nestedPoliticsData.forEach(function(d){
							var countryData = getCountryData(d.key, countryCodeMapping);
							var democracyData = getPoliticalData(d.values);
							parsedPoliticData = parsedPoliticData.concat(
								{democracy: democracyData, iso2: countryData.iso2, iso3: countryData.iso3, continent: countryData.continent, country:countryData.country});
						});
						parsedPoliticData = d3.map(parsedPoliticData, function(d){ return d.iso3; });

						// parse the co2 data and combine it to politics
						co2Data.forEach(function(d){
							var pData = parsedPoliticData["$"+d["Country Code"]];
							if (pData != null){
								var co2s = [];
								years.forEach(function(y){
									co2s = co2s.concat({year:y, co2:d[y]===""?".":d[y]});
								});
								data = data.concat(
									{democracy: pData.democracy, iso2: pData.iso2, iso3: pData.iso3, continent: pData.continent, co2:co2s, country:pData.country});
							}
						});
						log(data);

						callback(data);
					});
				});
			});
		});
	});
}

/* Returns list of political data in the form
	[{year:1960, democracy:4}...]
*/
function getPoliticalData(data){
	result = [];
	data.forEach(function(d){
		result = result.concat({democracy:d.DEMOCRACY, year:d.YEAR});
	});
	return result;
}

/* Parses the json files for iso2 to iso3 and continent to iso2 and create data structure 
*	of information: [{iso2:AU, iso3:AUS, continent:EU},...]
*/
function parseCountryCodeMapping(continentData, iso3Data, countryNamesData){
	result = [];
	continentData.forEach(function(d){
		result = result.concat({iso2:d.iso2, iso3:iso3Data[d.iso2], continent:d.continent, country:countryNamesData[d.iso2]});
	});
	result = d3.map(result, function(d){return d.iso3;});
	return result;
}

/*	Returns {iso2:<value>, continent:<value>} given the iso3 code
*/
function getCountryData(iso3, countryCodeMapping){
	var result = countryCodeMapping["$"+iso3];
	if (result == null)
		return {iso2:".", iso3:iso3, continent:".", country:"."};
	return result;
}