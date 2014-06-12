/**
 * TWA proshpere configurator
 * 
 * saveconfig.js used to store configurator selection option which helps to build data which is used to send at ATG
 * 
 * TWA proshpere configurator
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 * 
 * @return void
 */
function SaveConfig() {
    this.requestUrl = WEB_SERVICE_URL.get('SAVE_CONFIG');
    this.imageCorrectionFeeStatusUrl = WEB_SERVICE_URL.get('GET_IMAGE_CORRECTION_STATUS', LOCAL);
    this.responseType = 'json';
    this.objCommHelper = new CommunicationHelper();
    this.objUtility = new Utility();
    this.isMailEvent = false;
    this.isSaveEvent = false;
    this.isSaveEventFromCloseSession = false;
    this.isApproveContactEvent = false;
    this.isApproveMailEvent = false;
    this.funcCallBack = null;
    this.IsOverwrite = false;
    this.userEmail = null;
    this.uploadedImages = new Array();
}
/**
 * Saves the configurator data to server by calling API and go to display retreivalCode message
 * @returns {void}
 */
SaveConfig.prototype.saveUniformConfigurationData = function () {
    try {
        var thisObject = this;
        var uniqueImages = this.getImagesAppliedOnAnchorPoints();
        var isCorrectionFeeFeatureRequired = objApp.correctionFeeFeatureRequired == 1 ? true : false;
        if (isCorrectionFeeFeatureRequired == true) {
            this.userEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('email');
            var params = {
                "EmailId": this.userEmail,
                "AccountNumber": objApp.sessionResponseData.AccountNumber,
                "Images": uniqueImages
            };
            this.objCommHelper.callAjax(this.imageCorrectionFeeStatusUrl, 'POST', JSON.stringify(params), this.responseType, null,
                    function (imageCorrectionFeeResponse) {
                        var filterData = thisObject.filterUniformConfigurationData(imageCorrectionFeeResponse);
                        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();

                        thisObject.objCommHelper.callAjax(thisObject.requestUrl, 'POST', filterData, thisObject.responseType, null, thisObject.getSavedUniformConfigurationResponse.bind(thisObject), null, null, null, null, null);
                    }, null, null, null, null, null);
        } else {
            var filterData = thisObject.filterUniformConfigurationData();
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            this.objCommHelper.callAjax(thisObject.requestUrl, 'POST', filterData, thisObject.responseType, null, this.getSavedUniformConfigurationResponse.bind(this), null, null, null, null, null);
        }


        
    } catch (err) {
        var errObj = {
            loglevel: Log.Level.ERROR,
            message: err.message,
            fileName: err.fileName,
            className: 'SaveConfig',
            methodName: 'saveUniformConfigurationData',
            lineNumber: err.lineNumber,
            errorType: err.name
        };
        Log.error(errObj);
    }
};
/**
 * Display retrievalCode message after getting response from server
 * 
 * @param {type} response from web server
 * @returns {void}
 */
