demographicschorovis() // for avoiding naming issue

function demographicschorovis(){
    var toggle;
    var cate = "minority"
    //responsive layout from https://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js
    var svg = d3.select("#yipchoro")
    .classed("yipsvg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 300 400")
    .classed("svg-content-responsive", true);

    var lucypath = d3.geoPath();
    var projection = d3.geoMercator()
    .scale(230)
    .center([0, 0])
    .translate([130, 410]);

    var data = d3.map();

    updateChoropleth()

    d3.select("#yipstats").on("change", function () {
        updateChoropleth()
    });


    //actual chorovis starts
    function updateChoropleth() {
        
        var selector = d3.select("#yipstats").property("value");
        var selector2 = d3.select("#yipstats").property("value2");
        a = [];
        //console.log(selector2);
        d3.queue()
            .defer(d3.json, "data/world.geojson")
            .defer(d3.csv, "data/ESS_Demographic.csv", function (d) {
            data.set(d.Code, +d[selector]);
            a.push(+d[selector]);
        })
            .await(ready);


        function ready(error, topo, loneliness) {

            var Tooltip = d3.select("#yipchoro")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border-radius", "5px")
            .style("padding", "5px")

            let mouseOver = function(d) {
                if(toggle !== 0 && d.data !== "no data"){
                    d3.selectAll(".Country")
                        .transition()
                        .duration(200)
                        .style("opacity", .1)
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .style("opacity", 1)
                    //console.log("tis is working")
                }
            }

            let mouseLeave = function(d) {
                if(toggle !== 0 && d.data !== "no data"){
                    d3.selectAll(".Country")
                        .transition()
                        .duration(800)
                        .style("opacity", 1)
                    d3.select(this)
                        .transition()
                        .duration(800)
                }
            }

            let mouseClick = function (d) {
                if(toggle == 0) {
                    d3.selectAll(".Country")
                        .transition()
                        .duration(800)
                        .style("opacity", 1)
                    d3.select(this)
                        .transition()
                        .duration(800)
                    Tooltip
                        .style("opacity", 0)

                    var yipchoroselector = "All";
                    yipsmallmultiples(yipchoroselector);

                    toggle =1;
                    var t = " "
                    document.getElementById("yiptooltip").innerHTML = t;

                } else {  
                    if(d.data !== "no data"){
                        d3.selectAll(".Country")
                            .transition()
                            .duration(800)
                            .style("opacity", .02)
                        d3.select(this)
                            .transition()
                            .duration(800)
                            .style("opacity", 1)
                        console.log(d)
                        tip = "in " + d.properties.name + ", around " + d.data + "% of " + cate + " population is lonely.";

                        Tooltip
                            .html(tip)
                            .style("left", (d3.mouse(this)[0]*2) + "px")
                            .style("top", (d3.mouse(this)[1]*3) + "px")
                            .transition()
                            .duration(800)
                            .style("opacity", 1);

                        var yipchoroselector = d.properties.name;
                        yipsmallmultiples(yipchoroselector);

                        var t = d.data;
                        document.getElementById("yiptooltip").innerHTML = t;
                        toggle = 0;
                    }
                }
            }

            var k = (d3.max(a) - d3.min(a))/9;
            var legend = []
            for(var i = 0; i<9;i++){
                legend.push(d3.min(a)+k*i);
            };

            //console.log(legend)
            var fill = d3.scaleThreshold()
            .domain(legend)
            .range(d3.schemeBlues[9]);

            for(var i = 0; i<9;i++){
                svg.append("rect")
                    .attr("x", i*7+50)
                    .attr("y", 0)
                    .attr("width", 7)
                    .attr("height", 7)
                    .transition()
                    .duration(800)
                    .attr("fill", function(d){
                    return fill(d3.min(a)+k*i);
                }); 
            }


            var text = "Data (by Population Percentage):"
            var label = "0%" + grid2 + "50%" + grid2 + "100%<br>";
            var t = label + gradients;
            document.getElementById("yiptooltip").innerHTML = t;

            // Draw the map
            svg.append("g")
                .selectAll(".lucypath2")
                .data(topo.features)
                .enter()
                .append("path")
                .attr("class","lucypath2 Country")
                .attr("d", d3.geoPath().projection(projection))
                .style("stroke", "transparent")
                .style("opacity", 0)
                .transition()
                .duration(800)
                .attr("fill", function (d) {
                d.data = data.get(d.id) || "no data";
                if(d.data !== "no data"){
                    return fill(d.data);
                };
            })
                .style("opacity", 1);


            d3.selectAll(".lucypath2")
                .on("click", mouseClick)
                .on("mouseover", mouseOver)
                .on("mouseleave", mouseLeave)


        }


        var gradients = "<svg height='50' width='200'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' style='stop-color:#FEE5D9;stop-opacity:1' /><stop offset='30%' style='stop-color:#ff1100;stop-opacity:1' /><stop offset='70%' style='stop-color:#8a0000;stop-opacity:1' /><stop offset='100%' style='stop-color:#690000;stop-opacity:1' /></linearGradient></defs><rect x='3' y='0' width='200'height='15' fill='url(#grad)' /></svg>"
        var grid2 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        var grid = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";

    }
};