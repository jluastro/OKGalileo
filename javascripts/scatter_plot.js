var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

function onload() {
    var svg = d3.select("#fig1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");
    
    d3.csv("observatory_sites.csv", function(data) {
    
          // get all keys of data hash
          var keys = Object.keys(data[0]);

          var xDropDown = d3.select("#Xselector");
          var yDropDown = d3.select("#Yselector");
          
          xDropDown.selectAll('option').remove();
          yDropDown.selectAll('option').remove();
          for (k in keys) {
            var o = xDropDown.append('option');
            o.text(keys[k]);
            o = yDropDown.append('option');
            o.text(keys[k]);
          }
          
          //xDropDown.on('onchange', tdcb);

    });
}

function change_x_axis(value) {
    console.log("New X axis is: " + value);

}

function change_y_axis(value) {
    console.log("New Y axis is: " + value);
}


function replot_data() {
    svg.selectAll("circle")
        .data(data).enter()
        .append("svg:circle")
        .attr("r", 4)
        .attr("cx", function(d) { return data(d) })
        .attr("cy", function(d) { return data(d) });
};

