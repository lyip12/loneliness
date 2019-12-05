runjiascatter();

function runjiascatter() {

    // SVG Size
    var margin = {
        top: 10,
        right: 150,
        bottom: 40,
        left: 18
    };

    var width = Math.max(document.documentElement.clientHeight, window.innerWidth || 0) * 0.5 - margin.left,
        height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 0.3; - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(40," + margin.top + ")");

    // Load CSV file
    d3.csv("data/ESSCumulativeSmall.csv", function (data) {

        // Analyze the dataset in the web console
        //turn strings into numbers

        var ageArray = [];

        data.forEach(function (d) {
            d.fltlnl = +d.fltlnl;
            d.agea = +d.agea;
            ageArray.push(d.agea);
        });

        var ageMin = d3.min(ageArray);
        var ageMax = d3.max(ageArray);
        var smoothing = 1;

        //        console.log(ageMin);
        //        console.log(ageMax);

        var fltlnlList = [];

        for (var i = ageMin; i <= ageMax; i++) {
            var filteredagedata = data.filter(function (d) {
                return d.agea == i;
            });

            var filteredFltlnl = [];

            filteredagedata.forEach(function (d) {
                if (d.fltlnl <= 10) {
                    filteredFltlnl.push(d.fltlnl);
                };
            });

            var meanfltlnl = d3.mean(filteredFltlnl);

            fltlnlList.push({
                Age: i,
                Value: d3.format(".4s")(meanfltlnl),
                Count: filteredFltlnl.length*5
            })
        }

        //console.log(fltlnlList);

        //console.log(maxData);

        // sort data according to Population
        //        data.sort(function (a, b) {
        //            return b.fltlnl - a.fltlnl
        //        });

        // create chart group, applying margins

        g = d3.select("svg").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        var ageScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]) // this padding mapping pushes the elements away from the edges of SVG drawing area

        //you want small life expectancy values to map to the bottom of the chart,
        //and high life expectancy values to map to the top of the chart.
        //to do this, we can change the sequence of the domain mapping.
        //it seems that d3 mapping [a,b] does not guarantee b>a
        var lonelinessScale = d3.scaleLinear()
        .domain([3, 0])
        .range([0, height]);

        var rad = d3.scaleLinear()
        .domain([d3.min(data, function (d) {
            return d.fltlnl
        }), d3.max(data, function (d) {
            return d.fltlnl
        })])
        .range([4, 30])

        // create a color Palette to 'colour' according to location
        //var colorPalette = d3.scaleOrdinal(d3.schemeCategory10);
        //colorPalette.domain(["Europe & Central Asia", "East Asia & Pacific", "Middle East & North Africa", "America", "Sub-Saharan Africa"]);

        //        console.log(ageScale(5))
        //        console.log(lonelinessScale(8))

        //create a group element
        //append circles to the group
        var circle = g
        .attr("class", "circle")
        .selectAll("circle")
        .data(fltlnlList)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return ageScale(d.Age)
        })
        .attr("cy", function (d) {
            return lonelinessScale(d.Value) || -10
        })
        .attr("r", 2)
        .attr("fill", "white")
        .style("opacity", 1)
        .on("mouseover", yipmouseOver)
        .on("mouseleave", yipmouseLeave)

        function yipmouseOver(d){
            d3.select(this)
                .attr("r", 8)
                .style("opacity", 1)

            d3.selectAll(".scattertooltip").remove();
            //console.log(d)
            
            g.append("text")
                .text("Age: " + d.Age + " ( ~" + d.Count + " entires )")
                .attr("class", "scattertooltip")
                .attr("x", d3.mouse(this)[0]-40 + "px")
                .attr("y", height*5/6)
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-size", "12px")
                .attr("font-weight", "300")
                .attr("fill", "white")
            
            g.append("text")
                .text("Frequency: " + d.Value + " / Week")
                .attr("class", "scattertooltip")
                .attr("x", d3.mouse(this)[0]-40 + "px")
                .attr("y", height*5/6+14)
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-size", "12px")
                .attr("font-weight", "300")
                .attr("fill", "white")

            //            Tooltip
            //                .html(data)
            //                .style("left", d3.mouse(this)[0] + "px")
            //                .style("top", d3.mouse(this)[1]+10 + "px")
            //                .transition()
            //                .duration(300)
            //                .style("opacity", 1);
        }

        function yipmouseLeave(d){
            d3.select(this)
                .attr("r", 2)

            d3.selectAll(".scattertooltip").remove();
            
            //            Tooltip
            //                .style("opacity", 0)

        }


        // create axis elements
        var xAxis = d3.axisBottom().scale(ageScale).tickFormat(d3.format(",d")).tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])

        var xscatter = svg.append("g")
        .attr("class", "axis scatter")
        .attr("transform", "translate(0," + height + ")")
        .attr("fill", "white")
        .call(xAxis)


        var yAxis = d3.axisLeft().scale(lonelinessScale)
        .tickFormat(d3.format(",d"))
        .tickValues([0, 1, 2, 3]);

        var yscatter = svg.append("g")
        .attr("class", "axis scatter")
        .attr("fill", "white")
        .call(yAxis);

        // to add labels to the axis, you do append("text") instead of append("p")
        xscatter.append("text")
            .text("Age of People Being Surveyed")
            .attr("x", width / 2)
            .attr("y", 35)
            .attr("font-family", "'Roboto', sans-serif")
            .attr("font-size", "12px")
            .attr("font-weight", "300")
            .attr("fill", "white")

        yscatter.append("text")
            .text("Average Times Felt Lonely During Past Week")
            .attr("x", 0)
            .attr("y", -30)
            .attr("text-anchor", "center")
            .attr("font-family", "'Roboto', sans-serif")
            .attr("font-size", "12px")
            .attr("font-weight", "300")
            .attr("transform", "rotate(-90) ")

    });
}
