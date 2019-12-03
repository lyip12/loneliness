//Main function, update visualization upon scrolling
var scrollVis = function () {

    var displaydata;
    var colorInterpolator = d3.interpolateRgb(d3.color("#ff6666"),d3.color("#8293b6"));
    // constants to define the size
    // and margins of the vis area.
    var width = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.6;
    var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)*0.6;

    // Keep track of which visualization we are on and which was the last
    // index activated. When user scrolls quickly, we want to call all the
    // activate functions that they pass.
    var lastIndex = -1;
    var activeIndex = 0;

    // Sizing for the grid visualization
    var numPerRow = 30;
    var numPerCol = 30;

    var circleSize = Math.floor(width/numPerRow*2/3);
    var circlePad =  Math.floor(width/numPerRow/3);

    var margin = { top: circleSize/2, bottom: 0, left: circleSize/2, right: 0 };
    // main svg used for visualization
    var svg = d3.select("#matrixvis");

    // d3 selection that will be used for displaying visualizations
    var g = null;

    // When scrolling to a new section the activation function for that section is called.
    var activateFunctions = [];

    // If a section has an update function then it is called while scrolling
    // through the section with the current    // progress through the section.
    var updateFunctions = [];



    /**chart**/
    var chart = function (selection) {
        selection.each(function (rawData) {
            // create svg and give it a width and height

            var matrixData = wrangleData(rawData);

            svg = d3.select(this).selectAll('svg').data(matrixData["prevalence"]);
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

            console.log(matrixData)
            setupVis(matrixData);

            //setupVis(displayData);

            setupSections();
        });
    };


    /**
     * setupVis - creates initial elements for all
     * sections of the visualization.*/
    var setupVis = function (displayData) {
        // square grid
        // @v4 Using .merge here to ensure
        // new and old data have same attrs applied

        var firstdata = displayData["Fewer Confidants"];
        console.log(firstdata);
        var circles = g.selectAll('.circle').data(firstdata);//.prevalence);

        //console.log(displayData);

        var circlesE = circles.enter()
            .append('circle')
            .classed('circle', true);

        circles = circles.merge(circlesE)
            .attr('r', circleSize/2)
            .attr('fill', '#fff')
            .classed('fill-circle', true)
            .attr('cx', function (d, i)
            {
                let col = i%numPerRow;
                let x = (col*circleSize) +(col*circlePad)
                return (col*circleSize) +(col*circlePad);
            })
            .attr('cy', function (d, i) {
                let row =Math.floor( i / numPerRow);
                let y = (row*circleSize)+(row*circlePad);
                return (row*circleSize)+(row*circlePad);
            })
            .attr('opacity', 0);

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
        g.selectAll('.circle')
            .transition()
            .duration(600)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.8)
            .attr('fill', '#fff');
    }

    function highlightPre() {

        g.selectAll('.circle')
            .transition()
            .duration(600)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.fill-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });


        g.selectAll('.fill-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) { return d.filler ? 1 : 0.3; })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });

    }

    function highlightAge() {

        var circles =  g.selectAll('.circle')
            .data(displaydata["employment"])
            .classed('age-circle', function (d) { return d.filler; })
            .transition()

        circles.duration(800)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.age-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

        //console.log(displaydata["martial status"]);
        g.selectAll('.age-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) {
                if(d.filler == true)
                {return 1}
                else if (d.filler == false)
                {
                    return 0.3
                }
            })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });
    }

    function highlightMartial() {

        var circles =  g.selectAll('.circle')
            .data(displaydata["Fewer Confidants"])
            .classed('m-circle', function (d) { return d.filler; })
            .transition()

        circles.duration(800)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.m-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

        g.selectAll('.m-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) { return d.filler ? 1 : 0.3; })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });
    }

    function highlightEvent() {

        var circles =  g.selectAll('.circle')
            .data(displaydata["specific events"])
            .classed('e-circle', function (d) { return d.filler; })
            .transition()

        circles.duration(800)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.e-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

        g.selectAll('.e-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) { return d.filler ? 1 : 0.3; })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });
    }

    function highlightImpact() {

        var circles =  g.selectAll('.circle')
            .data(displaydata["impact"])
            .classed('im-circle', function (d) { return d.filler; })
            .transition()

        circles.duration(800)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.im-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

        g.selectAll('.im-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) { return d.filler ? 1 : 0.3; })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });
    }


    function highlightInt() {

        var circles =  g.selectAll('.circle')
            .data(displaydata["martial status"])
            .classed('it-circle', function (d) { return d.filler; })
            .transition()

        circles.duration(800)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 0.3)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.it-circle')
            .transition('move-fills')
            .duration(800)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            });

        g.selectAll('.it-circle')
            .transition()
            .duration(800)
            .attr('opacity', function (d) { return d.filler ? 1 : 0.3; })
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });
    }
    // wrangle and parse data to fit visualization
    function wrangleData(data, matrixsize=numPerRow*numPerRow)
    {
        //rewrite the csv file into json file for easier data parsing
        var displayData = {};
        var namelist = d3.nest().key(function(d){return d.category})
            .rollup(function(leaves)
            {
                return d3.sum(leaves, function(d){return +d.Total});
            })
            .entries(data)
            .map(function (d) { return {Category: d.key, Value: d.value}});

        var nesteddata = d3.nest().key(function(d){return d.category})
        .entries(data);

        //console.log(nesteddata);
        //console.log(namelist);

        //parse the csv file into json format for easier access.
        //meanwhile parse string into numberic representations
        nesteddata.forEach(function(g, index) {
            var category = g.values;
            //console.log(category);
            var total = namelist[index].Value;
            var dotvalue = total/matrixsize;
            var groupdata = [];

            var colorScheme = d3.quantize(colorInterpolator, category.length);

            //turn the count for each division into a matrix with different categories
            category.forEach(function(d, index){
                d.total = +d.Total;
                d.units = Math.floor(d.total/dotvalue);
                groupdata = groupdata.concat(
                        Array(d.units+1).join(1)
                            .split('')
                            .map(function(){
                                return {
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


// the function that recognize current section and call visualization fucntion respectively
function display(data) {
    // create a new plot and
    // display it
    var plot = scrollVis();
    d3.select('#matrixvis')
        .datum(data)
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
            .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

        // activate current section
        plot.activate(index);
    });

    scroll.on('progress', function (index, progress) {
        plot.update(index, progress);
    });
}

// load data and display
d3.csv('data/what are lonely people like.csv',  display);