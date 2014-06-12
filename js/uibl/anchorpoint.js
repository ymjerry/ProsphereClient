/**
 * TWA proshpere configurator
 * 
 * anchorpoint.js is used to define anchor point related functions. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/**
 * This method returns the type of anchor point based on current panel.
 * return TYPES
 */
var LOCATION_TYPE = (function () {
    var TYPES = {
        "secPlayerNameAnchorPanel": "playername",
        "secEmblemAndGraphicsPanel": "graphic",
        "secPlayerNumberAnchorPanel": "playernumber",
        "secTeamNameAnchorPanel": "teamname",
        "secOtherTextAnchorPanel": "othertext",
        "secMyLockerPanel": "uploadedgraphic"
    };
    return {
        get: function (panelId) {
            return TYPES[panelId];
        }
    };
})();

/**
 * This method returns the type of anchor point based on current panel.
 * @return {PANELS} configurator panels to show
 */
var PANEL_ID = (function () {
    var PANELS = {
        "playername": "secPlayerNameAnchorPanel",
        "graphic": "secEmblemAndGraphicsPanel",
        "playernumber": "secPlayerNumberAnchorPanel",
        "teamname": "secTeamNameAnchorPanel",
        "othertext": "secOtherTextAnchorPanel",
        "uploadedgraphic": "secMyLockerPanel"
    };
    return {
        get: function (type) {
            return PANELS[type];
        }
    };
})();

/**
 * This method returns the name of anchor point location using a type.
 * @return {PANELS} Name of the respective panel
 */
var ANCHOR_LOCATION_NAME_FROM_TYPE = (function () {
    var PANELS = {
        "playername": "Player Name",
        "graphic": "Graphic",
        "playernumber": "Player Number",
        "teamname": "Team Name",
        "othertext": "Other Text",
        "uploadedgraphic": "Uploaded Graphic"
    };
    return {
        get: function (type) {
            try {
                return PANELS[type];
            } catch (e) {
                return '';
            }
        }
    };
})();


/**
 * Class constructor to assign default values
 *
 * @return void
 */

function AnchorPoint() {
    this.requestUrl = WEB_SERVICE_URL.get('GET_ANCHOR_POINTS', LOCAL);
    this.responseType = 'json';
    this.objCommHelper = new CommunicationHelper();
    this.backScreenId;
    this.funcCallBack = $.Callbacks('memory');
    this.playerNameAnchorPanelId = 'secPlayerNameAnchorPanel';
    this.emblemAndGraphicsPanel = 'secEmblemAndGraphicsPanel';
    this.playerNumberAnchorPanelId = 'secPlayerNumberAnchorPanel';
    this.teamNameAnchorPanelId = 'secTeamNameAnchorPanel';
    this.otherTextAnchorPanelId = 'secOtherTextAnchorPanel';
    this.myLockerPanelId = 'secMyLockerPanel';
    this.textUrl = new Array();

    this.allAnchorPoints = {}; //this variable keeps the decorated anchor points
    this.currentPanelId;
    this.isZoomView = false;
    this.htmlSlashImg = '<div class="slashImage"> </div>';

    //keeps the anchor point response data
    this.youthTopAnchorPointsResponseData = {}; //this variable keeps the  anchor point json of top style number for youth gender
    this.youthBottomAnchorPointsResponseData = {}; //this variable keeps the  anchor point json of bottom style number for youth gender

    this.adultTopAnchorPointsResponseData = {}; //this variable keeps the  anchor point json of top style number for adult gender
    this.adultBottomAnchorPointsResponseData = {}; //this variable keeps the  anchor point json of bottom style number for adult gender

    this.isYouthTopAnchorPointsWebServicesCalled = false;
    this.isAdultTopAnchorPointsWebServicesCalled = false;
    this.sizeObject = {};
    this.uniformlogoData = new Object();
    this.uniformlogoDataBottom = new Object();
    this.sublimatedTagData = new Object();
    this.sublimatedTagDataBottom = new Object();
    this.allAllanchors = new Object();
    this.callbackMethod = null;
    this.colorSetCallBack = null;
}
;

/*
 * This method takes the response from the GetStyleList API.
 * @param styleAndDesignList
 * @returns void
 * 
 */
AnchorPoint.prototype.init = function () {
    try {
        //Re-inittialize the data
        var thisObject = this;
        this.youthTopAnchorPointsResponseData = {};
        this.youthBottomAnchorPointsResponseData = {};
        this.adultTopAnchorPointsResponseData = {};
        this.adultBottomAnchorPointsResponseData = {};
        this.isYouthTopAnchorPointsWebServicesCalled = false;
        this.isAdultTopAnchorPointsWebServicesCalled = false;
        GlobalInstance.styleAndDesignInstance = GlobalInstance.getStyleAndDesignInstance()

        this.handleSizeCtrl();

        var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
        var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
        //todo get style and design of copied style
        var currentDesign = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
        if (Utility.getObjectlength(currentDesign) <= 0) {
            setTimeout(function () {
                thisObject.init();
            }, 100);
        } else {
            var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
            var selectedStyle = currentStyle;
            var copyOfStyleDesign = null;
            var copyOfStyle = GlobalInstance.uniformConfigurationInstance.getCopiedStylesInfo();
            if (copyOfStyle) {
                currentStyle = copyOfStyle;
                copyOfStyleDesign = Utility.getDesignObject(currentStyle.StyleId, currentDesign.DesignNumber, false, true);
            }
            if (copyOfStyleDesign) {
                currentDesign = copyOfStyleDesign;
            }
            var genderId = genderInfo.Id;


            //Do not call the api if same style and design is clicked 
            if (GlobalInstance.styleAndDesignInstance.previousSelectedStyle.StyleId == selectedStyle.StyleId) {
                if (Utility.getObjectlength(GlobalInstance.styleAndDesignInstance.previousSelectedDesign) > 0 && GlobalInstance.styleAndDesignInstance.previousSelectedDesign.DesignId == currentDesign.DesignId) {
                    return;
                }
            }

            var params = {
                "applicationId": GlobalConfigurationData.applicationId,
                "categoryId": categoryInfo.Id,
                "genderId": genderId,
                "styleId": currentStyle.StyleId,
                "designId": currentDesign.DesignId,
            };
            GlobalInstance.colorInstance = GlobalInstance.getColorInstance(null, null, null);
            this.isAdultTopAnchorPointsWebServicesCalled = true;
            this.objCommHelper = new CommunicationHelper();
            this.allAnchorPoints = new Object();  //reinitialize the anchor points object
            this.objCommHelper.callAjax(this.requestUrl, 'GET', params, this.responseType, null, this.handleWebRequestCallback.bind(this), null, this.fillAnchorPointColorCtrl.bind(this), null, null, null);


            //GlobalInstance.colorInstance.addCallback(this.fillAnchorPointColorCtrl.bind(this));

            //get data for youth gender also
            this.getYouthGenderData();
        }
    } catch (e) {
    }
};

/**
 * Shows the anchor point screen
 * @params panelId current panel ID
 * @return void
 */
AnchorPoint.prototype.show = function (panelId) {
    //show screen
    var thisObject = this;
    this.currentPanelId = panelId;
    $("#secAnchorPanel").show();

    this.colorSetCallBack = function () {
        //2. Create preview image based on colors and text.
        thisObject.previewAnchorImage();
    }
    //populate color box from global configuration based on panel id and also updates the anchor point data
    this.updateAnchorPointDataUI();

    //set size values
    this.setCurrentSelectedAnchorSizeValues();

    //2. Create preview image based on colors and text.
    //this.previewAnchorImage();

    //update model preview
    // no need to update model preview on showing screens
    //LiquidPixels.updateModelPreview('apjs 194');

    //plot the points
    this.setAnchorPoints();

    //bind navigation buttons
    this.bindNavigationButtons();

    //hide color controls if current panel id locker
    if (this.currentPanelId === this.myLockerPanelId) {
        $('#dvAnchorPointColorDetails').hide();
    } else {
        $('#dvAnchorPointColorDetails').show();
    }
};

/**
 * Hide the anchor point screen
 * @return void
 */
AnchorPoint.prototype.hide = function () {
    $("#secAnchorPanel").hide();
};


/*
 * Fetches the youth gender data
 * @returns {undefined}
 */
AnchorPoint.prototype.getYouthGenderData = function () {
    try {
        var thisObject = this;
        var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
        var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
        var currentDesign = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();//Adult Design Info
        var currentStyle = GlobalInstance.uniformConfigurationInstance.getYouthStylesInfo();
        var genderId = genderInfo.Id;
        var copyOfYouthStyle = GlobalInstance.uniformConfigurationInstance.getCopiedYouthStylesInfo();

        //if youth design list is not prepared, wait for one second and call it again
        if (Utility.getObjectlength(currentDesign) < 0 || Utility.getObjectlength(currentStyle) < 0) {
            setTimeout(function () {
                thisObject.getYouthGenderData();
            }, 100);
            return;
        } else {
            if (Utility.getObjectlength(copyOfYouthStyle) > 0) {
                currentStyle = copyOfYouthStyle;
            }
            var adultStyleInfo = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(currentStyle.AdultStyleId);
            currentDesign = Utility.getDesignObject(adultStyleInfo.StyleId, currentDesign.DesignNumber, false, false);

            var youthGenderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_MALE');
            if (genderId == CONFIG.get('SPORT_GENDER_ID_MALE')) {
                youthGenderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_MALE');  //youth male case
            } else {
                youthGenderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_FEMALE'); // youth feamale case
            }
            var params = {
                "applicationId": GlobalConfigurationData.applicationId,
                "categoryId": categoryInfo.Id,
                "genderId": youthGenderId,
                "styleId": currentStyle.StyleId,
                "designId": currentDesign.DesignId,
            };

            //call youth gender data
            this.isYouthTopAnchorPointsWebServicesCalled = true
            var objCommHelper = new CommunicationHelper();
            objCommHelper.callAjax(this.requestUrl, 'GET', params, this.responseType, null, this.handleYouthWebRequestCallback.bind(this), null, null, null, null, null);
        }
    } catch (err) {

    }
};

/**
 * This method keeps the data for youth gender anchor points
 * @param  response JSON Object
 * @returns {void}
 */
AnchorPoint.prototype.handleYouthWebRequestCallback = function (response, params) {
    var adultStyleInfo = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
    if (response.ResponseData) {
        if (this.isYouthTopAnchorPointsWebServicesCalled) {
            this.youthTopAnchorPointsResponseData = response.ResponseData;
        } else {
            this.youthBottomAnchorPointsResponseData = response.ResponseData;
        }
    }


    //if style also contains a bottom, than also get its anchor points data for bottom
    if (this.isYouthTopAnchorPointsWebServicesCalled && adultStyleInfo.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) {
        var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
        var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
        var currentDesign = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
        var adultBottomStyleInfo = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(adultStyleInfo.MatchingBottomStyleId);
        var matchingYouthBottomStyleInfo = GlobalInstance.getStyleAndDesignInstance().getYouthStyleInfoByStyleId(adultBottomStyleInfo.StyleId);
        if (matchingYouthBottomStyleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
            matchingYouthBottomStyleInfo = GlobalInstance.getStyleAndDesignInstance().getYouthStyleByKey(matchingYouthBottomStyleInfo.CopyOfStyleId);
        }

        currentDesign = Utility.getDesignObject(adultBottomStyleInfo.StyleId, currentDesign.DesignNumber, false, false);
        var genderId = genderInfo.Id;
        var youthGenderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_MALE');
        if (genderId == CONFIG.get('SPORT_GENDER_ID_MALE')) {
            youthGenderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_MALE');  //youth male case
        } else {
            youthGenderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_FEMALE'); // youth feamale case
        }


        params = {
            "applicationId": GlobalConfigurationData.applicationId,
            "categoryId": categoryInfo.Id,
            "genderId": youthGenderId,
            "styleId": matchingYouthBottomStyleInfo.StyleId,
            "designId": currentDesign.DesignId
        };

        this.isYouthTopAnchorPointsWebServicesCalled = false;
        var objCommHelper = new CommunicationHelper();
        objCommHelper.callAjax(this.requestUrl, 'GET', params, this.responseType, null, this.handleYouthWebRequestCallback.bind(this), null, null, null, null, null);
        return;
    }
};

/**
 * This method handles the anchor point json response and populate the local variable
 * 
 * 
 *@param  response JSON Object
 * @returns {void}
 */
