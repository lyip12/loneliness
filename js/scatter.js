runjiascatter();


function runjiascatter() {

    // SVG Size
    var margin = {
        top: 5,
        right: 150,
        bottom: 40,
        left: 20
    };

    var padding = 30;

    var width = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.9  - margin.left - margin.right,
        height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) * 0.3 - margin.top - margin.bottom;

    function responsivefy(svg) {

        // Container is the DOM element, svg is appended.
        // Then we measure the container and find its
        // aspect ratio.
        const container = d3.select(svg.node().parentNode),
            width = parseInt(svg.style('width'), 10),
            height = parseInt(svg.style('height'), 10),
            aspect = width / height;

        // Add viewBox attribute to set the value to initial size
        // add preserveAspectRatio attribute to specify how to scale
        // and call resize so that svg resizes on page load
        svg.attr('viewBox', `0 0 ${width} ${height}`).
        attr('preserveAspectRatio', 'xMinYMid').
        call(resize);

        d3.select(window).on('resize.' + container.attr('id'), resize);

        function resize() {
            const targetWidth = parseInt(container.style('width'));
            svg.attr('width', targetWidth);
            svg.attr('height', Math.round(targetWidth / aspect));
        }
    }

    // append the svg object to the body of the page
    var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
        .call(responsivefy)
    .append("g")
    .attr("transform",
          "translate(40," + margin.top + ")");
    var ageArray = [];

    var displayData = [];

    var wrangleData = [];

    var ageMin;

    var ageMax;

    // Load CSV file
    d3.csv("data/ESSCumulativeSmall.csv", function (data) {

    // Analyze the dataset in the web console
    //turn strings into numbers

        data.forEach(function (d) {
            d.fltlnl = +d.fltlnl;
            d.agea = +d.agea;
            if (d.agea<100){ageArray.push(d.agea)}
            if (d.essround ==='7'){d.essround = '2015';};
            if (d.essround ==='6'){d.essround = '2014';};
            if (d.essround ==='5'){d.essround = '2013';};
            if (d.essround ==='3'){d.essround = '2011';};
        });

        var nestedData = d3.nest().key(function(d){return d.essround})
            .entries(data)
            //.map(function (d) { return {Category: d.key, Value: d.value}});

       // console.log(displayData)
        ageMin = d3.min(ageArray);
        ageMax = d3.max(ageArray);
        var smoothing = 1;

        nestedData.forEach(function(d){
            let data = d.values;
            //console.log(data)

            data.filter(function(d){
                return +d.agea<100
            })

            //console.log(ageMin);
            //console.log(ageMax);

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

                displayData.push({
                    Age: i,
                    Value: d3.format(".4s")(meanfltlnl),
                    Count: filteredFltlnl.length*5,
                    Year: d.key
                })
            }
        })
        for (var i = ageMin; i <= ageMax; i++) {
            var filteravg = data.filter(function (d) {
                return d.agea == i;
            });

            var avgFltlnl = [];

            filteravg.forEach(function (d) {
                if (d.fltlnl <= 10) {
                    avgFltlnl.push(d.fltlnl);
                }
            });
            console.log(filteravg)

            var meanfltlnl = d3.mean(avgFltlnl);

            displayData.push({
                Age: i,
                Value: d3.format(".4s")(meanfltlnl),
                Count: filteravg.length * 5,
                Year: "all"
            })
        }
        console.log(displayData)
        updatescatter("all")
    })


    var ageScale = d3.scaleLinear()
        .domain([0,100])
        .range([0, width]) // this padding mapping pushes the elements away from the edges of SVG drawing area


    var lonelinessScale = d3.scaleLinear()
        .domain([3, 0])
        .range([0, height]);

    var rad = d3.scaleLinear()
        .domain([d3.min(wrangleData, function (d) {
            return d.fltlnl
        }), d3.max(wrangleData, function (d) {
            return d.fltlnl
        })])
        .range([1, 3])
    // create chart group, applying margins

    var g = d3.select("svg").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    //console.log(fltlnlList)


    //var selcomparisiotype =d3.select("#year-type").on("change", updatescatter);
    $('#year-type').change( function() {
        var selcomparisiotype = document.querySelector('input[name="scatter"]:checked').value;
        //console.log(selcomparisiotype)
        updatescatter(selcomparisiotype);
    });

    function updatescatter(selcomparisiotype)
    {
        wrangleData = displayData.filter(function(d){return d.Year===selcomparisiotype})
        //console.log(wrangleData)


        var dots = g.attr("class", "circle")
            .selectAll("circle")
            .data(wrangleData)

        dots.enter()
            .append("circle")
            .merge(dots)
            .on("mouseover", yipmouseOver)
            .on("mouseleave", yipmouseLeave)
            .transition()
            .delay(800)
            .attr("cx", function (d) {
                //console.log(d)
                return ageScale(d.Age)+40
            })
            .attr("cy", function (d) {
                return lonelinessScale(d.Value) || -50
            })
            .attr("r", function(d,i){
                if (d.Value == null) return 1;
                return d.Value*d.Value*0.995|| 0;
            })
            .attr("fill", function(d){

                return d3.interpolateBlues(d.Value*d.Value/8)})
            .style("opacity", 1)


        dots.exit().remove()


        // create axis elements
        var xAxis = d3.axisBottom()
            .scale(ageScale)
            .tickFormat(d3.format(",d"))
            .tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])

        var xscatter = svg.append("g")
            .attr("class", "axis scatter")
            .attr("transform", "translate(0," + height + ")")
            //.attr("stroke", "#8293b6")
            .call(xAxis)


        var yAxis = d3.axisLeft().scale(lonelinessScale)
            .tickFormat(d3.format(",d"))
            .tickValues([0, 1, 2, 3]);

        var yscatter = svg.append("g")
            .attr("class", "axis scatter")
            //.attr("stroke", "#8293b6")
            .call(yAxis);

        // to add labels to the axis, you do append("text") instead of append("p")
        xscatter.append("text")
            .text("Age of People Being Surveyed")
            .attr("class", "scattertext")
            .attr("x", width / 2)
            .attr("y", 30)
            .attr("font-family", "'Roboto', sans-serif")
            .attr("font-size", "9px")
            .attr("font-weight", "300")
            .attr("fill", "#8293b6");

        yscatter.append("text")
            .text("Average Times Felt Lonely During Past Week")
            .attr("class", "scattertext")
            .attr("x", -10)
            .attr("y", -30)
            .attr("text-anchor", "center")
            .attr("font-family", "'Roboto', sans-serif")
            .attr("font-size", "9px")
            .attr("font-weight", "300")
            .attr("transform", "rotate(-90) ")
            .attr("fill", "#8293b6")

        g.append("text")
            .text("Hover to Display Detailed Data")
            .attr("class", "scatterclickthis")
            .attr("x", width /12+40)
            .attr("y", height*4/5+20)
            .attr("font-family", "'Roboto', sans-serif")
            .attr("font-size", "9px")
            .attr("font-weight", "300")
            .attr("fill", "white")





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
                .text("Year: " + d.Year)
                .attr("class", "scattertooltip")
                .attr("x", d3.mouse(this)[0]-40 + "px")
                .attr("y", height*4/5+15)
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-size", "9px")
                .attr("font-weight", "300")
                .attr("fill", "#ff6666")

            g.append("text")
                .text("Age: " + d.Age + " ( ~" + d.Count + " entires )")
                .attr("class", "scattertooltip")
                .attr("x", d3.mouse(this)[0]-40 + "px")
                .attr("y", height*4/5+29)
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-size", "9px")
                .attr("font-weight", "300")
                .attr("fill", "#ff6666")

            g.append("text")
                .text("Frequency: " + d.Value + " / Week")
                .attr("class", "scattertooltip")
                .attr("x", d3.mouse(this)[0]-40 + "px")
                .attr("y", height*4/5+43)
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-size", "9px")
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

         /*   g.append("line")
                .attr("class", "scattertooltip")
                .attr("x1", ageScale(0)+41+"px")
                .attr("y1", height*0.56 + "px")
                .attr("x2", ageScale(100)+40+"px")
                .attr("y2", height*0.4 + "px")
                .attr("stroke-width", 1)
                .attr("stroke", "#ff6666")*/

            var lineFunction = d3.line()
                .x(function(d) {return ageScale(d.Age)+40; })
                .y(function(d) {return lonelinessScale(d.Value);});

             g.append("path")
                 .datum(displayData.filter(function(d){return d.Year==="all"}))
                 .attr("class", "scattertooltip")
                 .attr("d", lineFunction)
                 .attr("stroke-width", 1)
                 .attr("stroke", "#ff6666")
                 .attr("fill", "none")

            g.append("text")
                .text("Regression Value")
                .attr("class", "scattertooltip")
                .attr("x", width+30)
                .attr("y", height/2+20)
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-size", "9px")
                .attr("font-weight", "300")
                .attr("fill", "#ff6666")


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
                    return ageScale(d.Age)+40
                })
                .attr("cy", function (d) {
                    return lonelinessScale(d.Value) || -50
                })
                .attr("r", function(d,i){
                    if (d.Value == null) return 1;
                    return d.Value*d.Value*0.995|| 0;
                })
                .attr("fill", function(d){return d3.interpolateBlues(d.Value*d.Value/8)})
                .style("opacity", 1)
                .attr("z-index", )

            g.append("text")
                .text("Hover to Display Detailed Data")
                .attr("class", "scatterclickthis")
                .attr("x", width /12+40)
                .attr("y", height*4/5+20)
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-size", "9px")
                .attr("font-weight", "300")
                .attr("fill", "white")

            d3.selectAll(".scattertooltipcir").remove()
            d3.selectAll(".scattertooltip").remove();

            //            Tooltip
            //                .style("opacity", 0)

        }
        d3.selectAll(".scattertext").attr("fill", "#8293b6");
    }

};
