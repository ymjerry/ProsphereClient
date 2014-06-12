/**
 * 
 TWA proshpere configurator
 * 
 * colorRetain.js tracks the color change in the Application
 * 
 * @package proshpere
 * @subpackage uibl
 */

/*
 * Constructor for ColorRetain class.
 * @return void
 */

function ColorRetain() {
    this.currentPanelAnchorPointStatusArray = new Array();
    this.panels = [PANEL_ID.get('playername'), PANEL_ID.get('graphic'), PANEL_ID.get('playernumber'), PANEL_ID.get('teamname'), PANEL_ID.get('othertext')]; //Set of panels that has color options
    this.specificScreenArray = new Array();
    this.graphicColorObject = new Object(); // Set the color object for Graphic screen
}

/**
 * 
 * @param currentPanel - Current Selected Panel
 * @param colorObject - ColorObject
 * @returns void
 */
ColorRetain.prototype.setModifiedColors = function(isPrimary, isSecondary, isAccent, colorObject) {
    var thisObject = this;
    //Get the screen names where anchor point is decorated
    this.getAnchorPointStatus(function(isAnchorPointDecorated) {
        if (isAnchorPointDecorated) {
            //Update the array (this.specificScreenArray) that determines in which screen color is to be updated
            thisObject.setSpecificScreens();
            //Update the color in the panels where anchor point is not decorated
            thisObject.updateColorInSpecificScreens(isPrimary, isSecondary, isAccent, colorObject);
        } else {
            //Update all the panels that has color
            thisObject.updateColorInAllScreens(isPrimary, isSecondary, isAccent, colorObject);
        }
    });
};

/**
 * This method get the anchor point status in the Application
 * @param currentpanel - current screen name
 */
ColorRetain.prototype.getAnchorPointStatus = function(callback) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var uniformAnchorPoint = GlobalInstance.uniformConfigurationInstance.getAnchorPoints();
    this.currentPanelAnchorPointStatusArray = new Array();
    if (Utility.getObjectlength(uniformAnchorPoint) > 0) {
        for (key in uniformAnchorPoint) {
            var apData = uniformAnchorPoint[key];
            if (!Utility.isExist(this.currentPanelAnchorPointStatusArray, apData.type)) {
                if (apData.type == PANEL_ID.get('uploadedgraphic')) {
                    continue;
                }
                this.currentPanelAnchorPointStatusArray.push(PANEL_ID.get(apData.type));
            }
        }
        callback(true);
    } else {
        callback(false);
    }
};

/**
 * This method update the this.specificScreenArray array that 
 * determines on which screen color is to be updated
 * @returns void
 */
ColorRetain.prototype.setSpecificScreens = function() {
    if (this.currentPanelAnchorPointStatusArray.length > 0) {
        this.specificScreenArray = new Array();
        for (var i = 0; i < this.panels.length; i++) {
            if (!Utility.isExist(this.currentPanelAnchorPointStatusArray, this.panels[i])) {
                this.specificScreenArray.push(this.panels[i]);
            }
        }
    }
};

/**
 * This method update the color in all the screens
 * @param  isPrimary - Primary Color selected or not
 * @param  isSecondary - Secondary Color selected or not
 * @param  isAccent - Accent Color selected or not
 * @param  colorObject - Color Object
 * @returns void
 */
