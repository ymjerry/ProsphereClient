/**
 * TWA proshpere configurator
 * 
 * fabric.js is used to define fabric related functions. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 *
 * @return void
 */
function Fabrics() {
    this.fabricsList = new Object();
    this.requestUrl = WEB_SERVICE_URL.get('FABRIC_LIST', LOCAL);
    this.fabricPriceUrl = WEB_SERVICE_URL.get('STYLE_SIZE_FABRIC_PRICE', LOCAL);
    this.responseType = 'json';
    this.objCommHelper = new CommunicationHelper();
    this.objUtility = new Utility();
    this.dvIdFabricsList = 'dvIdFabricsList';
    this.FabricImgId = 'FabricImg';
    this.FabricImageLabel = 'dvIdFabricImageLabel';
    this.enlargeViewOffsetTop = '';
    this.enlargeViewOffsetLeft = '';
    this.dvfabricEnlargeview = 'dvfabricEnlargeview';
    this.styleFabricsList = new Object();
    //this.funcCallBack = $.Callbacks('memory');
    this.funcCallBack = null;
    this.genderObject = {};
}
/*
 * This method takes the response from the GetStyleList API.
 * @param styleAndDesignList contains the response from the API
 * 
 * @returns void
 */
Fabrics.prototype.init = function (styleAndDesignList) {
    this.createFabricsList(styleAndDesignList);
    GlobalInstance.rosterInstance = GlobalInstance.getRosterInstance();
};


/**
 * Fills the fabric list into the object after recieving the list from Web Service. After filling the data, it loads the HTML and 
 * binds the click event on fabrics name
 *
 * @param styleAndDesignList Response from Web service in json format containing fabrics list
 * 
 * 
 * @return void
 */
