/**
 * TWA proshpere configurator
 * 
 * color.js defines different colors related functions. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor to define initial value 
 * @param String ctrId
 * @param String secondaryColorPanelId
 * @param String tertiaryColorPanelId
 * @returns void
 */
function Color(ctrId, secondaryColorPanelId, tertiaryColorPanelId) {
    this.colorsList = new Object();
    this.requestUrl = WEB_SERVICE_URL.get('COLOR_CONFIGURATOR', LOCAL);
    this.responseType = 'json';
    this.objCommHelper = new CommunicationHelper();
    this.objUtility = new Utility();
    this.objDialog = new DialogBox();
    this.ctrColorPanelId = ctrId;
    this.secondaryColorPanelId = secondaryColorPanelId;
    this.tertiaryColorPanelId = tertiaryColorPanelId;
    this.selectedPrimaryColorForProof = null;
    this.selectedSecondaryColorForProof = null;
    this.selectedTirtiaryColorForProof = null;
    this.selectedPrimaryColorRGBForProof = null;
    this.selectedSecondaryColorRGBForProof = null;
    this.selectedTirtiaryColorRGBForProof = null;
    this.dvPrimaryColorCustomListBox = 'dvPrimaryColorCustomListBox';
    this.dvSecondaryColorCustomListBox = 'dvSecondaryColorCustomListBox';
    this.dvTertiaryColorCustomListBox = 'dvTertiaryColorCustomListBox';
    //this.funcCallBack = $.Callbacks('memory');
    this.funcCallBack = null;
    this.bindColorScreenEvents();
    this.arrColorListForIdentification = new Array();
    this.arrCustomColorListForIdentification = new Array();
}
;

/**
 * Initializes the color API request
 * @returns {void}
 */
