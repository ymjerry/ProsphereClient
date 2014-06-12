/**
 * TWA proshpere configurator
 * 
 * graphics.js is used to contain all the functionality related to selection in the Select Graphics screen
 * @package proshpere
 * @subpackage uibl
 */
var GRAPHIC_KEY = {
    GraphicCategory: 'GraphicCategory',
    GraphicSubCategory: 'GraphicSubCategory',
    GraphicDesign: 'GraphicDesign',
    CustomizeGraphicPrimaryColor: 'CustomizeGraphicPrimaryColor',
    CustomizeGraphicSecondaryColor: 'CustomizeGraphicSecondaryColor',
    CustomizeGraphicAccentColor: 'CustomizeGraphicAccentColor',
    CustomizeGraphicUrl: 'CustomizeGraphicUrl',
    GraphicLayerCount: 'GraphicLayerCount',
    ColorizeId1:'ColorizeId1',
    ColorizeId2:'ColorizeId2',
    ColorizeId3:'ColorizeId3'
}
/*
 * Constructor for graphics
 */
function Graphics() {
    this.graphicsCategoryList = new Object();
    this.categoryList = new Object();
    this.subCatagory = new Object();
    this.subCategoryGraphicsList = new Object();
    this.selectedGraphicList = new Object();
    this.graphicList = new Object();
    this.selectedGraphic = null;
    this.selectedSubCategory = '';
    this.defaultColor = null;
    this.colorObject = {};
    this.previousSelectedSubCatId = null;
    this.categoryRequestUrl = WEB_SERVICE_URL.get('GRAPHIC_CATEGORY_LIST', LOCAL);
    this.graphicRequestUrl = WEB_SERVICE_URL.get('GRAPHIC_LIST', LOCAL);
    this.responseType = "json";
    this.objComHelper = new CommunicationHelper();
    this.objUtility = new Utility();
    this.dvGraphicCategoriesId = 'dvIdCatagory';
    this.dvGraphicDesignId = 'dvIdGraphics';
    this.secIdConfiguratorSelectGraphics = 'secConfiguratorSelectGraphics';
    this.secIdConfiguratorMyLocker = 'secConfiguratorMyLocker';
    this.secIdConfiguratorUploadGraphics = 'secConfiguratorUploadGraphics';
    this.secIdConfiguratorGraphicsHome = 'secConfiguratorGraphicsHome';
    this.secIdCustomizeGraphics = 'secCustomizeGraphics';
    this.btnBackSelectgraphics = 'btnBackSelectgraphics';
    this.dvIdBackCustomizegraphic = 'dvIdBackCustomizegraphic';
    this.btnCustomizeGraphics = 'aCustomizeGraphics';
    this.btnSelectGraphic = 'btnSelectGraphic';
    this.btnUploadGraphic = 'btnUploadGraphic';
    this.btnMyLocker = 'btnMyLocker';
    this.scrollBarObject = '';
    this.graphicListScrollObject = '';
    this.colorizedId1 = CONFIG.get('COLORIZEID_NONE'); // 1 means , graphic doesn't support the color
    this.colorizedId2 = CONFIG.get('COLORIZEID_NONE');
    this.colorizedId3 = CONFIG.get('COLORIZEID_NONE');
    this.bindGraphicScreenEvents();
}

/**
 * This method is responsible for calling the API GetGraphicList.
 * @return void
 */
