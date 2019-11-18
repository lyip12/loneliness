questionaire() // for avoiding naming issue




function questionaire(){
    var q1 = [1, "How often do you feel that you have a lot in common with the people around you?"];
    var q2 = [2, "How often do you feel that no one really knows you well?"];
    var q3 = [3, "How often do you feel that people are around you but not with you?"];
    var q4 = [4, "How often do you feel that there are people you can talk to or turn to?"];
    var a = ["Never","Rare","Sometimes","Always"];

    if(section ==1){
        console.log("hello");
        document.getElementById("q1").innerHTML = "<p class='smalltext' style='color:#404040;'>"+q1[1]+"<br><br>"+a[an]+"</p>"
        
        var q = "<p class='smalltext' data-aos='fade-in'><b>"+q2[1]+"</b></p><form id='question"+q2[0]+"'data-aos='fade-in'><input type='radio' name='q2' value=0> Never<br><input type='radio' name='q2' value=1> Rare<br><input type='radio' name='q2' value=2> Sometimes<br><input type='radio' name='q2' value=3> Always</form>"
        document.getElementById("q2").innerHTML = q;

    } else {
        var q_1 = "<p class='smalltext' data-aos='fade-in'><b>"+q1[1]+"</b></p><form id='question"+q1[0]+"'data-aos='fade-in'><input type='radio' name='q1' value=0> Never<br><input type='radio' name='q1' value=1> Rare<br><input type='radio' name='q1' value=2> Sometimes<br><input type='radio' name='q1' value=3> Always</form>";
        document.getElementById("q1").innerHTML = q_1;

        d3.select("#question1").on("change", function () {
            an = d3.select('input[name="q1"]:checked').property("value");
            var section = 1;
            console.log(an);
        });
    }
    
    
    
    d3.select("#question2").on("change", function () {
        var a2 = d3.select('input[name="q2"]:checked').property("value");
        console.log(a2);
        var q = "<p class='smalltext' style='color:#404040;'>"+q2[1]+"<br><br>"+a[a2]+"</p>"
        document.getElementById("q2").innerHTML = q;
        var q_2 = "<p class='smalltext' data-aos='fade-in'>"+q3[1]+"</p><form id='question"+q3[0]+"'data-aos='fade-in'><input type='radio' name='group-stack' value=0> Never<br><input type='radio' name='group-stack' value=1> Rare<br><input type='radio' name='group-stack' value=2> Sometimes<br><input type='radio' name='group-stack' value=3> Always</form>"

        });
    document.getElementById("q3").innerHTML = q_2;

    d3.select("#question3").on("change", function () {
        var a3 = d3.select('input[name="group-stack"]:checked').node().value;
        var q = "<p class='smalltext' style='color:#404040;'>"+q3[1]+"<br><br>"+a[a3]+"</p>"
        document.getElementById("q3").innerHTML = q;
        var q_3 = "<p class='smalltext' data-aos='fade-in'>"+q3[1]+"</p><form id='question"+q3[0]+"'data-aos='fade-in'><input type='radio' name='group-stack' value=0> Never<br><input type='radio' name='group-stack' value=1> Rare<br><input type='radio' name='group-stack' value=2> Sometimes<br><input type='radio' name='group-stack' value=3> Always</form>"

        });
    document.getElementById("q4").innerHTML = q_3;

    d3.select("#question4").on("change", function () {
        var a4 = d3.select('input[name="group-stack"]:checked').node().value;
        var q_4 = "<p class='smalltext' style='color:#404040;'>"+q4[1]+"<br><br>"+a[a4]+"</p>"
        document.getElementById("q3").innerHTML = q_4;

        if((a1+a2+a3+a4)<9){
            var answer = "<b>based on your answers to the above questions: <br><br>You are likely to be lonely,</b><br>and everyone feels lonely sometimes."
            }else{
                var answer = "<b>based on your answers to the above questions:</b><br><br>Everyone feels lonely sometimes, <b>you are among the lucky few.</b>"
                }
        document.getElementById("questionaire").innerHTML = answer;
    });
}