Fabrics.prototype.createFabricsList = function (styleAndDesignList) {
    var thisObject = this;
    try {
        if (this.objUtility.validateResponseFormat(styleAndDesignList, this.requestUrl)) {
            $.each(styleAndDesignList, function (i, styleList) {
                var tempFabricObject = {};
                $.each(styleList.Fabrics, function (j, fabrics) {
                    thisObject.fabricsList[styleList.StyleId + '_' + fabrics.FabricId] = fabrics;
                    tempFabricObject["_" + fabrics.FabricId] = fabrics;
                });
                thisObject.styleFabricsList["_" + styleList.StyleId] = tempFabricObject;
            });
            this.setHtmlAndBind();
        } else {
            Log.error("Error in API createFabricsList");
        }
    } catch (err) {

        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description fabric 73: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};
/**
 * Shows the fabric screen
 * @return void
 */
Fabrics.prototype.show = function (onFinished) {
    $("#secFabricPanel").show();

    //call the callback
    if (onFinished && typeof (onFinished) == "function") {
        onFinished();
    }
    GlobalFlags.setScreenFlags('isFabricScreenLoaded', true);
    //trigger the roster page landing event
    $(document).trigger("PageLanded", CONFIG.get('LANDING_PAGE_FABRIC'));
};


/**
 * Hides the fabric screen
 * @return void
 */
Fabrics.prototype.hide = function () {
    $("#secFabricPanel").hide();
};

/**
 * Sets the fabrics list HTML and binds the click event
 * @return void
 */
Fabrics.prototype.setHtmlAndBind = function () {
    //This is responsible for creating dynamic fabric list
    tempFabricsListHtml = '';
    $.each(this.getFabricList(), function (i, fabricsList) {
        tempFabricsListHtml += '<div  class="fabricConfiguratorSelection positionRrelative" id="fabric_' + fabricsList.StyleId + '_' + fabricsList.FabricId + '" styleid="dvStyle_' + fabricsList.StyleId + '_Fabric">';
        tempFabricsListHtml += '<a style="color:black; cursor: default;" styleid="' + fabricsList.StyleId + '" fabricId="' + fabricsList.FabricId + '" fabricItemId="' + fabricsList.ItemId + '">';
        tempFabricsListHtml += '<div style="cursor:default;" class="fabricConfiguratorSelectionBoxInside">';
        tempFabricsListHtml += '<div class="fl">';
        tempFabricsListHtml += '<div class="fabricBox FabricImg"  fabricId="' + fabricsList.FabricId + '"><img style="cursor:pointer;" src=' + LiquidPixels.getFabricUrl(FABRIC.get('FABRIC_BOX_WIDTH'), FABRIC.get('FABRIC_BOX_HEIGHT'), fabricsList.ItemId) + '></img>';
        tempFabricsListHtml += '</div>';
        tempFabricsListHtml += '<div class="enlargeLink" id=EnlargeLinkClicked fabricindex="' + i + '">';
        tempFabricsListHtml += '<div class="enlargeIcon"></div>';
        tempFabricsListHtml += '<div class="enlargeText"  >';
        tempFabricsListHtml += 'Enlarge';
        tempFabricsListHtml += '</div>';
        tempFabricsListHtml += '</div>';
        tempFabricsListHtml += '</div>';
        tempFabricsListHtml += '<div style="cursor:default;" class="fabricDescription  data_tip="' + fabricsList.Description + '" alt="' + fabricsList.Description + '" title="' + fabricsList.Description + '"">';
        tempFabricsListHtml += '<h5 >';
        tempFabricsListHtml += '<div style="font-size:16px; cursor:default; white-space:nowrap; width:270px; height:25px; text-overflow:ellipsis; overflow:hidden;" fabricId=' + fabricsList.FabricId + '  style="text-decoration:none"  title="' + fabricsList.Name + '">';
        tempFabricsListHtml += '<div style="border-bottom:2px solid #575757; display:inline;"> ' + fabricsList.Name + ' </div>';
        tempFabricsListHtml += '</div>';
        tempFabricsListHtml += '</h5>';
        tempFabricsListHtml += '<p title="' + fabricsList.Description + '">';
        tempFabricsListHtml += fabricsList.Description;
        tempFabricsListHtml += '</p>';
        tempFabricsListHtml += '</div>';
        tempFabricsListHtml += '</div>';
        tempFabricsListHtml += '</a>';
        tempFabricsListHtml += '</div>';
        tempFabricsListHtml += '<div class="clear"></div>';
    });

    var thisObject = this;

    if (this.dvIdFabricsList) {
        $('#' + this.dvIdFabricsList).html(tempFabricsListHtml);
    }

    //This method handles click event on the Enlarge link
    $('.enlargeLink').click(function () {
        thisObject.setFabricEnlargeViewPosition($(this));
        var index = $(this).attr('fabricindex');

        $("#dvIdViewFabImg").html('');
        $("#dvIdFabricImageLabel").html('');
        $("#dvfabricEnlargeview").show();
        $("#dvfabricEnlargeview").offset({
            top: thisObject.enlargeViewOffsetTop,
            left: thisObject.enlargeViewOffsetLeft
        });
        $('#blanket').show();
        $.startProcess(true);
        var zoomFabricImage = new Image();
        zoomFabricImage.onload = function () {
            $.doneProcess(true);
        };
        zoomFabricImage.onerror = function () {
            $.doneProcess(true);
        };
        zoomFabricImage.src = LiquidPixels.getFabricUrl(FABRIC.get('ENLARGE_VIEW_WIDTH'), FABRIC.get('ENLARGE_VIEW_HEIGHT'), thisObject.fabricsList[index].ItemId);
        $("#dvIdFabricImageLabel").text(thisObject.fabricsList[index].Name);
        $("#dvIdViewFabImg").html('<img src="' + zoomFabricImage.src + '"/>');
        $('#dvfabricEnlargeview').draggable({
            containment: '#dvConfiguratorPanel'
        });
        return false;
    });

    //This method handles close button present in the Enlarged Image
    $("#dvfabricEnlargeviewClose").click(function () {
        $("#dvfabricEnlargeview").hide();
        $('#blanket').hide();
    });
    //This method handles the click event on the Fabric box
    $('#dvIdFabricsList div a').on('click', function (e) {
        if ($(e.target).is('#EnlargeLinkClicked') || $(e.target).is('.enlargeText')) {
            //If target is EnlargeLink or class is enlargeText ,  do not select the fabric section.
        } else {
            //This is reponsible for selection of the Fabric Section
            try {
                $('.fabricBox').removeClass('active');
                $(this).addClass('active'); // use this line
                $(this).find('.fabricBox').addClass('active'); // Do not delete, it selects the fabric thumbnail box
                var parentStyleID = $(this).attr('styleid');

                var fabricInfo = thisObject.getFabricByKey(parentStyleID, $(this).attr('fabricid'));
                GlobalInstance.uniformConfigurationInstance.setFabricIdOnClick(fabricInfo.FabricId);
                thisObject.selectFabricBox(fabricInfo.StyleId, fabricInfo.FabricId);
                var selectedFabric = GlobalInstance.uniformConfigurationInstance.getFabricsInfo();
                GlobalInstance.shoppingCartInstance = GlobalInstance.getShoppingCartInstance();
                GlobalInstance.uniformConfigurationInstance.setFabricClicked();
                //Basketball case
                var relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID'), function (n, i) {
                    return (n == parentStyleID ? i : null);
                });
                if (Utility.getObjectlength(relatedStyleId, 'fjs205') <= 0) {
                    relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID_FEMALE'), function (n, i) {
                        return (n == parentStyleID ? i : null);
                    });
                }
                ////////////////////////////
                GlobalInstance.styleAndDesignInstance = GlobalInstance.getStyleAndDesignInstance();
                GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
                var selectedBirdEyeView = GlobalInstance.uniformConfigurationInstance.getBirdEyeView();
                var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
                var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
                var selectedStyleInfo = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
                var designInfo = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
                var styleInfo = null;
                if (Utility.getObjectlength(relatedStyleId, 'fjs211') > 0) {
                    if (parentStyleID) {
                        var relatedStyle = GlobalInstance.styleAndDesignInstance.getStyleByKey(parseInt(parentStyleID, 10));
                        if (relatedStyle) {
                            $('#liStyle_' + relatedStyleId).find('img').attr({ "title": relatedStyle.StyleName, "alt": relatedStyle.StyleName, "styleid": parentStyleID });
                            //Do not set the design , bird eye view information for the same style id
                            if (selectedStyleInfo.StyleId != relatedStyle.StyleId) {
                                styleInfo = JSON.parse(JSON.stringify(relatedStyle));
                                delete styleInfo.Designs; // delete design information from style object while storing into uniform conifuration
                                delete styleInfo.Fabrics;// delete fabric information from style object while storing into uniform conifuration

                                GlobalInstance.uniformConfigurationInstance.setStylesInfo(styleInfo);
                                $.each(styleInfo.PreviewImages, function (i, birdEyeView) {
                                    if (selectedBirdEyeView.Name == birdEyeView.Name) {
                                        GlobalInstance.uniformConfigurationInstance.setBirdEyeView(birdEyeView);
                                    }
                                });
                            }
                        }
                    }
                }
                else {
                    var parentStyle = GlobalInstance.styleAndDesignInstance.getStyleByKey(parseInt(parentStyleID, 10));
                    if (parentStyle) {
                        if (selectedStyleInfo.StyleId != parentStyle.StyleId) {
                            $('#liStyle_' + parentStyleID).find('img').attr({ "title": parentStyle.StyleName, "alt": parentStyle.StyleName, "styleid": parentStyleID });
                            styleInfo = JSON.parse(JSON.stringify(parentStyle));
                            delete styleInfo.Designs; // delete design information from style object while storing into uniform conifuration
                            delete styleInfo.Fabrics;// delete fabric information from style object while storing into uniform conifuration
                            GlobalInstance.uniformConfigurationInstance.setStylesInfo(styleInfo);
                            $.each(styleInfo.PreviewImages, function (i, birdEyeView) {
                                if (selectedBirdEyeView.Name == birdEyeView.Name) {
                                    GlobalInstance.uniformConfigurationInstance.setBirdEyeView(birdEyeView);
                                }
                            })
                        }
                    }
                }

                //Set the style information for basketball case
                if (!styleInfo) {
                    styleInfo = JSON.parse(JSON.stringify(selectedStyleInfo));
                }
                thisObject.setMultiFabricStylesInfo(styleInfo);

                //Set Bird Eye View for Style that is hidden
                GlobalInstance.styleAndDesignInstance.setHtmlAndBindBirdView();

                //set the designs for the style that is hidden
                if (categoryInfo.Name == CONFIG.get('BASKETBALL_STRING')) {
                    GlobalInstance.styleAndDesignInstance.setDesignHtml(styleInfo, false, true);

                    //Get the Garment Sizes for Basketball case
                    GlobalInstance.getRosterInstance().getGarmentSizes(thisObject.genderObject, true);
                }

                //if (GlobalInstance.uniformConfigurationInstance.getFabricIdOnClick() != selectedFabric.FabricId) {
                thisObject.funcCallBack = function () {
                    GlobalInstance.shoppingCartInstance.rebuildCart();
                };
                GlobalInstance.uniformConfigurationInstance.setFabricsInfo(fabricInfo);
                thisObject.getFabricPrice();
                /*} else {
                    var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
                    var topPricesList = GlobalInstance.rosterInstance.getTopSizePriceList(genderInfo.GenderId);
                    var topPriceAvailable = Utility.getObjectlength(topPricesList["_" + genderInfo.Id],'fjs245');
                    if (parseInt(topPriceAvailable) > 0) {
                        GlobalInstance.shoppingCartInstance.rebuildCart();
                    }
                }*/

                //to do set the style info in uniform config object and deal accordingly

                /************************************************************/

            } catch (err) {
                if (CONFIG.get('DEBUG') === true) {
                    txt = "Error description fabric 258: " + err.message + "\n\n";
                    txt += "Error filename: " + err.fileName + "\n\n";
                    txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                    Log.error(txt);
                }
            }

        }
    });


    $(document).keyup(function (e) {
        // esc key handling
        if (e.keyCode == 27) {
            if ($('#dvfabricEnlargeview').is(':visible')) {
                $("#dvfabricEnlargeviewClose").click();
            }
        }
    });
};

