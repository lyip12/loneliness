//var yipchoroselector = "All";

function yipsmallmultiples(yipchoroselector){
    
    var margin = {top: 20, right: 20, bottom: 30, left: 30},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var key = [
        {Category: ["One_Person_Household_Frequent", "Mutiple_People_Household_Frequent"]},
        {Category: ["Conflict_Never_Frequent", "Conflict_Sometimes_Frequent", "Conflict_Often_Frequent"]},
        {Category: ["No_Confidant_Frequent", "At _Least_One_Confidant_Frequent"]},
        {Category: ["Native_Frequent", "Immigrant_Frequent","Ethnic_Minority_Frequent","Ethnic_Majority_Frequent"]},
        {Category: ["Religious_Frequent", "Non_Religious_Frequent"]},
        {Category: ["Big_City_Frequent", "Suburb_Frequent", "Small_City__Frequent", "Countryside_Frequent"]},
        {Category: ["Unemployed_Past_Year_Frequent", "Unemployed_Past_Month_Frequent","Unemployed_Past_Days_Frequent", "Employed_Frequent"]},
        {Category: ["Income_Comfortable_Frequent", "Income_Coping_Frequent", "Income_Difficult_Frequent", "Income_Very_Difficult_Frequent"]}   
    ];

    //console.log(key);

    // Initialize variables to save the charts later
    var barcharts = [];

    var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
    var y = d3.scaleLinear()
    .range([height, 0]);

    // Date parser to convert strings to date objects


    //  (1) Load CSV data
    // 	(2) Convert strings to date objects
    // 	(3) Create new bar chart objects
    // 	(4) Create new are chart object


    d3.csv("data/ESS_Demographic.csv", function(data){
        data.forEach(function(d){
        });

        //console.log(data);

        if(yipchoroselector == "All"){
            var filtereddata = data;
        } else {
            var filtereddata = data.filter(function(d) { 
                return d.Country == yipchoroselector; 
            });
        };
        console.log(yipchoroselector);
        
        barchart(data);

    });

    function barchart(d){

        //creating nested list

        for(var i = 0; i<8; i++){
            //console.log(key[i].Category);
            var svg = d3.select("#yipbarcharts"+i)
            .classed("yipsvg-container", true)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "-40 0 390 420")
            .classed("svg-content-responsive", true);

            var fdata = d.filter(function(d) { 
                return d.Country = key[i].Category; 
            });
            //console.log(fdata);

            //            x.domain(d.map(function(d) { return key[i].Category;}));
            //            y.domain([0, d3.max(d, function(d) { return d[1];})]);
            //
            //            var bar = svg.selectAll('rect')
            //            .attr("class", "bar")
            //            .remove()
            //            .exit()
            //            .data(d)
            //
            //            bar.enter()
            //                .append("rect")
            //                .data(d)
            //                .attr("x", function(d) { return key[i].Category; })
            //                .attr("y", function(d) { return y(d[1]); })
            //                .attr("height", function(d) { return height - y(d[1]); })
            //                .transition()
            //                .duration(800)
            //                .attr("fill", "#F67E7D")
            //                .attr("width", x.bandwidth());
            //
            //            // add the x Axis
            //            svg.append("g")
            //                .attr("class", "yipbaraxis")
            //                .attr("transform", "translate(0," + height + ")")
            //                .call(d3.axisBottom(x));
            //
            //            // add the y Axis
            //            svg.append("g")
            //                .attr("class", "yipbaraxis")
            //                .call(d3.axisLeft(y));

        }
    }
}