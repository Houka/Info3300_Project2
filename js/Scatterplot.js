/* Displays the scatterplot */

function displayScatterplot(data, year, svg){
	svg.style("border", "1px solid black")
	   .attr("width", "700")
	   .attr("height", "500");

	data = [];
	for(i = 0; i<100; i++){
		dem = Math.floor(Math.random()*11);
		data.push([dem, dem+(Math.random()-0.5)*10.0]);
	}

	ymin = d3.min(data, function(d){ return d[1] });
	ymax = d3.max(data, function(d){ return d[1] });
	xScale = d3.scaleLinear().domain([0,10]).range([svg.attr("width")*0.1,svg.attr("width")*0.9]);
	yScale = d3.scaleLinear().domain([ymin, ymax]).range([svg.attr("height")*0.9,svg.attr("height")*0.1]);
	
	// svg.append("line")
	// .attr("x1", xScale(0))
	// .attr("y1", yScale(ymin))
	// .attr("x2", xScale(10))
	// .attr("y2", yScale(ymin))
	// .style("stroke", "black");

	// svg.append("line")
	// .attr("x1", xScale(0))
	// .attr("y1", yScale(ymin))
	// .attr("x2", xScale(0))
	// .attr("y2", yScale(ymax))
	// .style("stroke", "black");

	g = svg.append("g")
	    
    g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (svg.attr("height")*0.9).toString() + ")")
    .call(d3.axisBottom(xScale));
 
    g.append("g")
    .attr("class", "axis axis-y")
    .attr("transform", "translate(" + (svg.attr("width")*0.1).toString() + ",0)")
    .call(d3.axisLeft(yScale));

    svg.append("text")
    .text("Democracy")
    .attr("text-anchor", "middle")
    .attr("x", xScale(5) )
    .attr("y", yScale(ymin)+35)

    //Not sure how to add y-axis label 

	var points = svg.selectAll("circle").data(data);
	points.enter().append("circle")
	.attr("r", 3)
	.style("opacity", 0.7)
	.merge(points)
	.transition().duration(500)
	.attr("cx", function(item) { return xScale(item[0]) })
	.attr("cy", function(item) { return yScale(item[1]) });

	return svg;
}