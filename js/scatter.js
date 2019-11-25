runjiascatter();



function runjiascatter(){

    // SVG Size
    var margin = {top: 40, right: 40, bottom: 40, left: 40};

    var padding = 0;

    var width = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - margin.left- margin.right,
        height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.6; - margin.top - margin.bottom;

// append the svg object to the body of the page
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Load CSV file
    d3.csv("data/sample.csv", function(data){

        // Analyze the dataset in the web console
        //turn strings into numbers
        data.forEach(function(d){
            d.fltlnl = +d.fltlnl;
            d.agea = +d.agea;
            d.happy += d.happy;
            d.sclmeet= +d.sclmeet
        });
        //data.forEach(d,filter(d){return d.agea<100;})

        // sort data according to Population
        data.sort(function(a, b){ return b.fltlnl - a.fltlnl});

        // create chart group, applying margins

        g = d3.select("svg").attr("transform", "translate(" + margin.left+ "," + margin.top + ")")

        var ageScale = d3.scaleLinear()
            .domain([0,90])
            .range([0, width])// this padding mapping pushes the elements away from the edges of SVG drawing area

        //you want small life expectancy values to map to the bottom of the chart,
        //and high life expectancy values to map to the top of the chart.
        //to do this, we can change the sequence of the domain mapping.
        //it seems that d3 mapping [a,b] does not guarantee b>a
        var lonelinessScale = d3.scaleLinear()
            .domain([10, 0])
            .range([0 , height]);

        var rad = d3.scaleLinear()
            .domain([d3.min(data, function(d){return d.fltlnl}),d3.max(data, function(d){return d.fltlnl})])
            .range([4, 30])

        // create a color Palette to 'colour' according to location
        //var colorPalette = d3.scaleOrdinal(d3.schemeCategory10);
        //colorPalette.domain(["Europe & Central Asia", "East Asia & Pacific", "Middle East & North Africa", "America", "Sub-Saharan Africa"]);

        console.log(ageScale(5))
        console.log(lonelinessScale(8))

        //create a group element
        //append circles to the group
        var circle = g
            .attr("class", "circle")
            .selectAll("circle").data(data).enter().append("circle")
            .attr("cx", function(d){return ageScale(d.agea)})
            .attr("cy", function(d){return lonelinessScale(d.fltlnl)})
            .attr("r", function (d){return rad(d.fltlnl/2)})
            .attr("fill", function(d){return "rgb(0, "+d.fltlnl*20+",150)"}).attr("stroke-width", 0.1)
            .style("opacity", 0.7)
        //.attr("fill", function(d){return colorPalette(d.Region)});

        // create axis elements
        var xAxis = d3.axisBottom().scale(ageScale).tickFormat(d3.format(",d")).tickValues([0, 10, 20,30, 40,50,60, 70,80,90])

        var xscatter = svg.append("g")
            .attr("class", "axis scatter")
            .attr("transform", "translate(0," + height + ")")
            .attr("fill", "white")
            .call(xAxis)


        var yAxis = d3.axisLeft().scale(lonelinessScale)
            .tickFormat(d3.format(",d"))
            .tickValues([0, 1, 2,3, 4,5,6, 7,8,9]);

        var yscatter = svg.append("g")
            .attr("class", "axis scatter")
            .attr("fill", "white")
            .call(yAxis);

        // to add labels to the axis, you do append("text") instead of append("p")
        xscatter.append("text").text("Age of People Being Surveyed").attr("x", width/2).attr("y", 30).attr("fill", "white")

        yscatter.append("text").text("Average Times Felt Lonely During Past Week")
            .attr("x", width/2).attr("y", 30)
            .attr("transform", "rotate(90) ")

    });
}