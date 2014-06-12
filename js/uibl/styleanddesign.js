/**
 * TWA proshpere configurator
 * 
 * styleanddesign.js is used to define sport related functions. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 *
 * @return void
 */

function StyleAndDesign() {
    this.styles = new Object();
    this.youthStyles = new Object();
    this.requestUrl = WEB_SERVICE_URL.get('CUT_STYLE', LOCAL);
    this.designRequestUrl = WEB_SERVICE_URL.get('GET_YOUTH_DESIGN_SIZES', LOCAL);
    this.getStyleListFunctionCallback = null;
    this.youthStyleIdArray = new Array();
    this.responseType = 'json';
    this.objCommHelper = new CommunicationHelper();
    this.objUtility = new Utility();
    this.divClassCut = 'styleThumbnailBox';
    this.divClassDesign = 'designThumbnailBox';
    this.styleList = new Object();
    this.youthStyleList = new Object();
    this.designList = new Object();
    this.youthDesignList = new Object();
    this.styleDesigns = new Object();
    this.youthStyleDesigns = new Object();
    this.styleBirdEyePreviewList = new Object();
    this.styleAndDesignList = new Object();
    this.youthStyleAndDesignList = new Object();
    this.selectedDesignForProof = null;
    this.styleBirdEyePreviewListCount = 0;
    this.designSetInProgress = true;
    this.isBirdViewSet = false;
    this.styleToCombine = CONFIG.get('STYLE_COMBINE_ID');
    this.styleToShow = CONFIG.get('STYLE_SHOW');
    this.styleToHide = CONFIG.get('STYLE_HIDE');
    this.styleToCombineFemale = CONFIG.get('STYLE_COMBINE_ID_FEMALE');
    this.styleToShowFemale = CONFIG.get('STYLE_SHOW_FEMALE');
    this.styleToHideFemale = CONFIG.get('STYLE_HIDE_FEMALE');
    this.previousSelectedStyle = new Object();
    this.previousSelectedDesign = new Object();
    GlobalInstance.loadConfigurationInstance = GlobalInstance.getLoadConfigurationInstance();
    this.isConfigLoaded = GlobalInstance.loadConfigurationInstance.isLoaded();
    this.loadFromConfigFirstTime = false;
}

/**
 * Fetches the style and designs. 
 * 
 * @return void
 */

