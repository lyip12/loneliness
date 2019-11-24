yipsmallmultiples();

function yipsmallmultiples(){


    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Bar chart configurations: data keys and chart titles
    var configs = [
        { key: "ownrent", title: "Own or Rent" },
        { key: "electricity", title: "Electricity" },
        { key: "latrine", title: "Latrine" },
        { key: "hohreligion", title: "Religion" }
    ];

    // Initialize variables to save the charts later
    var barcharts = [];

    var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
    var x2 = d3.scaleTime()
    .range([0, width])
    var y = d3.scaleLinear()
    .range([height, 0]);

    // Date parser to convert strings to date objects
    var parseDate = d3.timeParse("%Y-%m-%d");


    //  (1) Load CSV data
    // 	(2) Convert strings to date objects
    // 	(3) Create new bar chart objects
    // 	(4) Create new are chart object


    d3.csv("data/household_characteristics.csv", function(data){
        data.forEach(function(d){
            d.hhid = +d.hhid;
            d.survey = parseDate(d.survey);
        });
        barchart(data);

    });


    function barchart(d){

        //creating nested list

        for(var i = 0; i<configs.length; i++){

            var countarray = d3.nest()
            .key(function(d) { 
                return d[configs[i].key].substring(0,6) })
            .rollup(function(data) { return data.length; })
            .entries(d);

            countarray.sort( function(a, b){ 
                return b.value - a.value;
            });

//            var svg = d3.select("#yipbarcharts").append("svg")
//            .attr("width", width + margin.left + margin.right)
//            .attr("height", height + margin.top + margin.bottom)
//            .append("g")
//            .attr("transform", 
//                  "translate(" + margin.left + "," + margin.top + ")");

            var svg = d3.select("#yipbarcharts")
            .classed("yipsvg-container", true)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "-40 0 370 400")
            .classed("svg-content-responsive", true);

            x.domain(countarray.map(function(d) { return d.key;}));
            y.domain([0, d3.max(countarray, function(d) { return d.value;})]);

            var bar = svg.selectAll('rect')
            .attr("class", "bar")
            .remove()
            .exit()
            .data(countarray)

            bar.enter()
                .append("rect")
                .data(countarray)
                .attr("fill", "#F67E7D")
                .transition()
                .duration(800)
                .attr("x", function(d) { return x(d.key); })
                .attr("width", x.bandwidth())
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); });

            // add the x Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "axis")
                .call(d3.axisBottom(x));

            // add the y Axis
            svg.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y));

        }
    }
}