Graphics.prototype.init = function() {
    try {
        var params = {
            'applicationId': GlobalInstance.uniformConfigurationInstance.getApplicationId()
        };
        
        this.objComHelper.callAjax(this.categoryRequestUrl, 'GET', params, this.responseType, null, this.createGraphicsCategoryList.bind(this), null, this.setHtmlAndBindColor.bind(this), null, null, null);
    } catch (e) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description graphics 70: " + e.message + "\n\n";
            txt += "Error filename: " + e.fileName + "\n\n";
            txt += "Error lineNumber: " + e.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
 * This method is responsible for retrieving graphics from Server based on
 * categoryId and subCategoryId
 * @param  subCategoryId - contains the subcategoryId of specific category
 * @return void
 */
Graphics.prototype.getGraphicsByCategory = function(subCategoryId) {
    try {
        var params = {
            'applicationId': GlobalInstance.uniformConfigurationInstance.getApplicationId(),
            'graphicsTypeId': subCategoryId
        };
        this.objComHelper.callAjax(this.graphicRequestUrl, 'GET', params, this.responseType, null, this.createGraphicsList.bind(this, subCategoryId), null, null, null, null, null);
    } catch (e) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description graphics 93: " + e.message + "\n\n";
            txt += "Error filename: " + e.fileName + "\n\n";
            txt += "Error lineNumber: " + e.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
 * This method is responsible for displaying Select Graphics screen and hides others.
 * @return void
 */
Graphics.prototype.show = function() {
    $('#' + this.secIdConfiguratorGraphicsHome).hide();
    $('#' + this.secIdConfiguratorUploadGraphics).hide();
    $('#' + this.secIdConfiguratorMyLocker).hide();
    $('#' + this.secIdCustomizeGraphics).hide();
    if (!Utility.getObjectlength(GlobalInstance.getUniformConfigurationInstance().getSelectGraphicInfo(),'gjs110') > 0) {
        $('.menuBody, .graphicsSearchList').hide();
    }
    $('#' + this.secIdConfiguratorSelectGraphics).show();

    //if not created create scroll object
    if (!this.scrollBarObject) {
        this.scrollBarObject = $('#' + this.dvGraphicCategoriesId).tinyscrollbar();
    }
}

/**
 * This method is responsible for to hide Select Graphics screen
 * @return void
 */
Graphics.prototype.hide = function() {
    $('#' + this.secIdConfiguratorSelectGraphics).hide();
}

/**
 * This method is responsible for displaying Customize Graphics screen
 * @return void
 */
Graphics.prototype.showCustomizeGraphics = function () {
    try{
        $('#' + this.secIdConfiguratorGraphicsHome).hide();
        $('#' + this.secIdConfiguratorUploadGraphics).hide();
        $('#' + this.secIdConfiguratorMyLocker).hide();
        $('#' + this.secIdConfiguratorSelectGraphics).hide();
        $('#' + this.secIdCustomizeGraphics).show();
        var thisObject = this;
        var colors = {}
        var isSecdaryColorUsed = false;
        var isAccentColorUsed = false;
        colors.primaryColor = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor);
        colors.primaryColor =(colors.primaryColor) ? colors.primaryColor : GlobalInstance.getColorRetainInstance().graphicColorObject[GRAPHIC_KEY.CustomizeGraphicPrimaryColor];
        colors.secondaryColor = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
        colors.secondaryColor = (colors.secondaryColor) ? colors.secondaryColor : GlobalInstance.getColorRetainInstance().graphicColorObject[GRAPHIC_KEY.CustomizeGraphicSecondaryColor];
        colors.accentColor = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor);
        colors.accentColor = (colors.accentColor) ? colors.accentColor : GlobalInstance.getColorRetainInstance().graphicColorObject[GRAPHIC_KEY.CustomizeGraphicAccentColor];
        this.colorObject;
        if (colors.primaryColor) {
            this.colorObject.primary = colors.primaryColor;
        } else if (!colors.primaryColor && this.colorObject.primary) {
            GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor, this.colorObject.primary);
        }
        if (colors.secondaryColor) {
            this.colorObject.secondary = colors.secondaryColor;
        } else if (!colors.secondaryColor && this.colorObject.secondary) {
            GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, this.colorObject.secondary);
        }
        if (colors.accentColor) {
            this.colorObject.accent = colors.accentColor;
        } else if (!colors.accentColor && this.colorObject.accent) {
            GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, this.colorObject.accent);
        }

        if (Utility.getObjectlength(this.colorObject,'gjs155') > 0) {
            //set primary color
            var cObject =null;
            if(this.colorizedId1 == CONFIG.get('COLORIZEID_COLOR_1')){
                cObject = this.colorObject.primary;
            }else if(this.colorizedId2 == CONFIG.get('COLORIZEID_COLOR_2')){
                isSecdaryColorUsed = true;
                cObject = this.colorObject.secondary;
                var cId =(cObject.colorid) ? cObject.colorid : cObject.ColorId;;
                if (!cObject) {
                    cObject = thisObject.defaultColor;
                } else if (cId == 0 || cId == null){
                    cObject = thisObject.defaultColor;
                } 
            }else if(this.colorizedId3 == CONFIG.get('COLORIZEID_COLOR_3')){
                isAccentColorUsed = true;
                cObject = this.colorObject.accent;
            }
            var colorName = (cObject.colorName) ? cObject.colorName :cObject.Name;
            var colorId =  (cObject.colorid) ? cObject.colorid : cObject.ColorId;
            var rgbHexCode = (cObject.background && cObject.colorid) ? cObject.background.substring(cObject.background.indexOf(':') + 1) :cObject.RgbHexadecimal;
            $('#dvIdSelectedPrimaryColorCustomizeGraphic').attr({
                'alt': colorName,
                'style': rgbHexCode,
                'colorid': colorId
            });
            if (cObject && colorId) {
                $('#dvIdSelectedPrimaryColorCustomizeGraphic').css('background-color', rgbHexCode);
            }


            //set secondary color
            if (thisObject.colorObject.secondary) {
                cObject = this.colorObject.secondary;
                if (this.colorizedId2 == CONFIG.get('COLORIZEID_COLOR_2') && !isSecdaryColorUsed) {
                    cObject = this.colorObject.secondary;
                } else if (this.colorizedId3 == CONFIG.get('COLORIZEID_COLOR_3')) {
                    isAccentColorUsed = true;
                    cObject = this.colorObject.accent;
                }
                colorName = (cObject.colorName) ? cObject.colorName : cObject.Name;
                colorId = (cObject.colorid) ? cObject.colorid : cObject.ColorId;
                rgbHexCode = (cObject.background && cObject.colorid) ? cObject.background.substring(cObject.background.indexOf(':') + 1) :cObject.RgbHexadecimal;
                if (cObject.colorid != 0 && colorId) {
                    $('#dvIdSelectedSecondaryColorCustomizeGraphic').attr({
                        'alt': colorName,
                        'style': rgbHexCode,
                        'colorid': colorId
                    });
                    //var sColorHexCode = cObject.background.substring(cObject.background.indexOf(':') + 1);
                    $('#dvIdSelectedSecondaryColorCustomizeGraphic').removeClass('slashImage');
                    $('#dvIdSelectedSecondaryColorCustomizeGraphic').css('background-color', rgbHexCode);
                } else {
                    $('#dvIdSelectedSecondaryColorCustomizeGraphic').addClass('slashImage');
                    $('#dvIdSelectedSecondaryColorCustomizeGraphic').css('background-color', 'transparent');
                }
            } else {
                //add default color
                $('#dvIdSelectedSecondaryColorCustomizeGraphic').attr({
                    'alt': thisObject.defaultColor.Name,
                    'style': thisObject.defaultColor.RgbHexadecimal,
                    'colorid': thisObject.defaultColor.RgbHexadecimal
                });
            }


            if (thisObject.colorObject.accent) {
                cObject = this.colorObject.accent;
                if (cObject.colorid != 0) {
                    colorName = (cObject.colorName) ? cObject.colorName : cObject.Name;
                    colorId = (cObject.colorid) ? cObject.colorid : cObject.ColorId;
                    rgbHexCode = (cObject.background && cObject.colorid) ? cObject.background.substring(cObject.background.indexOf(':') + 1) : cObject.RgbHexadecimal;
                    if (colorId) {
                        $('#dvIdSelectedAccentColorCustomizeGraphic').attr({
                            'alt': colorName,
                            'style': rgbHexCode,
                            'colorid': colorId
                        });
                        //var aColorHexCode = this.colorObject.accent.background.substring(this.colorObject.accent.background.indexOf(':') + 1);
                        $('#dvIdSelectedAccentColorCustomizeGraphic').removeClass('slashImage');
                        $('#dvIdSelectedAccentColorCustomizeGraphic').css('background-color', rgbHexCode);
                    } else {
                        $('#dvIdSelectedAccentColorCustomizeGraphic').addClass('slashImage');
                        $('#dvIdSelectedAccentColorCustomizeGraphic').css('background-color', 'transparent');
                    }
                }else{
                    $('#dvIdSelectedAccentColorCustomizeGraphic').addClass('slashImage');
                    $('#dvIdSelectedAccentColorCustomizeGraphic').css('background-color', 'transparent');
                }
            } else {
                //add default color
                $('#dvIdSelectedAccentColorCustomizeGraphic').attr({
                    'alt': thisObject.defaultColor.Name,
                    'style': thisObject.defaultColor.RgbHexadecimal,
                    'colorid': thisObject.defaultColor.RgbHexadecimal
                });
            }

            this.previewSelectedGraphic(this.colorObject);
        } else {
            $('#dvIdSelectedPrimaryColorCustomizeGraphic').attr({
                'alt': thisObject.defaultColor.Name,
                'style': thisObject.defaultColor.RgbHexadecimal,
                'colorid': thisObject.defaultColor.RgbHexadecimal
            });
            $('#dvIdSelectedSecondaryColorCustomizeGraphic').attr({
                'alt': thisObject.defaultColor.Name,
                'style': thisObject.defaultColor.RgbHexadecimal,
                'colorid': thisObject.defaultColor.RgbHexadecimal
            });
            $('#dvIdSelectedAccentColorCustomizeGraphic').attr({
                'alt': thisObject.defaultColor.Name,
                'style': thisObject.defaultColor.RgbHexadecimal,
                'colorid': thisObject.defaultColor.RgbHexadecimal
            });

            $('#dvIdSelectedPrimaryColorCustomizeGraphic').css('background-color', this.defaultColor.RgbHexadecimal);
        }
    } catch (e) {
    }
};

