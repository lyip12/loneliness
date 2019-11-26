demographicschorovis() // for avoiding naming issue

function demographicschorovis(){
    var toggle;
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
        //var selector2 = d3.select("#yipstats").property("value2");

        if(selector == "One_Person_Household_Frequent"){ var cate = "one person household"; } else if(selector == "Mutiple_People_Household_Frequent"){ var cate = "multiple people household"; } else if(selector == "Conflict_Never_Frequent"){ var cate = "no conflict household"; } else if(selector == "Conflict_Sometimes_Frequent"){ var cate = "sometimes conflict household"; } else if(selector == "Conflict_Often_Frequent"){ var cate = "often conflicting household"; } else if(selector == "No_Confidant_Frequent"){ var cate = "no confidant"; } else if(selector == "At_Least_One_Confidant_Frequent"){ var cate = "more than one confidant"; } else if(selector == "Native_Frequent"){ var cate = "native (local)"; } else if(selector == "Immigrant_Frequent"){ var cate = "immigrant"; } else if(selector == "Ethnic_Minority_Frequent"){ var cate = "ethinic minority"; } else if(selector == "Ethnic_Majority_Frequent"){ var cate = "ethnic majority"; } else if(selector == "Religious_Frequent"){ var cate = "religious"; } else if(selector == "Non_Religious_Frequent"){ var cate = "non-religious"; } else if(selector == "Big_City_Frequent"){ var cate = "big city"; } else if(selector == "Suburb_Frequent"){ var cate = "suburb"; } else if(selector == "Small_City_Frequent"){ var cate = "small city"; } else if(selector == "Countryside_Frequent"){ var cate = "countryside"; } else if(selector == "Unemployed_Past_Year_Frequent"){ var cate = "past year unemployed"; } else if(selector == "Unemployed_Past_Month_Frequent"){ var cate = "past month unemployed"; } else if(selector == "Unemployed_Past_Days_Frequent"){ var cate = "past days unemployed"; } else if(selector == "Employed_Frequent"){ var cate = "employed"; } else if(selector == "Income_Comfortable_Frequent"){ var cate = "comfortable income"; } else if(selector == "Income_Coping_Frequent"){ var cate = "coping income"; } else if(selector == "Income_Difficult_Frequent"){ var cate = "difficult income"; } else if(selector == "Income_Very_Difficult_Frequent"){ var cate = "very difficult income"; } else { var cate = "all"; };

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
                        .duration(100)
                        .style("opacity", .1)
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .style("opacity", 1)
                    //console.log("tis is working")
                        .attr('cursor', 'pointer');
                }
            }

            let mouseLeave = function(d) {
                if(toggle !== 0 && d.data !== "no data"){
                    d3.selectAll(".Country")
                        .transition()
                        .duration(100)
                        .style("opacity", 1)
                    d3.select(this)
                        .transition()
                        .duration(100)
                }
            }

            let mouseClick = function (d) {
                if(toggle == 0) {
                    d3.selectAll(".Country")
                        .transition()
                        .duration(300)
                        .style("opacity", 1)
                    d3.select(this)
                        .transition()
                        .duration(300)
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
                            .duration(300)
                            .style("opacity", .02)
                        d3.select(this)
                            .transition()
                            .duration(800)
                            .style("opacity", 1)
                        tip = "in " + d.properties.name + ", around " + d.data + "% of " + cate + " population is frequently lonely.";

                        Tooltip
                            .html(tip)
                            .style("left", (d3.mouse(this)[0]*2) + "px")
                            .style("top", (d3.mouse(this)[1]*2.5) + "px")
                            .transition()
                            .duration(300)
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

                if(i==0){  
                    svg.append("rect")
                        .attr("x", 74)
                        .attr("y", 0)
                        .attr("width", 38)
                        .attr("height", 76)
                        .transition()
                        .duration(800)
                        .attr("fill", "#0c0e12"); 

                    svg.append("text")
                        .attr("x", 90)
                        .attr("y", 73)
                        .attr("font-family", "'Roboto', sans-serif")
                        .attr("font-size", "4px")
                        .attr("fill", "#8293b6")
                        .text("0.00%");
                }

                svg.append("rect")
                    .attr("x", 80)
                    .attr("y", 64-i*7)
                    .attr("width", 7)
                    .attr("height", 7)
                    .transition()
                    .duration(800)
                    .attr("fill", function(d){
                    return fill(d3.min(a)+k*i);
                }); 

                var num = d3.min(a)+k*(i+1);
                var n = num.toFixed(2);

                svg.append("rect")
                    .attr("x", 80)
                    .attr("y", 64-i*7)
                    .attr("width", 7)
                    .attr("height", 7)
                    .transition()
                    .duration(800)
                    .attr("fill", function(d){
                    return fill(d3.min(a)+k*i);
                }); 

                svg.append("text")
                    .attr("x", 90)
                    .attr("y", 66-i*7)
                    .attr("font-family", "'Roboto', sans-serif")
                    .attr("font-size", "4px")
                    .attr("fill", "#8293b6")
                    .text(n + "%");

            }


            var t = " "
            document.getElementById("yiptooltip").innerHTML = t;

            d3.selectAll(".lucypath2")
                .transition()
                .duration(800)
                .remove();

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
    }
};