https://gist.github.com/tomcardoso/1d44732cc7f3d97d6bf7

var WaffleChart = function() {

    var $_selector,
        $_data,
        $_label,
        $_cellSize,
        $_cellGap,
        $_rows,
        $_columns,
        $_rounded,
        $_keys,
        $_useWidth;

    var defaults = {
        size: 6,
        rows: 50,
        columns: 100,
        rounded: false,
        gap: 2
    };

    function generatedWaffleChart() {

        $_keys = d3.keys($_data[0]);

        var obj = {
            selector: $_selector,
            data: $_data,
            label: $_label,
            size: $_cellSize,
            gap: $_cellGap,
            rows: $_rows,
            columns: $_columns,
            rounded: $_rounded
        };

        drawWaffleChart(obj);

    }

    function drawWaffleChart(_obj) {

        if (!_obj.size) { _obj.size = defaults.size; }
        if (!_obj.rows) { _obj.rows = defaults.rows; }
        if (!_obj.columns) { _obj.columns = defaults.columns; }
        if (_obj.gap === undefined) { _obj.gap = defaults.gap; }
        if (_obj.rounded === undefined) { _obj.columns = defaults.rounded; }

        var formattedData = [];
        var domain = [];
        var value = $_keys[$_keys.length - 1];
        var total = d3.sum(_obj.data, function(d) { return d[value]; });

        if ($_useWidth) {
            var forcedWidth = d3.select(_obj.selector).node().getBoundingClientRect().width;
            _obj.columns = Math.floor(forcedWidth / (_obj.size + _obj.gap));
        }

        var squareVal = total / (_obj.rows * _obj.columns);

        _obj.data.forEach(function(d, i) {
            d[value] = +d[value];
            d.units = Math.floor(d[value] / squareVal);
            Array(d.units + 1).join(1).split('').map(function() {
                formattedData.push({
                    squareVal: squareVal,
                    units: d.units,
                    value: d[value],
                    groupIndex: i
                });
            });
            domain.push(d[$_keys[0]]);
        });

        var red = "#CE2A23";

        var colorInterpolator = d3.interpolateRgb(d3.color("#ff6666"),d3.color("#8293b6"));
        var color = d3.quantize(colorInterpolator, 10);

        // add label

        if (_obj.label) {
            d3.select(_obj.selector)
                .append("div")
                .attr("class", "label")
                .text(_obj.label);
        }

        // add legend

        var legend = d3.select($_selector)
            .append("div")
            .attr("class", "legend");

        var legendItem = legend.selectAll("div")
            .data(_obj.data);

        legendItem.enter()
            .append("div")
            .attr("class", function(d, i) {
                return "legend_item legend_item_" + (i + 1);
            });

        var legendIcon = legendItem.append("div")
            .attr("class", "legend_item_icon")
            .style("background-color", function(d, i) {
                if (i === 0) {
                    return red;
                } else {
                    return color(i);
                }
            });

        if (_obj.rounded) {
            legendIcon.style("border-radius", "50%");
        }

        legendItem.append("span")
            .attr("class", "legend_item_text")
            .text(function(d) { return d[$_keys[0]]; });

        // set up the dimensions

        var width = (_obj.size * _obj.columns) + (_obj.columns * _obj.gap) - _obj.gap;
        var height = (_obj.size * _obj.rows) + (_obj.rows * _obj.gap) - _obj.gap;

        if ($_useWidth) {
            width = d3.select(_obj.selector).node().getBoundingClientRect().width;
        }

        var svg = d3.select(_obj.selector)
            .append("svg")
            .attr("class", "waffle")
            .attr("width", width)
            .attr("height", height);

        var g = svg.append("g")
            .attr("transform", "translate(0,0)");

        // insert dem items

        var item = g.selectAll(".unit")
            .data(formattedData);

        item.enter()
            .append("circle")
            .attr("class", "unit")
            .attr("width", _obj.size)
            .attr("height", _obj.size)
            .attr("fill", function(d) {
                if (d.groupIndex === 0) {
                    return red;
                } else {
                    return color(d.groupIndex);
                }
            })
            .attr("cx", function(d, i) {
                var col = Math.floor(i / _obj.rows);
                return (col * (_obj.size)) + (col * _obj.gap);
            })
            .attr("cy", function(d, i) {
                var row = i % _obj.rows;
                return (_obj.rows * (_obj.size + _obj.gap)) - ((row * _obj.size) + (row * _obj.gap)) - _obj.size - _obj.gap;
            })
            .attr("r", 2)
            .append("title")
            .text(function (d, i) {
                return _obj.data[d.groupIndex][$_keys[0]] + ": " + Math.round((d.units / formattedData.length) * 100) + "%";
            });

        if (_obj.rounded) {
            item
                .attr("rx", (_obj.size / 2))
                .attr("ry", (_obj.size / 2));
        }

    }

    generatedWaffleChart.selector = function(value){
        if (!arguments.length) { return $_selector; }
        $_selector = value;
        return generatedWaffleChart;
    }

    generatedWaffleChart.data = function(value){
        if (!arguments.length) { return $_data; }
        $_data = value;
        return generatedWaffleChart;
    }

    generatedWaffleChart.useWidth = function(value){
        if (!arguments.length) { return $_useWidth; }
        $_useWidth = value;
        return generatedWaffleChart;
    }

    generatedWaffleChart.label = function(value){
        if (!arguments.length) { return $_label; }
        $_label = value;
        return generatedWaffleChart;
    }

    generatedWaffleChart.size = function(value){
        if (!arguments.length) { return $_cellSize; }
        $_cellSize = value;
        return generatedWaffleChart;
    }

    generatedWaffleChart.gap = function(value){
        if (!arguments.length) { return $_cellGap; }
        $_cellGap = value;
        return generatedWaffleChart;
    }

    generatedWaffleChart.rows = function(value){
        if (!arguments.length) { return $_rows; }
        $_rows = value;
        return generatedWaffleChart;
    }

    generatedWaffleChart.columns = function(value){
        if (!arguments.length) { return $_columns; }
        $_columns = value;
        return generatedWaffleChart;
    }

    generatedWaffleChart.rounded = function(value){
        if (!arguments.length) { return $_rounded; }
        $_rounded = value;
        return generatedWaffleChart;
    }

    return generatedWaffleChart;

};