/**
 * This method is responsible for hiding the Customize Graphics screen
 * @return void
 */
Graphics.prototype.hideCustomizeGraphics = function() {
    $('#' + this.secIdCustomizeGraphics).hide();
    $('#' + this.secIdConfiguratorUploadGraphics).hide();
    $('#' + this.secIdConfiguratorMyLocker).hide();
    $('#' + this.secIdConfiguratorGraphicsHome).hide();
    $('#' + this.secIdConfiguratorSelectGraphics).show();
}

/**
 * This method is responsible for binding the events on this screen
 * @return void
 */
Graphics.prototype.bindGraphicScreenEvents = function() {
    var thisObject = this;
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    $(document).on('click', '#' + this.btnBackSelectgraphics, function() {
        GlobalInstance.getEmblemAndGraphicsInstance().show();
    });

    //Handle Click Event on the Particular Graphics
    $(document).off('click', '#' + this.dvGraphicDesignId);
    $(document).on('click', '#' + this.dvGraphicDesignId, function(event) {
        var target = event.target.id;
        if (target.indexOf('liGraphic') > -1) {
            $('.graphicsSearchList ul li').removeClass('active');
            $('#' + target).addClass('active');
            var graphicId = thisObject.getGraphicid(target);
            var graphicObject = thisObject.getSelectedGraphicByGraphicId(graphicId);
            thisObject.showHideColorOption(Utility.getGraphicLayerCount(graphicObject.Lys))
            thisObject.selectedGraphic = {
                GraphicId: graphicId,
                src: $('#' + target).children().attr('src')
            };
            thisObject.resetSelectedGraphicInfo();//This method reset the graphic object present in the Uniformconfiguration.js
            thisObject.saveSelectedGraphicInfo(null, null, target);

        } else {
            return;
        }
    });

    //Handle the Click Event on the Customize Graphic button
    $(document).on('click', '#' + this.btnCustomizeGraphics, function() {
        thisObject.showCustomizedGraphicScreen();
    });

    //Handle the click event on the back button present in the Customize Graphics screen
    $(document).on('click', '#' + this.dvIdBackCustomizegraphic, function() {
        thisObject.hideCustomizeGraphics();
    });

    //Handle the click event on the select graphic  button present in the Customize Graphics screen
    $(document).on('click', '#' + this.btnSelectGraphic, function() {
        thisObject.hideCustomizeGraphics();
    });

    //Handle the click event on the upload graphic button present in the Customize Graphics screen
    $(document).on('click', '#' + this.btnUploadGraphic, function() {
        GlobalInstance.uploadGraphicsInstance = GlobalInstance.getUploadGraphicsInstance();
        GlobalInstance.uploadGraphicsInstance.show();
    });

    //Handle the click event on the myLocker button present in the Customize Graphics screen
    $(document).on('click', '#' + this.btnMyLocker, function() {
        GlobalInstance.myLockerInstance = GlobalInstance.getMyLockerInstance();
        GlobalInstance.myLockerInstance.show();
    });

    //Primary Color Combo Box Binding
    $(document).off('click', '#dvIdColorBoxCustomizeGraphicPrimary ul li ,#dvIdPrimaryColorCustomizeGraphic ,#dvIdGraphicPrimaryCustomColor');
    $(document).on('click', '#dvIdPrimaryColorCustomizeGraphic', function() {
        if ($('#dvIdColorBoxCustomizeGraphicPrimary').is(':visible')) {
            $('#dvIdColorBoxCustomizeGraphicPrimary').hide();
        } else {
            $("#dvIdColorBoxCustomizeGraphicPrimary").css({left: '', top: ''});
            var colors = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor);
            var colorizeId1 = GlobalInstance.getUniformConfigurationInstance().getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId1);
            var colorizeId2 = GlobalInstance.getUniformConfigurationInstance().getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId2);
            var colorizeId3 = GlobalInstance.getUniformConfigurationInstance().getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId3);
            if (colors != null && Utility.getObjectlength(colors,'gjs308')) {
                if(colorizeId1 == CONFIG.get('COLORIZEID_COLOR_1') && colorizeId1){
                    colors = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor);
                }else if(colorizeId2 == CONFIG.get('COLORIZEID_COLOR_2') && colorizeId2){
                    colors = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
                }else if(colorizeId3 == CONFIG.get('COLORIZEID_COLOR_3') && colorizeId3){
                    colors = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor);
                }
                if (colors) {
                    var colorid = colors.colorid || colors.ColorId;
                    $('#dvIdColorBoxCustomizeGraphicPrimary ul li.colorItems').removeClass('active');
                    $("#dvIdColorBoxCustomizeGraphicPrimary ul li#colorid_" + colorid).addClass('active');
                }
            }
            setTimeout(function() {
                $('#dvIdColorBoxCustomizeGraphicPrimary').show();
            }, 10);
        }
        return false;
    });

    //Handle the click event on the Indivisual Color in Primary ColorBox
    $(document).on('click', '#dvIdColorBoxCustomizeGraphicPrimary ul li ,#dvIdGraphicPrimaryCustomColor ul li', function () {
        $('#dvIdColorBoxCustomizeGraphicPrimary ul li.colorItems').removeClass('active');
        $(this).addClass('active');
        var clickedLi = $(this).children();
        var colors = {};
        GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
        if (clickedLi.first().attr('colorid') != 0) {
            colors.background = clickedLi.first().attr('style');
            colors.colorName = clickedLi.first().attr('alt');
            colors.colorid = clickedLi.first().attr('colorid');
            if (thisObject.colorizedId1 == CONFIG.get('COLORIZEID_COLOR_1')) {
                thisObject.colorObject.primary = colors;
                GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor, colors);
            } else if (thisObject.colorizedId2 == CONFIG.get('COLORIZEID_COLOR_2')) {
                thisObject.colorObject.secondary = colors;
                GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, colors);
            } else if (thisObject.colorizedId3 == CONFIG.get('COLORIZEID_COLOR_3')) {
                thisObject.colorObject.accent = colors;
                GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, colors);
            }
            GlobalInstance.colorRetainInstance.setModifiedColors(true,false,false,colors);// Update the primary color in the application that has primary color support
            $('#dvIdSelectedPrimaryColorCustomizeGraphic').attr({
                'alt': clickedLi.first().attr('alt'),
                'style': clickedLi.first().attr('style'),
                'colorid': clickedLi.first().attr('colorid')
            });
            thisObject.previewSelectedGraphic(null);
        }
    });
    //Secondary Color Combo Box Binding
    $(document).off('click', '#dvIdColorBoxCustomizeGraphicSecondary ul li ,#dvIdSecondaryColorCustomizeGraphic,#dvIdGraphicSecondaryCustomColor');
    $(document).on('click', '#dvIdSecondaryColorCustomizeGraphic', function() {
        if ($('#dvIdColorBoxCustomizeGraphicSecondary').css('display') != 'none') {
            $('#dvIdColorBoxCustomizeGraphicSecondary').hide();
        } else {
            $("#dvIdColorBoxCustomizeGraphicSecondary").css({left: '', top: ''});
            var colors = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
            if (colors != null && Utility.getObjectlength(colors,'gjs347')) {
                var colorizeId2 = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId2);
                var colorizeId3 = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId3);
                if(colorizeId2 == CONFIG.get('COLORIZEID_COLOR_2') && colorizeId2){
                    colors =GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
                }else if (colorizeId3 && colorizeId3 == CONFIG.get('COLORIZEID_COLOR_3')){
                    colors =GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor);
                }
                var colorid = colors.colorid || colors.ColorId;
                $('#dvIdColorBoxCustomizeGraphicSecondary ul li.colorItems').removeClass('active');
                $("#dvIdColorBoxCustomizeGraphicSecondary ul li#colorid_" + colorid).addClass('active');
            }
            setTimeout(function() {
                $('#dvIdColorBoxCustomizeGraphicSecondary').show();
            }, 10);
        }
        return false;
    });

    //Handle the click event on the Indivisual Color in Secondary ColorBox
    $(document).on('click', '#dvIdColorBoxCustomizeGraphicSecondary ul li ,#dvIdGraphicSecondaryCustomColor ul li', function (e) {
        $('#dvIdColorBoxCustomizeGraphicSecondary ul li').removeClass('active');
        $(this).addClass('active');
        var clickedLi = $(this).children();
        var colors = {};
        colors.background = clickedLi.first().attr('style');
        colors.colorName = clickedLi.first().attr('alt');
        colors.colorid = (clickedLi.first().attr('colorid') != 0) ? clickedLi.first().attr('colorid') : null;
        GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
        if (e.target.id == "colorid_0") {
            $("#dvIdSelectedSecondaryColorCustomizeGraphic").addClass("slashImage color_box_selected");
        }
        //GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, colors);
        var secondaryColorObject = GlobalInstance.getUniformConfigurationInstance().getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
        if (thisObject.colorizedId2 == CONFIG.get('COLORIZEID_COLOR_2') && (!secondaryColorObject || secondaryColorObject)) {
            thisObject.colorObject.secondary = colors;
            GlobalInstance.getUniformConfigurationInstance().setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, colors);
        } else if (thisObject.colorizedId3 == CONFIG.get('COLORIZEID_COLOR_3')) {
            thisObject.colorObject.accent = colors;
            GlobalInstance.getUniformConfigurationInstance().setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, colors);
        }
        if (clickedLi.first().attr('colorid') != 0) {
            $("#dvIdSelectedSecondaryColorCustomizeGraphic").removeClass('slashImage');
        }
        GlobalInstance.colorRetainInstance.setModifiedColors(false,true,false,colors);// Update the secondary color in the application that has secondary color support
        $('#dvIdSelectedSecondaryColorCustomizeGraphic').attr({
            'alt': clickedLi.first().attr('alt'),
            'style': clickedLi.first().attr('style'),
            'colorid': clickedLi.first().attr('colorid')
        });
        thisObject.previewSelectedGraphic(null);
    });
    //Accent Color Combo Box Binding
    $(document).off('click', '#dvIdColorBoxCustomizeGraphicAccent ul li ,#dvIdAccentColorCustomizeGraphic,#dvIdGraphicAccentCustomColor');
    $(document).on('click', '#dvIdAccentColorCustomizeGraphic', function() {
        if ($('#dvIdColorBoxCustomizeGraphicAccent').is(':visible')) {
            $('#dvIdColorBoxCustomizeGraphicAccent').hide();
        } else {
            $("#dvIdColorBoxCustomizeGraphicAccent").css({left: '', top: ''});
            var colors = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor);
            if (colors != null && Utility.getObjectlength(colors,'gjs389')) {
                var colorid = colors.colorid || colors.ColorId;
                $('#dvIdColorBoxCustomizeGraphicAccent ul li.colorItems').removeClass('active');
                $("#dvIdColorBoxCustomizeGraphicAccent ul li#colorid_" + colorid).addClass('active');
            }
            setTimeout(function() {
                $('#dvIdColorBoxCustomizeGraphicAccent').show();
            }, 10);
        }
        return false;
    });

    //Handle the click event on the Indivisual Color in Secondary ColorBox
    $(document).on('click', '#dvIdColorBoxCustomizeGraphicAccent ul li , #dvIdGraphicAccentCustomColor ul li', function (e) {
        $('#dvIdColorBoxCustomizeGraphicAccent ul li').removeClass('active');
        $(this).addClass('active');
        var clickedLi = $(this).children();
        var colors = {};
        colors.background = clickedLi.first().attr('style');
        colors.colorName = clickedLi.first().attr('alt');
        colors.colorid = (clickedLi.first().attr('colorid') != 0) ? clickedLi.first().attr('colorid') : null;
        GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
        if (e.target.id == "colorid_0") {
            $("#dvIdSelectedAccentColorCustomizeGraphic").addClass("slashImage color_box_selected");
        }

        thisObject.colorObject.accent = colors;
        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, colors);
        if (clickedLi.first().attr('colorid') != 0) {
            $("#dvIdSelectedAccentColorCustomizeGraphic").removeClass('slashImage');
        }
        GlobalInstance.colorRetainInstance.setModifiedColors(false,false,true,colors);// Update the accent color in the application that has accent color support
        $('#dvIdSelectedAccentColorCustomizeGraphic').attr({
            'alt': clickedLi.first().attr('alt'),
            'style': clickedLi.first().attr('style'),
            'colorid': clickedLi.first().attr('colorid')
        });
        thisObject.previewSelectedGraphic(null);
    });

    //Handle the dragging functionality
    $('#dvIdColorBoxCustomizeGraphicPrimary').draggable({
        containment: '#dvConfiguratorPanel'
    });
    $('#dvIdColorBoxCustomizeGraphicSecondary').draggable({
        containment: '#dvConfiguratorPanel'
    });
    $('#dvIdColorBoxCustomizeGraphicAccent').draggable({
        containment: '#dvConfiguratorPanel'
    });
};

