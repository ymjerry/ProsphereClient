/**
 * TWA proshpere configurator
 *
 *
 * @package TWA proshpere configurator
 * @subpackage core
 */

/**
 * Class constructor 
 *   
 *
 * @return void
 */
function GoogleAnalyticsUtil() {
    this.lPLAT = "_PLAT:cnfg3";
    this.lUSER = "USR:";
    this.lUSERDTL = "_USRDTL:";
    this.lSPORT = "_SPORT:";
    this.lPGTP = "_PGTP:";
    this.lPGDTL = "_PGDTL:";
    this.lST = "_ST:"; // STYLE NUMBER
    this.lDS = "_DS:"; // DESIGN NUMBER
}

/**
 * This is a public method which will take in all params to construct a Tracking string
 * and then invoke a javascript method on the parent page which will then call the tracking code from there.
 * AT this time, the parent will capture the session id and attach that information to the tracking string 
 * before making the Google Analytics call
 * 
 * @param  pageType
 * @param pageDetail
 * @param styleInfo
 * @param designInfo
 * @returns {void}
 */
GoogleAnalyticsUtil.prototype.constructTrackingString = function(pageType, pageDetail, styleInfo, designInfo) {
    try {
        var trackingString = "";
        if (pageType == "")
            pageType = "NA";
        if (pageDetail == "")
            pageDetail = "NA";
        if (styleInfo == "")
            styleInfo = "NA";
        if (designInfo == "")
            designInfo = "NA";
        // only if Tracking is turned ON, go through the tracking process, else skip
        if (GOOGLE_ANALYTICS_STR.get('GATC_ON_OFF') == "ON") {
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            // construct tracking string
            // compute user info            
            trackingString += this.addUserGoogleAnalyticsString();
            // Attach the platform info
            trackingString += this.lPLAT;
            // Attach Sport & Gender information
            try {
                if (pageType == GOOGLE_ANALYTICS_STR.get('LANDING_STR')) {
                    trackingString = trackingString + this.lSPORT + "NA"; // when on landing page - sport is not applicable
                } else {
                    var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
                    trackingString = trackingString + this.lSPORT + categoryInfo.Name;
                }
            } catch (err) {
                trackingString = trackingString + this.lSPORT + "NA";
            }
            try {
                var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
                var genderStr = genderInfo.Name.toLowerCase();
                if (genderStr == "")
                    genderStr = "NA";
                trackingString = trackingString + "-" + genderStr;
            } catch (err) {
                trackingString = trackingString + "-" + "NA";
            }
// Attach Page Type (passed from caller)
            trackingString = trackingString + this.lPGTP + pageType;
            // Attach Page Detail (passed from caller)
            trackingString = trackingString + this.lPGDTL + pageDetail;
            // Call the Parent Javascript Invoker
            //// invokeParentJavascript(trackingString);					
            // MODIFICATION to GATC VER#1: Calling the revised Async Parent Page API so as to not add session id information to the tracking string - Soumik - VER#2
            this.invokeAsyncGATCParentPageJSFunction(trackingString);
        }
    } catch (err) {
        Log.trace("Tracking Error=> " + err.message);
    }
};
/**
 * This method is being replaced by the tradition call to the Synchronous GATC code which used to look like
 * ExternalInterface.call("pageTracker._trackPageview", ""+global.ADVSport+"-"+global.ADVGender+": START BLANK");
 * The GATC call will now be made from parent javascript and the configurator will just call that function with the tracking string
 * This method calls a function in the parent page which does not add a session id string to the end of the tracking string before calling 
 * google analytics and it also works with the Google Asynchronous Tracking Implementation 
 * 
 * @param  theTrackingString
 * @returns {void}
 */
GoogleAnalyticsUtil.prototype.invokeAsyncGATCParentPageJSFunction = function(theTrackingString) {
    try {
        if (theTrackingString != "") {
            // call external function 
            getConfiguratorTrackinStringNoSessionId(theTrackingString);
        }
    } catch (err) {
        Log.trace("Tracking Error=> " + err.message);
    }
};

/**
 * 
 * @returns {String|trackingString}
 */
