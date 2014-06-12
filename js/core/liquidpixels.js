/**
 * TWA proshpere configurator
 * 
 * liquidPixels.js is used to fetch URLs from the LiquidPixels Server based.
 * 
 * 
 * @package proshpere
 * @subpackage core
 */
var modelPreviewImageFadeOutEffectsTime = 1000; // in miliseconds
var modelPreviewImageFadeInEffectsTime = 1000; // in miliseconds
function LiquidPixels() {
    this.textEffectUrl = '';
}

/**
 * Returns the graphic URL of the LiquidPixels Server
 * 
 * @param Object designObject
 * @param String designName
 * @param Object colorObject
 * @param Integer layerCount
 * @param Object layerObject
 * @return string Actual URL of the graphic
 */

LiquidPixels.getGraphicUrl = function (designObject, designName, colorObject, layerCount, layerObject) {
    var primaryColor = CONFIG.get("DEFAULT_PRIMARY_COLOR");
    var secondaryColor = CONFIG.get("DEFAULT_SECONDARY_COLOR");
    var accentColor = CONFIG.get("DEFAULT_ACCENT_COLOR");
    var graphicHeight = CONFIG.get("DEFAULT_GRAPHIC_HEIGHT");
    if (colorObject) {
        if (colorObject.primary) {
            var pColorId = (colorObject.primary.colorid) ? colorObject.primary.colorid : colorObject.primary.ColorId;
            primaryColor = GlobalInstance.colorInstance.getColorByKey('_' + pColorId);
            primaryColor = (primaryColor.RgbHexadecimal).substring((primaryColor.RgbHexadecimal).indexOf('#') + 1);
        }

        if (colorObject.secondary) {
            var sColorId = (colorObject.secondary.colorid) ? colorObject.secondary.colorid : colorObject.secondary.ColorId;
            if (sColorId) {
                secondaryColor = GlobalInstance.colorInstance.getColorByKey('_' + sColorId);
                secondaryColor = (secondaryColor.RgbHexadecimal).substring((secondaryColor.RgbHexadecimal).indexOf('#') + 1);
            }
        }

        if (colorObject.accent) {
            var aColorId = (colorObject.accent.colorid) ? colorObject.accent.colorid : colorObject.accent.ColorId;
            if (aColorId) {
                accentColor = GlobalInstance.colorInstance.getColorByKey('_' + aColorId);
                accentColor = (accentColor.RgbHexadecimal).substring((accentColor.RgbHexadecimal).indexOf('#') + 1);
            }
        }
    }

    var width = designObject.Width;
    var height = designObject.Height;


    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var graphicInfo = null;
    if (Utility.getObjectlength(GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign)), 'getGraphicUrl') {
        graphicInfo = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign);
    }

    //get the layer count for slected graphics object if not provided in parameters
    if (!layerCount) {
        layerCount = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicLayerCount);
    }


    var url = LiquidPixels.getChainStart() + 'set=colorNone[none],Color1[%23' + primaryColor + '],Color3[%23' + accentColor + '],Color2[%23' + secondaryColor + '],scale[0.10],graphicWidth[' + width + '],graphicHeight[' + height + ']'
            + '&blank=width[global.graphicWidth],height[global.graphicHeight],color[global.colorNone],name[emblemBase]';
    //call function to get the layers from the location 
    var layerString = LiquidPixels.getGraphicLocationString(layerObject);
    url += layerString;
    url += '&scale=height[' + graphicHeight + ']';
    url += '&sink=format[png]';
    return url;
};
/**
 * This method converts the component  to HEX
 * @param value to convert into hex
 * @returns 
 */
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
/**
 * This method converts rgb value to hex values
 * @param  r
 * @param g
 * @param b
 * @returns Hexadecomanl Value
 *  */
LiquidPixels.rgbToHex = function (r, g, b) {
    return ("#" + componentToHex(r) + componentToHex(g) + componentToHex(b));
}


/**
 * This method returns the CMYK to RGB values
 * @param c
 * @param m
 * @param y
 * @param k
 * @returns RGB value
 */
function cmykToRGB(c, m, y, k) {
    var objCMYK = new CMYK(c /* cyan */, m /* magenta */, y /* yellow */, k /* key black */);
    var result = ColorConverter.toRGB(new CMYK(objCMYK.c /* cyan */, objCMYK.m /* magenta */, objCMYK.y /* yellow */, objCMYK.k /* key black */));
    return LiquidPixels.rgbToHex(result.r, result.g, result.b);
}


/**
 * This method reterives the layers on the basis of the variable 'color'
 * @param layerObject this contains the details of layers of graphic
 * @returns layers of graphic
 */
LiquidPixels.getGraphicLocationString = function (layerObject, isForProductionURL) {
    var url = '', hexcolor = '', color = '';
    isForProductionURL = (typeof isForProductionURL != 'undefined') ? isForProductionURL : false;
    $.each(layerObject, function (i, data) {
        if (data.Loc !== '') {

            if (data.ColorizeId != CONFIG.get("COLORIZEID_NONE")) {

                url += '&set=imageColor[global.' + data.ColorizeName + '],imageFilePath[file:' + encodeURIComponent(data.Loc) + ']'
                        + '&call=url[file:/ASSETS/anchor-stockGraphic_r0.chain]';
            }
            else {
                hexcolor = cmykToRGB(data.Cyan, data.Magenta, data.Yellow, data.Black);
                color = encodeURIComponent(hexcolor);
                if (isForProductionURL) {
                    //Production Url Case
                    color = encodeURIComponent(Utility.cmykToHexCmyk(data));
                }
                url += '&set=imageColor[' + color + '],imageFilePath[file:' + encodeURIComponent(data.Loc) + ']'
                        + '&call=url[file:/ASSETS/anchor-stockGraphic_r0.chain]';
            }
        }
    });
    return url;
}
/**
 * This method to reterive the Uniform logo from lp server
 * @param positionX
 * @param positionY
 * @param rotationalDegree
 * @returns returns the command set of uniform Logo 
 */
LiquidPixels.getUniformLogo = function (positionX, positionY, rotationalDegree, styleInfo) {
    var primaryColor = '';//TODO fill the colors from uniform config or hardcode after response from dave 01/04/2013
    var secondaryColor = '';//TODO fill the colors from uniform config or hardcode after response from dave 01/04/2013
    var tertiaryColor = '';//TODO fill the colors from uniform config or hardcode after response from dave 01/04/2013
    
    var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();

    var logoChain = '';
    logoChain = jQuery.map(CONFIG.get('UNIFORM_LOGO_CHAIN_SUPPORTED_SPORTS_STYLES').sport, function (sportCategoryInfo) {

        if (sportCategoryInfo.id == categoryInfo.Id) {
            return jQuery.map(sportCategoryInfo.supportedStyles, function (styleNumber) {
                
                if (styleNumber == styleInfo.StyleNumber) {
                    return sportCategoryInfo.chain;
                }
            });
        }
    });
    logoChain = logoChain ? logoChain[0] : '';

    if (logoChain == undefined || logoChain == '')
        logoChain = CONFIG.get('DEFAULT_LOGO_CHAIN');

    return "&set=rot[" + rotationalDegree + "],xPos[" + positionX + "],yPos[" + positionY + "],colorOne[" + primaryColor + "],colorTwo[" + secondaryColor + "],colorThree[" + tertiaryColor + "]"
        + "&call=url[file:" + logoChain + "]";


};

/**
 * This method returns the command set of Sublimated Tag
 * @param  tagPostionX
 * @param  tagPositionY
 * @param  playerName
 * @param  playerNumber
 * @param  garmentSize
 * @param  rotationalDegreeTag
 * @returns set of Sublimated Tag data
 */

LiquidPixels.getSublimatedTag = function (tagPostionX, tagPositionY, playerName, playerNumber, garmentSize, rotationalDegreeTag, styleInfo) {
    //var sessionInfo = objApp ? objApp.sessionResponseData : null;
    playerName = playerName ? playerName : '';
    playerNumber = playerNumber ? playerNumber : '';
    garmentSize = garmentSize ? garmentSize : '';

    // Rtv Code will be used as 0 before rtv code generation, this will be filled after saving the data through server 

    var reterivalCode = CONFIG.get('DEFAULT_RETRIEVAL_CODE');
    
    var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();

    var tagChain = '';
    tagChain = jQuery.map(CONFIG.get('SUBLIMATED_TAG_CHAIN_SUPPORTED_SPORTS_STYLES').sport, function (sportCategoryInfo) {
        
        if (sportCategoryInfo.id == categoryInfo.Id) {
            return jQuery.map(sportCategoryInfo.supportedStyles, function (styleNumber) {
                
                if (styleNumber == styleInfo.StyleNumber) {
                    return sportCategoryInfo.chain;
                }
            });
        }
    });
    tagChain = tagChain ? tagChain[0] : '';

    if (tagChain == undefined || tagChain == '')
        tagChain = CONFIG.get('DEFAULT_SUBLIMATED_TAG_CHAIN');

    
    return "&set=garmentSize[" + garmentSize + "],playerName[" + playerName + "],playerNumber[" + playerNumber + "],retrievalCode[" + reterivalCode + "],rot[" + rotationalDegreeTag + "],xPos[" + tagPostionX + "],yPos[" + tagPositionY + "]"
    + "&call=url[file:" + tagChain + "]";

};
/**
 * Returns the Fabric URL from the LiquidPixels Server
 * @param strId will be id or name or non-refined URL
 * @param nWidth width of the fabric
 * @param nRGBValue primary color of the design
 *  * @return string Actual URL of the graphic
 */

LiquidPixels.getFabricUrl = function (height, width, fabricItemId) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var uniformPrimaryColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformPrimaryColor');
    var selectedColor = (uniformPrimaryColor) ? uniformPrimaryColor.RgbHexadecimal : CONFIG.get('FABRIC_DEFAULT_COLOR'); // default fabric color    
    fabricItemId = fabricItemId ? fabricItemId : '';
    fabricItemId += '.png';
    var opacity = CONFIG.get("FABRIC_OPACITY");

    if (selectedColor != undefined && selectedColor != '') {
        var fabircUrl = LiquidPixels.getChainStart() + "source=name[fabric],url[file:/ASSETS/fabrics/" + fabricItemId + "]"
                + "&blank=color[white],height[fabric.height],name[alpha],width[fabric.width]"
                + "&blank=color[" + encodeURIComponent(selectedColor) + "],height[fabric.height],name[body],width[fabric.width]"
                + "&composite=compose[replacematte],image[alpha]&select=image[fabric]"
                + "&composite=compose[colorize],image[body],opacity[" + opacity + "]"
                + "&scale=height[" + height + "],width[" + width + "]"
                + this.getChainEnd();
        return fabircUrl;
    }

    else
        return false;
};
/**
 * This method returns the flatcut url of respective style
 * @param isForTop boolean value:if the flatcut is for top or bottom
 * @param styleNum Respective Style number for flatcut image
 * @param sizeNum Respective SizeNumber of Flatcut
 * @param playerName Player name that has been added in the roster or uniform embellishments
 * @param playerNumber Player name that has been added in the Roster or Uniform Embellishemnts
 * @param styleId Respective Style ID
 * @returns String Actual Flatcut URL
 */
