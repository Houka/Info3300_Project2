/* Displays the World Map */
function displayMap(data, year, svg){
	//Map display variables

	var svg = d3.select("#world");

	var projection = d3.geoMercator()
	var pathGenerator = d3.geoPath().projection(projection);

	var rawData;
	var countries;

	d3.json("world-110m.json", function (error, data) {

		rawData = data;
		countries = topojson.feature(rawData, rawData.objects.countries);
		projection.fitExtent([[0,0], [svg.attr("width"), svg.attr("height")]], countries);
		pathGenerator = d3.geoPath().projection(projection);
				
		var paths = svg.selectAll("path.country").data(countries.features);
		paths.enter().append("path").attr("class", "country")
		.merge(paths) 
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("stroke-width", ".5")
		.transition().duration(1000)
		.attr("d", function (country) {
			return pathGenerator(country);
		});	
	});

	
}