/**
 * This method shows the customized graphic screen
 * @return void
 */
Graphics.prototype.showCustomizedGraphicScreen = function() {
    if (Utility.getObjectlength(this.selectedGraphic,'gjs441') > 0) {
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var savedGraphic = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl);
        if (savedGraphic) {
            setTimeout(function() {
                var url = savedGraphic.src ? savedGraphic.src.replace('scale=height[50]', 'scale=height[120]') : '';
                $('#imgIdPreviewGraphic').attr('src', url);
            }, 100)
        } else {
            var url = this.selectedGraphic.src ? this.selectedGraphic.src.replace('scale=height[50]', 'scale=height[120]') : '';
            $('#imgIdPreviewGraphic').attr('src', url);
        }
        this.showCustomizeGraphics();
    } else {
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = null;
        GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_GRAPHIC_VALIDATION'), MESSAGES.get('MESSAGE_GRAPHIC_VALIDATION'));
    }
};

/**
 * This method is responsible for creating the graphic list.
 * @param  response - response that comes from the API GetGraphicCategoryList
 * @param  params - extra parameter that should be needed for this method 
 * @return void
 */
Graphics.prototype.createGraphicsCategoryList = function(response, params) {
    var thisObject = this;
    try {
        if (this.objUtility.validateResponseFormat(response, this.categoryRequestUrl)) {
            thisObject.graphicsCategoryList = response.ResponseData;
            $.each(thisObject.graphicsCategoryList, function(i, category) {
                thisObject.categoryList['_' + category.GraphicCategoryId] = category;

                $.each(category.GraphicTypes, function(j, subCategory) {
                    subCategory.categoryId = category.GraphicCategoryId;
                    thisObject.subCatagory['_' + subCategory.GraphicTypeId] = subCategory;
                });
            });
            this.setHtmlAndBindGraphics(this);
        } else {
            window.console && console.debug("Error in API");
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description graphics 486: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            window.console && console.debug(txt);
        }
    }
};


