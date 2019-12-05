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

        // create chart group, applying margins

        g = d3.select("svg").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        var ageScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]) // this padding mapping pushes the elements away from the edges of SVG drawing area


        var lonelinessScale = d3.scaleLinear()
        .domain([3, 0])
        .range([0, height]);

        var rad = d3.scaleLinear()
        .domain([d3.min(data, function (d) {
            return d.fltlnl
        }), d3.max(data, function (d) {
            return d.fltlnl
        })])
        .range([1, 3])

        //console.log(fltlnlList)

        /*var color = d3.scaleSequential(d3.interpolateBlues)
            .domain([d3.min(data, function (d) {
            return d.fltlnl})])
            .range([0,1])*/
        //create a group element
        //append circles to the group
        g.attr("class", "circle")
            .selectAll("circle")
            .data(fltlnlList)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
            return ageScale(d.Age)
        })
            .attr("cy", function (d) {
            return lonelinessScale(d.Value) || -50
        })
            .attr("r", function(d,i){
            if (d.Value === null) return 2;
            return d.Value*d.Value*1.5+1;
        })
            .attr("fill", function(d){return d3.interpolateBlues(d.Value*d.Value/8)})
            .style("opacity", 1)
            .on("mouseover", yipmouseOver)
            .on("mouseleave", yipmouseLeave)

        function yipmouseOver(d){

            d3.select(this)
                .style("opacity", 1)
                .attr("fill", "#ff6666")
                .attr("r", 8)

            //            g.append("circle")
            //                .classed("scattertooltipcir", true)
            //                .attr("cx", d3.mouse(this)[0])
            //                .attr("cy",d3.mouse(this)[1])
            //                .attr("r", 8)
            //                .style("opacity", 1)
            //                .attr("fill", "#ff6666")
            console.log(this)

            g.append("text")
                .text("Age: " + d.Age + " ( ~" + d.Count + " entires )")
                .attr("class", "scattertooltip")
                .attr("x", d3.mouse(this)[0]-40 + "px")
                .attr("y", height*4/5+20)
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-size", "12px")
                .attr("font-weight", "300")
                .attr("fill", "#ff6666")

            g.append("text")
                .text("Frequency: " + d.Value + " / Week")
                .attr("class", "scattertooltip")
                .attr("x", d3.mouse(this)[0]-40 + "px")
                .attr("y", height*4/5+34)
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-size", "12px")
                .attr("font-weight", "300")
                .attr("fill", "#ff6666")

            g.append("line")
                .attr("class", "scattertooltip")
                .attr("x1", d3.mouse(this)[0] + "px")
                .attr("y1", d3.mouse(this)[1] + "px")
                .attr("x2", d3.mouse(this)[0] + "px")
                .attr("y2", height*4/5)
                .attr("stroke-width", 1)
                .attr("stroke", "#ff6666")

            g.append("line")
                .attr("class", "scattertooltip")
                .attr("x1", ageScale(0)+41+"px")
                .attr("y1", height*0.56 + "px")
                .attr("x2", ageScale(100)+40+"px")
                .attr("y2", height*0.4 + "px")
                .attr("stroke-width", 1)
                .attr("stroke", "#ff6666")

            d3.selectAll(".scatterclickthis").remove();
            //<line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />

            //            Tooltip
            //                .html(data)
            //                .style("left", d3.mouse(this)[0] + "px")
            //                .style("top", d3.mouse(this)[1]+10 + "px")
            //                .transition()
            //                .duration(300)
            //                .style("opacity", 1);
        }

        function yipmouseLeave(d){
            //d3.selectAll(".scattertooltip").remove();
            /*d3.select(this)
                .attr("r", function(d,i){
                    if (d.Value === null) return 2;
                    return d.Value*d.Value;
                })
                .attr("fill", function(d){return d3.interpolateBlues(d.Value*d.Value/8)})
*/
            d3.select(this)
                .attr("cx", function (d) {
                return ageScale(d.Age)
            })
                .attr("cy", function (d) {
                return lonelinessScale(d.Value) || -50
            })
                .attr("r", function(d,i){
                if (d.Value === null) return 2;
                return d.Value*d.Value*1.5+1;
            })
                .attr("fill", function(d){return d3.interpolateBlues(d.Value*d.Value/8)})
                .style("opacity", 1)
            
            g.append("text")
                .text("Hover to Display Detailed Data")
                .attr("class", "scatterclickthis")
                .attr("x", width /12+40)
                .attr("y", height*4/5+20)
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-size", "12px")
                .attr("font-weight", "300")
                .attr("fill", "white")
            
            d3.selectAll(".scattertooltipcir").remove()
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

        g.append("text")
            .text("Hover to Display Detailed Data")
            .attr("class", "scatterclickthis")
            .attr("x", width /12+40)
            .attr("y", height*4/5+20)
            .attr("font-family", "'Roboto', sans-serif")
            .attr("font-size", "12px")
            .attr("font-weight", "300")
            .attr("fill", "white")

    });
}
