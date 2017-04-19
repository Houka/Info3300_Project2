var color = d3.scaleOrdinal(d3.schemeCategory20c);

// Keep track of the node that is currently being displayed as the root.
var node;

/* Displays the sunburst chart 
*   Note: used https://bl.ocks.org/kerryrodden/477c1bfb081b783f80ad as a source of reference
*/
function displaySunburst(data, year, svg){
    // initialize Svg
    var width = +svg.style("width").replace("px",""),
        height = +svg.style("height").replace("px",""),
        radius = Math.min(width, height) / 2;

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
    node = root;

    d3.partition()
        .size([radius*2,radius*2])
        .round(true)
        (root);

    // display data
    var path = g.selectAll("path")
        .data(root.descendants())
        .enter().append("path")
            .attr("d", arc)
            //.style("stroke", "#ccc")
            .style("fill", function(d) { return color(d.id); })
            .style("fill-rule", "evenodd")
            .on("click", click)

    // function to decide what to do on a click
    function click(d){
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
}

/* Returns a suitable arc function that fits the data
*/
function getArc(data, radius){
    return arc;
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