/**
 * This method set the position for enlarge view of Fabric
 * @param  currentObject currentlyselected Id to get the offset
 * 
 * @returns {void}
 */
Fabrics.prototype.setFabricEnlargeViewPosition = function (currentObject) {
    var currentPositionOffset = currentObject.parent().parent().offset();
    var childHeight = currentObject.parent().parent().find('.fabricBox').height();
    var childWidth = currentObject.parent().parent().find('.fabricBox').width();
    this.enlargeViewOffsetTop = currentPositionOffset.top - childHeight;
    this.enlargeViewOffsetLeft = currentPositionOffset.left + childWidth + FABRIC.get('ENLARGE_VIEW_OFFSET_LEFT');
};

/**
 * Get the fabrics list 
 *
 * @return object FabricList
 */
Fabrics.prototype.getFabricList = function () {
    return this.fabricsList;
};

/**
 * Get the fabrics object by key
 * @params key specific id 
 *
 * @return object Fabric
 */
Fabrics.prototype.getFabricByKey = function (styleId, fabricId) {
    var key = styleId + '_' + fabricId;
    return this.fabricsList[key] || null;
};
/*
 * This method select the particular fabric as per the provided fabric Id
 * @params styleId currently Selected Style
 * 
 * @params fabricId Specific fabricId of the currently selected fabric
 * 
 * @return void
 */