ColorRetain.prototype.updateColorInAllScreens = function(isPrimary, isSecondary, isAccent, colorObject) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var thisObject = this;
    for (var i = 0; i < this.panels.length; i++) {
        switch (this.panels[i]) {
            case PANEL_ID.get('playername'):
                if (isPrimary) {
                    GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontColor', colorObject);
                } else if (isSecondary) {
                    GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontOutline1Color', colorObject);
                } else if (isAccent) {
                    GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontOutline2Color', colorObject);
                }
                break;
            case PANEL_ID.get('graphic'):
                if (isPrimary) {
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor, colorObject);
                    thisObject.graphicColorObject[GRAPHIC_KEY.CustomizeGraphicPrimaryColor] = colorObject;
                } else if (isSecondary) {
                    if(colorObject == null){
                        colorObject = {};
                        colorObject.background="background-color:";
                        colorObject.colorName="Optional";
                        colorObject.colorid=null;
                    }
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, colorObject);
                    thisObject.graphicColorObject[GRAPHIC_KEY.CustomizeGraphicSecondaryColor] = colorObject;
                } else if (isAccent) {
                    if(colorObject == null){
                        colorObject = {};
                        colorObject.background="background-color:";
                        colorObject.colorName="Optional";
                        colorObject.colorid=null;
                    }
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, colorObject);
                    thisObject.graphicColorObject[GRAPHIC_KEY.CustomizeGraphicAccentColor] = colorObject;
                }
                break;
            case PANEL_ID.get('playernumber'):
                if (isPrimary) {
                    GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontColor', colorObject);
                } else if (isSecondary) {
                    GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontOutline1Color', colorObject);
                } else if (isAccent) {
                    GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontOutline2Color', colorObject);
                }
                break;
            case PANEL_ID.get('teamname'):
                if (isPrimary) {
                    GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontColor', colorObject);
                } else if (isSecondary) {
                    GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontOutline1Color', colorObject);
                } else if (isAccent) {
                    GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontOutline2Color', colorObject);
                }
                break;
            case PANEL_ID.get('othertext'):
                if (isPrimary) {
                    GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontColor', colorObject);
                } else if (isSecondary) {
                    GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontOutline1Color', colorObject);
                } else if (isAccent) {
                    GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontOutline2Color', colorObject);
                }
                break;
        }
    }
};

/**
 * This method update the color in specific screens
 * @param  isPrimary - Primary Color selected or not
 * @param  isSecondary - Secondary Color selected or not
 * @param  isAccent - Accent Color selected or not
 * @param  colorObject - Color Object
 * @returns void
 */
ColorRetain.prototype.updateColorInSpecificScreens = function(isPrimary, isSecondary, isAccent, colorObject) {
    if (this.specificScreenArray.length > 0) {
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var thisObject = this;
        for (var i = 0; i < this.specificScreenArray.length; i++) {
            switch (this.specificScreenArray[i]) {
                case PANEL_ID.get('playername'):
                    if (isPrimary) {
                        GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontColor', colorObject);
                    } else if (isSecondary) {
                        GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontOutline1Color', colorObject);
                    } else if (isAccent) {
                        GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontOutline2Color', colorObject);
                    }
                    break;
                case PANEL_ID.get('graphic'):
                    if (isPrimary) {
                        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor, colorObject);
                        thisObject.graphicColorObject[GRAPHIC_KEY.CustomizeGraphicPrimaryColor] = colorObject;
                    } else if (isSecondary) {
                        if (colorObject == null) {
                            colorObject = {};
                            colorObject.background = "background-color:";
                            colorObject.colorName = "Optional";
                            colorObject.colorid = null;
                        }
                        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, colorObject);
                        thisObject.graphicColorObject[GRAPHIC_KEY.CustomizeGraphicSecondaryColor] = colorObject;
                    } else if (isAccent) {
                        if (colorObject == null) {
                            colorObject = {};
                            colorObject.background = "background-color:";
                            colorObject.colorName = "Optional";
                            colorObject.colorid = null;
                        }
                        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, colorObject);
                        thisObject.graphicColorObject[GRAPHIC_KEY.CustomizeGraphicAccentColor] = colorObject;
                    }
                    break;
                case PANEL_ID.get('playernumber'):
                    if (isPrimary) {
                        GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontColor', colorObject);
                    } else if (isSecondary) {
                        GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontOutline1Color', colorObject);
                    } else if (isAccent) {
                        GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontOutline2Color', colorObject);
                    }
                    break;
                case PANEL_ID.get('teamname'):
                    if (isPrimary) {
                        GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontColor', colorObject);
                    } else if (isSecondary) {
                        GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontOutline1Color', colorObject);
                    } else if (isAccent) {
                        GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontOutline2Color', colorObject);
                    }
                    break;
                case PANEL_ID.get('othertext'):
                    if (isPrimary) {
                        GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontColor', colorObject);
                    } else if (isSecondary) {
                        GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontOutline1Color', colorObject);
                    } else if (isAccent) {
                        GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontOutline2Color', colorObject);
                    }
                    break;
            }
        }
    }
};

