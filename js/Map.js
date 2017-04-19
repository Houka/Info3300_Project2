var active = d3.select(null);	

/* Displays the World Map */
function displayMap(data, mapData, countryNames, year, svg){
    var width = +svg.style("width").replace("px",""),
        height = +svg.style("height").replace("px","");

	var projection = d3.geoMercator().scale(100).translate([width/2,height/2]);
	var path = d3.geoPath().projection(projection);

	// add event listeners
	svg.on("click", stopped, true);
	createResetListener(svg, reset);

	// create the graphics
	var world_g = svg.select("#world_g").empty()? svg.append("g").attr("id", "world_g") : svg.select("#world_g");
	var zoom = d3.zoom()
		.scaleExtent([1,8])
		.on("zoom", zoomed);
	svg.call(zoom);

	world_g.selectAll("path")
		.data(topojson.feature(mapData, mapData.objects.countries).features)
		.enter().append("path")
		.attr("d", path)
		.attr("class", "feature")
		.attr("fill", function(a, b) { return "white";})
		.on("click", clicked);

	world_g.append("path")
		.datum(topojson.mesh(mapData, mapData.objects.countries, function(a, b) { return a !== b; }))
		.attr("class", "mesh")
		.attr("d", path);

	function clicked(d) {
		selectedCountry = countryNames[d.id];

		if (active.node() === this) return reset(svg);
		active.classed("active", false);
		active = d3.select(this).classed("active", true);

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

function displaySideInfo(data, year, country, svg){
	log("in side info")
   	d3.select("#info").text(country === ""? "Country Name":country);
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