Fabrics.prototype.selectFabricBox = function (styleId, fabricId) {
    var styleFabrics = this.getFabricByStyleId(styleId);
    var fabricLength = Utility.getObjectlength(styleFabrics, 'fjs321');

    if (fabricId) {
        $('.fabricConfiguratorSelectionBoxInside').removeClass('active');
        $("#fabric_" + styleId + '_' + fabricId).find('.fabricConfiguratorSelectionBoxInside').addClass('active');

        if (fabricLength == 1 || GlobalInstance.loadConfigurationInstance.isLoaded()) {
            $("#fabric_" + styleId + '_' + fabricId).find('.fabricBox').addClass('active');
        }
        $('#cartSelectedFabricLabel').show();
    }
};

/*
 * This method returns the particular fabric as per the provided fabric Id
 * @params styleId selected Specific Style
 * 
 * @return Object selected fabric
 */

Fabrics.prototype.getSelectedFabric = function (styleId) {
    var selectedFabric = GlobalInstance.uniformConfigurationInstance.getFabricsInfo();
    var styleFabrics = {};

    if (!$.isEmptyObject(selectedFabric)) {
        return selectedFabric;
    } else {
        styleFabrics = this.getFabricByStyleId(styleId);
        var fabricLength = Utility.getObjectlength(styleFabrics, 'fjs349');

        if (fabricLength == 1) {
            $.each(styleFabrics, function (j, fabric) {
                selectedFabric = fabric;
            });
            return selectedFabric;
        }
    }
    return null;
};

