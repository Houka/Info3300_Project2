/* Displays the scatterplot */
function displayScatterplot(data, year){
	var svg = mainDiv.append("svg")
	.attr("width", "500px")
	.attr("height", "500px")
	.style("border", "1px solid black");
	data = [];
	for(i = 0; i<100; i++){
		dem = Math.floor(Math.random()*10)+1;
		data.push([dem, (100.0/dem)+(Math.random()-0.5)*10.0]);
	}

	ymin = d3.min(data, function(d){ return d[1] });
	ymax = d3.max(data, function(d){ return d[1] });
	xScale = d3.scaleLinear().domain([0,10]).range([svg.attr("width")*0.1,svg.attr("width")*0.9]);
	yScale = d3.scaleLinear().domain([ymin, ymax]).range([svg.attr("height")*0.9,svg.attr("height")*0.1]);
	
	svg.append("line")
	.attr("x1", xScale(0))
	.attr("y1", yScale(ymin))
	.attr("x2", xScale(10))
	.attr("y2", yScale(ymax))
	.style("stroke", "black");

	return svg;
}