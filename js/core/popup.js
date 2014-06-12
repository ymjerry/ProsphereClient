/**
 * TWA proshpere configurator
 * 
 * popup.js is used to define custom popup methods/augments used in application.
 * 
 * 
 * @package proshpere
 * @subpackage core
 */
function Popup() {
    this.popupId = '';
    this.backgroundPopupId = 'dvBackgroundPopup';
    this.popupStatus = 0; // set value
}
/**
 * used to display layer on screen
 * 
 * 
 * @return void
 */
Popup.prototype.loading = function() {
    $("div.loader").show();
};
/**
 * used to close layer on screen
 * 
 * 
 * @return void
 */
Popup.prototype.closeloading = function() {
    $("div.loader").fadeOut('normal');
};

/**
 * used to display popup contents
 * 
 * @param popupId popup id to display contents
 * 
 * @return void
 */
Popup.prototype.loadPopup = function(popupId, fadeInTime) {
    try{
        this.popupId = popupId;
        if (this.popupStatus == 0) { // if value is 0, show popup
            fadeInTime = (typeof fadeInTime !== 'undefined' ) ? fadeInTime : 0500;
            this.closeloading(); // fadeout loading        
            $("#" + this.popupId).fadeIn(fadeInTime); // fadein popup div
            $("#" + this.backgroundPopupId).css("opacity", "0.01"); // css opacity, supports IE7, IE8
            $("#" + this.backgroundPopupId).fadeIn(0001);
            this.popupStatus = 1; // and set value to 1        
            //$("#"+this.popupId).draggable({ containment: "#"+this.backgroundPopupId, scroll: false })
        }
    } catch (err) {
        var errObj = {
            loglevel: Log.Level.ERROR,
            message: err.message,
            fileName: err.fileName,
            className: 'Popup',
            methodName: 'loadPopup',
            lineNumber: err.lineNumber
        };
        Log.error(errObj);
       
    }
};
/**
 * used to disable popup on the screen
 *  
 * 
 * @return void
 */
Popup.prototype.disablePopup = function() {
    if (this.popupStatus == 1) { // if value is 1, close popup
        $("#" + this.popupId).fadeOut("normal");
        $("#" + this.backgroundPopupId).fadeOut("normal");
        this.popupStatus = 0;  // and set value to 0
    }
};