/*
 * This method shows the fabric associated with the style
 * @params styleId selected Style
 * 
 * @return void
 */
Fabrics.prototype.showFabrics = function (styleId, isHideAll) {
    isHideAll = isHideAll !== undefined ? isHideAll : true; // In Basketball, the related fabrics should be shown so no need to hide all fabrics before showing related styles' fabrics
    if (isHideAll) {
        $('#dvIdFabricsList').find('.fabricConfiguratorSelection').hide();
    }
    $('#dvIdFabricsList').find(".fabricConfiguratorSelection").each(function () {
        if ($(this).attr("styleid") == 'dvStyle_' + styleId + '_Fabric') {
            $(this).show();
        }
    });
};

/*
 * This method returns the fabric list associated with the  selected style
 * @params styleId selected Style
 * 
 * @return styleFabricsList
 */
Fabrics.prototype.getFabricByStyleId = function (styleId) {
    return this.styleFabricsList["_" + styleId] || null;
};

Fabrics.prototype.getFabricPrice = function () {
    /*****************************************************************/
    // get Selected gender list
    var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
    var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
    this.fabricInfo = GlobalInstance.uniformConfigurationInstance.getFabricsInfo();
    this.selectedStyle = GlobalInstance.getStyleAndDesignInstance().getSelectedStyle();


    var secondGenderId;
    if (genderInfo.Id == CONFIG.get('SPORT_GENDER_ID_MALE')) {
        secondGenderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_MALE');  //youth male case
    } else {
        secondGenderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_FEMALE'); // youth feamale case
    }

    //get youth style info
    var youthStyleInfo = JSON.parse(JSON.stringify(GlobalInstance.uniformConfigurationInstance.getYouthStylesInfo()));
    var youthStyleInfoForMatchingBottomStyle = null;
    youthStyleInfo = youthStyleInfo ? youthStyleInfo : '';

    if (!youthStyleInfo || Utility.getObjectlength(youthStyleInfo, 'fjs409') <= 0) {
        youthStyleInfo.StyleId = '';
        secondGenderId = '';
    }

    //Check the relative YouthStyleInfo for matching bottomid
    youthStyleInfoForMatchingBottomStyle = GlobalInstance.uniformConfigurationInstance.getBottomYouthStyleInfo();
    if (!youthStyleInfoForMatchingBottomStyle || Utility.getObjectlength(youthStyleInfoForMatchingBottomStyle, 'fjs409') <= 0) {
        youthStyleInfoForMatchingBottomStyle.StyleId = '';
    }

    var serverParams = {
        'applicationId': GlobalInstance.uniformConfigurationInstance.getApplicationId(),
        'genderTypeId': genderInfo.Id + '|' + secondGenderId,
        'categoryId': categoryInfo.Id,
        'StyleId': this.selectedStyle.StyleId + '|' + youthStyleInfo.StyleId,
        'FabricId': this.fabricInfo.FabricId
    };
    var params = null;
    params = {
        'isTop': true
    };
    this.getSizeAndPriceList(false, serverParams, params);
    if (this.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) {
        var bottomFabricInfo = this.getBottomFabricInfo(this.selectedStyle.MatchingBottomStyleId);
        params = {
            'isTop': false
        };
        serverParams.StyleId = this.selectedStyle.MatchingBottomStyleId + '|' + youthStyleInfoForMatchingBottomStyle.StyleId;
        serverParams.FabricId = bottomFabricInfo.FabricId;
        this.getSizeAndPriceList(false, serverParams, params);
    }
    /*****************************************************************/
};

/*
*This method returns bottom first fabric info
*/
Fabrics.prototype.getBottomFabricInfo = function (bottomStyleId) {
    try {
        var bottomStyleInfo = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(bottomStyleId);
        return bottomStyleInfo.Fabrics[0];
    } catch (err) {
        Log.error('Fabric.js--Fabrics.prototype.getBottomFabricId' + err.message);
    }
}


