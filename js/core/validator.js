/**
 * TWA proshpere configurator
 * 
 * 
 * @package TWA proshpere configurator
 * @subpackage app
 */

/**
 * Class constructor 
 *   
 *
 * @return void
 */
function Validator()
{
    //this.isSportSelected = false;
    this.retrivalcodeText = false;
    this.isPrimaryColorChecked = false;
    this.isSecondaryColorChecked = false;
    this.isAccentColorChecked = false;
    this.isRosterSelected = false;
}

/**
 * Set Retrival Code 
 *
 * @return void
 */
Validator.setRetrivalCodeText = function(params)
{
    this.retrivalcodeText = params;
    return;
};

/**
 * Set Primary Color
 *
 * @return void
 */
Validator.setIsPrimaryColorChecked = function(params)
{
    this.isPrimaryColorChecked = params;
    return;
};

/**
 * Set Secondary Color
 *
 * @return void
 */
Validator.setIsSecondaryColorChecked = function(params)
{
    this.isSecondaryColorChecked = params;
    return;
};

/**
 * Set Accent Color
 *
 * @return void
 */
Validator.setIsAccentColorChecked = function(params)
{
    this.isAccentColorChecked = params;
    return;
};

/**
 * Set Fabric
 *
 * @return void
 */
Validator.setIsFabricSelected = function(params)
{
    this.isFabricSelected = params;
    return;
};

/**
 * Set Sports Gender
 *
 * @return boolean
 */
Validator.setIsSportGenderSelected = function(params)
{
    this.isSportGenderSelected = params;
    return;
};

/**
 * Method is used to get RetrivalcodeText
 *
 * @return RetrivalcodeText
 */
Validator.getRetrivalCodeText = function()
{
    return this.retrivalcodeText;
};

/**
 *  Method is used to get primary color
 *
 * @return boolean
 */
Validator.getIsPrimaryColorChecked = function()
{
    return this.isPrimaryColorChecked;
};

/**
 * Method is used to get secondary color
 *
 * @return boolean
 */
Validator.getIsSecondaryColorChecked = function()
{
    return this.isSecondaryColorChecked;
};

/**
 * Method is used to get accent color
 *
 * @return boolean
 */
Validator.getIsAccentColorChecked = function()
{
    return this.isAccentColorChecked;
};

/**
 * Method is used to get fabric
 *
 * @return boolean
 */
Validator.getIsFabricSelected = function()
{
    return this.isFabricSelected;
};

/**
 * Method is used to get sport gender
 *
 * @return boolean
 */
Validator.getIsSportGenderSelected = function()
{
    return this.isSportGenderSelected;
};


/**
 * Checks if all colors are selected in color screen
 * 
 * 
 * @return boolean returns true if all three colors, false otherwise
 */
Validator.isColorSelected = function() {
    try {
        var selectedColor = {"primary": false, "secondary": false, "tertiary": false};
        var objColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo();
        if (objColor.uniformPrimaryColor) {
            selectedColor.primary = true;
        }
        if (objColor.uniformSecondaryColor) {
            selectedColor.secondary = true;
        }
        if (objColor.uniformTertiaryColor) {
            selectedColor.tertiary = true;
        }
        return (selectedColor.primary && selectedColor.secondary && selectedColor.tertiary);
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description validator: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
        return false;
    }
};

/**
 * Checks if fabric is selected in the Fabric Screen or not
 * @return boolean returns true if fabric is selected or false otherwise
 */
Validator.isFabricSelected = function() {
    try {
        var objFabric = GlobalInstance.uniformConfigurationInstance.getFabricsInfo();
        return (!$.isEmptyObject(objFabric));
    }
    catch (e) {
        return false;
    }
};

/**
 * Method is used to get roster sceen set or not
 *
 * @return boolean
 */
Validator.getIsRosterSelected = function()
{
    return this.isRosterSelected;
};

/**
 * Roster screen set
 *
 * @return void
 */
Validator.setIsRosterSelected = function(params)
{
    this.isRosterSelected = params;
    return;
};

/**
 * To Player name, number, team name, other text font color selected or not with alert dialog box
 *
 * @return void
 */