SaveConfig.prototype.getSavedUniformConfigurationResponse = function (response) {
    try {
        if (this.objUtility.validateResponseFormat(response)) {
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            

            
            if (response.ResponseType === CONFIG.get("VALID_RESPONSE_FROM_API")) {
                GlobalInstance.uniformConfigurationInstance.setRetrieveCode(response.ResponseData);
            } else {
                GlobalInstance.uniformConfigurationInstance.setRetrieveCode('');
            }
            if (this.funcCallBack !== null && this.funcCallBack !== undefined) {
                this.funcCallBack();
            }
            if (this.isSaveEvent) {
                if (!this.isSaveEventFromCloseSession) {
                    if (response.ResponseType === CONFIG.get("VALID_RESPONSE_FROM_API")) {
                        if (!this.IsOverwrite) {
                            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                            GlobalInstance.dialogBoxInstance.funcCallBack = null;
                            GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(TITLE.get('TITLE_SAVE_ORDER'), MESSAGES.get('MESSAGE_SAVE_ORDER') + response.ResponseData);
                        }
                    } else {
                        var errorMessage = MESSAGES.get('MESSAGE_ERROR_RESPONSE');
                        if (response.Error && response.ErrorCode == 1) {
                            errorMessage = MESSAGES.get('MESSAGE_SESSION_EXPIRE');
                        }
                        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                        GlobalInstance.dialogBoxInstance.funcCallBack = null;
                        GlobalInstance.dialogBoxInstance.displayErrorMessageDialogBox(TITLE.get('TITLE_ERROR_RESPONSE'), errorMessage);
                    }
                }
            } else if (this.isMailEvent || this.isApproveContactEvent || this.isApproveMailEvent) {
                GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                GlobalInstance.dialogBoxInstance.funcCallBack = null;
                GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(TITLE.get('TITLE_EMAIL_SENT'), MESSAGES.get('MESSAGE_EMAIL_SENT'));
            }
            this.isMailEvent = false;
            this.isSaveEvent = false;
            this.isSaveEventFromCloseSession = false;
            this.isApproveContactEvent = false;
            this.isApproveMailEvent = false;
            this.IsOverwrite = false;
            
            //jer
            GlobalInstance.uniformConfigurationInstance.RetrieveCode = response.ResponseData;
            // alert('Result');
            //alert(JSON.stringify(GlobalInstance.uniformConfigurationInstance).replace(/,/g,",\n"));
            //location = 'DealerLanding.aspx?JSON=' + JSON.stringify(GlobalInstance.uniformConfigurationInstance);
            postAndRedirect(JSON.stringify(response.ResponseData));
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};
/**
 * used to filter the configurator saved data before save on server
 *  
 * @returns {void}
 */
SaveConfig.prototype.filterUniformConfigurationData = function (imageCorrectionResponse) {
    var thisObject = this;
    var emailType = CONFIG.get("EMAIL_TYPE_NO_EMAIL");
    this.getAllBirdEyePreviewUrl();
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var saveData = JSON.parse(JSON.stringify(getConfigurationJsonObject(GlobalInstance.uniformConfigurationInstance)));
    // set the information which is require for client application    

    if (this.isSaveEvent) {
        emailType = CONFIG.get("EMAIL_TYPE_SAVE_EMAIL");
    } else if (this.isMailEvent) {
        emailType = CONFIG.get("EMAIL_TYPE_FORWORD_EMAIL");
    } else if (!(this.isApproveContactEvent) && !(this.isApproveMailEvent)) {
        emailType = CONFIG.get("EMAIL_TYPE_APPROVE_LATER");
    } else if (this.isApproveContactEvent && this.isApproveMailEvent) {
        emailType = CONFIG.get("EMAIL_TYPE_APPROVE_LATER_BOTH");
    } else if (this.isApproveContactEvent) {
        emailType = CONFIG.get("EMAIL_TYPE_APPROVE_LATER_CONTACT");
    } else if (this.isApproveMailEvent) {
        emailType = CONFIG.get("EMAIL_TYPE_APPROVE_LATER");
    }

    //** Remove extra infomation form saveconfig ***/
    //PlayerNumber
    if (Utility.getObjectlength(saveData.playerNumberInfo) > 0 && Utility.getObjectlength(saveData.playerNumberInfo.fontColor) > 0) {
        delete saveData.playerNumberInfo.fontColor.Red;
        delete saveData.playerNumberInfo.fontColor.Green;
        delete saveData.playerNumberInfo.fontColor.Blue;

        delete saveData.playerNumberInfo.fontColor.Cyan;
        delete saveData.playerNumberInfo.fontColor.Magenta;
        delete saveData.playerNumberInfo.fontColor.Yellow;
        delete saveData.playerNumberInfo.fontColor.Black;
        delete saveData.playerNumberInfo.fontColor.Pantone;

        delete saveData.playerNumberInfo.fontColor.CmykCmyk;
        delete saveData.playerNumberInfo.fontColor.CmykCmykFluor;
        delete saveData.playerNumberInfo.fontColor.CustomerId;
        delete saveData.playerNumberInfo.fontColor.DisplayOrder;
    }

    if (Utility.getObjectlength(saveData.playerNumberInfo) > 0 && Utility.getObjectlength(saveData.playerNumberInfo.fontOutline1Color) > 0) {
        delete saveData.playerNumberInfo.fontOutline1Color.Red;
        delete saveData.playerNumberInfo.fontOutline1Color.Green;
        delete saveData.playerNumberInfo.fontOutline1Color.Blue;

        delete saveData.playerNumberInfo.fontOutline1Color.Cyan;
        delete saveData.playerNumberInfo.fontOutline1Color.Magenta;
        delete saveData.playerNumberInfo.fontOutline1Color.Yellow;
        delete saveData.playerNumberInfo.fontOutline1Color.Black;
        delete saveData.playerNumberInfo.fontOutline1Color.Pantone;

        delete saveData.playerNumberInfo.fontOutline1Color.CmykCmyk;
        delete saveData.playerNumberInfo.fontOutline1Color.CmykCmykFluor;
        delete saveData.playerNumberInfo.fontOutline1Color.CustomerId;
        delete saveData.playerNumberInfo.fontOutline1Color.DisplayOrder;

    }

    if (Utility.getObjectlength(saveData.playerNumberInfo) > 0 && Utility.getObjectlength(saveData.playerNumberInfo.fontOutline2Color) > 0) {
        delete saveData.playerNumberInfo.fontOutline2Color.Red;
        delete saveData.playerNumberInfo.fontOutline2Color.Green;
        delete saveData.playerNumberInfo.fontOutline2Color.Blue;

        delete saveData.playerNumberInfo.fontOutline2Color.Cyan;
        delete saveData.playerNumberInfo.fontOutline2Color.Magenta;
        delete saveData.playerNumberInfo.fontOutline2Color.Yellow;
        delete saveData.playerNumberInfo.fontOutline2Color.Black;
        delete saveData.playerNumberInfo.fontOutline2Color.Pantone;

        delete saveData.playerNumberInfo.fontOutline2Color.CmykCmyk;
        delete saveData.playerNumberInfo.fontOutline2Color.CmykCmykFluor;
        delete saveData.playerNumberInfo.fontOutline2Color.CustomerId;
        delete saveData.playerNumberInfo.fontOutline2Color.DisplayOrder;
    }

    /************** Player Name  *******************/

    if (Utility.getObjectlength(saveData.playerNameInfo) > 0 && Utility.getObjectlength(saveData.playerNameInfo.fontColor) > 0) {
        delete saveData.playerNameInfo.fontColor.Red;
        delete saveData.playerNameInfo.fontColor.Green;
        delete saveData.playerNameInfo.fontColor.Blue;

        delete saveData.playerNameInfo.fontColor.Cyan;
        delete saveData.playerNameInfo.fontColor.Magenta;
        delete saveData.playerNameInfo.fontColor.Yellow;
        delete saveData.playerNameInfo.fontColor.Black;
        delete saveData.playerNameInfo.fontColor.Pantone;

        delete saveData.playerNameInfo.fontColor.CmykCmyk;
        delete saveData.playerNameInfo.fontColor.CmykCmykFluor;
        delete saveData.playerNameInfo.fontColor.CustomerId;
        delete saveData.playerNameInfo.fontColor.DisplayOrder;
    }

    if (Utility.getObjectlength(saveData.playerNameInfo) > 0 && Utility.getObjectlength(saveData.playerNameInfo.fontOutline1Color) > 0) {
        delete saveData.playerNameInfo.fontOutline1Color.Red;
        delete saveData.playerNameInfo.fontOutline1Color.Green;
        delete saveData.playerNameInfo.fontOutline1Color.Blue;

        delete saveData.playerNameInfo.fontOutline1Color.Cyan;
        delete saveData.playerNameInfo.fontOutline1Color.Magenta;
        delete saveData.playerNameInfo.fontOutline1Color.Yellow;
        delete saveData.playerNameInfo.fontOutline1Color.Black;
        delete saveData.playerNameInfo.fontOutline1Color.Pantone;

        delete saveData.playerNameInfo.fontOutline1Color.CmykCmyk;
        delete saveData.playerNameInfo.fontOutline1Color.CmykCmykFluor;
        delete saveData.playerNameInfo.fontOutline1Color.CustomerId;
        delete saveData.playerNameInfo.fontOutline1Color.DisplayOrder;

    }

    if (Utility.getObjectlength(saveData.playerNameInfo) > 0 && Utility.getObjectlength(saveData.playerNameInfo.fontOutline2Color) > 0) {
        delete saveData.playerNameInfo.fontOutline2Color.Red;
        delete saveData.playerNameInfo.fontOutline2Color.Green;
        delete saveData.playerNameInfo.fontOutline2Color.Blue;

        delete saveData.playerNameInfo.fontOutline2Color.Cyan;
        delete saveData.playerNameInfo.fontOutline2Color.Magenta;
        delete saveData.playerNameInfo.fontOutline2Color.Yellow;
        delete saveData.playerNameInfo.fontOutline2Color.Black;
        delete saveData.playerNameInfo.fontOutline2Color.Pantone;

        delete saveData.playerNameInfo.fontOutline2Color.CmykCmyk;
        delete saveData.playerNameInfo.fontOutline2Color.CmykCmykFluor;
        delete saveData.playerNameInfo.fontOutline2Color.CustomerId;
        delete saveData.playerNameInfo.fontOutline2Color.DisplayOrder;
    }


    /************** Team Name  *******************/

    if (Utility.getObjectlength(saveData.teamNameInfo) > 0 && Utility.getObjectlength(saveData.teamNameInfo.fontColor) > 0) {
        delete saveData.teamNameInfo.fontColor.Red;
        delete saveData.teamNameInfo.fontColor.Green;
        delete saveData.teamNameInfo.fontColor.Blue;

        delete saveData.teamNameInfo.fontColor.Cyan;
        delete saveData.teamNameInfo.fontColor.Magenta;
        delete saveData.teamNameInfo.fontColor.Yellow;
        delete saveData.teamNameInfo.fontColor.Black;
        delete saveData.teamNameInfo.fontColor.Pantone;

        delete saveData.teamNameInfo.fontColor.CmykCmyk;
        delete saveData.teamNameInfo.fontColor.CmykCmykFluor;
        delete saveData.teamNameInfo.fontColor.CustomerId;
        delete saveData.teamNameInfo.fontColor.DisplayOrder;
    }

    if (Utility.getObjectlength(saveData.teamNameInfo) > 0 && Utility.getObjectlength(saveData.teamNameInfo.fontOutline1Color) > 0) {
        delete saveData.teamNameInfo.fontOutline1Color.Red;
        delete saveData.teamNameInfo.fontOutline1Color.Green;
        delete saveData.teamNameInfo.fontOutline1Color.Blue;

        delete saveData.teamNameInfo.fontOutline1Color.Cyan;
        delete saveData.teamNameInfo.fontOutline1Color.Magenta;
        delete saveData.teamNameInfo.fontOutline1Color.Yellow;
        delete saveData.teamNameInfo.fontOutline1Color.Black;
        delete saveData.teamNameInfo.fontOutline1Color.Pantone;

        delete saveData.teamNameInfo.fontOutline1Color.CmykCmyk;
        delete saveData.teamNameInfo.fontOutline1Color.CmykCmykFluor;
        delete saveData.teamNameInfo.fontOutline1Color.CustomerId;
        delete saveData.teamNameInfo.fontOutline1Color.DisplayOrder;

    }

    if (Utility.getObjectlength(saveData.teamNameInfo) > 0 && Utility.getObjectlength(saveData.teamNameInfo.fontOutline2Color) > 0) {
        delete saveData.teamNameInfo.fontOutline2Color.Red;
        delete saveData.teamNameInfo.fontOutline2Color.Green;
        delete saveData.teamNameInfo.fontOutline2Color.Blue;

        delete saveData.teamNameInfo.fontOutline2Color.Cyan;
        delete saveData.teamNameInfo.fontOutline2Color.Magenta;
        delete saveData.teamNameInfo.fontOutline2Color.Yellow;
        delete saveData.teamNameInfo.fontOutline2Color.Black;
        delete saveData.teamNameInfo.fontOutline2Color.Pantone;

        delete saveData.teamNameInfo.fontOutline2Color.CmykCmyk;
        delete saveData.teamNameInfo.fontOutline2Color.CmykCmykFluor;
        delete saveData.teamNameInfo.fontOutline2Color.CustomerId;
        delete saveData.teamNameInfo.fontOutline2Color.DisplayOrder;
    }


    /************** other text *******************/

    if (Utility.getObjectlength(saveData.otherTextInfo) > 0 && Utility.getObjectlength(saveData.otherTextInfo.fontColor) > 0) {
        delete saveData.otherTextInfo.fontColor.Red;
        delete saveData.otherTextInfo.fontColor.Green;
        delete saveData.otherTextInfo.fontColor.Blue;

        delete saveData.otherTextInfo.fontColor.Cyan;
        delete saveData.otherTextInfo.fontColor.Magenta;
        delete saveData.otherTextInfo.fontColor.Yellow;
        delete saveData.otherTextInfo.fontColor.Black;
        delete saveData.otherTextInfo.fontColor.Pantone;

        delete saveData.otherTextInfo.fontColor.CmykCmyk;
        delete saveData.otherTextInfo.fontColor.CmykCmykFluor;
        delete saveData.otherTextInfo.fontColor.CustomerId;
        delete saveData.otherTextInfo.fontColor.DisplayOrder;
    }

    if (Utility.getObjectlength(saveData.otherTextInfo) > 0 && Utility.getObjectlength(saveData.otherTextInfo.fontOutline1Color) > 0) {
        delete saveData.otherTextInfo.fontOutline1Color.Red;
        delete saveData.otherTextInfo.fontOutline1Color.Green;
        delete saveData.otherTextInfo.fontOutline1Color.Blue;

        delete saveData.otherTextInfo.fontOutline1Color.Cyan;
        delete saveData.otherTextInfo.fontOutline1Color.Magenta;
        delete saveData.otherTextInfo.fontOutline1Color.Yellow;
        delete saveData.otherTextInfo.fontOutline1Color.Black;
        delete saveData.otherTextInfo.fontOutline1Color.Pantone;

        delete saveData.otherTextInfo.fontOutline1Color.CmykCmyk;
        delete saveData.otherTextInfo.fontOutline1Color.CmykCmykFluor;
        delete saveData.otherTextInfo.fontOutline1Color.CustomerId;
        delete saveData.otherTextInfo.fontOutline1Color.DisplayOrder;

    }

    if (Utility.getObjectlength(saveData.otherTextInfo) > 0 && Utility.getObjectlength(saveData.otherTextInfo.fontOutline2Color) > 0) {
        delete saveData.otherTextInfo.fontOutline2Color.Red;
        delete saveData.otherTextInfo.fontOutline2Color.Green;
        delete saveData.otherTextInfo.fontOutline2Color.Blue;

        delete saveData.otherTextInfo.fontOutline2Color.Cyan;
        delete saveData.otherTextInfo.fontOutline2Color.Magenta;
        delete saveData.otherTextInfo.fontOutline2Color.Yellow;
        delete saveData.otherTextInfo.fontOutline2Color.Black;
        delete saveData.otherTextInfo.fontOutline2Color.Pantone;

        delete saveData.otherTextInfo.fontOutline2Color.CmykCmyk;
        delete saveData.otherTextInfo.fontOutline2Color.CmykCmykFluor;
        delete saveData.otherTextInfo.fontOutline2Color.CustomerId;
        delete saveData.otherTextInfo.fontOutline2Color.DisplayOrder;
    }

    /*****************************SessionData************************************/
    if (Utility.getObjectlength(saveData.sessionInformation) > 0) {

        if (saveData.sessionInformation.RetrievalCode !== undefined)
            delete saveData.sessionInformation.RetrievalCode;

        if (saveData.sessionInformation.SessionVariable !== undefined)
            delete saveData.sessionInformation.SessionVariable;
    }
    /*** filter roster player ****/
    var arrPlayers = new Array();
    var graphicsForImageCorrection = new Array();
    var isCorrectionFeeFeatureRequired = objApp.correctionFeeFeatureRequired == 1 ? true : false;
    var isCorrectionFeePromotionApplicable = objApp.correctionFeePromotionApplicable;
    var imageGraphicFeeInfo = "";
    if (isCorrectionFeeFeatureRequired) {

        graphicsForImageCorrection = this.getImageCorrectionObject(imageCorrectionResponse);
        //if images need correction then only the promotionApplicable tag will be added otherwise the <graphicsRequireImageCorrection> tag will be empty
        if (graphicsForImageCorrection.length > 0) {
            imageGraphicFeeInfo = {};
            imageGraphicFeeInfo.promotionApplicable = isCorrectionFeePromotionApplicable;
            imageGraphicFeeInfo.graphic = graphicsForImageCorrection;
        }
    }

    if (Utility.getObjectlength(saveData.rosterPlayerInfo) > 0 && Utility.getObjectlength(saveData.rosterPlayerInfo) > 0) {
        var counter = 0;
        $.each(saveData.rosterPlayerInfo, function (i, rosterPlayer) {
            if ((Utility.getObjectlength(rosterPlayer.top) > 0 && rosterPlayer.top.size != null && rosterPlayer.top.size != '') || (Utility.getObjectlength(rosterPlayer.bottom) > 0 && rosterPlayer.bottom.size != null && rosterPlayer.bottom.size != '')) {
                rosterPlayer.seq = counter;
                rosterPlayer.advUniformType = CONFIG.get('ADV_UNIFORM_TYPE');

                //Update the production url based on the corrected image
                thisObject.updateProductionUrl(rosterPlayer, function (updatedRosterPlayer) {
                    counter = counter + 1;
                    arrPlayers.push(updatedRosterPlayer);
                    //arrPlayers.push(rosterPlayer);
                    //alert('counter = ' + counter + '\n' + JSON.stringify(rosterPlayer));
                });
            }
        });
    }

    /*******************add location nodes**************/
    var arrLocations = new Array();
    if (Utility.getObjectlength(saveData.anchorpoints) > 0 && Utility.getObjectlength(saveData.anchorpoints) > 0) {
        var counter = 1;
        var anchorPoints = saveData.anchorpoints;
        var textPrevewUrlArray = GlobalInstance.getAnchorPointInstance().textUrl;
        for (key in anchorPoints) {
            var anchorPointObj = anchorPoints[key];

            var isTextLineRequired = anchorPointObj.type === 'emblem' || anchorPointObj.type === 'uploadedgraphic' || anchorPointObj.type === 'graphic' ? false : true;

            var textLine = new Object();
            if (isTextLineRequired) {
                textLine = {
                    'font': anchorPointObj.Font,
                    'text': anchorPointObj.Text,
                    'textStyle': '',
                    'displayName': anchorPointObj.FontName,
                    'outline': anchorPointObj.FontColor != '' ? 'true' : false,
                    'outline1': anchorPointObj.FontOutlineColor1 != '' ? 'true' : false,
                    'outline2': anchorPointObj.FontOutlineColor2 != '' ? 'true' : false,
                    'fontColor': Utility.getTaaColorId(anchorPointObj.FontColor),
                    'fontColor1': Utility.getTaaColorId(anchorPointObj.FontOutlineColor1),
                    'fontColor2': Utility.getTaaColorId(anchorPointObj.FontOutlineColor2)
                };
            }

            var colors = new Object();
            if (!isTextLineRequired) {
                colors = {
                    'id': Utility.getTaaColorId(anchorPointObj.FontColor),
                    'id1': Utility.getTaaColorId(anchorPointObj.FontOutlineColor1),
                    'id2': Utility.getTaaColorId(anchorPointObj.FontOutlineColor2)
                };
            }
            var textPreviewUrl = '';
            for (var i = 0; i < textPrevewUrlArray.length; i++) {
                var textUrlObject = textPrevewUrlArray[i];
                if (textUrlObject.type == anchorPointObj.type && textUrlObject.anchorPointId == anchorPointObj.id) {
                    textPreviewUrl = textUrlObject.src;
                    break;
                }
            }

            var locationObject = {
                'displayName': anchorPointObj.displayName,
                'type': anchorPointObj.type,
                'graphicId': anchorPointObj.GraphicId ? anchorPointObj.GraphicId : "",
                'graphicName': anchorPointObj.GraphicName ? anchorPointObj.GraphicName : "",
                'graphicProductionURL': anchorPointObj.GraphicUrl ? anchorPointObj.GraphicUrl : "",
                'graphicPreviewURL': anchorPointObj.GraphicUrl ? anchorPointObj.GraphicUrl : "",
                'emblemId': anchorPointObj.type === 'emblem' ? anchorPointObj.GraphicId : "",
                'emblemProductionURL': anchorPointObj.type === 'emblem' ? anchorPointObj.GraphicUrl : "",
                'emblemZoomPreviewURL': anchorPointObj.type === 'emblem' ? anchorPointObj.GraphicUrl : "",
                'emblemNoGraphic': anchorPointObj.type === 'emblem' ? "true" : "false",
                'emblemPreviewURL': anchorPointObj.type === 'emblem' ? anchorPointObj.GraphicUrl : "",
                'textProductionURL': textPreviewUrl,
                'textPreviewURL': textPreviewUrl,
                'size': anchorPointObj.Size ? anchorPointObj.Size.Name : "",
                'colors': colors,
                'includeOutline': (anchorPointObj.FontOutlineColor1 != '' && anchorPointObj.FontOutlineColor2 != '') ? "true" : "false"
            };

            if (isTextLineRequired) {
                locationObject.textLine = textLine;
            }

            arrLocations.push(locationObject);
        }
    }

    /*******************add selectedAnchorsMetadata node**************/
    var selectedAnchorsMetadata = new Object();
    if (Utility.getObjectlength(saveData.anchorpoints) > 0 && Utility.getObjectlength(saveData.anchorpoints) > 0) {
        var anchorPoints = saveData.anchorpoints;
        var arrPlayerName = new Array();
        var arrPlayerNumber = new Array();
        var arrTeamName = new Array();
        var arrOtherText = new Array();
        var arrEmbelem = new Array();
        var arrGraphics = new Array();
        var arrayUploadedGraphics = new Array();
        var arrUploadedGraphic = new Array();

        selectedAnchorsMetadata.playerNameParent = arrPlayerName;
        selectedAnchorsMetadata.playerNumberParent = arrPlayerNumber;
        selectedAnchorsMetadata.teamNameParent = arrTeamName;
        selectedAnchorsMetadata.otherTextParent = arrOtherText;
        selectedAnchorsMetadata.emblemParent = arrEmbelem;
        selectedAnchorsMetadata.graphicParent = arrGraphics;
        selectedAnchorsMetadata.uploadedGraphicParent = arrUploadedGraphic;

        for (key in anchorPoints) {
            var anchorPointObj = anchorPoints[key];
            var type = anchorPointObj.type;


            if (type == 'playername') {
                var playerNameObject = new Object();
                playerNameObject.anchorName = anchorPointObj.displayName;
                playerNameObject.type = anchorPointObj.type;
                playerNameObject.typeDisplayName = 'Player Name';
                playerNameObject.size = anchorPointObj.SizeDisplay;
                playerNameObject.fontDisplayName = anchorPointObj.FontName;
                playerNameObject.textValue = anchorPointObj.Text;
                playerNameObject.textStyle = '';
                playerNameObject.color1 = Utility.getTaaColorId(anchorPointObj.FontColor);
                playerNameObject.color2 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor1);
                playerNameObject.color3 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor2);

                arrPlayerName.push(playerNameObject);
            }
            if (type == 'playernumber') {
                var playerNumberObject = new Object();
                playerNumberObject.anchorName = anchorPointObj.displayName;
                playerNumberObject.type = anchorPointObj.type;
                playerNumberObject.typeDisplayName = 'Player Number';
                playerNumberObject.size = anchorPointObj.SizeDisplay;
                playerNumberObject.fontDisplayName = anchorPointObj.FontName;
                playerNumberObject.textValue = anchorPointObj.Text;
                playerNumberObject.textStyle = '';
                playerNumberObject.color1 = Utility.getTaaColorId(anchorPointObj.FontColor);
                playerNumberObject.color2 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor1);
                playerNumberObject.color3 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor2);

                arrPlayerNumber.push(playerNumberObject);
            }
            if (type == 'teamname') {
                var teamNameObject = new Object();
                teamNameObject.anchorName = anchorPointObj.displayName;
                teamNameObject.type = anchorPointObj.type;
                teamNameObject.typeDisplayName = 'Team Name';
                teamNameObject.size = anchorPointObj.SizeDisplay;
                teamNameObject.fontDisplayName = anchorPointObj.FontName;
                teamNameObject.textValue = anchorPointObj.Text;
                teamNameObject.textStyle = '';
                teamNameObject.color1 = Utility.getTaaColorId(anchorPointObj.FontColor);
                teamNameObject.color2 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor1);
                teamNameObject.color3 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor2);

                arrTeamName.push(teamNameObject);
            }
            if (type == 'othertext') {
                var otherTextObject = new Object();
                otherTextObject.anchorName = anchorPointObj.displayName;
                otherTextObject.type = anchorPointObj.type;
                otherTextObject.typeDisplayName = 'Other Text';
                otherTextObject.size = anchorPointObj.SizeDisplay;
                otherTextObject.fontDisplayName = anchorPointObj.FontName;
                otherTextObject.textValue = anchorPointObj.Text;
                otherTextObject.textStyle = '';
                otherTextObject.color1 = Utility.getTaaColorId(anchorPointObj.FontColor);
                otherTextObject.color2 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor1);
                otherTextObject.color3 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor2);

                arrOtherText.push(otherTextObject);
            }
            if (type == 'emblem') {
                var embelemObject = new Object();
                embelemObject.anchorName = anchorPointObj.displayName;
                embelemObject.type = anchorPointObj.type;
                embelemObject.typeDisplayName = 'Emblem';
                embelemObject.size = anchorPointObj.SizeDisplay;
                embelemObject.emblemId = anchorPointObj.GraphicId;
                embelemObject.emblemProductionURL = anchorPointObj.GraphicUrl;
                embelemObject.emblemZoomPreviewURL = anchorPointObj.GraphicUrl;
                embelemObject.color1 = Utility.getTaaColorId(anchorPointObj.FontColor);
                embelemObject.color2 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor1);
                embelemObject.color3 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor2);

                arrEmbelem.push(embelemObject);
            }
            if (type == 'graphic') {
                var graphicObject = new Object();
                graphicObject.anchorName = anchorPointObj.displayName;
                graphicObject.type = anchorPointObj.type;
                graphicObject.typeDisplayName = 'Graphic';
                graphicObject.size = anchorPointObj.SizeDisplay;
                //graphicObject.emblemId = anchorPointObj.GraphicId;
                graphicObject.graphicPreviewURL = anchorPointObj.GraphicUrl;
                graphicObject.graphicProductionURL = anchorPointObj.GraphicUrl;
                graphicObject.color1 = Utility.getTaaColorId(anchorPointObj.FontColor);
                graphicObject.color2 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor1);
                graphicObject.color3 = Utility.getTaaColorId(anchorPointObj.FontOutlineColor2);

                arrGraphics.push(graphicObject);
            }
            if (type == 'uploadedgraphic') {
                var uploadedGraphicObject = new Object();
                uploadedGraphicObject.anchorName = anchorPointObj.displayName;
                uploadedGraphicObject.type = anchorPointObj.type;
                uploadedGraphicObject.typeDisplayName = 'Graphic';
                uploadedGraphicObject.size = anchorPointObj.SizeDisplay;
                uploadedGraphicObject.graphicId = anchorPointObj.GraphicId;
                uploadedGraphicObject.graphicPreviewURL = anchorPointObj.GraphicUrl;
                uploadedGraphicObject.graphicProductionURL = anchorPointObj.GraphicUrl;
                arrUploadedGraphic.push(uploadedGraphicObject);
            }
        }
    }

    var userId = GlobalInstance.uniformConfigurationInstance.getUserId();
    var userInfo = saveData.userInfo;
    if (userId != '' && userId != null) {
        GlobalInstance.uniformConfigurationInstance.setUserInfo('@type', 'dealer');
        GlobalInstance.uniformConfigurationInstance.setUserInfo('id', userId);
        userInfo = { "type": "dealer", "id": userId };
    };



    var specialInstructionValue = GlobalInstance.uniformConfigurationInstance.getSpecialInstructions();
    if (specialInstructionValue != '') {
        specialInstructionValue = encodeURIComponent(specialInstructionValue);

    }
    var uniformConfigATG = {
        "user": userInfo,
        "orderName": saveData.OrderName,
        "orderState": saveData.orderState,
        "retrieveCode": "",
        "isFlourescent": saveData.isPrimaryFlourescent,
        "styleNumber": saveData.StyleNumber,
        "sport": saveData.categoryInfo.Name,
        "designNumber": saveData.DesignNumber,
        "rosterTeamName": (Utility.getObjectlength(saveData.teamNameInfo) > 0 && saveData.teamNameInfo.text != null) ? saveData.teamNameInfo.text : '',
        "colors": { "primaryColorId": Utility.getTaaColorId(saveData.PrimaryColorId), "secondaryColorId": Utility.getTaaColorId(saveData.SecondaryColorId), "tertiaryColorId": Utility.getTaaColorId(saveData.TertiaryColorId) },
        "fabricId": saveData.fabricsInfo.ItemId,
        "fabricDisplayName": saveData.FabricName,
        "matchButtonColorID": (Utility.getObjectlength(saveData.colorsInfo.uniformPrimaryColor) > 0) ? Utility.getTaaColorId(saveData.colorsInfo.uniformPrimaryColor.MatchingButtonColorId) : '',
        "matchThreadColorID": (Utility.getObjectlength(saveData.colorsInfo.uniformPrimaryColor) > 0) ? Utility.getTaaColorId(saveData.colorsInfo.uniformPrimaryColor.MatchingThreadColorId) : '',
        "matchZipperColorID": (Utility.getObjectlength(saveData.colorsInfo.uniformPrimaryColor) > 0) ? Utility.getTaaColorId(saveData.colorsInfo.uniformPrimaryColor.MatchingZipperColorId) : '',
        "topSelected": saveData.TopAvailable,
        "bottomSelected": saveData.BottomAvailable,
        "gender": saveData.genderInfo.Name,
        "previewUrls": saveData.previewUrls,
        "uniformConfigVersion": CONFIG.get("CURRENT_UNIFORM_CONFIG"),
        "callType": saveData.CallType,
        "playerNumber": (Utility.getObjectlength(saveData.playerNumberInfo) > 0 && saveData.playerNumberInfo.text != null) ? saveData.playerNumberInfo.text : "",
        "playerName": (Utility.getObjectlength(saveData.playerNameInfo) > 0 && saveData.playerNameInfo.text != null) ? saveData.playerNameInfo.text : "",
        "teamName": (Utility.getObjectlength(saveData.teamNameInfo) > 0 && saveData.teamNameInfo.text != null) ? saveData.teamNameInfo.text : "",
        "player": arrPlayers,
        "Locations": { Location: arrLocations },
        "graphicsRequireImageCorrection": imageGraphicFeeInfo,
        "referralCode": "",
        "thumbnailUrl": "",
        "specialInstructions": specialInstructionValue,
        "selectedAnchorsMetadata": selectedAnchorsMetadata,
        "reserveTag1": "",
        "reserveTag2": "",
        "reserveTag3": "",
        "reserveTag4": "",
        "reserveTag5": ""
    };
    delete saveData.previewUrlTagName;
    delete saveData.isSkipAlert;
    delete saveData.copiedYouthStyleInfo;
    delete saveData.copiedStyleInfo;
    delete saveData.specialInstructions;
    delete saveData.RosterPlayers;

    if (isCorrectionFeeFeatureRequired == false) {
        delete uniformConfigATG.graphicsRequireImageCorrection;
    }
    var finalData = {};

    finalData = {
        "SessionVariable": GlobalInstance.uniformConfigurationInstance.getSessionVariable(),
        "EmailType": emailType,
        "IsOverwrite": this.IsOverwrite,
        "OrderName": GlobalInstance.uniformConfigurationInstance.getOrderName(),
        "CategoryId": GlobalInstance.uniformConfigurationInstance.getCategoryInfo().Id,
        "CategoryName": GlobalInstance.uniformConfigurationInstance.getCategoryInfo().Name,
        "TopAvailable": GlobalInstance.uniformConfigurationInstance.getTopAvailable(),
        "BottomAvailable": GlobalInstance.uniformConfigurationInstance.getBottomAvailable(),
        "PantAvailable": GlobalInstance.uniformConfigurationInstance.getPantAvailable(),
        "UserId": GlobalInstance.uniformConfigurationInstance.getUserId(),
        "UniformPrice": GlobalInstance.uniformConfigurationInstance.getTotalUniformPrice(),
        "UniformConfiguration": { "uniformConfig": uniformConfigATG },
        "SourceThumbnailTagName": GlobalInstance.uniformConfigurationInstance.getPreviewUrlTagName(),
        "LocalConfiguration": { "uniformConfig": saveData }
    };

    finalData = JSON.stringify({ 'RequestData': finalData });
    return finalData;

};