AnchorPoint.prototype.handleWebRequestCallback = function (response, params) {
    var thisObject = this;
    var anchorPointsUniform = GlobalInstance.uniformConfigurationInstance.getAnchorPoints();
    var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
    var copyOfStyle = GlobalInstance.uniformConfigurationInstance.getCopiedStylesInfo();
    var currentDesign = GlobalInstance.getUniformConfigurationInstance().getDesignsInfo();
    //parse the json and put the required data in local object
    if (response.ResponseData) {


        //Callback fires for once from Retrieval Code
        if (isFirstTimeLoadFromRC) {
            //Retrieval Code case. Go To Roster button click event fires when anchor point instance is received
            if (this.isAdultTopAnchorPointsWebServicesCalled) {
                if (currentStyle.MatchingBottomStyleId > CONFIG.get("MATCHING_STYLE_ID_BOTTOM")) {
                    //Do not fire the callback if the style has bottom style id.
                } else {
                    GlobalFlags.setScreenFlags('isAnchorPointDataRecieved', true);
                    isFirstTimeLoadFromRC = false;
                    if (typeof this.callbackMethod == 'function' && GlobalFlags.getScreenFlags('isFabricScreenLoaded') == true) {
                        GlobalInstance.anchorPointInstance.callbackMethod.call();
                    } else {
                        setTimeout(function () {
                            if (typeof this.callbackMethod == 'function' && GlobalFlags.getScreenFlags('isFabricScreenLoaded') == true) {
                                GlobalInstance.anchorPointInstance.callbackMethod.call();
                            }
                        }, 50);
                    }
                }
            } else {
                isFirstTimeLoadFromRC = false;
                GlobalFlags.setScreenFlags('isAnchorPointDataRecieved', true);
                if (typeof this.callbackMethod == 'function' && GlobalFlags.getScreenFlags('isFabricScreenLoaded') == true) {
                    GlobalInstance.anchorPointInstance.callbackMethod.call();
                } else {
                    setTimeout(function () {
                        if (typeof this.callbackMethod == 'function' && GlobalFlags.getScreenFlags('isFabricScreenLoaded') == true) {
                            GlobalInstance.anchorPointInstance.callbackMethod.call();
                        }
                    }, 50);
                }
            }
        }
        
        //save the response data into the class variables for use in production chain
        if (this.isAdultTopAnchorPointsWebServicesCalled) {
            this.adultTopAnchorPointsResponseData = response.ResponseData;
        } else {
            //over write the current style with bottom style to get the bottom style data
            currentStyle = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(currentStyle.MatchingBottomStyleId);
            currentDesign = Utility.getDesignObject(currentStyle.StyleId, currentDesign.DesignNumber, false);
            copyOfStyle = currentStyle;
            if (currentStyle.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                copyOfStyle = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(currentStyle.CopyOfStyleId);
            }
            this.adultBottomAnchorPointsResponseData = response.ResponseData;
        }

        var firstSizeObject = null;
        var selectedIndex = -1;

        if (Utility.getObjectlength(copyOfStyle) > 0) {
            currentStyle = copyOfStyle;
        }
        //get size array from first gender object
        var sizesArray = new Array();
        $.each(response.ResponseData, function (i, size) {
            sizesArray.push(size);
            if (size.SizeNumber == currentDesign.PreviewDecalSizeNumber) {
                selectedIndex = i;
            }
        });

        //get first size object
        if (Utility.getObjectlength(sizesArray, 'handleWebRequestCallback') > 0) {
            //traverse aray according to the size of the design
            if (selectedIndex != -1) {
                firstSizeObject = sizesArray[selectedIndex];
            } else {
                firstSizeObject = sizesArray[0];
            }
            // firstSizeObject = sizesArray[selectedIndex];
            this.sizeObject = firstSizeObject;

            //traverse anchor points from first size object
            if (firstSizeObject.AnchorPoints) {

                $.each(firstSizeObject.AnchorPoints, function (i, ap) {
                    var anchorPoint = new AnchorPointData();

                    //if anchor point exists then use the exisitng object
                    if (thisObject.allAnchorPoints[ap.AnchorPointId]) {
                        anchorPoint = thisObject.allAnchorPoints[ap.AnchorPointId];
                    }

                    if (ap.Content) {
                        var containtData = {}
                        if (ap.Content.ContentId == CONFIG.get("CONTENT_ID_LOGO")) {
                            containtData.X = ap.X;
                            containtData.Y = ap.Y;
                            containtData.Rotation = ap.Rotation;
                            containtData.anchorPointId = ap.AnchorPointId;
                            containtData.sizeId = ap.SizeId;
                            containtData.isTop = thisObject.isAdultTopAnchorPointsWebServicesCalled;
                            if (thisObject.isAdultTopAnchorPointsWebServicesCalled) {
                                thisObject.uniformlogoData = containtData;
                            } else {
                                thisObject.uniformlogoDataBottom = containtData;
                            }

                        }
                        if (ap.Content.ContentId == CONFIG.get("CONTENT_ID_TAG")) {
                            containtData.X = ap.X;
                            containtData.Y = ap.Y;
                            containtData.Rotation = ap.Rotation;
                            containtData.anchorPointId = ap.AnchorPointId;
                            containtData.sizeId = ap.SizeId;
                            containtData.isTop = thisObject.isAdultTopAnchorPointsWebServicesCalled;
                            if (thisObject.isAdultTopAnchorPointsWebServicesCalled) {
                                thisObject.sublimatedTagData = containtData;
                            } else {
                                thisObject.sublimatedTagDataBottom = containtData;
                            }
                        }

                    }

                    anchorPoint.id = ap.AnchorPointId;
                    anchorPoint.styleId = currentStyle ? currentStyle.StyleId : '',
                    anchorPoint.styleDesignId = ap.StyleDesignId,
                    anchorPoint.isForTop = thisObject.isAdultTopAnchorPointsWebServicesCalled;
                    anchorPoint.allowPlayerName = ap.AllowPlayerName;
                    anchorPoint.allowPlayerNumber = ap.AllowPlayerNumber;
                    anchorPoint.allowTeamName = ap.AllowText;
                    anchorPoint.allowOtherText = ap.AllowText;
                    anchorPoint.allowemblemAndGraphics = ap.AllowGraphics;
                    anchorPoint.AllowUploadedGraphics = ap.AllowUploadedGraphics;
                    anchorPoint.x = ap.AnchorDiagramX;
                    anchorPoint.Y = ap.AnchorDiagramY;
                    anchorPoint.ZoomAnchorDiagramX = ap.ZoomAnchorDiagramX;
                    anchorPoint.ZoomAnchorDiagramY = ap.ZoomAnchorDiagramY;
                    anchorPoint.chainX = ap.X;
                    anchorPoint.chainY = ap.Y;
                    anchorPoint.displayName = ap.Name;
                    if (ap.ZoomAnchorDiagram) {
                        anchorPoint.zoomAnchorDiagramImage = ap.ZoomAnchorDiagram.FileLocation;
                    }
                    anchorPoint.AnchorDiagramImage = ap.AnchorDiagram;
                    anchorPoint.Rotation = ap.Rotation;
                    anchorPoint.MirrorCapability = ap.MirrorCapability;
                    anchorPoint.DisableScaling = ap.DisableScaling;
                    anchorPoint.Mask = ap.Mask;
                    if (ap.PreviewImage) {
                        anchorPoint.PreviewImageName = ap.PreviewImage.Name;
                        anchorPoint.PreviewImageID = ap.PreviewImage.PreviewImageId;
                    }
                    anchorPoint.Width = ap.Width;
                    anchorPoint.Height = ap.Height;

                    anchorPoint.RelationshipId = ap.RelationshipId;
                    anchorPoint.RelationSpace = ap.RelationSpace;
                    anchorPoint.RelativeAnchorId = ap.RelativeAnchorId;
                    anchorPoint.AnchorOriginId = ap.AnchorOriginId;
                    //anchorPoint.rel

                    //sizes data
                    anchorPoint.GraphicSizes = ap.GraphicSizes;
                    anchorPoint.EmblemsSizes = ap.EmblemsSizes;
                    anchorPoint.UploadedGraphicSizes = ap.UploadedGraphicSizes;
                    anchorPoint.PlayerNameSizes = ap.PlayerNames;
                    anchorPoint.PlayerNumberSizes = ap.PlayerNumbers;
                    anchorPoint.TextSizes = ap.TextSizes;


                    if (Utility.getObjectlength(anchorPointsUniform) > 0) {
                        $.each(anchorPointsUniform, function (i, uniformAnchorPoint) {
                            if (uniformAnchorPoint.displayName == ap.Name) {
                                anchorPoint.FontColor = GlobalInstance.colorInstance.getColorByKey('_' + uniformAnchorPoint.FontColor);
                                anchorPoint.FontOutlineColor1 = GlobalInstance.colorInstance.getColorByKey('_' + uniformAnchorPoint.FontOutlineColor1);
                                anchorPoint.FontOutlineColor2 = GlobalInstance.colorInstance.getColorByKey('_' + uniformAnchorPoint.FontOutlineColor2);
                                anchorPoint.Text = uniformAnchorPoint.Text;
                                anchorPoint.IsDecorated = true;
                                anchorPoint.graphicUrl = uniformAnchorPoint.GraphicUrl;
                                anchorPoint.graphicId = uniformAnchorPoint.GraphicId;
                                anchorPoint.colorsChoiceCount = uniformAnchorPoint.ColorsChoiceCount;
                                anchorPoint.TextOrientation = uniformAnchorPoint.TextOrientation;
                                anchorPoint.selectedSize = uniformAnchorPoint.Size;
                                anchorPoint.graphicName = uniformAnchorPoint.GraphicName;
                                anchorPoint.graphicCategoryId = uniformAnchorPoint.GraphicCategoryId;
                                anchorPoint.graphicCategoryName = uniformAnchorPoint.GraphicCategoryName;
                                anchorPoint.graphicSubCategoryId = uniformAnchorPoint.GraphicSubCategoryId;
                                anchorPoint.graphicSubCategoryName = uniformAnchorPoint.GraphicSubCategoryName;
                                //anchorPoint.graphicName = uniformAnchorPoint.GraphicName;
                                anchorPoint.graphicWidth = uniformAnchorPoint.GraphicWidth;
                                anchorPoint.graphicHeight = uniformAnchorPoint.GraphicHeight;
                                anchorPoint.isFlip = (uniformAnchorPoint.isFlip == 'true') ? true : false;
                                anchorPoint.isSameDimensionCheck = (uniformAnchorPoint.isSameDimensionCheck == 'true') ? true : false;
                                //anchorPoint.isFlip = Utility.stringToBoolean(uniformAnchorPoint.isFlip);

                                if (uniformAnchorPoint.type) {
                                    anchorPoint.SelectionPanelId = PANEL_ID.get(uniformAnchorPoint.type);
                                }

                                if (uniformAnchorPoint.FontId) {
                                    anchorPoint.Font = GlobalInstance.fontInstance.getFontByKey(uniformAnchorPoint.FontId);
                                }
                            }
                        });
                    }
                    thisObject.allAnchorPoints[anchorPoint.id] = anchorPoint;
                });

                if (Utility.getObjectlength(this.uniformlogoData) > 0) {
                    GlobalInstance.getUniformConfigurationInstance().setUniformLogoData(this.uniformlogoData);
                }
                if (Utility.getObjectlength(this.uniformlogoDataBottom) > 0) {
                    GlobalInstance.getUniformConfigurationInstance().setUniformLogoDataBottom(this.uniformlogoDataBottom);
                }
                if (Utility.getObjectlength(this.sublimatedTagData) > 0) {
                    GlobalInstance.getUniformConfigurationInstance().setUniformsubmilatedTagData(this.sublimatedTagData);
                }
                if (Utility.getObjectlength(this.sublimatedTagDataBottom) > 0) {
                    GlobalInstance.getUniformConfigurationInstance().setUniformsubmilatedTagDataBottom(this.sublimatedTagDataBottom);
                }
                //Create same for Sublimated tag
            }
        }
    }

    //if style also contains a bottom, than also get its anchor points data for bottom

    if (this.isAdultTopAnchorPointsWebServicesCalled) {
        currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();

        if (currentStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) {
            var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
            var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
            var matchingBottomStyle = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(currentStyle.MatchingBottomStyleId);
            if (matchingBottomStyle.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                matchingBottomStyle = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(matchingBottomStyle.CopyOfStyleId);
            }
            var genderId = genderInfo.Id;

            params = {
                "applicationId": GlobalConfigurationData.applicationId,
                "categoryId": categoryInfo.Id,
                "genderId": genderId,
                "styleId": matchingBottomStyle.StyleId,
                "designId": currentDesign.DesignId
            };

            this.isAdultTopAnchorPointsWebServicesCalled = false;
            this.objCommHelper = new CommunicationHelper();
            this.objCommHelper.callAjax(this.requestUrl, 'GET', params, this.responseType, null, this.handleWebRequestCallback.bind(this), null, null, null, null, null);
            return;
        }
    }
    //set an array in global configuration
    this.setAnchorPointsInUniformConfiguration();


    //update the model preview if all data is recieved
    var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();

    if (currentStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) {
        if (!this.isAdultTopAnchorPointsWebServicesCalled) {
            LiquidPixels.updateModelPreview('apjs 529');
            //plot the points
            this.setAnchorPoints();
        }
    } else {
        LiquidPixels.updateModelPreview('apjs 534');
        //plot the points
        this.setAnchorPoints();
    }
    //fire the event for required callbacks
    this.funcCallBack.fire();
};

/**
 * Set the back anchor points to uniform configuration
 * @return void
 */
AnchorPoint.prototype.setAnchorPointsInUniformConfiguration = function () {

    if (this.allAnchorPoints) {
        var selectedData = {};
        //var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();

        for (var key in this.allAnchorPoints) {
            var apData = this.allAnchorPoints[key]; //&& apData.styleId == currentStyle.StyleId
            if (apData.IsDecorated) {
                selectedData['_' + apData.id] = {
                    'id': apData.id,
                    'isForTop': apData.isForTop,
                    'StyleId': apData.styleId,
                    'styleDesignId': apData.styleDesignId,
                    'x': apData.x,
                    'Y': apData.Y,
                    'chainX': apData.chainX,
                    'chainY': apData.chainY,
                    'Size': apData.selectedSize,
                    'Text': apData.Text || '',
                    'TextOrientation': apData.TextOrientation,
                    'GraphicId': apData.graphicId,
                    'ColorsChoiceCount': apData.colorsChoiceCount,
                    'GraphicUrl': apData.graphicUrl,
                    'GraphicName': apData.graphicName,
                    'GraphicCategoryName': apData.graphicCategoryName,
                    'GraphicSubCategoryName': apData.graphicSubCategoryName,
                    'GraphicCategoryId': apData.graphicCategoryId,
                    'GraphicSubCategoryId': apData.graphicSubCategoryId,
                    'GraphicWidth': apData.graphicWidth,
                    'GraphicHeight': apData.graphicHeight,
                    'Font': apData.Font ? (apData.Font.FileLocation || apData.Font.fileloc) : '',
                    'FontId': apData.Font ? (apData.Font.fontid || apData.Font.FontId) : '',
                    'FontName': apData.Font ? (apData.Font.displayname || apData.Font.Name) : '',
                    'FontColor': (apData.FontColor) ? (apData.FontColor.ColorId || apData.FontColor.colorid) : '',
                    'FontOutlineColor1': (apData.FontOutlineColor1) ? (apData.FontOutlineColor1.ColorId || apData.FontOutlineColor1.colorid) : '',
                    'FontOutlineColor2': (apData.FontOutlineColor2) ? (apData.FontOutlineColor2.ColorId || apData.FontOutlineColor2.colorid) : '',
                    'allowPlayerNumber': apData.allowPlayerNumber,
                    'allowemblemAndGraphics': apData.allowemblemAndGraphics,
                    'AllowUploadedGraphics': apData.AllowUploadedGraphics,
                    'allowPlayerName': apData.allowPlayerName,
                    'allowTeamName': apData.allowTeamName,
                    'allowOtherText': apData.allowOtherText,
                    'type': LOCATION_TYPE.get(apData.SelectionPanelId),
                    'displayName': apData.displayName,
                    'Rotation': apData.Rotation,
                    'isFlip': apData.isFlip,
                    'Mask': apData.Mask,
                    'PreviewImageName': apData.PreviewImageName,
                    'PreviewImageID': apData.PreviewImageID,
                    'Width': apData.Width,
                    'Height': apData.Height,
                    'MirrorCapability': apData.MirrorCapability,
                    'DisableScaling': apData.DisableScaling,
                    'AnchorOriginId': apData.AnchorOriginId,
                    'RelationshipId': apData.RelationshipId,
                    'RelationSpace': apData.RelationSpace,
                    'RelativeAnchorId': apData.RelativeAnchorId,
                    'isFlip': apData.isFlip,
                    'isSameDimensionCheck': apData.isSameDimensionCheck
                };
            }
        }
    }
    GlobalInstance.uniformConfigurationInstance.setAnchorPoints(selectedData);
};

/**
 * This method sets the back screen id 
 * @return void
 */
AnchorPoint.prototype.setBackScreenId = function (id) {
    this.backScreenId = id;
};

/**
 * Get the back screen id 
 * @return void
 */
AnchorPoint.prototype.getBackScreenId = function () {
    return this.backScreenId;
};

/**
 * Add the call back function.
 * @return void
 */
AnchorPoint.prototype.addCallback = function (funcName) {
    this.funcCallBack.add(funcName);
};

/**
 * Remove the call back function.
 * @return void
 */
AnchorPoint.prototype.removeCallback = function (funcName) {
    this.funcCallBack.remove(funcName);
};

/**
 * Set the all anchor points to screen
 * @return void
 */
AnchorPoint.prototype.setAnchorPoints = function () {
    var currentObj = this;
    var imagePath = '';
    var isApAvailable = false;
    var isBaseImageSet = false;
    var dvAnchorApplyBox = $('#dvAnchorApplyBox');
    var anchorBaseImage = $('<img>').attr('src', '');
    var anchoSubBaseImage = $('<img>').attr('src', '');
    var uniformAnchorData = GlobalInstance.getUniformConfigurationInstance().getAnchorPoints();
    dvAnchorApplyBox.html('');
    if (this.allAnchorPoints) {
        currentObj.hideAnchorEditButtons();
        if (Utility.getObjectlength(this.allAnchorPoints, 'setAnchorPoints') <= 0) {
            return;
        }


        var anchorImagePath = '';
        var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
        var selectedStyle = currentStyle;
        var copyOfStyle = GlobalInstance.uniformConfigurationInstance.getCopiedStylesInfo();
        if (Utility.getObjectlength(copyOfStyle) > 0) {
            currentStyle = copyOfStyle;
        }
        var currentBottomStyle = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(selectedStyle.MatchingBottomStyleId);
        var selectedBottomStyle = null;
        if (currentBottomStyle && Utility.getObjectlength(currentBottomStyle) > 0) {
            selectedBottomStyle = currentBottomStyle;
            if (currentBottomStyle.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                currentBottomStyle = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(currentBottomStyle.CopyOfStyleId);
            }
        }
        for (var key in this.allAnchorPoints) {
            var anchorObject = currentObj.allAnchorPoints[key];

            //do not plot the anchor point on AnchorDiagram/ZoomAnchorDDiagram if they do not belong to current style
            if (anchorObject.isForTop) {
                if (anchorObject.styleId != currentStyle.StyleId) {
                    continue;
                }
            } else {
                if (currentBottomStyle) {
                    if (anchorObject.styleId != currentBottomStyle.StyleId) {
                        continue;
                    }
                }
            }

            if (!anchorImagePath && anchorObject.isForTop) {
                anchorImagePath = anchorObject.AnchorDiagramImage;
                //set anchor base image
                if (!isBaseImageSet) {
                    imagePath = anchorImagePath;
                    imagePath = imagePath.replace(currentStyle.StyleNumber, selectedStyle.StyleNumber);
                    imagePath = imagePath.replace('anchor_' + currentStyle.StyleNumber, 'anchor_' + selectedStyle.StyleNumber);

                    //reset the flag value
                    isBaseImageSet = true;
                    var baseImageSouce = LiquidPixels.getAnchorPointDiagramImage(imagePath);
                    anchorBaseImage.attr('src', baseImageSouce);
                }
            }


            if (this.isAnchorSupportedOnCurrentPanel(anchorObject)) {
                //set anchor point
                isApAvailable = true;
                var anchorPointImage = currentObj.setAnchorPoint(anchorObject, dvAnchorApplyBox, anchorBaseImage, anchorObject.x, anchorObject.Y);


                //updates the image object in array and updates the anchor image
                //var anchorObject = currentObj.allAnchorPoints[ap.id];
                anchorObject.image = anchorPointImage;
                currentObj.allAnchorPoints[anchorObject.id] = anchorObject;
                anchorObject.setImage();

                //handle anchor point click
                anchorPointImage.click(function () {
                    //show zoomed scrren
                    var clickedAnchorPointId = $(this).attr('id');

                    var clickedAnchorPoint = currentObj.allAnchorPoints[clickedAnchorPointId];



                    ////show alert if anchor point is already decorated   
                    //if (clickedAnchorPoint.IsDecorated && !clickedAnchorPoint.IsSelected) {
                    //    GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                    //    GlobalInstance.dialogBoxInstance.funcCallBack = function () {
                    //        currentObj.handleAnchorPointRemove(clickedAnchorPoint,true);
                    //        $('#' + clickedAnchorPointId).click();
                    //    };
                    //    GlobalInstance.dialogBoxInstance.funcCallBackForCancel = function () {
                    //        //do not do anythiing
                    //    };
                    //    GlobalInstance.dialogBoxInstance.displayOverrideAnchorPointDialogBox(TITLE.get('TITLE_ANCHOR_POINT_OVVERIDE'), MESSAGES.get('MESSAGE_ANCHOR_POINT_OVVERIDE'));
                    //    return;
                    //}

                    if (clickedAnchorPoint.IsDecorated) {
                        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                        GlobalInstance.dialogBoxInstance.funcCallBack = function () {
                            //var tmpISameDimensionCheck = clickedAnchorPoint.isSameDimensionCheck;
                            //  var tmpSelectedSize = clickedAnchorPoint.selectedSize;

                            currentObj.handleAnchorPointRemove(clickedAnchorPoint, true);
                            $('#' + clickedAnchorPoint.id).click();
                            setTimeout(function () {
                                var anchorObj = currentObj.getSelectedAnchorObj();
                                // anchorObj.isSameDimensionCheck = tmpISameDimensionCheck
                                // anchorObj.selectedSize = tmpSelectedSize;

                                currentObj.UpdateSameSizeDimension(anchorObj);
                                //currentObj.setCurrentSelectedAnchorSizeValues(anchorObj);


                            }, 50);

                        };
                        GlobalInstance.dialogBoxInstance.funcCallBackForCancel = function () {
                            //do not do anythiing
                        };
                        GlobalInstance.dialogBoxInstance.displayOverrideAnchorPointDialogBox(TITLE.get('TITLE_ANCHOR_POINT_OVVERIDE'), MESSAGES.get('MESSAGE_ANCHOR_POINT_OVVERIDE'));
                        return;
                    }
                    else {
                        //Bind the Same Dimension check box event
                        currentObj.UpdateSameSizeDimension(clickedAnchorPoint);
                    }


                    var apStartTime = new Date().getTime();
                    var apStart = new Date(apStartTime);
                    Log.trace('1) STARTS: Anchor point process started on ' + (apStart.toString()))

                    dvAnchorApplyBox.html('');

                    //set the clicked anchor as selected
                    currentObj.selectAnchor(clickedAnchorPoint, anchorPointImage, false);

                    //show the box of flip, undo, and remove
                    currentObj.showAnchorEditButtons();

                    //draw zoomed screen using sub anchor points
                    var zoomImagePath = clickedAnchorPoint.zoomAnchorDiagramImage;
                    zoomImagePath = zoomImagePath.replace(currentStyle.StyleNumber, selectedStyle.StyleNumber);
                    zoomImagePath = zoomImagePath.replace('anchor_' + currentStyle.StyleNumber, 'anchor_' + selectedStyle.StyleNumber);
                    anchoSubBaseImage = $('<img>').attr('src', LiquidPixels.getAnchorPointDiagramImage(zoomImagePath));

                    //populate zoom sub anchor points array
                    var subAnchorPoints = new Array();
                    for (var key2 in currentObj.allAnchorPoints) {
                        var temAP = currentObj.allAnchorPoints[key2];

                        if (currentObj.isAnchorSupportedOnCurrentPanel(temAP) && temAP.zoomAnchorDiagramImage == clickedAnchorPoint.zoomAnchorDiagramImage) {
                            subAnchorPoints.push(temAP);
                        }
                    }

                    //bind click events of sub anchor points
                    $.each(subAnchorPoints, function (j, subAp) {
                        var zoomAnchorDiagramX = parseInt(subAp.ZoomAnchorDiagramX) || 0;
                        if (zoomAnchorDiagramX == NaN) {
                            zoomAnchorDiagramX;
                        }
                        //zoomAnchorDiagramX = zoomAnchorDiagramX >= 13 ? zoomAnchorDiagramX - 13 : 0;
                        zoomAnchorDiagramX = zoomAnchorDiagramX >= 0 ? zoomAnchorDiagramX : 0;

                        var subAnchorPointImage = currentObj.setAnchorPoint(subAp, dvAnchorApplyBox, anchoSubBaseImage, zoomAnchorDiagramX, subAp.ZoomAnchorDiagramY);

                        //updates the image object in array
                        var anchorObject = currentObj.allAnchorPoints[subAp.id];
                        anchorObject.image = subAnchorPointImage;
                        currentObj.allAnchorPoints[subAp.id] = anchorObject;
                        anchorObject.setImage();

                        //handle sub anchor point click
                        subAnchorPointImage.click(function () {

                            var clickedASubAnchorPoint = currentObj.allAnchorPoints[$(this).attr('id')];

                            //Bind the Same Dimension check box event

                            //show alert if anchor point is already decorated
                            if (clickedASubAnchorPoint.IsDecorated) {
                                GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                                GlobalInstance.dialogBoxInstance.funcCallBack = function () {
                                    //  var tmpISameDimensionCheck = clickedASubAnchorPoint.isSameDimensionCheck;
                                    //  var tmpSelectedSize = clickedASubAnchorPoint.selectedSize;

                                    currentObj.handleAnchorPointRemove(clickedASubAnchorPoint, true);
                                    $('#' + clickedASubAnchorPoint.id).click();

                                    setTimeout(function () {
                                        var anchorObj = currentObj.getSelectedAnchorObj();
                                        //anchorObj.isSameDimensionCheck = tmpISameDimensionCheck
                                        // anchorObj.selectedSize = tmpSelectedSize;

                                        currentObj.UpdateSameSizeDimension(anchorObj);
                                        //currentObj.setCurrentSelectedAnchorSizeValues(anchorObj);

                                    }, 50);

                                };
                                GlobalInstance.dialogBoxInstance.funcCallBackForCancel = function () {
                                    //do not do anythiing
                                };
                                GlobalInstance.dialogBoxInstance.displayOverrideAnchorPointDialogBox(TITLE.get('TITLE_ANCHOR_POINT_OVVERIDE'), MESSAGES.get('MESSAGE_ANCHOR_POINT_OVVERIDE'));
                                return;
                            }
                            else {
                                //Bind the Same Dimension check box event
                                currentObj.UpdateSameSizeDimension(clickedASubAnchorPoint);
                            }
                            currentObj.selectAnchor(clickedASubAnchorPoint, subAnchorPointImage, true);
                        });

                        /*if (subAp.AnchorPointId == ap.AnchorPointId) {
                         subAnchorPointImage.attr('src', anchorPointImageSelected);
                         }*/

                        var closeButton = $('<span>').addClass('close_zoom_anchor_screen');
                        //closeButton.html('X');
                        closeButton.click(function () {
                            currentObj.hideAnchorEditButtons();
                            currentObj.setAnchorPoints();
                        });
                        dvAnchorApplyBox.append(closeButton);
                    });
                    var apEndTime = new Date().getTime();
                    var epEnd = new Date(apEndTime);
                    Log.trace('1) FINISH: Anchor point process finished on ' + (epEnd.toString()))
                });/////////////////////
            }
        }
        //If the current panel don't has anchor points , we have to show the base image
        if (!isApAvailable) {
            var alterNateImagePath = anchorImagePath;
            var anchordiv = '<div>'
            var imgTag = '';
            alterNateImagePath = alterNateImagePath.replace(currentStyle.StyleNumber, selectedStyle.StyleNumber);
            alterNateImagePath = alterNateImagePath.replace('anchor_' + currentStyle.StyleNumber, 'anchor_' + selectedStyle.StyleNumber);
            imgTag += '<img src=' + LiquidPixels.getAnchorPointDiagramImage(alterNateImagePath) + '/>'
            anchordiv += imgTag;
            anchordiv += '</div>'
            dvAnchorApplyBox.html(anchordiv);
        }
        //});
    }
};

