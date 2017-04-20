/* Displays the line graphs */
function displayLineGraph(data, year, country, svg){
    var width = +svg.style("width").replace("px",""),
        height = +svg.style("height").replace("px","");
	var minYear=1960; var maxYear=2016;
    data = data.filter(function(obj) {
        return obj.country === country;
    });

    svg.selectAll("g").remove();
    svg.selectAll("text").remove();
    svg.selectAll("rect").remove();

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

	g = svg.append("g");
	    
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

    svg.append("text")
    .text("Year")
    .attr("text-anchor","middle")
    .attr("x", width*0.5)
    .attr("y", height*0.975);

    svg.append("text")
    .text("Democracy (via Polity IV)")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(270)")
    .attr("y", 20)
    .attr("x", -225);

    svg.append("text")
    .text("CO2 Emissions (Metric Tons per Capita)")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(90)")
    .attr("y", -(width*0.97))
    .attr("x", 225)

    svg.append("rect")
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { focus1.style("display", null); focus2.style("display", null); })
    .on("mouseout", function() { focus1.style("display", "none"); focus2.style("display", "none"); })
    .on("mousemove", mousemove);

    var focus1 = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus1.append("circle")
      .attr("r", 4.5);

    focus1.append("text")
      .attr("x", 9)
      .attr("y", -9)
      .attr("dy", ".35em");

    var focus2 = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus2.append("circle")
      .attr("r", 4.5)
      .attr("stroke", "steelblue")
      .attr("fill", "steelblue");

    focus2.append("text")
      .attr("x", 9)
      .attr("y", -9)
      .attr("dy", ".35em");

    bisect = d3.bisector(function(d) { return d[0]; }).left;

    function mousemove() {
        var x0 = xScale.invert(d3.mouse(this)[0]),
            i = bisect(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0[0] > d1[0] - x0 ? d1 : d0;
        focus1.attr("transform", "translate(" + xScale(d[0]) + "," + yScale2(d[2]) + ")");
        focus1.select("text").text((+d[2]).toFixed(2));
        focus2.attr("transform", "translate(" + xScale(d[0]) + "," + yScale1(d[1]) + ")");
        focus2.select("text").text(d[1]);
    }
}