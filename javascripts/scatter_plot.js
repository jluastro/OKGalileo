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

var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1c2ZuB_FYI0uj-f2a_OSG3uK_OsyCpdgeVSXAUrVqkR8/pubhtml';

function initdata() {
    Tabletop.init( { key: public_spreadsheet_url,
                             simpleSheet: false,
                             wanted: ["Sites"], 
                             parseNumbers: true,
                             callback: initcb}
                             );
}

function initcb(tableModel, tabletop) {
    sheets = tableModel;
    sites = tableModel.Sites;
    
    
    xDropDown = d3.select("#Xselector");
    yDropDown = d3.select("#Yselector");
    
    finishInit();
}

function finishInit () {

    // Set selectors with column names.
    var keys = sites.column_names;

    
    xDropDown.selectAll('option').remove();
    yDropDown.selectAll('option').remove();
    for (k in keys) {
      var o = xDropDown.append('option');
      o.text(keys[k]);
      o = yDropDown.append('option');
      o.text(keys[k]);
    } 
    
    // Set selector initial values.
    var xAxisCol = sites.column_names[4];
    var yAxisCol = sites.column_names[5];
    xDropDown.node().value = xAxisCol;    
    yDropDown.node().value = yAxisCol;
    
    
    var svg = d3.select("#fig1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr('id', 'svg');
    
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

    replot_data();
}
function onload() {
    initdata();
}

function change_x_axis(value) {
    replot_data();

}

function change_y_axis(value) {
    replot_data();
}


function replot_data() {
    var xCol = xDropDown.node().value;
    var yCol = yDropDown.node().value;
    
    var xData = function(d) {
            return d[xCol]
            };
    var yData = function(d) {
            return d[yCol]
            };
            
    
    var a = sites.elements;
    
    
    // Set the domains for these columns
    var xmin = d3.min(a, xData);
    var xmax = d3.max(a, xData);
    x.domain([xmin, xmax]);
    
    var ymin = d3.min(a, yData);
    var ymax = d3.max(a, yData);
    y.domain([ymin, ymax]);

        
    var svg = d3.select("#svg");
    
    svg.select('.xaxis').call(xAxis);
    svg.select('.yaxis').call(yAxis);


    svg.selectAll("circle")
        .data(a).enter()
        .append("svg:circle")
        .attr('fill', 'white')
        .attr("r", 4)
        .attr("cx", xData)
        .attr("cy", yData);
}