GoogleAnalyticsUtil.prototype.addUserGoogleAnalyticsString = function() {
    var trackingString = "";
    try {
        var userId = GlobalInstance.uniformConfigurationInstance.getUserId();
        var referralCode = GlobalInstance.uniformConfigurationInstance.getReferralCode();
        if (userId != '' && userId != null) {
            trackingString = trackingString + this.lUSER + GOOGLE_ANALYTICS_STR.get('DEALER');
        } else if (referralCode != null && referralCode != "") {
            trackingString = trackingString + this.lUSER + "REFERRAL";
        } else {
            trackingString = trackingString + this.lUSER + GOOGLE_ANALYTICS_STR.get('CONSUMER');
        }
    } catch (err) {
        trackingString = trackingString + this.lUSER + GOOGLE_ANALYTICS_STR.get('CONSUMER');
    }
    return trackingString;
};
/**
 * track on sport click
 * 
 * @param  sportName
 * @return {void}
 */
GoogleAnalyticsUtil.prototype.trackSportNameClicks = function(sportName) {
    this.lUSER = "USR:";
    var trackingString = "SPORT-LIST-ITEM:" + sportName + "-";
    if (GOOGLE_ANALYTICS_STR.get('GATC_ON_OFF') == "ON") {
        try {
            trackingString += this.addUserGoogleAnalyticsString();
        } catch (userErr) {
            trackingString = trackingString + this.lUSER + GOOGLE_ANALYTICS_STR.get('CONSUMER');
        }
    }
    this.invokeAsyncGATCParentPageJSFunction(trackingString);
};
/**
 * track on Get Started Button click
 * 
 * @param  sportName
 * @return {void}
 */
GoogleAnalyticsUtil.prototype.trackPsPlusFormClicks = function () {
    this.lUSER = "USR:";
    var trackingString = "PROSPHERE_PLUS_INFORMATION"+ "-";
    if (GOOGLE_ANALYTICS_STR.get('GATC_ON_OFF') == "ON") {
        try {
            trackingString += this.addUserGoogleAnalyticsString();
        } catch (userErr) {
            trackingString = trackingString + this.lUSER + GOOGLE_ANALYTICS_STR.get('CONSUMER');
        }
    }
    this.invokeAsyncGATCParentPageJSFunction(trackingString);
};

/**
 * track on Yes Button click of Prosphere plus Confirmation Popup
 * 
 *
 * @return {void}
 */
GoogleAnalyticsUtil.prototype.trackPsPlusConfirmationYesClicks = function () {
    this.lUSER = "USR:";
    var trackingString = "CURRENT_FLEX_PS_EXPERIENCE" + "-";
    if (GOOGLE_ANALYTICS_STR.get('GATC_ON_OFF') == "ON") {
        try {
            trackingString += this.addUserGoogleAnalyticsString();
        } catch (userErr) {
            trackingString = trackingString + this.lUSER + GOOGLE_ANALYTICS_STR.get('CONSUMER');
        }
    }
    this.invokeAsyncGATCParentPageJSFunction(trackingString);
};

/**
 * track on No Button click of Prosphere plus Confirmation Popup
 * 
 * 
 * @return {void}
 */
GoogleAnalyticsUtil.prototype.trackPsPlusConfirmationNOClicks = function () {
    this.lUSER = "USR:";
    var trackingString = "NEW_PS_EXPREIENCE" + "-";
    if (GOOGLE_ANALYTICS_STR.get('GATC_ON_OFF') == "ON") {
        try {
            trackingString += this.addUserGoogleAnalyticsString();
        } catch (userErr) {
            trackingString = trackingString + this.lUSER + GOOGLE_ANALYTICS_STR.get('CONSUMER');
        }
    }
    this.invokeAsyncGATCParentPageJSFunction(trackingString);
};

/**
 * track on prosphere plus banner 
 * 
 * 
 * @return {void}
 */