/**
 * This method is responsible for creating graphiclist from the response
 * that comes from the API
 * @param  subCategoryId - Id of the selected SubCategory
 * @param  response - It comes from the API GetGraphicList
 * @return void
 */
Graphics.prototype.createGraphicsList = function(subCategoryId, response) {
    var thisObject = this;
    try {
        if (this.objUtility.validateResponseFormat(response, this.graphicRequestUrl)) {
            thisObject.subCategoryGraphicsList["_" + subCategoryId] = response.ResponseData;
            $.each(response.ResponseData, function(i, graphic) {
                thisObject.graphicList['_' + graphic.Id] = graphic;
            })
            thisObject.showDesign(subCategoryId);
        } else {
            window.console && console.debug("Error in API");
        }
    }
    catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description graphics 517: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};


/**
 * This method is responsible for creating dynamic html based on response that comes from the API.
 * @return void
 */
Graphics.prototype.setHtmlAndBindGraphics = function() {
    var thisObject = this;
    var divCategoryList = 'dvCategoryId';
    var categoryHtml = ''
    categoryHtml += '<div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div> <div class="viewport"> <div  class="menuList positionRrelative overview" id="dvCategoryId">'
    $.each(this.graphicsCategoryList, function(i, catagoryData) {
        categoryHtml += '<p class="menuHead" id="liCategory_' + catagoryData.GraphicCategoryId + '" name=' + catagoryData.Name + '>'
        categoryHtml += catagoryData.Name
        categoryHtml += '</p>'
        categoryHtml += '<div  class="menuBody positionRrelative" id="dvIdSubCategoryList_Cat_' + catagoryData.GraphicCategoryId + '">'
        $.each(catagoryData.GraphicTypes, function(j, subCategory) {
            categoryHtml += '<a id="liSubCat_' + catagoryData.GraphicCategoryId + '_' + subCategory.GraphicTypeId + '" text="-"' + subCategory.Name + '>'
            categoryHtml += subCategory.Name
            categoryHtml += '</a>'
        });
        categoryHtml += '</div>'
    });
    categoryHtml += '</div></div>'

    //Show Category and SubCategory list
    $('#' + this.dvGraphicCategoriesId).html(categoryHtml).show().scrollTop(0);
    $('.graphicsSearchList').css('overflow-y', 'hidden'); // Initially hides the Scrollbar in the Graphic section
    //Check that if any selected graphic info is saved or not in Uniformconfiguration.js
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var selectedGraphicObject = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo();
    if (Utility.getObjectlength(selectedGraphicObject, 'gjs555') > 0) {
        if (selectedGraphicObject.CustomizeGraphicPrimaryColor) {
            this.colorObject.primary = selectedGraphicObject.CustomizeGraphicPrimaryColor;
        }
        if (selectedGraphicObject.CustomizeGraphicSecondaryColor) {
            this.colorObject.secondary = selectedGraphicObject.CustomizeGraphicSecondaryColor;
        }
        if (selectedGraphicObject.CustomizeGraphicAccentColor) {
            this.colorObject.accent = selectedGraphicObject.CustomizeGraphicAccentColor;
        }
        if (selectedGraphicObject.GraphicCategory) {
            var categoryId = selectedGraphicObject.GraphicCategory.GraphicCategoryId;
            var subCategoryid = selectedGraphicObject.GraphicSubCategory.GraphicTypeId;
            $('#dvIdSubCategoryList_Cat_' + categoryId).show(function() {
                thisObject.selectedSubCategory = '#liSubCat_' + categoryId + '_' + subCategoryid;
                $('#liSubCat_' + categoryId + '_' + subCategoryid).addClass('active');
                thisObject.getGraphicsByCategory(subCategoryid);
            });
        }
    }


    var dvSubCat = null;
    var previousSelectedSubCat = null;
    //Handle click event on Catagory 
    $("#" + divCategoryList + " p").on('click', function() {
        //Hides the previously displayed subCategory list
        /*if (dvSubCat) {
            if (dvSubCat !== $(this).next()) {
                dvSubCat.hide();
            }
        }
        dvSubCat = $(this).next();*/
        var selectedCategory = $(this).attr('id');
        thisObject.resetSelectedGraphicInfo();//This method reset the graphic object present in the Uniformconfiguration.js
        thisObject.saveSelectedGraphicInfo(selectedCategory, null, null);
        dvSubCat = $(this).next();
        if (dvSubCat.is(':visible')) {
            dvSubCat.hide();
            $('.menuBody a').removeClass('active');
            thisObject.hideDesigns();
            $(this).removeClass('active');
        } else {
            dvSubCat.show();
            $(this).addClass('active');
        }
        thisObject.scrollBarObject.tinyscrollbar_update('relative');
    });

    //Handle click event of Subcatagory
    $("#" + divCategoryList + " div a").on('click', function() {
        $('.menuBody a').removeClass('active');
        $('.graphicsSearchList ul li').removeClass('active');
        $(this).addClass('active');
        thisObject.selectedGraphic = null;//Reset the selected graphic
        thisObject.resetSelectedGraphicInfo();//This method reset the graphic object present in the Uniformconfiguration.js
        //Hoslds the selected SUbCategory 
        var subCategoryId = $(this).attr('id'); // Get the subCategoryId without prefix
        thisObject.selectedSubCategory = subCategoryId;
        thisObject.saveSelectedGraphicInfo(null, subCategoryId, null);
        subCategoryId = thisObject.getSubCategoryId($(this).attr('id'));
        var designObject = thisObject.getGraphicListBySubCatId(subCategoryId);//Get the designObject for the selected SubCategory
        if (designObject !== undefined) {
            if (designObject !== null && Utility.getObjectlength(designObject,'gjs607') > 0) {
                previousSelectedSubCat = subCategoryId
                $('#' + thisObject.dvGraphicDesignId).html(thisObject.selectedGraphicList[subCategoryId]).show().scrollTop(0);
            } else {
                GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_GRAPHIC_EMPTY'), MESSAGES.get('MESSAGE_GRAPHIC_EMPTY'));
                //Shows the previously selected category and Sincategory's graphics
                GlobalInstance.dialogBoxInstance.funcCallBack = false;
                var subCatId = thisObject.getSubCategoryId(thisObject.selectedSubCategory);
                var catId = thisObject.getCategoryIdBySubCatId(subCatId);
                $('.graphicsSearchList ul li').removeClass('active');
                $('#dvIdSubCategoryList_Cat_' + catId).show();
                $('#liSubCat_' + catId + '_' + subCatId).addClass('active');
                $('#' + thisObject.dvGraphicDesignId).html('').show().scrollTop(0);
            }
        } else {
            thisObject.getGraphicsByCategory(subCategoryId);
        }
    });
};

