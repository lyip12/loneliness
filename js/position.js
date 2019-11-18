$(function(){
    // Check the initial Poistion of the Sticky Header
    var scrollHeaderTop = $("#scroll").offset().top;
    var mapTop = $("#choro").offset().top;
    $(window).scroll(function(){
        if( $(window).scrollTop() > scrollHeaderTop && $(window).scrollTop() <mapTop-3000) {
            $('#scroll').css(
                {position: 'fixed',
                    display: 'inline-block',
                    width: '250 px',
                    height: '1000 px',
                    top:'0px',
                    'z-index':'90',
                    'margin-bottom': '1000px',
                    'scroll-snap-type': 'y proximity'});
            //$('#stickyalias').css('display', 'block');
        } else {
            $('#scroll').css({position: 'relative',
                display: 'inline-block',
                width: '250 px',
                height: '1000 px',
                top:'0px',
                'z-index':'90','margin-bottom': '1000px',
                'scroll-snap-type': 'y proximity'});
            //$('#stickyalias').css('display', 'none');
        }
    });
});

