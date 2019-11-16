//
//$(document).ready(function(){
//    //Take your div into one js variable
//    var div = $("#divToShowHide");
//    //Take the current position (vertical position from top) of your div in the variable
//    var pos = div.position();
//    //Now when scroll event trigger do following
//    $(window).scroll(function () {
//        var windowpos = $(window).scrollTop();
//        //Now if you scroll more than 100 pixels vertically change the class to AfterScroll
//        // I am taking 100px scroll, you can take whatever you need
//        if (windowpos >= (pos.top - 100)) {
//            div.addClass("AfterScroll");
//        }
//        //If scroll is less than 100px, remove the class AfterScroll so that your content will be hidden again 
//        else {
//            s.removeClass("AfterScroll");
//        }
//        //Note: If you want the content should be shown always once you scroll and do not want to hide it again when go to top agian, no need to write the else part
//    });
//});