/**
 * This method is responsible for displaying graphic designs based on the selected
 * catagoryId and SubCatagoryId.
 * @param  subCatagoryId -Id of the selected SubCategory
 * @return void
 */
Graphics.prototype.showDesign = function(subCategoryId) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var designObject = JSON.parse(JSON.stringify(this.getGraphicListBySubCatId(subCategoryId)));
    if (Utility.getObjectlength(designObject,'gjs637') === 0) {
        $('#' + this.dvGraphicDesignId).html('').show().scrollTop(0);
        this.selectedGraphicList[subCategoryId] = null;
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = null;
        GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_GRAPHIC_EMPTY'), MESSAGES.get('MESSAGE_GRAPHIC_EMPTY'));
        return;
    }

    var designHtml = '<div class="scrollbar" style="margin-left:245px;"><div class="track"><div class="thumb"><div class="end"></div></div></div></div> <div class="viewport" style="margin-left:20px; width:225px; "><div  class="overview"><ul>'
    $.each(designObject, function(i, designData) {

        designHtml += '<li id= "liGraphic_' + subCategoryId + '_' + designData.Id + '" >'
        designHtml += '<img alt="' + designData.Nm + '" id="liGraphic_' + subCategoryId + '_' + designData.Id + '" designid="' + designData.Id + '" src=' + LiquidPixels.getGraphicUrl(designData, designData.Nm, null, Utility.getGraphicLayerCount(designData.Lys), designData.Lys) + ' Title=' + designData.Nm + '>'
        designHtml += '</img>'
        designHtml += '</li>'

    });
    designHtml += '</ul>'
    designHtml += '</div></div>'
    //Show Designs based on Category and SinCategory
    $('#' + this.dvGraphicDesignId).html(designHtml).show().scrollTop(0);
    this.selectedGraphicList[subCategoryId] = designHtml;

    //Check that if any graphic is stored in Uniformconfigurator.js
    var selectedGraphicObject = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign);
    if (Utility.getObjectlength(selectedGraphicObject,'gjs663') > 0) {
        var graphicId = selectedGraphicObject.Id;
        this.selectedGraphic = {
            GraphicId: graphicId,
            src: LiquidPixels.getGraphicUrl(selectedGraphicObject, selectedGraphicObject.Nm, null, Utility.getGraphicLayerCount(selectedGraphicObject.Lys), selectedGraphicObject.Lys)
        };
        var saveCustomizeGraphicUrl = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl);
        $('#liGraphic' + '_' + subCategoryId + '_' + graphicId).addClass('active');
        if (saveCustomizeGraphicUrl) {
            this.selectedGraphic = {
                GraphicId: graphicId,
                src: saveCustomizeGraphicUrl.src
            };
        }

        this.showHideColorOption(Utility.getGraphicLayerCount(selectedGraphicObject.Lys));
    }

    this.graphicListScrollObject = $('#' + this.dvGraphicDesignId).tinyscrollbar();
};

/**
 * This method is responsible for clearing the graphic list if no Category is opened.
 * @return void
 */
Graphics.prototype.hideDesigns = function() {
    $('#' + this.dvGraphicDesignId).hide();
};

/**
 * This method is responsible for retrieving selected category info
 * @param  key - Id of the Category
 * @return selected Category Object
 */
Graphics.prototype.getSelectedCategoryByCatId = function(key) {
    return this.categoryList['_' + key];
};

/**
 * This method is responsible for retrieving selected SubCategory from UniformConfigurator.js
 * @param  key - id of subcategory
 * @return selected SubCatagory Object
 */
Graphics.prototype.getSelectedSubCatagoryBySubCatId = function(key) {
    return this.subCatagory['_' + key];
};

/**
 * This function is responsible for returning the graphic obbject.
 * @param  key - Graphic Id
 * @returns selecteed graphic object
 */
Graphics.prototype.getSelectedGraphicByGraphicId = function(key) {
    return this.graphicList['_' + key];
};

/**
 * This method is responsible for retrieving selected Graphic info from Uniformconfigurator.js
 * @param  key - Id of the SubCategory
 * @return selected Graphic object
 */
Graphics.prototype.getGraphicListBySubCatId = function(key) {
    return this.subCategoryGraphicsList["_" + key];
};

/**
 * This method is responsible for returning SubCategory Id for the selected Graphic without prefix
 * @param  graphicId - Id of the selected Graphic
 * @return subCategoryId - Id of the subCategory for the respective Graphic 
 */
Graphics.prototype.getGraphicSubCategoryId = function(graphicId) {
    var startIndex = graphicId.indexOf('_');
    var lastIndex = graphicId.lastIndexOf('_');
    var subCategoryId = graphicId.substring(startIndex + 1, lastIndex);
    return subCategoryId;
};

/**
 * This method is responsible for returning Category Id for the selected Graphic without prefix
 * @param  graphicId - Id of the selected Graphic
 * @return categoryId - Id of the Category for the respective Graphic
 */
Graphics.prototype.getGraphicCategoryIdByGraphicId = function(graphicId) {
    var startIndex = graphicId.indexOf('_');
    var lastIndex = graphicId.lastIndexOf('_');
    var subCategoryId = graphicId.substring(startIndex + 1, lastIndex);
    var categoryId = this.subCatagory['_' + subCategoryId].categoryId;
    return categoryId;
};

/**
 * This method is responsible for returning subCategoryId without prefix
 * @param  subCategory - Id of the selected SubCategory
 * @return subCategoryId - Id of the SubCategory without prefix
 */