Fabrics.prototype.updateFabricPrice = function () {

};
/**
 * Performs a fetching style top and bottom size list.  
 * 
 * @param isCache Returns the sports list if set to true, else fetches the data from web and sets into sports list object
 * @return Object
 */
Fabrics.prototype.getSizeAndPriceList = function (isCache, serverParams, params) {
    try {
        if (isCache === false) {
            //Set price lisy and mark up price to parameter.
            serverParams.priceList = Utility.getFabricPriceList();
            serverParams.markUpPrice = objApp.markUpPrice;

            this.objCommHelper = new CommunicationHelper();
            this.objCommHelper.callAjax(this.fabricPriceUrl, 'GET', serverParams, this.responseType, null, this.fillSizeAndPriceList.bind(this), params, null, null, null, null);
            return null;
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description fabric 465: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
 * Fills the Size list into the object after recieving the list from Web Service. After filling the data, it loads the HTML and 
 *
 * @param response Response from Web service in json format containing sports list
 * @param params
 * 
 * @return void
 */
Fabrics.prototype.fillSizeAndPriceList = function (response, params) {
    try {
        var thisObject = this;
        var tempObject = new Object();
        if (this.objUtility.validateResponseFormat(response, this.fabricPriceUrl)) {
            $.each(response.ResponseData, function (i, sizeList) {
                tempObject["_" + sizeList.GenderTypeId] = sizeList.FabricSizes;
            });
            //set dynamic data and bind events
            if (params.isTop) {
                GlobalInstance.rosterInstance.setTopSizePriceList(tempObject);
            } else {
                GlobalInstance.rosterInstance.setBottomSizePriceList(tempObject);
            }
            if (thisObject.funcCallBack !== null && thisObject.funcCallBack !== undefined) {
                thisObject.funcCallBack();
            }
            // delete tempobject
            delete tempObject;

        } else {
            Log.error("Error in API");
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description fabric 506: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
*This method set the style information related to fabric in uniformconfiguration (Basketball Case)
*
*/
Fabrics.prototype.setMultiFabricStylesInfo = function (styleObject) {
    var copyOfStyleInfo = null;
    var youthStyleInfo = null;
    var copyOfYouthStyleInfo = null;

    GlobalInstance.styleAndDesignInstance = GlobalInstance.getStyleAndDesignInstance();
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    //Copy of style
    if (styleObject.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
        copyOfStyleInfo = JSON.parse(JSON.stringify(GlobalInstance.styleAndDesignInstance.getStyleByKey(styleObject.CopyOfStyleId)));
        delete copyOfStyleInfo.Fabrics;
        delete copyOfStyleInfo.PreviewImages;

        GlobalInstance.uniformConfigurationInstance.setCopiedStylesInfo(copyOfStyleInfo);

    }

    //Youth Style Info
    youthStyleInfo = JSON.parse(JSON.stringify(GlobalInstance.styleAndDesignInstance.getYouthStyleInfoByStyleId(styleObject.StyleId)));
    if (Utility.getObjectlength(youthStyleInfo, 'fbjs') > 0) {
        delete youthStyleInfo.Fabrics;// delete fabric information from Youthstyle object while storing into uniform conifuration   
        GlobalInstance.styleAndDesignInstance.setBottomYouthStyleInfo(styleObject);
        GlobalInstance.uniformConfigurationInstance.setYouthStylesInfo(youthStyleInfo);

        GlobalInstance.styleAndDesignInstance.youthStyleDesigns = new Object();
        GlobalInstance.styleAndDesignInstance.youthStyleIdArray = new Array();
        GlobalInstance.styleAndDesignInstance.getDesignsForYouth(); // Get the designs for the youth

        if (youthStyleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
            copyOfYouthStyleInfo = JSON.parse(JSON.stringify(GlobalInstance.styleAndDesignInstance.getYouthStyleByKey(youthStyleInfo.CopyOfStyleId)));
            if (copyOfYouthStyleInfo) {
                delete copyOfYouthStyleInfo.Fabrics;
                delete copyOfYouthStyleInfo.PreviewImages;
            }
        }
        GlobalInstance.uniformConfigurationInstance.setCopiedYouthStylesInfo(copyOfYouthStyleInfo);
    }

};