/**
 * Show anchor buttons.
 * @return void
 */
AnchorPoint.prototype.showAnchorEditButtons = function () {
    this.isZoomView = true;
    $('#dvIdAnchorButtons').show();
};

/**
 * Hide anchor buttons.
 * @return void
 */
AnchorPoint.prototype.hideAnchorEditButtons = function () {
    this.isZoomView = false;
    $('#dvIdAnchorButtons').hide();
};

/**
 * create the anchor point image object and append it on the passed applybox html object
 * 
 * @param {type} ap
 * @param {type} dvAnchorApplyBox
 * @param {type} anchorImage
 * @returns {unresolved}
 */
AnchorPoint.prototype.setAnchorPoint = function (ap, dvAnchorApplyBox, anchorImage, x, y) {
    var anchoPoint = $('<img>').attr('src', "")
            .css('position', 'absolute')
            .attr('id', ap.id + '')
            .css('margin-top', y + 'px')
            .css('cursor', 'pointer')
            .css('cursor', 'pointer')
            .css('height', '20px')
            .css('width', '20px')
            .css('margin-left', x + 'px');
    var anchodiv = $('<div>').append(anchoPoint);
    anchodiv.append($('<div>').append(anchorImage));
    dvAnchorApplyBox.append(anchodiv);

    return anchoPoint;
};

/**
 * Selects the ancor point and changes the ui controls based on selected anchor
 * 
 * @param  ap anchor Points
 * @param  image image to display either anchor point or sub anchor point
 * @returns isZoomed boolena parameter to show if image need to display is for zoom or normal
 */
AnchorPoint.prototype.selectAnchor = function (ap, image, isZoomed) {
    //populate anchor point data
    var anchorPoint = this.allAnchorPoints[ap.id];
    anchorPoint.image = image;

    var isAnchorPointDecorated = anchorPoint.IsDecorated;
    //var returnFlag = false;
    var fontColorId = $('#dvIdSelectedFillColorAnchorPoint').attr('colorid');
    var fontColorOutline1Id = $('#dvIdSelectedFillColorAnchorPointOutlineFirst').attr('colorid');
    var fontColorOutline2Id = $('#dvIdSelectedFillColorAnchorPointOutlineSecond').attr('colorid');
    GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance()
    if (!isAnchorPointDecorated) {
        var oTextEffect = null;
        //updates the anchor point data
        if (this.currentPanelId == this.playerNameAnchorPanelId) {
            var sText = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('text');
            var fontObj = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('font');
            oTextEffect = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('textOrientation');
            //anchorPoint.FontColor = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontColor');
            //anchorPoint.FontColor = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontColor.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontColor.colorid);
            anchorPoint.FontColor = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorId);
            GlobalInstance.colorRetainInstance.setModifiedColors(true, false, false, anchorPoint.FontColor);
            //anchorPoint.FontOutlineColor1 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline1Color');
            //if (anchorPoint.FontOutlineColor1 && anchorPoint.FontOutlineColor1 != null) {
            //    anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.colorid);
            //}
            if (fontColorOutline1Id != 0) {
                anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorOutline1Id);
            } else {
                anchorPoint.FontOutlineColor1 = null;
            }
            GlobalInstance.colorRetainInstance.setModifiedColors(false, true, false, anchorPoint.FontOutlineColor1);
            //anchorPoint.FontOutlineColor2 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline2Color');
            //if (anchorPoint.FontOutlineColor2 && anchorPoint.FontOutlineColor2 != null) {
            //    anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.colorid);
            //}

            if (fontColorOutline2Id != 0) {
                anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorOutline2Id);
            } else {
                anchorPoint.FontOutlineColor2 = null;
            }
            GlobalInstance.colorRetainInstance.setModifiedColors(false, false, true, anchorPoint.FontOutlineColor2);
            anchorPoint.Text = sText || '';
            anchorPoint.Font = fontObj;
            anchorPoint.TextOrientation = oTextEffect;
        }
        else if (this.currentPanelId == this.playerNumberAnchorPanelId) {
            var sText = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('text');
            var fontObj = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('font');
            oTextEffect = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('textOrientation');
            //anchorPoint.FontColor = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('fontColor');
            //anchorPoint.FontColor = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontColor.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontColor.colorid);
            //anchorPoint.FontOutlineColor1 = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('fontOutline1Color');
            //if (anchorPoint.FontOutlineColor1 && anchorPoint.FontOutlineColor1 != null) {
            //    anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.colorid);
            //}
            //anchorPoint.FontOutlineColor2 = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('fontOutline2Color');
            //if (anchorPoint.FontOutlineColor2 && anchorPoint.FontOutlineColor2 != null) {
            //    anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.colorid);
            //}

            anchorPoint.FontColor = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorId);
            GlobalInstance.colorRetainInstance.setModifiedColors(true, false, false, anchorPoint.FontColor);
            //anchorPoint.FontOutlineColor1 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline1Color');
            //if (anchorPoint.FontOutlineColor1 && anchorPoint.FontOutlineColor1 != null) {
            //    anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.colorid);
            //}
            if (fontColorOutline1Id != 0) {
                anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorOutline1Id);
            } else {
                anchorPoint.FontOutlineColor1 = null;
            }
            GlobalInstance.colorRetainInstance.setModifiedColors(false, true, false, anchorPoint.FontOutlineColor1);
            //anchorPoint.FontOutlineColor2 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline2Color');
            //if (anchorPoint.FontOutlineColor2 && anchorPoint.FontOutlineColor2 != null) {
            //    anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.colorid);
            //}

            if (fontColorOutline2Id != 0) {
                anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorOutline2Id);
            } else {
                anchorPoint.FontOutlineColor2 = null;
            }

            GlobalInstance.colorRetainInstance.setModifiedColors(false, false, true, anchorPoint.FontOutlineColor2);
            anchorPoint.Text = sText;
            anchorPoint.Font = fontObj;
            anchorPoint.TextOrientation = oTextEffect;
        }
        else if (this.currentPanelId == this.teamNameAnchorPanelId) {
            var sText = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('text');
            var fontObj = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('font');
            oTextEffect = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('textOrientation');
            //anchorPoint.FontColor = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('fontColor');
            //anchorPoint.FontColor = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontColor.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontColor.colorid);
            //anchorPoint.FontOutlineColor1 = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('fontOutline1Color');
            //if (anchorPoint.FontOutlineColor1 && anchorPoint.FontOutlineColor1 != null) {
            //    anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.colorid);
            //}
            //anchorPoint.FontOutlineColor2 = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('fontOutline2Color');
            //if (anchorPoint.FontOutlineColor2 && anchorPoint.FontOutlineColor2 != null) {
            //    anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.colorid);
            //}

            anchorPoint.FontColor = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorId);
            GlobalInstance.colorRetainInstance.setModifiedColors(true, false, false, anchorPoint.FontColor);
            //anchorPoint.FontOutlineColor1 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline1Color');
            //if (anchorPoint.FontOutlineColor1 && anchorPoint.FontOutlineColor1 != null) {
            //    anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.colorid);
            //}
            if (fontColorOutline1Id != 0) {
                anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorOutline1Id);
            } else {
                anchorPoint.FontOutlineColor1 = null;
            }
            GlobalInstance.colorRetainInstance.setModifiedColors(false, true, false, anchorPoint.FontOutlineColor1);
            //anchorPoint.FontOutlineColor2 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline2Color');
            //if (anchorPoint.FontOutlineColor2 && anchorPoint.FontOutlineColor2 != null) {
            //    anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.colorid);
            //}

            if (fontColorOutline2Id != 0) {
                anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorOutline2Id);
            } else {
                anchorPoint.FontOutlineColor2 = null;
            }

            GlobalInstance.colorRetainInstance.setModifiedColors(false, false, true, anchorPoint.FontOutlineColor2);
            anchorPoint.Text = sText;
            anchorPoint.Font = fontObj;
            anchorPoint.TextOrientation = oTextEffect;
        }
        else if (this.currentPanelId == this.otherTextAnchorPanelId) {
            var sText = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('text');
            var fontObj = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('font');
            oTextEffect = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('textOrientation');
            //anchorPoint.FontColor = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('fontColor');
            //anchorPoint.FontColor = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontColor.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontColor.colorid);
            //anchorPoint.FontOutlineColor1 = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('fontOutline1Color');
            //if (anchorPoint.FontOutlineColor1 && anchorPoint.FontOutlineColor1 != null) {
            //    anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.colorid);
            //}
            //anchorPoint.FontOutlineColor2 = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('fontOutline2Color');
            //if (anchorPoint.FontOutlineColor2 && anchorPoint.FontOutlineColor2 != null) {
            //    anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.colorid);
            //}

            anchorPoint.FontColor = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorId);
            GlobalInstance.colorRetainInstance.setModifiedColors(true, false, false, anchorPoint.FontColor);
            //anchorPoint.FontOutlineColor1 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline1Color');
            //if (anchorPoint.FontOutlineColor1 && anchorPoint.FontOutlineColor1 != null) {
            //    anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.colorid);
            //}
            if (fontColorOutline1Id != 0) {
                anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorOutline1Id);
            } else {
                anchorPoint.FontOutlineColor1 = null;
            }

            GlobalInstance.colorRetainInstance.setModifiedColors(false, true, false, anchorPoint.FontOutlineColor1);
            //anchorPoint.FontOutlineColor2 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline2Color');
            //if (anchorPoint.FontOutlineColor2 && anchorPoint.FontOutlineColor2 != null) {
            //    anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.colorid);
            //}

            if (fontColorOutline2Id != 0) {
                anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorOutline2Id);
            } else {
                anchorPoint.FontOutlineColor2 = null;
            }

            GlobalInstance.colorRetainInstance.setModifiedColors(false, false, true, anchorPoint.FontOutlineColor2);
            anchorPoint.Text = sText;
            anchorPoint.Font = fontObj;
            anchorPoint.TextOrientation = oTextEffect;
        }
        else if (this.currentPanelId == this.emblemAndGraphicsPanel) {
            var graphicObj = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl);
            var graphicDesignObj = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign);
            if (graphicObj != null) {
                anchorPoint.graphicUrl = graphicObj.src;
            }

            var graphicCategoryObj = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicCategory);
            if (graphicCategoryObj) {
                anchorPoint.graphicCategoryId = graphicCategoryObj.GraphicCategoryId;
                anchorPoint.graphicCategoryName = graphicCategoryObj.Name;
            }

            var graphicSubCategoryObj = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicSubCategory);
            if (graphicSubCategoryObj) {
                anchorPoint.graphicSubCategoryId = graphicSubCategoryObj.categoryId;
                anchorPoint.graphicSubCategoryName = graphicSubCategoryObj.Name;
            }

            //add name
            if (graphicDesignObj != null) {
                anchorPoint.graphicId = graphicDesignObj.Id;
                anchorPoint.graphicWidth = graphicDesignObj.Width;
                anchorPoint.graphicHeight = graphicDesignObj.Height;
                anchorPoint.graphicName = graphicDesignObj.Nm;
                anchorPoint.colorsChoiceCount = Utility.getGraphicLayerCount(graphicDesignObj.Lys);
            }

            //add graphic colors
            //var oColor1 = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor);
            //var oColor2 = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
            //var oColor3 = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor);

            //if (oColor1)
            //    anchorPoint.FontColor = GlobalInstance.colorInstance.getColorByKey('_' + (oColor1.colorid || oColor1.ColorId));
            //if (oColor2)
            //    anchorPoint.FontOutlineColor1 = GlobalInstance.colorInstance.getColorByKey('_' + (oColor2.colorid || oColor2.ColorId));
            //if (oColor3)
            //    anchorPoint.FontOutlineColor2 = GlobalInstance.colorInstance.getColorByKey('_' + (oColor3.colorid || oColor3.ColorId));

            anchorPoint.FontColor = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorId);
            GlobalInstance.colorRetainInstance.setModifiedColors(true, false, false, anchorPoint.FontColor);
            //anchorPoint.FontOutlineColor1 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline1Color');
            //if (anchorPoint.FontOutlineColor1 && anchorPoint.FontOutlineColor1 != null) {
            //    anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor1.colorid);
            //}
            if (fontColorOutline1Id != 0) {
                anchorPoint.FontOutlineColor1 = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorOutline1Id);
            } else {
                anchorPoint.FontOutlineColor1 = null;
            }
            GlobalInstance.colorRetainInstance.setModifiedColors(false, true, false, anchorPoint.FontOutlineColor1);
            //anchorPoint.FontOutlineColor2 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline2Color');
            //if (anchorPoint.FontOutlineColor2 && anchorPoint.FontOutlineColor2 != null) {
            //    anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + anchorPoint.FontOutlineColor2.colorid);
            //}

            if (fontColorOutline2Id != 0) {
                anchorPoint.FontOutlineColor2 = GlobalInstance.getColorInstance().getColorByKey('_' + fontColorOutline2Id);
            } else {
                anchorPoint.FontOutlineColor2 = null;
            }
            GlobalInstance.colorRetainInstance.setModifiedColors(false, false, true, anchorPoint.FontOutlineColor2);

            anchorPoint.Text = null;
            anchorPoint.Font = null;
            anchorPoint.TextOrientation = null;
        }
        else if (this.currentPanelId == this.myLockerPanelId) {
            var graphicUrl = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo('url');
            anchorPoint.graphicUrl = graphicUrl;
            anchorPoint.graphicWidth = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo('width');

            if (!anchorPoint.graphicWidth) {
                anchorPoint.graphicWidth = anchorPoint.GraphicSizes[0].Width;
                GlobalInstance.uniformConfigurationInstance.setMyLockerInfo('width', anchorPoint.graphicWidth);
            }
            anchorPoint.graphicHeight = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo('height');

            if (!anchorPoint.graphicHeight) {
                anchorPoint.graphicHeight = anchorPoint.GraphicSizes[0].Height;
                GlobalInstance.uniformConfigurationInstance.setMyLockerInfo('height', anchorPoint.graphicHeight);
            }
            anchorPoint.graphicId = 0;
            anchorPoint.graphicName = graphicUrl;
            anchorPoint.FontColor = null;
            anchorPoint.FontColor = null;
            anchorPoint.FontColor = null;

            //add graphic colors
            anchorPoint.Text = null;
            anchorPoint.Font = null;
            anchorPoint.TextOrientation = null;
        }

        anchorPoint.SelectionPanelId = this.currentPanelId;
    }

    //select the anchor point
    this.allAnchorPoints[ap.id] = anchorPoint;
    anchorPoint.select(this.allAnchorPoints);

    //bind navigation buttons based on the current selected anchor point
    this.bindNavigationButtons(anchorPoint.SelectionPanelId);

    //update sccren headings based on seelcted panel id
    this.updateScreenHeadings(anchorPoint.SelectionPanelId);

    //updates the ui with the anchor point colors and size
    this.setColorValues(anchorPoint.FontColor, anchorPoint.FontOutlineColor1, anchorPoint.FontOutlineColor2);

    this.setCurrentSelectedAnchorSizeValues();

    //updates the anchor preview image
    this.previewAnchorImage();

    //bind the delete event
    this.deleteAnchor(ap);

    //bind the undo event
    this.undoAnchor(ap);

    //bind the flip event
    this.flipAnchor(ap);

    //updates  the previe model image
    this.setAnchorPointsInUniformConfiguration();
    //if (!isAnchorPointDecorated) {
    //update the view of model preview
    var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
    if (!anchorPoint.isForTop) {
        currentStyle = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(anchorPoint.styleId);
    }
    var currentStylePreviewImageId = jQuery.map(currentStyle.PreviewImages, function (obj) {
        if (obj.Name == anchorPoint.PreviewImageName) {
            return obj.PreviewImageId;
        } else if (obj.StyleId == anchorPoint.styleId) {
            return obj.PreviewImageId;
        }
    });

    if (Utility.getObjectlength(currentStylePreviewImageId) > 0) {
        var alternateViewImgObject = $('#birdPreview_' + currentStylePreviewImageId);
        if (alternateViewImgObject.length > 0) {
            alternateViewImgObject.click();
        } else {
            LiquidPixels.updateModelPreview('apjs 1026');
        }
    }
    else {
        LiquidPixels.updateModelPreview('apjs 1030');
    }
    //}
};

