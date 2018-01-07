var w = 500;
var h = 100;
var barPadding = 1;
var padding = 30;

var dataset = [ 25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
		14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
		24, 18, 25, 9, 3 ];
var dataset1 = [ 5, 10, 15, 20, 25 ];

var dataset2 = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                 11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

var dataset3 = [[5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
		[410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
	       ];

d3.select("body").selectAll("p")
    .data(dataset)
    .enter()
    .append("p")
    .text(function (d, i) {
	return i.toString() + ", " + d.toString();
    })
    .style("color", function (d) {
	return "rgba(255, 0, 0, " + d / d3.max(dataset) + ")";
    });

d3.select("body").selectAll("div")
    .data(dataset)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function(d) {
	return d*5 + "px";
    });


var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)

var circles = svg.selectAll("circle")
    .data(dataset1)
    .enter()
    .append("circle");

circles.attr("cx",
	     function(d, i) {
		 return (i * 50) + 25;
	     })
    .attr("cy", h/2)
    .attr("r", function(d) {
        return d;
    })
    .attr("fill", "yellow")
    .attr("stroke", "orange")
    .attr("stroke-width", function (d) {
	return d/2;
    });

var svg2 = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

svg2.selectAll("rect")
    .data(dataset2)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
	return i * (w/dataset2.length);
    })
    .attr("y", function(d) {
	return h - d*4;
    })
    .attr("width", w / dataset2.length - barPadding)
    .attr("height", function(d) {
	return d*4;
    })
    .attr("fill", function(d) {
	return "rgb(0, 0, " + (d*10) + ")"
    });

svg2.selectAll("text")
    .data(dataset2)
    .enter()
    .append("text")
    .text(function(d) {
	return d;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "white")
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) {
	return i * (w/dataset2.length) + (w/dataset2.length - barPadding) / 2;
    })
    .attr("y", function(d, i) {
	return h - d*4 + 14;
    });



var xScale = d3.scaleLinear()
    .domain([0, d3.max(dataset3, function(d) { return d[0]; })])
    .range([padding, w-2*padding]);
var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset3, function(d) { return d[1]; })])
    .range([h-padding, padding]);
var rScale = d3.scaleLinear()
    .domain([0, d3.max(dataset3, function(d) { return d[1]; })])
    .range([2, 5]);

var svg3 = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

svg3.selectAll("circle")
    .data(dataset3)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
	return xScale(d[0]);
    })
    .attr("cy", function(d) {
	return yScale(d[1]);
    })
    .attr("r", function(d) {
	return rScale(d[1]);
    });

svg3.selectAll("text")
    .data(dataset3)
    .enter()
    .append("text")
    .text(function(d) {
        return d[0] + "," + d[1];
    })
    .attr("x", function(d) {
        return xScale(d[0]);
    })
    .attr("y", function(d) {
        return yScale(d[1]);
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "red");

var xAxis = d3.axisBottom(xScale)
    .ticks(5);
var yAxis = d3.axisLeft(yScale)
    .ticks(3);


svg3.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

svg3.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
