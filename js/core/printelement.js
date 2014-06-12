/**
 * TWA proshpere configurator
 *
 *
 * @package TWA proshpere configurator
 * @subpackage core
 */

/**
 * Class constructor 
 *   
 *
 * @return void
 */

function PrintElement() {
    this.isBrowserTypeIE = Utility.isBrowserIE();
    this.frameId = "divToPrint-" + (new Date()).getTime();
    this.iframeStyleClass = 'printIframeClass';
    this.frameName = this.frameId;
}

/**
 * 
 * @param  elementId
 * @returns 
 */
PrintElement.prototype.printElementById = function(elementId)
{
    var elementObj = $('#' + elementId);
    //Check IE
    if (this.isBrowserTypeIE) {
        //create Iframe
        var createIframe = document.createElement('iframe');
        // give name
        createIframe.name = this.frameName;
        // give Id
        createIframe.id = this.frameId;
        // append in body
        document.body.appendChild(createIframe);
        var iframeSrc = "javascript:document.write(\"<head><script>document.domain=\\\"" + document.domain + "\\\";</script></head><body></body>\")";
        //add source in iframe 
        createIframe.src = iframeSrc;
    } else {
        //if not IE
        var createIframe = $('<iframe id="' + this.frameId + '" name=" ' + this.frameName + '" />');
        //append in body
        createIframe.appendTo("body");
    }
    //iframe Id
    var iframeId = $("#" + this.frameId);
    this.wirteContentAndBindPrint(elementObj, iframeId);
    iframeId.addClass(this.iframeStyleClass);
};

/**
 * 
 * @param  elementId
 * @returns 
 */
PrintElement.prototype.wirteContentAndBindPrint = function(elementObj, iframeId) {
    //Hide iframe
    setTimeout(function() {
        var iframeContents = iframeId.contents();
        //add Header
        iframeContents.find("head").append("<title>" + CONFIG.get('PAGE_TITLE') + "</title>");
        //import css
        $("link[rel=stylesheet]").each(function() {
            var href = $(this).attr("href");
            if (href) {
                var media = $(this).attr("media") || "all";
                iframeContents.find("head").append("<link type='text/css' rel='stylesheet' href='" + href + "' media='" + media + "'>");
            }
        });
        var addOuter = $("<div></div>").html(elementObj.clone()).html();
        iframeContents.find("body").append(addOuter);
        // check if iframe created for IE
        if (this.browserTypeIE) {
            window.frames[this.frameName].focus();
            //add script in header
            iframeContents.find("head").append("<script>  window.print(); </script>");
        } else {
            iframeId[0].contentWindow.focus();
            iframeId[0].contentWindow.print();
        }
        //remove iframe 
        setTimeout(function() {
            iframeId.remove();
        }, 300);
    }, 400);
};