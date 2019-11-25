runjiascatter();



function runjiascatter(){

    // SVG Size
    var margin = {top: 40, right: 20, bottom: 40, left: 20};

    var padding = 30;

    var width = 500 - margin.left- margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#scatter")
        .classed("svg-container", true)
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 800 500")
        .classed("svg-content-responsive", true);

    // Load CSV file
    d3.csv("data/sample.csv", function(data){

        // Analyze the dataset in the web console
        //turn strings into numbers
        data.forEach(function(d){
            d.fltlnl = +d.fltlnl;
            d.agea = +d.agea;
        });
        //data.forEach(d,filter(d){return d.agea<100;})
        console.log(data);
        console.log("Countries: " + data.length);

        // sort data according to Population
        data.sort(function(a, b){ return b.fltlnl - a.fltlnl});
 
        // create chart group, applying margins
        

        var ageScale = d3.scaleLinear()
        .domain([d3.min(data, function(d){return d.agea}),d3.max(data, function(d){return d.agea})])
        .range([padding, width - padding])// this padding mapping pushes the elements away from the edges of SVG drawing area

        //you want small life expectancy values to map to the bottom of the chart,
        //and high life expectancy values to map to the top of the chart.
        //to do this, we can change the sequence of the domain mapping.
        //it seems that d3 mapping [a,b] does not guarantee b>a
        var lonelinessScale = d3.scaleLinear()
        .domain([d3.max(data, function(d){return d.fltlnl}), d3.min(data, function(d){return d.fltlnl})])
        .range([padding , height-padding]);

        var rad = d3.scaleLinear()
        .domain([d3.min(data, function(d){return d.fltlnl}),d3.max(data, function(d){return d.fltlnl})])
        .range([4, 30])

        // create a color Palette to 'colour' according to location
        //var colorPalette = d3.scaleOrdinal(d3.schemeCategory10);
        //colorPalette.domain(["Europe & Central Asia", "East Asia & Pacific", "Middle East & North Africa", "America", "Sub-Saharan Africa"]);

        console.log(ageScale(5))
        console.log(lonelinessScale(68))

        //create a group element
        //append circles to the group
        var circle = svg.append("g")
        .attr("class", "circle")
        .selectAll("circle").data(data).enter().append("circle")
        .attr("cx", function(d){return ageScale(d.agea)})
        .attr("cy", function(d){return lonelinessScale(d.fltlnl)})
        .attr("r", function (d){return rad(d.fltlnl/2)})
        .attr("fill", function(d){return "rgb(0, 120,"+d.agea*5+")"}).attr("stroke-width", 0.1)
        .style("opacity", 0.7)
        //.attr("fill", function(d){return colorPalette(d.Region)});

        // create axis elements
        var xAxis = d3.axisBottom().scale(ageScale).tickFormat(d3.format(",d")).tickValues([0, 10, 20,30, 40,50,60, 70,80,90]);
        var x = svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

        var yAxis = d3.axisLeft().scale(lonelinessScale);
        svg.append("g").attr("class", "axis y-axis").call(yAxis);

        // to add labels to the axis, you do append("text") instead of append("p")
        x.append("text").text("Income per Person (GDP per Capita)").attr("x", width/2).attr("y", -20).attr("fill", "black")


    });
}