Color.prototype.init = function() {
    Log.info("color.js -> init() \n====\n  ");
    try {
        var params = {
            'applicationId': GlobalInstance.uniformConfigurationInstance.getApplicationId(),
            'customerId': GlobalInstance.uniformConfigurationInstance.getAccountNumber()
        };
        this.objCommHelper.callAjax(this.requestUrl, 'GET', params, this.responseType, null, this.createColorList.bind(this), null, null, null, null, null);
    }
    catch (e) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description color 56: " + e.message + "\n\n";
            txt += "Error filename: " + e.fileName + "\n\n";
            txt += "Error lineNumber: " + e.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
 * This method is responsible for handling the click eevnts in the screen
 * @returns void
 */
Color.prototype.bindColorScreenEvents = function() {
    $(document).on('click', '.colorLink', function() {
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = null;
        GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox('', MESSAGES.get('MESSAGE_DESIGN_JERSY_PANT_DIFFERENT_COLOR'));
    });
};

/**
 * Creates the color list into the object after recieving the list from Web Service. 
 *
 * @param response Response from Web service in json format containing sports list
 * @param params
 * 
 * @return void
 */
Color.prototype.createColorList = function(response, params) {
    var thisObject = this;
    Log.info("color.js -> createColorList() \n====\n  ");
    try {
        if (this.objUtility.validateResponseFormat(response, this.requestUrl)) {
            $.each(response.ResponseData, function(i, color) {
                thisObject.colorsList["_" + color.ColorId] = color;
            });
            $(document).trigger("loadColorDependent");
            
            this.setHtmlAndBind();
        } else {
            Log.error("Error in API");
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description color 99: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
 * This method displays colorPanel
 *
 * @return void
 */
Color.prototype.show = function() {
    $("#secColorPanel").show();
};


/**
 * This method hides the colorPanel 
 *
 * @return void
 */
Color.prototype.hide = function() {
    $("#secColorPanel").hide();
};
/**
 * Sets the color list HTML and binds the click event
 *
 * @return void
 */
Color.prototype.setHtmlAndBind = function() {
    var thisObject = this;
    var tempColorsListHtml = '<ul> ';
    var tempCustomColorsListHtml = '<ul>';

    $.each(this.getColorList(), function (i, colorList) {
        if (colorList.TaaColorId === undefined) {
            thisObject.arrCustomColorListForIdentification.push(colorList);
        }
        else {
            thisObject.arrColorListForIdentification.push(colorList);
        }
        if (colorList.CustomerId != null && colorList.CustomerId != '' && colorList.CustomerId != undefined)
        {
            tempCustomColorsListHtml += ' <li id=liColor_' + colorList.ColorId + ' TaaColorId="'+colorList.TaaColorId+'">';
            tempCustomColorsListHtml += '<span TaaColorId="'+colorList.TaaColorId+'" colorId="' + colorList.ColorId + '" alt="' + colorList.Name + '" title="' + colorList.Name + '" id="aColor_' + colorList.ColorId + '"  class="colorItems" style="background-color:rgb(' + (colorList.Red + ',' + colorList.Green + ',' + colorList.Blue) + ')"></span>';
            tempCustomColorsListHtml += '</li>';
        } else {
            tempColorsListHtml += ' <li id=liColor_' + colorList.ColorId + ' TaaColorId="'+colorList.TaaColorId+'">';
            tempColorsListHtml += '<span TaaColorId="'+colorList.TaaColorId+'" colorId="' + colorList.ColorId + '" alt="' + colorList.Name + '" title="' + colorList.Name + '" id="aColor_' + colorList.ColorId + '"  class="colorItems" style="background-color:rgb(' + (colorList.Red + ',' + colorList.Green + ',' + colorList.Blue) + ')"></span>';
            tempColorsListHtml += '</li>';
        }
    });
    tempColorsListHtml += '</ul>';


    if (this.ctrColorPanelId) {
        $("#" + this.ctrColorPanelId).html(tempColorsListHtml);
    }
    if (this.secondaryColorPanelId) {
        $("#" + this.secondaryColorPanelId).html(tempColorsListHtml);
    }
    if (this.tertiaryColorPanelId) {
        $("#" + this.tertiaryColorPanelId).html(tempColorsListHtml);
    }
    //Do not show Scroll bar if Color Count is less than 34
    if (Utility.getObjectlength(this.getColorList(),'colorjs160') <= CONFIG.get('COLOR_COUNT')) {
        $('.colorSectionScroller').css('overflow-y', 'auto');
    }

    var customerId = GlobalInstance.uniformConfigurationInstance.getAccountNumber();
    if (customerId !== 0 && customerId !== undefined) {
        if (this.dvPrimaryColorCustomListBox) {
            $("#" + this.dvPrimaryColorCustomListBox).html(tempCustomColorsListHtml);
        }
        if (this.dvSecondaryColorCustomListBox) {
            $("#" + this.dvSecondaryColorCustomListBox).html(tempCustomColorsListHtml);
        }
        if (this.dvTertiaryColorCustomListBox) {
            $("#" + this.dvTertiaryColorCustomListBox).html(tempCustomColorsListHtml);
        }
    }

    GlobalInstance.fabricInstance = GlobalInstance.getFabricInstance();
    $("#" + this.ctrColorPanelId + " ul li span").on("click", function() {
        $(this).parent('li').siblings().removeClass('active');
        $(this).parent('li').addClass('active');
        // Remove custom color active class
        if ($("#dvPrimaryColorCustomListBox ul li")) {
            $("#dvPrimaryColorCustomListBox ul li").siblings('.active').removeClass('active');
        }
        var currentPrimaryColor = thisObject.getColorByKey('_' + $(this).attr('colorId'));
        thisObject.selectedPrimaryColorForProof = currentPrimaryColor.Name;
        thisObject.selectedPrimaryColorForPrint = currentPrimaryColor.Name;
        thisObject.selectedPrimaryColorRGBForProof = currentPrimaryColor.RgbHexadecimal;
        GlobalInstance.getUniformConfigurationInstance().setColorsInfo('uniformPrimaryColor', currentPrimaryColor);
        $('.uniformColorBoxPrimary').css('background', currentPrimaryColor.RgbHexadecimal);
        $('.uniformColorBoxPrimary').attr({'title': currentPrimaryColor.Name, 'alt': currentPrimaryColor.Name});

        //Call Respective method in LiquidPixel.js to update Preview Image
        //Call model Preview URl 
        LiquidPixels.updateModelPreview('cjs 195',Validator.isColorSelected());
        GlobalInstance.fabricInstance.setHtmlAndBind();
        var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
        var selectedFabricInfo = GlobalInstance.uniformConfigurationInstance.getFabricsInfo();
        var fabricIsClicked = GlobalInstance.uniformConfigurationInstance.getFabricClicked();
        var fabricCount = 0;
        var relatedStyleId = null;
        if (Utility.isExist(CONFIG.get('STYLE_SHOW'), parseInt(currentStyle.StyleId, 10))) {
            fabricCount = Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId),'cljs203');
            relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID'), function(n, i) {
                return (i == currentStyle.StyleId ? n : null);
            });
            fabricCount += Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(relatedStyleId),'cljs207');;
        } else if (Utility.isExist(CONFIG.get('STYLE_HIDE'), currentStyle.StyleId)) {
            fabricCount = Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId),'cljs209');
            relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID'), function(n, i) {
                return (n == currentStyle.StyleId ? i : null);
            });
            fabricCount += Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(relatedStyleId),'cljs213');;
        } else if (Utility.isExist(CONFIG.get('STYLE_SHOW_FEMALE'), parseInt(currentStyle.StyleId, 10))) {
            fabricCount = Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId), 'cljs209');
            relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID_FEMALE'), function (n, i) {
                return (i == currentStyle.StyleId ? n : null);
            });
            fabricCount += Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(relatedStyleId), 'cljs207');;
        } else if (Utility.isExist(CONFIG.get('STYLE_HIDE_FEMALE'), parseInt(currentStyle.StyleId, 10))) {
            fabricCount = Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId), 'cljs209');
            relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID_FEMALE'), function (n, i) {
                return (n == currentStyle.StyleId ? i : null);
            });
            fabricCount += Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(relatedStyleId), 'cljs207');;
        }
        else {
            fabricCount = fabricCount = Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId),'cljs216');
        }

        if (currentStyle) {
            GlobalInstance.fabricInstance.showFabrics(currentStyle.StyleId);
            if (relatedStyleId) {
                GlobalInstance.fabricInstance.showFabrics(relatedStyleId, false);
            }
            if (fabricIsClicked) {
                $('#fabric_' + currentStyle.StyleId + '_' + selectedFabricInfo.FabricId + ' a').first().children().addClass('active');
                $('#fabric_' + currentStyle.StyleId + '_' + selectedFabricInfo.FabricId + ' a').first().children().first().children().first().children().addClass('active');
            } else if (fabricCount === 1) {
                $('#fabric_' + currentStyle.StyleId + '_' + selectedFabricInfo.FabricId + ' a').first().children().addClass('active');
                $('#fabric_' + currentStyle.StyleId + '_' + selectedFabricInfo.FabricId + ' a').first().children().first().children().first().children().addClass('active');
            }
        }
        GlobalInstance.shoppingCartInstance = GlobalInstance.getShoppingCartInstance();
        GlobalInstance.shoppingCartInstance.rebuildCart();

        thisObject.showContinueButtonIfAllColorsSelected();
    });

    $("#" + this.secondaryColorPanelId + " ul li span").on("click", function() {
        $(this).parent('li').siblings().removeClass('active');
        $(this).parent('li').addClass('active');
        // Remove custom color active class
        if ($("#dvSecondaryColorCustomListBox ul li")) {
            $("#dvSecondaryColorCustomListBox ul li").siblings('.active').removeClass('active');
        }
        var currentSecondaryColor = thisObject.getColorByKey('_' + $(this).attr('colorId'));
        thisObject.selectedSecondaryColorForProof = currentSecondaryColor.Name;
        thisObject.selectedSecondaryColorForPrint = currentSecondaryColor.Name;
        thisObject.selectedSecondaryColorRGBForProof = currentSecondaryColor.RgbHexadecimal;
        GlobalInstance.getUniformConfigurationInstance().setColorsInfo('uniformSecondaryColor', currentSecondaryColor);
        $('.uniformColorBoxSecondary').css('background', currentSecondaryColor.RgbHexadecimal);
        $('.uniformColorBoxSecondary').attr({'title': currentSecondaryColor.Name, 'alt': currentSecondaryColor.Name});

        //Call Respective method in LiquidPixel.js to update Preview Image
        //Call model Preview URl 
        LiquidPixels.updateModelPreview('cjs 263',Validator.isColorSelected());

        thisObject.showContinueButtonIfAllColorsSelected();
    });

    $("#" + this.tertiaryColorPanelId + " ul li span").on("click", function() {
        $(this).parent('li').siblings().removeClass('active');
        $(this).parent('li').addClass('active');
        // Remove custom color active class
        if ($("#dvTertiaryColorCustomListBox ul li")) {
            $("#dvTertiaryColorCustomListBox ul li").siblings('.active').removeClass('active');
        }
        var currentTertiaryColor = thisObject.getColorByKey('_' + $(this).attr('colorId'));
        thisObject.selectedTirtiaryColorForProof = currentTertiaryColor.Name;
        thisObject.selectedTirtiaryColorForPrint = currentTertiaryColor.Name;
        thisObject.selectedTirtiaryColorRGBForProof = currentTertiaryColor.RgbHexadecimal;
        GlobalInstance.getUniformConfigurationInstance().setColorsInfo('uniformTertiaryColor', currentTertiaryColor);
        $('.uniformColorBoxTertiary').css('background', currentTertiaryColor.RgbHexadecimal);
        $('.uniformColorBoxTertiary').attr({'title': currentTertiaryColor.Name, 'alt': currentTertiaryColor.Name});

        //Call model Preview URl 
        LiquidPixels.updateModelPreview('cjs 284',Validator.isColorSelected());

        thisObject.showContinueButtonIfAllColorsSelected();
    });

    /*******************Custom Color ************************/
    $("#" + this.dvPrimaryColorCustomListBox + " ul li span").on("click", function() {
        $(this).parent('li').siblings().removeClass('active');
        $(this).parent('li').addClass('active');
        // Remove custom color active class
        /*if ($("#dvPrimaryColorCustomListBox ul li")) {
         $("#dvPrimaryColorCustomListBox ul li").siblings('.active').removeClass('active');
         }*/
        $("#primaryColorPanel ul li").siblings('.active').removeClass('active');

        var currentPrimaryColor = thisObject.getColorByKey('_' + $(this).attr('colorId'));
        GlobalInstance.getUniformConfigurationInstance().setColorsInfo('uniformPrimaryColor', currentPrimaryColor);
        $('.uniformColorBoxPrimary').css('background', currentPrimaryColor.RgbHexadecimal);

        //Call model Preview URl 
        LiquidPixels.updateModelPreview('cjs 304');
        GlobalInstance.fabricInstance.setHtmlAndBind();
        var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
        var relatedStyleId = null;
        if (currentStyle) {
            GlobalInstance.fabricInstance.showFabrics(currentStyle.StyleId);
            if (Utility.isExist(CONFIG.get('STYLE_SHOW'), parseInt(currentStyle.StyleId, 10))) {
                fabricCount = Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId), 'cljs203');
                relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID'), function (n, i) {
                    return (i == currentStyle.StyleId ? n : null);
                });
                fabricCount += Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(relatedStyleId), 'cljs207');;
            } else if (Utility.isExist(CONFIG.get('STYLE_HIDE'), currentStyle.StyleId)) {
                fabricCount = Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId), 'cljs209');
                relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID'), function (n, i) {
                    return (n == currentStyle.StyleId ? i : null);
                });
                fabricCount += Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(relatedStyleId), 'cljs213');;
            } else if (Utility.isExist(CONFIG.get('STYLE_SHOW_FEMALE'), parseInt(currentStyle.StyleId, 10))) {
                fabricCount = Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId), 'cljs209');
                relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID_FEMALE'), function (n, i) {
                    return (i == currentStyle.StyleId ? n : null);
                });
                fabricCount += Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(relatedStyleId), 'cljs207');;
            } else if (Utility.isExist(CONFIG.get('STYLE_HIDE_FEMALE'), parseInt(currentStyle.StyleId, 10))) {
                fabricCount = Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId), 'cljs209');
                relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID_FEMALE'), function (n, i) {
                    return (n == currentStyle.StyleId ? i : null);
                });
                fabricCount += Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(relatedStyleId), 'cljs207');;
            }
            else {
                fabricCount = fabricCount = Utility.getObjectlength(GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId), 'cljs216');
            }

            if (currentStyle) {
                GlobalInstance.fabricInstance.showFabrics(currentStyle.StyleId);
                if (relatedStyleId) {
                    GlobalInstance.fabricInstance.showFabrics(relatedStyleId, false);
                }
                if (fabricIsClicked) {
                    $('#fabric_' + currentStyle.StyleId + '_' + selectedFabricInfo.FabricId + ' a').first().children().addClass('active');
                    $('#fabric_' + currentStyle.StyleId + '_' + selectedFabricInfo.FabricId + ' a').first().children().first().children().first().children().addClass('active');
                } else if (fabricCount === 1) {
                    $('#fabric_' + currentStyle.StyleId + '_' + selectedFabricInfo.FabricId + ' a').first().children().addClass('active');
                    $('#fabric_' + currentStyle.StyleId + '_' + selectedFabricInfo.FabricId + ' a').first().children().first().children().first().children().addClass('active');
                }
            }
        }

        GlobalInstance.shoppingCartInstance = GlobalInstance.getShoppingCartInstance();
        GlobalInstance.shoppingCartInstance.rebuildCart();
        thisObject.showContinueButtonIfAllColorsSelected();
    });

    $("#" + this.dvSecondaryColorCustomListBox + " ul li span").on("click", function() {
        $(this).parent('li').siblings().removeClass('active');
        $(this).parent('li').addClass('active');
        $("#secondaryColorPanel ul li").siblings('.active').removeClass('active');
        var currentSecondaryColor = thisObject.getColorByKey('_' + $(this).attr('colorId'));
        GlobalInstance.getUniformConfigurationInstance().setColorsInfo('uniformSecondaryColor', currentSecondaryColor);
        $('.uniformColorBoxSecondary').css('background', currentSecondaryColor.RgbHexadecimal);

        //Call model Preview URl 
        LiquidPixels.updateModelPreview('cjs 341');
        thisObject.showContinueButtonIfAllColorsSelected();
    });

    $("#" + this.dvTertiaryColorCustomListBox + " ul li span").on("click", function() {
        $(this).parent('li').siblings().removeClass('active');
        $(this).parent('li').addClass('active');
        $("#dvIdTertiaryColorPanel ul li").siblings('.active').removeClass('active');
        var currentTertiaryColor = thisObject.getColorByKey('_' + $(this).attr('colorId'));
        GlobalInstance.getUniformConfigurationInstance().setColorsInfo('uniformTertiaryColor', currentTertiaryColor);
        $('.uniformColorBoxTertiary').css('background', currentTertiaryColor.RgbHexadecimal);

        //Call model Preview URl         
        LiquidPixels.updateModelPreview('cjs354');
        thisObject.showContinueButtonIfAllColorsSelected();
    });
    this.showColor();
};