/**
 * This method removes the anchor decoration
 * @param ap Anchor Point data object
 * @returns {void}
 */
AnchorPoint.prototype.deleteAnchor = function (ap) {
    var currentObj = this;
    $('#aIdAnchorPointRemove').show();
    $('#aIdAnchorPointFlip').show();
    $('#aIdAnchorPointRemove').off();
    $('#aIdAnchorPointRemove').click(function () {
        //var anchorObject = currentObj.getSelectedAnchorObj();
        currentObj.handleAnchorPointRemove(ap);
    });
};

AnchorPoint.prototype.handleAnchorPointRemove = function (ap, retainSameDimension) {
    $('#aIdAnchorPointFlip').hide();
    retainSameDimension = (typeof retainSameDimension != 'undefined') ? retainSameDimension : false;
    var currentObj = this;
    $.each(this.allAnchorPoints, function (i, data) {
        if (data.displayName == ap.displayName) {
            $('#aIdAnchorPointRemove').hide();
            $('#aIdAnchorPointUndo').hide();

            var obj = currentObj.allAnchorPoints[data.id];
            var sameDimensionChk = obj.isSameDimensionCheck;
            var sameSizeValue = obj.selectedSize;
            obj.IsDecorated = false;
            obj.IsSelected = false;
            obj.isFlip = false;

            //remove anchor point values
            obj.Text = '';
            obj.FontColor = null;
            obj.graphicUrl = '';
            obj.graphicId = '';
            obj.graphicCategoryName = '';
            obj.graphicSubCategoryName = '';
            obj.graphicCategoryId = '';
            obj.graphicSubCategoryId = '';
            obj.Lys = 3;
            obj.FontOutlineColor1 = null;
            obj.FontOutlineColor2 = null;
            obj.TextOrientation = null;
            obj.SelectionPanelId = null;

            obj.isSameDimensionCheck = sameDimensionChk;

            if (!retainSameDimension) {
                obj.isSameDimensionCheck = false;
                obj.selectedSize = null;
            }


            currentObj.updateAnchorPointDataUI();



            currentObj.setCurrentSelectedAnchorSizeValues();
            //updates the anchor preview image
            currentObj.previewAnchorImage();

            //update the same Dimension check
            currentObj.UpdateSameSizeDimension(obj);

            obj.setImage();

            //updates  the previe model image
            currentObj.setAnchorPointsInUniformConfiguration();

        }
    });

    if (currentObj.allAnchorPoints[ap.id]) {
        LiquidPixels.updateModelPreview('apjs 1197');
        return false;
    }
};


/**
 * This method removes the anchor decoration
 * @param {object} ap Anchor Point data object
 * @returns {void}
 */
AnchorPoint.prototype.undoAnchor = function (ap) {
    var currentObj = this;
    $('#aIdAnchorPointUndo').off();

    var anchorObject = currentObj.getSelectedAnchorObj();
    if (currentObj.allAnchorPoints[ap.id]) {
        var obj = currentObj.allAnchorPoints[ap.id];
        obj = obj.previousAnchorPoint;
        if (obj) {
            $('#aIdAnchorPointUndo').show();
        } else {
            $('#aIdAnchorPointUndo').hide();
        }
    }


    $('#aIdAnchorPointUndo').click(function () {
        var anchorObject = currentObj.getSelectedAnchorObj();

        if (currentObj.allAnchorPoints[ap.id]) {
            var obj = currentObj.allAnchorPoints[ap.id];
            obj = obj.previousAnchorPoint;

            if (obj) {
                $('#aIdAnchorPointUndo').hide();
                //select the anchor point
                currentObj.allAnchorPoints[ap.id] = obj;
                obj.select(this.allAnchorPoints);

                //updates the ui with the anchor point colors and size
                currentObj.setColorValues(obj.FontColor, obj.FontOutlineColor1, obj.FontOutlineColor2);

                //bind navigation buttons based on the current selected anchor point
                currentObj.bindNavigationButtons(obj.SelectionPanelId);

                //update sccren headings based on seelcted panel id
                currentObj.updateScreenHeadings(obj.SelectionPanelId);

                //updates the current size values
                currentObj.setCurrentSelectedAnchorSizeValues();

                //updates the anchor preview image
                currentObj.previewAnchorImage();

                obj.setImage();

                //updates  the previe model image
                currentObj.setAnchorPointsInUniformConfiguration();
                LiquidPixels.updateModelPreview('apjs 1120');
            }

        }
        return false;
    });

};

/**
 * This method flip the anchor decoration
 * @param  ap Anchor Point data object
 * @returns {void}
 */
AnchorPoint.prototype.flipAnchor = function (ap) {
    var currentObj = this;
    var anchorObject = currentObj.getSelectedAnchorObj();
    // Here we can ignore AP  - R
    /* if (this.currentPanelId == this.emblemAndGraphicsPanel) {
     anchorObject.MirrorCapability = true;
     }*/

    if (anchorObject && anchorObject.MirrorCapability) {
        $('#aIdAnchorPointFlip').show();
    } else {
        $('#aIdAnchorPointFlip').hide();
    }

    //Handles the click Event of Flip Button
    $('#aIdAnchorPointFlip').off();
    $('#aIdAnchorPointFlip').click(function () {
        var anchorObject = currentObj.getSelectedAnchorObj();
        if (currentObj.allAnchorPoints[ap.id]) {
            var obj = currentObj.allAnchorPoints[ap.id];
            if (obj && anchorObject) {
                if (anchorObject) {
                    anchorObject.previousAnchorPoint = anchorObject.copyObj();
                }
                var url = anchorObject.graphicUrl;

                //For Number And Text screens
                if (!url) {
                    for (var i = 0; i < currentObj.textUrl.length; i++) {
                        var textObject = currentObj.textUrl[i];
                        if (textObject.anchorPointId == anchorObject.id) {
                            url = textObject.src;
                            break;
                        }
                    }
                }

                if (url) {
                    if (obj.isFlip) {
                        url = url.replace('&flipy', '');
                        anchorObject.graphicUrl = url;
                        obj.isFlip = false;
                    } else {
                        url = url.replace('sink=format[png]', 'flipy&sink=format[png]');
                        anchorObject.graphicUrl = url;
                        obj.isFlip = true;
                    }
                }
                currentObj.allAnchorPoints[ap.id] = obj;
                obj.select(currentObj.allAnchorPoints);

                currentObj.previewAnchorImage();
                currentObj.setAnchorPointsInUniformConfiguration();
                LiquidPixels.updateModelPreview('apjs 1175');
            }

        }
        return false;
    });

};


/**
 * This method checks that weather is passed anchor point id is selected or not.
 * @param id, anchor point id
 * @returns {Boolean|@exp;obj@call;isSelected} true if passed anchor point id is selected
 */
AnchorPoint.prototype.isSelected = function (id) {
    if (typeof this.allAnchorPoints[id] != 'undefined') {
        var obj = this.allAnchorPoints[id];
        return obj.isSelected();
    }
    return false;
};


/**
 * This method returns the select anchor point object
 * 
 * @returns {AnchorPoint.prototype.getSelectedAnchorObj.obj}
 */
AnchorPoint.prototype.getSelectedAnchorObj = function () {
    for (key in this.allAnchorPoints) {
        var obj = this.allAnchorPoints[key];
        if (obj.isSelected()) {
            return obj;
        }
    }
    return null;
};

/**
 * This method is responsible to fetch the color box with respect to anchor point
 * @param colorList to display the list of the colors
 * @returns {AnchorPoint.prototype.getColorBoxHtml.Anonym$4}
 */

AnchorPoint.prototype.getColorBoxHtml = function (colorList) {
    var tempColorsListHtml = '';
    var tempCustomColorListHtml = '';
    var tempColorsListUnselectHtml = '';
    tempColorsListUnselectHtml += '<li style="background-color:"><a id="0" \n\
                            data-name="" \n\
                            colorid="0" \n\
                            data-matchButtonColorID="" \n\
                            data-cmykValue="" \n\
                            data-rgbValue="" \n\
                            rgbHexadecimal="" \n\
                            alt="White" \n\
                            style="background-color:"></a></li>';


    $.each(colorList, function (i, color) {
        if (color.CustomerId != null && color.CustomerId != '' && color.CustomerId != undefined) {
            tempCustomColorListHtml += '<li TaaColorId="' + color.TaaColorId + '" colorid="' + color.ColorId + '" style="background-color:' + color.RgbHexadecimal + ';margin-bottom:0px" class="colorItems" alt="' + color.Name + '"  title="' + color.Name + '"><a id=' + color.ColorId + ' \n\
                            data-name="' + color.name + '"  \n\
                            colorid="' + color.ColorId + '" \n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            data-matchButtonColorID="' + color.MatchingButtonColorId + '" \n\
                            data-cmykValue="' + color.Cyan + ',' + color.Magenta + ',' + color.Yellow + ',' + color.Black + '" \n\
                            data-rgbValue="' + color.Red + ',' + color.Green + ',' + color.Blue + '" \n\
                            rgbHexadecimal="' + color.RgbHexadecimal + '" \n\
                            alt="' + color.Name + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        }
        else {
            tempColorsListHtml += '<li TaaColorId="' + color.TaaColorId + '" colorid="' + color.ColorId + '" style="background-color:' + color.RgbHexadecimal + ';margin-bottom:0px" class="colorItems" alt="' + color.Name + '"  title="' + color.Name + '"><a id=' + color.ColorId + ' \n\
                            data-name="' + color.name + '"  \n\
                            colorid="' + color.ColorId + '" \n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            data-matchButtonColorID="' + color.MatchingButtonColorId + '" \n\
                            data-cmykValue="' + color.Cyan + ',' + color.Magenta + ',' + color.Yellow + ',' + color.Black + '" \n\
                            data-rgbValue="' + color.Red + ',' + color.Green + ',' + color.Blue + '" \n\
                            rgbHexadecimal="' + color.RgbHexadecimal + '" \n\
                            alt="' + color.Name + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        }
    });
    return {
        "unselected": tempColorsListUnselectHtml,
        "custom": tempCustomColorListHtml,
        "selected": tempColorsListHtml
    };
};



/*
 * This method fills AnchorPoint Color Controls for Anchor Point Screen 
 * 
 * @returns {void}
 */
AnchorPoint.prototype.fillAnchorPointColorCtrl = function () {

    var tempColorsListUnselectHtml = '';


    tempColorsListUnselectHtml += '<li  id= "colorid_0"  style="cursor:pointer; background-image:url(\'images/slash.png\');">\n\
<a  ColorId="0" \n\
rgbHexadecimal="" alt="Optional" class="colorItems in-active" background-image:url(\'../images/slash.png\');\n\
style="background-color:"></a></li>';

    GlobalInstance.colorInstance = GlobalInstance.getColorInstance();
    var colors = this.getColorBoxHtml(GlobalInstance.colorInstance.getColorList());

    $('#ulColorComboBoxlistAnchorPointFillColor').html(colors.selected);
    $('#ulColorComboBoxlistAnchorPointOutlineFirst').html(tempColorsListUnselectHtml + colors.selected);
    $('#ulColorComboBoxlistAnchorPointOutlineSecond').html(tempColorsListUnselectHtml + colors.selected);

    //Custom Color Case
    var customerId = GlobalInstance.uniformConfigurationInstance.getAccountNumber();
    if (customerId !== 0 && customerId !== undefined) {
        $('#ulIdAnchorPointPrimaryCustomColor').html(colors.custom);
        $('#ulIdAnchorPointOutlineFirstCustomColor').html(colors.custom);
        $('#ulIdAnchorPointOutlineSecondCustomColor').html(colors.custom);
    }

    this.bindAnchorPointColorCtrl();
};


/**
 * This method is responsible to handle the different sizes of anchor point
 * @returns {void}
 */

AnchorPoint.prototype.handleSizeCtrl = function () {
    var thisObject = this;

    //$('#anchorSizeBox').off();
    $(document).off('click', "#anchorSizeBox");
    $(document).on('click', "#anchorSizeBox", function () {
        if ($('#dvIdAnchorSizeComboDropdown').is(':visible')) {
            $('#dvIdAnchorSizeComboDropdown').hide();
        } else {
            $('#dvIdAnchorSizeComboDropdown').show();
        }
    });

    //handle size item click
    $(document).off('click', ".anchorPointDropdownListText");
    $(document).on('click', ".anchorPointDropdownListText", function () {
        $("#dvIdAnchorPointSelectedSize").html($(this).text());

        $('.anchorPointDropdownListText').removeClass('active');
        $(this).addClass('active');

        //$(".anchorPointDropdownListText").css("background-color","red");
        //alert($("#dvIdAnchorPointSelectedSize").html());
        $('#dvIdAnchorSizeComboDropdown').hide();

        //update the selected size values
        var anchorObject = thisObject.getSelectedAnchorObj();
        if (anchorObject) {
            anchorObject.previousAnchorPoint = anchorObject.copyObj();
            var selectedSizeId = $(this).attr('id');

            var sizesObject = thisObject.getSizesObjectForCurrentPanel(anchorObject);
            if (sizesObject) {
                for (var i = 0; i < sizesObject.length; i++) {
                    if (sizesObject[i].SizeId == selectedSizeId) {
                        anchorObject.selectedSize = sizesObject[i];
                        break;
                    }
                    ;
                }
                ;
            }

            //updates  the preview model image
            thisObject.setAnchorPointsInUniformConfiguration();
            LiquidPixels.updateModelPreview('apjs 1329');

        }
        ;
    });
};

/*
 * This method fills binds events  for Anchor point color controls Anchor Point Screen 
 * 
 * @returns {void}
 */