StyleAndDesign.prototype.init = function () {
    $('#blanket').show();
    try {
        var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
        var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
        var key = categoryInfo.Id + '_' + genderInfo.Id;
        //on style design page load, show the sports name in shopping cart section
        $('#dvIdSportsNameDisplay').html(categoryInfo.Name.toUpperCase());
        //on style design page load , show the Adult Top Image based on the Sport
        if (categoryInfo.Name == CONFIG.get('WRESTLING_STRING')) {
            $('#dvIdAdultClothTop').children().first().attr('src', 'images/wrestling.png').css("margin-left", "8px");
        }

        if (this.styleAndDesignList[key] == null) {
            var params = {
                'applicationId': GlobalInstance.uniformConfigurationInstance.getApplicationId(),
                'genderTypeId': genderInfo.Id,
                'categoryId': categoryInfo.Id
            };
            this.objCommHelper.callAjax(this.requestUrl, 'GET', params, this.responseType, null, this.createStyleAndDesignList.bind(this), null, null, null, null, null);
        }
        $("#dvIdFabricSelected").hide();
        $("#dvIdFabricSelectedCartbox").css('visibility', 'hidden');
        $(".cartSelectedFabricLabel").hide();
    }
    catch (err) {
        $.doneProcess();
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description sdjs 80: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

StyleAndDesign.prototype.getYouthStyleData = function () {
    try {
        var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
        var youthGenderInfo = GlobalInstance.uniformConfigurationInstance.getYouthGenderInfo();
        var youthKey = categoryInfo.Id + '_' + youthGenderInfo.Id;
        if (this.youthStyleAndDesignList[youthKey] == null) {
            var params = {
                'applicationId': GlobalInstance.uniformConfigurationInstance.getApplicationId(),
                'genderTypeId': youthGenderInfo.Id,
                'categoryId': categoryInfo.Id
            };
            this.objCommHelper.callAjax(this.requestUrl, 'GET', params, this.responseType, null, this.createYouthStyleAndDesignList.bind(this), null, null, null, null, null);
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description sdjs 103: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
}

/**
 * Fills the style and design list into the object after recieving the list from Web Service. After filling the data, it loads the HTML and 
 * binds the click event on style and design
 *
 * @param response Response from Web service in json format containing style and design list
 * @param params
 * 
 * @return void
 */
StyleAndDesign.prototype.createStyleAndDesignList = function (response, params) {
    try {
        var thisObject = this;
        if (this.objUtility.validateResponseFormat(response, this.requestUrl)) {
            var key = GlobalConfigurationData.categoryId + "_" + GlobalConfigurationData.genderId; //gender sports specific key
            this.styles = response.ResponseData;
            this.styleAndDesignList[key] = this.styles;
            $.each(this.styles, function (i, styles) {
                thisObject.styleList["_" + styles.StyleId] = styles;
                var tempDesignList = {};
                $.each(styles.Designs, function (j, designs) {
                    thisObject.designList[styles.StyleId + "_" + designs.DesignId] = designs;
                    tempDesignList["_" + designs.DesignId] = designs;
                });
                thisObject.styleDesigns["_" + styles.StyleId] = tempDesignList;
                var previewImagesStyle = {};
                $.each(styles.PreviewImages, function (j, previewImageInfo) {
                    previewImagesStyle["_" + previewImageInfo.PreviewImageId] = previewImageInfo;
                });
                thisObject.styleBirdEyePreviewList["_" + styles.StyleId] = previewImagesStyle;
            });

            this.setHtmlAndBind(this.styles);
        } else {
            Log.error("Error in API");
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description sdjs 148: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};
/**
 * Fills the style and design list into the object after recieving the list from Web Service for Youth Gender.
 *
 * @param response Response from Web service in json format containing style and design list
 * @param params
 * 
 * @return void
 */
StyleAndDesign.prototype.createYouthStyleAndDesignList = function (response, params) {
    try {
        var thisObject = this;
        if (this.objUtility.validateResponseFormat(response, this.requestUrl)) {
            var key = GlobalConfigurationData.categoryId + "_" + GlobalConfigurationData.youthGenderId; //gender sports specific key
            this.youthStyles = response.ResponseData;
            this.youthStyleAndDesignList[key] = this.youthStyles;
            $.each(this.youthStyles, function (i, styles) {
                thisObject.youthStyleList["_" + styles.StyleId] = styles;
            });
            thisObject.setDefaultYouthStyleAndDesign();
        } else {
            Log.error("Error in API");
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description sdjs 185: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};
/**
 * Shows the style and design screen
 *
 * @return void
 */
StyleAndDesign.prototype.show = function (boolShowQBNotification, onFinished) {
    var thisObject = this;
    $('#secDefinePanel').waitForImages({
        waitForAll: true,
        finished: function () {
            setTimeout(function () {
                try {
                    //show the panels on loading of all images
                    $.doneProcess();
                    $('#blanket').hide();

                    //hide home screen components
                    $("#secLandingPagePanel").hide();
                    $("#secLandingPageFooterBox").hide();

                    //show configurator screen components
                    $("#secDefinePanel").show();
                    $("#dvConfiguratorPanel").show();
                    $("#secStyleAndDesignPanel").show();


                    //hide configurator customize tab 
                    $("#secCustomizePanel").hide();
                    var selectedStyle = thisObject.getSelectedStyle();
                    var relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID'), function (n, i) {
                        return (n == selectedStyle.StyleId ? i : null);
                    });
                    if (Utility.getObjectlength(relatedStyleId, 'fjs205') <= 0) {
                        relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID_FEMALE'), function (n, i) {
                            return (n == selectedStyle.StyleId ? i : null);
                        });
                    }

                    //For Basketball case - Find the style that should be visible
                    if (Utility.getObjectlength(relatedStyleId, 'fjs205') > 0) {
                        selectedStyle = thisObject.getStyleByKey(relatedStyleId[0]);
                    }

                    var startPageStyle = thisObject.getStyleStartPage(selectedStyle.StyleId);

                    //bind style jcarousel
                    jQuery('#ulStyleList').jcarousel({ start: startPageStyle, itemFallbackDimension: 335 });

                    //reload design carousel
                    var designJcarousel = $('#ulDesignList').data('jcarousel');
                    if (designJcarousel) {
                        try {
                            designJcarousel.reload();
                        } catch (e) {
                        }
                    }

                    if ((objApp.landingPage == null || objApp.landingPage == CONFIG.get('LANDING_PAGE_STYLE_DESIGN')) && boolShowQBNotification) {
                        // Display Notification Popup.
                        var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
                        if (categoryInfo.Name.toUpperCase() == CONFIG.get('NOTIFICATION_POPUP_FOOTBALL_TEXT')) {
                            GlobalInstance.notificationsPopupInstance = GlobalInstance.getNotificationsPopupInstance();
                            GlobalInstance.notificationsPopupInstance.QBNotificationsPopup();
                        }
                    }

                    //trigger the style and design page landing event
                    $(document).trigger("PageLanded", CONFIG.get('LANDING_PAGE_STYLE_DESIGN'));
                } catch (e) {
                }
            }, 10);
        }
    });
};

/**
 * Hides the color screen
 *
 * @return void
 */
StyleAndDesign.prototype.hide = function () {
    $("#secStyleAndDesignPanel").hide();
};

/**
 * Sets the style and design list HTML and binds the click event
 * @param styles
 * 
 * @return void
 */
StyleAndDesign.prototype.setHtmlAndBind = function (styles) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var thisObject = this;
    var selectedCategory = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
    var styleList = $('<ul>');
    var currentFabric = {};
    try {
        var styleCtr = 0;

        var topLiTaG = $('<li/>').attr('class', 'topli');

        var styleThumbnailMainDivTag = $('<div/>')
                .attr('class', "styleThumbnailBox")
                .appendTo(topLiTaG);
        var liTaG = null;
        var divTag = null;
        var matchingTopStyle = null; // works only for basketball category
        var styleTitle = '';
        var isHideMatchingTopStyle = true;
        var hiddenStyleCount = 0;

        $.each(styles, function (i, style) {
            if (style.StyleTypeId !== CONFIG.get("STYLE_ID_BOTTOM")) {
                isHideMatchingTopStyle = true;
                styleTitle = style.StyleName;
                /*********************************************************************************************/
                //The below block hides the matching tops which has same look and feel but different style ids and fabric.
                //Applicable on Basket ball sports
                if (Utility.isExist(thisObject.styleToHide, style.StyleId)) {
                    isHideMatchingTopStyle = false;
                    hiddenStyleCount++;
                } else if (Utility.isExist(thisObject.styleToHideFemale, style.StyleId)) {
                    isHideMatchingTopStyle = false;
                    hiddenStyleCount++;
                }
                /*********************************************************************************************/

                if (isHideMatchingTopStyle) {
                    styleCtr++;
                    liTaG = $('<li/>')
                            .attr({
                                'id': 'liStyle_' + style.StyleId
                            }).appendTo(styleList);
                    divTag = $('<div/>')
                            .attr('class', "styleAndDesignThumbnail")
                            .appendTo(liTaG);
                    var styleName = $('<img/>')
                            .attr(
                            {
                                'StyleId': style.StyleId,
                                "src": LiquidPixels.getStyleUrl(style.StyleNumber),
                                'title': styleTitle,
                                "alt": styleTitle
                            })
                            .addClass("tooltip")
                            .appendTo(divTag);

                    if (styleCtr === CONFIG.get('STYLES_DESIGN_PER_PAGE')) {
                        styleList.appendTo(styleThumbnailMainDivTag);
                        $("#ulStyleList").append(topLiTaG);
                        styleCtr = 0;
                        topLiTaG = null;
                        topLiTaG = $('<li/>').attr('class', 'topli');
                        styleThumbnailMainDivTag = null;
                        styleThumbnailMainDivTag = $('<div/>')
                                .attr('class', "styleThumbnailBox")
                                .appendTo(topLiTaG);
                        styleList = $('<ul>');
                    }
                }
            }
        });
        //if total styles are less than total page per limit then fill only first page
        if (styleCtr > 0 && styleCtr < CONFIG.get('STYLES_DESIGN_PER_PAGE')) {
            styleList.appendTo(styleThumbnailMainDivTag);
            $("#ulStyleList").append(topLiTaG);
            topLiTaG = $('<li/>').attr('class', 'topli');
            styleThumbnailMainDivTag = $('<div/>')
                    .attr('class', "styleThumbnailBox")
                    .appendTo(topLiTaG);
            styleList = $('<ul>');
        }
        var genderInfo = GlobalInstance.getUniformConfigurationInstance().getGenderInfo();
        var adultObject = {};
        adultObject.ID = genderInfo.Id;

        // Set the Gender object for fabric instanc to call the api getGarmentSizes for hidden styles for basketball case
        GlobalInstance.getFabricInstance().genderObject = JSON.parse(JSON.stringify(adultObject));

        //Handle the click event of cut
        $('.' + this.divClassCut + ' ul li div').on('click', function () {
            if (thisObject.designSetInProgress === false) {

                //Keep the Previous Selected Style Info
                thisObject.previousSelectedStyle = GlobalInstance.getUniformConfigurationInstance().getStylesInfo();

                thisObject.designSetInProgress = true;
                var currentstyleId = $(this).children().first().attr('styleid');
                var styleId = thisObject.getStyleToBeUsed(currentstyleId);
                if (styleId == '' || styleId == null) {
                    styleId = currentstyleId;
                }
                var styleInfo = null;
                if (styleId) {
                    styleInfo = JSON.parse(JSON.stringify(thisObject.getStyleByKey(styleId)));
                    if (styleInfo) {
                        delete styleInfo.Designs;// delete design information from style object while storing into uniform conifuration
                        delete styleInfo.Fabrics;// delete fabric information from style object while storing into uniform conifuration
                    }
                }

                var youthStyleInfo = JSON.parse(JSON.stringify(thisObject.getYouthStyleInfoByStyleId(styleId)));

                $("#ulStyleList").find('li').removeClass('active');
                $(this).parent().addClass('active');
                // Call Google Analytics
                GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
                GlobalInstance.googleAnalyticsUtilInstance.trackStyleClicks();
                thisObject.showHideBottomInCart(styleId);

                // delete styleInfo.PreviewImages;// delete preview Image information from style object while storing into uniform conifuration
                if (Utility.getObjectlength(youthStyleInfo, 'sdjs382') > 0) {
                    delete youthStyleInfo.Designs;// delete design information from Youthstyle object while storing into uniform conifuration
                    delete youthStyleInfo.Fabrics;// delete fabric information from Youthstyle object while storing into uniform conifuration
                }


                thisObject.setBottomYouthStyleInfo(styleInfo);
                var copiedStyle = null;
                var copiedStyleYouth = null;

                GlobalInstance.uniformConfigurationInstance.setStylesInfo(styleInfo);
                if (styleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                    copiedStyle = JSON.parse(JSON.stringify(thisObject.getStyleByKey(styleInfo.CopyOfStyleId)));
                    if (copiedStyle) {
                        delete copiedStyle.Fabrics;
                        delete copiedStyle.PreviewImages;
                    }
                }
                GlobalInstance.uniformConfigurationInstance.setCopiedStylesInfo(copiedStyle);

                GlobalInstance.uniformConfigurationInstance.setYouthStylesInfo(youthStyleInfo);
                if (youthStyleInfo) {
                    if (youthStyleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                        copiedStyleYouth = JSON.parse(JSON.stringify(thisObject.getYouthStyleByKey(youthStyleInfo.CopyOfStyleId)));
                        if (copiedStyleYouth) {
                            delete copiedStyleYouth.Fabrics;
                            delete copiedStyleYouth.PreviewImages;
                        }
                    }
                }
                GlobalInstance.uniformConfigurationInstance.setCopiedYouthStylesInfo(copiedStyleYouth);

                //Call the Garment size API for Adult case
                GlobalInstance.getRosterInstance().getGarmentSizes(adultObject, true);

                thisObject.setDesignHtml(thisObject.getSelectedStyle(), false, true);
                //Call Designs for Youth
                thisObject.youthStyleDesigns = new Object();
                thisObject.youthStyleIdArray = new Array();
                thisObject.getDesignsForYouth();
                var styleFabrics = GlobalInstance.fabricInstance.getFabricByStyleId(styleId);
                var fabricLength = Utility.getObjectlength(styleFabrics, 'sdjs417');
                if (fabricLength > 0) {
                    GlobalInstance.fabricInstance = GlobalInstance.getFabricInstance();
                    GlobalInstance.fabricInstance.showFabrics(styleId);

                    thisObject.selectAndSetFabricBox(styleId);
                    /*var currentFabric = GlobalInstance.fabricInstance.getSelectedFabric(styleId);
                    if (GlobalInstance.uniformConfigurationInstance.getFabricIdOnClick() != currentFabric.FabricId) {*/
                    GlobalInstance.fabricInstance.funcCallBack = function () {
                        GlobalInstance.shoppingCartInstance = GlobalInstance.getShoppingCartInstance();
                        GlobalInstance.shoppingCartInstance.rebuildCart();
                    };
                    GlobalInstance.fabricInstance.getFabricPrice();
                    //}
                    if (selectedCategory.Name == CONFIG.get('BASKETBALL_STRING')) {
                        if (Utility.isExist(thisObject.styleToShow, parseInt(styleId, 10))) {
                            matchingTopStyle = thisObject.getMatchingTopStyle(parseInt(styleId, 10));
                            if (matchingTopStyle) {
                                var isHideAllFabrics = false;
                                GlobalInstance.fabricInstance.showFabrics(matchingTopStyle.StyleId, isHideAllFabrics);
                            }
                        } else if (Utility.isExist(thisObject.styleToShowFemale, parseInt(styleId, 10))) {
                            matchingTopStyle = thisObject.getMatchingTopStyle(parseInt(styleId, 10));
                            if (matchingTopStyle) {
                                var isHideAllFabrics = false;
                                GlobalInstance.fabricInstance.showFabrics(matchingTopStyle.StyleId, isHideAllFabrics);
                            }

                        } else if (Utility.isExist(thisObject.styleToHide, parseInt(styleId, 10)) || Utility.isExist(thisObject.styleToHideFemale, parseInt(styleId, 10))) {
                            //Reverse mapping of style
                            matchingTopStyle = thisObject.getMatchingTopStyle(parseInt(styleId, 10),true);
                            var isHideAllFabrics = false;
                            GlobalInstance.fabricInstance.showFabrics(matchingTopStyle.StyleId, isHideAllFabrics);
                        }
                    }
                }

                var previewImages = thisObject.getBirdEyePreviewImageList();
                var totalViews = Utility.getObjectlength(previewImages['_' + styleId], 'sdjs443');
                if (totalViews <= 0) {
                    LiquidPixels.updateModelPreview('sdjs 444');
                }
            }
        });
        var selectedStyle = thisObject.getSelectedStyle();

        //Call the Garment size API for Adult case
        GlobalInstance.getRosterInstance().getGarmentSizes(adultObject, true);

        //Handle the click event of design
        $(document).on('click', '.' + this.divClassDesign + ' ul li div', function () {
            var designId = $(this).children().first().attr('DesignId');
            var designName = $(this).children().first().attr('Name');
            thisObject.selectedDesignForProof = designName;

            $("#ulDesignList").find('li').removeClass('active');
            $(this).parent().addClass('active');

            //Keep the previous selected Design Info
            thisObject.previousSelectedDesign = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();

            var currentStyle = thisObject.getSelectedStyle();
            GlobalInstance.uniformConfigurationInstance.setDesignsInfo(thisObject.getDesignByKey(currentStyle.StyleId, designId));

            //initialize the anchor point screen
            GlobalInstance.anchorPointInstance = GlobalInstance.getAnchorPointInstance();
            GlobalInstance.anchorPointInstance.init();

            //Call model Preview URl 
            //LiquidPixels.updateModelPreview();
        });
        //on successful style response, get the style data for youth also
        this.getYouthStyleData();
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.fabricInstance = GlobalInstance.getFabricInstance();
        GlobalInstance.fabricInstance.init(styles);

        this.getStyleListFunctionCallback = function () {
            thisObject.setDesignHtml(selectedStyle, true);
            //Initialize Fabric 
            GlobalInstance.fabricInstance.getFabricPrice();
            //Initialize Fabric 
            /************************************************-------------------------------------------------**/
            GlobalInstance.fabricInstance.funcCallBack = function () {
                GlobalInstance.shoppingCartInstance = GlobalInstance.getShoppingCartInstance();
                GlobalInstance.shoppingCartInstance.rebuildCart();
                //After rebuild card, if this method is called with retrieval code, call page landed event with fabric. In rebuild cart method, '.cartSelectedFabricLabel' and "#dvIdFabricSelected" are set to visible and then rosterclick event is called 
                if (GlobalInstance.loadConfigurationInstance.isLoaded()) {
                    $(document).trigger("PageLanded", CONFIG.get('LANDING_PAGE_FABRIC'));
                }
            };
            /************************************************-------------------------------------------------**/
        };

        //this.setHtmlAndBindBirdView();
        var previewImages = thisObject.getBirdEyePreviewImageList();
        var totalViews = Utility.getObjectlength(previewImages['_' + selectedStyle.StyleId], 'sdjs486');
        if (totalViews <= 0) {
            LiquidPixels.updateModelPreview('sdjs 483');
        }

        this.showHideBottomInCart(selectedStyle.StyleId);
        var styleFabrics = GlobalInstance.fabricInstance.getFabricByStyleId(selectedStyle.StyleId);
        var fabricLength = Utility.getObjectlength(styleFabrics, 'sdjs493');
        if (fabricLength > 0) {
            GlobalInstance.fabricInstance.showFabrics(selectedStyle.StyleId);
            thisObject.selectAndSetFabricBox(selectedStyle.StyleId);
            var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
            var arrayToCheck = thisObject.styleToShow;
            if (genderInfo.Id == CONFIG.get('SPORT_GENDER_ID_FEMALE')) {
                arrayToCheck = thisObject.styleToShowFemale;
            }
            if (Utility.isExist(arrayToCheck, parseInt(selectedStyle.StyleId, 10))) {
                matchingTopStyle = thisObject.getMatchingTopStyle(parseInt(selectedStyle.StyleId, 10));
                if (matchingTopStyle) {
                    var isHideAllFabrics = false;
                    GlobalInstance.fabricInstance.showFabrics(matchingTopStyle.StyleId, isHideAllFabrics);
                }
            }
        }
    }
    catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Method name: create style and design\n\n";
            txt = "Error description sdjs 505: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
            return false;
        }
    }
    finally {
    }

};

/*
 * This method is responsible for returning the YouthStyle object
 * @param index - Position of the Style
 * @returns YouthStyle object
 */
StyleAndDesign.prototype.getYouthStyleInfoByStyleId = function (styleId) {
    var youthStyleInfo = null;
    try {
        for (var i = 0; i < this.youthStyles.length; i++) {
            if (this.youthStyles[i].AdultStyleId == styleId) {
                youthStyleInfo = this.youthStyles[i];
                break;
            }
        }
    } catch (e) {
    }
    return youthStyleInfo;
}

/**
 * Selects the fabric box and sets the fabric information into global uniform configuration
 * @param styleId Style Id
 * 
 * 
 * @return void
 */
StyleAndDesign.prototype.selectAndSetFabricBox = function (styleId) {
    var styleFabrics = GlobalInstance.fabricInstance.getFabricByStyleId(styleId);
    var fabricLength = Utility.getObjectlength(styleFabrics, 'sdjs550');
    // selected fabric
    var currentFabric = GlobalInstance.fabricInstance.getSelectedFabric(styleId);
    var firstSelectedFabric = {};
    var totalFabricsInStyle = 0;

    $.each(styleFabrics, function (j, fabric) {
        if (currentFabric) {
            if (fabric.FabricId == currentFabric.FabricId) {
                currentFabric = fabric;
                return 0;
            }
        }
        if (totalFabricsInStyle === 0) {    //set first fabric 
            firstSelectedFabric = fabric;
        }
        totalFabricsInStyle++;
    });
    var currentFabricClickedId = GlobalInstance.uniformConfigurationInstance.getFabricIdOnClick();

    if (fabricLength == totalFabricsInStyle && totalFabricsInStyle > 0) {
        if (currentFabricClickedId != firstSelectedFabric.FabricId) {
            GlobalInstance.uniformConfigurationInstance.setFabricsInfo(firstSelectedFabric);
            GlobalInstance.uniformConfigurationInstance.setFabricIdOnClick(firstSelectedFabric.FabricId);
        }

        GlobalInstance.fabricInstance.selectFabricBox(firstSelectedFabric.StyleId, firstSelectedFabric.FabricId);

    } else {
        if (currentFabric != null) {
            if (currentFabricClickedId != currentFabric.FabricId) {
                GlobalInstance.uniformConfigurationInstance.setFabricsInfo(currentFabric);
                GlobalInstance.uniformConfigurationInstance.setFabricIdOnClick(currentFabric.FabricId);
            }
            GlobalInstance.fabricInstance.selectFabricBox(styleId, currentFabric.FabricId);

        }
    }

};
/**
 * Shows the design tab on the basis of selected style, it is a callback method after filling style and design it is called
 * @param styles style list
 * 
 * @param designs design list
 * 
 * @return void
 */
StyleAndDesign.prototype.selectStyleAndDesign = function (style, designs) {
    var thisObject = this;
    //For Baksetball case.
    var relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID'), function (n, i) {
        var data = i;
        return (n == style.StyleId ? i : null);
    });
    if (Utility.getObjectlength(relatedStyleId, 'fjs205') <= 0) {
        relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID_FEMALE'), function (n, i) {
            return (n == style.StyleId ? i : null);
        });
    }

    $('#liStyle_' + style.StyleId).addClass('active'); // For Other Sports

    if (Utility.getObjectlength(relatedStyleId, 'sdjs205') > 0) {
        $('#liStyle_' + relatedStyleId[0]).addClass('active');
    }

    // Check stored design in selected style.
    var selectedStyleObject = this.getStyleByKey(style.StyleId);
    var isDesignMatchedWithStyle = false;
    if (designs != undefined) {
        isDesignMatchedWithStyle = jQuery.map(selectedStyleObject.Designs, function (obj) {
            if (obj.DesignId == designs.DesignId) {
                return true;
            }
        });
    }

    if (isDesignMatchedWithStyle == null || isDesignMatchedWithStyle == '' && selectedStyleObject.Designs.length > 0) {
        $('#liDesign_' + style.StyleId + '_' + selectedStyleObject.Designs[0].DesignId).addClass('active');
        var selectedDesign = this.getDesignByKey(style.StyleId, $('.' + this.divClassDesign + ' ul li div').children().first().attr('designid'));
        if (selectedDesign) {
            GlobalInstance.uniformConfigurationInstance.setDesignsInfo(selectedDesign);
            $('#liDesign_' + style.StyleId + '_' + selectedStyleObject.Designs[0].DesignId).siblings('.active').removeClass('active');
        }
    } else {
        if (designs) {
            //updating the design object from current style
            var selectedDesign = this.getDesignByKey(style.StyleId, designs.DesignId);
            GlobalInstance.uniformConfigurationInstance.setDesignsInfo(selectedDesign);
            $('#liDesign_' + style.StyleId + '_' + designs.DesignId).addClass('active');
            $('#liDesign_' + style.StyleId + '_' + designs.DesignId).addClass('active').siblings('.active').removeClass('active');
        }
    }

    //intializes the anchor point screen on style or design change

    GlobalInstance.anchorPointInstance = GlobalInstance.getAnchorPointInstance();
    GlobalInstance.anchorPointInstance.init();
};

