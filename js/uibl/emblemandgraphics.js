/**
 * TWA proshpere configurator
 * 
 * emblemandgraphics.js is used to maintain emblem and graphics related functions.;
 * @package proshpere
 * @subpackage uibl
 */
function  EmblemGraphics() {
    this.secIdConfiguratorEmblemAndGraphics = 'secEmblemAndGraphicsPanel';
    this.secIdConfiguratorSelectGraphics = 'secConfiguratorSelectGraphics';
    this.secIdConfiguratorMyLocker = 'secConfiguratorMyLocker';
    this.secIdConfiguratorUploadGraphics = 'secConfiguratorUploadGraphics';
    this.secIdConfiguratorGraphicsHome = 'secConfiguratorGraphicsHome';
    this.secIdCustomizeGraphics = 'secCustomizeGraphics';

    this.dvSelectGraphics = 'dvSelectGraphics';
    this.dvUploadGraphic = 'dvUploadGraphic';
    this.dvMyLocker = 'dvMyLocker';
    this.bindEmblemGraphicsHomeScreenEvents();
}
/**
 * This method binds the Emblem & Graphics Screen and handles click events
 * @returns {void}
 */
EmblemGraphics.prototype.bindEmblemGraphicsHomeScreenEvents = function() {
    $(document).on('click', '#' + this.dvSelectGraphics, function() {
        GlobalInstance.getSelectGraphicsInstance().show();
    });
    $(document).on('click', '#' + this.dvUploadGraphic, function() {
        GlobalInstance.getUploadGraphicsInstance().show();
    });
    $(document).on('click', '#' + this.dvMyLocker, function() {
        GlobalInstance.getMyLockerInstance().show();
    });
};
/**
 * This method handles the display functionality of Sections of configurator
 * @returns {void}
 */
EmblemGraphics.prototype.show = function() {
    $('#' + this.secIdConfiguratorSelectGraphics).hide();
    $('#' + this.secIdConfiguratorMyLocker).hide();
    $('#' + this.secIdConfiguratorUploadGraphics).hide();
    $('#' + this.secIdCustomizeGraphics).hide();
    $('#' + this.secIdConfiguratorEmblemAndGraphics).show();
    $('#' + this.secIdConfiguratorGraphicsHome).show();
};
/**
 * This method hides the Emblems and Graphics Section
 * @returns {void}
 */
EmblemGraphics.prototype.hide = function() {
    $('#' + this.secIdConfiguratorEmblemAndGraphics).hide();
};