GoogleAnalyticsUtil.prototype.trackPsPlusBannerClicks = function (emailAddress) {
    this.lUSER = "USR:";
    var trackingString = "PROSPHERE_PLUS_INFORMATION" + "-";
    if (GOOGLE_ANALYTICS_STR.get('GATC_ON_OFF') == "ON") {
        try {
            trackingString += this.addUserGoogleAnalyticsString();
        } catch (userErr) {
            trackingString = trackingString + this.lUSER + GOOGLE_ANALYTICS_STR.get('CONSUMER');
        }
    }
    this.invokeAsyncGATCParentPageJSFunction(trackingString);
};

/**
 * track on ConfirmationPopUP Click of Prosphere plus 
 * 
 * @return {void}
 */
GoogleAnalyticsUtil.prototype.trackPsPlusConfirmationBtnClicks = function () {
    this.lUSER = "USR:";
    var trackingString = "SWITCH_FLEX_PS_EXPERIENCE" + "-";
    if (GOOGLE_ANALYTICS_STR.get('GATC_ON_OFF') == "ON") {
        try {
            trackingString += this.addUserGoogleAnalyticsString();
        } catch (userErr) {
            trackingString = trackingString + this.lUSER + GOOGLE_ANALYTICS_STR.get('CONSUMER');
        }
    }
    this.invokeAsyncGATCParentPageJSFunction(trackingString);
};
/**
 * track on gender click
 * 
 * @param  sportName
 * @param  sportGender
 * @returns {void}
 */
GoogleAnalyticsUtil.prototype.trackSportGenderClicks = function(sportName, sportGender) {
    var trackingString = sportName + "-" + sportGender + ": START BLANK";
    this.invokeAsyncGATCParentPageJSFunction(trackingString);
};

/**
 * track on Page Load
 * 
 * @returns {void}
 */
GoogleAnalyticsUtil.prototype.landingPageLoad = function() {
    var trackingString = this.addUserGoogleAnalyticsString() + "_PLAT:atg_PGTP:configurator";
    this.invokeAsyncGATCParentPageJSFunction(trackingString);
};
/**
 * track on Define Tab Click
 * 
 * @param  sportName
 * @param  sportGender
 * @returns {void}
 */


/**
 * track on Define Tab Click
 * 
 * @param  sportName
 * @param  sportGender
 * @returns {void}
 */
GoogleAnalyticsUtil.prototype.trackDefineClicks = function(sportName, sportGender) {
    var pgDtl = GOOGLE_ANALYTICS_STR.get('DEFINE_STR');
    this.collectAndPostGoogleAnalyticsTrackingParameters(pgDtl);
};

/**
 * bind tab and button to track
 * @returns {void}
 */