/**
 * Fetches the selected style
 * @param selectedStyle currently selected style
 * 
 * @return Object Selected style
 */
StyleAndDesign.prototype.setDesignHtml = function (selectedStyle, booleanShowPanel, isFromDesignClick) {

    var thisObject = this;
    var designThumbnailMainDivTag = $('<div/>')
            .attr('class', "designThumbnailBox")
            .appendTo(topLiTaGDesign);
    var liDesignTaG = null, divDesignTag = null;
    var designList = $('<ul>');
    var topLiTaGDesign = $('<li/>').attr('class', 'topli');
    var liDesignTaG = null;
    var divDesignTag = null;
    var designThumbnailMainDivTag = $('<div/>')
            .attr('class', "designThumbnailBox")
            .appendTo(topLiTaGDesign);
    var designs = this.getDesignsByStyleId(selectedStyle.StyleId);
    var totalDesigns = Utility.getObjectlength(designs, 'sdjs656'), designCtrPerPage = 0;
    try {
        $("#dvSelectDesign").addClass("carouselbg");
        $.loadPage('dvSelectDesign', null, true, true, function () {
            if (totalDesigns > 0) {
                $.each(designs, function (j, design) {
                    designCtrPerPage++;
                    liDesignTaG = $('<li/>').attr({
                        "class": 'style_' + design.StyleId + '_designs',
                        "id": 'liDesign_' + design.StyleId + '_' + design.DesignId,
                        "title": design.DesignName
                    }).appendTo(designList);

                    divDesignTag = $('<div/>')
                            .attr('class', "styleAndDesignThumbnail")
                            .appendTo(liDesignTaG);

                    var designName = $('<img/>')
                            .attr(
                            {
                                'DesignId': design.DesignId,
                                "src": LiquidPixels.getDesignUrl(design.DesignNumber),
                                "Name": design.DesignName,
                                "alt": design.DesignName,
                                "title": design.DesignName
                            }).appendTo(divDesignTag);

                    if (designCtrPerPage === CONFIG.get('STYLES_DESIGN_PER_PAGE')) {
                        designList.appendTo(designThumbnailMainDivTag);
                        $("#ulDesignList").append(topLiTaGDesign);
                        designCtrPerPage = 0;
                        topLiTaGDesign = null;
                        topLiTaGDesign = $('<li/>').attr('class', 'topli');
                        designThumbnailMainDivTag = null;
                        designThumbnailMainDivTag = $('<div/>')
                                .attr('class', "designThumbnailBox")
                                .appendTo(topLiTaGDesign);
                        designList = $('<ul>');
                    }
                });

                //if total totalDesigns are less than total page per limit then fill only first page or the last page containg records less than limit
                if (totalDesigns > 0 && designCtrPerPage < CONFIG.get('STYLES_DESIGN_PER_PAGE') && designCtrPerPage > 0) {
                    designList.appendTo(designThumbnailMainDivTag);
                    $("#ulDesignList").append(topLiTaGDesign);
                    topLiTaGDesign = $('<li/>').attr('class', 'topli');
                    designThumbnailMainDivTag = $('<div/>')
                            .attr('class', "designThumbnailBox")
                            .appendTo(topLiTaGDesign);
                    designList = $('<ul>');
                }
                var selectedDesign = thisObject.getSelectedDesign();
                thisObject.selectStyleAndDesign(selectedStyle, selectedDesign);
                var startPageDesign = thisObject.getDesignStartPage(selectedStyle.StyleId, selectedDesign.DesignId);


                $('#ulDesignList').jcarousel({ start: startPageDesign, itemFallbackDimension: 335 });
            } else {
                $('#ulDesignList').html('<li><div class=""> </div></li>');
                $('#ulDesignList').jcarousel({ itemFallbackDimension: 335 });
            }
            thisObject.designSetInProgress = false;

            thisObject.setHtmlAndBindBirdView();

            //show the design screen after binding the data if requried
            if (booleanShowPanel) {
                thisObject.show(true);
            }
        });
    } catch (e) {
        Log.error('exception : ' + e);
    }
};