/**
 * get the all orientation Preview url to send on the server
 * 
 * @returns {void}
 */
SaveConfig.prototype.getAllBirdEyePreviewUrl = function () {
    var orientation = '';

    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var previewImages = GlobalInstance.getStyleAndDesignInstance().getBirdEyePreviewImageList();
    var selectedStyle = GlobalInstance.getStyleAndDesignInstance().getSelectedStyle();
    if (Utility.getObjectlength(previewImages['_' + selectedStyle.StyleId]) > 0) {
        var j = 1;
        var birdEyeViewInfo = GlobalInstance.getUniformConfigurationInstance().getBirdEyeView();
        //set default the first preview Url Tag
        GlobalInstance.getUniformConfigurationInstance().setPreviewUrlTagName('previewUrl1');
        $.each(previewImages['_' + selectedStyle.StyleId], function (i, birdEyeView) {
            var key = 'previewUrl' + j;
            orientation = birdEyeView.Name.toLowerCase();
            //Modify the below line as everytime the front view should be visible in shopping cart
            //this is mentioned in spiceworkds ticket id - 291 & TFS id - 317
            if (orientation == CONFIG.get('BIRD_EYE_VIEW_ORIENTATION_FRONT')) {
                GlobalInstance.getUniformConfigurationInstance().setPreviewUrlTagName(key);
            }
            j = parseInt(j) + 1;
            var params = { "view": orientation, birdEyeViewObject: birdEyeView };
            GlobalInstance.uniformConfigurationInstance.setPreviewUrls(key, LiquidPixels.generatePreviewUrl(null, null, orientation, params));
        });
    }
};