/***********************************************************************************************************************************/
/*fontRetain.js*/
/**
 * This class maintain the font selection in various number and text screens
 * @returns void
 */
function FontSelection() {
    this.arrCurrentPanelAnchorPointStatus = new Array();
    this.panels = [PANEL_ID.get('playername'), PANEL_ID.get('playernumber'), PANEL_ID.get('teamname'), PANEL_ID.get('othertext')]; //Set of panels that has font options
    this.arrSpecificScreen = new Array();
    this.currentFont = null;
}


/**
 * 
 * @param currentPanel - Current Selected Panel
 * @param currentFont - Current font object
 * @returns void
 */
FontSelection.prototype.setModifiedFont = function (currentFont) {
    var thisObject = this;
    this.currentFont = currentFont;
    //Get the screen names where anchor point is decorated
    this.getAnchorPointStatus(function (isAnchorPointDecorated) {
        if (isAnchorPointDecorated) {
            //Update the array (this.arrSpecificScreen) that determines in which screen, font is to be updated
            thisObject.setSpecificScreens();
            //Update the color in the panels where anchor point is not decorated
            thisObject.updateFontInSpecificScreens();
        } else {
            //Update all the panels that has color
            thisObject.updateFontInAllScreens();
        }
    });
};

/**
 * This method get the anchor point status in the Application
 * @param callback - current screen name
 */
FontSelection.prototype.getAnchorPointStatus = function (callback) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var uniformAnchorPoint = GlobalInstance.uniformConfigurationInstance.getAnchorPoints();
    this.arrCurrentPanelAnchorPointStatus = new Array();
    if (Utility.getObjectlength(uniformAnchorPoint) > 0) {
        for (key in uniformAnchorPoint) {
            var apData = uniformAnchorPoint[key];
            if (!Utility.isExist(this.arrCurrentPanelAnchorPointStatus, apData.type)) {
                if (apData.type == PANEL_ID.get('uploadedgraphic') || apData.type == PANEL_ID.get('graphic')) {
                    continue;
                }
                this.arrCurrentPanelAnchorPointStatus.push(PANEL_ID.get(apData.type));
            }
        }
        callback(true);
    } else {
        callback(false);
    }
};

/**
 * This method update the arrSpecificScreen array that 
 * determines on which screen font is to be updated
 * @returns void
 */
FontSelection.prototype.setSpecificScreens = function () {
    if (this.arrCurrentPanelAnchorPointStatus.length > 0) {
        this.arrSpecificScreen = new Array();
        for (var i = 0; i < this.panels.length; i++) {
            if (!Utility.isExist(this.arrCurrentPanelAnchorPointStatus, this.panels[i])) {
                this.arrSpecificScreen.push(this.panels[i]);
            }
        }
    }
};

/**
 * This method update the color in all the screens
 * @returns void
 */
FontSelection.prototype.updateFontInAllScreens = function () {
    this.updateFontInScreens(this.panels);
};

/**
 * This method update the color in all the screens
 * @returns void
 */
FontSelection.prototype.updateFontInSpecificScreens = function () {
    this.updateFontInScreens(this.arrSpecificScreen);
};

/**
 * This method update the color in specific screens
 * @param  arrScreens - Array contain screens information. It may contain All number text and screens or selected screens
 * @returns void
 */
FontSelection.prototype.updateFontInScreens = function (arrScreens) {
    if (arrScreens.length > 0) {
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        
        for (var i = 0; i < arrScreens.length; i++) {
            switch (arrScreens[i]) {
                case PANEL_ID.get('playername'):
                    GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('font', this.currentFont);
                    break;
                case PANEL_ID.get('playernumber'):
                    GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('font', this.currentFont);
                    break;
                case PANEL_ID.get('teamname'):
                    GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('font', this.currentFont);
                    break;
                case PANEL_ID.get('othertext'):
                    GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('font', this.currentFont);
                    break;
            }
        }
    }
};