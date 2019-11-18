$(function(){
    // Check the initial Poistion of the Sticky Header
    var scrollHeaderTop = $("#scroll").offset().top;
    var mapTop = $("#choro").offset().top;
    $(window).scroll(function(){
        if( $(window).scrollTop() > scrollHeaderTop) {
            $('#scroll').css(
                {position: 'fixed',
                display: 'inline-block',
                width: '250 px',
                height: '1000 px',
                top:'0px',
                'z-index':'90'});
            //$('#stickyalias').css('display', 'block');
        } else {
            $('#scroll').css({position: 'static',
                display: 'inline-block',
                width: '250 px',
                height: '1000 px',
                top:'0px',
                'z-index':'90'});
            //$('#stickyalias').css('display', 'none');
        }
    });
});