SaveConfig.prototype.getImagesAppliedOnAnchorPoints = function () {
    var uploadedGraphicAnchorList = GlobalInstance.getUniformConfigurationInstance().getAnchorPoints();
    var imageArray = new Array();
    this.uploadedImages = new Array();

    for (var key in uploadedGraphicAnchorList) {
        var anchorPointObj = uploadedGraphicAnchorList[key];
        var type = anchorPointObj.type;
        var graphicName = anchorPointObj.GraphicUrl ? anchorPointObj.GraphicUrl : '';

        if (type == "uploadedgraphic" && graphicName != '') {
            objUploadedImage = {};
            objUploadedImage.AnchorPointId = '_' + anchorPointObj.id;
            objUploadedImage.ImageUrl = graphicName;
            
            this.uploadedImages.push(objUploadedImage);

            if (!Utility.isExist(imageArray, graphicName)) {
                imageArray.push(graphicName);
            }
        }
    }
    
                
    var objUploadGraphiceImage = {
        "EmailId": GlobalInstance.uniformConfigurationInstance.getUserInfo('email'),
        "AccountNumber": objApp.sessionResponseData.AccountNumber,
        "AnchorPointImages": this.uploadedImages
    };
    GlobalInstance.uniformConfigurationInstance.setAnchorPointuploadedImagesForProduction(objUploadGraphiceImage);
    return imageArray;
};