Validator.checkNumberAndTextColorsSelected = function(screenType) {
    try {
        var objColor = null;
        switch (screenType) {
            case "Graphics" :
                objColor = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo();
                break;
            case "PlayerNumber" :
                objColor = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo();
                break;
            case "PlayerName" :
                objColor = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo();
                break;
            case "TeamName" :
                objColor = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo();
                break;
            case "OtherText" :
                objColor = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo();
                break;
        }
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        var isValidate = true;
        var message = '';
        var colorId=0;
        //Player Name , Player Number, Team Name and Other Text font color validation message
        if ((objColor.fontColor == null || objColor.fontColor == undefined || Utility.getObjectlength(objColor.fontColor) < 0) && screenType != "Graphics") {
            GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_SAVE_VALIDATION'), MESSAGES.get('MESSAGE_NUMBER_TEXT_FONT_COLOR_ERROR'));
            GlobalInstance.dialogBoxInstance.funcCallBack = null;
            return false;
        }
        //Graphic Screen Case
        if (screenType == "Graphics" && (objColor.CustomizeGraphicPrimaryColor == undefined || (Utility.getObjectlength(objColor.CustomizeGraphicPrimaryColor, 'vljs254') <= 0))) {
            message += MESSAGES.get('MESSAGE_GRAPHIC_PRIMARY_COLOR_SELECTION');
            if (objColor.ColorizeId1 == CONFIG.get('COLORIZEID_NONE') && objColor.ColorizeId2 == CONFIG.get('COLORIZEID_COLOR_2')) {
                colorId = objColor.CustomizeGraphicSecondaryColor.colorid || objColor.CustomizeGraphicSecondaryColor.ColorId ;
                if ((objColor.CustomizeGraphicSecondaryColor == undefined || (Utility.getObjectlength(objColor.CustomizeGraphicSecondaryColor, 'vljs254') <= 0) || colorId == 0 || colorId == null)) {
                    message = '';
                    message = MESSAGES.get('MESSAGE_GRAPHIC_PRIMARY_COLOR_SELECTION');
                } else {
                    return true;
                }
            }
            isValidate = false;
        }
            if (objColor.CustomizeGraphicSecondaryColor) {
            colorId = objColor.CustomizeGraphicSecondaryColor.colorid || objColor.CustomizeGraphicSecondaryColor.ColorId;
        }
            if (screenType == "Graphics" && (objColor.CustomizeGraphicSecondaryColor == undefined || (Utility.getObjectlength(objColor.CustomizeGraphicSecondaryColor, 'vljs254') <= 0) || colorId == 0 || colorId == null) && objColor.ColorizeId2 == CONFIG.get('COLORIZEID_COLOR_2')) {
                message += MESSAGES.get('MESSAGE_GRAPHIC_SECONDARY_COLOR_SELECTION');
                if (objColor.ColorizeId1 == CONFIG.get('COLORIZEID_NONE') && objColor.ColorizeId2 == CONFIG.get('COLORIZEID_COLOR_2')) {
                    if ((objColor.CustomizeGraphicSecondaryColor == undefined || (Utility.getObjectlength(objColor.CustomizeGraphicSecondaryColor, 'vljs254') <= 0) || colorId == 0 || colorId == null)) {
                        message = '';
                        message = MESSAGES.get('MESSAGE_GRAPHIC_PRIMARY_COLOR_SELECTION');
                    } else {
                        return true;
                    }
                }
                isValidate = false;
            }
        
            if (objColor.CustomizeGraphicAccentColor) {
            colorId = objColor.CustomizeGraphicAccentColor.colorid || objColor.CustomizeGraphicAccentColor.ColorId;
        }
            if (screenType == "Graphics" && (objColor.CustomizeGraphicAccentColor == undefined || (Utility.getObjectlength(objColor.CustomizeGraphicAccentColor, 'vljs254') <= 0) || colorId == 0 || colorId == null) && objColor.ColorizeId3 == CONFIG.get('COLORIZEID_COLOR_3')) {
                message += MESSAGES.get('MESSAGE_GRAPHIC_ACCENT_COLOR_SELECTION');
                if (objColor.ColorizeId1 == CONFIG.get('COLORIZEID_NONE') && objColor.ColorizeId2 == CONFIG.get('COLORIZEID_COLOR_2')) {
                    colorId = objColor.CustomizeGraphicSecondaryColor.colorid || objColor.CustomizeGraphicSecondaryColor.ColorId;
                    if ((objColor.CustomizeGraphicSecondaryColor == undefined || (Utility.getObjectlength(objColor.CustomizeGraphicSecondaryColor, 'vljs254') <= 0) || colorId == 0 || colorId == null)) {
                        message = '';
                        message = MESSAGES.get('MESSAGE_GRAPHIC_PRIMARY_COLOR_SELECTION');
                    } else {
                        return true;
                    }
                }
                isValidate = false;
            }
        

        if (!isValidate) {
            $('#dvIdAlertSection').html('');
            var arr = message.split(",");
            var messageHtml = '';
            var count = 0;
            var paddingTop = '0px';
            for (var i = 0; i < arr.length; i++) {
                count++;
                messageHtml += '<div id=dvAlertPopupMessageGraphics>' + arr[i] + '</div>'
            }
            if (count == 3) {
                paddingTop = '4px';
            } else if (count == 2) {
                paddingTop = '10px';
            }
            $('#dvIdAlertSection').html(messageHtml).css('padding-top', paddingTop);
            GlobalInstance.dialogBoxInstance.displayGraphicColorValidationDialogBox(TITLE.get('TITLE_SAVE_VALIDATION'));
            GlobalInstance.dialogBoxInstance.funcCallBack = null;
            GlobalInstance.dialogBoxInstance.funcCallBackForCancel = null;
            return false;
        }

        if (screenType == "Graphics" && objColor != null && (Utility.getObjectlength(objColor.CustomizeGraphicPrimaryColor, 'vljs243') > 0 || Utility.getObjectlength(objColor.CustomizeGraphicSecondaryColor, 'vljs243') > 0)) {
            return true;
        }
        if (objColor != null && objColor.fontColor) {
            return true;
        }

    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description validator: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
        return false;
    }
};