GoogleAnalyticsUtil.prototype.bindButtonAndTabBind = function() {
    var thisObejct = this;
    var buttonAndTabObject = {
        "dvTabDefine": "DEFINE_STR",
        "dvTabCustomize": "COLOR_STR",
        "tbColor": "COLOR_STR",
        "tbFabric": "FABRIC_STR",
        "tbEmblemGraphic": "EMBELEMS_AND_GRAPHIC_STR",
        "tbNumberText": "NUMBER_AND_TEXT_STR",
        "dvSelectGraphics": "GRAPHIC_STR",
        "dvUploadGraphic": "UPLOADED_GRAPHIC_STR",
        "dvMyLocker": "MY_LOCKER_STR",
        "dvIdPlayerNumberOption": "PLAYER_NUMBER_STR",
        "dvIdTeamNameOption": "TEAM_NAME_STR",
        "dvIdPlayerNameOption": "PLAYER_NAME_STR",
        "dvIdOtherTextOption": "OTHER_TEXT_STR",
        "dvGoToRosterBtn": "ROSTER_STR",
        //"aCustomizeSelectionBtn": "COLOR_STR",
        "dvColorContinueBtn": "FABRIC_STR",
        // added bottom buttons 
        "btnPlayerNumberPlayerName": "PLAYER_NUMBER_STR",
        "btnPlayerNumberTeamName": "PLAYER_NUMBER_STR",
        "btnPlayerNumberOtherText": "PLAYER_NUMBER_STR",
        "btnPlayerNamePlayerNumber": "PLAYER_NAME_STR",
        "btnPlayerNameTeamName": "PLAYER_NAME_STR",
        "btnPlayerNameOtherText": "PLAYER_NAME_STR",
        "btnOtherTextPlayerName": "OTHER_TEXT_STR",
        "btnOtherTextPlayerNumber": "OTHER_TEXT_STR",
        "btnOtherTextTeamName": "OTHER_TEXT_STR",
        "btnTeamNamePlayerName": "TEAM_NAME_STR",
        "btnTeamNamePlayerNumber": "TEAM_NAME_STR",
        "btnTeamNameOtherText": "TEAM_NAME_STR",
        "btnSelectGraphic": "GRAPHIC_STR",
        "btnUploadGraphic": "UPLOADED_GRAPHIC_STR",
        "btnMyLocker": "MY_LOCKER_STR",
        "dvProofRosterPlayer": "PROOF_STR",
        "spanChangeFabric": "FABRIC_STR",
        //"dvModifyUnifrom": "DEFINE_STR",
        //"modifyUniformFromProof": "DEFINE_STR",
        "backToConfigurator": "DEFINE_STR",
        "dvButtonFlatCutScreen": "FLAT_CUT",
        "idQuoteBtn": "ADV_QUOTINGTOOL_STR",
        "aConfirmationProPopup": "PS_PLUS_THANKS_NEW_EXP_LATER",
        "aGetStarted": "PS_PLUS_START_FORM",
        "aYesProPlus": "PS_PLUS_YES_SWITCH_TO_OLD_APP",
        "aSendMsgProPlus": "PS_PLUS_SEND_EMAIL",
        "dvNoProPlus": "PS_PLUS_NO_NEW_PS"
    };

    //Function used to call google Analytics
    $(document).off('click', '#dvTabDefine, #dvTabCustomize, #tbColor, #tbFabric, #tbEmblemGraphic, #tbNumberText,#dvSelectGraphics, #dvUploadGraphic, #dvMyLocker, #dvIdPlayerNumberOption, #dvIdTeamNameOption, #dvIdPlayerNameOption, #dvIdOtherTextOption, #dvGoToRosterBtn,#dvColorContinueBtn, #btnPlayerNumber, #btnOtherText, #btnPlayerName, #btnTeamName, #dvProofRosterPlayer, #spanChangeFabric, #dvModifyUnifrom , #btnPlayerNumberPlayerName , #btnTeamNamePlayerName, #btnOtherTextPlayerName, #btnPlayerNamePlayerNumber , #btnTeamNamePlayerNumber, #btnOtherTextPlayerNumber, #btnPlayerNumberTeamName, #btnPlayerNameTeamName, #btnOtherTextTeamName, #btnPlayerNumberOtherText, #btnPlayerNameOtherText, #btnTeamNameOtherText, #btnSelectGraphic , #btnUploadGraphic, #btnMyLocker, #dvButtonFlatCutScreen , #idQuoteBtn');
    $(document).on('click', '#dvTabDefine, #dvTabCustomize, #tbColor, #tbFabric, #tbEmblemGraphic, #tbNumberText,#dvSelectGraphics, #dvUploadGraphic, #dvMyLocker, #dvIdPlayerNumberOption, #dvIdTeamNameOption, #dvIdPlayerNameOption, #dvIdOtherTextOption, #dvGoToRosterBtn,#dvColorContinueBtn, #btnPlayerNumber, #btnOtherText, #btnPlayerName, #btnTeamName, #dvProofRosterPlayer, #spanChangeFabric, #dvModifyUnifrom , #btnPlayerNumberPlayerName , #btnTeamNamePlayerName, #btnOtherTextPlayerName, #btnPlayerNamePlayerNumber , #btnTeamNamePlayerNumber, #btnOtherTextPlayerNumber, #btnPlayerNumberTeamName, #btnPlayerNameTeamName, #btnOtherTextTeamName, #btnPlayerNumberOtherText, #btnPlayerNameOtherText, #btnTeamNameOtherText, #btnSelectGraphic , #btnUploadGraphic, #btnMyLocker, #dvButtonFlatCutScreen , #idQuoteBtn', function (event) {
        var targetId = $(this).attr('id');
        var pgDtl = "";
        //var globalStr = "";
        if (targetId == 'dvModifyUnifrom') {
            //check which panel is visible
            // thisObejct.modifyUniformClick();    
        } else {
            var globalStr = buttonAndTabObject[targetId] || 'DEFINE_STR';
            if (globalStr) {
                pgDtl = GOOGLE_ANALYTICS_STR.get(globalStr);
            }
            thisObejct.collectAndPostGoogleAnalyticsTrackingParameters(pgDtl);
        }
    });
};