Graphics.prototype.getSubCategoryId = function(subCategory) {
    var lastIndex = subCategory.lastIndexOf('_');
    var subCategoryId = subCategory.substring(lastIndex + 1);
    return subCategoryId;
};

/**
 * This method returns the graphic id value without prefix
 * @param  graphicId - Id of the selected graphic
 * @return graphicid - Id of the graphic without prefix
 */
Graphics.prototype.getGraphicid = function(graphicId) {
    var lastIndex = graphicId.lastIndexOf('_');
    graphicId = graphicId.substring(lastIndex + 1);
    return graphicId;
};

/**
 * This method is responsible for returning categoryId of the subCategoryId without prefix
 * @param  subCategoryId - Id of the selected SubCategory
 * @return categoryId - Id of the Category for the selected SubCategory
 */
Graphics.prototype.getCategoryIdBySubCatId = function(subCategoryId) {
    var startIndex = subCategoryId.indexOf('_');
    var lastIndex = subCategoryId.lastIndexOf('_');
    var categoryId = subCategoryId.substring(startIndex + 1, lastIndex);
    return categoryId;
};
/**
 * This method is responsible for returning CategoryId without prefix.
 * @param  categoryId - Currently Selected Category
 * @returns categoryId - Without Prefix
 */
Graphics.prototype.getCategoryId = function(categoryId) {
    var categoryId = categoryId.substring(categoryId.indexOf('_') + 1);
    return categoryId;
}

/**
 * This method is responsible for storing currently selected Category,SubCategory and Graphic in Uniformconfiguration.js
 * @param  selectedGraphicId - Id of the selected Graphic
 * @return void
 */
Graphics.prototype.saveSelectedGraphicInfo = function(selectedCategoryId, selectedSubCatId, selectedGraphicId) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var categoryId = null;
    var selectedCategoryInfo = null;
    var subCategoryId = null;
    var selectedSubCategoryInfo = null;
    var selectedGraphicInfo = null;
    var graphicId = null;
    if (selectedCategoryId) {
        //Save the selected Category in the Uniformconfiguration.js
        categoryId = this.getCategoryId(selectedCategoryId);
        selectedCategoryInfo = this.getSelectedCategoryByCatId(categoryId);
        delete selectedCategoryInfo.GraphicTypes;
        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.GraphicCategory, selectedCategoryInfo);
    } else if (selectedSubCatId) {
        //Save the selected Category in the Uniformconfiguration.js
        categoryId = this.getCategoryIdBySubCatId(selectedSubCatId);//This method is responsible for returning categoryId without prefix
        selectedCategoryInfo = this.getSelectedCategoryByCatId(categoryId);
        delete selectedCategoryInfo.GraphicTypes;
        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.GraphicCategory, selectedCategoryInfo);
        //Save the selected subcCtegory in the Uniformconfiguration.js
        subCategoryId = this.getSubCategoryId(selectedSubCatId);//Get the SubCategoryId without prefix
        selectedSubCategoryInfo = this.getSelectedSubCatagoryBySubCatId(subCategoryId);
        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.GraphicSubCategory, selectedSubCategoryInfo);
    } else if (selectedGraphicId) {
        //Save the selected Category in the Uniformconfiguration.js
        categoryId = this.getCategoryIdBySubCatId(this.selectedSubCategory);//This method is responsible for returning categoryId without prefix
        selectedCategoryInfo = this.getSelectedCategoryByCatId(categoryId);
        delete selectedCategoryInfo.GraphicTypes;
        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.GraphicCategory, selectedCategoryInfo);
        //Save the selected subcCtegory in the Uniformconfiguration.js
        subCategoryId = this.getGraphicSubCategoryId(selectedGraphicId);//Get the SubCategoryId without prefix
        selectedSubCategoryInfo = this.getSelectedSubCatagoryBySubCatId(subCategoryId);
 
     
        //Set the last selected graphic info in the uniform config
        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.GraphicSubCategory, selectedSubCategoryInfo);
        //Save the selected graphic in the Uniformconfiguration.js
        graphicId = this.getGraphicid(selectedGraphicId);
        selectedGraphicInfo = this.getSelectedGraphicByGraphicId(graphicId);
        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign, selectedGraphicInfo);
 
        //Keep the all selected graphic info in the uniform config
        this.setClickedGraphicsInfo(selectedGraphicInfo);
 
       //Save Colorized data that is supported by the selected graphic
        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.ColorizeId1, this.colorizedId1);
        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.ColorizeId2, this.colorizedId2);
        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.ColorizeId3, this.colorizedId3);
    }
};

/**
 * This method is responsible for Clearing graphic object present in the Uniformconfiguration.js
 * @return void
 */
Graphics.prototype.resetSelectedGraphicInfo = function() {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    GlobalInstance.uniformConfigurationInstance.graphicInfo = new Object();
}

/**
 * This method is responsible for displaying Selected Graphic in Customize Graphic Screen
 * @return void
 */
Graphics.prototype.previewSelectedGraphic = function(color) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var colorObject = {};

    if (Utility.getObjectlength(color,'gjs859') > 0) {
        if (color.primary) {
            GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor, color.primary);
            colorObject.primary = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor);
        }
        if (color.secondary) {
            GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, color.secondary);
            colorObject.secondary = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
        }
        if (color.accent) {
            GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, color.accent);
            colorObject.accent = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor);
        }
    }

    if (GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor)) {
        colorObject.primary = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor);
    }
    if (GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor)) {
        colorObject.secondary = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
    }
    if (GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor)) {
        colorObject.accent = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor);
    }

    var imgUrl = {}

    var graphicObject = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign);
    if (graphicObject) {
        imgUrl.graphicId = graphicObject.Id;
        $.startProcess(true);
        var graphicImage = new Image();
        graphicImage.onload = function() {
            $.doneProcess();
        }
        graphicImage.onerror = function() {
            $.doneProcess();
        };
        var url = LiquidPixels.getGraphicUrl(graphicObject, graphicObject.Nm, colorObject, Utility.getGraphicLayerCount(graphicObject.Lys), graphicObject.Lys);
        graphicImage.src = url.replace('scale=height[50]', 'scale=height[120]');
        imgUrl.src = url;
        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl, imgUrl);
        $('#imgIdPreviewGraphic').css('visibility', 'hidden');
        $('#imgIdPreviewGraphic').attr("src", "");
        Utility.loadImage('imgIdPreviewGraphic', graphicImage.src, function (elementId) {
                GlobalFlags.setScreenFlags('imgIdPreviewGraphic', true);
            }, null);
        
        //imgUrl.src = graphicImage.src;
        /*$('#imgIdPreviewGraphic').attr('src','');
        setTimeout(function() {
            $('#imgIdPreviewGraphic').attr('src', graphicImage.src);
            return false;
        }, 500);*/
    }
};

/**
 * This method is responsible for populating color in the Color Boxes present in the Customize Graphics screen.
 * @param  colorList - Response that comes from the API GetColorList
 * @return void
 */
