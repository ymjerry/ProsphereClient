/**
 * TWA proshpere configurator
 * 
 * modellargeView.js is used to display model larger view related functionality. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 *
 * @return void
 */
function ModelLargerView() {
}

/**
 * Thsi method is responsible to display popup and bind content 
 *  
 * @return void
 */
ModelLargerView.prototype.showPreview = function () {
    GlobalFlags.setScreenFlags('isLargerModelPreviewLoaded', false);
    LiquidPixels.updateLargerModelPreview();
    GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
    GlobalInstance.popupInstance.loading(); // loading
    setTimeout(function() { // then show popup, deley in .5 second
        $('#blanket').show();
        GlobalInstance.popupInstance.loadPopup('dvIdLargerViewPopup');
        $('#dvIdLargerViewPopup').draggable({
            containment: '#blanket',
            cancel: ".popupTxt"
        });
        $("#dvIdCloselargerViewPopup").click(function() {
            $("#dvIdLargerViewPopup").hide();

            $('#blanket').hide();
        });
        $("#dvLargeViewcloseWindow").click(function() {
            $("#dvIdLargerViewPopup").hide();

            $('#blanket').hide();
        });

    }, 500); // .5 second
};