sectiontest();
function sectiontest(){

    var winheight = window.innerHeight || (document.documentElement || document.body).clientHeight;
    

    function getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        )
    }

    var docheight = getDocHeight();

    function amountscrolled(){
        var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
        console.log(scrollTop)
    }

    window.addEventListener("scroll", function(){
        amountscrolled()
    }, false)


}
//document.getElementById("testerblock").style.marginTop = scrollTop+"px";