/**
 * Fetches the page number of Style
 * @param  styleId Selected StyleId of the particular sports
 * 
 * @return Object Selected Style
 */
StyleAndDesign.prototype.getStyleStartPage = function (styleId) {
    var startPage = 1;
    $("#ulStyleList li.topli").each(function (index) {
        if ($(this).find('#liStyle_' + styleId).length == 1) {
            startPage = index + 1;
        }
    });//sets the paging to design list
    return startPage;
};

/**
 * Fetches the page number of Design
 * @param  styleId currently selected StyleId
 * 
 * @param   designId Specific Design of the Style
 * 
 * @return Object Selected Design
 */
StyleAndDesign.prototype.getDesignStartPage = function (styleId, designId) {
    var startPage = 1;
    $("#ulDesignList li.topli").each(function (index) {
        if ($(this).find('#liDesign_' + styleId + "_" + designId).length == 1) {
            startPage = index + 1;
        }
    });//sets the paging to design list
    return startPage;
};

/**
 * Fetches the selected style
 * 
 * @return Object Selected style
 */
StyleAndDesign.prototype.getSelectedStyle = function () {
    var styles = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
    var copiedStyle = null;
    try {
        if (!$.isEmptyObject(styles)) {

            if (styles.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                copiedStyle = JSON.parse(JSON.stringify(this.getStyleByKey(styles.CopyOfStyleId)));
                if (copiedStyle) {
                    delete copiedStyle.Fabrics;
                    delete copiedStyle.PreviewImages;
                }
            }
            GlobalInstance.uniformConfigurationInstance.setCopiedStylesInfo(copiedStyle);

            return styles;
        }
        else {
            var styleId = $('.' + this.divClassCut + ' ul li div').children().first().attr('styleid');
            if (styleId) {
                var styleToBeUsed = this.getStyleToBeUsed(styleId); // choose style for multifabric option, in the case of basketball, for female and male
                if (styleToBeUsed == '' || styleToBeUsed == null) {
                    styleToBeUsed = styleId;
                }
                var selectedStyle = this.getStyleByKey(styleToBeUsed);
                var styleInfo = JSON.parse(JSON.stringify(selectedStyle));
                delete styleInfo.Designs; // delete design information from style object while storing into uniform conifuration
                delete styleInfo.Fabrics;// delete fabric information from style object while storing into uniform conifuration

                GlobalInstance.uniformConfigurationInstance.setStylesInfo(styleInfo);

                if (styleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                    copiedStyle = JSON.parse(JSON.stringify(this.getStyleByKey(styleInfo.CopyOfStyleId)));
                    if (copiedStyle) {
                        delete copiedStyle.Fabrics;
                        delete copiedStyle.PreviewImages;
                    }
                }
                GlobalInstance.uniformConfigurationInstance.setCopiedStylesInfo(copiedStyle);

                return GlobalInstance.uniformConfigurationInstance.getStylesInfo();
            }
            else {
                return null;
            }
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Method name: getSelectedStyle\n\n";
            txt = "Error description sdjs 814: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
 * Fetches the selected design.
 * 
 * @return Object Selected style
 */
StyleAndDesign.prototype.getSelectedDesign = function () {
    var designs = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
    if (!$.isEmptyObject(designs)) {
        return designs;
    }
    else {
        var selectedStyle = this.getSelectedStyle();
        if (selectedStyle) {
            var selectedDesign = this.getDesignByKey(selectedStyle.StyleId, $('.' + this.divClassDesign + ' ul li div').children().first().attr('designid'));
            if (!$.isEmptyObject(selectedDesign)) {
                GlobalInstance.uniformConfigurationInstance.setDesignsInfo(selectedDesign);
                return GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
            }
            else {
                return null;
            }
        } else {
            return null;
        }
    }
};

/**
 * Gets the style list
 * 
 * @return Object Style list
 */
StyleAndDesign.prototype.getStyleList = function () {
    return this.styleList;
};

/**
 * Gets the style by key
 * @param key Specific Id
 * 
 * @return Object selcted style 
 */
StyleAndDesign.prototype.getStyleByKey = function (key) {
    return this.styleList["_" + key] || null;
};

/**
 * Get the YouthStyleInfo for specific StyleId
 * @param  key -- Youth StyleId
 * @returns youthStyleInfo
 */

StyleAndDesign.prototype.getYouthStyleByKey = function (key) {
    return this.youthStyleList["_" + key] || null;
};

/**
 * Gets the design list
 * 
 * @return Object Design list
 */
StyleAndDesign.prototype.getDesignList = function () {
    return this.designList;
};

/**
 * Gets the Design by key
 * @param key
 * @return Object selcted Design 
 */
StyleAndDesign.prototype.getDesignByKey = function (styleId, designId) {
    return this.designList[styleId + "_" + designId] || null;
};

/**
 * Gets the Designs for particular style by key
 * @param styleId
 * @return Object selcted Designs
 */
StyleAndDesign.prototype.getDesignsByStyleId = function (styleId) {
    return this.styleDesigns["_" + styleId] || null;
};

/**
 * Gets the bird eye view list
 * 
 * @return Object bird eye view list
 */
StyleAndDesign.prototype.getBirdEyePreviewImageList = function () {
    return this.styleBirdEyePreviewList;

};

/**
 * Gets the bird eye view by style key
 * @param key specific id
 * 
 * @return Object selcted bird eye view for provided style
 */
StyleAndDesign.prototype.getBirdEyePreviewImageByStyle = function (key) {
    return this.styleBirdEyePreviewList["_" + key] || null;
};

/**
 * Gets the bird eye view by imageId key
 * @param key specific id
 * 
 * @return Object selcted bird eye view 
 */
StyleAndDesign.prototype.getBirdEyePreviewImageByImageId = function (styleId, imageId) {
    var birdEyeViewDetail = null;
    $.each(this.styleBirdEyePreviewList["_" + styleId], function (keyImageId, birdEyeView) {
        if (imageId == +birdEyeView.PreviewImageId) {
            birdEyeViewDetail = birdEyeView;
            return false;
        }
    });
    return birdEyeViewDetail;
};
/**
 * Check if bottom is to be shown on the basis of selected style
 * @param styleId Currently selectedStyle Id
 * 
 * @return Boolean true if bottom to be shown, false otherwise
 */
StyleAndDesign.prototype.showHideBottomInCart = function (styleId) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var rid = GlobalInstance.uniformConfigurationInstance.RetrieveCode || '';
    try {
        var isShowBottom = false;
        var currentStyle = this.getStyleByKey(styleId);
        var matchingBottomStyle = null;
        if (currentStyle) {
            if (currentStyle.StyleTypeId == CONFIG.get("STYLE_ID_TOP")) {
                matchingBottomStyle = this.getMatchingBottomStyle(currentStyle);
                if (matchingBottomStyle) {
                    if (matchingBottomStyle.StyleTypeId == CONFIG.get("STYLE_ID_BOTTOM")) {
                        isShowBottom = true;
                    }
                }
            }
        }

        if (!isShowBottom) {
            $('#idChkBottomCart').prop('checked', false);
            $('#idAdultClothBottom').hide();
            $('#bottomChkRemove').removeClass('css-label');
            $('#idBottomPriceVal').hide();
            $('#idAdultClothTextBottom').hide();
        } else {
            $('#idAdultClothBottom').show();
            $('#bottomChkRemove').addClass('css-label');
            $('#idBottomPriceVal').show();
            $('#idAdultClothTextBottom').show();
            //Handles checkbox code for Bottom Style one time only .Handles on IE 8,9 also
            var bottom = GlobalInstance.uniformConfigurationInstance.getBottomAvailable();
            if (rid.length > 0) {
                if (bottom) {
                    $('#idChkBottomCart').prop('checked', true);
                } else {
                    $('#idChkBottomCart').prop('checked', false);
                }
            }
            else {
                $('#idChkBottomCart').prop('checked', true);
            }
            handleCheckBoxChange($('#idChkBottomCart'));
        }
        //Handles checkbox code for top Style one time only .Handles on IE 8,9 also
        var top = GlobalInstance.uniformConfigurationInstance.getTopAvailable();
        if (rid.length > 0) {
            if (top) {
                $('#chkTopCart').prop('checked', true);
            } else {
                $('#chkTopCart').prop('checked', false);
            }
        }
        handleCheckBoxChange($('#chkTopCart'));



        return isShowBottom;
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Method name: showHideBottomInCart\n\n";
            txt = "Error description sdjs 1007: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
        return false;
    }
};

/**
 * Fill the HTML and binds the click event of each bird view
 * 
 * @return void
 */
StyleAndDesign.prototype.setHtmlAndBindBirdView = function () {
    //set and bind roster bird eye view also
    try {
        var panel = $('#secRosterBirdEyeViewPanel');
        if (panel.length > 0) {
            GlobalInstance.getRosterInstance().setHtmlAndBindRosterBirdView(true);
        }
    } catch (err) {
        txt = "Method name: showHideBottomInCart\n\n";
        Log.error(txt);
    }

    var thisObject = this;


    if ($('.birdEyeSideImg').length > 0) {
        this.updateHtmlAndbirdEyeView();
    } else {
        //load bird eyeview panel
        $.loadPage('secbirdEyeViewPanel', null, true, false, function () {
            var birdViewTag = '';
            var maximumViews = 0;

            var previewImages = thisObject.getBirdEyePreviewImageList();
            for (var key in previewImages) {
                var totalViews = Utility.getObjectlength(previewImages[key], 'sdjs1050');
                if (maximumViews < totalViews) {
                    maximumViews = totalViews;
                }
            }

            for (var index = 0; index < maximumViews; index++) {
                birdViewTag += '<li ><div class="birdEyeViewDivTag"><a><img index="' + index + '" class="birdEyeSideImg"></a></div></li>';
            }

            $("#ulBirdEyeView").html(birdViewTag);
            $('#ulBirdEyeView').jcarousel({ vertical: true, scroll: 2 });
            thisObject.updateHtmlAndbirdEyeView();
        });
    }
};

/**
 * This mehotd updates the model preivew design
 * @returns {undefined}
 */
StyleAndDesign.prototype.updateHtmlAndbirdEyeView = function () {
    var thisObject = this;
    var previewImages = thisObject.getBirdEyePreviewImageList();
    var selectedStyle = thisObject.getSelectedStyle();
    var selectedStylePreviewImages = previewImages['_' + selectedStyle.StyleId];
    var totalViews = 0;
    var defaultView = CONFIG.get('BIRD_EYE_VIEW_ORIENTATION_FRONT');
    var defaultViewObject = null;

    if (selectedStyle !== null) {
        var birdViewTag = '';
        var count = 0;
        var selectedBirdView = GlobalInstance.uniformConfigurationInstance.getBirdEyeView();

        totalViews = Utility.getObjectlength(selectedStylePreviewImages, 'sdjs1084');

        //check is bird eye view matched
        var isBirdViewMatched = false;
        if (totalViews > 0) {
            try {

                if (thisObject.isConfigLoaded && thisObject.loadFromConfigFirstTime == false) {
                    defaultViewObject = jQuery.map(selectedStylePreviewImages, function (obj) {
                        if (obj.Name.toLowerCase() == defaultView) {
                            return obj;
                        }
                    });
                    defaultViewObject = defaultViewObject ? defaultViewObject[0] : null;

                    thisObject.loadFromConfigFirstTime = true;
                    thisObject.isConfigLoaded = false;

                }

                if (selectedBirdView) {
                    isBirdViewMatched = jQuery.map(selectedStylePreviewImages, function (obj) {
                        if (obj.Name.toLowerCase() == selectedBirdView.Name.toLowerCase()) {
                            return true;
                        } else {
                            return null;
                        }
                    });
                }
                isBirdViewMatched = isBirdViewMatched ? isBirdViewMatched[0] : false;
            } catch (err) {
                if (CONFIG.get('DEBUG') === true) {
                    txt = "Method name: updateHtmlAndbirdEyeView\n\n";
                    txt = "Error description sdjs 1098: " + err.message + "\n\n";
                    txt += "Error filename: " + err.fileName + "\n\n";
                    txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                    Log.error(txt);
                }
            }
        }


        //remove active class from all bird eye view
        $('.birdEyeViewDivTag').removeClass('active');
        var ulBirdEyeView = 'ulBirdEyeView';

        //loop over all bird eyeviews
        $.each(selectedStylePreviewImages, function (i, birdEyeView) {
            var fileName = selectedStyle.StyleNumber + '_' + birdEyeView.Name.toLowerCase();
            var view = birdEyeView.Name.toLowerCase();
            var imgObject = $('.birdEyeSideImg[index=' + count + ']');
            imgObject.attr('alt', fileName);
            imgObject.attr('styleid', selectedStyle.StyleId);
            imgObject.attr('id', 'birdPreview_' + birdEyeView.PreviewImageId);
            imgObject.attr('src', LiquidPixels.getBirdEyeViewImageUrl(selectedStyle.StyleNumber, view));

            if (defaultViewObject && view == defaultViewObject.Name.toLowerCase()) {
                imgObject.parent().parent().addClass('active');
                GlobalInstance.uniformConfigurationInstance.setBirdEyeView(defaultViewObject);
                defaultViewObject = null;
                selectedBirdView = null;
            }
            else {
                if (!isBirdViewMatched && count == 0) {
                    imgObject.parent().parent().addClass('active');
                    GlobalInstance.uniformConfigurationInstance.setBirdEyeView(birdEyeView);
                    thisObject.isBirdViewSet = true;
                }

                if (selectedBirdView && selectedBirdView.Name.toLowerCase() == view) {
                    imgObject.parent().parent().addClass('active');
                    GlobalInstance.uniformConfigurationInstance.setBirdEyeView(birdEyeView);
                    thisObject.isBirdViewSet = true;
                }
            }
            //bind click event of preview image
            $(document).off('click', '#birdPreview_' + birdEyeView.PreviewImageId);

            Log.trace('#birdPreview_' + birdEyeView.PreviewImageId);
            $(document).on('click', '#birdPreview_' + birdEyeView.PreviewImageId, function () {
                //                    //set as active
                $('.birdEyeViewDivTag').removeClass('active');
                $(this).parent().parent().addClass('active');
                var previewImageId = $(this).attr('id').split('_')[1];
                var styleId = $(this).attr('styleid');
                var selectedBirdView = thisObject.getBirdEyePreviewImageByImageId(styleId, previewImageId);
                GlobalInstance.uniformConfigurationInstance.setBirdEyeView(selectedBirdView);
                LiquidPixels.updateModelPreview(' sdjs 1144');

                //update the state of birdeye view and model preview for front
                try {
                    $('.rosterBirdEyeViewDivTag').removeClass('active');
                    $('#rosterBirdPreview_' + selectedBirdView.PreviewImageId).parent().parent().addClass('active');
                    LiquidPixels.updateRosterModelPreview(null, true);
                    return false;
                } catch (e) {
                }
            });
            count++;
        });


        //hide vertical arrow depending on condiotion
        if (totalViews <= CONFIG.get('DEFAULT_BIRD_EYE_VIEW_COUNT')) {
            $(".jcarousel-next-vertical").hide();
        } else {
            $(".jcarousel-next-vertical").show();
        }
    }
};


/**
 * Get the matching bottom style object of the given style
 * @param styleId Currently selectedStyle object
 * 
 * @return Style object
 */
StyleAndDesign.prototype.getMatchingBottomStyle = function (currentStyle) {
    var matchingBottomStyle = null;
    if (currentStyle) {
        if (currentStyle.MatchingBottomStyleId && currentStyle.MatchingBottomStyleId != CONFIG.get("MATCHING_STYLE_ID_BOTTOM")) {
            matchingBottomStyle = this.getStyleByKey(currentStyle.MatchingBottomStyleId);
        }
    }
    return matchingBottomStyle;
};

/**
 * This method is responsible setting default value for Youth Gender
 * @returns void
 */
StyleAndDesign.prototype.setDefaultYouthStyleAndDesign = function () {
    var styleInfo = this.getSelectedStyle();
    var youthStyleInfo = JSON.parse(JSON.stringify(this.getYouthStyleInfoByStyleId(styleInfo.StyleId)));
    var copiedStyleYouth = null;
    if (Utility.getObjectlength(youthStyleInfo, 'sdjs1228') > 0) {
        this.setBottomYouthStyleInfo(styleInfo);

        delete youthStyleInfo.Designs;// delete design information from Youthstyle object while storing into uniform conifuration
        delete youthStyleInfo.Fabrics;// delete fabric information from Youthstyle object while storing into uniform conifuration   
        GlobalInstance.uniformConfigurationInstance.setYouthStylesInfo(youthStyleInfo);

        if (youthStyleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
            copiedStyleYouth = JSON.parse(JSON.stringify(this.getYouthStyleByKey(youthStyleInfo.CopyOfStyleId)));
            if (copiedStyleYouth) {
                delete copiedStyleYouth.Fabrics;
                delete copiedStyleYouth.PreviewImages;
            }
        }
        GlobalInstance.uniformConfigurationInstance.setCopiedYouthStylesInfo(copiedStyleYouth);
    }
    this.getStyleListFunctionCallback();
    this.youthStyleDesigns = new Object();
    this.youthStyleIdArray = new Array();
    this.getDesignsForYouth();
};
/**
 * This method saves matching bottom style info in the Uniformconfiguration file
 * @param styleId - selected styleId
 * @returns void
 */
StyleAndDesign.prototype.setBottomYouthStyleInfo = function (styleInfo) {
    var matchingBottomStyleInfo = this.getMatchingBottomStyle(styleInfo); // Get the matching bottom style info for the respective style
    var youthMatchingBottomStyleInfo = null;
    if (matchingBottomStyleInfo) {
        if (matchingBottomStyleInfo.StyleTypeId == CONFIG.get("STYLE_ID_BOTTOM")) {
            youthMatchingBottomStyleInfo = JSON.parse(JSON.stringify(this.getYouthStyleInfoByStyleId(matchingBottomStyleInfo.StyleId)));
            if (Utility.getObjectlength(youthMatchingBottomStyleInfo, 'sdjs1262') > 0) {
                delete youthMatchingBottomStyleInfo.Designs;// delete design information from Youthstyle object while storing into uniform conifuration
                delete youthMatchingBottomStyleInfo.Fabrics;// delete fabric information from Youthstyle object while storing into uniform conifuration   
                GlobalInstance.uniformConfigurationInstance.setBottomYouthDStyleInfo(youthMatchingBottomStyleInfo);
            }
        }
    }
};

/**
 * Get the matching top style object of the given style 
 * @param styleId Currently selectedStyle object
 * 
 * @return Style object
 */
StyleAndDesign.prototype.getMatchingTopStyle = function (styleId, isReveMappingRequired) {
    isReveMappingRequired = (typeof isReveMappingRequired == 'undefined') ? false : isReveMappingRequired;
    //This method is only applicable for basketball
    var matchingTopStyle = null, matchingTopStyleId = 0;
    var genderInfo = GlobalInstance.getUniformConfigurationInstance().getGenderInfo();
    if (styleId) {
        var styleCombine = this.styleToCombine;
        if (genderInfo.Id == CONFIG.get('SPORT_GENDER_ID_FEMALE')) {
            styleCombine = this.styleToCombineFemale;
        }
        if (!isReveMappingRequired) {
            if (styleCombine.hasOwnProperty(styleId)) {
                matchingTopStyleId = styleCombine[styleId];
            }
            if (matchingTopStyleId) {
                matchingTopStyle = this.getStyleByKey(matchingTopStyleId);
            }
        } else {

            Object.getOwnPropertyNames(styleCombine).forEach(function (val) {
                if (styleCombine[val] == styleId) {
                    matchingTopStyleId = val;
                }
            });
            
            if (matchingTopStyleId) {
                matchingTopStyle = this.getStyleByKey(matchingTopStyleId);
            }
        }
    }
    return matchingTopStyle;
};

/**
 * This method returns style to be used
 * @param currentStyleId - Current Style
 * @returns style To be used
 */
StyleAndDesign.prototype.getStyleToBeUsed = function (currentStyleId) {
    var styleId = '';
    if (Utility.isExist(CONFIG.get('STYLE_SHOW'), parseInt(currentStyleId, 10))) {
        styleId = currentStyleId;
    } else if (Utility.isExist(CONFIG.get('STYLE_SHOW_FEMALE'), parseInt(currentStyleId, 10))) {
        styleId = currentStyleId;
    }
    if (!styleId) {
        styleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID'), function (n, i) {
            return (i == currentStyleId ? n : null);
        });
        if (Utility.getObjectlength(styleId, 'sdjs1307') <= 0) {
            styleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID_FEMALE'), function (n, i) {
                return (i == currentStyleId ? n : null);
            });
        }
    }

    return styleId;
};

