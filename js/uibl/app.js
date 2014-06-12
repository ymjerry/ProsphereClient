/**
 * TWA proshpere configurator
 * 
 * app.js is used to maintain app related functions;
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor
 * 
 * 
 * @return void
 */
var isFirstTimeLoadFromRC = false; //When Application loads for first time from the Retrieval Code.

function App() {
    this.isSessionStarted = false;
    this.objUtility = new Utility();
    this.uid = '';
    this.accountNumber = Utility.getParameterByName('uid');
    this.rid = Utility.getParameterByName('rid');
    this.sid = '';
    this.priceList = CONFIG.get('DEFAULT_PRICE_LIST');
    this.markUpPrice = CONFIG.get('DEFAULT_MARKUP_PRICE');
    this.fromSingleItemAPI = false;
    this.landingPage = null;
    this.allowCustomization = true;
    this.sessionResponseData = null;
    this.isStartOver = Utility.getParameterByName('start');
    this.accountURL = CONFIG.get('ACCOUNT_URL');
    this.correctionFeeFeatureRequired = CONFIG.get('CORRECTION_FEE_FEATURE_REQUIRED');
    this.correctionFeePromotionApplicable = CONFIG.get('CORRECTION_FEE_PROMOTION_APPLICABLE');
    this.correctionFeeAmount = CONFIG.get('CORRECTION_FEE_AMOUNT');
    this.userType = CONFIG.get('USER_TYPE_CUSTOMER');
    this.isNewDealer = CONFIG.get('NEW_DEALER');
    this.modelPreviewUrlLength = CONFIG.get('MODEL_PREVIEW_LENGTH');
    this.legacyConfiguratorUrl = CONFIG.get('LEGACY_CONFIGURATOR_URL');
}

/**
 * Starts the Prosphere configurator session
 * 
 * @return void
 */
App.prototype.startSession = function () {
    this.isSessionStarted = true;
};

/**
 * Ends the Prosphere configurator session
 * 
 * @return void
 */
App.prototype.endSession = function () {
    this.isSessionStarted = false;
};

/**
 * Returns the configurator session state
 * 
 * @return Boolean true if session is established and running, false otherwise
 */
App.prototype.getSessionState = function () {
    return this.isSessionStarted;
};

/** Initiate the configurator and loads the initial libraries
 * 
 * @return void
 */
App.prototype.init = function (sessionData) {
    if (sessionData) {
        this.sessionResponseData = sessionData;
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setSessionInformation(this.sessionResponseData);
        GlobalInstance.uniformConfigurationInstance.setSessionVariable(this.sessionResponseData.SessionVariable);
        GlobalInstance.uniformConfigurationInstance.setSessionVariable(this.sessionResponseData.SessionVariable);
        if (this.sessionResponseData.DealerEmail && this.sessionResponseData.UserType == CONFIG.get('USER_TYPE_DEALER')) {
            GlobalInstance.uniformConfigurationInstance.setUserInfo('email', this.sessionResponseData.DealerEmail);
        }

        this.startSession();
        if (!this.rid)
            this.rid = this.sessionResponseData.RetrievalCode;

        // checking if retrival code is exist or not
        if (this.rid) {
            //assignig value to landing page flag
            if (this.sessionResponseData.LandingPage != '') {
                this.landingPage = this.sessionResponseData.LandingPage;
            } else {
                this.landingPage = Utility.getParameterByName('landingPage');
            }
        }

        this.fromSingleItemAPI = this.sessionResponseData.FromSingleItemAPI;
        this.sid = this.sessionResponseData.SupportedSports;
        this.uid = this.sessionResponseData.DealerId;
        this.accountNumber = this.sessionResponseData.AccountNumber;
        this.priceList = this.sessionResponseData.PriceList;
        this.allowCustomization = this.sessionResponseData.AllowCustomization;
        this.markUpPrice = this.sessionResponseData.MarkUpPrice;
        this.accountURL = this.sessionResponseData.AccountURL || this.accountURL;
        this.correctionFeeFeatureRequired = this.sessionResponseData.CorrectionFeeFeatureRequired || this.correctionFeeFeatureRequired;
        this.correctionFeePromotionApplicable= this.sessionResponseData.CorrectionFeePromotionApplicable  || this.correctionFeePromotionApplicable;
        this.correctionFeeAmount = this.sessionResponseData.CorrectionFeeAmount  || this.correctionFeeAmount;
        this.userType = this.sessionResponseData.UserType || this.UserType;
        this.isNewDealer = this.sessionResponseData.IsNewDealer || this.isNewDealer;
        this.modelPreviewUrlLength = this.sessionResponseData.ModelPreviewUrlLength || this.modelPreviewUrlLength;
        this.legacyConfiguratorUrl = this.sessionResponseData.LegacyProsphereConfiguratorUrl || this.legacyConfiguratorUrl;

        if (this.accountURL) {
            $('#aVisitMyLocker').attr('href', this.accountURL);
        }
        
        if (this.accountNumber) {
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            GlobalInstance.uniformConfigurationInstance.setAccountNumber(this.accountNumber);
        }

        //set the landing page as zero if allow customization is not allowed and landing page is not prrof page
        if (!this.allowCustomization && this.landingPage != CONFIG.get('LANDING_PAGE_PROOF')) {
            this.landingPage = CONFIG.get('LANDING_PAGE_ROSTER');
            this.sessionResponseData.LandingPage = CONFIG.get('LANDING_PAGE_ROSTER');
        }
        this.bindScreenEvents();
        if (!objApp.rid || objApp.isStartOver == 1) {
            $(document).trigger("hideSplashScreen", [{
                "containerId": "secDefinePanel"
            }]);
        }
    } else {
        this.bindScreenEvents();
    }



    //following method will be called after receiving session
    var loadConfigParams = "";
    var configRetrievalLoaded = false;
    if (this.rid && this.isStartOver != 1) {
        loadConfigParams = [{
            'rid': this.rid

        }];
    }
    else if (this.userType == CONFIG.get('USER_TYPE_DEALER') && this.accountNumber) {
        loadConfigParams = [{
            'uid': this.accountNumber
        }];
    }

    if (this.uid) {
        // set uid 
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setUserId(this.uid);

        //If Dealer Is Logged in
        $('#dvIdVisitMyLocker').show();
    }

    if (loadConfigParams !== '' && this.rid && this.isStartOver != 1) {
        configRetrievalLoaded = true;
        $(document).trigger("loadConfiguration", loadConfigParams);
    } else {
        $(document).trigger("loadDefaults", null);
    }

    //case of session variable present only retrieval is not loaded
    if (loadConfigParams !== '' && this.accountNumber && configRetrievalLoaded == false) {
        $(document).trigger("loadConfiguration", loadConfigParams);
    }

};

