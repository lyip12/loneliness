function display(data) {
    // create a new plot and
    // display it
    var plot = scrollVis();
    d3.select('#vis')
        .datum(data)
        .call(plot);

    // setup scroll functionality
    var scroll = scroller()
        .container(d3.select('.scroll'));

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
d3.csv('data/Cause of Specific Events.csv', display);

var scrollVis = function () {
    var width = 600;
    var height = 520;
    var margin = { top: 0, left: 20, bottom: 40, right: 10 };

    var lastIndex = -1;
    var activeIndex = 0;

    // Sizing for the grid visualization
    var squareSize = 6;
    var squarePad = 2;
    var numPerRow = width / (squareSize + squarePad);

    // main svg used for visualization
    var svg = null;

    // d3 selection that will be used
    // for displaying visualizations
    var g = null;

    // When scrolling to a new section
    // the activation function for that
    // section is called.
    var activateFunctions = [];
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    var updateFunctions = [];

    var chart = function (selection) {
        selection.each(function (rawData) {
            // create svg and give it a width and height
            svg = d3.select(this).selectAll('svg').data([wordData]);
            var svgE = svg.enter().append('svg');
            // @v4 use merge to combine enter and existing selection
            svg = svg.merge(svgE);

            svg.attr('width', width + margin.left + margin.right);
            svg.attr('height', height + margin.top + margin.bottom);

            svg.append('g');


            // this group element will be used to contain all
            // other elements.
            g = svg.select('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            setupVis();

            setupSections();
        });
    };
    var setupVis = function(){
        var squares = g.selectAll('.square').data(wordData, function (d) { return d.word; });
        var squaresE = squares.enter()
            .append('rect')
            .classed('square', true);
        squares = squares.merge(squaresE)
            .attr('width', squareSize)
            .attr('height', squareSize)
            .attr('fill', '#fff')
            .classed('fill-square', function (d) { return d.filler; })
            .attr('x', function (d) { return d.x;})
            .attr('y', function (d) { return d.y;})
            .attr('opacity', 0);


    }

    var setupSections = function () {
        activateFunctions[0] = showGrid;
        activateFunctions[1] = highlightGrid;
    }

    function showGrid() {
        g.selectAll('.count-title')
            .transition()
            .duration(0)
            .attr('opacity', 0);

        g.selectAll('.square')
            .transition()
            .duration(600)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 1.0)
            .attr('fill', '#ddd');
    }

    /**
     * highlightGrid - show fillers in grid
     *
     * hides: barchart, text and axis
     * shows: square grid and highlighted
     *  filler words. also ensures squares
     *  are moved back to their place in the grid
     */
    function highlightGrid() {
        g.selectAll('.bar')
            .transition()
            .duration(600)
            .attr('width', 0);

        g.selectAll('.bar-text')
            .transition()
            .duration(0)
            .attr('opacity', 0);


        g.selectAll('.square')
            .transition()
            .duration(0)
            .attr('opacity', 1.0)
            .attr('fill', '#ddd');

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.fill-square')
            .transition('move-fills')
            .duration(800)
            .attr('x', function (d) {
                return d.x;
            })
            .attr('y', function (d) {
                return d.y;
            });

        g.selectAll('.fill-square')
            .transition()
            .duration(800)
            .attr('opacity', 1.0)
            .attr('fill', function (d) { return d.filler ? '#008080' : '#ddd'; });
    }

    chart.activate = function (index) {
        activeIndex = index;
        var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
        var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
        scrolledSections.forEach(function (i) {
            activateFunctions[i]();
        });
        lastIndex = activeIndex;
    };

    /**
     * update
     *
     * @param index
     * @param progress
     */
    chart.update = function (index, progress) {
        updateFunctions[index](progress);
    };
};




