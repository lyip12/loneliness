radialvisMain()

function radialvisMain(){

    var oddsRatio;
    var oddsRatioDimensions = ['Confidant','Single-Person','Unemployed','Discriminated','Supervisor','Religion','EthnicMinority','Immigrant']
    var lonelinessFactors = [
        'no confidant',
        'living alone',
        'unemployed',
        'being discriminated',
        'no supervisory',
        'not belong to religion'
    ]
    var topFactors = [];
    var oddsRatioCountries;
    var oddsRatioStacked;
    var oddsRatioStackedDisplayed;
    var filtering;
    var radialArea;
    var singleRadialArea;
    var countryAreaPaths;
    var countryAreaPaths2;
    var oddsCircleBackgrounds;
    var oddsCircleBackgrounds2;
    var radiusScale;
    var angleScale;
    var radiusAxis;
    var oddsAxes;
    var tickValues
    var svg;
    var innerRadius = 40;
    var outerRadius = 180;
    var maxCircleCount = 5;
    var circleCount;
    var minCircleCount = 3;
    var maxInnerRadius = 40;
    var minInnerRadius = 20;
    var maxBoundaryOffset = 10;
    var minBoundaryOffset = 5;
    var radiusBoundaryOffset = 10;
    var colorInterpolator;
    var colorScheme;

    // svg groups containers
    var circleContainer;
    var areaContainer;
    var axesContainer;
    var labelContainer;

    var explainationContainer;
    var currentCountry = 'Europe';
    var displayCountry;
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
        svg = d3.select("#dugy-radial")
        //responsive layout from 
        //https://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js
            .classed("dugy-svg-container", true)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 400 400")
            .classed("dugy-svg-content-responsive", true)
            .append('g')
            .attr("transform", "translate(" + 200 + "," +200 + ")");

        circleContainer = svg.append('g').attr('class', 'dugy-radial-circle-container');
        areaContainer = svg.append('g').attr('class','dugy-radial-area-container');
        axesContainer = svg.append('g').attr('class','dugy-radial-axes-container');
        labelContainer = svg.append('g').attr('class', 'dugy-radial-labels-container');

        var stack = d3.stack().keys(oddsRatioCountries);

        // Call shape function on the dataset
        oddsRatioStacked = stack(oddsRatio);



        // scale
        angleScale = d3.scaleLinear()
            .range([0, 2 * Math.PI])
            .domain([0, oddsRatioDimensions.length]);

        var rmax = d3.max(oddsRatioStacked, d=> {return d3.max(d, e=> e[1])}) + radiusBoundaryOffset;
        radiusScale = d3.scalePow()
            .exponent(0.75)
            .domain([0,rmax])
            .range([innerRadius,outerRadius]);


        // text labels for factors
        oddsCircleBackgrounds = labelContainer.selectAll(".dugy-radial-label")
            .data(oddsRatioDimensions, function(d,i){return i})
            .enter().append('text')
            .transition()
            .duration(800)
            .attr('x',0)
            .attr('y',-outerRadius)
            .attr("transform", function(d,i) { return "rotate(" + angleScale(i) * 180 / Math.PI + ")"; })
            .text(function(d){return d})
            .style('fill','#ff6666')
            .style('text-anchor','middle')
            .style('font-size', '6px')

        // axes
        circleCount = maxCircleCount;
        radiusAxis = d3.axisLeft().scale(radiusScale).tickSize(2).ticks(circleCount);

        oddsAxes = axesContainer.selectAll(".dugy-radial-axis")
            .data(d3.range(angleScale.domain()[1]))
            .enter().append("g")
            .attr("class", "dugy-radial-axis")
            .attr("transform", function(d) { return "rotate(" + angleScale(d) * 180 / Math.PI + ")"; })
            .call(radiusAxis);

        colorInterpolator = d3.interpolateRgb(d3.color("#ff6666"),d3.color("#8293b6"));
        colorScheme = d3.quantize(colorInterpolator, oddsRatioCountries.length);

        filtering = '';
        hovering = '';
        filterData();
    }



    function filterData(){
        oddsRatioStackedDisplayed = oddsRatioStacked;

        if (filtering){
            var indexOfFilter = oddsRatioCountries.findIndex(function(d){return d == filtering});
            oddsRatioStackedDisplayed = [oddsRatioStacked[indexOfFilter]];
        }

        updateRadialVis();

    }

    function updateRadialVis(){
        displayCountry = document.getElementById('dugy-radial-currentCountry');


        // update radius scale
        var rmax = d3.max(oddsRatioStackedDisplayed, d=> 
                          { return d3.max(d, e=>{
                              if(filtering){return e[1]-e[0];}
                              else{return e[1];}
                          })
                          }) + radiusBoundaryOffset;

        radiusScale.range([innerRadius,outerRadius]).domain([0,rmax]);
        radiusAxis.scale(radiusScale).ticks(circleCount);



        // area paths                    
        radialArea = d3.areaRadial()
            .curve(d3.curveCardinalClosed)
            .angle(function(d,i) { return angleScale(i);})
            .innerRadius(function(d) { return radiusScale(d[0]);})
            .outerRadius(function(d) { return radiusScale(d[1]);});

        singleRadialArea =  d3.areaRadial()
            .curve(d3.curveCardinalClosed)
            .angle(function(d,i) { return angleScale(i);})
            .innerRadius(radiusScale(0))
            .outerRadius(function(d) { return radiusScale(d[1]-d[0]);});

        // get tickvalues for drawing circles
        tickValues = d3.ticks(0,radiusScale.domain()[1],circleCount);
        if (tickValues[-1] != rmax){tickValues.push(rmax)}

        oddsAxes.call(radiusAxis);

        // circles
        oddsCircleBackgrounds = circleContainer.selectAll(".dugy-radial-circle")
            .data(tickValues, function(d,i){return i})
        oddsCircleBackgrounds2 = oddsCircleBackgrounds
            .enter().append("circle")
            .attr('class','dugy-radial-circle')
            .merge(oddsCircleBackgrounds)
            .attr('cx', 0 )
            .attr('cy', 0 )
            .attr('r', function(d){return radiusScale(d)})
            .style('fill', '#000000')
            .style('fill-opacity', 0.15)
        oddsCircleBackgrounds.exit().remove();

        updateTopFactors();

        // Area Paths
        countryAreaPaths = areaContainer.selectAll(".dugy-radial-area")
            .data(oddsRatioStackedDisplayed, function(d){return d.key});

        countryAreaPaths2 = countryAreaPaths.enter().append("path")
            .attr("class", "dugy-radial-area")
            .merge(countryAreaPaths);
        countryAreaPaths2.transition()
            .duration(800)
            .style("fill", function(d,i) {
            return colorScheme[i];
        })
            .style("fill-opacity",function(d,i){
            return 0.8;
        })
            .attr("d", function(d) {
            if(filtering){return singleRadialArea(d)}
            else{
                return radialArea(d);
            }
        });
        countryAreaPaths2.on('mouseover', function(d,i) {
            d3.select(this).style("fill", '#ff6666');
            d3.select(this).style("fill-opacity", 0.1);
            currentCountry = d.key;
            displayCountry.innerHTML = currentCountry;
            updateTopFactors();
        })
            .on('mouseleave', function(d,i) {
            d3.select(this).style("fill", colorScheme[i]);
            d3.select(this).style("fill-opacity", 0.8); 
            currentCountry = (filtering == "")? 'Europe':d.key
            displayCountry.innerHTML = currentCountry ;
            updateTopFactors();
        })
            .on("click", function(d,i) {
            filtering = (filtering) ? "" : oddsRatioCountries[i];
            circleCount = (filtering == "")? maxCircleCount:minCircleCount;
            innerRadius = (filtering == "")? maxInnerRadius:minInnerRadius;
            radiusBoundaryOffset = (filtering == "")? maxBoundaryOffset:minBoundaryOffset;
            currentCountry = d.key;
            displayCountry.innerHTML = currentCountry;
            filterData();});
        countryAreaPaths.exit().remove();

    }

    function updateTopFactors(){
        topFactors = []
        if (filtering == '' && currentCountry != 'Europe'){
            // Update Top Factors
            var indexOfCountry = oddsRatioCountries.findIndex(function(d){return d == currentCountry});
            console.log(indexOfCountry);
            oddsRatioStackedDisplayed[indexOfCountry].forEach((d,i)=>{
                topFactors.push([d[1] - d[0],d.data.Factor,i]) 
            })
        }
        else{
            // Update Top Factors
            oddsRatioStackedDisplayed[oddsRatioStackedDisplayed.length-1].forEach((d,i)=>{
                topFactors.push([d[1] - oddsRatioStackedDisplayed[0][i][0],d.data.Factor,i])
            });
        }

        //sort decreasingly
        topFactors.sort(function(a,b){
            return b[0] - a[0];
        })

        document.getElementById('dugy-radial-topfactors').innerHTML = 
            lonelinessFactors[topFactors[0][2]]
            + ' <br>' + 
            lonelinessFactors[topFactors[1][2]]
            + ' <br>' + 
            lonelinessFactors[topFactors[2][2]];

    }

}



