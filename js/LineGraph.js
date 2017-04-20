/* Displays the line graphs */
function displayLineGraph(data, year, country, svg){
    var width = +svg.style("width").replace("px",""),
        height = +svg.style("height").replace("px","");
	var minYear=1960; var maxYear=2016;
    data = data.filter(function(obj) {
        return obj.country === country;
    });

    // null case
    if (data.length == 0) return;

    dem = data[0].democracy;
    co2 = data[0].co2;


    data = [];
    for(i=1960; i<=2016; i++){
        demval = dem.filter(function(obj){
            return obj.year==i.toString() && obj.democracy>=0;
        });
        co2val = co2.filter(function(obj){
            return obj.year==i && obj.co2!=".";
        });
        
        if(co2val.length>0 && demval.length>0){
            data.push([i, demval[0].democracy, co2val[0].co2]);
        };
    };

	ymin = d3.min(data, function(d){ return parseFloat(d[2]) });
	ymax = d3.max(data, function(d){ return parseFloat(d[2]) });
	xScale = d3.scaleLinear().domain([minYear,maxYear]).range([width*0.1, width*0.9]);
	yScale1 = d3.scaleLinear().domain([0, 10]).range([height*0.9, height*0.1]);
	yScale2 = d3.scaleLinear().domain([ymin, ymax]).range([height*0.9, height*0.1]);
	
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
    .attr("transform", "translate(0," + (height*0.9).toString() + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
 
    g.append("g")
    .attr("class", "axis axis-y")
    .attr("transform", "translate(" + (width*0.1).toString() + ",0)")
    .call(d3.axisLeft(yScale1));

    g.append("g")
    .attr("class", "axis axis-y")
    .attr("transform", "translate(" + (width*0.9).toString() + ",0)")
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