AnchorPoint.prototype.bindAnchorPointColorCtrl = function () {
    var thisObject = this;

    //Color Combo Box Event Binding for Font Color
    $(document).off('click', '#dvIdFillColorAnchorPoint');
    $(document).on('click', '#dvIdFillColorAnchorPoint', function () {
        $('#dvIdColorBoxAnchorPointOutlineFirst').hide();
        $('#dvIdColorBoxAnchorPointOutlineSecond').hide();

        if ($('#dvIdColorBoxAnchorPoint').is(':visible')) {
            $('#dvIdColorBoxAnchorPoint').hide();
        } else {
            setTimeout(function () {
                $('#dvIdColorBoxAnchorPoint').show();
            }, 10);
            $('#dvIdColorBoxAnchorPoint').draggable({
                containment: '#dvConfiguratorPanel'
            });
        }
        return false;
    });
    //handles the click event on ColorBox of anchor point screen
    $(document).off('click', '#dvIdColorBoxAnchorPoint ul li,#dvIdAnchorPointPrimaryCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxAnchorPoint ul li ,#dvIdAnchorPointPrimaryCustomColor ul li', function () {
        var clickedLi = $(this).children();
        var clickedLiFirstElement = clickedLi.first();
        //update state class
        $('#dvIdColorBoxAnchorPoint ul li').attr({
            'class': 'in-active'
        });
        $(this).attr({
            'class': 'active'
        });
        if (clickedLiFirstElement.attr('colorid') != 0) {
            var fontColor = GlobalInstance.colorInstance.getColorByKey('_' + clickedLiFirstElement.attr('colorid'));
            var panelId = thisObject.currentPanelId;
            GlobalInstance.getColorRetainInstance().setModifiedColors(true, false, false, fontColor);

            var anchorPoint = thisObject.getSelectedAnchorObj();
            if (anchorPoint) {
                anchorPoint.FontColor = fontColor;
            }
            //updates the global configuration values
            if (panelId == thisObject.playerNameAnchorPanelId) {
                GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontColor', fontColor);
                GlobalInstance.getPlayerNameInstance().defaultPlayerNameFontColorSelected = false;
            }
            else if (panelId == thisObject.playerNumberAnchorPanelId) {
                GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontColor', fontColor);
                GlobalInstance.getPlayerNumberInstance().defaultPlayerNumberFontColorSelected = false;
            }
            else if (panelId == thisObject.teamNameAnchorPanelId) {
                GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontColor', fontColor);
                GlobalInstance.getTeamNameInstance().defaultTeamNameFontColorSelected = false;
            }
            else if (panelId == thisObject.otherTextAnchorPanelId) {
                GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontColor', fontColor);
                GlobalInstance.getOtherTextInstance().defaultOtherTextFontColorSelected = false;
            } else if (panelId == thisObject.emblemAndGraphicsPanel) {
                GlobalInstance.selectGraphicsInstance = GlobalInstance.getSelectGraphicsInstance();
                var colorized1 = GlobalInstance.getUniformConfigurationInstance().getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId1);
                var colorized2 = GlobalInstance.getUniformConfigurationInstance().getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId2);
                var colorized3 = GlobalInstance.getUniformConfigurationInstance().getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId3);
                var graphicObject = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign);
                var imgUrl = {};
                var allColorObject = {};

                //create color object
                var colorObject = {};
                colorObject.background = 'background-color:' + fontColor.RgbHexadecimal;
                colorObject.colorName = fontColor.Name;
                colorObject.colorid = fontColor.ColorId;
                if (colorized1 == CONFIG.get('COLORIZEID_COLOR_1')) {
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor, colorObject);
                } else if (colorized2 == CONFIG.get('COLORIZEID_COLOR_2')) {
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, colorObject);
                } else if (colorized3 == CONFIG.get('COLORIZEID_COLOR_3')) {
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, colorObject);
                }


                allColorObject.primary = Utility.getObjectlength(colorObject) > 0 ? colorObject : GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor);
                allColorObject.secondary = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
                allColorObject.accent = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor);

                if (anchorPoint) {
                    if (allColorObject.primary) {
                        allColorObject.primary.background = anchorPoint.FontColor.RgbHexadecimal;
                        allColorObject.primary.colorName = anchorPoint.FontColor.Name
                        allColorObject.primary.colorid = anchorPoint.FontColor.ColorId
                    }

                    if (allColorObject.secondary && (allColorObject.secondary.ColorId || allColorObject.secondary.colorid)) {
                        allColorObject.secondary.background = anchorPoint.FontOutlineColor1.RgbHexadecimal;
                        allColorObject.secondary.colorName = anchorPoint.FontOutlineColor1.Name
                        allColorObject.secondary.colorid = anchorPoint.FontOutlineColor1.ColorId
                    }

                    if (allColorObject.accent && (allColorObject.accent.ColorId || allColorObject.accent.colorid)) {
                        allColorObject.accent.background = anchorPoint.FontOutlineColor2.RgbHexadecimal;
                        allColorObject.accent.colorName = anchorPoint.FontOutlineColor2.Name
                        allColorObject.accent.colorid = anchorPoint.FontOutlineColor2.ColorId
                    }

                    var graphicObject = GlobalInstance.getSelectGraphicsInstance().getSelectedGraphicByGraphicId(anchorPoint.graphicId);
                    anchorPoint.graphicUrl = LiquidPixels.getGraphicUrl(graphicObject, graphicObject.Nm, allColorObject, Utility.getGraphicLayerCount(graphicObject.Lys), graphicObject.Lys)

                    if (anchorPoint.graphicId == graphicObject.Id) {
                        //set the selected graphic colors object
                        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor, colorObject);

                        //update the selected graphic url
                        imgUrl.graphicId = graphicObject.Id;
                        imgUrl.src = LiquidPixels.getGraphicUrl(graphicObject, graphicObject.Nm, allColorObject, Utility.getGraphicLayerCount(graphicObject.Lys), graphicObject.Lys);
                        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl, imgUrl);
                    }
                } else {
                    //set the selected graphic colors object
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor, colorObject);

                    //update the selected graphics color
                    imgUrl.graphicId = graphicObject.Id;
                    imgUrl.src = LiquidPixels.getGraphicUrl(graphicObject, graphicObject.Nm, allColorObject, Utility.getGraphicLayerCount(graphicObject.Lys), graphicObject.Lys);
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl, imgUrl);
                }
            }


            $('#dvIdSelectedFillColorAnchorPoint').attr({
                'name': clickedLiFirstElement.attr('data-name'),
                'matchButtonColorID': clickedLiFirstElement.attr('data-matchButtonColorID'),
                'cmykValue': clickedLiFirstElement.attr('data-cmykValue'),
                'colorid': clickedLiFirstElement.attr('colorid'),
                'rgbValue': clickedLiFirstElement.attr('data-rgbValue'),
                'rgbHexadecimal': clickedLiFirstElement.attr('rgbHexadecimal'),
                'alt': clickedLiFirstElement.attr('alt'),
                'displayname': clickedLiFirstElement.attr('name'),
                'style': clickedLiFirstElement.attr('style')
            });

            $('#dvIdColorNameAnchorPointFont').html(clickedLiFirstElement.attr('alt'));
            $('#dvIdColorBoxAnchorPoint').hide();
            thisObject.previewAnchorImage();

            //Replace the modified object with the current object
            var uniformAnchorPoints = GlobalInstance.getUniformConfigurationInstance().getAnchorPoints();

            //set an array in global configuration
            if (anchorPoint) {
                thisObject.setAnchorPointsInUniformConfiguration();
                LiquidPixels.updateModelPreview('apjs 1489');
            }
        }
    });


    //First Outline Color Combo Box Binding
    $(document).off('click', '#dvIdAnchorPointOutlineFirst');
    $(document).on('click', '#dvIdAnchorPointOutlineFirst', function () {
        $('#dvIdColorBoxAnchorPoint').hide();
        $('#dvIdColorBoxAnchorPointOutlineSecond').hide();

        if ($('#dvIdColorBoxAnchorPointOutlineFirst').is(':visible')) {
            $('#dvIdColorBoxAnchorPointOutlineFirst').hide();
        } else {
            $('#dvIdColorBoxAnchorPointOutlineFirst').show();
        }
        return false;
    });
    $('#dvIdColorBoxAnchorPointOutlineFirst').draggable({
        containment: '#dvConfiguratorPanel'
    });

    $(document).off('click', '#dvIdColorBoxAnchorPointOutlineFirst ul li,#dvIdAnchorPointOutlineFirstCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxAnchorPointOutlineFirst ul li ,#dvIdAnchorPointOutlineFirstCustomColor ul li', function (e) {
        var clickedLi = $(this).children();
        var clickedLiFirstElement = clickedLi.first();

        //update state class
        $('#dvIdColorBoxAnchorPointOutlineFirst ul li').attr({
            'class': 'in-active'
        });
        $(this).attr({
            'class': 'active'
        });
        //        if (e.target.id == "colorid_0") {
        //            $("#dvIdSelectedFillColorAnchorPointOutlineFirst").addClass("slashImage color_box_selected");
        //        }
        var fontColorOutline1 = GlobalInstance.colorInstance.getColorByKey('_' + clickedLiFirstElement.attr('colorid'));
        if (!fontColorOutline1) {
            fontColorOutline1 = null;
        }
        GlobalInstance.getColorRetainInstance().setModifiedColors(false, true, false, fontColorOutline1);
        var panelId = thisObject.currentPanelId;

        var anchorPoint = thisObject.getSelectedAnchorObj();
        if (anchorPoint) {
            anchorPoint.FontOutlineColor1 = fontColorOutline1;
        }
        //updates the global configuration values
        if (panelId == thisObject.playerNameAnchorPanelId) {
            GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontOutline1Color', fontColorOutline1);
        }
        else if (panelId == thisObject.playerNumberAnchorPanelId) {
            GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontOutline1Color', fontColorOutline1);
        }
        else if (panelId == thisObject.teamNameAnchorPanelId) {
            GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontOutline1Color', fontColorOutline1);
        }
        else if (panelId == thisObject.otherTextAnchorPanelId) {
            GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontOutline1Color', fontColorOutline1);
        }
        else if (panelId == thisObject.emblemAndGraphicsPanel) {
            var graphicObject = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign);
            var imgUrl = {};
            var allColorObject = {};
            var colorized2 = GlobalInstance.getUniformConfigurationInstance().getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId2);
            var colorized3 = GlobalInstance.getUniformConfigurationInstance().getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId3);
            //create color object
            var colorObject = {};
            var backgroundColor = (fontColorOutline1 != null && fontColorOutline1 != undefined) ? fontColorOutline1.RgbHexadecimal : null
            var colorName = (fontColorOutline1 != null && fontColorOutline1 != undefined) ? fontColorOutline1.Name : null
            var colorId = (fontColorOutline1 != null && fontColorOutline1 != undefined) ? fontColorOutline1.ColorId : 0
            colorObject.background = 'background-color:' + backgroundColor;
            colorObject.colorName = colorName;
            colorObject.colorid = colorId;
            if (colorized2 == CONFIG.get('COLORIZEID_COLOR_2')) {
                GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, colorObject);
            } else if (colorized3 == CONFIG.get('COLORIZEID_COLOR_3')) {
                GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, colorObject);
            }



            allColorObject.primary = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor);
            allColorObject.secondary = Utility.getObjectlength(colorObject) > 0 ? colorObject : GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
            allColorObject.accent = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor);

            if (anchorPoint) {
                if (allColorObject.primary) {
                    allColorObject.primary.background = anchorPoint.FontColor.RgbHexadecimal;
                    allColorObject.primary.colorName = anchorPoint.FontColor.Name;
                    allColorObject.primary.colorid = anchorPoint.FontColor.ColorId;
                }

                if (allColorObject.secondary && (allColorObject.secondary.ColorId || allColorObject.secondary.colorid)) {
                    allColorObject.secondary.background = anchorPoint.FontOutlineColor1.RgbHexadecimal;
                    allColorObject.secondary.colorName = anchorPoint.FontOutlineColor1.Name;
                    allColorObject.secondary.colorid = anchorPoint.FontOutlineColor1.ColorId;
                }

                if (allColorObject.accent && (allColorObject.accent.ColorId || allColorObject.accent.colorid)) {
                    allColorObject.accent.background = anchorPoint.FontOutlineColor2.RgbHexadecimal;
                    allColorObject.accent.colorName = anchorPoint.FontOutlineColor2.Name;
                    allColorObject.accent.colorid = anchorPoint.FontOutlineColor2.ColorId;
                }

                var graphicObject = GlobalInstance.getSelectGraphicsInstance().getSelectedGraphicByGraphicId(anchorPoint.graphicId);
                anchorPoint.graphicUrl = LiquidPixels.getGraphicUrl(graphicObject, graphicObject.Nm, allColorObject, Utility.getGraphicLayerCount(graphicObject.Lys), graphicObject.Lys)

                if (anchorPoint.graphicId == graphicObject.Id) {
                    //set the selected graphic colors object
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, colorObject);

                    //update the selected graphic url
                    imgUrl.graphicId = graphicObject.Id;
                    imgUrl.src = LiquidPixels.getGraphicUrl(graphicObject, graphicObject.Nm, allColorObject, Utility.getGraphicLayerCount(graphicObject.Lys), graphicObject.Lys);
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl, imgUrl);
                }
            } else {
                //set the selected graphic colors object
                GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, colorObject);

                //update the selected graphics color
                imgUrl.graphicId = graphicObject.Id;
                imgUrl.src = LiquidPixels.getGraphicUrl(graphicObject, graphicObject.Nm, allColorObject, Utility.getGraphicLayerCount(graphicObject.Lys), graphicObject.Lys);
                GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl, imgUrl);
            }

        }


        $("#dvIdSelectedFillColorAnchorPointOutlineFirst").removeClass("slashImage");
        $("#dvIdColorNameAnchorPointOutlineFirst").html("");

        if (!fontColorOutline1) {
            $('#dvIdColorBoxAnchorPointOutlineFirst ul li').attr({
                'class': 'in-active'
            });

            $("#dvIdSelectedFillColorAnchorPointOutlineFirst").attr({
                'style': "",
                'colorid': ''
            });
        }
        if (e.target.id == "colorid_0") {
            $("#dvIdSelectedFillColorAnchorPointOutlineFirst").addClass("slashImage color_box_selected");
        }

        $('#dvIdSelectedFillColorAnchorPointOutlineFirst').attr({
            'name': clickedLiFirstElement.attr('data-name'),
            'matchButtonColorID': clickedLiFirstElement.attr('data-matchButtonColorID'),
            'cmykValue': clickedLiFirstElement.attr('data-cmykValue'),
            'colorid': clickedLiFirstElement.attr('colorid'),
            'rgbValue': clickedLiFirstElement.attr('data-rgbValue'),
            'rgbHexadecimal': clickedLiFirstElement.attr('rgbHexadecimal'),
            'alt': clickedLiFirstElement.attr('alt'),
            'displayname': clickedLiFirstElement.attr('name'),
            'style': clickedLiFirstElement.attr('style')
        });
        $('#dvIdColorNameAnchorPointOutlineFirst').html(clickedLiFirstElement.attr('alt'));

        $('#dvIdColorBoxAnchorPointOutlineFirst').hide();
        thisObject.previewAnchorImage();

        //set an array in global configuration
        if (anchorPoint) {
            thisObject.setAnchorPointsInUniformConfiguration();
            LiquidPixels.updateModelPreview('apjs 1682');
        }
    });


    //Second Outline Color Combo Box Binding
    $(document).off('click', '#dvIdAnchorPointOutlineSecond');
    $(document).on('click', '#dvIdAnchorPointOutlineSecond', function () {
        $('#dvIdColorBoxAnchorPoint').hide();
        $('#dvIdColorBoxAnchorPointOutlineFirst').hide();

        if ($('#dvIdColorBoxAnchorPointOutlineSecond').is(':visible')) {
            $('#dvIdColorBoxAnchorPointOutlineSecond').hide();
        } else {
            setTimeout(function () {
                $('#dvIdColorBoxAnchorPointOutlineSecond').show();
            }, 10);
            $('#dvIdColorBoxAnchorPointOutlineSecond').draggable({
                containment: '#dvConfiguratorPanel'
            });
        }
        return false;
    });

    $(document).off('click', '#dvIdColorBoxAnchorPointOutlineSecond ul li,#dvIdAnchorPointOutlineSecondCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxAnchorPointOutlineSecond ul li ,#dvIdAnchorPointOutlineSecondCustomColor ul li', function (e) {
        var clickedLi = $(this).children();
        var clickedLiFirstElement = clickedLi.first();

        //update state class
        $('#dvIdColorBoxAnchorPointOutlineSecond ul li').attr({
            'class': 'in-active'
        });
        $(this).attr({
            'class': 'active'
        });

        var panelId = thisObject.currentPanelId;

        var fontColorOutline2 = GlobalInstance.colorInstance.getColorByKey('_' + clickedLiFirstElement.attr('colorid'));
        GlobalInstance.getColorRetainInstance().setModifiedColors(false, false, true, fontColorOutline2);

        var anchorPoint = thisObject.getSelectedAnchorObj();
        if (anchorPoint) {
            anchorPoint.FontOutlineColor2 = fontColorOutline2;
        }
        //updates the global configuration values
        if (panelId == thisObject.playerNameAnchorPanelId) {
            GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontOutline2Color', fontColorOutline2);
        }
        else if (panelId == thisObject.playerNumberAnchorPanelId) {
            GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontOutline2Color', fontColorOutline2);
        }
        else if (panelId == thisObject.teamNameAnchorPanelId) {
            GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontOutline2Color', fontColorOutline2);
        }
        else if (panelId == thisObject.otherTextAnchorPanelId) {
            GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontOutline2Color', fontColorOutline2);
        }
        else if (panelId == thisObject.emblemAndGraphicsPanel) {
            var graphicObject = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign);
            var imgUrl = {};
            var allColorObject = {};

            //create color object
            var colorObject = {};
            var backgroundColor = (fontColorOutline2 != null && fontColorOutline2 != undefined) ? fontColorOutline2.RgbHexadecimal : null
            var colorName = (fontColorOutline2 != null && fontColorOutline2 != undefined) ? fontColorOutline2.Name : null
            var colorId = (fontColorOutline2 != null && fontColorOutline2 != undefined) ? fontColorOutline2.ColorId : 0
            colorObject.background = 'background-color:' + backgroundColor;
            colorObject.colorName = colorName;
            colorObject.colorid = colorId;
            GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, colorObject);


            allColorObject.primary = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor);
            allColorObject.secondary = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
            allColorObject.accent = Utility.getObjectlength(colorObject) > 0 ? colorObject : GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor);

            if (anchorPoint) {
                if (allColorObject.primary) {
                    allColorObject.primary.background = anchorPoint.FontColor.RgbHexadecimal;
                    allColorObject.primary.colorName = anchorPoint.FontColor.Name;
                    allColorObject.primary.colorid = anchorPoint.FontColor.ColorId;
                }

                if (allColorObject.secondary && (allColorObject.secondary.ColorId || allColorObject.secondary.colorid)) {
                    allColorObject.secondary.background = anchorPoint.FontOutlineColor1.RgbHexadecimal;
                    allColorObject.secondary.colorName = anchorPoint.FontOutlineColor1.Name;
                    allColorObject.secondary.colorid = anchorPoint.FontOutlineColor1.ColorId;
                }

                if (allColorObject.accent && (allColorObject.accent.ColorId || allColorObject.accent.colorid)) {
                    allColorObject.accent.background = anchorPoint.FontOutlineColor2.RgbHexadecimal;
                    allColorObject.accent.colorName = anchorPoint.FontOutlineColor2.Name;
                    allColorObject.accent.colorid = anchorPoint.FontOutlineColor2.ColorId;
                }

                var graphicObject = GlobalInstance.getSelectGraphicsInstance().getSelectedGraphicByGraphicId(anchorPoint.graphicId);
                anchorPoint.graphicUrl = LiquidPixels.getGraphicUrl(graphicObject, graphicObject.Nm, allColorObject, Utility.getGraphicLayerCount(graphicObject.Lys), graphicObject.Lys)

                if (anchorPoint.graphicId == graphicObject.Id) {
                    //set the selected graphic colors object
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, colorObject);

                    //update the selected graphic url
                    imgUrl.graphicId = graphicObject.Id;
                    imgUrl.src = LiquidPixels.getGraphicUrl(graphicObject, graphicObject.Nm, allColorObject, Utility.getGraphicLayerCount(graphicObject.Lys), graphicObject.Lys);
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl, imgUrl);
                }
            } else {
                //set the selected graphic colors object
                GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, colorObject);

                //update the selected graphics color
                imgUrl.graphicId = graphicObject.Id;
                imgUrl.src = LiquidPixels.getGraphicUrl(graphicObject, graphicObject.Nm, allColorObject, Utility.getGraphicLayerCount(graphicObject.Lys), graphicObject.Lys);
                GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl, imgUrl);
            }
        }


        $("#dvIdColorNameAnchorPointOutlineSecond").html("");

        if (!fontColorOutline2) {
            $('#dvIdColorBoxAnchorPointOutlineSecond ul li').attr({
                'class': 'in-active'
            });

            $("#dvIdSelectedFillColorAnchorPointOutlineSecond").attr({
                'style': "",
                'colorid': ''
            });
        }
        $("#dvIdSelectedFillColorAnchorPointOutlineSecond").removeClass("slashImage");
        if (e.target.id == "colorid_0") {
            $("#dvIdSelectedFillColorAnchorPointOutlineSecond").addClass("slashImage color_box_selected");
        }
        $('#dvIdColorBoxAnchorPointOutlineSecond').hide();
        $('#dvIdSelectedFillColorAnchorPointOutlineSecond').attr({
            'name': clickedLiFirstElement.attr('data-name'),
            'colorid': clickedLiFirstElement.attr('colorid'),
            'matchButtonColorID': clickedLiFirstElement.attr('data-matchButtonColorID'),
            'cmykValue': clickedLiFirstElement.attr('data-cmykValue'),
            'rgbValue': clickedLiFirstElement.attr('data-rgbValue'),
            'rgbHexadecimal': clickedLiFirstElement.attr('rgbHexadecimal'),
            'alt': clickedLiFirstElement.attr('alt'),
            'displayname': clickedLiFirstElement.attr('name'),
            'style': clickedLiFirstElement.attr('style')
        });
        $('#dvIdColorNameAnchorPointOutlineSecond').html(clickedLiFirstElement.attr('alt'));
        thisObject.previewAnchorImage();

        //set an array in global configuration
        if (anchorPoint) {
            thisObject.setAnchorPointsInUniformConfiguration();
            LiquidPixels.updateModelPreview('apjs 1871');
        }

    });
};

