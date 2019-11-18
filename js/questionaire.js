questionaire() // for avoiding naming issue

function questionaire(){
    var meep = d3.select('input[name="q1"]:checked').property("value");
    console.log(meep);
    
    d3.select("#question").on("change", function () {
        var meep = d3.select('input[name="q1"]:checked').property("value");
        console.log(meep);
    });



    var answer = "<b>based on your answers to the above questions: <br><br>You are likely to be lonely,</b><br>and everyone feels lonely sometimes."
    // this is just a var placeholder

    document.getElementById("questionaire").innerHTML = answer;
}