Graphics.prototype.setHtmlAndBindColor = function() {
    var colorList = GlobalInstance.colorInstance.getColorList(null, null, null);
    var thisObject = this;
    var tempColorsListHtml = '';
    var tempCustomColorrHtml=''
    var tempColorsListUnselectHtml = '';
    tempColorsListUnselectHtml += '<li  id= "colorid_0"  style="cursor:pointer; background-image:url(\'images/slash.png\');">\n\
<a  ColorId="0" \n\
rgbHexadecimal="" alt="Optional" class="colorItems in-active" background-image:url(\'../images/slash.png\');\n\
style="background-color:"></a></li>';
    $.each(colorList, function(i, color) {
        if (color.CustomerId != null && color.CustomerId != '' && color.CustomerId != undefined) {
            tempCustomColorrHtml += '<li  TaaColorId="' + color.TaaColorId + '" id="colorid_' + color.ColorId + '" colorid="' + color.ColorId + '" style="background-color:' + color.RgbHexadecimal + ';margin-bottom:0px" class="colorItems in-active" alt="' + color.Name + '"  title="' + color.Name + '"><a ColorId=' + color.ColorId + ' \n\
                            alt="' + color.Name + '" \n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        } else {
            tempColorsListHtml += '<li  TaaColorId="' + color.TaaColorId + '" id="colorid_' + color.ColorId + '" colorid="' + color.ColorId + '" style="background-color:' + color.RgbHexadecimal + ' ;margin-bottom:0px" class="colorItems in-active" alt="' + color.Name + '"  title="' + color.Name + '"><a ColorId=' + color.ColorId + ' \n\
                            alt="' + color.Name + '" \n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        }

        if (thisObject.defaultColor === null) {
            thisObject.defaultColor = color;
        }
    });
    $('#ulColorComboBoxlistCustomizeGraphicPrimary').html(tempColorsListHtml);
    $('#ulColorComboBoxlistCustomizeGraphicSecondary').html(tempColorsListUnselectHtml + tempColorsListHtml);
    $('#ulColorComboBoxlistCustomizeGraphicAccent').html(tempColorsListUnselectHtml + tempColorsListHtml);

    //Custom Color Case
    var customerId = GlobalInstance.uniformConfigurationInstance.getAccountNumber();
    if (customerId !== 0 && customerId !== undefined) {
        $('#ulIdGraphicPrimaryColor').html(tempCustomColorrHtml);
        $('#ulIdGraphicSecondaryColor').html(tempCustomColorrHtml);
        $('#ulIdGraphicAccentColor').html(tempCustomColorrHtml);
    }
};

/**
 * This method displays number of color options that is supported by the Graphic
 * @param  layerCount - Number of Color option
 * @returns void
 */
Graphics.prototype.showHideColorOption = function(layerCount) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.GraphicLayerCount, layerCount);
    
    var colorObject = {};

    if (colorObject.primary) {
        $('#dvIdSelectedPrimaryColorCustomizeGraphic').css('background-color', colorObject.primary.background);
    } else if (colorObject.secondary) {
        $('#dvIdSelectedSecondaryColorCustomizeGraphic').css('background-color', colorObject.secondary.background);
    } else if (colorObject.accent) {
        $('#dvIdSelectedAccentColorCustomizeGraphic').css('background-color', colorObject.accent.background);
    } else {
        $('#dvIdSelectedPrimaryColorCustomizeGraphic').css('background-color', this.defaultColor.RgbHexadecimal);
    }

    if (!layerCount) {
        layerCount = 1;
    }

    switch (layerCount) {
        case 1:
            $('#dvIdShowColorCustomizeGraphicSecondary').hide();
            $('#dvIdShowColorCustomizeGraphicAccent').hide();
            $('#dvIdShowColorCustomizeGraphicPrimary').show();
            this.setDefaultUniformColor();
            break;
        case 2:
            $('#dvIdShowColorCustomizeGraphicAccent').hide();
            $('#dvIdShowColorCustomizeGraphicSecondary').show();
            $('#dvIdShowColorCustomizeGraphicPrimary').show();
            this.setDefaultUniformColor();

            break;
        case 3:
            $('#dvIdShowColorCustomizeGraphicPrimary').show();
            $('#dvIdShowColorCustomizeGraphicSecondary').show();
            $('#dvIdShowColorCustomizeGraphicAccent').show();
            this.setDefaultUniformColor();
            break;
        case (layerCount > 3):
            $('#dvIdShowColorCustomizeGraphicPrimary').show();
            $('#dvIdShowColorCustomizeGraphicSecondary').show();
            $('#dvIdShowColorCustomizeGraphicAccent').show();
            this.setDefaultUniformColor();
            break;
    }
};
/**
 *This method sets the default uniform color 
 * @returns void
 */
Graphics.prototype.setDefaultUniformColor = function() {
    var globalUniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var currentStyle = globalUniformConfigurationInstance.getStylesInfo();
    var styleFabrics = GlobalInstance.getFabricInstance().getFabricByStyleId(currentStyle.StyleId);
    var fabricLength = Utility.getObjectlength(styleFabrics,'gjs997');
    var colorObject = globalUniformConfigurationInstance.getColorsInfo();
    if (!(fabricLength > 1 && (globalUniformConfigurationInstance.getFabricClicked() || globalUniformConfigurationInstance.getCustomizeTabClicked()))
            && Utility.getObjectlength(colorObject.uniformSecondaryColor,'gjs1000') < 1 && Utility.getObjectlength(colorObject.uniformTertiaryColor) < 1) {
        $('.uniformColorBoxSecondary').css('background', '#000000')
        $('.uniformColorBoxTertiary').css('background', '#000000')
    }
};

/*
* This method set the clicked graphics info in the Uniform config
*/
Graphics.prototype.setClickedGraphicsInfo = function (graphicObject) {
    try {
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var isGraphicIdExist = false;;
        //First check that clicked graphic exist in the uniform Object or not
        if (Utility.getObjectlength(GlobalInstance.uniformConfigurationInstance.clickedGraphicInfo) <= 0) {
            GlobalInstance.uniformConfigurationInstance.setClickedGraphicsInfo(graphicObject.Id, graphicObject);
        } else {
            //Check that clicked graphic info exists in the uniform graphic object or not
            for (var key in GlobalInstance.uniformConfigurationInstance.clickedGraphicInfo) {
                var gData = GlobalInstance.uniformConfigurationInstance.clickedGraphicInfo[key];
                if (gData.Id == graphicObject.Id) {
                    isGraphicIdExist = true;
                    break;
                }
            }
 
            if (!isGraphicIdExist) {
                GlobalInstance.uniformConfigurationInstance.setClickedGraphicsInfo(graphicObject.Id, graphicObject);
            }
        }
 
    } catch (err) {
        Log.trace('Error caught in the setClickedGraphicsInfo method ------' + err.message);
    }
};