/**
 * This method calls the api that returns Designs.
 * @param callback
 * @returns void
 */
StyleAndDesign.prototype.getDesignsForYouth = function () {
    try {
        var thisObject = this;
        var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
        var currentStyleInfo = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
        var youthGenderInfo = GlobalInstance.uniformConfigurationInstance.getYouthGenderInfo();
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var youthStyleInfo = GlobalInstance.uniformConfigurationInstance.getYouthStylesInfo();
        this.youthStyleIdArray.push(youthStyleInfo.StyleId);
        //Top Copy Of STy;e Case
        if (youthStyleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
            this.youthStyleIdArray.push(youthStyleInfo.CopyOfStyleId);
        }

        //Bottom Case
        var relatedBottomYouthStyleInfo = null;
        if (currentStyleInfo.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) {
            relatedBottomYouthStyleInfo = this.getYouthStyleInfoByStyleId(currentStyleInfo.MatchingBottomStyleId);
            if (relatedBottomYouthStyleInfo) {
                this.youthStyleIdArray.push(relatedBottomYouthStyleInfo.StyleId);
                if (relatedBottomYouthStyleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                    this.youthStyleIdArray.push(relatedBottomYouthStyleInfo.CopyOfStyleId);
                }
            }
        }

        var params = {
            'applicationId': GlobalInstance.uniformConfigurationInstance.getApplicationId(),
            'genderTypeId': youthGenderInfo.Id,
            'categoryId': categoryInfo.Id,
            "styleId": '',
        };
        for (var i = 0; i < this.youthStyleIdArray.length; i++) {
            params.styleId = this.youthStyleIdArray[i];
            thisObject.objCommHelper = new CommunicationHelper();
            thisObject.objCommHelper.callAjax(thisObject.designRequestUrl, 'GET', params, thisObject.responseType, null, thisObject.handleWebRequestCallBackForYouthDesigns.bind(thisObject, params.styleId), null, null, null, null, null);
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description sdjs 148: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
 * This method handles the web request for designs for youth
 * @param response
 * @param  callback
 * @returns void
 */
StyleAndDesign.prototype.handleWebRequestCallBackForYouthDesigns = function (youthStyleId, response) {
    try {
        var thisObject = this;
        if (this.objUtility.validateResponseFormat(response, this.designRequestUrl)) {
            thisObject.youthStyleDesigns['_' + youthStyleId] = response.ResponseData;
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description sdjs 148: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
}