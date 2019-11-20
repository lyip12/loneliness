if(window.attachEvent) {
    window.attachEvent('onresize', function() {
        alert('attachEvent - resize');
    });
}
else if(window.addEventListener) {
    window.addEventListener('resize', function() {
        console.log('addEventListener - resize');
    }, true);
}
else {
    //The browser does not support Javascript event binding
}

var scrollVis = function () {
    // constants to define the size
    // and margins of the vis area.
    var width = 600;
    var height = 520;
    var margin = { top: 0, left: 20, bottom: 40, right: 10 };

    // Keep track of which visualization
    // we are on and which was the last
    // index activated. When user scrolls
    // quickly, we want to call all the
    // activate functions that they pass.
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

    // We will set the domain when the
    // data is processed.
    // @v4 using new scale names
    var xBarScale = d3.scaleLinear()
        .range([0, width]);

    // The bar chart display is horizontal
    // so we can use an ordinal scale
    // to get width and y locations.
    // @v4 using new scale type
    var yBarScale = d3.scaleBand()
        .paddingInner(0.08)
        .domain([0, 1, 2])
        .range([0, height - 50], 0.1, 0.1);

    // Color is determined just by the index of the bars
    var barColors = { 0: '#008080', 1: '#399785', 2: '#5AAF8C' };

    // The histogram display shows the
    // first 30 minutes of data
    // so the range goes from 0 to 30
    // @v4 using new scale name
    var xHistScale = d3.scaleLinear()
        .domain([0, 30])
        .range([0, width - 20]);

    // @v4 using new scale name
    var yHistScale = d3.scaleLinear()
        .range([height, 0]);

    // The color translation uses this
    // scale to convert the progress
    // through the section into a
    // color value.
    // @v4 using new scale name
    var coughColorScale = d3.scaleLinear()
        .domain([0, 1.0])
        .range(['#008080', 'red']);

    // You could probably get fancy and
    // use just one axis, modifying the
    // scale, but I will use two separate
    // ones to keep things easy.
    // @v4 using new axis name
    var xAxisBar = d3.axisBottom()
        .scale(xBarScale);

    // @v4 using new axis name
    var xAxisHist = d3.axisBottom()
        .scale(xHistScale)
        .tickFormat(function (d) { return d + ' min'; });

    // When scrolling to a new section
    // the activation function for that
    // section is called.
    var activateFunctions = [];
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    var updateFunctions = [];

    /**
     * chart
     *
     * @param selection - the current d3 selection(s)
     *  to draw the visualization in. For this
     *  example, we will be drawing it in #vis
     */
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

            // perform some preprocessing on raw data
            var wordData = getWords(rawData);
            // filter to just include filler words
            var fillerWords = getFillerWords(wordData);

            // get the counts of filler words for the
            // bar chart display
            var fillerCounts = groupByWord(fillerWords);
            // set the bar scale's domain
            var countMax = d3.max(fillerCounts, function (d) { return d.value;});
            xBarScale.domain([0, countMax]);

            // get aggregated histogram data

            var histData = getHistogram(fillerWords);
            // set histogram's domain
            var histMax = d3.max(histData, function (d) { return d.length; });
            yHistScale.domain([0, histMax]);

            setupVis(wordData, fillerCounts, histData);

            setupSections();
        });
    };


    /**
     * setupVis - creates initial elements for all
     * sections of the visualization.
     *
     * @param wordData - data object for each word.
     * @param fillerCounts - nested data that includes
     *  element for each filler word type.
     * @param histData - binned histogram data
     */
    var setupVis = function (wordData, fillerCounts, histData) {
        // axis
        g.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxisBar);
        g.select('.x.axis').style('opacity', 0);


        // square grid
        // @v4 Using .merge here to ensure
        // new and old data have same attrs applied
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


        // histogram
        // @v4 Using .merge here to ensure
        // new and old data have same attrs applied
        var hist = g.selectAll('.hist').data(histData);
        var histE = hist.enter().append('rect')
            .attr('class', 'hist');
        hist = hist.merge(histE).attr('x', function (d) { return xHistScale(d.x0); })
            .attr('y', height)
            .attr('height', 0)
            .attr('width', xHistScale(histData[0].x1) - xHistScale(histData[0].x0) - 1)
            .attr('fill', barColors[0])
            .attr('opacity', 0);
    };


    var setupSections = function () {
        // activateFunctions are called each
        // time the active section changes
        activateFunctions[0] = showGrid;
        activateFunctions[1] = highlightGrid;

        // updateFunctions are called while
        // in a particular section to update
        // the scroll progress in that section.
        // Most sections do not need to be updated
        // for all scrolling and so are set to
        // no-op functions.
        for (var i = 0; i < 9; i++) {
            updateFunctions[i] = function () {};
        }
    };


    function showGrid() {
        g.selectAll('.square')
            .transition()
            .duration(600)
            .delay(function (d) {
                return 5 * d.row;
            })
            .attr('opacity', 1.0)
            .attr('fill', '#ddd');
    }


    function highlightGrid() {
        hideAxis();

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
            .attr('fill', function (d) { return d.filler ? '#ff6666' : '#ddd'; });
    }


    function hideAxis() {
        g.select('.x.axis')
            .transition().duration(500)
            .style('opacity', 0);
    }

    function getWords(rawData) {
        return rawData.map(function (d, i) {
            // is this word a filler word?
            d.filler = (d.filler === '1') ? true : false;
            // time in seconds word was spoken
            d.time = +d.time;
            // time in minutes word was spoken
            d.min = Math.floor(d.time / 60);

            // positioning for square visual
            // stored here to make it easier
            // to keep track of.
            d.col = i % numPerRow;
            d.x = d.col * (squareSize + squarePad);
            d.row = Math.floor(i / numPerRow);
            d.y = d.row * (squareSize + squarePad);
            return d;
        });
    }


    function getFillerWords(data) {
        return data.filter(function (d) {return d.filler; });
    }

    function getHistogram(data) {
        // only get words from the first 30 minutes
        var thirtyMins = data.filter(function (d) { return d.min < 30; });
        // bin data into 2 minutes chuncks
        // from 0 - 31 minutes
        // @v4 The d3.histogram() produces a significantly different
        // data structure then the old d3.layout.histogram().
        // Take a look at this block:
        // https://bl.ocks.org/mbostock/3048450
        // to inform how you use it. Its different!
        return d3.histogram()
            .thresholds(xHistScale.ticks(10))
            .value(function (d) { return d.min; })(thirtyMins);
    }


    function groupByWord(words) {
        return d3.nest()
            .key(function (d) { return d.word; })
            .rollup(function (v) { return v.length; })
            .entries(words)
            .sort(function (a, b) {return b.value - a.value;});
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

    chart.update = function (index, progress) {
        updateFunctions[index](progress);
    };

    // return chart function
    return chart;
};



function display(data) {
    // create a new plot and
    // display it
    var plot = scrollVis();
    d3.select('#vis')
        .datum(data)
        .call(plot);

    // setup scroll functionality
    var scroll = scroller()
        .container(d3.select('#vis'));

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
d3.tsv('data/words.tsv', display);