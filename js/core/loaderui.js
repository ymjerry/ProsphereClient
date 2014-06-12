/**
 * TWA proshpere configurator
 * 
 * loaderui.js is used to define UI methods to load the html content from xml content.
 * 
 * @package proshpere
 * @subpackage core
 */

//TODO change the function definition style wherever applicable matching our framework
//TODO give proper comments wherever applicable
var __loadingImage = null;
$(document).bind("startProcess", function() {
    //$.showSpinnerBlanket();
    if (__loadingImage == null)
        connectLoadingImage();
    $('body').css('cursor', 'none');
    __loadingImage.css({opacity: 0.65, display: "block", 'top': currentMousePos.y - 20, 'left': currentMousePos.x+5, 'position': 'absolute'});
}).bind("doneProcess", function() {
    $('#loading').hide();
    $('#spinner').hide();
    $('body').css('cursor', 'auto');
    if (__loadingImage == null)
        connectLoadingImage();
    __loadingImage.css({opacity: 0});
});

var startProcessCount = 0;
$.startProcess = function (isShowLoading,from) {
    if(from)
        Log.trace('from = ' + from)
    
    if (isShowLoading == undefined) {
        isShowLoading = true;
    }

    if (isShowLoading == true) {
        startProcessCount++;
        Log.trace('Startprocess ++: ' + (startProcessCount))
        $(document).trigger("startProcess");
        showdiv('loading');
        $('#loading').show();
        $('#spinner').show();
    }
};

$.doneProcess = function (from) {
    //if (from)
        Log.trace('from = ' + from)
    startProcessCount--;
    if (startProcessCount == -1) startProcessCount = 0;
    if(startProcessCount > 0){
        return;
    }else{
        startProcessCount = 0;
    }
    
    Log.trace('Startprocess --: ' + (startProcessCount))
    setTimeout(function() {
        $(document).trigger("doneProcess");
    }, 10);
};

$.removeScreensFromTop = function(count) {
    if (!count) {
        count = 1;
    }

    screensArray.splice(screensArray.length - count, count);
    screensArgsArray.splice(screensArgsArray.length - count, count);
};

function connectLoadingImage() {
    __loadingImage = $("div#loading");
    /*__loadingImage[0].addEventListener("webkitTransitionEnd", function() {
     
     if ($(this).css("opacity") == 0) {
     $(this).css({
     display: "none"
     });
     }
     });*/
}


//TODO Define the pageset method
$.loadPage = function(pid, args, sync, refresh, callback) {

    function load() {
        var content = $("#" + pid);
        var arg = {container: content, pageId: pid, args: args};
        $("#dvSpinnerBlanket").css('top', '0px');
        $(document).trigger("loadingPage", arg);

        if (refresh || content.children().length <= 0) {
            content.setContent({
                url: content.attr("url"),
                done: function() {
                    setTimeout(function() {
                        $(document).trigger("pageSet", arg);
                        if (callback) {
                            callback();
                        }
                    }, 100);
                }
            });
        } else {
            setTimeout(function() {
                if (callback) {
                    callback();
                }
            }, 100);
        }
    }
    if (!sync) {
        clearTimeout(lpthread);
        lpthread = setTimeout(load, 500);
    } else {
        load();
    }
};


function hidediv(id) {
    setTimeout(function() {
        var o = document.getElementById(id);
        if (o !== null) {
            o.style.display = 'none';
        }
    }, 300);
}

function showdiv(id) {
    var o = document.getElementById(id);
    if (o !== null) {
        o.style.display = "block";
    }
}