/**
 * This method is responsible for providing color object
 * @returns {colorlist}
 */
Color.prototype.getColorList = function() {
    return this.colorsList;
};

/**
 * This method is responsible for adding callback to the respective function
 * @param  funcName
 * @returns {funcCallBack.remove(funcName);}
 */
Color.prototype.addCallback = function(funcName) {
    this.funcCallBack.add(funcName);
};

/**
 * This method is responsible for removing callback from respective function
 * @param funcName
 * @returns {funcCallBack.remove(funcName);}
 */
Color.prototype.removeCallback = function(funcName) {
    this.funcCallBack.remove(funcName);
};

/**
 * This method is responsible for reteriving selected color info.
 * @param  key
 * @returns {selected Color Object}
 */
Color.prototype.getColorByKey = function(key) {
    return this.colorsList[key] || null;
};
/**
 * This method is responsible to display colors
 * @returns {void}
 */
Color.prototype.showColor = function() {
    Log.info("color.js -> showColor() \n====\n  ");
    try {
        var thisObject = this;
        var colorsInfo = thisObject.getSelectedColor();
        if (colorsInfo.uniformPrimaryColor) {
            $("#" + this.ctrColorPanelId + " ul li").siblings('#liColor_' + colorsInfo.uniformPrimaryColor.ColorId).addClass('active');
            $("#" + this.dvPrimaryColorCustomListBox + " ul li ").siblings('#liColor_' + colorsInfo.uniformPrimaryColor.ColorId).addClass('active');
        }
        if (colorsInfo.uniformSecondaryColor) {
            $("#" + this.secondaryColorPanelId + " ul li").siblings('#liColor_' + colorsInfo.uniformSecondaryColor.ColorId).addClass('active');
            $("#" + this.dvSecondaryColorCustomListBox + " ul li ").siblings('#liColor_' + colorsInfo.uniformSecondaryColor.ColorId).addClass('active');
        }
        if (colorsInfo.uniformTertiaryColor) {
            $("#" + this.tertiaryColorPanelId + " ul li").siblings('#liColor_' + colorsInfo.uniformTertiaryColor.ColorId).addClass('active');
            $("#" + this.dvTertiaryColorCustomListBox + " ul li ").siblings('#liColor_' + colorsInfo.uniformTertiaryColor.ColorId).addClass('active');
        }
        GlobalInstance.loadConfigurationInstance = GlobalInstance.getLoadConfigurationInstance();
        if (GlobalInstance.loadConfigurationInstance.isLoaded()) {
            this.showContinueButtonIfAllColorsSelected();
        }

    } catch (e) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description color 422: " + e.message + "\n\n";
            txt += "Error filename: " + e.fileName + "\n\n";
            txt += "Error lineNumber: " + e.lineNumber + "\n\n";
            Log.error(txt);
        }

    }

};