LiquidPixels.getFlatCutUrl = function (isForTop, styleNum, sizeNum, playerName, playerNumber, styleId) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var uniformPrimaryColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformPrimaryColor').RgbHexadecimal;
    var uniformSecondaryColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformSecondaryColor').RgbHexadecimal;
    var uniformTertiaryColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformTertiaryColor').RgbHexadecimal;
    var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
    uniformPrimaryColor = uniformPrimaryColor.replace(/^#+/, "%23");
    uniformSecondaryColor = uniformSecondaryColor.replace(/^#+/, "%23");
    uniformTertiaryColor = uniformTertiaryColor.replace(/^#+/, "%23");
    var responseSelectedAnchorPoint = null;
    var tagData = '';
    var tagObj = '';
    var positionXLogo = '';
    var positionYLogo = '';
    var rotationalDegreeLogo = '';
    var positionXTag = '';
    var positionYTag = '';
    var rotatonalDegreeTag = '';
    var logoObj = '';
    var category = categoryInfo.Name ? categoryInfo.Name.toLowerCase() : 'football';
    var currentDesign = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
    var isForYouth = false;
    var isCopiedStyle = false;
    var selectedStyle = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(styleId);
    if (!selectedStyle) {
        selectedStyle = GlobalInstance.getStyleAndDesignInstance().getYouthStyleByKey(styleId);
        if (selectedStyle) {
            isForYouth = true;
        }
    }
    var styleToBeUsed = selectedStyle;
    if (selectedStyle.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
        isCopiedStyle = true;
        if (!isForYouth) {
            styleToBeUsed = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(selectedStyle.CopyOfStyleId);
        } else {
            styleToBeUsed = GlobalInstance.getStyleAndDesignInstance().getYouthStyleByKey(selectedStyle.CopyOfStyleId);
        }
    }
    //design object values need to used from orginial style object 
    //var copyOfStyleDesign = Utility.getDesignObject(styleToBeUsed.StyleId, currentDesign.DesignNumber, isForYouth,isCopiedStyle);
    var selectedStyleDesign = Utility.getDesignObject(styleToBeUsed.StyleId, currentDesign.DesignNumber, isForYouth, isCopiedStyle);
    if (Utility.getObjectlength(selectedStyleDesign) > 0) {
        if (isCopiedStyle) {
            selectedStyleDesign = GlobalInstance.uniformConfigurationInstance.getCopyOfStyleDesignsInfo();
            if (isForYouth) {
                selectedStyleDesign = GlobalInstance.uniformConfigurationInstance.getCopyOfStyleYouthDesignsInfo();
            }
        }
    } else {
        //IF designs for youth is not coming , then return else it will generate flat cut for youth
        return;
    }
    styleNum = styleToBeUsed.StyleNumber;
    var designName = currentDesign.DesignNumber;
    var scale = CONFIG.get("FLATCUT_SCALE");
    var styleHeight = CONFIG.get("FLATCUT_STYLEHEIGHT");
    var styleWidth = CONFIG.get("FLATCUT_STYLEWIDTH");
    var view = CONFIG.get("FLATCUT_VIEW");
    var sizeSuffix = CONFIG.get("SIZE_SUFFIX");

    if (!view) {
        view = CONFIG.get("BIRD_EYE_VIEW_ORIENTATION_FRONT");
    }

    if (selectedStyleDesign) {
        $.each(selectedStyleDesign.Sizes, function (i, size) {
            if (size.SizeNumber == sizeNum) {
                styleWidth = size.Width;
                styleHeight = size.Height;
                return false;
            }
        });
    }

    ////////////////////////////////////////////////////////////
    if (isForYouth) {
        if (isForTop) {
            responseSelectedAnchorPoint = GlobalInstance.getAnchorPointInstance().youthTopAnchorPointsResponseData;
        } else {
            responseSelectedAnchorPoint = GlobalInstance.getAnchorPointInstance().youthBottomAnchorPointsResponseData;
        }
    } else {
        if (isForTop) {
            responseSelectedAnchorPoint = GlobalInstance.getAnchorPointInstance().adultTopAnchorPointsResponseData;
        } else {
            responseSelectedAnchorPoint = GlobalInstance.getAnchorPointInstance().adultBottomAnchorPointsResponseData;
        }
    }
    for (var objKey in responseSelectedAnchorPoint) {
        if (responseSelectedAnchorPoint[objKey].SizeNumber == sizeNum) {
            tagData = responseSelectedAnchorPoint[objKey].AnchorPoints;
            {
                for (var objKey2 in tagData) {
                    if (tagData[objKey2].ContentId == CONFIG.get("CONTENT_ID_LOGO")) {
                        logoObj = tagData[objKey2];
                    }
                    if (tagData[objKey2].ContentId == CONFIG.get("CONTENT_ID_TAG")) {
                        tagObj = tagData[objKey2];
                    }
                }
            }
        }
    }

    positionXLogo = logoObj.X || CONFIG.get("LOGO_POSITION");
    positionYLogo = logoObj.Y || CONFIG.get("LOGO_POSITION");
    rotationalDegreeLogo = logoObj.Rotation || CONFIG.get("LOGO_ROTATION");
    positionXTag = tagObj.X || CONFIG.get("LOGO_POSITION");
    positionYTag = tagObj.Y || CONFIG.get("LOGO_POSITION");
    rotatonalDegreeTag = tagObj.Rotation || CONFIG.get("TAG_ROTATION");


    var previewUrl = LiquidPixels.getChainStart()
        + LiquidPixels.getFlatCutAnchorPointChainUrlPart(isForTop, playerName, playerNumber, sizeNum, true, null, isForYouth, false, styleToBeUsed)
        + this.getUniformLogo(positionXLogo, positionYLogo, rotationalDegreeLogo, styleToBeUsed)
        + this.getSublimatedTag(positionXTag, positionYTag, playerName, playerNumber, sizeNum, rotatonalDegreeTag, styleToBeUsed)
        + this.getFlatCutLabel()
        + LiquidPixels.getChainEnd();
    previewUrl = previewUrl.replace(LiquidPixels.getChainStart() + "&", LiquidPixels.getChainStart());

    previewUrl = Utility.replaceAll("##color1hex", uniformPrimaryColor, previewUrl);
    previewUrl = Utility.replaceAll("##color2hex", uniformSecondaryColor, previewUrl);
    previewUrl = Utility.replaceAll("##color3hex", uniformTertiaryColor, previewUrl);
    previewUrl = Utility.replaceAll("##category", category, previewUrl);
    previewUrl = Utility.replaceAll("##designNumber", designName, previewUrl);
    previewUrl = Utility.replaceAll("##scale", scale, previewUrl);
    previewUrl = Utility.replaceAll("##sizeNumber", sizeNum, previewUrl);
    previewUrl = Utility.replaceAll("##sizeSuffix", sizeSuffix, previewUrl);
    previewUrl = Utility.replaceAll("##styleHeight", styleHeight, previewUrl);
    previewUrl = Utility.replaceAll("##styleNumber", styleNum, previewUrl);
    previewUrl = Utility.replaceAll("##styleBottom", styleNum, previewUrl);
    previewUrl = Utility.replaceAll("##styleTop", styleNum, previewUrl);
    previewUrl = Utility.replaceAll("##styleWidth", styleWidth, previewUrl);
    previewUrl = Utility.replaceAll("##view", view, previewUrl);
    previewUrl = Utility.replaceAll("##bottomStyleHeight", styleHeight, previewUrl);
    previewUrl = Utility.replaceAll("##bottomSizeNumber", sizeNum, previewUrl);
    previewUrl = Utility.replaceAll("##bottomStyleWidth", styleWidth, previewUrl);
    previewUrl = previewUrl.replace("size[", "sizeNumber["); //special case
    return previewUrl;

};
/**
 * This method is used to generate the Production URL 
 * @param {Boolean} isTop: if the flatcut is for top or bottom
 * @param currentStyleNumber Respective Style Number of flatcut
 * @param currentPlayerSize : current Player Size Choosen from the Roster
 * @param ageCategory to determine whether the Design choosen is of youth or adult
 * @param name Respective Name of the Player
 * @param number Respective Number of the Player
 * @param styleId Respective Style ID
 * @returns String  production URL 
 */

LiquidPixels.getProductionUrl = function (isTop, currentStyleNumber, currentPlayerSize, ageCategory, name, number, styleId) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var uniformPrimaryColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformPrimaryColor').CmykHexadecimal;
    var uniformSecondaryColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformSecondaryColor').CmykHexadecimal;
    var uniformTertiaryColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformTertiaryColor').CmykHexadecimal;
    var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
    uniformPrimaryColor = uniformPrimaryColor.replace(/^#+/, "%23");
    uniformSecondaryColor = uniformSecondaryColor.replace(/^#+/, "%23");
    uniformTertiaryColor = uniformTertiaryColor.replace(/^#+/, "%23");
    var category = categoryInfo.Name ? categoryInfo.Name.toLowerCase() : 'football';
    var sizeNum = currentPlayerSize;
    var responseSelectedAnchorPoint = null;
    var tagData = '';
    var tagObj = '';
    var positionXLogo = '';
    var positionYLogo = '';
    var rotationalDegreeLogo = '';
    var positionXTag = '';
    var positionYTag = '';
    var rotationalDegreeTag = '';
    var logoObj = '';
    var isCopyOfStyle = false;

    var isYouth = false;
    var selectedStyle = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(styleId);

    if (ageCategory == CONFIG.get('AGE_CATEGORY_BOYS') || ageCategory == CONFIG.get('AGE_CATEGORY_GIRLS')) {
        selectedStyle = GlobalInstance.getStyleAndDesignInstance().getYouthStyleByKey(styleId)
        isYouth = true;
    }

    if (!selectedStyle) {
        return '';
    }

    var styleToBeUsed = selectedStyle;
    if (selectedStyle.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
        isCopyOfStyle = true;
        if (!isYouth) {
            styleToBeUsed = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(selectedStyle.CopyOfStyleId);
        } else {
            styleToBeUsed = GlobalInstance.getStyleAndDesignInstance().getYouthStyleByKey(selectedStyle.CopyOfStyleId);
        }
    }

    var currentDesign = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
    var selectedStyleDesign = null;
    if (currentDesign) {
        //this method handles if the current style is a copy of some other style and returns the copied design object
        selectedStyleDesign = Utility.getDesignObject(styleToBeUsed.StyleId, currentDesign.DesignNumber, isYouth, isCopyOfStyle);
    }

    //return blank if design object is null
    if (!currentDesign) {
        return '';
    }

    var designName = currentDesign.DesignNumber;
    var styleNum = styleToBeUsed ? styleToBeUsed.StyleNumber : '';
    var scale = CONFIG.get("PRODUCTION_SCALE");
    var styleHeight = CONFIG.get("PRODUCTION_STYLE_HEIGHT");
    var styleWidth = CONFIG.get("PRODUCTION_STYLE_WIDTH");
    if (selectedStyleDesign && Utility.getObjectlength(selectedStyleDesign) > 0) {
        $.each(selectedStyleDesign.Sizes, function (i, size) {
            if (size.SizeNumber == sizeNum) {
                styleWidth = size.Width;
                styleHeight = size.Height;
                return false;
            }
        });
    } else {
        //Handle the Youth case when designs are not present
        return;
    }

    if (isYouth) {
        if (isTop) {
            responseSelectedAnchorPoint = GlobalInstance.getAnchorPointInstance().youthTopAnchorPointsResponseData;
        } else {
            responseSelectedAnchorPoint = GlobalInstance.getAnchorPointInstance().youthBottomAnchorPointsResponseData;
        }
    } else {
        if (isTop) {
            responseSelectedAnchorPoint = GlobalInstance.getAnchorPointInstance().adultTopAnchorPointsResponseData;
        } else {
            responseSelectedAnchorPoint = GlobalInstance.getAnchorPointInstance().adultBottomAnchorPointsResponseData;
        }
    }

    for (var objKey in responseSelectedAnchorPoint) {
        if (responseSelectedAnchorPoint[objKey].SizeNumber == sizeNum) {
            tagData = responseSelectedAnchorPoint[objKey].AnchorPoints;
            {
                for (var objKey2 in tagData) {
                    if (tagData[objKey2].ContentId == CONFIG.get("CONTENT_ID_LOGO")) {
                        logoObj = tagData[objKey2];
                    }
                    if (tagData[objKey2].ContentId == CONFIG.get("CONTENT_ID_TAG")) {
                        tagObj = tagData[objKey2];
                    }
                }
            }
        }
    }

    positionXLogo = logoObj.X || CONFIG.get("LOGO_POSITION");
    positionYLogo = logoObj.Y || CONFIG.get("LOGO_POSITION");
    rotationalDegreeLogo = logoObj.Rotation || CONFIG.get("LOGO_ROTATION");
    positionXTag = tagObj.X || CONFIG.get("LOGO_POSITION");
    positionYTag = tagObj.Y || CONFIG.get("LOGO_POSITION");
    rotationalDegreeTag = tagObj.Rotation || CONFIG.get("TAG_ROTATION");

    var productionUrl = LiquidPixels.getChainStart()
            + LiquidPixels.getFlatCutAnchorPointChainUrlPart(isTop, name, number, sizeNum, false, 1, isYouth, true, styleToBeUsed)
            + this.getUniformLogo(positionXLogo, positionYLogo, rotationalDegreeLogo, styleToBeUsed)
            + this.getSublimatedTag(positionXTag, positionYTag, name, number, sizeNum, rotationalDegreeTag, styleToBeUsed);
    /*+ '&addprofile=url[file:/profiles/GenericCMYK.icm]';*/

    //replace to remove extra & after chain start if added
    productionUrl = productionUrl.replace(LiquidPixels.getChainStart() + "&", LiquidPixels.getChainStart());
    productionUrl = Utility.replaceAll("##color1hex", uniformPrimaryColor, productionUrl);
    productionUrl = Utility.replaceAll("##color2hex", uniformSecondaryColor, productionUrl);
    productionUrl = Utility.replaceAll("##color3hex", uniformTertiaryColor, productionUrl);
    productionUrl = Utility.replaceAll("##category", category, productionUrl);
    productionUrl = Utility.replaceAll("##designNumber", designName, productionUrl);
    productionUrl = Utility.replaceAll("##scale", scale, productionUrl);
    productionUrl = Utility.replaceAll("##sizeNumber", sizeNum, productionUrl);
    productionUrl = Utility.replaceAll("_##sizeSuffix", '', productionUrl);
    productionUrl = Utility.replaceAll("##styleHeight", styleHeight, productionUrl);
    productionUrl = Utility.replaceAll("##styleNumber", styleNum, productionUrl);
    productionUrl = Utility.replaceAll("##styleBottom", styleNum, productionUrl);
    productionUrl = Utility.replaceAll("##styleTop", styleNum, productionUrl);
    productionUrl = Utility.replaceAll("##styleWidth", styleWidth, productionUrl);
    productionUrl = Utility.replaceAll("##view", 'front', productionUrl);
    productionUrl = Utility.replaceAll("##bottomStyleHeight", styleHeight, productionUrl);
    productionUrl = Utility.replaceAll("##bottomSizeNumber", sizeNum, productionUrl);
    productionUrl = Utility.replaceAll("##bottomStyleWidth", styleWidth, productionUrl);
    productionUrl = productionUrl.replace("size[", "sizeNumber["); //special case
    productionUrl = productionUrl.replace("colorNone[none]", "colorNone[%2300000000FF]");
    productionUrl = Utility.replaceAll("colorNone[none]", "colorNone[%2300000000FF]", productionUrl);
    productionUrl = Utility.replaceAll("colorNone%5Bnone%5D", "colorNone%5B%2300000000FF%5D", productionUrl);

    // graphicUrl = graphicUrl.replace("&sink=format[png]", "");

    //anchorName = anchorName.replace(/ /g, "_");
    
    return productionUrl;
    

};

/* returns the style URL from the LiquidPixels Server
 * 
 * @param str will be id or name or non-refined URL
 * 
 * @return string Actual URL of the style
 */
LiquidPixels.getStyleUrl = function (styleNumber) {
    if (styleNumber !== '') {
        var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
        var currentSportName = categoryInfo ? categoryInfo.Name.toLowerCase() : '';
        return LiquidPixels.getChainStart() + 'source=url[file:/ASSETS/tiles/styles/' + currentSportName + '/tiles_' + styleNumber + '.png]&scale=options[limit],size[400]' + this.getChainEnd();
    }
};
/**
 * returns the design URL from the LiquidPixels Server
 * 
 * @param str will be id or name or non-refined URL
 * 
 * @return string Actual URL of the design
 */
LiquidPixels.getDesignUrl = function (designNumber) {
    if (designNumber !== '') {
        var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
        return LiquidPixels.getChainStart() + 'source=url[file:/ASSETS/tiles/designs/' + categoryInfo.Name.toLowerCase() + '/tiles_' + designNumber + '.png]&scale=options[limit],size[400]' + this.getChainEnd();
    }
};
/*
 * This method returns the name of promo image
 * returns String the landing page promo image URL
 */

LiquidPixels.getPromoImageUrl = function (uid) {
    var promoImageUrl = '';

    var sessionInfo = objApp ? objApp.sessionResponseData : null;
    if (sessionInfo) {
        var userType = sessionInfo.UserType;
        if (userType == CONFIG.get('USER_TYPE_DEALER')) {
            promoImageUrl = CONFIG.get('IMAGE_DIR') + CONFIG.get('PRO_PLUS_DEALER_BANNER');
        }
        else {
            promoImageUrl = CONFIG.get('IMAGE_DIR') + CONFIG.get('PRO_PLUS_CONSUMER_BANNER');
        }

    }
    return promoImageUrl;
};
/**
 * Generate the Text Preview URL from the LP server
 * @param objTextEffect Object of text orientation
 * @param sTextEffect Info Regarding the selected Text Effect
 * @param sText contains the text Value
 * @param sFontName Contains the respective Font Name
 * @param fontId Contains the Respective Font ID
 * @param sFontColor Cotnains the Selected Font Color
 * @param sOutline1Color Contains the respective outline Color1
 * @param sOutline2Color cotnains the respective Outline Color2
 * @param sBaseImgWidth contains the Base Image width of the FOnt
 * @param sBaseImgHeight contians the Base Image height of the Font
 * @returns String the URL of the Text
 */
LiquidPixels.generateTextEffectPreviewURL = function (objTextEffect, sTextEffect,
        sText,
        sFontName,
        fontId,
        sFontColor,
        sOutline1Color,
        sOutline2Color,
        sBaseImgWidth,
        sBaseImgHeight

        ) {

    var textPosX, textPosY, height, textBoxHeight, textBoxWidth, width, fontSize, firstStrokeWidth, secondStrokeWidth;
    firstStrokeWidth = 0;
    secondStrokeWidth = 0;

    var decalList = GlobalInstance.getTextEffectInstance().getDecalList();
    var decalObject = null;
    if (decalList) {
        decalObject = decalList["_" + fontId];
    }
    //TODO- Put it into config file
    if (!objTextEffect || objTextEffect.Name == CONFIG.get("STRAIGHT_TEXT_NAME")) {
        textPosX = CONFIG.get("DEFAULT_TEXT_POSX");
        textPosY = CONFIG.get("DEFAULT_TEXT_POSY");
        height = CONFIG.get("DEFAULT_HEIGHT");
        width = CONFIG.get("DEFAULT_WIDTH");
        textBoxHeight = CONFIG.get("DEFAULT_TEXTBOX_HEIGHT");
        textBoxWidth = CONFIG.get("DEFAULT_TEXTBOX_WIDTH");
        if (decalObject) {
            var categoryMatched = '';
            if ($.isNumeric(sText)) {
                categoryMatched = CONFIG.get('STRING_TYPE_NUMBER');
            } else {
                categoryMatched = CONFIG.get('STRING_TYPE_NAME');
            }

            //get decal object based on text decal category id
            var decalObject = jQuery.map(decalObject.TextDecalCategories, function (obj) {
                if (obj.TextDecalCategoryId == categoryMatched) {
                    return obj.TextDecalSizes[0].TextDecals[0];
                }
            });

            decalObject = decalObject[0];
            if (sOutline1Color != 'None') {
                firstStrokeWidth = decalObject.StrokeWidth01;
            }

            if (sOutline2Color != 'None') {
                secondStrokeWidth = decalObject.StrokeWidth02;
            }

            fontSize = decalObject.FontSize;
            textPosX = 0;
            textPosY = 0;
            height = decalObject.Height;
            width = decalObject.Width;
            textBoxHeight = decalObject.TextBoxHeight;
            textBoxWidth = decalObject.TextBoxWidth;
        }
    } else {
        textPosX = objTextEffect.OffsetX || CONFIG.get("DEFAULT_TEXT_POSX");
        textPosY = objTextEffect.OffsetY || CONFIG.get("DEFAULT_TEXT_POSY");
        height = objTextEffect.Height || CONFIG.get("DEFAULT_HEIGHT");
        width = objTextEffect.Width || CONFIG.get("DEFAULT_WIDTH");
        textBoxHeight = objTextEffect.TextBoxHeight || CONFIG.get("DEFAULT_TEXTBOX_HEIGHT");
        textBoxWidth = objTextEffect.TextBoxWidth || CONFIG.get("DEFAULT_TEXTBOX_WIDTH");


        if (decalObject) {
            var categoryMatched = '';
            if ($.isNumeric(sText)) {
                categoryMatched = CONFIG.get('STRING_TYPE_NUMBER');
            } else {
                categoryMatched = CONFIG.get('STRING_TYPE_NAME');
            }

            //get decal object based on text decal category id
            var decalObject = jQuery.map(decalObject.TextDecalCategories, function (obj) {
                if (obj.TextDecalCategoryId == categoryMatched) {
                    return obj.TextDecalSizes[0].TextDecals[0];
                }
            });

            decalObject = decalObject[0];
            //decalObject = decalObject.TextDecalCategories[1].TextDecalSizes[0].TextDecals[0];
            if (sOutline1Color != 'None') {
                firstStrokeWidth = decalObject.StrokeWidth01;
            }
            if (sOutline2Color != 'None') {
                secondStrokeWidth = decalObject.StrokeWidth02;
            }

            fontSize = decalObject.FontSize;
        }
    }

    sFontName = sFontName || "BauhausStd-Demi";
    sFontColor = sFontColor || CONFIG.get('DEFAULT_FONT_COLOR');
    sOutline1Color = sOutline1Color || CONFIG.get('NONE_VALUE');
    sOutline2Color = sOutline2Color || CONFIG.get('NONE_VALUE');
    sBaseImgWidth = sBaseImgWidth || CONFIG.get('DEFAULT_BASEIMG_WIDTH');
    sBaseImgHeight = sBaseImgHeight || CONFIG.get('DEFAULT_BASEIMG_HEIGHT');

    var chainFileLocation = '/ASSETS/anchor-textEffect_r0.chain';
    if (!sTextEffect) {
        chainFileLocation = '/ASSETS/anchor-text_r0.chain';
    }

    sText = encodeURIComponent(sText || "");

    if (sText !== "") {
        var url = LiquidPixels.getChainStart() + 'set=emblemBaseHeight[' + height + '],emblemBaseWidth[' + width + '],';
        url += 'gridfile_text[file:' + sTextEffect + '],textGravity[center],textRotation[0]&set=heightOption[ne],textBoxHeight[' + textBoxHeight + '],textBoxWidth[' + textBoxWidth + '],textPosX[' + textPosX + '],textPosY[' + textPosY + '],widthOption[%3E]&set=colorNone[none],strokeColorOne[%23' + sOutline1Color + '],strokeColorTwo[%23' + sOutline2Color + '],textColorOne[%23' + sFontColor + ']&set=firstStrokeWidth[' + firstStrokeWidth + '],fontName[ASSETS/' + sFontName + '],fontSize[' + fontSize + '],secondStrokeWidth[' + secondStrokeWidth + '],textString[' + sText + ']&call=url[file:' + chainFileLocation + ']&scale=height[' + sBaseImgHeight + '],width[' + sBaseImgWidth + ']&sink=format[png]';
        return url;
    }
    return '';
};

/**
 * Updates the model preview  based on attribute selection
 * 
 * @param previewOrientation will be Orientation type 'front','back' etc
 * @param componentId will be HTML tag id
 * 
 *
 */

var modelPreviewRequestQueue = new Array();
LiquidPixels.updateModelPreview = function (which, isShowTimer) {
    //Log.trace('LP UpdateModelPreview is called from ' + which);
    // TODO
    // Copying the file to our local server by using 'MODEL_PREVIEW_IMAGE_URL' service
    var processStart = new Date();
    isShowTimer = isShowTimer !== undefined ? isShowTimer : true;
    if (isShowTimer) {
        $.startProcess(true, 'updatemodelpreview');
    }
    var processEnd = new Date();
    
    Log.trace("Process took: " + (processEnd - processStart) + "ms");
    try {
        var isLargerPreview = false;
        
        var previewImageSource = LiquidPixels.generatePreviewUrl(isLargerPreview, null, null, null);
        //Log.trace('Final Model Preview Url------------------------'+previewImageSource);
        
        LiquidPixels.transformUrl(previewImageSource, function (shortPreviewImageSource) {
            LiquidPixels.showPreviewImage(shortPreviewImageSource);
        });
    } catch (e) {
        Log.error('Exception in the Update Model Preview ------' + e.message);
        $.doneProcess('updateModelPreview catch');
    }
};

var objImagePreview = null;
var rosterImageLastResource = '';
var lastSource = '';
var previewImageStart = 0;
LiquidPixels.showPreviewImage = function (previewImageSource) {
    previewImageStart = new Date();
    var previewStartTime = new Date().getTime();
    var previewStart = new Date(previewStartTime);
    Log.trace('2) STARTS: Model preview LP call starts at ' + (previewStart.toString()))
    try {
        if (objImagePreview) {

            objImagePreview.imageObject = null;
            objImagePreview = null;

        }
        objImagePreview = new ImagePreview();
        if (objImagePreview.imageObject.src != '') {
            objImagePreview.imageObject.src = '';
        }
        objImagePreview.imageObject.src = previewImageSource;
        objImagePreview.load(previewImageSource);
        lastSource = previewImageSource;

    }
    catch (err) {
        txt = "Error description lpjs 821: " + err.message + "\n\n";
        txt += "Error filename: " + err.fileName + "\n\n";
        txt += "Error lineNumber: " + err.lineNumber + "\n\n";
        Log.error(txt);
    }
};

var objRosterImagePreview = null;
LiquidPixels.showRosterPreviewImage = function (previewImageSource, isClickEvent) {

    try {
        if (objRosterImagePreview) {

            objRosterImagePreview.rosterImageObject = null;
            objRosterImagePreview = null;


        }
        objRosterImagePreview = new RosterImagePreview();
        if (objRosterImagePreview.rosterImageObject.src != '') {
            objRosterImagePreview.rosterImageObject.src = '';
        }
        objRosterImagePreview.rosterImageObject.src = previewImageSource;
        objRosterImagePreview.load(previewImageSource);
        if (isClickEvent) {
            rosterImageLastResource = previewImageSource;
        } else {
            rosterImageLastResource = lastSource;
        }

    }
    catch (err) {
        txt = "Error description lpjs 888: " + err.message + "\n\n";
        txt += "Error filename: " + err.fileName + "\n\n";
        txt += "Error lineNumber: " + err.lineNumber + "\n\n";
        Log.error(txt);
    }


};
/**
 * This method contians the starting URL of the chain
 * @returns String start URL
 */

LiquidPixels.getChainStart = function () {
    return CONFIG.get("LIQUID_PIXEL_CHAIN_BASE_URL");
};
/**
 * Thsi method contains the last command of the CHain
 * @param format Type of the Image
 * @returns String end url
 */
LiquidPixels.getChainEnd = function (format) {
    format = format || 'png';
    return "&sink=format[" + format + "]";
};

/**
 * This method implements the flatcut labels
 * @returns String flatcut label command 
 */
LiquidPixels.getFlatCutLabel = function () {
    return "&source=url[file:/ASSETS/PSbranding/proof/legend_600px.png],name[legend]"
            + "&blank=width[styleDesign.width],height[styleDesign.height],color[white],name[proof]"
            + "&composite=compose[over],image[styleDesign]"
            + "&select=image[proof]"
            + "&composite=compose[over],image[legend]";

};


LiquidPixels.getBaseChain = function () {
    return
};

/**
 * This method generates the Grid Files of Sleeves
 * @returns String sleeves command of the preivew URL
 */

LiquidPixels.getGridFilesForSleeves = function () {
    return "&select=image[styleDesign]"
            + "&blank=height[baseImage.height],name[grid],width[baseImage.width]"
            + "&tile=image[styleDesign]"
            + "&select=image[baseImage]";
};


/**
 * This method contains the Command set that needs to add before implementing grids for chest, also contains the crop command logic
 * @returns String the grid files commands 
 */
LiquidPixels.getGridFilesForChest = function () {
    return "&select=image[styleDesign]"
            + "&crop=height[styleDesign.height],width[styleDesign.width],x[0],y[(floor(styleDesign.height%20-%20baseImage.height))]"
            + "&blank=height[baseImage.height],name[grid],width[baseImage.width]"
            + "&tile=image[styleDesign]"
            + "&select=image[baseImage]";
};

/**
 * This method contains the commands that need to add on the bottom of the chain
 * @returns String the commands that need to add on the bottom of the chain
 */
LiquidPixels.getBottomChain = function () {
    return "&set=styleWidth[##styleWidth],category[##category],designName[##designNumber],scale[##scale],size[##sizeNumber],sizeSuffix[_##sizeSuffix],styleHeight[##styleHeight],styleNumber[##styleBottom],styleTop[##styleTop],view[##view]"
            + "&call=url[file:/ASSETS/3colorFlatcut_r0.chain]";
};

/**
 * This method contains the commands of Bottom Grid files
 * @returns String the commands that need to add after the implementation of Bottom Grid files
 */
LiquidPixels.getBottomGridFiles = function () {
    return "&select=image[styleDesign]"
            + "&blank=height[baseImage.height],name[grid],width[baseImage.width]"
            + "&tile=image[styleDesign]"
            + "&select=image[baseImage]";
};
/**
 *This method contains the Logic of the crop Command logic
 * @returns String Crop Command 
 */
LiquidPixels.getCropCommand = function () {
    return "&select=image[styleDesign]"
            + "&crop=height[styleDesign.height],width[styleDesign.width],x[0],y[%28floor%28styleDesign.height%20-%20baseImage.height%29%29]"
            + "&blank=height[baseImage.height],name[grid],width[baseImage.width]"
            + "&tile=image[styleDesign]"
            + "&select=image[baseImage]"
};

/**
 * This method contains colorize Commands
 * @param  colorId
 * @returns String colorize commands
 */
LiquidPixels.getColorizeCommand = function (colorId) {
    if (colorId == CONFIG.get("COLORID_TWO")) {
        return "&blank=name[colorize],width[baseImage.width],height[baseImage.height],color[##color1hex]"
                + "&select=image[baseImage]";
    } else if (colorId == CONFIG.get("COLORID_THREE")) {
        return "&blank=name[colorize],width[baseImage.width],height[baseImage.height],color[##color2hex]"
                + "&select=image[baseImage]";
    } else if (colorId == CONFIG.get("COLORID_FOUR")) {
        return "&blank=name[colorize],width[baseImage.width],height[baseImage.height],color[##color3hex]"
                + "&select=image[baseImage]";
    }
};

/**
 * This method returns the anchor point imposed in flat cut url part
 * @returns String flatcut with or with anchor points
 */

LiquidPixels.getFlatCutAnchorPointChainUrlPart = function (isTopFlatCut, playerName, playerNumber, sizeNumber, isLargerPreview, scaleValue, isYouthGender, isForProductionURL, style) {
    var url = LiquidPixels.getFlatcutChain(isTopFlatCut);
    var compositeChainPart = '';
    isForProductionURL = (typeof isForProductionURL != 'undefined') ? isForProductionURL : false;
    var anchorPoints = GlobalInstance.uniformConfigurationInstance.getAnchorPoints();
    GlobalInstance.rosterInstance = GlobalInstance.getRosterInstance();
    GlobalInstance.rosterInstance.arrYouthSizeProofInfo = new Array();
    GlobalInstance.rosterInstance.arrAdultSizeProofInfo = new Array();

    if (Utility.getObjectlength(anchorPoints, 'getFlatCutAnchorPointChainUrlPart') > 0) {
        //default size id
        var selectedDesignObject = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
        var previewSizeNumber = selectedDesignObject.PreviewDecalSizeNumber;

        //if size number is provided
        if (sizeNumber) {
            previewSizeNumber = sizeNumber;
        }
        var relatedAnchorPoints = new Array();
        var timeStamp = new Date().getTime();

        for (var key in anchorPoints) {
            var anchorPointObj = anchorPoints[key];

            //jump to next if anchor point is not for top
            var youthEmbllishmentInfo = { anchorPointId: anchorPointObj.id};//To keep the youth embllishment info
            var adultEmlishmentInfo = {anchorPointId:anchorPointObj.id};//To keep the adult embllishment info

            if (anchorPointObj.isForTop == "true" || anchorPointObj.isForTop == 'true' || anchorPointObj.isForTop == true) {
                anchorPointObj.isForTop = true;
            } else if (anchorPointObj.isForTop == "false" || anchorPointObj.isForTop == 'false' || anchorPointObj.isForTop == false) {
                anchorPointObj.isForTop = false;
            }
            if (anchorPointObj.isForTop != isTopFlatCut) {
                continue;
            }
            //get corrsponding anchor point object from the related size id
            var allRelatedAnchorPoints = null;
            var relatedAnchorPoints = null;

            if (isYouthGender) {
                if (anchorPointObj.isForTop) {
                    allRelatedAnchorPoints = GlobalInstance.getAnchorPointInstance().youthTopAnchorPointsResponseData;
                } else {
                    allRelatedAnchorPoints = GlobalInstance.getAnchorPointInstance().youthBottomAnchorPointsResponseData;
                }
            } else {
                if (anchorPointObj.isForTop) {
                    allRelatedAnchorPoints = GlobalInstance.getAnchorPointInstance().adultTopAnchorPointsResponseData;
                } else {
                    allRelatedAnchorPoints = GlobalInstance.getAnchorPointInstance().adultBottomAnchorPointsResponseData;
                }
            }



            var relatedAnchorPoint = null;
            if (allRelatedAnchorPoints) {
                for (var objKey in allRelatedAnchorPoints) {
                    if (allRelatedAnchorPoints[objKey].SizeNumber == previewSizeNumber) {
                        relatedAnchorPoints = allRelatedAnchorPoints[objKey].AnchorPoints;
                        for (var objKey2 in relatedAnchorPoints) {
                            if (relatedAnchorPoints[objKey2].Name == anchorPointObj.displayName) {
                                relatedAnchorPoint = relatedAnchorPoints[objKey2];
                                break;
                            }
                        }
                        break;
                    }
                }
            } else {
                continue;
            }

            if (!relatedAnchorPoint) {
                continue;
            }

            var type = anchorPointObj.type;
            var scale = scaleValue ? scaleValue : (isLargerPreview ? 0.095 : 0.048); //scale value
            var anchorName = anchorPointObj.displayName + relatedAnchorPoint.AnchorPointId;
            anchorName = anchorName.replace(/ /g, "_");
            var anchorX = relatedAnchorPoint.X;
            var anchorY = relatedAnchorPoint.Y;
            var anchorOriginId = relatedAnchorPoint.AnchorOriginId;
            var anchorRelativeId = anchorPointObj.RelativeAnchorId;
            var anchorRelationSpace = anchorPointObj.RelationSpace;
            var anchorRelationshipId = anchorPointObj.RelationshipId;
            var heightAnchorPoint = relatedAnchorPoint.height;
            var rotation = relatedAnchorPoint.Rotation;
            var disableScaling = true;//anchorPointObj.DisableScaling;

            //get size object
            var size = anchorPointObj.Size;


            var relatedSelectedSizeObject = null;
            var relatedSelectedSizes = null;
            var isText = false;
            var isGraphiccase = false;
            if (type == 'playername') {
                relatedSelectedSizes = relatedAnchorPoint.PlayerNames;
                isText = true;
                adultEmlishmentInfo.type = type;
                //To keep the youth embllishment type
                if (isYouthGender) {
                    youthEmbllishmentInfo.type = type;
                }
            }
            else if (type == 'playernumber') {
                relatedSelectedSizes = relatedAnchorPoint.PlayerNumbers;
                adultEmlishmentInfo.type = type;
                //To keep the youth embllishment type
                if (isYouthGender) {
                    youthEmbllishmentInfo.type = type;
                }
            }
            else if (type == 'graphic') {
                isGraphiccase = true;
                relatedSelectedSizes = relatedAnchorPoint.GraphicSizes;
                if (!size) {
                    size = relatedSelectedSizes[0];
                }
                adultEmlishmentInfo.type = type;
                //To keep the youth embllishment type
                if (isYouthGender) {
                    youthEmbllishmentInfo.type = type;
                }
            }
            else if (type == 'uploadedgraphic') {
                isGraphiccase = true;
                relatedSelectedSizes = relatedAnchorPoint.UploadedGraphicSizes;
                if (!size) {
                    size = relatedSelectedSizes[0];
                }
                adultEmlishmentInfo.type = type;
                //To keep the youth embllishment type
                if (isYouthGender) {
                    youthEmbllishmentInfo.type = type;
                }
            } else {
                relatedSelectedSizes = relatedAnchorPoint.TextSizes;
                isText = true;
                adultEmlishmentInfo.type = type;
                //To keep the youth embllishment type
                if (isYouthGender) {
                    youthEmbllishmentInfo.type = type;
                }
            }

            if (relatedSelectedSizes.length > 0) {
                for (var sizekey in relatedSelectedSizes) {
                    if (relatedSelectedSizes[sizekey] != null && relatedSelectedSizes[sizekey] != undefined && Utility.getObjectlength(relatedSelectedSizes[sizekey]) > 0 && size) {
                        if (relatedSelectedSizes[sizekey].SizeId == size.SizeId) {
                            relatedSelectedSizeObject = relatedSelectedSizes[sizekey];
                            break;
                        }
                    }

                }
            } else {
                size = null;
            }
            var newDecalSizeId = 0;
            var newRelatedSizes = null;
            if (relatedSelectedSizeObject) {
                size = relatedSelectedSizeObject;
                //Match the Youth Size if it has to use the same size or size has to be overwritten

                newDecalSizeId = GlobalInstance.getRosterInstance().getUpdatedSize(size, style, previewSizeNumber, isGraphiccase, isText);
                var textEffectInstance = null;
                if (!isGraphiccase) {
                    textEffectInstance = GlobalInstance.getTextEffectInstance().getTextDecalByKey('_' + anchorPointObj.FontId);
                    var arrOfTextDecal = new Array();
                    for (var key in textEffectInstance.TextDecalCategories) {
                        var sData = textEffectInstance.TextDecalCategories[key];
                        if (isText && sData.Name == "Text") {
                            arrOfTextDecal = sData.TextDecalSizes;
                            break;
                        } else if (!isText && sData.Name == "Number") {
                            arrOfTextDecal = sData.TextDecalSizes;
                            break;
                        }
                    }
                    var newTextSizeObject = {}
                    for (var obj in arrOfTextDecal) {
                        var data = arrOfTextDecal[obj];
                        if (data.TextDecalSizeId == newDecalSizeId) {
                            newTextSizeObject.Name = data.Name;
                            newTextSizeObject.SizeId = data.TextDecalSizeId;
                            newTextSizeObject.AnchorPointFontSizes = data.TextDecals;
                            break;
                        }
                    }

                    if (Utility.getObjectlength(newTextSizeObject) > 0) {
                        newRelatedSizes = JSON.parse(JSON.stringify(newTextSizeObject));
                    }
                    if (!isYouthGender) {
                        if (newRelatedSizes) {
                            size = newRelatedSizes;
                        }
                    } else {
                        if (newRelatedSizes && !anchorPointObj.isSameDimensionCheck) {
                            size = newRelatedSizes;
                        } else if (newRelatedSizes && anchorPointObj.isSameDimensionCheck) {
                            //Do not update the size object
                        }
                    }
                }

            }
            if (isGraphiccase && relatedSelectedSizes.length > 0 && !anchorPointObj.isSameDimensionCheck) {
                var graphicSizeId = '';
                for (var key in relatedSelectedSizes) {
                    var gData = relatedSelectedSizes[key];
                    if (gData.Name == size.Name) {
                        graphicSizeId = gData.SizeId;
                        break;
                    }
                }

                var newGraphicSize = JSON.parse(JSON.stringify(size));
                newGraphicSize.SizeId = graphicSizeId;
                newGraphicSize = GlobalInstance.getRosterInstance().getUpdatedSize(newGraphicSize, style, sizeNumber, isGraphiccase);
                if (Utility.getObjectlength(newGraphicSize) > 0) {
                    size = JSON.parse(JSON.stringify(newGraphicSize));
                }
            }



            var colorOne = CONFIG.get("NONE_VALUE");
            var colorTwo = CONFIG.get("NONE_VALUE");
            var colorThree = CONFIG.get("NONE_VALUE");
            if (anchorPointObj.FontColor) {
                var oColor1 = GlobalInstance.colorInstance.getColorByKey('_' + anchorPointObj.FontColor);
                colorOne = oColor1.RgbHexadecimal;
                if (isForProductionURL) {
                    colorOne = oColor1.CmykHexadecimal;
                }
            }

            if (anchorPointObj.FontOutlineColor1) {
                var oColor2 = GlobalInstance.colorInstance.getColorByKey('_' + anchorPointObj.FontOutlineColor1);
                colorTwo = oColor2.RgbHexadecimal;
                if (isForProductionURL) {
                    colorTwo = oColor2.CmykHexadecimal;
                }
            } else if (isForProductionURL) {
                //Merge Dave's Changes in the colorValue
                colorTwo = CONFIG.get('CMYK_NONE');
            }

            if (anchorPointObj.FontOutlineColor2) {
                var oColor3 = GlobalInstance.colorInstance.getColorByKey('_' + anchorPointObj.FontOutlineColor2);
                colorThree = oColor3.RgbHexadecimal;
                if (isForProductionURL && colorThree) {
                    colorThree = oColor3.CmykHexadecimal;
                }
            } else if (isForProductionURL) {
                //Merge Dave's Changes in the colorValue
                colorThree = CONFIG.get('CMYK_NONE');
            }

            //get common parameters from sizeObject
            var contentWidth = 0;
            var contentHeight = 0;
            var chainName = '';
            var graphicNameForSelectCommand = '';
            if (type == 'uploadedgraphic') {
                graphicNameForSelectCommand = 'UPG_' + anchorPointObj.id;
                if (size && Utility.getObjectlength(size) > 0) {
                    var grahicSizeValue = parseInt(size.ActualSize);
                    adultEmlishmentInfo.sizeName = size.ActualSize;
                    //Push the the youth embllishment info in the youth embllishment info
                    GlobalInstance.rosterInstance.arrAdultSizeProofInfo.push(adultEmlishmentInfo);
                    if (isYouthGender) {
                        youthEmbllishmentInfo.sizeName = size.ActualSize;
                        GlobalInstance.rosterInstance.arrYouthSizeProofInfo.push(youthEmbllishmentInfo);
                    }
                    //If graphic width is greater than graphic height , then content width should be scaled and content height should be calculated with the scaled content width value
                    contentWidth = Math.floor(grahicSizeValue * 150 * scale);
                    contentHeight = Math.floor(contentWidth * anchorPointObj.GraphicHeight / anchorPointObj.GraphicWidth);

                    //If graphic width is smaller than graphic height , then content content height should be scaled and content width should be calculated with the scaled content content height value
                    
                    if (parseInt(anchorPointObj.GraphicHeight) > parseInt(anchorPointObj.GraphicWidth)) {
                        contentHeight = contentWidth;
                        contentWidth = Math.floor(contentHeight * (anchorPointObj.GraphicWidth / anchorPointObj.GraphicHeight));
                    }
                    if (contentWidth == NaN || contentHeight == NaN) {
                        contentWidth = 0;
                        contentHeight = 0;
                    }
                    var graphicUrl = '';
                    graphicUrl = anchorPointObj.GraphicName;
                    var isKnockoutUrlUsed = graphicUrl.search("anchor-uploadedGraphic_bgKnockout_r0.chain");
                    if (isKnockoutUrlUsed > 0) {
                        graphicUrl = graphicUrl.replace("http://teamwork.liquifire.com/teamwork?", "");
                        graphicUrl = graphicUrl.replace("&sink=format[png]", "");
                        url += '&' + (graphicUrl);
                        url += '&' + encodeURI('scale=width[' + contentWidth + '],height[' + contentHeight + ']');
                        url += '&copy=name[origin]';

                    } else {
                        url += '&' + encodeURI('source=name[origin], url[' + graphicUrl + ']');
                        if (isForProductionURL) {
                            url += '&' + "addprofile=url[file:/profiles/GenericRGB.icm],if[('origin.colorspace' eq 'RGB')]";
                            url += '&' + "addprofile=url[file:/profiles/GenericCMYK.icm],if[('origin.colorspace' eq 'RGB')]";
                        }
                        url += '&' + encodeURI('scale=width[' + contentWidth + '],height[' + contentHeight + ']');
                        url += '&copy=name[origin]';
                    }
                    chainName = graphicNameForSelectCommand;
                } else {
                    continue;
                }
            }
            else if (type == 'graphic') {
                if (size && Utility.getObjectlength(size) > 0) {
                    var grahicSizeValue = CONFIG.get("DEFAULT_SIZE_VALUE");
                    if (size != null && size != undefined && Utility.getObjectlength(size) > 0) {
                        grahicSizeValue = parseInt(size.ActualSize);
                    }
                    adultEmlishmentInfo.sizeName = size.ActualSize;
                    //Push the the youth embllishment info in the youth embllishment info
                    GlobalInstance.rosterInstance.arrAdultSizeProofInfo.push(adultEmlishmentInfo);
                    if (isYouthGender) {
                        youthEmbllishmentInfo.sizeName = size.ActualSize;
                        GlobalInstance.rosterInstance.arrYouthSizeProofInfo.push(youthEmbllishmentInfo);
                    }
                    var graphicId = anchorPointObj.GraphicId;
                    var graphicObject = GlobalInstance.getSelectGraphicsInstance().getSelectedGraphicByGraphicId(graphicId);

                    //If graphic object is undefined or null , then get the graphic information from Clicked graphic info
                    if (!graphicObject) {
                        graphicObject = GlobalInstance.getUniformConfigurationInstance().getClickedGraphicsInfo("_"+graphicId);
                    }

                    var graphicHeight = 0;
                    var graphicWidth = 0;
					
					if(graphicObject.Height && graphicObject.Width){
					    graphicHeight = parseInt(graphicObject.Height);
						graphicWidth = parseInt(graphicObject.Width);

                        //If graphic width is greater than graphic height , then content width should be scaled and content height should be calculated with the scaled content width value
                        contentWidth = Math.floor(grahicSizeValue * 150 * scale);
                        contentHeight = Math.floor(contentWidth * (graphicHeight / graphicWidth)); //calculate the height using scaled width

                        //If graphic width is smaller than graphic height , then content content height should be scaled and content width should be calculated with the scaled content content height value
                        if (graphicHeight > graphicWidth) {
                            contentHeight = contentWidth;
                            contentWidth = Math.floor(contentHeight * (graphicWidth / graphicHeight));
                        }
					}	

                    var layerObject = null;
                    if (graphicObject) {
                        layerObject = graphicObject.Lys;
                    }

                    graphicNameForSelectCommand = 'GN_' + anchorPointObj.GraphicId;
                    var graphicChain = LiquidPixels.getGraphicChainUrl(layerObject, graphicWidth, graphicHeight, graphicNameForSelectCommand, colorOne, colorTwo, colorThree, isForProductionURL);

                    //if url already contains the graphics chain, then do no include it again
                    if (url.indexOf(graphicChain) >= 0) {
                        url += '&select=name[' + graphicNameForSelectCommand + ']';
                    } else {
                        url += graphicChain;
                    }
                    chainName = graphicNameForSelectCommand;
                } else {
                    continue;
                }
            } else {
                if (!size) {
                    //return url;
                    continue;
                }

                var sizes = size.AnchorPointFontSizes;

                if (!sizes) {
                    //return url;
                    continue;
                }


                //Keep the youth embllishment size info accordong to the anchorpoint type
                if (isYouthGender) {
                    if (type == LOCATION_TYPE.get('secPlayerNameAnchorPanel')) {
                        adultEmlishmentInfo.sizeName = size.Name;
                        youthEmbllishmentInfo.sizeName = size.Name;
                    } else if (type == LOCATION_TYPE.get('secPlayerNumberAnchorPanel')) {
                        adultEmlishmentInfo.sizeName = size.Name;
                        youthEmbllishmentInfo.sizeName = size.Name;
                    } else if (type == LOCATION_TYPE.get('secTeamNameAnchorPanel')) {
                        adultEmlishmentInfo.sizeName = size.Name;
                        youthEmbllishmentInfo.sizeName = size.Name;
                    } else if (type == LOCATION_TYPE.get('secOtherTextAnchorPanel')) {
                        adultEmlishmentInfo.sizeName = size.Name;
                        youthEmbllishmentInfo.sizeName = size.Name;
                    }

                    //Push the the youth embllishment info in the youth embllishment info
                    GlobalInstance.rosterInstance.arrAdultSizeProofInfo.push(adultEmlishmentInfo);

                    //Push the the youth embllishment info in the youth embllishment info
                    GlobalInstance.rosterInstance.arrYouthSizeProofInfo.push(youthEmbllishmentInfo);
                } else {
                    if (type == LOCATION_TYPE.get('secPlayerNameAnchorPanel')) {
                        adultEmlishmentInfo.sizeName = size.Name;
                    } else if (type == LOCATION_TYPE.get('secPlayerNumberAnchorPanel')) {
                        adultEmlishmentInfo.sizeName = size.Name;
                    } else if (type == LOCATION_TYPE.get('secTeamNameAnchorPanel')) {
                        adultEmlishmentInfo.sizeName = size.Name;
                    } else if (type == LOCATION_TYPE.get('secOtherTextAnchorPanel')) {
                        adultEmlishmentInfo.sizeName = size.Name;
                    }

                    //Push the the youth embllishment info in the youth embllishment info
                    GlobalInstance.rosterInstance.arrAdultSizeProofInfo.push(adultEmlishmentInfo);
                }

                var fontId = anchorPointObj.FontId
                var selectedFontSize = null;
                for (key2 in sizes) {
                    if (sizes[key2].FontId == fontId) {
                        selectedFontSize = sizes[key2];
                        break;
                    }
                }

                if (!selectedFontSize) {
                    return url;
                }

                var decalSizeWidth = selectedFontSize.DecalSizeWidth || selectedFontSize.TextBoxWidth;
                var decalSizeHeight = selectedFontSize.DecalSizeHeight || selectedFontSize.TextBoxHeight;
                var textBoxWidth = selectedFontSize.TextBoxWidth;
                var textBoxHeight = selectedFontSize.TextBoxHeight;
                var fontSize = selectedFontSize.FontSize;
                var firstStrokeWidth = 0;
                var SecondStrokeWidth = 0;
                //Check if first outline color and second outline colors are selected
                if (colorTwo != CONFIG.get("NONE_VALUE") && colorTwo != CONFIG.get('CMYK_NONE')) {
                    firstStrokeWidth = selectedFontSize.StrokeWidth01;
                }

                if (colorThree != CONFIG.get("NONE_VALUE") && colorThree != CONFIG.get('CMYK_NONE')) {
                    SecondStrokeWidth = selectedFontSize.StrokeWidth02;
                }
                
                var text = anchorPointObj.Text;
                var font = anchorPointObj.Font;
                var textOrientaion = '';
                var textPosX = 0;
                var textPosY = 0;

                //retrive relatedTextEffectObject
                if (anchorPointObj.TextOrientation) {
                    var textEffectObject = null;
                    var textEffects = null;
                    var newTextEffectObject = (anchorPointObj.TextOrientation.TextEffectCategorys[0]) ? anchorPointObj.TextOrientation.TextEffectCategorys[0].TextEffects : anchorPointObj.TextOrientation.TextEffectCategorys.TextEffects;
                    if (newTextEffectObject) { // Null check for texteffectcatagories
                        textEffects = newTextEffectObject;
                    }
                    if (anchorPointObj.TextOrientation.Name == CONFIG.get("STRAIGHT_TEXT_NAME")) {
                        textEffectObject = null;
                        textOrientaion = null;
                    } else {
                        for (var keyTextEffect in textEffects) {
                            var tempObj = textEffects[keyTextEffect];
                            if (tempObj.TextDecaleSizeId == (selectedFontSize.TextDecalSizeId || newDecalSizeId)) {
                                textEffectObject = tempObj;
                                break;
                            }
                        }
                    }

                    if (textEffectObject) {
                        decalSizeWidth = textEffectObject.Width || textEffectObject[0].Width;
                        decalSizeHeight = textEffectObject.Height || textEffectObject[0].Height;
                        textBoxWidth = textEffectObject.TextBoxWidth || textEffectObject[0].TextBoxWidth;
                        textBoxHeight = textEffectObject.TextBoxHeight || textEffectObject[0].TextBoxHeight;
                        textOrientaion = textEffectObject.FileLocation != undefined ? textEffectObject.FileLocation : null;
                        if (!textOrientaion)
                            textOrientaion = textEffectObject[0] != undefined && textEffectObject[0].FileLocation != undefined ? textEffectObject[0].FileLocation : null;
                        textPosX = textEffectObject.OffsetX || textEffectObject[0].OffsetX;
                        textPosY = textEffectObject.OffsetY || textEffectObject[0].OffsetY;
                    }
                }

                contentWidth = Math.floor(parseInt(decalSizeWidth) * scale);
                contentHeight = Math.floor(parseInt(decalSizeHeight) * scale);

                //if scaling is enabled, use the scaled values
                if (!disableScaling) {
                    var sizeWidth = size.Width || 0;
                    //var sizeHeight = size.Height || 0;
                    contentWidth = Math.floor(parseInt(sizeWidth) * scale);
                    contentHeight = Math.floor(contentWidth * decalSizeHeight / decalSizeWidth); //calculate the heigt based on scaled width
                }

                if (type == 'playername' && playerName) {
                    text = playerName;
                }

                if (type == 'playernumber' && playerNumber) {
                    text = playerNumber;
                }

                if (!textOrientaion) {
                    textOrientaion = '';
                }

                var chainPath = '/ASSETS/anchor-textEffect_r0.chain';
                if (textOrientaion == '' || type == 'playernumber') {
                    chainPath = '/ASSETS/anchor-text_r0.chain';
                }

                //if not text is provided contunue to next anchor point
                if (!text) {
                    continue;
                }


                //set text point properties
                var textChainName = type + "_" + textBoxWidth;
                var textChainUrl = LiquidPixels.getTextChainUrl(textChainName, text, font, textOrientaion, fontSize, firstStrokeWidth, SecondStrokeWidth, decalSizeWidth, decalSizeHeight, textBoxWidth, textBoxHeight, colorOne, colorTwo, colorThree, chainPath, textPosX, textPosY, contentWidth);

                if (url.indexOf(textChainUrl) >= 0) {
                    url += '&select=name[' + textChainName + ']';

                } else {
                    url += textChainUrl;
                }
                chainName = textChainName;
            }
            var isApplyFlip = 0;
            if (anchorPointObj.isFlip == true) {
                isApplyFlip = 1;

            }

            //get calculated anchor x and y postions        
            var XYPos = LiquidPixels.getAnchorXY(anchorOriginId, rotation, anchorRelativeId, anchorRelationSpace, anchorRelationshipId, contentWidth, contentHeight, scale, anchorX, anchorY, isYouthGender, sizeNumber, style, isGraphiccase, isText, isTopFlatCut, type);
            anchorX = Math.floor(XYPos[0]);
            anchorY = Math.floor(XYPos[1]);

            //find the child anchor for current if exists
            var childAnchorObject = null;
            for (var key in relatedAnchorPoints) {
                var tempAPObject = relatedAnchorPoints[key];
                if (tempAPObject && tempAPObject.ParentAnchorId && tempAPObject.ParentAnchorId == relatedAnchorPoint.AnchorPointId) {
                    childAnchorObject = tempAPObject;
                    break;
                }
            }
            var parentAnchorMask = '';
            var childAnchorMask = '';
            var childAnchorX = 0;
            var childAnchorY = 0;
            var rotationChild = 0;
            var XYPosChild = 0;

            if (childAnchorObject) {
                parentAnchorMask = relatedAnchorPoint.Mask;
                childAnchorMask = childAnchorObject.Mask;
                childAnchorX = childAnchorObject.X;
                childAnchorY = childAnchorObject.Y;
                rotationChild = childAnchorObject.Rotation;
                XYPosChild = LiquidPixels.getAnchorXY(anchorOriginId, rotationChild, anchorRelativeId, anchorRelationSpace, anchorRelationshipId, contentWidth, contentHeight, scale, childAnchorX, childAnchorY, isYouthGender, sizeNumber, style, isGraphiccase, isText, isTopFlatCut, type);
                childAnchorX = Math.floor(XYPosChild[0]);
                childAnchorY = Math.floor(XYPosChild[1]);
                isApplyMask = 1;
            }
            else
                isApplyMask = 0;

            url += '&set=nam[' + chainName + '],width[' + contentWidth + '],blankName[' + anchorName + '],height[' + contentHeight + '],rot[' + rotation + '],xPos[' + anchorX + '],yPos[' + anchorY + '],msk[' + isApplyMask + '],styleMask[' + parentAnchorMask + '],flp[' + isApplyFlip + ']';
            url += '&call=url[file:/ASSETS/placeAnchor_r2.chain]';
            if (isApplyMask) {
                url += '&select=image[' + chainName + ']';
                url += '&set=nam[' + chainName + '],width[' + contentWidth + '],blankName[' + anchorName + '],height[' + contentHeight + '],rot[' + rotationChild + '],xPos[' + childAnchorX + '],yPos[' + childAnchorY + '],msk[' + isApplyMask + '],styleMask[' + childAnchorMask + '],flp[' + isApplyFlip + ']';
                url += '&call=url[file:/ASSETS/placeAnchor_r2.chain]';
            }
        }
    }

    //add composing of anchor point on flat cur url
    if (compositeChainPart) {
        url += compositeChainPart;
    }
    return url;
};
LiquidPixels.getFlatcutChain = function (isTopFlatCut) {
    var url = '';
    if (isTopFlatCut) {
        url += "&set=colorNone[none],colorOne[##color1hex],colorTwo[##color2hex],colorThree[##color3hex]"
                + "&set=category[##category],designName[##designNumber],scale[##scale],sizeNumber[##sizeNumber],sizeSuffix[_##sizeSuffix],styleHeight[##styleHeight],styleNumber[##styleNumber],styleWidth[##styleWidth],view[##view]"
                + "&call=url[file:/ASSETS/3colorFlatcut_r0.chain]";
    } else {
        url += "&set=colorNone[none],colorOne[##color1hex],colorTwo[##color2hex],colorThree[##color3hex]";
        url += "&set=styleWidth[##bottomStyleWidth],category[##category],designName[##designNumber],scale[##scale],sizeNumber[##bottomSizeNumber],sizeSuffix[_##sizeSuffix],styleHeight[##bottomStyleHeight],styleNumber[##styleBottom],styleTop[##styleTop],view[##view]";
        url += "&call=url[file:/ASSETS/3colorFlatcut_r0.chain]";
    }
    return url;
}

/**
 * This method return the calculated x and y values based on anchor origin, rotation and relative anchor id, need to be used in chain
 * 
 * 
 * @param anchorOriginId
 * @param  rotation
 * @param  anchorRelativeId
 * @param  anchorRelationSpace
 * @param  anchorX
 * @param  anchorY
 * @returns array position x and y 
 */
LiquidPixels.getAnchorXY = function (anchorOriginId, rotation, anchorRelativeId, anchorRelationSpace, anchorRelationshipId, contentWidth, contentHeight, scale, anchorX, anchorY, isYouthGender, sizeNumber, style, isGraphiccase, isText, isForTop, type) {
    try {
        //north center case
        if (anchorOriginId == CONFIG.get("ANCHORORIGIN_ID_NORTH_CENTER_CASE")) {
            if ((rotation >= 0 && rotation <= 45) || (rotation > 315 && rotation < 360)) {
                anchorX = Math.floor(parseInt(anchorX) * scale - contentWidth / 2);
                anchorY = Math.floor(parseInt(anchorY) * scale);
            }
            else if (rotation > 45 && rotation <= 135) {
                anchorX = Math.floor(parseInt(anchorX) * scale - contentHeight);
                anchorY = Math.floor(parseInt(anchorY) * scale - contentWidth / 2);
            }
            else if (rotation > 135 && rotation <= 225) {
                anchorX = Math.floor(parseInt(anchorX) * scale - contentWidth / 2);
                anchorY = Math.floor(parseInt(anchorY) * scale - contentHeight);
            }
            else if (rotation > 225 && rotation <= 315) {
                anchorX = Math.floor(parseInt(anchorX) * scale);
                anchorY = Math.floor(parseInt(anchorY) * scale - contentWidth / 2);
            }
        } else if (anchorOriginId == CONFIG.get("ANCHORORIGIN_ID_CENTER_CENTER_CASE")) {
            if ((rotation >= 0 && rotation <= 45) || (rotation > 315 && rotation < 360) || (rotation > 135 && rotation <= 225)) {
                anchorX = Math.floor(parseInt(anchorX) * scale - contentWidth / 2);
                anchorY = Math.floor(parseInt(anchorY) * scale - contentHeight / 2);
            } else {
                anchorX = Math.floor(parseInt(anchorX) * scale - contentHeight / 2);
                anchorY = Math.floor(parseInt(anchorY) * scale - contentWidth / 2);
            }
        } else {
            anchorX = Math.floor(parseInt(anchorX) * scale);
            anchorY = Math.floor(parseInt(anchorY) * scale);
        }


        //use relative anchor
        if (anchorRelativeId) {
            //traverse all anchor points to get the relative anchor point
            var relativeAnchorPoint = null;

            var allAnchorPoints = GlobalInstance.getAnchorPointInstance().allAnchorPoints;
            if (allAnchorPoints) {
                for (var key3 in allAnchorPoints) {
                    if (allAnchorPoints[key3].id == anchorRelativeId) {
                        relativeAnchorPoint = allAnchorPoints[key3];
                    }
                }
            }
            //&& relativeAnchorPoint.IsDecorated
            if (relativeAnchorPoint) {
                var panelId = relativeAnchorPoint.SelectionPanelId;
                //if relativa anchor point is not selected then it be zero

                var relativeAnchorHeight = 0; // Do not use the height of the COntaint.ok
                //if relative anchor is decorated, than selects its actual height
                if (relativeAnchorPoint.IsDecorated) {
                    if (isYouthGender) {

                        var relateYouthdAnchorPoints = new Object();
                        var youthRelativeAnchor = {};
                        var allRelatedAnchorPoints = new Object();
                        var isText = false;
                        var isGraphicCase = false;
                        if (relativeAnchorPoint.SelectionPanelId == 'secPlayerNameAnchorPanel') {
                            isText = true;
                        }
                        else if (relativeAnchorPoint.SelectionPanelId == 'secPlayerNumberAnchorPanel') {
                            isText = false;
                        }
                        else if (relativeAnchorPoint.SelectionPanelId == 'secEmblemAndGraphicsPanel' || relativeAnchorPoint.SelectionPanelId == 'secMyLockerPanel') {
                            isGraphicCase = true;
                        } else {
                            isText = true;
                        }

                        if (isForTop) {
                            allRelatedAnchorPoints = GlobalInstance.getAnchorPointInstance().youthTopAnchorPointsResponseData;
                        } else {
                            allRelatedAnchorPoints = GlobalInstance.getAnchorPointInstance().youthBottomAnchorPointsResponseData;
                        }

                        for (var objKey in allRelatedAnchorPoints) {
                            if (allRelatedAnchorPoints[objKey].SizeNumber == sizeNumber) {
                                relateYouthdAnchorPoints = allRelatedAnchorPoints[objKey].AnchorPoints;
                                for (var objKey2 in relateYouthdAnchorPoints) {
                                    if (relateYouthdAnchorPoints[objKey2].Name == relativeAnchorPoint.displayName) {
                                        youthRelativeAnchor = relateYouthdAnchorPoints[objKey2];
                                        youthRelativeAnchor.selectedSize = null;
                                        youthRelativeAnchor.Font = null;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        //Get the updated size for youth relative anchor point
                        var newDecalSizeId = GlobalInstance.getRosterInstance().getUpdatedSize(relativeAnchorPoint.selectedSize, style, sizeNumber, isGraphicCase, isText, true);
                        var textEffectInstance = new Object();
                        var newTextSizeObject = {}
                        var newRelatedSizes = new Object();
                        if (isText) {
                            textEffectInstance = GlobalInstance.getTextEffectInstance().getTextDecalByKey('_' + (relativeAnchorPoint.Font.FontId || relativeAnchorPoint.Font.fontid));

                            var arrOfTextDecal = new Array();
                            for (var key in textEffectInstance.TextDecalCategories) {
                                var sData = textEffectInstance.TextDecalCategories[key];
                                if (isText && sData.Name == "Text") {
                                    arrOfTextDecal = sData.TextDecalSizes;
                                    break;
                                } else if (!isText && sData.Name == "Number") {
                                    arrOfTextDecal = sData.TextDecalSizes;
                                    break;
                                }
                            }

                            for (var obj in arrOfTextDecal) {
                                var data = arrOfTextDecal[obj];
                                if (data.TextDecalSizeId == newDecalSizeId) {
                                    newTextSizeObject.Name = data.Name;
                                    newTextSizeObject.SizeId = data.TextDecalSizeId;
                                    newTextSizeObject.AnchorPointFontSizes = data.TextDecals;
                                    break;
                                }
                            }
                        } else {
                            newTextSizeObject = JSON.parse(JSON.stringify(newDecalSizeId));
                        }

                        if (Utility.getObjectlength(newTextSizeObject) > 0) {
                            newRelatedSizes = JSON.parse(JSON.stringify(newTextSizeObject));
                        }
                        var newSizes = new Object();

                        if (Utility.getObjectlength(newRelatedSizes) > 0) {
                            youthRelativeAnchor.selectedSize = newRelatedSizes;
                        } else {
                            if (relativeAnchorPoint.SelectionPanelId == 'secPlayerNameAnchorPanel') {
                                youthRelativeAnchor.selectedSize = youthRelativeAnchor.PlayerNames;
                            }
                            else if (relativeAnchorPoint.SelectionPanelId == 'secPlayerNumberAnchorPanel') {
                                youthRelativeAnchor.selectedSize = youthRelativeAnchor.PlayerNumbers;
                            }
                            else if (relativeAnchorPoint.SelectionPanelId == 'secEmblemAndGraphicsPanel') {
                                youthRelativeAnchor.selectedSize = youthRelativeAnchor.GraphicSizes;
                            }
                            else if (relativeAnchorPoint.SelectionPanelId == 'secMyLockerPanel') {
                                youthRelativeAnchor.selectedSize = youthRelativeAnchor.UploadedGraphicSizes;
                            } else {
                                youthRelativeAnchor.selectedSize = youthRelativeAnchor.TextSizes;

                            }

                            for (var key in youthRelativeAnchor.selectedSize) {
                                var data = youthRelativeAnchor.selectedSize[key];
                                if (data.SizeId == relativeAnchorPoint.selectedSize.SizeId) {
                                    newSizes = data;
                                    break;
                                }
                            }
                        }
                        if (Utility.getObjectlength(newSizes) > 0) {
                            youthRelativeAnchor.selectedSize = JSON.parse(JSON.stringify(newSizes));
                        }

                        youthRelativeAnchor.Font = relativeAnchorPoint.Font;
                        if (Utility.getObjectlength(youthRelativeAnchor) > 0) {
                            if (isGraphicCase) {
                                youthRelativeAnchor.graphicId = relativeAnchorPoint.graphicId;
                                youthRelativeAnchor.GraphicHeight = relativeAnchorPoint.GraphicHeight || relativeAnchorPoint.graphicHeight;
                                youthRelativeAnchor.GraphicWidth = relativeAnchorPoint.GraphicWidth || relativeAnchorPoint.graphicWidth;
                            }
                            relativeAnchorPoint = JSON.parse(JSON.stringify(youthRelativeAnchor));
                        }
                    }
                    relativeAnchorHeight = LiquidPixels.getAnchorHeight(relativeAnchorPoint, panelId);
                }

                anchorRelationSpace = parseInt(anchorRelationSpace);

                if (!$.isNumeric(relativeAnchorHeight)) {
                    relativeAnchorHeight = 0;
                }

                if (!$.isNumeric(anchorRelationSpace)) {
                    anchorRelationSpace = 0;
                }
                var isBelow = CONFIG.get('ANCHOR_RELATIONSHIP_NONE');
                if (anchorRelationshipId == CONFIG.get("ANCHOR_RELATIONSHIP_ID")) {
                    isBelow = anchorRelationshipId;
                } else if (anchorRelationshipId == CONFIG.get("ANCHOR_RELATIONSHIP_ABOVE")) {
                    isBelow = anchorRelationshipId;
                }


                if ((rotation >= 0 && rotation <= 45) || (rotation > 315 && rotation < 360)) {
                    anchorY = (isBelow == CONFIG.get('ANCHOR_RELATIONSHIP_ID')) ? (anchorY + (relativeAnchorHeight * scale) + anchorRelationSpace * scale)
                            : (anchorY + (relativeAnchorHeight * scale) - anchorRelationSpace * scale);
                } else if (rotation > 45 && rotation <= 135) {
                    anchorX = (isBelow == CONFIG.get('ANCHOR_RELATIONSHIP_ID')) ? (anchorX - (relativeAnchorHeight * scale) - anchorRelationSpace * scale)
                            : (anchorX + (relativeAnchorHeight * scale) + anchorRelationSpace * scale);
                }
                else if (rotation > 135 && rotation <= 225) {
                    anchorY = (isBelow == CONFIG.get('ANCHOR_RELATIONSHIP_ID')) ? (anchorY - (relativeAnchorHeight * scale) - anchorRelationSpace * scale)
                            : (anchorY + (relativeAnchorHeight * scale) + anchorRelationSpace * scale);
                }
                else if (rotation > 225 && rotation <= 315) {
                    anchorX = (isBelow == CONFIG.get('ANCHOR_RELATIONSHIP_ID')) ? (anchorX + (relativeAnchorHeight * scale) + anchorRelationSpace * scale)
                            : (anchorX - (relativeAnchorHeight * scale) - anchorRelationSpace * scale);
                }
            }
        }

        anchorX = Math.floor(anchorX);
        anchorY = Math.floor(anchorY);

        return [anchorX, anchorY];
    } catch (e) {
        return [anchorX, anchorY];
    }
};

/**
 * This method calculates the Height of the Anchor point with respect to the Relative Anchor point 
 * @param anchorPoint object of relative anchor point
 * @returns Number height
 */
LiquidPixels.getAnchorHeight = function (anchorPoint, type) {
    var anchorHeight = 0;
    var anchorWidth = 0;
    var type = LOCATION_TYPE.get(anchorPoint.SelectionPanelId) || LOCATION_TYPE.get(type);
    var size = anchorPoint.selectedSize;

    if (type == 'uploadedgraphic') {
        var grahicSizeValue = parseInt(size.ActualSize);
        anchorWidth = Math.floor(grahicSizeValue * 150);
        var uploadedGraphicHeight = (anchorPoint.graphicHeight) ? anchorPoint.graphicHeight : anchorPoint.GraphicHeight;
        var uploadedGraphicWidth = (anchorPoint.graphicWidth) ? anchorPoint.graphicWidth : anchorPoint.GraphicWidth;
        anchorHeight = Math.floor(anchorWidth * uploadedGraphicHeight / uploadedGraphicWidth);
    }
    else if (type == 'graphic') {
        var grahicSizeValue = parseInt(size.ActualSize);
        var graphicId = anchorPoint.graphicId;
        var graphicObject = GlobalInstance.getSelectGraphicsInstance().getSelectedGraphicByGraphicId(graphicId);
		//If graphic object is undefined or null , then get the graphic information from Clicked graphic info
		if (!graphicObject) {
			graphicObject = GlobalInstance.getUniformConfigurationInstance().getClickedGraphicsInfo("_"+graphicId);
		}
		
		
        var graphicHeight = 0;
        var graphicWidth = 0;

        if(graphicObject.Height && graphicObject.Width){
			graphicHeight = parseInt(graphicObject.Height);	
			graphicWidth = parseInt(graphicObject.Width);
			
            anchorWidth = Math.floor(grahicSizeValue * 150);
            anchorHeight = Math.floor(anchorWidth * graphicHeight / graphicWidth);
		}
		
    } else {
        if (!size) {
            return;
        }

        var sizes = size.AnchorPointFontSizes;

        if (!sizes) {
            return '';
        }

        var fontId = (anchorPoint.Font.fontid) ? anchorPoint.Font.fontid : anchorPoint.Font.FontId;
        var selectedFontSize = null;
        for (var key in sizes) {
            if (sizes[key].FontId == fontId) {
                selectedFontSize = sizes[key];
                break;
            }
        }

        if (!selectedFontSize) {
            return '';
        }

        var decalSizeWidth = selectedFontSize.DecalSizeWidth || selectedFontSize.Width;
        var decalSizeHeight = selectedFontSize.DecalSizeHeight || selectedFontSize.Height;

        //retrive relatedTextEffectObject
        if (anchorPoint.TextOrientation) {
            var textEffectObject = null;
            var textEffects = (anchorPoint.TextOrientation.TextEffectCategorys[0]) ? anchorPoint.TextOrientation.TextEffectCategorys[0].TextEffects : anchorPoint.TextOrientation.TextEffectCategorys.TextEffects;
            for (var keyTextEffect in textEffects) {
                var tempObj = textEffects[keyTextEffect];
                if (tempObj.TextDecaleSizeId) {
                    if (tempObj.TextDecaleSizeId == selectedFontSize.TextDecalSizeId) {
                        textEffectObject = tempObj;
                        break;
                    }
                } else {
                    break;
                }
            }

            if (textEffectObject) {
                decalSizeWidth = textEffectObject.Width;
                decalSizeHeight = textEffectObject.Height;
            }
        }

        anchorWidth = Math.floor(parseInt(decalSizeWidth));
        anchorHeight = Math.floor(parseInt(decalSizeHeight));
    }
    return anchorHeight;
};

/**
 * This method returns the chain url for graphics
 * 
 * @param  layerObject contains information of layers of graphcis
 * @param  graphicWidth contains the width of Graphic
 * @param  graphicHeight contaisn the height of graphics
 * @param graphicImageName Name of the Graphic
 * @returns String Actual graphic URL
 */
LiquidPixels.getGraphicChainUrl = function (layerObject, graphicWidth, graphicHeight, graphicImageName, colorOne, colorTwo, colorThree, isForProductionUrl) {
    var url = '&' + encodeURIComponent('set=colorNone[none],Color1[' + colorOne + '],Color3[' + colorThree + '],Color2[' + colorTwo + ']')
            + '&blank=width[' + graphicWidth + '],color[global.colorNone],height[' + graphicHeight + '],name[emblemBase]'
            + LiquidPixels.getGraphicLocationString(layerObject, isForProductionUrl);

    return url;
};

/**
 * This method is being used to generate the text Chain URL
 * @param  textChainName name of the Text Chain
 * @param  text value that is being entered as text
 * @param  font font of the Text
 * @param  textOrientiation text orientation that is being selected
 * @param  fontSize font size of Text
 * @param  firstStrokeWidth stroke wdth of Text
 * @param  SecondStrokeWidth second stroke width of Text
 * @param  decalSizeWidth decal Size width of the Text
 * @param  decalSizeHeight decale Size height of the text
 * @param  textBoxWidth width of the text box
 * @param  textBoxHeight height of the text box
 * @param  colorOne first color choosen
 * @param  colorTwo second (First stroke color) color chosen
 * @param  colorThree Third color (Second Stroke color chosen)
 * @param  chainPath path of the chain 
 * @param  textPosX X position of Text
 * @param  textPosY Y position of Text
 * @param  contentWidth width of the anchor point
 * @returns String text URL
 */
LiquidPixels.getTextChainUrl = function (textChainName, text, font, textOrientiation, fontSize, firstStrokeWidth, SecondStrokeWidth, decalSizeWidth, decalSizeHeight, textBoxWidth, textBoxHeight, colorOne, colorTwo, colorThree, chainPath, textPosX, textPosY, contentWidth) {

    var url = '&' + encodeURIComponent('set=emblemBaseWidth[' + decalSizeWidth + '],emblemBaseHeight[' + decalSizeHeight + '],textRotation[0],textGravity[center],gridfile_text[file:' + textOrientiation + ']');
    url += '&' + encodeURIComponent('set=textBoxWidth[' + textBoxWidth + '],textBoxHeight[' + textBoxHeight + '],widthOption[>],heightOption[ne],textPosX[' + textPosX + '],textPosY[' + textPosY + ']');
    url += '&' + encodeURIComponent('set=colorNone[none],textColorOne[' + colorOne + '],strokeColorOne[' + colorTwo + '],strokeColorTwo[' + colorThree + ']');
    url += '&' + encodeURIComponent('set=textString[' + text + '],fontName[' + font + '],fontSize[' + fontSize + '],firstStrokeWidth[' + firstStrokeWidth + '],secondStrokeWidth[' + SecondStrokeWidth + ']');
    url += '&' + encodeURIComponent('call=url[file:' + chainPath + ']');
    return url;
};

/**
 * This method generates the Preview URL
 * @param  isLargerPreview if the Large view model is true
 * @param  isRosterModelPreview if the roster model Preview 
 * @param  birdEyeViewOreintation : Alternate View
 * @param  params 
 * @returns String Actual URL of the Model
 */

LiquidPixels.generatePreviewUrl = function (isLargerPreview, isRosterModelPreview, birdEyeViewOreintation, params) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var uniformPrimaryColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformPrimaryColor');
    var uniformSecondaryColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformSecondaryColor');
    var uniformTertiaryColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformTertiaryColor');
    var defaultColorValue = CONFIG.get("DEFAULT_COLOR");
    var primaryColor = (uniformPrimaryColor) ? uniformPrimaryColor.RgbHexadecimal : defaultColorValue;
    var secondaryColor = (uniformSecondaryColor) ? uniformSecondaryColor.RgbHexadecimal : CONFIG.get("DEFAULT_COLOR_SEC");
    var tertiaryColor = (uniformTertiaryColor) ? uniformTertiaryColor.RgbHexadecimal : CONFIG.get("DEFAULT_COLOR_TERTIARY");
    primaryColor = encodeURIComponent(primaryColor);
    secondaryColor = encodeURIComponent(secondaryColor);
    tertiaryColor = encodeURIComponent(tertiaryColor);
    var positionX = '';
    var positionY = '';
    var rotationalDegreeLogo = '';
    var tagPostionX = '';
    var tagPositionY = '';
    var rotationalDegreeTag = '';
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var teamName = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('AnchorText');
    //var playername = GlobalInstance.uniformConfigurationInstance.getSelectedPlayerNameAnchorText();
    var playerNumber = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('AnchorText');
    if (!teamName) {
        teamName = ' ';
    }
    if (!playerNumber) {
        playerNumber = ' ';
    }


    var anchorpointObjectForPosition = GlobalInstance.getAnchorPointInstance().uniformlogoData;
    positionX = anchorpointObjectForPosition.X || CONFIG.get("LOGO_POSITION");
    positionY = anchorpointObjectForPosition.Y || CONFIG.get("LOGO_POSITION");
    rotationalDegreeLogo = anchorpointObjectForPosition.Rotation || CONFIG.get("LOGO_ROTATION");
    var anchorpointObjectForPositionTag = GlobalInstance.getAnchorPointInstance().sublimatedTagData;
    tagPostionX = anchorpointObjectForPositionTag.X || CONFIG.get("LOGO_POSITION");
    tagPositionY = anchorpointObjectForPositionTag.Y || CONFIG.get("LOGO_POSITION");
    rotationalDegreeTag = anchorpointObjectForPositionTag.Rotation || CONFIG.get("TAG_ROTATION");



    var birdEyeViewInfo = GlobalInstance.getUniformConfigurationInstance().getBirdEyeView();

    if (birdEyeViewOreintation != null) {
        try {
            birdEyeViewInfo = params.birdEyeViewObject;
        } catch (e) {
        }
    }
    var previewUrl = '';
    var modelPreviewBaseChain = LiquidPixels.getChainStart();
    previewUrl += modelPreviewBaseChain;
    var modelPreviewGridFilesTop = '';
    var modelPreviewGridFilesBottom = '';

    //add anchor point data in chain
    var playerNumber = null;
    var playerName = null;
    if (params) {
        playerNumber = params.Number;
        playerName = params.Name;
    }
    var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
    var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
    var currentDesign = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
    var copyOfDesign = null;

    var styleToBeUsed = currentStyle;

    //if current style is having valid copy style id, than use that style objecr for drawing
    if (currentStyle.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
        styleToBeUsed = GlobalInstance.uniformConfigurationInstance.getCopiedStylesInfo();
        copyOfDesign = Utility.getDesignObject(styleToBeUsed.StyleId, currentDesign.DesignNumber, false, true);
    }
    var copyHeight = 0;
    var copyWidth = 0;
    var sublimatedSize = currentDesign.PreviewDecalSizeNumber;
    if (Utility.getObjectlength(copyOfDesign) > 0) {
        for (var i = 0; i < copyOfDesign.Sizes.length; i++) {
            var sizeObject = copyOfDesign.Sizes[i];
            if (sizeObject && sizeObject.SizeNumber == currentDesign.PreviewDecalSizeNumber) {
                copyHeight = sizeObject.Height;
                copyWidth = sizeObject.Width;
                break;
            }
        }
    }
    previewUrl += LiquidPixels.getFlatCutAnchorPointChainUrlPart(true, playerName, playerNumber, null, true, null, false, false, styleToBeUsed);
    previewUrl += LiquidPixels.getUniformLogo(positionX, positionY, rotationalDegreeLogo, styleToBeUsed);
    previewUrl += LiquidPixels.getSublimatedTag(tagPostionX, tagPositionY, playerName, playerNumber, sublimatedSize, rotationalDegreeTag, styleToBeUsed);

    previewUrl += "&source=name[baseImage],url[file:/ASSETS/previewImages/global.category/" + currentStyle.StyleNumber + "/global.view/##baseImage]";
    // modelPreviewBaseChain += "&composite=image[baseImage]";

    //replace to remove extra & after chain start if added
    previewUrl = previewUrl.replace(LiquidPixels.getChainStart() + "&", LiquidPixels.getChainStart());

    var modelPreviewBottomChain;
    var category, designNumber, scale, sizeNumber, sizeSuffix, styleHeight, originalStyleTopNumber, styleTopNumber, styleBottomNumber, styleWidth, view, baseImage, bottomStyleWidth, bottomStyleHeight, bottomSizeNumber, highlight;


    if (birdEyeViewInfo) {
        var index;
        var birdEyeViewName = birdEyeViewInfo.Name ? birdEyeViewInfo.Name.toLowerCase() : CONFIG.get("BIRD_EYE_VIEW_ORIENTATION_FRONT");
        if (birdEyeViewName === CONFIG.get("BIRD_EYE_VIEW_ORIENTATION_FRONT")) {
            if (currentStyle.PreviewImages.length > 0) {
                index = this.getCurrentViewPositionFromPreviewImages(currentStyle.PreviewImages, birdEyeViewInfo.Name);
                modelPreviewGridFilesTop = this.getGridFilesForTop(currentStyle.PreviewImages[index].GridDetails);
                previewUrl += LiquidPixels.getGridFilesForSleeves() + modelPreviewGridFilesTop;
            }
        } else if (birdEyeViewName === CONFIG.get("BIRD_EYE_VIEW_ORIENTATION_BACK")) {
            if (currentStyle.PreviewImages.length > 0) {
                index = this.getCurrentViewPositionFromPreviewImages(currentStyle.PreviewImages, birdEyeViewInfo.Name);
                modelPreviewGridFilesTop = this.getGridFilesForTop(currentStyle.PreviewImages[index].GridDetails);
                previewUrl += LiquidPixels.getGridFilesForSleeves() + modelPreviewGridFilesTop;
            }
        } else if (birdEyeViewName === CONFIG.get("BIRD_EYE_VIEW_ORIENTATION_LEFT")) {
            if (currentStyle.PreviewImages.length > 0) {
                index = this.getCurrentViewPositionFromPreviewImages(currentStyle.PreviewImages, birdEyeViewInfo.Name);
                modelPreviewGridFilesTop = this.getGridFilesForTop(currentStyle.PreviewImages[index].GridDetails);
                previewUrl += LiquidPixels.getGridFilesForSleeves() + modelPreviewGridFilesTop;
            }
        } else if (birdEyeViewName === CONFIG.get("BIRD_EYE_VIEW_ORIENTATION_BIRDEYEVIEW")) {
            if (currentStyle.PreviewImages.length > 0) {
                index = this.getCurrentViewPositionFromPreviewImages(currentStyle.PreviewImages, birdEyeViewInfo.Name);
                modelPreviewGridFilesTop = this.getGridFilesForTop(currentStyle.PreviewImages[index].GridDetails);
                previewUrl += LiquidPixels.getGridFilesForSleeves() + modelPreviewGridFilesTop;
            }
        }
    }

    var matchingBottomStyle;
    var currentBottomStyle;

    category = categoryInfo.Name ? categoryInfo.Name.toLowerCase() : CONFIG.get("DEFAULT_SPORT");
    designNumber = currentDesign.DesignNumber || CONFIG.get("DEFAULT_DESIGN_NUMBER");
    sizeNumber = currentDesign.PreviewDecalSizeNumber;

    scale = CONFIG.get('MODEL_PREVIEW_LARGE_SCALE');
    sizeSuffix = CONFIG.get("MODEL_PREVIEW_SIZE_LARGER_SUFFIX");

    styleTopNumber = styleToBeUsed.StyleNumber || CONFIG.get("DEFAULT_STYLE_NUMBER");
    originalStyleTopNumber = currentStyle.StyleNumber;

    baseImage = birdEyeViewInfo.BaseImageZoom;
    highlight = birdEyeViewInfo.ZoomHighlight;

    styleWidth = currentDesign.PreviewDecalSizeWidth;
    styleHeight = currentDesign.PreviewDecalSizeHeight;
    if (copyOfDesign) {
        styleWidth = copyWidth;
        styleHeight = copyHeight;
    }
    var isBottomAvailableForCurrentStyle = false;
    var useCopiedStyleForBottom = false;
    bottomSizeNumber = '';
    bottomStyleHeight = '';
    bottomStyleWidth = '';


    if (currentStyle) {
        if (currentStyle.StyleTypeId == CONFIG.get("STYLE_ID_TOP")) {
            matchingBottomStyle = GlobalInstance.getStyleAndDesignInstance().getMatchingBottomStyle(currentStyle);
            currentBottomStyle = matchingBottomStyle;
            if (matchingBottomStyle) {
                if (matchingBottomStyle.StyleTypeId == CONFIG.get("STYLE_ID_BOTTOM")) {
                    isBottomAvailableForCurrentStyle = true;

                    //if bottom style is having valid copy style id, than use that style object for drawing
                    if (matchingBottomStyle.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                        // in case of bottom id get the copied style data from styleanddesign instance
                        useCopiedStyleForBottom = true;
                        matchingBottomStyle = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(matchingBottomStyle.CopyOfStyleId);

                    }
                }
            }
        }
    }
    styleBottomNumber = matchingBottomStyle ? matchingBottomStyle.StyleNumber : '00196r0';
    if (birdEyeViewOreintation != null) {
        if (params.view) {
            view = params.view;
        }
    } else {
        var selectedBirdView = null;
        selectedBirdView = GlobalInstance.uniformConfigurationInstance.getBirdEyeView();

        if (selectedBirdView !== null && selectedBirdView !== undefined) {
            try {
                view = selectedBirdView.Name.toLowerCase();
            } catch (err) {
                if (CONFIG.get('DEBUG') === true) {
                    txt = "Error description LP: " + err.message + "\n\n";
                    txt += "Error filename: " + err.fileName + "\n\n";
                    txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                    Log.error(txt);
                }
            }
        }
    }

    GlobalInstance.styleAndDesignInstance = GlobalInstance.getStyleAndDesignInstance();
    if (isBottomAvailableForCurrentStyle == true) {
        var anchorpointObjectForPosition = GlobalInstance.getAnchorPointInstance().uniformlogoDataBottom;
        positionX = anchorpointObjectForPosition.X || CONFIG.get("LOGO_POSITION");
        positionY = anchorpointObjectForPosition.Y || CONFIG.get("LOGO_POSITION");
        rotationalDegreeLogo = anchorpointObjectForPosition.Rotation || CONFIG.get("LOGO_ROTATION");
        var anchorpointObjectForPosition = GlobalInstance.getAnchorPointInstance().sublimatedTagDataBottom;
        tagPostionX = anchorpointObjectForPosition.X || CONFIG.get("LOGO_POSITION");
        tagPositionY = anchorpointObjectForPosition.Y || CONFIG.get("LOGO_POSITION");
        rotationalDegreeTag = anchorpointObjectForPosition.Rotation || CONFIG.get("TAG_ROTATION");

        //get the bottom related values
        var matchingBottomDesignObject = currentBottomStyle;
        currentBottomStyle = Utility.getDesignObject(currentBottomStyle.StyleId, designNumber, false, false);//Get the Current Design Object
        matchingBottomDesignObject = Utility.getDesignObject(matchingBottomStyle.StyleId, designNumber, false, useCopiedStyleForBottom); // Get Design Object of Current STyle or Copy Of Style if exists
        var bottomCopyHeight = 0;
        var bottomCopyWidth = 0;
        if (Utility.getObjectlength(matchingBottomDesignObject) > 0 && useCopiedStyleForBottom) {
            for (var i = 0; i < matchingBottomDesignObject.Sizes.length; i++) {
                var sizeObject = matchingBottomDesignObject.Sizes[i];
                if (sizeObject && sizeObject.SizeNumber == currentBottomStyle.PreviewDecalSizeNumber) {
                    bottomCopyHeight = sizeObject.Height;
                    bottomCopyWidth = sizeObject.Width;
                    break;
                }
            }
        }
        if (matchingBottomDesignObject) {
            bottomSizeNumber = currentBottomStyle.PreviewDecalSizeNumber;
            bottomStyleWidth = matchingBottomDesignObject.PreviewDecalSizeWidth;
            bottomStyleHeight = matchingBottomDesignObject.PreviewDecalSizeHeight;
            if (useCopiedStyleForBottom) {
                bottomStyleWidth = bottomCopyWidth;
                bottomStyleHeight = bottomCopyHeight;
            }
        }


        modelPreviewBottomChain = LiquidPixels.getFlatCutAnchorPointChainUrlPart(false, playerName, playerNumber, null, true, null, false, false, matchingBottomStyle);
        modelPreviewBottomChain += LiquidPixels.getUniformLogo(positionX, positionY, rotationalDegreeLogo, matchingBottomStyle);
        modelPreviewBottomChain += LiquidPixels.getSublimatedTag(tagPostionX, tagPositionY, playerNumber, playerName, bottomSizeNumber, rotationalDegreeTag, matchingBottomStyle);
        if (birdEyeViewInfo) {
            var index;
            var birdEyeViewName = birdEyeViewInfo.Name ? birdEyeViewInfo.Name.toLowerCase() : CONFIG.get("BIRD_EYE_VIEW_ORIENTATION_FRONT");
            if (birdEyeViewName === CONFIG.get("BIRD_EYE_VIEW_ORIENTATION_FRONT")) {
                index = this.getCurrentViewPositionFromPreviewImages(currentStyle.PreviewImages, birdEyeViewInfo.Name);
                modelPreviewGridFilesBottom = this.getGridFilesForBottom(currentStyle.PreviewImages[index].GridDetails);
                previewUrl += modelPreviewBottomChain + this.getBottomGridFiles() + modelPreviewGridFilesBottom;
            } else if (birdEyeViewName === CONFIG.get("BIRD_EYE_VIEW_ORIENTATION_BACK")) {
                index = this.getCurrentViewPositionFromPreviewImages(currentStyle.PreviewImages, birdEyeViewInfo.Name)
                modelPreviewGridFilesBottom = this.getGridFilesForBottom(currentStyle.PreviewImages[index].GridDetails);
                previewUrl += modelPreviewBottomChain + this.getBottomGridFiles() + modelPreviewGridFilesBottom;

            } else if (birdEyeViewName === CONFIG.get("BIRD_EYE_VIEW_ORIENTATION_LEFT")) {
                index = this.getCurrentViewPositionFromPreviewImages(currentStyle.PreviewImages, birdEyeViewInfo.Name)
                modelPreviewGridFilesBottom = this.getGridFilesForBottom(currentStyle.PreviewImages[index].GridDetails);
                previewUrl += modelPreviewBottomChain + this.getBottomGridFiles() + modelPreviewGridFilesBottom;

            }
        }
    }
    previewUrl = Utility.replaceAll("##color1hex", primaryColor, previewUrl);
    previewUrl = Utility.replaceAll("##color2hex", secondaryColor, previewUrl);
    previewUrl = Utility.replaceAll("##color3hex", tertiaryColor, previewUrl);
    previewUrl = Utility.replaceAll("##opacity", (primaryColor != defaultColorValue || secondaryColor != defaultColorValue || tertiaryColor != defaultColorValue) ? 200 : 0, previewUrl);
    previewUrl = Utility.replaceAll("##category", category, previewUrl);
    previewUrl = Utility.replaceAll("##designNumber", designNumber, previewUrl);
    previewUrl = Utility.replaceAll("##scale", scale, previewUrl);
    previewUrl = Utility.replaceAll("##sizeNumber", sizeNumber, previewUrl);
    previewUrl = Utility.replaceAll("##sizeSuffix", sizeSuffix, previewUrl);
    previewUrl = Utility.replaceAll("##styleHeight", styleHeight, previewUrl);
    previewUrl = Utility.replaceAll("##styleNumber", styleTopNumber, previewUrl);
    previewUrl = Utility.replaceAll("##OriginalStyleNumber", originalStyleTopNumber, previewUrl);
    previewUrl = Utility.replaceAll("##styleWidth", styleWidth, previewUrl);
    previewUrl = Utility.replaceAll("##styleTop", styleTopNumber, previewUrl);
    previewUrl = Utility.replaceAll("##styleBottom", styleBottomNumber, previewUrl);
    previewUrl = Utility.replaceAll("##view", view, previewUrl);
    previewUrl = Utility.replaceAll("##baseImage", baseImage, previewUrl);
    previewUrl = Utility.replaceAll("##bottomStyleHeight", bottomStyleHeight, previewUrl);
    previewUrl = Utility.replaceAll("##bottomSizeNumber", bottomSizeNumber, previewUrl);
    previewUrl = Utility.replaceAll("##bottomStyleWidth", bottomStyleWidth, previewUrl);
    if (highlight) {
        previewUrl += "&source=name[highlight],url[file:/ASSETS/previewImages/global.category/" + originalStyleTopNumber + "/global.view/" + highlight + "]";
        previewUrl += "&select=image[baseImage]";
        previewUrl += "&composite=compose[over],image[highlight]";
    }
    if (!isLargerPreview) {
        previewUrl += '&scale=width[300],height[562]';
    }
    previewUrl += this.getChainEnd();
    return previewUrl;
};

/*
 * This method is responsible for providing gridfiles for top
 * @param gridDetailObject - GridFile Object
 * @returns String gridFileURL
 */
LiquidPixels.getGridFilesForTop = function (gridDetailObject) {
    var gridFileStr = '';
    var opacity = CONFIG.get('STYLE_OPACITY');
    var colorize = '';
    var colorId = '';
    $.each(gridDetailObject, function (i, data) {
        if (data.FileName !== '' && data.GridDetailTypeId == CONFIG.get('GRID_FILE_TOP')) {
            //If Y co-ordinate value is greater than 0 , then add the crop string
            if (data.Y > 0) {
                gridFileStr += LiquidPixels.getCropCommand();
            }

            colorId = data.ColorizeId;
            if (!colorId || colorId == CONFIG.get('COLORID_ONE')) {
                gridFileStr += "&drape=grid[file:/ASSETS/previewImages/global.category/##OriginalStyleNumber/global.view/" + data.FileName + "],opacity[" + opacity + "],texture[grid]";
            } else {
                gridFileStr += LiquidPixels.getColorizeCommand(colorId);
                gridFileStr += "&drape=grid[file:/ASSETS/previewImages/global.category/##OriginalStyleNumber/global.view/" + data.FileName + "],opacity[" + opacity + "],texture[colorize]";
            }
        }
    });

    return gridFileStr;
};

/*
 * This method is responsible for providing gridfiles for bottom
 * @param gridDetailObject - GridFile Object
 * @returns String gridFileBottom Commands
 */
LiquidPixels.getGridFilesForBottom = function (gridDetailObject) {
    var gridFileStr = '';
    var opacity = CONFIG.get('STYLE_OPACITY');
    var colorize = '';
    var colorId = '';
    $.each(gridDetailObject, function (i, data) {
        if (data.FileName !== '' && data.GridDetailTypeId == CONFIG.get('GRID_FILE_BOTTOM')) {
            if (data.Y > 0) {
                gridFileStr += LiquidPixels.getCropCommand();
            }
            colorId = data.ColorizeId;
            if (!colorId || colorId == CONFIG.get('COLORID_ONE')) {
                gridFileStr += "&drape=grid[file:/ASSETS/previewImages/global.category/##OriginalStyleNumber/global.view/" + data.FileName + "],opacity[" + opacity + "],texture[grid]";
            } else {
                gridFileStr += LiquidPixels.getColorizeCommand(colorId);
                gridFileStr += "&drape=grid[file:/ASSETS/previewImages/global.category/##OriginalStyleNumber/global.view/" + data.FileName + "],opacity[" + opacity + "],texture[colorize]";
            }
        }
    });
    return gridFileStr;
};

/**
 * This method returns the current alternate view of the preview Image
 * @param  previewImgArray contains all the alternate views
 * @param currentView selected View of model
 * @returns Number position
 */
LiquidPixels.getCurrentViewPositionFromPreviewImages = function (previewImgArray, currentView) {
    var position = 0;
    for (var i = 0; i < previewImgArray.length; i++) {
        if (previewImgArray[i].Name === currentView) {
            position = i;
            break;
        }
    }
    return position;
}


/** 
 * Updates the model preview  based on attribute selection 
 * 
 * @param previewOrientation will be Orientation type 'front','back' etc 
 * @param componentId will be HTML tag id 
 * 
 * @return void 
 */
LiquidPixels.updateLargerModelPreview = function () {
    var isLargerPreview = true;
    $('#idImgLargerModelPreview').attr('src', '');
    //$('#idImgLargerModelPreview').attr('src', shortPreviewImageSource);
    LiquidPixels.transformUrl(LiquidPixels.generatePreviewUrl(isLargerPreview, null, null, null), function (shortPreviewImageSource) {
        Utility.loadImage('idImgLargerModelPreview', shortPreviewImageSource, function (elementId) {
            GlobalFlags.setScreenFlags('isLargerModelPreviewLoaded', true);
        }, null);
    });

};
/**
* Updates the roster model preview  based on attribute selection
* 
 * @param previewOrientation will be Orientation type 'front','back' etc
* @param componentId will be HTML tag id
* 
 * @return void
 */

var rosterModelPreviewRequestQueue = new Array();
LiquidPixels.updateRosterModelPreview = function (params, isClickEvent) {

    $.startProcess(true);

    try {
        var isRosterModelPreview = true;
        var isLargerPreview = false;
        var previewImageSource = LiquidPixels.generatePreviewUrl(isLargerPreview, isRosterModelPreview, null, params);
        LiquidPixels.transformUrl(previewImageSource, function (shortPreviewImageSource) {
            LiquidPixels.showRosterPreviewImage(shortPreviewImageSource, isClickEvent);
        });

    } catch (e) {
        $.doneProcess();
    }
};


/**
 * returns the Anchor point style URL from the LiquidPixels Server
 *
 * @return string Actual URL of the Anchor point diagram image
 */
LiquidPixels.getAnchorPointDiagramImage = function (assetLocation) {
    //return the image on basis of style
    var url = LiquidPixels.getChainStart() + 'source=url[file:' + assetLocation + ']';
    url += '&scale=options[limit],size[400]&sink=format[png]';
    return url;
};

LiquidPixels.getBirdEyeViewImageUrl = function (styleNumber, view) {
    //TODO bird eye view image url needs to be changed
    var category, designNumber, scale, sizeNumber, sizeSuffix, styleHeight, styleTopNumber, styleBottomNumber, styleWidth, view;

    var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
    var currentDesign = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
    var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
    category = categoryInfo.Name ? categoryInfo.Name.toLowerCase() : CONFIG.get("DEFAULT_SPORT");
    designNumber = currentDesign.DesignNumber || CONFIG.get("DEFAULT_DESIGN_NUMBER");

    styleTopNumber = currentStyle.StyleNumber || CONFIG.get("DEFAULT_STYLE_NUMBER");


    return LiquidPixels.getChainStart() + 'blank=color[none],height[1],name[orb-dummy],width[1]'
            + '&set=category[' + category + '],styleNumber[' + styleTopNumber + '],view[' + view + ']'
            + '&source=url[file:/ASSETS/previewImages/global.category/global.styleNumber/global.view/%28%27global.styleNumber%27%20.%20%27_baseImage_%27%20.%20%27global.view%27%20.%20%27.png%27%29]'
            + '&scale=height[57],width[43]' + this.getChainEnd('png');

};
/**
 * This method is responsible for the knockout background functionality
 * @param  imageUrl URL of the Image
 * @param  isDealerLogo if dealer logo is being used
 * @returns String Chain of knockout Background
 */

LiquidPixels.getbackgroundKnockoutUrl = function (imageUrl, isDealerLogo) {
    var scale = CONFIG.get("SCALE_DEALER_LOGO");
    if (typeof isDealerLogo == undefined) {
        scale = CONFIG.get("SCALE_BACKGROUND");
    }

    var knockoutImageurl = LiquidPixels.getChainStart() + 'set=scale[' + scale + ']&set=imageFilePath[$IMAGE]&set=elementSize[1000],saturation[100]&call=url[file:/ASSETS/anchor-uploadedGraphic_bgKnockout_r0.chain]' + this.getChainEnd();
    knockoutImageurl = knockoutImageurl.replace('$IMAGE', imageUrl);

    return knockoutImageurl;
};

/**
 * Proof Color Identification ImageUrl
 * @param colorName
 * @returns String Chain
 */
LiquidPixels.getProofColorIdentificationImageUrl = function (colorValue) {
    return LiquidPixels.getChainStart() + "set=color[" + colorValue + "],colorNone[none],strokeColor[black]&blank=color[global.colorNone],height[20],width[20]&draw=fill[global.color],points[10,10,3.5,7],primitive[circle],stroke[global.strokeColor],swidth[1]&sink=format[gif]&key=key[1385474659728],nocache[true]";
};


/**
 * Proof Color Identification ImageUrl
 * @param colorName
 * @returns String Chain
 */
LiquidPixels.getColorIdentificationImageUrl = function (colorValue) {
    return LiquidPixels.getChainStart() + "set=color[" + colorValue + "],colorNone[none],strokeColor[black]&blank=color[global.colorNone],height[12],width[12]&draw=fill[global.color],points[6,6,1.5,3.5],primitive[circle],stroke[global.strokeColor],swidth[1]&sink=format[gif]&key=key[1385474659728],nocache[true]";
};


/**
 * get any file url
 * @param imageSource
 * @returns String Anyfile
 */
LiquidPixels.getAnyFileUrl = function (imageSource) {
    var ext = imageSource.split('.').pop().toLowerCase();
    if ($.inArray(ext, ['tiff', 'tif', 'ai', 'pdf', 'psd']) != -1) {
        return LiquidPixels.getChainStart() + "source=url[" + imageSource + "]&sink=format[png]";
    }
    return imageSource;
};

/**
 * Transforms the long url to webservice to shorten it
 * @param previewImageSource Source of the image
 * @param callback Callback method to show image in various places
 *
 * @returns String Shorten url of image
 */
LiquidPixels.transformUrl = function (previewImageSource, callback, elementId) {
    if (previewImageSource.length > objApp.modelPreviewUrlLength && CONFIG.get('DEBUG') == false) {
        // copying the file to our local server by using 'MODEL_PREVIEW_IMAGE_URL' service
        var sessionVariable = GlobalInstance.uniformConfigurationInstance.getSessionVariable();
        var modelPreviewAPI = WEB_SERVICE_URL.get('MODEL_PREVIEW_IMAGE_URL');
        var params = {
            "sessionVariable": sessionVariable,
            "modelPreviewImageUrl": previewImageSource
        };

        try {
            var objCommHelper = new CommunicationHelper();
            objCommHelper.callAjax(modelPreviewAPI, 'POST', JSON.stringify(params), 'json', null, function (response) {
                if (response.ResponseData && callback !== undefined) {
                    callback(response.ResponseData, elementId);
                }
            }, null, null, null, null, null);
        } catch (err) {
        }
    }
    else {
        if (callback !== undefined) {
            callback(previewImageSource, elementId);
        }
    }
};
var rosterModelPreviewImageLoaded = null, modelPreviewImageLoaded = null;

/**
 * Class constructor
 * @returns void
 */
function ImagePreview() {
    this.imageObject = new Image();
    modelPreviewImageLoaded = false;
}

/**
 * Loads the model preview image 
 * @param String previewImageSource
 * @returns void
 */
ImagePreview.prototype.load = function (previewImageSource) {
    
    this.imageObject.onload = function () {
        
        
        var oldImg = $("#idImageLoader img");
        var img = new Image();

        img.src = lastSource;
        var previewEndTime = new Date().getTime();
        var previewEnd = new Date(previewEndTime);
        Log.trace('2) FINISH: Model preview LP call ends at ' + (previewEnd.toString()))

        var newImg = $(img).hide();
        newImg.css('position', 'absolute');
        
        var imageStartTime = new Date().getTime();
        var imageStart = new Date(imageStartTime);
        Log.trace('3) STARTS: Model preview source set starts at: ' + (imageStart.toString()))

        $("#idImageLoader").append(img);
        if (oldImg.length > 0) {
            oldImg.stop(true).fadeOut(1000, function () {
                startProcessCount = 1;
                if (rosterModelPreviewImageLoaded == true || rosterModelPreviewImageLoaded == null)
                    $.doneProcess('ImagePreview.prototype.load onload1');
                $(this).remove();
                var imageEndTime = new Date().getTime();
                var imageEnd = new Date(imageEndTime);
                Log.trace('3) FINISH Model preview source set ends at: ' + (imageEnd.toString()))
                var previewImageEnd = new Date();
                Log.trace("IMAGE URL: " + lastSource + " \ntook " + (previewImageEnd - previewImageStart) + " ms");
                
            });
        }
        else {
            startProcessCount = 1;
            if (rosterModelPreviewImageLoaded == true || rosterModelPreviewImageLoaded == null)
                $.doneProcess('ImagePreview.prototype.load onload2');
        }
        modelPreviewImageLoaded = true;
        newImg.fadeIn(1000);

    };
    this.imageObject.onerror = function () {
        //$.doneProcess('ImagePreview.prototype.load onerror');
    };
    this.imageObject.src = previewImageSource;
};

/**
 * Class constructor
 * @returns void
 */
function RosterImagePreview() {
    this.rosterImageObject = new Image();
    rosterModelPreviewImageLoaded = false;
}

/**
 * Loads the Roster model preview image 
 * @param String previewImageSource
 * @returns void
 */
RosterImagePreview.prototype.load = function (previewRosterImageSource) {
    $.startProcess(true, 'rosterimagepreview load');
    this.rosterImageObject.onload = function () {
        var oldImg = $("#dvRosterModelPreview img");
        var img = new Image();

        img.src = rosterImageLastResource;
        var newImg = $(img).hide();
        newImg.css('position', 'absolute');
        newImg.addClass('imgRosterModelPreview');

        $("#dvRosterModelPreview").append(img);
        if (oldImg.length > 0) {
            oldImg.stop(true).fadeOut(1000, function () {
                startProcessCount = 1;
                if (modelPreviewImageLoaded == true || modelPreviewImageLoaded == null)
                    $.doneProcess('RosterImagePreview.prototype.load onlaod1');
                $(this).remove();
            });

        }
        else {
            startProcessCount = 1;
            if (modelPreviewImageLoaded == true || modelPreviewImageLoaded == null)
                $.doneProcess('RosterImagePreview.prototype.load onlaod2');
        }
        rosterModelPreviewImageLoaded = true;
        newImg.fadeIn(1000);

    };
    this.rosterImageObject.onerror = function () {
        //$.doneProcess('RosterImagePreview.prototype.load on error');
    };
    this.rosterImageObject.src = previewRosterImageSource;
};