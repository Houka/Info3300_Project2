var active = d3.select(null);	
var colors = ["#fe1110","#ff594f","#ff9686","#ffd1bf","#fae3db","#f8feff","#bfd4ff","#859bff","#4a5cff","#2f43f1","#0711d3"];

/* Displays the World Map */
function displayMap(data, mapData, countryNames, year, svg){
    var width = +svg.style("width").replace("px",""),
        height = +svg.style("height").replace("px","");

	var projection = d3.geoMercator().scale(100).translate([width/2,height/2]);
	var path = d3.geoPath().projection(projection);

	// add event listeners
	svg.on("click", stopped, true);
	createResetListener(svg, reset);

	//data -- democracy 
	var demlist = [];
	var demnamlist = [];
	for (i = 0; i < 169; i++){
		if (data[i] != null){
			demlist.push(data[i].currentDemocracy);
		}
		else {
			demlist.push(11);
		}
	}

	// create the graphics
	var world_g = svg.select("#world_g").empty()? svg.append("g").attr("id", "world_g") : svg.select("#world_g");
	var zoom = d3.zoom()
		.scaleExtent([1,8])
		.on("zoom", zoomed);
	svg.call(zoom);

	world_g.selectAll("path").remove();

	world_g.selectAll("path")
		.data(topojson.feature(mapData, mapData.objects.countries).features)
		.enter().append("path")
		.attr("id", function(d){return "path"+d.id;})
		.attr("d", path)
		.attr("class", "feature")
		.attr("fill", function(a, b) {return demcolors(select_country(countryNames[a.id]));})
		.on("click", clicked)
		.on("mouseover", enter);

	world_g.append("path")
		.datum(topojson.mesh(mapData, mapData.objects.countries, function(a, b) { return a !== b; }))
		.attr("class", "mesh")
		.attr("d", path);

	clicked(getCountry(selectedCountry, countryNames,topojson.feature(mapData, mapData.objects.countries).features));

	function select_country(name) {
		select_data = data.filter(function(obj) {
        	return obj.country === name;
    	});
    	if (select_data.length > 0) {
    		return select_data[0].currentDemocracy;
    	}
    	else {
    		return 11;
    	}
	}
	
	function clicked(d) {
		if(d==null)
			return reset(svg);

		selectedCountry = countryNames[d.id];
		
		if (active.node() === this) return reset(svg);
		active.classed("active", false);
		active = world_g.select("#path"+d.id).classed("active", true);

		var bounds = path.bounds(d),
			dx = bounds[1][0] - bounds[0][0],
			dy = bounds[1][1] - bounds[0][1],
			x = (bounds[0][0] + bounds[1][0]) / 2,
			y = (bounds[0][1] + bounds[1][1]) / 2,
			scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
			translate = [width / 2 - scale * x, height / 2 - scale * y];

		svg.transition()
			.duration(750)
			.call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
	}

	function enter(d){
		d3.select("#countryText").text(countryNames[d.id]);
	}

	function zoomed() {
		world_g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
		world_g.attr("transform", d3.event.transform); 
	}

	function reset(svg) {
		active.classed("active", false);
		active = d3.select(null);
		selectedCountry = "";
		svg.transition()
			.duration(750)
			.call(zoom.transform, d3.zoomIdentity);
	}
}

function getCountry(country,countryNames,data){
	var result = null;
	data.forEach(function(d){
		if (countryNames[d.id] === country){
			result = d;
		}
	});
	return result;
}

function demcolors(num){
	if (num >=0 && num <= 10)
		return colors[num];
	else
		return "black";
}

function createResetListener(svg, reset){
	if (!svg.select("#resetListener").empty())
		svg.append("rect")
			.attr("id", "resetListener")
	    	.attr("class", "background")
		    .attr("width", width)
		    .attr("height", height)
		    .on("click", reset);
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
	if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

/* Creates and draws the color legend based on the coloring and birthrates
*/
function displayMapLegend(data, svg){
    var width = +svg.style("width").replace("px",""),
        height = +svg.style("height").replace("px","");

	// scale functions
	var scaleColor = d3.scaleOrdinal()
		.domain([0,1,2,3,4,5,6,7,8,9,10])
		.range(colors);

	// legends
	var mapLegendOrdinal = d3.legendColor()
		.title("Democracy Rating")
		.shapeWidth(20)
    	.labelFormat(d3.format(".0f"))
		.orient("horizontal")
		.scale(scaleColor);

	// add and draw legend
	// GDP per capita = radius (USD)
	svg.append("g")
		.attr("class", "mapLegendOrdinal")
		.attr("transform", "translate("+width*.005+", "+height*.05+")");
	d3.select(".mapLegendOrdinal")
		.call(mapLegendOrdinal);
}