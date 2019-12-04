MatrixMain()

function MatrixMain()
{
    /**common variables**/
        // Keep track of which visualization we are on and which was the last
        // index activated. When user scrolls quickly, we want to call all the
        // activate functions that they pass.
    var lastIndex = -1;
    var activeIndex = 0;

    var width = Math.min(document.documentElement.clientHeight,
        window.innerHeight,
        document.documentElement.clientWidth,
        window.innerWidth)*0.6;
    var height = width;

    // Sizing for the grid visualization
    var numPerRow = 30;
    var numPerCol = 30;

    var circleSize = Math.floor(width/numPerRow*2/3);
    var circlePad =  Math.floor(width/numPerRow/3);

    // constants to define the size and margins of the vis area.
    var margin = { top: circleSize/2, bottom: 0, left: circleSize/2, right: 0 };


    var relative = false;

    var namelist;

    d3.csv('data/what are lonely people like.csv',  initVis);

    // the function that recognize current section and call visualization function respectively
    function initVis(data) {
        var displayData = wrangleData(data, numPerRow * numPerCol);
        console.log(displayData)
        var plot = scrollVis(displayData);
        d3.select('#matrixvis')
            .datum(displayData)
            .call(plot);

        // setup scroll functionality
        var scroll = scroller()
            .container(d3.select('#floatingarea'));

        // pass in .step selection as the steps
        scroll(d3.selectAll('.step'));

        // setup event handling
        scroll.on('active', function (index) {
            // highlight current step text
            d3.selectAll('.step')
                .style('opacity', function (d, i) {
                    return i === index ? 1 : 0.1;
                });

            // activate current section
            plot.activate(index);
        });
    }

    // wrangle and parse data to fit visualization
    function wrangleData(data, matrixsize)
    {
        //rewrite the csv file into json file for easier data parsing
        var displayData = {};
        namelist = d3.nest().key(function(d){return d.category})
            .rollup(function(leaves)
            {
                return d3.sum(leaves, function(d){return +d.Total});
            })
            .entries(data)
            .map(function (d) { return {Category: d.key, Value: d.value}});

        var nesteddata = d3.nest().key(function(d){return d.category})
            .entries(data);

        console.log(nesteddata);
        //console.log(namelist);

        //parse the csv file into json format for easier access.
        //meanwhile parse string into numberic representations
        nesteddata.forEach(function(g, index) {
            var category = g.values;
            //console.log(category);
            var total = namelist[index].Value;
            var dotvalue = total/matrixsize;
            var groupdata = [];

            var colorInterpolator = d3.interpolateRgb(d3.color("#ff6666"),d3.color("#8293b6"));
            var colorScheme = d3.quantize(colorInterpolator, category.length);

            //turn the count for each division into a matrix with different categories
            category.forEach(function(d, index){
                d.total = +d.Total;
                d.units = Math.ceil(d.total/dotvalue)%matrixsize;;
                d.maxindex = index
                groupdata = groupdata.concat(
                    Array(d.units+1).join(1)
                        .split('')
                        .map(function(){
                            return {
                                maxindex: d.maxindex,
                                dotvalue: dotvalue,
                                division: d.division,
                                units:d.units,
                                total: +g.Total,
                                index: index,
                                fill: colorScheme[index]
                            };
                        })
                )
            });
            //console.log(groupdata);
            displayData[namelist[index].Category] = groupdata;
        });
        console.log(displayData);
        return displayData;
    }



    //Main function, update visualization upon scrolling
    function scrollVis(matrixData) {
        var svg = d3.select("#matrixvis");

        // d3 selection that will be used for displaying visualizations
        var g;

        // When scrolling to a new section the activation function for that section is called.
        var activateFunctions = [];

        // If a section has an update function then it is called while scrolling
        // through the section with the current    // progress through the section.
        var updateFunctions = [];

 /*       var button =  d3.selectAll(".step")
            .append("button")
            .classed("matrixbutton", true)
            .attr("x", width/2)
            .attr("y", height/2)
            .attr("color", "#fff")
            .text("Absolute")
            .on('click', function () {
                relative = !relative;
                if (relative){d3.select(this).text("Relative");}
                else{d3.select(this).text("Absolute");}
                updateMatrix();
            })*/


        var skipbutton =  d3.selectAll(".step")
            .append("button")
            .classed("matrixbutton", true)
            .attr("id", "skipmatrix")
            .attr("x", width/2+20)
            .attr("y", height/2)
            .attr("color", "#fff")
            .text("Skip Matrix")
            .on('click', function () {
                var $target = $('#skipmatrix');

                var top = document.getElementById("#choloraftermatrix").offsetTop();
                console.log(top);
                window.scrollTo(0, top);
            })


        function updateMatrix(){
            // create a new plot and display it
            d3.selectAll('.circle')
                .transition()
                .duration(300)
                .attr("cx", function(d, i){return d3.select(this).cx/2})
                .attr("cy", function(d, i){return d3.select(this).cy/2})
                .attr("r", circleSize/9)

        }

        /**chart**/
        var chart = function (selection) {
            selection.each(function (matrixData) {
                // create svg and give it a width and height

                svg = d3.select(this).selectAll('svg').data([matrixData.prevalence]);
                var svgE = svg.enter().append('svg');
                // @v4 use merge to combine enter and existing selection
                svg = svg.merge(svgE);

                svg.attr('width', width);
                svg.attr('height', height);

                svg.append('g');


                // this group element will be used to contain all
                // other elements.
                g = svg.select('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                setupVis(matrixData);

                setupSections();
            });
        };

        var circles;
        /**setupVis - creates initial elements for all sections of the visualization.*/
        var setupVis = function (matrixData) {
            console.log(matrixData)

            // square grid
            // @v4 Using .merge here to ensure
            // new and old data have same attrs applied

            var firstdata = matrixData["prevalence"];
            console.log(firstdata);

//            var circles = g.selectAll(".circle").append('circle').data(firstdata).classed('circle', true);

            circles = g.selectAll('.circle')
                //.merge(circles)
                .data(firstdata)
                .enter()
                .append('circle')
                .classed("fill-circle",true)
                .attr('r', circleSize/2)
                .attr('fill', '#fff')
                .attr('cx', function (d, i)
                {
                    let col = i%numPerRow;
                    return (col*circleSize) +(col*circlePad);
                })
                .attr('cy', function (d, i) {
                    let row =Math.floor( i / numPerRow);
                    return (row*circleSize)+(row*circlePad);
                })
                .attr('opacity', 0.1);

            //circles.transition().attr('cx')

        };

        var setupSections = function () {
            // activateFunctions are called each
            // time the active section changes
            activateFunctions[0] = showGrid;
            activateFunctions[1] = highlightPre;
            activateFunctions[2] = highlightAge;
            activateFunctions[3] = highlightMartial;
            activateFunctions[4] = highlightEvent;
            activateFunctions[5] = highlightImpact;
            activateFunctions[6] = highlightInt;

            // updateFunctions are called while in a particular section to update
            // the scroll progress in that section. Most sections do not need to be updated
            // for all scrolling and so are set to no-op functions.
            for (var i = 0; i < 9; i++) {
                updateFunctions[i] = function () {};
            }
        };

        function showGrid() {
            circles
                .transition()
                .delay(function (d,i) {
                   return 50 * getrownum(i);
                })
                .duration(800)
                .attr('opacity', 0.8)
                .attr("fill", "#fff")
            ;
        }

        function getrownum(i){
            return Math.floor( i / numPerRow);
        }

        function highlightPre(index) {
            console.log("hightlightpre")
            circles
                .data(matrixData["prevalence"])
                .classed('age-circle',true)
                .transition()
                .delay(function (d,i) {
                    return 50 * getrownum(i);
                })
                .duration(600)
                .attr("opacity", function(d){
                    if (d.index === 0 || d.index ===Math.floor(d3.max(d.index)/2)) return 0.8;
                    return 0.3;
                })
                .attr("fill", function (d){return d.fill})


            /*circles.duration(800)
                .delay(function (d) {
                    return 5 * getrownum(i);
                })
                .attr('opacity', 0.3)
                .attr('fill', '#ddd');

            // use named transition to ensure
            // move happens even if other
            // transitions are interrupted.
            g.selectAll('.age-circle')
                .transition('move-fills')
                .duration(800)
                .attr('cx', function (d, i) {
                    let col = i%numPerRow;
                    return (col*circleSize) +(col*circlePad);
                })
                .attr('cy', function (d, i) {
                    let row =Math.floor( i / numPerRow);
                    return (row*circleSize)+(row*circlePad);
                });

            g.selectAll('.age-circle')
                .transition()
                .duration(800)
                .attr('opacity', function (d) {
                    d.fill/6
                })
                .attr('fill', function (d) { return d.fill; });
        */}


        function highlightAge() {

            console.log("hightlightage")
            circles
                .data(matrixData["age"])
                .classed('age-circle',true)
                .transition()
                .delay(function (d,i) {
                    return 50 * getrownum(i);
                })
                .duration(600)
                .attr("opacity", function(d){
                    if (d.index === 1 || d.index ===3) return 0.8;
                    return 0.3;
                })
                .attr("fill", function (d){return d.fill})
        }



        function highlightMartial() {

            console.log("hightlightmar")
            circles
                .data(matrixData["martial status"])
                //.classed('age-circle',true)
                .transition()
                .delay(function (d,i) {
                    return 50 * getrownum(i);
                })
                .duration(600)
                .attr("opacity", function(d){
                    if (d.index === 0 || d.index ==2) return 0.8;
                    return 0.3;
                })
                .attr("fill", function (d){return d.fill})
        }

        function highlightEvent() {

            circles
                .data(matrixData["specific events"])
                //.classed('age-circle',true)
                .transition()
                .delay(function (d,i) {
                    return 50 * getrownum(i);
                })
                .duration(600)
                .attr("opacity", function(d){
                    if (d.index === 0 || d.index ==2) return 0.8;
                    return 0.3;
                })
                .attr("fill", function (d){return d.fill})
        }

        function highlightImpact() {

            circles
                .data(matrixData["Fewer Confidants"])
                //.classed('age-circle',true)
                .transition()
                .delay(function (d,i) {
                    return 50 * getrownum(i);
                })
                .duration(600)
                .attr("opacity", function(d){
                    if (d.index === 0 ) return 0.8;
                    return 0.3;
                })
                .attr("fill", function (d){return d.fill})
        }

        function highlightInt() {

            circles
                .data(matrixData["employment"])
                //.classed('age-circle',true)
                .transition()
                .delay(function (d,i) {
                    return 50 * getrownum(i);
                })
                .duration(600)
                .attr("opacity", function(d){
                    if (d.index ===1 || d.index ==2) return 0.8;
                    return 0.3;
                })
                .attr("fill", function (d){return d.fill})
        }

            /* // use named transition to ensure
             // move happens even if other
             // transitions are interrupted.
             g.selectAll('.it-circle')
                 .transition('move-fills')
                 .duration(800)
                 .attr('cx', function (d, i) {
                     let col = i%numPerRow;
                     return (col*circleSize) +(col*circlePad);
                 })
                 .attr('cy', function (d, i) {
                     let row =Math.floor( i / numPerRow);
                     return (row*circleSize)+(row*circlePad);
                 });

             g.selectAll('.it-circle')
                 .transition()
                 .duration(800)
                 .attr('opacity', function (d) { return d.index/12})
                 .attr('fill', function (d) { return d.fill});
         }*/

        chart.activate = function (index) {
            activeIndex = index;
            var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
            var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
            scrolledSections.forEach(function (i) {
                activateFunctions[i](index);
            });
            lastIndex = activeIndex;
        };

        chart.update = function (index, progress) {
            updateFunctions[index](progress);
        };

        // return chart function
        return chart;
    };

    //control button: Switch Between Absolute Percentage Matrix and Relative Percentage Matrix

}