/**
 * This method update the color boxes using the color values of last screen
 * @returns {void}
 */
AnchorPoint.prototype.updateAnchorPointDataUI = function () {
    var oColor1;
    var oColor2;
    var oColor3;
    var text;
    var font;
    var textOrientiation;
    var graphicsUrl;
    var graphicsId;
    var graphicsLayerCount = 3; //default value
    var graphicCategoryName;
    var graphicSubCategoryName;
    var graphicCategoryId;
    var graphicSubCategoryId;
    var graphicWidth;
    var graphicHeight;

    $('#dvIdShowColorAnchorPointOutlineSecond').show();
    if (this.currentPanelId == this.playerNameAnchorPanelId) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("PLAYER NAMES");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_PLAYER_NAME'));
        oColor1 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontColor');
        oColor2 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline1Color');
        oColor3 = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline2Color');
        text = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('text');
        font = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('font');
        textOrientiation = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('textOrientation');
    }
    else if (this.currentPanelId == this.emblemAndGraphicsPanel) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("GRAPHICS");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_GRAPHIC'));
        oColor1 = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor);
        oColor2 = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor);
        oColor3 = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor);
        var colorId = 0;
        if (oColor1) {
            colorId = oColor1.colorid || oColor1.ColorId;
            oColor1 = GlobalInstance.colorInstance.getColorByKey('_' + colorId);
        }
        if (oColor2) {
            colorId = oColor2.colorid || oColor2.ColorId;
            oColor2 = GlobalInstance.colorInstance.getColorByKey('_' + colorId);
        }
        if (oColor3) {
            colorId = oColor3.colorid || oColor3.ColorId;
            oColor3 = GlobalInstance.colorInstance.getColorByKey('_' + colorId);
        }
        text = '';
        font = '';
        var graphicsObj = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl);
        if (graphicsObj) {
            graphicsUrl = graphicsObj.src;
        }

        var graphicCategoryObj = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicCategory);
        if (graphicCategoryObj) {
            graphicCategoryId = graphicCategoryObj.GraphicCategoryId;
            graphicCategoryName = graphicCategoryObj.Name;
        }

        var graphicSubCategoryObj = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicSubCategory);
        if (graphicSubCategoryObj) {
            graphicSubCategoryId = graphicSubCategoryObj.categoryId;
            graphicSubCategoryName = graphicSubCategoryObj.Name;
        }

        var graphicDesignObject = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign);
        if (graphicDesignObject) {
            graphicsId = graphicDesignObject.Id;
            graphicsLayerCount = Utility.getGraphicLayerCount(graphicDesignObject.Lys);
        }
    }
    else if (this.currentPanelId == this.playerNumberAnchorPanelId) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("PLAYER NUMBERS");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_PLAYER_NUMBER'));
        oColor1 = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('fontColor');
        oColor2 = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('fontOutline1Color');
        oColor3 = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('fontOutline2Color');
        text = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('text');
        font = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('font');
    }
    else if (this.currentPanelId == this.teamNameAnchorPanelId) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("TEAM NAMES");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_TEAM_NAME'));
        oColor1 = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('fontColor');
        oColor2 = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('fontOutline1Color');
        oColor3 = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('fontOutline2Color');
        text = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('text');
        font = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('font');
        textOrientiation = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('textOrientation');
    }
    else if (this.currentPanelId == this.otherTextAnchorPanelId) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("OTHER TEXT");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_OTHER_TEXT'));
        oColor1 = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('fontColor');
        oColor2 = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('fontOutline1Color');
        oColor3 = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('fontOutline2Color');
        text = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('text');
        font = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('font');
        textOrientiation = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('textOrientation');
    }
    else if (this.currentPanelId == this.myLockerPanelId) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("UPLOADED GRAPHIC");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_UPLOADED_GRAPHIC'));
        oColor1 = '';
        oColor2 = '';
        oColor3 = '';
        text = '';
        font = '';
        graphicsUrl = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo('src');
        graphicsId = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo('src');
        graphicWidth = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo('width');
        graphicHeight = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo('height');
    }

    //updates the anchor point data if not decoreted
    for (var key in this.allAnchorPoints) {
        var anchorPoint = this.allAnchorPoints[key];
        if (!anchorPoint.IsDecorated) {
            if ((this.currentPanelId == this.playerNameAnchorPanelId && anchorPoint.allowPlayerName)
                    || (this.currentPanelId == this.playerNumberAnchorPanelId && anchorPoint.allowPlayerNumber)
                    || (this.currentPanelId == this.teamNameAnchorPanelId && anchorPoint.allowTeamName)
                    || (this.currentPanelId == this.emblemAndGraphicsPanel && anchorPoint.allowemblemAndGraphics)
                    || (this.currentPanelId == this.myLockerPanelId && anchorPoint.AllowUploadedGraphics)
                    || (this.currentPanelId == this.otherTextAnchorPanelId && anchorPoint.allowOtherText)) {
                anchorPoint.Text = text;
                anchorPoint.Font = font;
                anchorPoint.FontColor = oColor1;
                anchorPoint.FontOutlineColor1 = oColor2;
                anchorPoint.FontOutlineColor2 = oColor3;
                anchorPoint.graphicUrl = graphicsUrl;
                anchorPoint.graphicId = graphicsId;
                anchorPoint.colorsChoiceCount = graphicsLayerCount;
                anchorPoint.graphicCategoryName = graphicCategoryName;
                anchorPoint.graphicSubCategoryName = graphicSubCategoryName;
                anchorPoint.graphicCategoryId = graphicCategoryId;
                anchorPoint.graphicSubCategoryId = graphicSubCategoryId;
                anchorPoint.TextOrientation = textOrientiation;
                anchorPoint.GraphicWidth = graphicWidth;
                anchorPoint.GraphicHeight = graphicHeight;
            }
        } else {
            //if anchor point data is changed then upate data related to the selected anchor
            if (this.currentPanelId != this.myLockerPanelId && this.currentPanelId == anchorPoint.SelectionPanelId) {

                //if anchor point panel is graphic and the graphic is different then do not update the details
                if (anchorPoint.SelectionPanelId == this.emblemAndGraphicsPanel && graphicsId != anchorPoint.graphicId) {
                    continue;
                }

                var savedAnchorPointObject = this.getSavedAnchorPointByKey(anchorPoint.id);

                //Set the font Object
                var fontObject = {};
                fontObject.displayname = savedAnchorPointObject.FontName;
                fontObject.fontid = savedAnchorPointObject.FontId;
                fontObject.fileloc = savedAnchorPointObject.Font;

                //Get the ColorInstance
                GlobalInstance.colorInstance = GlobalInstance.getColorInstance();


                //Get the Graphics Instance
                var savedGraphicObject = GlobalInstance.getSelectGraphicsInstance().getSelectedGraphicByGraphicId(savedAnchorPointObject.GraphicId);
                var graphicLayerCount = 3;
                if (savedAnchorPointObject.type == LOCATION_TYPE.get('secEmblemAndGraphicsPanel')) {
                    if (savedGraphicObject) {
                        graphicLayerCount = Utility.getGraphicLayerCount(savedGraphicObject.Lys)
                    }
                }

                anchorPoint.Text = text;
                anchorPoint.Font = fontObject;
                anchorPoint.FontColor = GlobalInstance.colorInstance.getColorByKey('_' + savedAnchorPointObject.FontColor);
                anchorPoint.FontOutlineColor1 = GlobalInstance.colorInstance.getColorByKey('_' + savedAnchorPointObject.FontOutlineColor1);
                anchorPoint.FontOutlineColor2 = GlobalInstance.colorInstance.getColorByKey('_' + savedAnchorPointObject.FontOutlineColor2);
                anchorPoint.graphicUrl = savedAnchorPointObject.GraphicUrl;
                anchorPoint.graphicId = savedAnchorPointObject.GraphicId;
                anchorPoint.colorsChoiceCount = graphicLayerCount;
                anchorPoint.graphicCategoryName = savedAnchorPointObject.GraphicCategoryName;
                anchorPoint.graphicSubCategoryName = savedAnchorPointObject.GraphicSubCategoryName;
                anchorPoint.graphicCategoryId = savedAnchorPointObject.GraphicCategoryId;
                anchorPoint.graphicSubCategoryId = savedAnchorPointObject.GraphicSubCategoryId;
                anchorPoint.TextOrientation = savedAnchorPointObject.TextOrientation;
                anchorPoint.GraphicWidth = savedAnchorPointObject.GraphicWidth;
                anchorPoint.GraphicHeight = savedAnchorPointObject.GraphicHeight;
            }
        }
        this.allAnchorPoints[key] = anchorPoint;
    }

    //if last seelcted anchor is of different panel, unselect that point
    var anchorPointObj = this.getSelectedAnchorObj();

    if (anchorPointObj != null) {/* && anchorPointObj.SelectionPanelId !== this.currentPanelId) {*/
        anchorPointObj.IsSelected = false;
    }

    this.setAnchorPointsInUniformConfiguration();
    this.setColorValues(oColor1, oColor2, oColor3);
};
/**
 * This method is responsible to set the current selected size values
 * @returns {undefined}
 */
AnchorPoint.prototype.setCurrentSelectedAnchorSizeValues = function (isDefineClicked) {
    var anchorObj = this.getSelectedAnchorObj();

    if (typeof isDefineClicked == undefined) {
        isDefineClicked = false;
    }
    if (anchorObj && !isDefineClicked) {
        var sizesObject = this.getSizesObjectForCurrentPanel(anchorObj);

        var divHtml = "";
        //TODO: if we need to show default size then uncomment lines
        /*if (sizesObject)
        {
         var defaultSize = CONFIG.get("DEFAULT_SIZE");
            divHtml += "<div class='anchorPointDropdownListText' id='anchorPointDropdownListTextId'>" + defaultSize + "</div>";
        } else
        {*/
        if (sizesObject.length > 0) {
            for (var i = 0; i < sizesObject.length; i++) {
                divHtml += "<div class='anchorPointDropdownListText' id='" + sizesObject[i].SizeId + "'>" + sizesObject[i].Name + "</div>";
            }
        }
        //}


        if (!anchorObj.selectedSize) {
            anchorObj.selectedSize = sizesObject[0];
        }

        if (anchorObj.selectedSize) {

            var isMappedSizeId = jQuery.map(sizesObject, function (obj) {
                if (obj.SizeId == anchorObj.selectedSize.SizeId) {
                    return true;
                }
            });

            if (isMappedSizeId.length > 0) {
                isMappedSizeId = isMappedSizeId[0];
            }
            else {
                isMappedSizeId = false;
            }

            if (isMappedSizeId) {
                $("#dvIdAnchorPointSelectedSize").html(anchorObj.selectedSize.Name);
            } else {
                anchorObj.selectedSize = sizesObject[0];
                $("#dvIdAnchorPointSelectedSize").html(anchorObj.selectedSize.Name);
            }


        } else {
            $("#dvIdAnchorPointSelectedSize").html('');
        }
        $("#dvIdAnchorSizeComboDropdown").html(divHtml);
        $("#dvAnchorpointSizeBox").show();
        $("#labelAnchorpointSize").show();
    } else {
        $("#dvAnchorpointSizeBox").hide();
        $("#labelAnchorpointSize").hide();
    }
};

/**
 * This method returns the size object of passed anchor Object using current panel
 * @param  anchorPointObject Object of anchor point to pass the details
 * @returns {void}
 */
AnchorPoint.prototype.getSizesObjectForCurrentPanel = function (anchorPointObject) {
    if (!anchorPointObject) {
        return null;
    }

    if (anchorPointObject.SelectionPanelId == this.otherTextAnchorPanelId && anchorPointObject.allowOtherText == true) {
        return anchorPointObject.TextSizes;
    } else if (anchorPointObject.SelectionPanelId == this.teamNameAnchorPanelId && anchorPointObject.allowTeamName == true) {
        return anchorPointObject.TextSizes;
    } else if ((anchorPointObject.SelectionPanelId == this.emblemAndGraphicsPanel && anchorPointObject.allowemblemAndGraphics == true)) {
        return anchorPointObject.GraphicSizes;
    } else if ((anchorPointObject.SelectionPanelId == this.myLockerPanelId && anchorPointObject.AllowUploadedGraphics == true)) {
        return anchorPointObject.UploadedGraphicSizes;
    } else if (anchorPointObject.SelectionPanelId == this.playerNumberAnchorPanelId && anchorPointObject.allowPlayerNumber == true) {
        return anchorPointObject.PlayerNumberSizes;
    } else if (anchorPointObject.SelectionPanelId == this.playerNameAnchorPanelId && anchorPointObject.allowPlayerName == true) {
        return anchorPointObject.PlayerNameSizes;
    }
    return null;
};

/**
 * This method sets the color values in the colr box using passed color object
 * 
 * 
 * @param  oColor1, font color object
 * @param  oColor2, font outline1 color object
 * @param  oColor3, font outline2 color object
 * @returns void
 */
