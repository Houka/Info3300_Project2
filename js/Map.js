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

	//data -- democracy 
	var demlist = [];
	for (i = 0; i < 169; i++){
		if (data[i] != null){
			demlist.push(data[i].currentDemocracy);
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
		.attr("d", path)
		.attr("class", "feature")
		.attr("fill", function(a, b) {return demcolors(demlist[b]);})
		.on("click", clicked);

	world_g.append("path")
		.datum(topojson.mesh(mapData, mapData.objects.countries, function(a, b) { return a !== b; }))
		.attr("class", "mesh")
		.attr("d", path);

	/*if (selectedCountry != ""){
		clicked(getCountry(selectedCountry, topojson.feature(mapData, mapData.objects.countries).features));
	}*/

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

function getCountry(country,data){

}

function demcolors(num){
	if (num == 0) {
		return "#fe1110";
	} else if (num == 1){
		return "#ff594f";
	} else if (num == 2){
		return "#ff9686";
	} else if (num == 3){
		return "#ffd1bf";
	} else if (num == 4){
		return "#fae3db";
	} else if (num == 5){
		return "#f8feff";
	} else if (num == 6){
		return "#bfd4ff";
	} else if (num == 7){
		return "#859bff";
	} else if (num == 8){
		return "#4a5cff";
	} else if (num == 9){
		return "#2f43f1";
	} else if (num == 10){
		return "#0711d3";
	} else {
		return "black";
	} 
}

function displaySideInfo(data, year, country, svg){
	log("in side info")
   	d3.select("#info").text(country === ""? "Pick a country":country);
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