/**
 * TWA proshpere configurator
 * 
 * NotificationsPopup.js is used to display Notification
 * 
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 *
 * @return void
 */
function NotificationsPopup() {
    this.dvFsSleeveImg = 'dvFsSleeveImg';
    this.dvWsSleeveimg = 'dvWsSleeveimg';
}

/**
 * As a part of the FOOTBALL QB JERSEY REQUIREMENT This component is used to display a notification to the users that Football QB Jerseys are now also available along with the 
 *  Regular Football uniforms, from within the configurator.
 * @return void
 */
NotificationsPopup.prototype.QBNotificationsPopup = function() {
    var objThis = this;
    $.loadPage('secNotificationsPopup', null, true, false, function() {
        $('#' + objThis.dvFsSleeveImg).css('background-image', "url('" + CONFIG.get('BASE_URL') + CONFIG.get('IMAGE_DIR') + NOTIFICATION_BACKGROUND_IMAGE.get('FSS') + "')");
        $('#' + objThis.dvWsSleeveimg).css('background-image', "url('" + CONFIG.get('BASE_URL') + CONFIG.get('IMAGE_DIR') + NOTIFICATION_BACKGROUND_IMAGE.get('WSS') + "')");
        GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
        GlobalInstance.popupInstance.loading(); // loading      
        $('#blanket').show();
        setTimeout(function() { // then show popup, deley in .5 second
            GlobalInstance.popupInstance.loadPopup('dvSleevePopup'); // function show popup 

            $("#dvCloseNotification").click(function() {
                GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
                GlobalInstance.popupInstance.disablePopup();
                $('#blanket').hide();// function close pop up
            });
        }, 500); // .5 second
    });
};

/**
 * As a part of the FOOTBALL QB JERSEY REQUIREMENT This component is used to display a notification to the users that Football QB Jerseys are now also available along with the 
 *  Regular Football uniforms, from within the configurator.
 * @return void
 */

NotificationsPopup.prototype.RosterQBNotificationsPopup = function() {
    var objThis = this;
    $.loadPage('secRosterNotificationsPopup', null, true, false, function() {
        GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
        GlobalInstance.popupInstance.loading(); // loading      
        $('#blanket').show();
        setTimeout(function() { // then show popup, deley in .5 second
            GlobalInstance.popupInstance.loadPopup('dvFootballSleeveOptionPopup'); // function show popup 

            $(".footballokButton, .footballPupupcloseIcon").click(function() {
                GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
                GlobalInstance.popupInstance.disablePopup();
                $('#blanket').hide();// function close pop up
            });
        }, 500); // .5 second
    });

};