AnchorPoint.prototype.setColorValues = function (oColor1, oColor2, oColor3) {
    if (oColor1) {
        var cObject = oColor1;
        var isSecondaryColorUsed = false;
        var isAccentColorUsed = false;
        //Set the Anchor Point Color depends upon the graphics for Graphic Panel
        if (this.currentPanelId == this.emblemAndGraphicsPanel) {
            if (oColor1) {
                if (GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId1) == CONFIG.get('COLORIZEID_COLOR_1')) {
                    cObject = oColor1;
                } else {
                    if (GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId2) == CONFIG.get('COLORIZEID_COLOR_2')
                        && GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId1) == CONFIG.get('COLORIZEID_NONE')) {
                        isSecondaryColorUsed = true;
                        if (oColor2) {
                            cObject = oColor2;
                        }
                    } else if (GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId3) == CONFIG.get('COLORIZEID_COLOR_3')
                        && GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId2) == CONFIG.get('COLORIZEID_NONE')
                        && GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId1) == CONFIG.get('COLORIZEID_NONE')) {
                        isAccentColorUsed = true;
                        if (oColor3) {
                            cObject = oColor3;
                        }
                    }
                }
            }

        }
    } else if (!oColor1 && GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId1) == CONFIG.get('COLORIZEID_NONE') && GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId2) == CONFIG.get('COLORIZEID_COLOR_2')) {
        isSecondaryColorUsed = true;
        if (oColor2) {
            cObject = oColor2;
        }
    } else if (!oColor1 && GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId1) == CONFIG.get('COLORIZEID_NONE') && GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId2) == CONFIG.get('COLORIZEID_NONE')
        && GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId3) == CONFIG.get('COLORIZEID_COLOR_3')) {
        isAccentColorUsed = true;
        if (oColor3) {
            cObject = oColor3;
        }
    }
    if (cObject && (cObject.ColorId || cObject.colorid)) {
        cObject = GlobalInstance.getColorInstance().getColorByKey('_' + cObject.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + cObject.colorid);
        $('#dvIdSelectedFillColorAnchorPoint').attr({
            'name': cObject.name,
            'colorid': cObject.ColorId,
            'matchButtonColorID': cObject.MatchingButtonColorId,
            'cmykValue': cObject.Cyan + ',' + cObject.Magenta + ',' + cObject.Yellow + ',' + cObject.Black,
            'rgbValue': cObject.Name,
            'rgbHexadecimal': cObject.RgbHexadecimal,
            'alt': cObject.Name,
            'displayname': cObject.Name,
            'style': 'background-color:' + cObject.RgbHexadecimal
        });
        $('#dvIdColorNameAnchorPoint').html(cObject.Name);
        //update state class
        $('#dvIdColorBoxAnchorPoint ul li').attr({
            'class': 'in-active'
        });
        $("#dvIdColorBoxAnchorPoint ul li[colorid='" + cObject.ColorId + "']").attr("class", "active");

    }
    $("#dvIdColorNameAnchorPointOutlineFirst").html("");
    if (oColor2 && (oColor2.ColorId || oColor2.colorid)) {
        cObject = oColor2;
        //Set the Anchor Point Color depends upon the graphics for Graphic Panel
        if (this.currentPanelId == this.emblemAndGraphicsPanel) {
            if (GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId2) == CONFIG.get('COLORIZEID_COLOR_2') && !isSecondaryColorUsed) {
                cObject = oColor2;
            } else if (GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId3) == CONFIG.get('COLORIZEID_COLOR_3')) {
                isAccentColorUsed = true;
                if (oColor3) {
                    cObject = oColor3;
                }
            }
        }
        $("#dvIdSelectedFillColorAnchorPointOutlineFirst").removeClass("slashImage");
        cObject = GlobalInstance.getColorInstance().getColorByKey('_' + cObject.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + cObject.colorid);
        $('#dvIdSelectedFillColorAnchorPointOutlineFirst').attr({
            'name': cObject.name,
            'colorid': cObject.ColorId,
            'matchButtonColorID': cObject.MatchingButtonColorId,
            'cmykValue': cObject.Cyan + ',' + cObject.Magenta + ',' + cObject.Yellow + ',' + cObject.Black,
            'rgbValue': cObject.Name,
            'rgbHexadecimal': cObject.RgbHexadecimal,
            'alt': cObject.Name,
            'displayname': cObject.Name,
            'style': 'background-color:' + cObject.RgbHexadecimal
        });
        $('#dvIdColorNameAnchorPointOutlineFirst').html(cObject.Name);
        //update state class
        $('#dvIdColorBoxAnchorPointOutlineFirst ul li').attr({
            'class': 'in-active'
        });
        $("#dvIdColorBoxAnchorPointOutlineFirst ul li[colorid='" + cObject.ColorId + "']").attr("class", "active");
    } else {
        $('#dvIdColorBoxAnchorPointOutlineFirst ul li').attr({
            'class': 'in-active'
        });

        $("#dvIdSelectedFillColorAnchorPointOutlineFirst").attr({
            'style': "",
            'colorid': ''
        });
        //$("#dvIdSelectedFillColorAnchorPointOutlineFirst").html(this.htmlSlashImg);
        $("#dvIdSelectedFillColorAnchorPointOutlineFirst").addClass("slashImage color_box_selected");
    }


    $("#dvIdColorNameAnchorPointOutlineSecond").html("");
   // setTimeout(function () {
        if (oColor3 && (oColor3.ColorId || oColor3.colorid)) {
            $("#dvIdSelectedFillColorAnchorPointOutlineSecond").removeClass("slashImage");
            oColor3 = GlobalInstance.getColorInstance().getColorByKey('_' + oColor3.ColorId) || GlobalInstance.getColorInstance().getColorByKey('_' + oColor3.colorid);
            $('#dvIdSelectedFillColorAnchorPointOutlineSecond').attr({
                'name': oColor3.name,
                'colorid': oColor3.ColorId,
                'matchButtonColorID': oColor3.MatchingButtonColorId,
                'cmykValue': oColor3.Cyan + ',' + oColor3.Magenta + ',' + oColor3.Yellow + ',' + oColor3.Black,
                'rgbValue': oColor3.Name,
                'rgbHexadecimal': oColor3.RgbHexadecimal,
                'alt': oColor3.Name,
                'displayname': oColor3.Name,
                'style': 'background-color:' + oColor3.RgbHexadecimal
            });
            $('#dvIdColorNameAnchorPointOutlineSecond').html(oColor3.Name);

            //update state class
            $('#dvIdColorBoxAnchorPointOutlineSecond ul li').attr({
                'class': 'in-active'
            });
            $("#dvIdColorBoxAnchorPointOutlineSecond ul li[colorid='" + oColor3.ColorId + "']").attr("class", "active");
        } else {
            $('#dvIdColorBoxAnchorPointOutlineSecond ul li').attr({
                'class': 'in-active'
            });

            $("#dvIdSelectedFillColorAnchorPointOutlineSecond").attr({
                'style': "",
                'colorid': ''
            });
            //$("#dvIdSelectedFillColorAnchorPointOutlineSecond").html(this.htmlSlashImg);
            $("#dvIdSelectedFillColorAnchorPointOutlineSecond").addClass("slashImage color_box_selected");
        }
    //}, 10);
    try {
        var colorChoiceCount = 3; //defalut value
        var selectedAnchorPoint = this.getSelectedAnchorObj();
        if (selectedAnchorPoint) {
            colorChoiceCount = selectedAnchorPoint.colorsChoiceCount;
        } else {
            if (this.currentPanelId == this.emblemAndGraphicsPanel) {
                var graphicDesign = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign);
                if (graphicDesign) {
                    colorChoiceCount = Utility.getGraphicLayerCount(graphicDesign.Lys);
                }
            }
        }

        //set the color choice count
        if (selectedAnchorPoint) {
            selectedAnchorPoint.colorsChoiceCount = colorChoiceCount;
        }

        if (colorChoiceCount == 2) {
            //hide accent color
            $('#dvIdFillColorAnchorPoint').show();
            $('#dvIdShowColorAnchorPointOutlineFirst').show();
            $('#dvIdShowColorAnchorPointOutlineSecond').hide();
        } else if (colorChoiceCount <= 1) {
            //hide accent color and secondary color
            $('#dvIdFillColorAnchorPoint').show();
            $('#dvIdShowColorAnchorPointOutlineFirst').hide();
            $('#dvIdShowColorAnchorPointOutlineSecond').hide();
        } else {
            $('#dvIdFillColorAnchorPoint').show();
            $('#dvIdShowColorAnchorPointOutlineFirst').show();
            $('#dvIdShowColorAnchorPointOutlineSecond').show();
        }
    } catch (e) {
        if (GlobalInstance.anchorPointInstance.colorSetCallBack)
            GlobalInstance.anchorPointInstance.colorSetCallBack();
        $('#dvIdFillColorAnchorPoint').show();
        $('#dvIdShowColorAnchorPointOutlineFirst').show();
        $('#dvIdShowColorAnchorPointOutlineSecond').show();
    }
    if (GlobalInstance.anchorPointInstance.colorSetCallBack)
        GlobalInstance.anchorPointInstance.colorSetCallBack();
};

/**
 * This method updates the preview anchor image, using the latest colors
 * 
 * @returns {void}
 */
AnchorPoint.prototype.previewAnchorImage = function () {
    try {
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var anchorObj = this.getSelectedAnchorObj();
        var thisObject = this;
        var isFlip = false;
        if (anchorObj) {
            var sText = anchorObj.Text;
            var fontObj = anchorObj.Font;
            var oTextEffect = anchorObj.TextOrientation;
            var graphicUrl = anchorObj.graphicUrl;
            isFlip = anchorObj.isFlip;
        }

        if (anchorObj == null) {
            if (this.currentPanelId == this.playerNameAnchorPanelId) {
                sText = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('text');
                fontObj = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('font');
                oTextEffect = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('textOrientation');
            }
            else if (this.currentPanelId == this.playerNumberAnchorPanelId) {
                sText = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('text');
                fontObj = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('font');
                oTextEffect = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('textOrientation');
            }
            else if (this.currentPanelId == this.teamNameAnchorPanelId) {
                sText = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('text');
                fontObj = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('font');
                oTextEffect = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('textOrientation');
            }
            else if (this.currentPanelId == this.otherTextAnchorPanelId) {
                sText = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('text');
                fontObj = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('font');
                oTextEffect = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('textOrientation');
            }
            else if (this.currentPanelId == this.emblemAndGraphicsPanel) {
                var graphicObj = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicUrl);
                //var graphicDesignObj = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicSubCategory);
                if (graphicObj != null) {
                    graphicUrl = graphicObj.src;
                    if (isFlip) {
                        graphicUrl = graphicUrl.replace("sink=format[png]", "flipy&sink=format[png]");
                    }
                }
            }
            else if (this.currentPanelId == this.myLockerPanelId) {
                graphicUrl = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo('src');
            }
        }
    } catch (err) {

    }
    try {
        GlobalInstance.colorInstance = GlobalInstance.getColorInstance(null, null, null);
        var fontColorId = $('#dvIdSelectedFillColorAnchorPoint').attr('colorid');
        var fontColorOutline1Id = $('#dvIdSelectedFillColorAnchorPointOutlineFirst').attr('colorid');
        var fontColorOutline2Id = $('#dvIdSelectedFillColorAnchorPointOutlineSecond').attr('colorid');


        var sFont = fontObj ? fontObj.displayname : null;
        var oColor1 = GlobalInstance.colorInstance.getColorByKey('_' + fontColorId);
        var oColor2 = GlobalInstance.colorInstance.getColorByKey('_' + fontColorOutline1Id);
        var oColor3 = GlobalInstance.colorInstance.getColorByKey('_' + fontColorOutline2Id);
        var iHeight = 30;



        var previewImageUrl = '';

        if (graphicUrl) {
            if (this.currentPanelId == this.myLockerPanelId) {
                graphicUrl = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo('src');
                previewImageUrl = graphicUrl;
                if (isFlip) {
                    previewImageUrl = previewImageUrl.replace('sink=format[png]', 'flipy&sink=format[png]');
                }
            } else if (this.currentPanelId == this.emblemAndGraphicsPanel) {
                var colorObject = {};
                var isSecondaryColorUsed = false;
                var isAccentColorUsed = false;
                var colorizeId1 = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId1);
                var colorizeId2 = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId2);
                var colorizeId3 = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.ColorizeId3);

                //Primary Color Case
                if (colorizeId1 == CONFIG.get('COLORIZEID_COLOR_1')) {
                    colorObject.primary = oColor1;
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicPrimaryColor, oColor1);
                } else {
                    if (colorizeId2 == CONFIG.get('COLORIZEID_COLOR_2')) {
                        isSecondaryColorUsed = true;
                        colorObject.secondary = oColor1;
                        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, oColor2);
                    } else if (colorizeId3 == CONFIG.get('COLORIZEID_COLOR_3') && colorizeId2 == CONFIG.get('COLORIZEID_NONE')) {
                        isAccentColorUsed = true;
                        colorObject.accent = oColor1;
                        GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, oColor3);
                    }
                }

                //Secondary Color Case
                if (colorizeId2 == CONFIG.get('COLORIZEID_COLOR_2') && !isSecondaryColorUsed) {
                    colorObject.secondary = oColor2;
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicSecondaryColor, oColor2);
                } else if (colorizeId3 == CONFIG.get('COLORIZEID_COLOR_3') && !isAccentColorUsed && isSecondaryColorUsed) {
                    isAccentColorUsed = true;
                    colorObject.accent = oColor2;
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, oColor3);
                }

                //Accent Color Case
                if (colorizeId3 == CONFIG.get('COLORIZEID_COLOR_3') && !isAccentColorUsed) {
                    colorObject.accent = oColor3;
                    GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(GRAPHIC_KEY.CustomizeGraphicAccentColor, oColor3);
                }

                var selectedGraphicObject = GlobalInstance.uniformConfigurationInstance.getSelectGraphicInfo(GRAPHIC_KEY.GraphicDesign);
                previewImageUrl = LiquidPixels.getGraphicUrl(selectedGraphicObject, selectedGraphicObject.Nm, colorObject, Utility.getGraphicLayerCount(selectedGraphicObject.Lys), selectedGraphicObject.Lys)
                //previewImageUrl = graphicUrl;
                if (isFlip) {
                    previewImageUrl = previewImageUrl.replace('sink=format[png]', 'flipy&sink=format[png]');
                }
                previewImageUrl = previewImageUrl.replace('scale=height[50]', 'scale=height[40]');
            } else if (this.currentPanelId != this.myLockerPanelId || this.currentPanelId != this.emblemAndGraphicsPanel) {
                previewImageUrl = graphicUrl;
                previewImageUrl = previewImageUrl.replace('scale=height[50]', 'scale=height[40]');
            }
        } else if (fontObj && sText && sFont && oColor1 != undefined && (oColor1.rgbHexadecimal || oColor1.RgbHexadecimal) != undefined) {
            var colorOutline1 = "None";
            var colorOutline2 = "None";
            var textObject = new Object();
            var iHeight = 50;
            var sFontSize = "50";
            var colorOutline1 = "None";
            var colorOutline2 = "None";
            var sFontColor = (oColor1.rgbHexadecimal || oColor1.RgbHexadecimal).replace("#", "");

            var sFontWidth = "50";
            var sBaseColor = "ffffff";
            var sBaseImgWidth = "100";
            var sBaseImgHeight = "100";
            var sCurveRadius = "100";
            var sCentreXCoordinate = "180";
            var sCentreYCoordinate = "150";
            var sFontName = '';
            if (fontObj.fileloc) {
                sFontName = fontObj.fileloc.substring(fontObj.fileloc.indexOf('/') + 1);
            }

            var objTextEffect = oTextEffect ? oTextEffect.TextEffectCategorys[0].TextEffects[0] : null;
            var sTextEffect = oTextEffect ? oTextEffect.TextEffectCategorys[0].TextEffects[0].FileLocation : '';

            if (oColor2 != undefined) {
                colorOutline1 = oColor2.rgbHexadecimal || oColor2.RgbHexadecimal;
                colorOutline1 = colorOutline1.substring(colorOutline1.indexOf('#') + 1);
            }

            if (oColor3 != undefined) {
                colorOutline2 = oColor3.rgbHexadecimal || oColor3.RgbHexadecimal;
                colorOutline2 = colorOutline2.substring(colorOutline2.indexOf('#') + 1);
            }

            previewImageUrl = LiquidPixels.generateTextEffectPreviewURL(objTextEffect, sTextEffect,
                    sText,
                    sFontName,
                    fontObj.fontid,
                    sFontColor,
                    colorOutline1,
                    colorOutline2,
                    sBaseImgWidth,
                    sBaseImgHeight
                    );
        } else {
            return;
        }
        //use getanyfile URL chain
        var urlPreviewImageWithAnyFile = LiquidPixels.getAnyFileUrl(previewImageUrl);
        if (!($('#imgIdPreviewTextIdAnchorPoint').attr('src') == previewImageUrl)) {

            //first set the source and blank and so that user would be able to see the change
            $('#imgIdPreviewTextIdAnchorPoint').attr("src", '');
            //set the preview image
            $.startProcess(true);
            $('#blanket').show();
            var image = new Image();
            image.onload = function () {
                $('#imgIdPreviewTextIdAnchorPoint').attr('src', image.src);
                $('#blanket').hide();
                $.doneProcess();
            };
            image.onerror = function () {
                $('#imgIdPreviewTextIdAnchorPoint').attr('src', image.src);
                $('#blanket').hide();
                $.doneProcess();
            };
            image.src = urlPreviewImageWithAnyFile;
        }
        textObject.type = LOCATION_TYPE.get(anchorObj.SelectionPanelId);
        textObject.src = urlPreviewImageWithAnyFile;
        textObject.anchorPointId = anchorObj.id;
        this.textUrl.push(textObject);
    } catch (err) {

    }
};
/**
 * this method binds the navigation buttons based on the current selected anchor point
 * @param  panelId currentPanelId to be pass 
 * @returns {void}
 */