/**
 * track on style click
 * 
 * @param  sportName
 * @param  sportGender
 * @returns {void}
 */
GoogleAnalyticsUtil.prototype.modifyUniformClick = function() {
    try {
        var globalStr = '';
        var panelIDs = {
            "secColorPanel": "COLOR_STR",
            "secFabricPanel": "FABRIC_STR",
            "secEmblemAndGraphicsPanel": "EMBELEMS_AND_GRAPHIC_STR",
            "secConfiguratorGraphicsHome": "EMBELEMS_AND_GRAPHIC_STR",
            "secNumberAndTextPanel": "NUMBER_AND_TEXT_STR",
            "secNumberAndTextHome": "NUMBER_AND_TEXT_STR",
            "secConfiguratorSelectGraphics": "GRAPHIC_STR",
            "secConfiguratorUploadGraphics": "UPLOADED_GRAPHIC_STR",
            "secConfiguratorMyLocker": "MY_LOCKER_STR",
            "secPlayerNumber": "PLAYER_NUMBER_STR",
            "secTeamName": "TEAM_NAME_STR",
            "secPlayerName": "PLAYER_NAME_STR",
            "secOtherText": "OTHER_TEXT_STR"
        };
        $.each(panelIDs, function(id, text) {
            if ($('#' + id).is(':visible')) {
                globalStr = text;
                return;
            }
        });
        var globalStr = globalStr || 'DEFINE_STR';
        if (globalStr) {
            pgDtl = GOOGLE_ANALYTICS_STR.get(globalStr);
        }
        this.collectAndPostGoogleAnalyticsTrackingParameters(pgDtl);

    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            var txt = "Error description gautil 290: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            return false;
        }
    }
};

// Adding Enhanced Google Analytics to Configurator 
GoogleAnalyticsUtil.prototype.collectAndPostGoogleAnalyticsTrackingParameters = function(pgDtl) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var GAStyleName = "";
    var GADesignName = "";
    if (pgDtl == "")
        pgDtl = GOOGLE_ANALYTICS_STR.get('DEFINE_STR');

    try {
        var selectedStyle = GlobalInstance.getStyleAndDesignInstance().getSelectedStyle();
        if (Utility.getObjectlength(selectedStyle,'gajs308') > 0 && selectedStyle.StyleName != null && selectedStyle.StyleName != '') {
            GAStyleName = selectedStyle.StyleName;
        } else {
            GADesignName = "";
        }

    } catch (e) {
        GAStyleName = "";
    }
    try {
        var designInfo = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
        if (Utility.getObjectlength(designInfo,'gajs319') > 0 && designInfo.DesignName != null && designInfo.DesignName != '') {
            GADesignName = designInfo.DesignName;
        } else {
            GADesignName = "";
        }
    } catch (err) {
        GADesignName = "";
    }
    this.constructTrackingString(GOOGLE_ANALYTICS_STR.get('DESIGN_STR'), pgDtl, GAStyleName, GADesignName);
};

/**
 * track on style click
 * 
 * @param  sportName
 * @param  sportGender
 * @returns {void}
 */
GoogleAnalyticsUtil.prototype.trackStyleClicks = function() {
    try {
        this.collectAndPostGoogleAnalyticsTrackingParameters(GOOGLE_ANALYTICS_STR.get('DEFINE_STR'));
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            var txt = "Error description gautil 342: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            return false;
        }
    }
};

/**
 *  Track in google Analytics, if email has been entered for player. 
 *  In Google Analytics a hit will be recorded for every valid email entered
 *  
 * @param  emailFld
 * @returns void
 */