/**
 * Get the object of unique image name.
 * @param {type} imageDisplayName
 * @returns array of images that need
 */
SaveConfig.prototype.getImageCorrectionObject = function (imageResponseData) {
    try{
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var objProductionImage = {};
        var imageArray = new Array();
        var arrProductionImages = new Array();
        var isCorrectionFeeFeatureRequired = objApp.correctionFeeFeatureRequired == 1 ? true : false;
        var correctionFeeAmount = objApp.correctionFeeAmount;
        var thisObject = this;
        $.each(imageResponseData.ResponseData, function (i, data) {
            if (data && data.FeeCharged == false && data.GAVerificationRequired && isCorrectionFeeFeatureRequired == true) {
                objProductionImage = {};
                var graphic = {
                    'graphicUrl': data.ImageUrl,
                    'goodResolution': data.IsResolutionOk,
                    'goodTransparancy': data.IsTransparencyOk,
                    'goodVectorized': data.IsVector,
                    'goodSize': data.IsSizeOk,
                    'feeAmont': correctionFeeAmount
                }

                imageArray.push(graphic);
                objProductionImage.uploadedGraphicUrl = data.ImageUrl;

                var graphicName = data.ImageUrl.substring(data.ImageUrl.lastIndexOf('/') + 1)
                var graphicExtension = graphicName.substring(graphicName.indexOf(".") + 1);
                productionGraphicName = graphicName.replace(graphicExtension, 'tif');

                objProductionImage.productionGraphicUrl = data.ImageUrl.replace(graphicName, productionGraphicName);
                arrProductionImages.push(objProductionImage);
            }
        });
        
        Log.trace(JSON.stringify(this.uploadedImages));

        GlobalInstance.uniformConfigurationInstance.setImagesForProduction(arrProductionImages);
        return imageArray;
    } catch (err) {
        var errObj = {
            loglevel: Log.Level.ERROR,
            message: err.message,
            fileName: err.fileName,
            className: 'SaveConfig',
            methodName: 'saveUniformConfigurationData',
            lineNumber: err.lineNumber,
            errorType: err.name
        };
        Log.error(errObj);
        return new Array();
    }
};

/*
*This method updates the production url
*/
SaveConfig.prototype.updateProductionUrl = function (rosterPlayer, callback) {
    try {
        var topProductionUrl = '';
        var bottomProductionUrl = '';
        var productionImages = GlobalInstance.uniformConfigurationInstance.getImagesForProduction();

        //get the image correction status
        if (this.uploadedImages.length > 0) {
            for (var key in productionImages) {
                if (Number(key) != NaN && Number(key) >= 0) {
                    if (rosterPlayer.top) {
                        rosterPlayer.top.productionUrl = Utility.replaceAll(productionImages[key].uploadedGraphicUrl, productionImages[key].productionGraphicUrl, rosterPlayer.top.productionUrl)
                    }

                    if (rosterPlayer.bottom) {
                        rosterPlayer.bottom.productionUrl = Utility.replaceAll(productionImages[key].uploadedGraphicUrl, productionImages[key].productionGraphicUrl, rosterPlayer.bottom.productionUrl)
                    }
                }
            }
            if (callback) {
                callback(rosterPlayer);
            }
        } else {
            if (callback) {
                callback(rosterPlayer);
            }
        }

        
    } catch (err) {
        Log.trace('Error caught in the updateProductionUrl----' + err.message);
    }
};