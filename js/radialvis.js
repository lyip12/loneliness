radialvisMain()

function radialvisMain(){
    
    var oddsRatio;
    var oddsRatioDimensions = ['Confidant','Single-Person','Unemployed','Discriminated','Supervisor','Religion','EthnicMinority','Immigrant']
    var oddsRatioCountries;
    var oddsRatioStacked;
    var radialArea;
    var countryAreaPaths;
    // Load Data
    queue()
    .defer(d3.csv, "data/OddsRatioByFactor.csv")
    .await(createRadialVis);



    function createRadialVis(error, oddsRatioData){
        oddsRatioCountries = oddsRatioData.columns.slice(1,);
        oddsRatio = oddsRatioData.slice();
        oddsRatio.forEach((d,i) => {
            for (const property in d){
                if (property != 'Factor'){
                    d[property] = + d[property] 
                    if (Number.isNaN(d[property])){
                        d[property] = 1.0;   // 1 means not positive realted or negative related
                    }
                }
            }
        })

        initRadialVis()
    }
    
    function initRadialVis(){
       var svg = d3.select("#dugy-radial")
                //responsive layout from 
                //https://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js
                .classed("svg-container", true)
                .append("svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", "0 0 600 400")
                .classed("svg-content-responsive", true)
                .append('g')
                .attr("transform", "translate(" + 200 + "," +200 + ")");



        var stack = d3.stack().keys(oddsRatioCountries);
    
        // Call shape function on the dataset
        oddsRatioStacked = stack(oddsRatio);
        console.log(oddsRatioStacked);

        // scale
        var angleScale = d3.scaleLinear()
        .range([0, 2 * Math.PI])
        .domain([0, oddsRatioDimensions.length]);

        var rmax = d3.max(oddsRatioStacked, d=> {return d3.max(d, e=> e[1])});
        var innerRadius = 50;
        var outerRadius = 150;
        
        var radiusScale = d3.scaleLinear()
                            .domain([0,rmax])
                            .range([innerRadius,outerRadius]);
       
        // axes

        radiusAxis = d3.axisLeft().scale(radiusScale);

        svg.selectAll(".dugy-radial-axis")
            .data(d3.range(angleScale.domain()[1]))
            .enter().append("g")
            .attr("class", "dugy-radial-axis")
            .attr("transform", function(d) { return "rotate(" + angleScale(d) * 180 / Math.PI + ")"; })
            .call(radiusAxis);
            // .append("text")
            // .attr("y", -innerRadius + 6)
            // .attr("dy", ".71em")
            // .attr("text-anchor", "middle")
            // .text(function(d) { return formatDay(d); });


        // area paths                    
        radialArea = d3.areaRadial()
                       .curve(d3.curveCardinalClosed)
                       .angle(function(d,i) { return angleScale(i);})
                       .innerRadius(function(d) { return radiusScale(d[0]);})
                       .outerRadius(function(d) { return radiusScale(d[1]);});
        
        countryAreaPaths = svg.selectAll(".dugy-radial-area")
                        .data(oddsRatioStacked, function(d){return d.key});
        countryAreaPaths.enter().append("path")
                    .attr("class", "dugy-radial-area")
                    .merge(countryAreaPaths)
                    .style("fill", function(d,i) {
                        return '#ff6666';})
                    .style("opacity",function(d,i){
                        return (25-i) /30;
                    })
                    .attr("d", function(d) {
                            return radialArea(d);
                    })
                    .on('mouseover', function(d,i) {
                        d3.select(this).style("opacity", 1)})
                    .on('mouseleave', function(d,i) {
                        d3.select(this).style("opacity", 
                            (25-i) /30
                        )});
        countryAreaPaths.exit().remove();
               
    }

}



