function create_d3_xy_graph(parentContainerId, svgContainerId, w, h, m, xyDatasets, xMax, yMax) {

	var x = d3.scale.linear().domain([0, xMax]).range([0, w]);
	var y = d3.scale.linear().domain([0, yMax]).range([h, 0]);

	var line = d3.svg.line()
		.x(function(d) {
			return x(d.x);
		})
		.y(function(d) {
			return y(d.y);
		});

	
	var graph = d3.select("#"+parentContainerId)
		.attr("width", w + m[1] + m[3])
		.attr("height", h + m[0] + m[2])
		.append("svg")
			.attr("id", svgContainerId)
			.attr("width", w + m[1] + m[3])
			.attr("height", h + m[0] + m[2])
			.append("svg:g")
				.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
	graph.append("svg:g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + h + ")")
		.call(xAxis);


	var yAxisLeft = d3.svg.axis().scale(y).ticks(10).orient("left");
	graph.append("svg:g")
		.attr("class", "y axis")
		.attr("transform", "translate(-25,0)")
		.call(yAxisLeft);

	// Add the line by appending an svg:path element with the data line we created above
	// do this AFTER the axes above so that the line is above the tick-lines
	for (var i in xyDatasets) {
		if (i=="max" || i=="min" || i=="color") continue;
		var dataset = xyDatasets[i];
		// console.log(dataset);
		graph.append("svg:path")
			.attr("d", line(dataset))
			.attr("stroke", dataset.color)
			.attr("stroke-width", 1)
			.attr("fill", "none");
	}
}