/** Binds the Screen events 
 * 
 * @return void
 */
App.prototype.bindScreenEvents = function () {

    $(document).bind("initailizeSports", function (event, args) {
        try {
            GlobalInstance.sportsInstance = GlobalInstance.getSportsInstance();
            GlobalInstance.sportsInstance.getSportsList(false);
        } catch (err) {
            if (CONFIG.get('DEBUG') === true) {
                txt = "Error description app 172: " + err.message + "\n\n";
                txt += "Error filename: " + err.fileName + "\n\n";
                txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                Log.error(txt);
            }
        }
    });

    $(document).bind("loadConfiguration", function (event, args) {
        try {
            if (args.rid) {
                GlobalInstance.loadConfigurationInstance = GlobalInstance.getLoadConfigurationInstance();
                GlobalInstance.loadConfigurationInstance.getUniformConfiguration(args.rid);

            } else if (args.uid && args.uid !== '' && args.uid > 0) {
                GlobalInstance.loadConfigurationInstance = GlobalInstance.getLoadConfigurationInstance();
                GlobalInstance.loadConfigurationInstance.getUniformConfigurationList(args.uid);
            }
        } catch (err) {
            if (CONFIG.get('DEBUG') === true) {
                txt = "Error description app 193: " + err.message + "\n\n";
                txt += "Error filename: " + err.fileName + "\n\n";
                txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                Log.error(txt);
            }
        }
    });
    $(document).bind("saveConfiguration", function (event, args) {
        try {
            GlobalInstance.saveConfigInstance = GlobalInstance.getSaveConfigurationInstance();
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        } catch (err) {
            if (CONFIG.get('DEBUG') === true) {
                txt = "Error description app 206: " + err.message + "\n\n";
                txt += "Error filename: " + err.fileName + "\n\n";
                txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                Log.error(txt);
            }
        }
    });
    $(document).bind("loadDefaults", function (event, args) {
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setApplicationId(CONFIG.get('PROSHPERE_APPLICATION_ID'));
        try {
            //var accountNumber = Utility.getParameterByName('uid');
            var landingPagePromoImg = LiquidPixels.getPromoImageUrl();
            $('#advLandingPagePromoImg').attr('src', landingPagePromoImg);
            $("#dvConfiguratorPanel").hide();
            // call google 
            GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
            GlobalInstance.googleAnalyticsUtilInstance.landingPageLoad();
            //loading sports and bind retrieval uniform go button click
            $.loadPage("secLandingPagePanel", null, true, false, function () {
                GlobalInstance.sportsInstance = GlobalInstance.getSportsInstance();
                GlobalInstance.sportsInstance.getSportsList(false);
                GlobalInstance.sportsInstance.displayEffectClickSportToBegin();
                //bind dealer logo
                try {
                    var dealerLogo = '';
                    if (objApp.sessionResponseData.FromSingleItemAPI) {
                        GlobalInstance.getUniformConfigurationInstance().setSkipAlertStatus(true);
                        dealerLogo = objApp.sessionResponseData.DealerLogoPath;
                        if (dealerLogo != CONFIG.get('DEFAULT_LOGO_VALUE')) {
                            var imgType = dealerLogo.substring(dealerLogo.lastIndexOf('.') + 1);
                            imgType = imgType.toLowerCase();
                            if (Utility.isExist(CONFIG.get('SUPPORTED_IMAGE_TYPES_DEALER_LOGO'), imgType)) {
                                dealerLogo = LiquidPixels.getbackgroundKnockoutUrl(objApp.sessionResponseData.DealerLogoPath, true);
                            }
                        } else {
                            dealerLogo = CONFIG.get('IMAGE_DIR') + CONFIG.get('DEFAULT_DEALER_LOGO'); //use default logo
                        }
                    } else {
                        dealerLogo = CONFIG.get('IMAGE_DIR') + CONFIG.get('DEFAULT_DEALER_LOGO'); //use default logo
                    }
      
                   //$('.homePageDealerLogoRightBottom, .homePageDealerLogoLeft, .homePageDealerLogoRight').css("background", "url('" + dealerLogo + "') no-repeat 0 0");
                    $('.homePageDealerLogoLeft > img').attr('src', dealerLogo);
                    $('.homePageDealerLogoRight > img').attr('src', dealerLogo);

                    //Initialize Dual Launch
                    GlobalInstance.dualLaunchInstance = GlobalInstance.getDualLaunchInstance();
                    GlobalInstance.dualLaunchInstance.init();
                } catch (e) {
                }

                $(document).trigger("bindRetrieveUniformButton", null);
            });

            $.loadPage('secStyleAndDesignPanel', null, true, false, function () {
                $.loadPage('secDefineAndCustomizeHeaderBox', null, true, false, function () {
                    //trigger bind header button which binds the define and customize button
                    $(document).trigger("bindConfiguratorHeaderButtons", null);
                    $.loadPage("secCustomizeSubHeaderBox", null, true, false, function () {
                        GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
                        GlobalInstance.googleAnalyticsUtilInstance.bindButtonAndTabBind();
                        //load the color panel as default first time
                        //GlobalInstance.colorInstance = GlobalInstance.getColorInstance('ctrColorPanelId', 'secondaryColorPanelId', 'tertiaryColoranelId');
                        //GlobalInstance.colorInstance.show();
                        //$('#tbColor').children().addClass('active');

                        //trigger bind sub header button which binds the color, fabric, graphics and number and text button
                        $(document).trigger("bindConfiguratorSubHeaderButtons", null);
                        /********  TEMP Rebuild Cart ******/
                        //GlobalInstance.shoppingCartInstance = GlobalInstance.getShoppingCartInstance();
                        //GlobalInstance.shoppingCartInstance.rebuildCart();
                        /*********************/

                    });
                });

                $.loadPage('dvIdCutAndDesignSelector', null, true, false, function () {
                    $.loadPage('dvSelectStyle', null, true, false);
                    $.loadPage('dvSelectDesign', null, true, false);
                    $(document).trigger("bindCustomizeSelectionButton", null);
                });

                $.loadPage('secShoppingPanel', null, true, false, function () {
                    GlobalInstance.shoppingCartInstance = GlobalInstance.getShoppingCartInstance();
                    GlobalInstance.shoppingCartInstance.init();
                    $(document).trigger("bindHelpButton", null);
                    $(document).trigger("bindLiveChatButton", null);
                    $(document).trigger("bindStartOverButton", null);
                    $('[type=checkbox]').change(function () {
                        handleCheckBoxChange($(this));
                    });
                    if ((GlobalInstance.uniformConfigurationInstance.getUserId() != '' && GlobalInstance.uniformConfigurationInstance.getUserId() != null) || objApp.fromSingleItemAPI) {
                        $('#spShoppingCartTotal').html('Total:');
                    }
                });
                $.loadPage('dvEamilSavePrintPanel', null, true, false, function () {
                    GlobalInstance.emailPrintSaveInstance = GlobalInstance.getEmailPrintSaveInstance();
                    GlobalInstance.emailPrintSaveInstance.bindScreenButtons();
                });
                $.loadPage('secModelPreviewPanel', null, true, false, function () {
                    $(document).trigger("bindModelLargerViewButton", null);
                });

                $.loadPage("secFabricPanel", null, true, false);

                $.loadPage("secColorPanel", null, true, false, function () {
                    GlobalInstance.colorInstance = GlobalInstance.getColorInstance('primaryColorPanel', 'secondaryColorPanel', 'dvIdTertiaryColorPanel');
                    GlobalInstance.colorInstance.init();
                    $(document).trigger("bindContinueColorButton", null);
                });

                $(document).trigger("bindHowToButton", null);
            });

            GlobalInstance.fontInstance = GlobalInstance.getFontInstance();
            GlobalInstance.fontInstance.init();
            GlobalInstance.textEffectInstance = GlobalInstance.getTextEffectInstance();
            GlobalInstance.textEffectInstance.init();

        } catch (err) {
            if (CONFIG.get('DEBUG') === true) {
                txt = "Error description app 372: " + err.message + "\n\n";
                txt += "Error filename: " + err.fileName + "\n\n";
                txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                Log.error(txt);
            }
        }
    });

    /** Handles the sub header tabs functionality. 
     *
     */
    $(document).bind("bindConfiguratorSubHeaderButtons", function (event, args) {
        $("#tbColor, #tbFabric, #tbEmblemGraphic, #tbNumberText").off('click');
        $("#tbColor, #tbFabric, #tbEmblemGraphic, #tbNumberText").on('click', function () {
            switch ($(this).attr('id')) {
                case 'tbFabric':
                    $('.controlBarBgEffect').removeClass('active');
                    $(this).children().addClass('active');
                    try {
                        GlobalInstance.fabricInstance = GlobalInstance.getFabricInstance();
                        GlobalInstance.fabricInstance.show(function () {
                            GlobalInstance.colorInstance = GlobalInstance.getColorInstance('ctrColorPanelId', 'secondaryColorPanelId', 'tertiaryColoranelId');
                            GlobalInstance.colorInstance.hide();

                            GlobalInstance.numberAndTextInstance = GlobalInstance.getNumberAndTextInstance();
                            GlobalInstance.numberAndTextInstance.hide();

                            GlobalInstance.emblemGraphicsInstance = GlobalInstance.getEmblemAndGraphicsInstance();
                            GlobalInstance.emblemGraphicsInstance.hide();

                            GlobalInstance.getAnchorPointInstance().hide();
                        });
                    } catch (e) {
                    }
                    break;
                case 'tbColor':
                    $('.controlBarBgEffect').removeClass('active');
                    $(this).children().addClass('active');

                    GlobalInstance.fabricInstance = GlobalInstance.getFabricInstance();
                    GlobalInstance.fabricInstance.hide();

                    GlobalInstance.numberAndTextInstance = GlobalInstance.getNumberAndTextInstance();
                    GlobalInstance.numberAndTextInstance.hide();

                    GlobalInstance.emblemGraphicsInstance = GlobalInstance.getEmblemAndGraphicsInstance();
                    GlobalInstance.emblemGraphicsInstance.hide();

                    GlobalInstance.getAnchorPointInstance().hide();

                    //$(this).addClass('active');
                    GlobalInstance.colorInstance = GlobalInstance.getColorInstance('ctrColorPanelId', 'secondaryColorPanelId', 'tertiaryColoranelId');
                    GlobalInstance.colorInstance.show();
                    break;

                case 'tbEmblemGraphic':
                    //var flag = 'tbEmblemGraphic';
                    $('.controlBarBgEffect').removeClass('active');
                    $(this).children().addClass('active');

                    GlobalInstance.fabricInstance = GlobalInstance.getFabricInstance();
                    GlobalInstance.fabricInstance.hide();

                    GlobalInstance.colorInstance = GlobalInstance.getColorInstance('ctrColorPanelId', 'secondaryColorPanelId', 'tertiaryColoranelId');
                    GlobalInstance.colorInstance.hide();

                    GlobalInstance.numberAndTextInstance = GlobalInstance.getNumberAndTextInstance();
                    GlobalInstance.numberAndTextInstance.hide();

                    GlobalInstance.getAnchorPointInstance().hide();

                    //$(this).addClass('active');
                    GlobalInstance.emblemGraphicsInstance = GlobalInstance.getEmblemAndGraphicsInstance();
                    GlobalInstance.emblemGraphicsInstance.show();
                    break;


                case 'tbNumberText':
                    $('.controlBarBgEffect').removeClass('active');
                    $(this).children().addClass('active');
                    GlobalInstance.fabricInstance = GlobalInstance.getFabricInstance();
                    GlobalInstance.fabricInstance.hide();

                    GlobalInstance.colorInstance = GlobalInstance.getColorInstance('ctrColorPanelId', 'secondaryColorPanelId', 'tertiaryColoranelId');
                    GlobalInstance.colorInstance.hide();

                    GlobalInstance.emblemGraphicsInstance = GlobalInstance.getEmblemAndGraphicsInstance();
                    GlobalInstance.emblemGraphicsInstance.hide();

                    GlobalInstance.getAnchorPointInstance().hide();

                    GlobalInstance.numberAndTextInstance = GlobalInstance.getNumberAndTextInstance();
                    GlobalInstance.numberAndTextInstance.show();
                    break;
            }
        });
    });

    /** Handles the defines and customize tab functionality. 
     *
     */
    $(document).bind("bindConfiguratorHeaderButtons", function (event, args) {
        $('#dvTabDefine').off('click');
        $('#dvTabDefine').on('click', function () {
            $('#dvTabDefine').addClass('active');
            $('#dvTabCustomize').removeClass('active');
            GlobalInstance.getAnchorPointInstance().setCurrentSelectedAnchorSizeValues(true);
            GlobalInstance.styleAndDesignInstance = GlobalInstance.getStyleAndDesignInstance();
            GlobalInstance.styleAndDesignInstance.show();
        });

        $('#dvTabCustomize').off('click');
        $('#dvTabCustomize').on('click', function () {
            $("#secDefinePanel").hide();
            $("#secCustomizePanel").show();
            $('#dvTabDefine').removeClass('active');
            //$('.controlBar').children().children().children().children().removeClass('active');
            $('#dvTabCustomize').addClass('active');
            //To Show the Can I design link for specific sports.
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            var showColorLinkStatus = GlobalInstance.uniformConfigurationInstance.getShowInfoColorLink();
            var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
            if (showColorLinkStatus) {
                var colorTextLink = CONFIG.get('OTHER_COLOR_LINK_TEXT');
                if (categoryInfo.Name == CONFIG.get('FOOTBALL_STRING')) {
                    colorTextLink = CONFIG.get('FOOTBALL_COLOR_LINK_TEXT');
                }
                var imageHtml = '<img style="margin-left:4px;" src="images/colorWhiteArrow.png" alt="" />';
                $('#spColorLink').html(colorTextLink).append(imageHtml);
                $('#spColorLink').css('display', 'block');
            } else {
                $('#spColorLink').html('');
                $('#spColorLink').css('display', 'None');
            }

            var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
            var relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID'), function (n, i) {
                return (i == currentStyle.StyleId ? n : null);
            });
            if (Utility.getObjectlength(relatedStyleId) <= 0) {
                relatedStyleId = jQuery.map(CONFIG.get('STYLE_COMBINE_ID_FEMALE'), function (n, i) {
                    return (i == currentStyle.StyleId ? n : null);
                });
            }
            var styleFabrics = GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId);
            var relatedStyleFabrics = null;
            ;
            if (relatedStyleId) {
                relatedStyleFabrics = GlobalInstance.fabricInstance.getFabricByStyleId(relatedStyleId);
            }
            var fabricLength = Utility.getObjectlength(styleFabrics, 'appjs534');
            if (relatedStyleFabrics) {
                fabricLength += Utility.getObjectlength(relatedStyleFabrics, 'appjs536');
            }

            if (fabricLength == 1) {
                GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
                GlobalInstance.uniformConfigurationInstance.setCustomizeTabClicked();
                GlobalInstance.shoppingCartInstance = GlobalInstance.getShoppingCartInstance();
                GlobalInstance.shoppingCartInstance.rebuildCart();
            }

        });
    });

    $(document).bind("bindCustomizeSelectionButton", function (event, args) {
        $('#aCustomizeSelectionBtn').off('click');
        $('#aCustomizeSelectionBtn').on('click', function () {
            $('#dvTabCustomize').click();
            return false;
        });
    });
    /** Binds the button to get the uniform configuration using retrieval code
     *
     */
    $(document).bind("bindRetrieveUniformButton", function (event, args) {
        try {
            $('#txtRetrievalCode').off('click');
            $('#txtRetrievalCode').on('click', function () {
                $(this).addClass('active');
            });
            $('#txtRetrievalCode').off('focusout');
            $('#txtRetrievalCode').on('focusout', function () {
                $(this).removeClass('active');
            });
            $("#dvRetrieveUniform").off('click');
            $("#dvRetrieveUniform").on('click', function() {
                var rid = $.trim($('#txtRetrievalCode').val());
                if (rid !== '') {
                    //Check valid rid from server then redirect
                    //rid = $.trim(rid);
                    if (rid.substr(0, 2).toUpperCase() != CONFIG.get('NOT_SUPPORTED_RETRIEVAL_CODE')) {
                        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                        GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBoxForVaccantRTVCode(TITLE.get('TITLE_VALID_RETRIEVAL_CODE'), MESSAGES.get('MESSAGE_NOT_SUPPORTED_RETRIEVAL_CODE'));
                    }
                    else
                    {
                        GlobalInstance.loadConfigurationInstance = GlobalInstance.getLoadConfigurationInstance();
                        GlobalInstance.loadConfigurationInstance.validateRetrieveCode(rid);
                    }
                } else {
                    GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                    GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBoxForVaccantRTVCode(TITLE.get('TITLE_VALID_RETRIEVAL_CODE'), MESSAGES.get('MESSAGE_VALID_RETRIEVAL_CODE'));

                }
            });
        } catch (err) {
            if (CONFIG.get('DEBUG') === true) {
                txt = "Error description app 585: " + err.message + "\n\n";
                txt += "Error filename: " + err.fileName + "\n\n";
                txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                Log.error(txt);
            }
        }
    });

    $(document).bind("bindHowToButton", function (event, args) {
        $(document).off('click', '.howToButton, .howToButtonRoster');
        $(document).on('click', '.howToButton , .howToButtonRoster', function () {
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.funcCallBack = null;
            GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(TITLE.get('TITLE_HOW_TO'), MESSAGES.get('MESSAGE_HOW_TO'));
        });

        /*****************/
        $(document).off('click', '.supWhatIsThis');
        $(document).on('click', '.supWhatIsThis', function () {
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.funcCallBack = null;
            GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(TITLE.get('TITLE_HOW_TO'), MESSAGES.get('MESSAGE_WHAT_THIS_LINK_AT_NUMBER_TEXT_COLOR'));
        });

        $(document).off('click', '#spnLinkProof');
        $(document).on('click', '#spnLinkProof', function () {
            $.loadPage('dvProofRosterWhatsThisPanel', null, true, false, function () {
                $('#dvWhatsThisPopupOkBtn , #dvWhatsThisCloseBtn').off('click');
                $('#dvWhatsThisPopupOkBtn , #dvWhatsThisCloseBtn').on('click', function () {
                    //close popup
                    $('#blanket').css('z-index', 500);

                    //if proof popp is not visible then hide the blanket
                    if (!$('#dvIdProofDocument').is(':visible')) {
                        $('#blanket').hide();
                    }
                    $('#dvProofRosterWhatsThisPanel').hide();
                });

                //show popup
                $('#blanket').css('z-index', 502);
                $('#blanket').show();
                $('#dvProofRosterWhatsThisPanel').show();
            });
        });


        $(document).off('click', '.colorAddButton');
        $(document).on('click', '.colorAddButton', function () {
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.funcCallBack = null;
            GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(TITLE.get('TITLE_ADD_CUSTOM_COLOR'), MESSAGES.get('MESSAGE_ADD_CUSTOM_COLOR'));
        });
    });

    $(document).bind("bindModelLargerViewButton", function (event, args) {
        // print 
        $(document).off('click', "#dvPrintLargerView");
        $(document).on('click', "#dvPrintLargerView", function () {
            if (GlobalFlags.getScreenFlags('isLargerModelPreviewLoaded') == true) {
                var printElementId = $(this).attr('printElementId');
                GlobalInstance.printElementInstance = GlobalInstance.getPrintElementInstance();
                GlobalInstance.printElementInstance.printElementById(printElementId);
            } else {
                GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_PLEASE_WAIT'), MESSAGES.get('MESSAGE_WAIT_LARGER_MODEL_PREVIEW_LOADING'));
                GlobalInstance.dialogBoxInstance.funcCallBack = null;
            }
        });
        $(document).off('click', "#dvIdLargerView");
        $(document).on('click', "#dvIdLargerView", function () {
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.funcCallBack = function () {
                GlobalInstance.modelLargerViewInstance = GlobalInstance.getModelLargerViewInstance();
                GlobalInstance.modelLargerViewInstance.showPreview();
            };
            GlobalInstance.dialogBoxInstance.funcCallBackForCancel = null;
            GlobalInstance.dialogBoxInstance.displayModelLargerViewDialogBox(TITLE.get('TITLE_LARGER_VIEW'), MESSAGES.get('MESSAGE_LARGER_VIEW'));
            return false;
        });
        $(".close, .closeWindow").click(function () {
            GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
            GlobalInstance.popupInstance.disablePopup();  // function close pop up
        });
    });

    $(document).bind("bindContinueColorButton", function (event, args) {
        $('#dvColorContinueBtn').off('click');
        $('#dvColorContinueBtn').on('click', function () {
            $('#tbFabric').click();
        });
    });

    $(document).bind("bindSpecifyLocationAndSizeButton", function (event, args) {

        $('#aSelectMyLockerGraphics, #aSelectGraphicsSpecifySizeBtn , #aTeamNameSpecifySizeBtn , #aPlayerNumberSpecifySizeBtn , #aPlayerNameSpecifySizeBtn , #aOtherTextSpecifySizeBtn').off('click');
        $(document).on('click', '#aSelectMyLockerGraphics, #aSelectGraphicsSpecifySizeBtn, #aTeamNameSpecifySizeBtn , #aPlayerNumberSpecifySizeBtn , #aPlayerNameSpecifySizeBtn , #aOtherTextSpecifySizeBtn', function () {
            GlobalInstance.anchorPointInstance = GlobalInstance.getAnchorPointInstance();
            var panelId = '';
            switch ($(this).attr('id')) {
                case 'aSelectMyLockerGraphics':
                    GlobalFlags.setScreenFlags('isUploadGraphic', false);
                    GlobalFlags.setScreenFlags('isLocker', true);
                    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
                    GlobalInstance.myLockerInstance = GlobalInstance.getMyLockerInstance();
                    var selectedMyLockerImage = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo();
                    GlobalInstance.myLockerInstance.handleMyLockerEmailPopup();
                    if (GlobalInstance.myLockerInstance.handleMyLockerEmailPopup()) {
                        if (!selectedMyLockerImage || !$.trim(selectedMyLockerImage.src)) {
                            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                            GlobalInstance.dialogBoxInstance.funcCallBack = null;
                            GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(
                                    TITLE.get('TITLE_MY_LOCKER_VALIDATION'),
                                    MESSAGES.get('MESSAGE_MY_LOCKER_VALIDATION')
                                    );

                            return false;
                        }
                    } else {
                        return false;
                    }

                    GlobalInstance.emblemAndGraphicsInstance = GlobalInstance.getEmblemAndGraphicsInstance();
                    GlobalInstance.emblemAndGraphicsInstance.hide();


                    GlobalInstance.myLockerInstance.hide();
                    GlobalInstance.anchorPointInstance.setBackScreenId(GlobalInstance.myLockerInstance);
                    panelId = 'secMyLockerPanel';
                    break;
                case 'aSelectGraphicsSpecifySizeBtn':
                    // check condition and alert
                    if (!Validator.checkNumberAndTextColorsSelected('Graphics')) {
                        return false;
                    }
                    GlobalInstance.emblemAndGraphicsInstance = GlobalInstance.getEmblemAndGraphicsInstance();
                    var graphicLayerCount = GlobalInstance.getUniformConfigurationInstance().getSelectGraphicInfo(GRAPHIC_KEY.GraphicLayerCount);
                    if (graphicLayerCount) {

                    }
                    GlobalInstance.emblemAndGraphicsInstance.hide();
                    GlobalInstance.anchorPointInstance.setBackScreenId(GlobalInstance.emblemAndGraphicsInstance);
                    panelId = 'secEmblemAndGraphicsPanel';
                    break;
                case 'aTeamNameSpecifySizeBtn':
                    // check condition and alert
                    if (!Validator.checkNumberAndTextColorsSelected('TeamName')) {
                        return false;
                    }
                    GlobalInstance.teamNameInstance = GlobalInstance.getTeamNameInstance();
                    GlobalInstance.teamNameInstance.hide();
                    GlobalInstance.anchorPointInstance.setBackScreenId(GlobalInstance.teamNameInstance);
                    panelId = 'secTeamNameAnchorPanel';
                    break;
                case 'aPlayerNumberSpecifySizeBtn':
                    // check condition and alert
                    if (!Validator.checkNumberAndTextColorsSelected('PlayerNumber')) {
                        return false;
                    }
                    GlobalInstance.playerNumberInstance = GlobalInstance.getPlayerNumberInstance();
                    GlobalInstance.playerNumberInstance.hide();
                    GlobalInstance.anchorPointInstance.setBackScreenId(GlobalInstance.playerNumberInstance);
                    panelId = 'secPlayerNumberAnchorPanel';
                    break;
                case 'aPlayerNameSpecifySizeBtn':
                    // check condition and alert
                    if (!Validator.checkNumberAndTextColorsSelected('PlayerName')) {
                        return false;
                    }
                    GlobalInstance.playerNameInstance = GlobalInstance.getPlayerNameInstance();
                    GlobalInstance.playerNameInstance.hide();
                    GlobalInstance.anchorPointInstance.setBackScreenId(GlobalInstance.playerNameInstance);
                    panelId = 'secPlayerNameAnchorPanel';
                    break;
                case 'aOtherTextSpecifySizeBtn':
                    // check condition and alert
                    if (!Validator.checkNumberAndTextColorsSelected('OtherText')) {
                        return false;
                    }
                    GlobalInstance.otherTextInstance = GlobalInstance.getOtherTextInstance();
                    GlobalInstance.otherTextInstance.hide();
                    GlobalInstance.anchorPointInstance.setBackScreenId(GlobalInstance.otherTextInstance);
                    panelId = 'secOtherTextAnchorPanel';
                    break;
            }

            GlobalInstance.numberAndTextInstance = GlobalInstance.getNumberAndTextInstance();
            GlobalInstance.numberAndTextInstance.hide();
            GlobalInstance.anchorPointInstance.hide();
            GlobalInstance.anchorPointInstance.show(panelId);

        });

        $(document).off('click', '#dvIdAnchorPointbackButton');
        $(document).on('click', '#dvIdAnchorPointbackButton', function () {
            var previousScreenInstance = GlobalInstance.anchorPointInstance.getBackScreenId();
            GlobalInstance.myLockerInstance = GlobalInstance.getMyLockerInstance();
            GlobalInstance.uploadGraphicsInstance = GlobalInstance.getUploadGraphicsInstance();
            if (GlobalInstance.anchorPointInstance.currentPanelId == GlobalInstance.anchorPointInstance.emblemAndGraphicsPanel) {
                previousScreenInstance.show();
                GlobalInstance.selectGraphicsInstance.show();
                GlobalInstance.selectGraphicsInstance.showCustomizedGraphicScreen();
            } else if (GlobalInstance.anchorPointInstance.currentPanelId == GlobalInstance.anchorPointInstance.myLockerPanelId) {
                //GlobalInstance.selectGraphicsInstance.show();
                GlobalInstance.emblemGraphicsInstance.show();
                //previousScreenInstance.show();
                GlobalInstance.myLockerInstance.hide();
                GlobalInstance.uploadGraphicsInstance.show();

            } else {
                GlobalInstance.numberAndTextInstance.show();
                previousScreenInstance.show();
            }

            GlobalInstance.anchorPointInstance.hide();
        });

    });

    $(document).bind("showConfigurator", function (event, args) {
        try {
            setTimeout(function () {
                GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
                GlobalInstance.sportsInstance = GlobalInstance.getSportsInstance();

                try {
                    var sportsCategoryList = GlobalInstance.sportsInstance.sportsList;
                    var catagoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
                    if (catagoryInfo.Name == CONFIG.get('BASEBALL_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = false;
                        $('.configuratorPanel').css('background', 'url(images/Baseball_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Baseball_background.png)');
                    } else if (catagoryInfo.Name == CONFIG.get('BASKETBALL_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = true;
                        $('.configuratorPanel').css('background', 'url(images/Basketball_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Basketball_background.png)');
                    } else if (catagoryInfo.Name == CONFIG.get('FANWAER_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = false;
                        $('.configuratorPanel').css('background', 'url(images/Fanwear_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Fanwear_background.png)');
                    } else if (catagoryInfo.Name == CONFIG.get('FOOTBALL_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = true;
                        $('.configuratorPanel').css('background', 'url(images/Football_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Football_background.png)');
                    } else if (catagoryInfo.Name == CONFIG.get('HOCKEY_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = false;
                        $('.configuratorPanel').css('background', 'url(images/Hockey_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Hockey_background.png)');
                    } else if (catagoryInfo.Name == CONFIG.get('LACROSSE_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = true;
                        $('.configuratorPanel').css('background', 'url(images/Lacrosse_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Lacrosse_background.png)');
                    } else if (catagoryInfo.Name == CONFIG.get('SIDELINE_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = false;
                        $('.configuratorPanel').css('background', 'url(images/Sideline_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Sideline_background.png)');
                    } else if (catagoryInfo.Name == CONFIG.get('SOCCER_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = true;
                        $('.configuratorPanel').css('background', 'url(images/Soccer_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Soccer_background.png)');
                    } else if (catagoryInfo.Name == CONFIG.get('SOFTBALL_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = true;
                        $('.configuratorPanel').css('background', 'url(images/Softball_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Softball_background.png)');
                    } else if (catagoryInfo.Name == CONFIG.get('TRACK_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = true;
                        $('.configuratorPanel').css('background', 'url(images/Track_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Track_background.png)');
                    } else if (catagoryInfo.Name == CONFIG.get('VOLLEYBALL_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = false;
                        $('.configuratorPanel').css('background', 'url(images/Volleyball_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Volleyball_background.png)');
                    } else if (catagoryInfo.Name == CONFIG.get('WRESTLING_STRING')) {
                        sportsCategoryList['_' + catagoryInfo.Id].showInfoColorLink = false;
                        $('.configuratorPanel').css('background', 'url(images/Wrestling_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Wrestling_background.png)');
                    } else {
                        $('.configuratorPanel').css('background', 'url(images/Football_background.png)');
                        $('#dvRosterPanel').css('background', 'url(images/Football_background.png)');
                    }
                } catch (err) {
                    if (CONFIG.get('DEBUG') === true) {
                        txt = "Error description app 859: " + err.message + "\n\n";
                        txt += "Error filename: " + err.fileName + "\n\n";
                        txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                        Log.error(txt);
                    }
                }

                GlobalConfigurationData.genderId = GlobalInstance.uniformConfigurationInstance.getGenderInfo().Id;
                GlobalInstance.styleAndDesignInstance = GlobalInstance.getStyleAndDesignInstance();
                GlobalInstance.styleAndDesignInstance.init();
            }, 1000);
        } catch (e) {

        }
    });

    $(document).bind("bindLiveChatButton", function (event, args) {
        $("#dvLiveChat").off('click');
        $("#dvLiveChat").on('click', function () {
            try {
                window.open(CONFIG.get('LIVE_CHAT_URL'), 'chat32520865', 'width=475,height=400,resizable=yes')
            } catch (err) {
                if (CONFIG.get('DEBUG') === true) {
                    txt = "Error description app 882: " + err.message + "\n\n";
                    txt += "Error filename: " + err.fileName + "\n\n";
                    txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                    Log.error(txt);
                }
            }
        });
    });

    $(document).bind("bindHelpButton", function (event, args) {
        $("#idHelpLink, .helpLink").off('click');
        $("#idHelpLink, .helpLink").on('click', function () {
            var accountNumber = Utility.getParameterByName('uid');
            var helppath = '';
            if (accountNumber != '') {
                helppath = CONFIG.get('DEALER_HELP_URL');
            }
            else {
                helppath = CONFIG.get('CONSUMER_HELP_URL');
            }

            window.open(helppath, 'help', 'height=560,width=815,toolbar=no,scrollbars=yes,resizable=yes,left=100,top=80');
        });
    });

    $(document).bind("bindStartOverButton", function (event, args) {
        $(document).off('click', '.startover');
        $(document).on('click', '.startover', function () {
            var locationHref = window.location.href;
            locationHref = locationHref.replace("#", '');
            locationHref = locationHref.replace("&start=1", '');

            window.location.href = locationHref + "&start=1";
        });
    });

    $(document).bind("hideSplashScreen", function (event, args) {
        //hide the splash screen
        setTimeout(function () {
            $(document).trigger("hideCustomizeButtons");
            $('#dvMainContainer').css('top', '');
            $('#dvMainContainer').css('position', 'static');

            //hide the splash screen
            setTimeout(function () {
                $('.loaderImage').hide();
            }, 100);
        }, 2000);

        //load all the images in background
        var containerId = 'dvMainContainer';
        if (args && args.containerId) {
            containerId = args.containerId;
        }
        $('#' + containerId).waitForImages({
            waitForAll: false,
            finished: function () {
            }
        });
    });

    $(document).bind("hideCustomizeButtons", function (event, args) {
        if (!objApp.allowCustomization) {
            $('#modifyUniformFromProof').remove();
            $('.approveLater').remove();
            $('.createUniform').remove();
            $('.startover').remove();
            $('.mdifyButtonRoster').remove();
            $('#dvIdGoShoppingCartRedirect').css('margin-left', '61px');
            $('#dvViewShoppingCart').css('top', '20px');
        } else {
            $('#dvViewShoppingCart').css('top', '49px');
        }
    });

    //handle the page landing completion events
    $(document).bind("PageLanded", function (event, args) {
        var requiredLandingPage = objApp.landingPage;

        if (objApp.isStartOver == 1) {
            $(document).unbind("PageLanded");
            $(document).trigger("hideSplashScreen");
            return;
        }

        if (args == CONFIG.get('LANDING_PAGE_STYLE_DESIGN')) {
            if (requiredLandingPage != null && (requiredLandingPage == CONFIG.get('LANDING_PAGE_ROSTER') || requiredLandingPage == CONFIG.get('LANDING_PAGE_PROOF'))) {
                $('#dvTabCustomize').click();
                $('#tbFabric').click();
            }
        }
        else if (args == CONFIG.get('LANDING_PAGE_FABRIC')) {
            if (requiredLandingPage != null && (requiredLandingPage == CONFIG.get('LANDING_PAGE_ROSTER') || requiredLandingPage == CONFIG.get('LANDING_PAGE_PROOF'))) {
                if ($('.cartSelectedFabricLabel').is(':visible') && $('#dvIdFabricSelected').is(':visible')) {
                    $(".ui-dialog-content").dialog("close");
                    GlobalInstance.anchorPointInstance = GlobalInstance.getAnchorPointInstance();
                    if (GlobalFlags.getScreenFlags('isAnchorPointDataRecieved') == true) {
                        $("#dvGoToRosterBtn").click();
                    } else {
                        GlobalInstance.anchorPointInstance.callbackMethod = function () {
                            $("#dvGoToRosterBtn").click();
                        };
                    }
                }
            }
        }
        else if (args == CONFIG.get('LANDING_PAGE_ROSTER')) {

            if (requiredLandingPage != null && requiredLandingPage == CONFIG.get('LANDING_PAGE_PROOF')) {
                $('#dvProofRosterPlayer').click();
            }
        }
        else if (args == CONFIG.get('LANDING_PAGE_PROOF')) {

        }
        //if to be landing page is equals to landed page, unbind the event.
        if (requiredLandingPage == args) {
            $(document).unbind("PageLanded");
            $(document).trigger("hideSplashScreen");

        }
        $(document).trigger("hideCustomizeButtons");

    });

    $(document).bind("loadColorDependent", function (event, args) {

        $.loadPage("secNumberAndTextPanel", null, true, false, function () {
            $.loadPage("secPlayerName", null, true, false, function () {
                GlobalInstance.playerNameInstance = GlobalInstance.getPlayerNameInstance();
                GlobalInstance.playerNameInstance.init();

            });

            $.loadPage("secPlayerNumber", null, true, false, function () {
                GlobalInstance.playerNumberInstance = GlobalInstance.getPlayerNumberInstance();
                GlobalInstance.playerNumberInstance.init();

            });

            $.loadPage("secTeamName", null, true, false, function () {
                GlobalInstance.teamNameInstance = GlobalInstance.getTeamNameInstance();
                GlobalInstance.teamNameInstance.init();
            });

            $.loadPage("secOtherText", null, true, false, function () {
                GlobalInstance.otherTextInstance = GlobalInstance.getOtherTextInstance();
                GlobalInstance.otherTextInstance.init();
            });

            //load Player Name anchor point selection panel
            $.loadPage("secAnchorPanel", null, true, false, function () {
                //trigger button inding event
                $(document).trigger("bindSpecifyLocationAndSizeButton", null);
            });

            //load upload validate succeess and fail popup
            $.loadPage("dvUploadGraphicsSuccessPopup", null, true, false, function () {
            });

            $.loadPage("dvUploadGraphicsFailPopup", null, true, false, function () {
            });

            /*/load Player Number anchor point selection panel
             $.loadPage("secPlayerNumberAnchorPanel", null, true, false);
             
             //load Team Name anchor point selection panel
             $.loadPage("secTeamNameAnchorPanel", null, true, false);
             
             //load Other Text anchor point selection panel
             $.loadPage("secOtherTextAnchorPanel", null, true, false);*/

            GlobalInstance.loadConfigurationInstance = GlobalInstance.getLoadConfigurationInstance();
            if (GlobalInstance.loadConfigurationInstance.isLoaded()) {
                $(document).trigger("showConfigurator", null);
            }

            $.loadPage("secEmblemAndGraphicsPanel", null, true, false, function () {
                $.loadPage("secConfiguratorSelectGraphics", null, true, false, function () {
                    GlobalInstance.selectGraphicsInstance = GlobalInstance.getSelectGraphicsInstance();
                    GlobalInstance.selectGraphicsInstance.init();
                });
                $.loadPage("secConfiguratorUploadGraphics", null, true, false);
                $.loadPage("secConfiguratorMyLocker", null, true, false, function () {
                    GlobalInstance.myLockerInstance = GlobalInstance.getMyLockerInstance();
                    GlobalInstance.myLockerInstance.init();
                });
                $.loadPage("secCustomizeGraphics", null, true, false);
            });
        });
    });

};
var currentMousePos = { x: -1, y: -1 };
jQuery(document).ready(function () {

    var loadingDiv = $('#loading');

    $(document).mousemove(function (event) {
        currentMousePos.x = event.pageX;
        currentMousePos.y = event.pageY;
        if (loadingDiv.css("opacity") > 0) {
            loadingDiv.css({ 'top': currentMousePos.y - 20, 'left': currentMousePos.x + 5, 'position': 'absolute' });
        }
    });
});

/**
 * Handle checkbox  for IE
 * 
 * 
 * @return void
 */
function handleCheckBoxChange(checkboxObj) {
    var labelObject = $("label[for='" + checkboxObj.attr('id') + "']");
    if (checkboxObj.is(':checked')) {
        labelObject.attr('style', 'background-position:0 -15px;');
    } else {
        labelObject.attr('style', 'background-position:0 0px;');
    }
}

App.prototype.visitMyLocker = function() {
    GlobalInstance.getUniformConfigurationInstance().setSkipAlertStatus(true);
};