AnchorPoint.prototype.bindNavigationButtons = function (panelId) {
    var thisObject = this;
    if (!panelId) {
        panelId = this.currentPanelId;
    }

    //change the button texts based on curent panel also
    if (panelId == this.playerNameAnchorPanelId) {
        $('#btnNavChooseLocationOne >a').html("Player Numbers");
        $('#btnNavChooseLocationTwo >a').html("Team Name");
        $('#btnNavChooseLocationThree >a').html("Other Text");
    }
    else if (panelId == this.playerNumberAnchorPanelId) {
        $('#btnNavChooseLocationOne >a').html("Player Names");
        $('#btnNavChooseLocationTwo >a').html("Team Name");
        $('#btnNavChooseLocationThree >a').html(" Other Text");
    }
    else if (panelId == this.teamNameAnchorPanelId) {
        $('#btnNavChooseLocationOne >a').html("Player Numbers");
        $('#btnNavChooseLocationTwo >a').html("Player Names");
        $('#btnNavChooseLocationThree >a').html("Other Text");
    }
    else if (panelId == this.otherTextAnchorPanelId) {
        $('#btnNavChooseLocationOne >a').html("Player Numbers");
        $('#btnNavChooseLocationTwo >a').html("Player Names");
        $('#btnNavChooseLocationThree >a').html("Team Name");
    }
    else {
        $('#btnNavChooseLocationOne >a').html("Select Graphic");
        $('#btnNavChooseLocationTwo >a').html("Upload Graphic");
        $('#btnNavChooseLocationThree >a').html("My Locker");
    }

    //$('#btnNavChooseLocationOne').off('click');
    //$('#btnNavChooseLocationOne').on('click', function() {
    $(document).off("click", "#btnNavChooseLocationOne");
    $(document).on("click", "#btnNavChooseLocationOne", function () {
        GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
        if ((panelId == thisObject.playerNameAnchorPanelId) || (panelId == thisObject.teamNameAnchorPanelId) || (panelId == thisObject.otherTextAnchorPanelId)) {
            //show player number
            GlobalInstance.numberAndTextInstance.show();
            GlobalInstance.getPlayerNameInstance().hide();
            GlobalInstance.getTeamNameInstance().hide();
            GlobalInstance.getOtherTextInstance().hide();
            GlobalInstance.anchorPointInstance.hide();
            GlobalInstance.getPlayerNumberInstance().show();

            GlobalInstance.googleAnalyticsUtilInstance.trackPlayerNumberClick();
        }
        else if ((panelId == thisObject.playerNumberAnchorPanelId)) {
            //show player name
            GlobalInstance.numberAndTextInstance.show();
            GlobalInstance.getTeamNameInstance().hide();
            GlobalInstance.getOtherTextInstance().hide();
            GlobalInstance.anchorPointInstance.hide();
            GlobalInstance.getPlayerNumberInstance().hide();
            GlobalInstance.getPlayerNameInstance().show();

            GlobalInstance.googleAnalyticsUtilInstance.trackPlayerNameClick();
        } else {
            //select graphics case
            GlobalInstance.anchorPointInstance.hide();
            GlobalInstance.emblemAndGraphicsInstance.show();
            GlobalInstance.getSelectGraphicsInstance().show();

            GlobalInstance.googleAnalyticsUtilInstance.trackSelectGraphicsClick();
        }
        return false;
    });

    //$('#btnNavChooseLocationTwo').off('click');
    //$('#btnNavChooseLocationTwo').on('click', function() {
    $(document).off("click", "#btnNavChooseLocationTwo");
    $(document).on("click", "#btnNavChooseLocationTwo", function () {
        GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();

        if ((panelId == thisObject.playerNameAnchorPanelId) || (panelId == thisObject.playerNumberAnchorPanelId)) {
            //team name case
            GlobalInstance.numberAndTextInstance.show();
            GlobalInstance.getOtherTextInstance().hide();
            GlobalInstance.anchorPointInstance.hide();
            GlobalInstance.getPlayerNumberInstance().hide();
            GlobalInstance.getPlayerNameInstance().hide();
            GlobalInstance.getTeamNameInstance().show();

            GlobalInstance.googleAnalyticsUtilInstance.trackTeamNamesClick();
        }
        else if ((panelId == thisObject.otherTextAnchorPanelId) || (panelId == thisObject.teamNameAnchorPanelId)) {
            //player name case
            GlobalInstance.numberAndTextInstance.show();
            GlobalInstance.getOtherTextInstance().hide();
            GlobalInstance.anchorPointInstance.hide();
            GlobalInstance.getPlayerNumberInstance().hide();
            GlobalInstance.getTeamNameInstance().hide();
            GlobalInstance.getPlayerNameInstance().show();

            GlobalInstance.googleAnalyticsUtilInstance.trackPlayerNameClick();
        } else {
            //upload graphics case
            GlobalInstance.anchorPointInstance.hide();
            GlobalInstance.emblemAndGraphicsInstance.show();
            GlobalInstance.getUploadGraphicsInstance().show();

            GlobalInstance.googleAnalyticsUtilInstance.trackUploadGraphicsClick();
        }

        return false;
    });

    //$('#btnNavChooseLocationThree').off('click');
    //$('#btnNavChooseLocationThree').on('click', function() {
    $(document).off("click", "#btnNavChooseLocationThree");
    $(document).on("click", "#btnNavChooseLocationThree", function () {
        GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();

        if ((panelId == thisObject.playerNameAnchorPanelId) || (panelId == thisObject.playerNumberAnchorPanelId) || (panelId == thisObject.teamNameAnchorPanelId)) {
            //other text case
            GlobalInstance.numberAndTextInstance.show();
            GlobalInstance.anchorPointInstance.hide();
            GlobalInstance.getPlayerNumberInstance().hide();
            GlobalInstance.getTeamNameInstance().hide();
            GlobalInstance.getPlayerNameInstance().hide();
            GlobalInstance.getOtherTextInstance().show();

            GlobalInstance.googleAnalyticsUtilInstance.trackOtherTextClick();
        }
        else if ((panelId == thisObject.otherTextAnchorPanelId)) {
            //team name case
            GlobalInstance.numberAndTextInstance.show();
            GlobalInstance.anchorPointInstance.hide();
            GlobalInstance.getPlayerNumberInstance().hide();
            GlobalInstance.getPlayerNameInstance().hide();
            GlobalInstance.getOtherTextInstance().hide();
            GlobalInstance.getTeamNameInstance().show();

            GlobalInstance.googleAnalyticsUtilInstance.trackTeamNamesClick();
        } else {
            //my locker case
            GlobalInstance.anchorPointInstance.hide();
            GlobalInstance.emblemAndGraphicsInstance.show();
            GlobalInstance.getMyLockerInstance().show();

            GlobalInstance.googleAnalyticsUtilInstance.trackMyLockerClick();
        }
    });
};

/**
 * This method updates the anchor screenheadings based on passed panelid
 * @param  panelId CurrentPanel Id 
 * @returns {void}
 */
AnchorPoint.prototype.updateScreenHeadings = function (panelId) {
    if (!panelId) {
        panelId = this.currentPanelId;
    }

    if (panelId == this.playerNameAnchorPanelId) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("PLAYER NAMES");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_PLAYER_NAME'));
    }
    else if (panelId == this.emblemAndGraphicsPanel) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("GRAPHICS");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_GRAPHIC'));
    }
    else if (panelId == this.playerNumberAnchorPanelId) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("PLAYER NUMBERS");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_PLAYER_NUMBER'));
    }
    else if (panelId == this.teamNameAnchorPanelId) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("TEAM NAMES");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_TEAM_NAME'));
    }
    else if (panelId == this.otherTextAnchorPanelId) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("OTHER TEXT");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_OTHER_TEXT'));
    }
    else if (panelId == this.myLockerPanelId) {
        $('#secAnchorPanel div#dvIdAnchorPointScreenLabel').html("UPLOADED GRAPHIC");
        $('#dvIdAnchorPointSubHeading').html(TITLE.get('TITLE_ANCHOR_UPLOADED_GRAPHIC'));
    }
}

/**
 *This method is responsible to check if passes anchorObject supports the current opening panel
 * @param anchorObject anchor point object
 * @returns true, if passes anchorObject supports the current opening panel 
 */
AnchorPoint.prototype.isAnchorSupportedOnCurrentPanel = function (anchorObject) {
    if (!anchorObject) {
        return false;
    }

    //do not render anchor points with name child
    if (anchorObject.displayName && anchorObject.displayName.toLowerCase().indexOf('child') >= 0) {
        return false;
    }

    return ((this.currentPanelId == this.playerNameAnchorPanelId && anchorObject.allowPlayerName == true)
            || (this.currentPanelId == this.playerNumberAnchorPanelId && anchorObject.allowPlayerNumber == true)
            || (this.currentPanelId == this.teamNameAnchorPanelId && anchorObject.allowTeamName == true)
            || (this.currentPanelId == this.otherTextAnchorPanelId && anchorObject.allowOtherText == true)
            || (this.currentPanelId == this.emblemAndGraphicsPanel && anchorObject.allowemblemAndGraphics == true)
            || (this.currentPanelId == this.myLockerPanelId && anchorObject.AllowUploadedGraphics == true))
};


/**
 * Anchor Point data class
 * Class constructor to assign default values
 *
 * @return void
 */

function AnchorPointData() {
    this.id;
    this.styleId;
    this.styleDesignId;
    this.x; //int type
    this.Y; //int type    
    this.ZoomAnchorDiagramX = 0; //int type
    this.ZoomAnchorDiagramY = 0; //int type    
    this.displayName; //int type 
    this.isFlip = false; //int type 
    this.chainX; //int type
    this.chainY; //int type
    this.Text = '';//string type
    this.graphicUrl = '';
    this.graphicId = '';
    this.graphicCategoryName = '';
    this.graphicSubCategoryName = '';
    this.graphicCategoryId = '';
    this.graphicSubCategoryId = '';
    this.graphicWidth = '';
    this.graphicHeight = '';

    this.colorsChoiceCount = 3;
    this.graphicName;
    this.Font; //font object
    this.FontColor; //color object
    this.FontOutlineColor1; //color object
    this.FontOutlineColor2; //color object
    this.IsSelected = false; //boolean
    this.IsDecorated = false;
    this.TextOrientation;
    this.image;
    this.allowPlayerNumber = false;
    this.allowPlayerName = false;
    this.allowTeamName = false;
    this.allowOtherText = false;
    this.allowemblemAndGraphics = false;
    this.AllowUploadedGraphics = false;
    this.selectedSize = null;   //selected size object, 
    this.previousAnchorPoint = "";
    this.zoomAnchorDiagramImage = "";
    this.AnchorDiagramImage = "";
    this.Rotation = 0;
    this.Mask = null;
    this.PreviewImageName = '';
    this.PreviewImageID = '';
    this.Width = '';
    this.Height = '';

    //sizes
    this.GraphicSizes = new Array();
    this.EmblemsSizes = new Array();
    this.UploadedGraphicSizes = new Array();
    this.PlayerNameSizes = new Array();
    this.PlayerNumberSizes = new Array();
    this.TextSizes = new Array();

    this.RelationshipId = null;
    this.RelationSpace = null;
    this.RelativeAnchorId = null;
    this.MirrorCapability = false;
    this.DisableScaling = false;
    this.AnchorOriginId = 1;

    this.SelectionPanelId;
    this.isForTop = false;
    this.styleNumber = '';
    this.isSameDimensionCheck = false;
}
;
/**
 * This method Selects the anchor Points
 * @param  allAnchorPoints this parameter keeps the decorated anchor points
 * @returns {void}
 */
AnchorPointData.prototype.select = function (allAnchorPoints) {
    for (var name in allAnchorPoints) {
        var obj = allAnchorPoints[name];
        obj.IsSelected = false;
        obj.setImage();
    }

    this.IsDecorated = true;
    this.IsSelected = true;
    this.setImage();
};
/**
 * This method sets the image on the anchor point screen
 * @returns {void}
 */
AnchorPointData.prototype.setImage = function () {
    if (!this.image) {
        return;
    }

    //  var largeImage = $('#dvIdAnchorButtons').is(':visible') ? '_large' : '';
    //    var anchorPointAvailable = 'images/' + 'anchorPoint_available' + largeImage + '.png';
    //    var anchorPointImageanOccupied = 'images/' + 'anchorPoint_occupied' + largeImage + '.png';
    //    var anchorPointImageSelected = 'images/' + 'anchorPoint_selected' + largeImage + '.png';



    var baseUrlLP = LiquidPixels.getChainStart();
    var largeImage = $('#dvIdAnchorButtons').is(':visible') ? '_large' : '';
    var anchorPointAvailable = 'source=url[file:/ASSETS/tiles/anchorIcons/anchorPoint_available' + largeImage + '.png]&scale=options[limit],size[400]&sink=format[png]';
    var anchorPointImageOccupied = 'source=url[file:/ASSETS/tiles/anchorIcons/anchorPoint_occupied' + largeImage + '.png]&scale=options[limit],size[400]&sink=format[png]';
    var anchorPointImageSelected = 'source=url[file:/ASSETS/tiles/anchorIcons/anchorPoint_selected' + largeImage + '.png]&scale=options[limit],size[400]&sink=format[png]';

    if (this.IsSelected) {
        this.image.attr('src', baseUrlLP + anchorPointImageSelected);
    } else if (this.IsDecorated) {
        this.image.attr('src', baseUrlLP + anchorPointImageOccupied);
    } else {
        this.image.attr('src', baseUrlLP + anchorPointAvailable);
    }
};



//  if (this.IsSelected) {
//        this.image.attr('src', anchorPointImageSelected);
//    } else if (this.IsDecorated) {
//        this.image.attr('src', anchorPointImageanOccupied);
//    } else {
//        this.image.attr('src', anchorPointAvailable);
//    }
//};
/**
 * This method returns if the anchor point is selected or not
 * 
 * @returns {boolean} IsSelected
 */
AnchorPointData.prototype.isSelected = function () {
    return this.IsSelected;
};

/**
 * This method copies the respective objects
 * 
 * @returns {void}
 */
AnchorPointData.prototype.copyObj = function () {
    var newObj = new AnchorPointData();
    newObj.id = this.id;
    newObj.styleId = this.styleId;
    newObj.styleDesignId = this.styleDesignId;
    newObj.isFlip = this.isFlip;
    newObj.x = this.x; //int type
    newObj.Y = this.Y; //int type
    newObj.ZoomAnchorDiagramX = this.ZoomAnchorDiagramX;
    newObj.ZoomAnchorDiagramY = this.ZoomAnchorDiagramY;
    newObj.displayName = this.displayName;
    newObj.chainX = this.chainX; //int type
    newObj.chainY = this.chainY; //int type    
    newObj.Text = this.Text;//string type
    newObj.graphicUrl = this.graphicUrl;
    newObj.graphicId = this.graphicId;
    newObj.graphicCategoryName = this.graphicCategoryName;
    newObj.graphicSubCategoryName = this.graphicSubCategoryName;
    newObj.graphicCategoryId = this.graphicCategoryId;
    newObj.graphicSubCategoryId = this.graphicSubCategoryId;
    newObj.graphicWidth = this.graphicWidth;
    newObj.graphicHeight = this.graphicHeight;
    newObj.colorsChoiceCount = this.colorsChoiceCount;
    newObj.graphicName = this.graphicName;
    newObj.Font = this.Font; //font object
    newObj.FontColor = this.FontColor; //color object
    newObj.FontOutlineColor1 = this.FontOutlineColor1; //color object
    newObj.FontOutlineColor2 = this.FontOutlineColor2; //color object
    newObj.IsSelected = this.IsSelected; //boolean
    newObj.IsDecorated = this.IsDecorated;
    newObj.TextOrientation = this.TextOrientation;
    newObj.image = this.image;
    newObj.allowPlayerNumber = this.allowPlayerNumber;
    newObj.allowPlayerName = this.allowPlayerName;
    newObj.allowTeamName = this.allowTeamName;
    newObj.allowOtherText = this.allowOtherText;
    newObj.allowemblemAndGraphics = this.allowemblemAndGraphics;
    newObj.AllowUploadedGraphics = this.AllowUploadedGraphics;
    newObj.selectedSize = this.selectedSize;
    newObj.previousAnchorPoint = '';//this.previousAnchorPoint;
    newObj.SelectionPanelId = this.SelectionPanelId;
    newObj.zoomAnchorDiagramImage = this.zoomAnchorDiagramImage;
    newObj.AnchorDiagramImage = this.AnchorDiagramImage;
    newObj.Rotation = this.Rotation;
    newObj.MirrorCapability = this.MirrorCapability;
    newObj.Mask = this.Mask;
    newObj.PreviewImageName = this.PreviewImageName;
    newObj.PreviewImageID = this.PreviewImageID;
    newObj.Width = this.Width;
    newObj.Height = this.Height;
    newObj.AnchorOriginId = this.AnchorOriginId;

    //sizes data
    newObj.GraphicSizes = this.GraphicSizes;
    newObj.EmblemsSizes = this.TextSizes;
    newObj.UploadedGraphicSizes = this.UploadedGraphicSizes;
    newObj.PlayerNameSizes = this.PlayerNameSizes;
    newObj.PlayerNumberSizes = this.PlayerNumberSizes;
    newObj.TextSizes = this.TextSizes;
    newObj.DisableScaling = this.DisableScaling;
    newObj.RelationshipId = this.RelationshipId;
    newObj.RelationSpace = this.RelationSpace;
    newObj.RelativeAnchorId = this.RelativeAnchorId;
    newObj.isForTop = this.isForTop;
    newObj.styleNumber = this.styleNumber;
    newObj.isSameDimensionCheck = this.isSameDimensionCheck;
    $('#aIdAnchorPointUndo').show();
    return newObj;
};


/*
*Retuens anchorpoint details
*/
AnchorPoint.prototype.getSavedAnchorPointByKey = function (anchorPointId) {
    try {
        var savedAnchorPoints = GlobalInstance.getUniformConfigurationInstance().getAnchorPoints();
        var savedAnchorPointObject = null;
        for (var key in savedAnchorPoints) {
            var apObject = savedAnchorPoints[key];
            if (apObject.id == anchorPointId) {
                savedAnchorPointObject = apObject;
            }
        }
        return savedAnchorPointObject;
    } catch (e) {
        Log.error('AnchorPoint.js --- getSavedAnchorPointByKey ()-----' + e.message);
    }
}

/*
*This method handles the same dimension check box event
*/
AnchorPoint.prototype.UpdateSameSizeDimension = function (anchorPointObject) {
    try {
        var thisObject = this;
        if (anchorPointObject) {
            if (anchorPointObject.isSameDimensionCheck) {
                $('#chkBxIdSameDimension').prop('checked', true);
            } else {
                $('#chkBxIdSameDimension').prop('checked', false);
            }
        }
        this.setAnchorPointsInUniformConfiguration();
        $(document).off('change', '#chkBxIdSameDimension');
        $(document).on('change', '#chkBxIdSameDimension', function () {
            var anchorObject = thisObject.getSelectedAnchorObj();
            anchorObject.isSameDimensionCheck = $(this).is(':checked');
            //Set the anchor point in the unform configutaion
            thisObject.setAnchorPointsInUniformConfiguration();
        });


    } catch (err) {
        Log.trace('Error caught in the UpdateSameSizeDimension ----- ' + err.message);
    }
}