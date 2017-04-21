var color = d3.scaleOrdinal(d3.schemeCategory20c);

/* Displays the sunburst chart 
*   Note: used https://bl.ocks.org/kerryrodden/477c1bfb081b783f80ad as a source of reference
*/
function displaySunburst(data, year, country, svg){
    // initialize Svg
    var width = +svg.style("width").replace("px",""),
        height = +svg.style("height").replace("px",""),
        padding = 50,
        radius = Math.min(width-padding, height-padding) / 2;

    svg.selectAll("*").remove();

    var g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

    // get translation function
    var xScale = d3.scaleLinear()
        .domain([0, radius*2])
        .range([0, 2 * Math.PI]);
    var yScale = d3.scaleLinear()
        .domain([0, radius*2])
        .range([0, radius]);
    var arc = d3.arc()
        .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, xScale(d.x0))); })
        .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, xScale(d.x1))); })
        .innerRadius(function(d) { return Math.max(0, yScale(d.y0)); })
        .outerRadius(function(d) { return Math.max(0, yScale(d.y1)); });

    // parse data down to correct format
    var root = parseData(data);

    d3.partition()
        .size([radius*2,radius*2])
        .round(true)
        (root);

    // display data
    g.selectAll("path").remove();
    var path = g.selectAll("path")
        .data(root.descendants())
        .enter().append("path")
            .attr("d", arc)
            //.style("stroke", "#ccc")
            .style("fill", function(d) { return color(d.id); })
            .style("fill-rule", "evenodd")
            .on("click", click)
            .on("mouseover", enter);

    svg.selectAll("text").remove();
    var text1 = svg.append("text")
        .attr("class","sunburstText")
        .attr("x",width/2)
        .attr("y",height/2+1)
        .attr("text-anchor","middle")
        .attr("alignment-baseline","hanging")
        .attr("font-size","12px")
        .text("");

    var units = svg.append("text")
        .attr("class","sunburstText")
        .attr("x",width/2)
        .attr("y",height/2+height/9)
        .attr("text-anchor","middle")
        .attr("alignment-baseline","hanging")
        .attr("font-size","12px")
        .text("");

    var text2 = svg.append("text")
        .attr("class","sunburstText")
        .attr("x",width/2)
        .attr("y",height/2-20)
        .attr("text-anchor","middle")
        .attr("alignment-baseline","baseline")
        .attr("font-size","70px")
        .text("");

    var continent = svg.append("text")
        .attr("class","sunburstText")
        .attr("x",20)
        .attr("y",20)
        .attr("text-anchor","start")
        .attr("alignment-baseline","hanging")
        .attr("font-size","40px")
        .text("Continent");

    var countryText = svg.append("text")
        .attr("class","sunburstText")
        .attr("id","countryText")
        .attr("x",width-20)
        .attr("y",20)
        .attr("text-anchor","end")
        .attr("alignment-baseline","hanging")
        .attr("font-size","20px")
        .text("Select a Country");

    if (country != ""){
        click(getCountrySunburst(country, root.descendants()));
    }

    // function to decide what to do on a click
    function click(d){
        if(d==null){
            return;
        }
        if (d.depth == 2){
            selectedCountry = d.id;
            units.text("Metric Ton of CO2 Per Capital");
            text1.text("");
            text2.text((+d.value).toFixed(2));
            continent.text(d.parent.id);
        }else if(d.depth == 1){
            selectedCountry = "";
            text1.text("");
            units.text("");
            text2.text("");
            continent.text(d.id);
        }else{
            selectedCountry = "";
            text1.text("");
            units.text("");
            text2.text("");
            continent.text("Continent");
        }

        svg.transition()
            .duration(750)
            .tween("scale", function() {
                var xd = d3.interpolate(xScale.domain(), [d.x0, d.x1]),
                    yd = d3.interpolate(yScale.domain(), [d.y0, radius*2-1]),
                    yr = d3.interpolate(yScale.range(), [d.y0 ? 20 : 0, radius]);
                return function(t) { xScale.domain(xd(t)); yScale.domain(yd(t)).range(yr(t)); };
            })
            .selectAll("path")
                .attrTween("d", function(d) { return function() { return arc(d); }; });
    }

    function enter(d){
        if (units.text()==="Metric Ton of CO2 Per Capital"){
            return;
        }
        if (d.depth == 0){
            text1.text("");
            countryText.text("Select a Country");
            continent.text("Continent");            
            return;
        }
        if (d.depth == 1){
            text1.text("");
            countryText.text("Select a Country");
            continent.text(d.id);            
            return;
        }
        if (d.depth == 2){
            text1.text((+d.value).toFixed(2));
            countryText.text(d.id);
            continent.text(d.parent.id);
            return;
        }
        text1.text(d.id);
    }
}

function getText(svg){
     return svg.append("text");
}

/* Returns a suitable arc function that fits the data
*/
function getArc(data, radius){
    return arc;
}

function getCountrySunburst(country, nodes){
    var result = null;
    nodes.forEach(function(d){
        if (d.id === country){
            result = d;
        }
    });
    return result;
}

/* Parse data into node form where world is root, continent is node at depth 1, country is node at depth 2
*/
function parseData(data){
    var parsedData = data.concat([
        {country:"EU", continent:"world", currentCo2:0},
        {country:"AS", continent:"world", currentCo2:0},
        {country:"SA", continent:"world", currentCo2:0},
        {country:"NA", continent:"world", currentCo2:0},
        {country:"OC", continent:"world", currentCo2:0},
        {country:"AF", continent:"world", currentCo2:0},
        {country:"world", continent:""}
    ]);

    var root = d3.stratify()
        .id(function(d) { return d.country; })
        .parentId(function(d) { return d.continent; })
        (parsedData)
            .sum(function(d) { return isNaN(d.currentCo2)? 0:d.currentCo2; });

    return root;
}