GoogleAnalyticsUtil.prototype.trackEmailEntry = function(emailFld)
{
    try {
        if (null != emailFld && emailFld != "") {
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
            var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
            var lADVSport = categoryInfo.Name; //"Softball";
            var lADVGender = genderInfo.Name.toLowerCase(); //"female/male";
            var trackingString = "" + lADVSport + "-" + lADVGender + ": PLAYER_EMAIL_ENTERED";
            this.invokeAsyncGATCParentPageJSFunction(trackingString);
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            var txt = "Error description gautil 372: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            return false;
        }
    }
};
GoogleAnalyticsUtil.prototype.trackPlayerNumberClick = function() {
    var pgDtl = GOOGLE_ANALYTICS_STR.get('PLAYER_NUMBER_STR');
    this.collectAndPostGoogleAnalyticsTrackingParameters(pgDtl);
};

GoogleAnalyticsUtil.prototype.trackPlayerNameClick = function() {
    var pgDtl = GOOGLE_ANALYTICS_STR.get('PLAYER_NAME_STR');
    this.collectAndPostGoogleAnalyticsTrackingParameters(pgDtl);
};

GoogleAnalyticsUtil.prototype.trackTeamNamesClick = function() {
    var pgDtl = GOOGLE_ANALYTICS_STR.get('TEAM_NAME_STR');
    this.collectAndPostGoogleAnalyticsTrackingParameters(pgDtl);
};

GoogleAnalyticsUtil.prototype.trackOtherTextClick = function() {
    var pgDtl = GOOGLE_ANALYTICS_STR.get('OTHER_TEXT_STR');
    this.collectAndPostGoogleAnalyticsTrackingParameters(pgDtl);
};

GoogleAnalyticsUtil.prototype.trackSelectGraphicsClick = function() {
    var pgDtl = GOOGLE_ANALYTICS_STR.get('GRAPHIC_STR');
    this.collectAndPostGoogleAnalyticsTrackingParameters(pgDtl);
};

GoogleAnalyticsUtil.prototype.trackUploadGraphicsClick = function() {
    var pgDtl = GOOGLE_ANALYTICS_STR.get('UPLOADED_GRAPHIC_STR');
    this.collectAndPostGoogleAnalyticsTrackingParameters(pgDtl);
};

GoogleAnalyticsUtil.prototype.trackMyLockerClick = function() {
    var pgDtl = GOOGLE_ANALYTICS_STR.get('MY_LOCKER_STR');
    this.collectAndPostGoogleAnalyticsTrackingParameters(pgDtl);
};

/**
 * track on upload roster
 * @returns {void}
 */
GoogleAnalyticsUtil.prototype.uploadRoster = function() {
    var pgDtl = GOOGLE_ANALYTICS_STR.get('UPLOAD_ROSTER');
    this.collectAndPostGoogleAnalyticsTrackingParameters(pgDtl);
};

/**
 * Track number of times user selected APPROVE NOW Vs APPROVE LATER BY EMAIL and proceeded to checkout
 * The number of hits will be communicated to Google only if ADD TO CART is successful.
 * 
 * @returns {void}
 */
GoogleAnalyticsUtil.prototype.approveNowOrLater = function(isApprovedNow) {
    var onlineProofApprovalTypeString = "";
    if (isApprovedNow)
        onlineProofApprovalTypeString = ": ONLINE PROOF APPROVED";
    else
        onlineProofApprovalTypeString = ": ONLINE PROOF APPROVAL DEFERRED";
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
    var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
    var ADVSport = categoryInfo.Name; //"Softball";
    var ADVGender = genderInfo.Name.toLowerCase(); //"female/male";
    var trackingString = "" + ADVSport + "-" + ADVGender + onlineProofApprovalTypeString;
    this.invokeAsyncGATCParentPageJSFunction(trackingString);  
};

/**
 * track on go to cart button
 * 
 * @returns {void}
 */
GoogleAnalyticsUtil.prototype.goToCart = function() {
    var trackingString = "USER:" + this.addUserGoogleAnalyticsString() + "_PLAT:atg_PGTP:checkout_PGDTL:cart";
    this.invokeAsyncGATCParentPageJSFunction(trackingString);
};