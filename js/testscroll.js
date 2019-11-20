sectiontest();
function sectiontest(){

    var winheight = window.innerHeight || (document.documentElement || document.body).clientHeight;

    var scrollTop, init = 0, trigger = 0;

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
        scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
        console.log(init);
        console.log(winheight);
        console.log(scrollTop);
    }

    window.addEventListener("scroll", function(){
        amountscrolled()
        if(init !== 0 && scrollTop>winheight/2+init){
            console.log("it is changing the top margin")
            document.getElementById("theTarget2").style.paddingTop = 200+"px";
        }
    }, false)

    function isScrolledIntoView(elem)
    {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();
        return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    $(window).scroll(function() {    
        if(isScrolledIntoView($('#theTarget')) && trigger == 0)
        {
            init = scrollTop;
            trigger = 1;
        }    
    });





}
