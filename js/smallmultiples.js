var yipchoroselector = "All";
yipsmallmultiples(yipchoroselector);

$("#yipcountries").click(function(){
    var yipchoroselector = $("input[name='countries']:hover").val();
    yipsmallmultiples(yipchoroselector);
});

function yipsmallmultiples(yipchoroselector){

    var margin = {top: 30, right: 20, bottom: 50, left: 0},
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var key = [
        {Category: ["One_Person_Household_Frequent", "Mutiple_People_Household_Frequent"]},
        {Category: ["Conflict_Never_Frequent", "Conflict_Sometimes_Frequent", "Conflict_Often_Frequent"]},
        {Category: ["No_Confidant_Frequent", "At_Least_One_Confidant_Frequent"]},
        {Category: ["Native_Frequent", "Immigrant_Frequent","Ethnic_Minority_Frequent","Ethnic_Majority_Frequent"]},
        {Category: ["Religious_Frequent", "Non_Religious_Frequent"]},
        {Category: ["Big_City_Frequent", "Suburb_Frequent", "Small_City_Frequent", "Countryside_Frequent"]},
        {Category: ["Unemployed_Past_Year_Frequent", "Unemployed_Past_Month_Frequent","Unemployed_Past_Days_Frequent", "Employed_Frequent"]},
        {Category: ["Income_Comfortable_Frequent", "Income_Coping_Frequent", "Income_Difficult_Frequent", "Income_Very_Difficult_Frequent"]}   
    ];

    var ax = [
        {Category: ["One Person", "Multiple People"], Title: ["# People in Household"]},
        {Category: ["Never", "Sometimes", "Often"], Title: ["In House Conflict"]},
        {Category: ["None", "At Least One"], Title: ["Confidants"]},
        {Category: ["Native", "Immigrant","Minority","Majority"], Title: ["Ethnicity"]},
        {Category: ["Religious", "Non-religious"], Title: ["Religion"]},
        {Category: ["Big Cit", "Suburb", "Small City", "Countryside"], Title: ["Living Area"]},
        {Category: ["Years", "Months","Days", "Employed"], Title: ["Unemployment"]},
        {Category: ["Comfortable", "Coping", "Difficult", "Very Difficult"], Title: ["Income"]}   
    ];

    //console.log(key);

    // Initialize variables to save the charts later
    var barcharts = [];

    // Date parser to convert strings to date objects


    //  (1) Load CSV data
    // 	(2) Convert strings to date objects
    // 	(3) Create new bar chart objects
    // 	(4) Create new are chart object


    d3.csv("data/ESS_Demographic.csv", function(data){
        data.forEach(function(d){
        });

        var filtereddata = data.filter(function(d) { 
            return d.Country == yipchoroselector; 
        });

        //console.log(filtereddata[0][key[0].Category[0]]);
        barchart(filtereddata);
    });

    function barchart(d){

        d3.selectAll(".yipcountryvis")
            .attr("opacity",1)
            .transition()
            .duration(500)
            .attr("opacity",0)
            .remove();
        //creating nested list

        for(var i = 0; i<8; i++){
            //console.log(key[i].Category);
            var svg = d3.select("#yipbarcharts"+i)
            .classed("yip2svg-container", true)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "-60 -20 450 380")
            .classed("svg-content-responsive", true);

            var finaldata = [];
            for(var j = 0; j<key[i].Category.length; j++){
                finaldata.push({
                    category: ax[i].Category[j], 
                    value: +d[0][key[i].Category[j]]
                })
            }   

            //console.log(finaldata)

            var fill = d3.scaleThreshold()
            .domain([10,20,30,40])
            .range(d3.schemeBlues[5]);

            var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1)
            
            var y = d3.scaleLinear()
            .range([height, 0]);

            x.domain(finaldata.map(function(d) { return d.category;}));
            y.domain([0, 50])           

            var bar = svg.selectAll('bar')
            .attr("class", "bar")
            .data(finaldata)

            bar.enter()
                .append("rect")
                .attr("class","yipcountryvis")
                .data(finaldata)
                .attr("x", function(d) { return x(d.category); })
                .attr("width", x.bandwidth())
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height-y(d.value); })
                .attr("opacity",0)
                .transition()
                .duration(500)
                .attr("opacity",1)
                .attr("fill", function(d){
                return fill(50-d.value);
            }); 

            svg.append("text")
                .attr("class","yipcountryvis")
                .attr("x", -height/2)
                .attr("y", -45)
                .attr("text-anchor", "middle")
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-size", "20px")
                .attr("font-weight", "300")
                .attr("fill", "white")
                .text("% Pop. Frequently Lonely")
                .attr("transform", "rotate(-90)");

            svg.append("text")
                .attr("class","yipcountryvis")
                .attr("x", width/2)
                .attr("y", 0)
                .attr("font-family", "'Roboto', sans-serif")
                .attr("font-weight", "300")
                .attr("font-size", "24px")
                .attr("text-anchor", "middle")
                .attr("fill", "white")
                .text(ax[i].Title)

            // add the x Axis
            svg.append("g")
                .attr("class","yipcountryvis")
                .attr("class", "yipbaraxis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // add the y Axis
            svg.append("g")
                .attr("class","yipcountryvis")
                .attr("class", "yipbaraxis")
                .call(d3.axisLeft(y));

        }

    }
}