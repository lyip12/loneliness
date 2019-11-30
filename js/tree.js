tree()

//Example taken directly from https://bl.ocks.org/d3noob/80c100e35817395e88918627eeeac717 with edits

function tree(){

    var svg2 = d3.select(".yiptree")
    .classed("yipsvg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-220 0 1200 1000")
    .classed("svg-content-responsive", true);

    var i = 0, duration = 800,root;
    var treemap = d3.tree()
    .size([1000, 1000]);


    d3.json("data/cause-of-loneliness.json", function(error, treeData) {
        root = d3.hierarchy(treeData, function(d) { return d.children; });
        root.x0 = 500 / 2;
        root.y0 = 0;
        root.children.forEach(collapse);
        update(root);
    });

    function collapse(d) {
        if(d.children) {
            d._children = d.children
        }
    }

    function update(source) {
        var treeData = treemap(root);

        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);

        // Change the depth of vis
        nodes.forEach(function(d){ d.y = d.depth * 150});

        var node = svg2.selectAll('g.yipnode')
        .data(nodes, function(d) {return d.id || (d.id = ++i); });


        //All directly from /bl.ocks.org/

        // Enter any new modes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
        .attr('class', 'yipnode')
        .attr("transform", function(d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on('click', click);

        // Add Circle for the nodes
        nodeEnter.append('circle')
            .attr('class', 'yipnode')
            .attr('r', 1e-6)
            .style("fill", function(d) {
            return d._children;
        });

        // Add labels for the nodes
        nodeEnter.append('text')
            .attr("class", "nodetitle")
            .attr("dy", function(d) {
            return d.children || d._children ? 5 : 5;
        })
            .attr("x", function(d) {
            return d.children || d._children ? -30 : 30;
        })
            .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
            .text(function(d) { return d.data.name; })
            .attr("fill", function(d){
            if(d.data.importance == 12){
                return "white";
            } else if (d.data.importance == 10){
                return "#dfecf7";
            } else if (d.data.importance == 8){
                return "#9ecae1";
            } else if (d.data.importance == 6){
                return "#4293c7";
            } else {
                return "#08529d";
            };
        })
        nodeEnter.append('text')
            .attr("dy", function(d) {
            return d.children || d._children ? 25 : 25;
        })
            .attr("x", function(d) {
            return d.children || d._children ? -30 : 30;
        })
            .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
            .text(function(d) { if(d.data.info !== "null"){return d.data.info;}else{return " ";} })
            .attr("fill", "#8293b6")
            .attr("opacity", "1");

        // UPDATE
        var nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the node
        nodeUpdate.transition()
            .duration(duration)
            .attr("transform", function(d) { 
            return "translate(" + d.y + "," + d.x + ")";
        });

        // Update the node attributes and style
        nodeUpdate.select('circle.yipnode')
            .attr('r', function(d){
            return d.data.importance;
        })
            .style("fill", function(d) {
            return d._children;
        })
            .attr('cursor', 'pointer')
            .attr('fill', function(d){
            if(d.data.importance == 12){
                return "white";
            } else if (d.data.importance == 10){
                return "#dfecf7";
            } else if (d.data.importance == 8){
                return "#9ecae1";
            } else if (d.data.importance == 6){
                return "#4293c7";
            } else {
                return "#08529d";
            };
        });


        // Remove any exiting nodes
        var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
            .attr('r', 1);

        // On exit reduce the opacity of text labels
        nodeExit.select('text')
            .style('fill-opacity', 1);

        // ****************** links section ***************************

        // Update the links...
        var link = svg2.selectAll('path.yiplink')
        .data(links, function(d) { return d.id; });

        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert('path', "g")
        .attr("class", "yiplink")
        .attr('d', function(d){
            var o = {x: source.x0, y: source.y0}
            return diagonal(o, o)
        });

        // UPDATE
        var linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(duration)
            .attr('d', function(d){ return diagonal(d, d.parent) });

        // Remove any exiting links
        var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
            var o = {x: source.x, y: source.y}
            return diagonal(o, o)
        })
        .remove();

        // Store the old positions for transition.
        nodes.forEach(function(d){
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {

            path = `M ${s.y} ${s.x} C ${(s.y + d.y) / 2} ${s.x}, ${(s.y + d.y) / 2} ${d.x}, ${d.y} ${d.x}`
            return path
        }

        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }
}