/**
 * This method is responsible for reteriving selected color info
 * @returns {Color.prototype.getSelectedColor.colorsInfo-selected colors info}
 */
Color.prototype.getSelectedColor = function() {
    var thisObject = this;
    try {
        var colors = GlobalInstance.uniformConfigurationInstance.getColorsInfo();

        var colorsInfo = {
            "uniformPrimaryColor": null,
            "uniformSecondaryColor": null,
            "uniformTertiaryColor": null
        };
        if (colors.uniformPrimaryColor) {
            colorsInfo.uniformPrimaryColor = colors.uniformPrimaryColor;
        }
        else {
            //GlobalInstance.uniformConfigurationInstance.setColorsInfo('uniformPrimaryColor',thisObject.getColorByKey($('#' + thisObject.ctrColorPanelId + ' ul li a').first().attr('colorid')));
            // colorsInfo.uniformPrimaryColor =  GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformPrimaryColor');
        }

        if (colors.uniformSecondaryColor) {
            colorsInfo.uniformSecondaryColor = colors.uniformSecondaryColor;
        }
        else {
            //GlobalInstance.uniformConfigurationInstance.setColorsInfo('uniformSecondaryColor',thisObject.getColorByKey($("#" + thisObject.secondaryColorPanelId + " ul li a").first().attr('colorid')));
            // colorsInfo.uniformSecondaryColor =  GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformSecondaryColor');
        }

        if (colors.uniformTertiaryColor) {
            colorsInfo.uniformTertiaryColor = colors.uniformTertiaryColor;
        }
        else {
            //GlobalInstance.uniformConfigurationInstance.setColorsInfo('uniformTertiaryColor',thisObject.getColorByKey($('#' + thisObject.tertiaryColorPanelId + ' ul li a').first().attr('colorid')));
            //colorsInfo.uniformTertiaryColor =  GlobalInstance.uniformConfigurationInstance.getColorsInfo('uniformTertiaryColor');
        }

        return colorsInfo;
    } catch (e) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description color 473: " + e.message + "\n\n";
            txt += "Error filename: " + e.fileName + "\n\n";
            txt += "Error lineNumber: " + e.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};



/**
 * This method is rsponible for shoe cusomize button after selecting all color
 * @returns {void}
 */
Color.prototype.showContinueButtonIfAllColorsSelected = function() {
    if (Validator.isColorSelected()) {
        $('#dvColorContinueBtn').parent().show();
        $('#dvColorContinueBtn').show();
    }
};