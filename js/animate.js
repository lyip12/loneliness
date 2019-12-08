//https://github.com/michalsnik/aos

AOS.init({
    offset: 100,
    easing: 'ease-in-quart',
    duration: 800,
});


function showcitation(){
    document.getElementById("citation").innerHTML = 
        "Literature References: <a onclick='hidecitation()' href='javascript:void(0);'>Sources (Click to Hide)</a><br>"+
        "<p class='small' style='padding-left: 1.5em !important; text-indent:-1.5em !important; margin-bottom: 0px !important;'>Yang, Keming. Loneliness: A Social Problem. Routledge, 2019.</p><p class='small' style='padding-left: 1.5em !important; text-indent:-1.5em !important; margin-bottom: 0px !important;'>Weiss, Robert S. 'Loneliness: The experience of emotional and social isolation.' (1973).</p><p class='small' style='padding-left: 1.5em !important; text-indent:-1.5em !important; margin-bottom: 0px !important;'>Russell, Dan, Letitia Anne Peplau, and Mary Lund Ferguson. 'Developing a measure of loneliness.' Journal of personality assessment 42.3 (1978): 290-294.</p><p class='small' style='padding-left: 1.5em !important; text-indent:-1.5em !important; margin-bottom: 0px !important;'>Hawkley, Louise C., Michael W. Browne, and John T. Cacioppo. 'How can I connect with thee? Let me count the ways.' Psychological Science 16.10 (2005): 798-804.</p><p class='small' style='padding-left: 1.5em !important; text-indent:-1.5em !important; margin-bottom: 0px !important;'>Cacioppo, John T., and William Patrick. Loneliness: Human nature and the need for social connection. WW Norton & Company, 2008.</p><p class='small' style='padding-left: 1.5em !important; text-indent:-1.5em !important; margin-bottom: 0px !important;'>Cacioppo, John T., Stephanie Cacioppo, and Dorret I. Boomsma. 'Evolutionary mechanisms for loneliness.' Cognition & emotion 28.1 (2014): 3-21.</p>"
}

function hidecitation(){
    document.getElementById("citation").innerHTML = "Literature References: <a onclick='showcitation()' href='javascript:void(0);'>Sources (Click to Expand)</a>";
}