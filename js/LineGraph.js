/* Displays the line graphs */
function displayLineGraph(data, year, svg){
	var minYear=1960; var maxYear=2016;

	data = [];
	for(i = minYear; i<maxYear; i++){
		dem = Math.floor(Math.random()*11);
		data.push([i, dem, dem+(Math.random()-0.5)*10.0]);
	}

	ymin = d3.min(data, function(d){ return d[2] });
	ymax = d3.max(data, function(d){ return d[2] });
	xScale = d3.scaleLinear().domain([minYear,maxYear]).range([svg.attr("width")*0.1,svg.attr("width")*0.9]);
	yScale1 = d3.scaleLinear().domain([0, 10]).range([svg.attr("height")*0.9,svg.attr("height")*0.1]);
	yScale2 = d3.scaleLinear().domain([ymin, ymax]).range([svg.attr("height")*0.9,svg.attr("height")*0.1]);
	
	line1 = d3.line()
	.x(function(d) { return xScale(d[0]) })
	.y(function(d) { return yScale1(d[1]) });

	line2 = d3.line()
	.x(function(d) { return xScale(d[0]) })
	.y(function(d) { return yScale2(d[2]) });

    svg.select("g").remove();

	g = svg.append("g")
	    
    g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (svg.attr("height")*0.9).toString() + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
 
    g.append("g")
    .attr("class", "axis axis-y")
    .attr("transform", "translate(" + (svg.attr("width")*0.1).toString() + ",0)")
    .call(d3.axisLeft(yScale1));

    g.append("g")
    .attr("class", "axis axis-y")
    .attr("transform", "translate(" + (svg.attr("width")*0.9).toString() + ",0)")
    .call(d3.axisRight(yScale2));

    g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line1);

    g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line2);
}