/**
 * TWA proshpere configurator
 * 
 * duallaunch.js is used to maintain app related functions;
 *
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 * 
 * @return void
 */

function DualLaunch() {
    this.dvIdLeftSideData = 'dvLeftSideData';
    this.dvIdRightSideData = 'dvRightSideData';
    this.dvIdBenifits = 'dvBenifits';
    this.isNewDealer = objApp ? objApp.isNewDealer : CONFIG.get('NEW_DEALER');
    this.userType = objApp ? objApp.userType:CONFIG.get('USER_TYPE_CUSTOMER');
    this.prospherePlusEmailUrl = WEB_SERVICE_URL.get('GET_PROSPHERE_PLUS_URL', LOCAL);
    this.responseType = 'json';
    this.objCommHelper = new CommunicationHelper();
    this.objUtility = new Utility();
    this.msgCount = 'Maximum ' + CONFIG.get('PRO_PLUS_MESSAGE_LIMIT_COUNT') + ' characters';
}

/**
*This method initializes the class
*
*/
DualLaunch.prototype.init = function () {
    this.showNoThanksLink();
    this.bindScreenEvents();
}
/**
 * Binding the related Screen events.
 * Bind events for NoThanks Confirmation Popup, getstarted Popup, Right bottom banner  
 * 
 * @returns void
 */
DualLaunch.prototype.bindScreenEvents = function () {
    if ($.trim(this.userType.toLowerCase()) == $.trim(CONFIG.get('USER_TYPE_CUSTOMER').toLowerCase())) {
        $('#advLandingPagePromoImg, .landingPagePromo').css('cursor', 'default');
        return false;
    } else {
        $('#advLandingPagePromoImg').css('cursor', 'pointer');
        $('.landingPagePromo').css('cursor', 'pointer');
        var thisObject = this;
        var limitedCharacters = '';
        var strLength = 0;

        //binds the PromoBannerLink(No Thanks Button)
        $(document).off('click', '#aConfirmationProPopup');
        $(document).on('click', '#aConfirmationProPopup', function () {
            GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
            GlobalInstance.googleAnalyticsUtilInstance.trackPsPlusConfirmationBtnClicks();
            thisObject.showConfirmationPopup();
        });

        $(document).on('blur', '#txtMSGProPlus', function () {
            if ($.trim($(this).val()) == '') {
                $('#dvMsgRemainingCount').html(thisObject.msgCount);
            }
        });

        //binds the rightBottomBanner
        $(document).off('click', '#advLandingPagePromoImg');
        $(document).on('click', '#advLandingPagePromoImg', function () {
            GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
            GlobalInstance.googleAnalyticsUtilInstance.trackPsPlusBannerClicks();
            thisObject.showProspherePlusDialog();
        });

        //binds the popUpButtons of confirmationPopup
        $(document).bind("popUpButtons", function (event, args) {

            //Handles the click event of no button of Confirmation Popup
            $("#dvNoProPlus").off("click");
            $("#dvNoProPlus").click(function () {
                GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
                GlobalInstance.googleAnalyticsUtilInstance.trackPsPlusConfirmationNOClicks();
                $("#dvConfirmationpopup").hide();
                $('#blanket').hide();
                $('#dvBackgroundPopup').hide();
                GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
                GlobalInstance.popupInstance.disablePopup();
            });
        });

        $(document).bind("popUpButtons", function (event, args) {

            //Handles the click event of no button of Confirmation Popup
            $("#aYesProPlus").off("click");
            $("#aYesProPlus").click(function () {
                GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
                GlobalInstance.googleAnalyticsUtilInstance.trackPsPlusConfirmationYesClicks();
                thisObject.visitLegacyConfiguator();
                if ($.trim(objApp.legacyConfiguratorUrl) != '') {
                    $('#aYesProPlus').attr('href', objApp.legacyConfiguratorUrl);
                } else {
                    GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                    GlobalInstance.dialogBoxInstance.displayErrorMessageDialogBox(TITLE.get('TITLE_ERROR'), MESSAGES.get('MESSAGE_REQUIRED_LEGACY_URL'));
                }

            });
        });

        //binds the SendMessage Button
        $(document).bind("sendMessageProPlus", function (event, args) {
            $("#aSendMsgProPlus").off("click");
            $("#aSendMsgProPlus").click(function () {
                $("#dvMsgConfirmationProPlusPopup").hide();
                var isValidForm = thisObject.validateProspherePlusForm();
                var textAreatoCalculate = $("#txtMSGProPlus");

                var maxChars = textAreatoCalculate.maxLengh;

                if (isValidForm) {
                    $('#dvContainer').addClass('disableElement');
                    var name = $.trim($("#txtNameProPlus").val());
                    var contactNumber = $.trim($("#txtContactProPlus").val());
                    var emailAddress = $.trim($("#txtEmailProPlus").val());
                    var message = $.trim($("#txtMSGProPlus").val());
                    var accountNumber = $.trim($("#txtAccountProPlus").val());

                    thisObject.sendEmailMessage(name, contactNumber, emailAddress, message, accountNumber);
                }
            });
        });
    }
};

/**
*
*This method calls the popup to ensure user's confirmation
*
*/
DualLaunch.prototype.showNoThanksLink = function () {
    this.isNewDealer = Boolean(this.isNewDealer);
    if (this.isNewDealer == false && this.userType == CONFIG.get('USER_TYPE_DEALER')) {
        //show the no thanks link
        $('#aConfirmationProPopup').show();
    }else{
        //hide the no thanks link
        $('#aConfirmationProPopup').hide();
    }
}

DualLaunch.prototype.updateMaximumLimitMessage = function (maxLength, textBox) {
    try {
        var remainingCount = maxLength - textBox.value.length;
        if(remainingCount > 0){
            $('#dvMsgRemainingCount').html('Maximum ' + maxLength + ' characters ( ' + (maxLength - textBox.value.length) + ' remaining )');
        }else 
        {
            $('#dvMsgRemainingCount').html('Maximum ' + maxLength + ' characters ( <span class="redText">' + (maxLength - textBox.value.length) + '</span> remaining )');        
        }
    } catch (e) {
        console.log(e.message);
    }
}; 
/**
*
*This method displays the confirmation Popup
*
*/
DualLaunch.prototype.showConfirmationPopup = function () {
    var thisObject = this;
    $.loadPage('dvConfirmationPopUPtoJump', null, true, false, function () {
        
        
        GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
        GlobalInstance.popupInstance.loading();
        $('#blanket').show();
        GlobalInstance.popupInstance.loadPopup('dvConfirmationpopup');
        thisObject.getPopupTextContent();
        $(document).trigger("popUpButtons", null);
    });

   
}


/**
*
*This Method reteives the configurable content of Confirmation popup
*
*/
DualLaunch.prototype.getPopupTextContent = function () {
    var rightDivPopupData = CONFIG.get('SUPPORTED_NEW_FEATURES');
    var designHtml = '<ul>'
    var designrightdivHtml = '<ul>'
    var i='';
  
    for (i = 0; i < (rightDivPopupData.length/2); i++) {
        designHtml += '<li>' + rightDivPopupData[i]
        designHtml += '</li>'

    }

    for (var j = i; j < rightDivPopupData.length; j++) {
        designrightdivHtml += '<li>' + rightDivPopupData[j]
        designrightdivHtml += '</li>'

    }
    designHtml += '</ul>';
    designrightdivHtml +='</ul>';
    $('#' + this.dvIdLeftSideData).html(designHtml);
    $('#' + this.dvIdRightSideData).html(designrightdivHtml);
   
}

/**
*
*This Method validates the Prosphere Model Plus Form
*
*return{boolean Value}
*/
DualLaunch.prototype.validateProspherePlusForm = function () {

    var thisObject = this;
    var nameInfo = $("#txtNameProPlus");
    var sendToEmail = $("#txtEmailProPlus");
    var contactInfo = $("#txtContactProPlus");
    var msgInfo = $("#txtMSGProPlus");
    var accountInfo = $("#txtAccountProPlus");
    
    //Labels to store ids
    var errorName = $("#lblName");
    var errorEmail = $("#lblEmailInfo");
    var errorContact = $("#lblContactInfo");
    var errorAccount = $("#lblAccountInfo");
    var errorMsg = $("#lblMsgInfo");


    nameInfo.removeClass('error');
    sendToEmail.removeClass('error');
    msgInfo.removeClass('error');
    contactInfo.removeClass('error');
    accountInfo.removeClass('error');

    //labels

    errorName.removeClass('errorLabel');
    errorEmail.removeClass('errorLabel');
    errorContact.removeClass('errorLabel');
    errorAccount.removeClass('errorLabel');
    errorMsg.removeClass('errorLabel');

    $('#spNameError, #spEmailInfoError, #spContactInfoError, #spMsgError, #spAccountInfoError').hide();
    
    var isValid = true;
    if (Utility.checkFieldEmpty('txtNameProPlus')) {
        nameInfo.addClass('error');
        errorName.addClass('errorLabel');
        var nameInforError = MESSAGES.get("MESSAGE_REQUIRED_FIELD_NAME");
        $('#spNameError').html(nameInforError).show();
        isValid = false;

    }

    if (Utility.checkFieldEmpty('txtEmailProPlus')) {
        sendToEmail.addClass('error');
        errorEmail.addClass('errorLabel');
        var emailError = MESSAGES.get("MESSAGE_REQUIRED_FIELD_EMAIL");
        $('#spEmailInfoError').html(emailError).show();
        isValid = false;

    }
    else if (!Utility.checkValidEmail("txtEmailProPlus")) {
        sendToEmail.addClass('error');
        errorEmail.addClass('errorLabel');
        var emailError = MESSAGES.get("MESSAGE_INVALID_EMAIL_PROPLUS");
        $('#spEmailInfoError').html(emailError).show();
        isValid = false;
    }

    if (Utility.checkFieldEmpty('txtContactProPlus')) {
        contactInfo.addClass('error');
        errorContact.addClass('errorLabel');
        var contactInfoError = MESSAGES.get("MESSAGE_REQUIRED_FIELD_CONTACT");
        $('#spContactInfoError').html(contactInfoError).show();
    }
    else if (!Utility.isPhoneNumberValid('txtContactProPlus')) {
        contactInfo.addClass('error');
        errorContact.addClass('errorLabel');
        var contactInfoError = MESSAGES.get("MESSAGE_INVALID_CONTACT_NUMEBR_PROPLUS");
        $('#spContactInfoError').html(contactInfoError).show();
        isValid = false;
    }
  /*    
    if (Utility.checkFieldEmpty('txtAccountProPlus')) {
        accountInfo.addClass('error');
        errorAccount.addClass('errorLabel');
        var nameInforError = MESSAGES.get("MESSAGE_REQUIRED_FIELD_ACCOUNT");
        $('#spAccountInfoError').html(nameInforError).show();
        isValid = false;

    }*/
    if (Utility.checkFieldEmpty('txtMSGProPlus')) {
        msgInfo.addClass('error');
        errorMsg.addClass('errorLabel');
        var msgInfoError = MESSAGES.get("MESSAGE_REQUIRED_FIELD_MSG");
        $('#spMsgError').html(msgInfoError).show();
        isValid = false;
    }
        
    return isValid;
}

/**
*
*This method displays the Prosphere Plus popup
*
*/

DualLaunch.prototype.showProspherePlusDialog = function () {
    var thisObject = this;
    var sendToEmail = $("#txtEmailProPlus");
    var contactInfo = $("#txtContactProPlus");
    
    var nameInfo = $("#txtNameProPlus");
    var msgInfo = $("#txtMSGProPlus");
    var accountInfo = $("#txtAccountProPlus");
    
    // Labels
    var errorName = $("#lblName");
    var errorEmail = $("#lblEmailInfo");
    var errorContact = $("#lblContactInfo");
    var errorAccount = $("#lblAccountInfo");
    var errorMsg = $("#lblMsgInfo");


  
    $.loadPage('dvProspherePlusBanner', null, true, false, function () {
        $('#aPinterest').attr('href', CONFIG.get('PINTEREST_URL'));
        $('#aPinterestTextLink').attr('href', CONFIG.get('PINTEREST_URL'));
        GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
        GlobalInstance.popupInstance.loading();
        $('#blanket').show();
        GlobalInstance.popupInstance.loadPopup('dvprospherePlusPopup');
        $('#dvPropPlusform').find("input[type=text], textarea").val("");
        $("#spLiveChatNumber").html(CONFIG.get('LIVE_CHAT_CONTACT_NUMBER'));
        $('#dvMsgRemainingCount').html(thisObject.msgCount);
        //.css("margin-right", "152px")
        //margin-right: 45px
        
        //Configurable Text
        var configurableBenifits = CONFIG.get('SUPPORTED_BENIFITS');
        var benifitsDesignHtml = '<ul>'
        var i = '';

        for (i = 0; i <configurableBenifits.length  ; i++) {
            benifitsDesignHtml += '<li>' + configurableBenifits[i]
            benifitsDesignHtml += '</li>'

        }
        benifitsDesignHtml += '</ul>';
        $('#' + thisObject.dvIdBenifits).html(benifitsDesignHtml);
        
        //Removes the error class from the labels
        errorName.removeClass('errorLabel');
        errorEmail.removeClass('errorLabel');
        errorContact.removeClass('errorLabel');
        errorAccount.removeClass('errorLabel');
        errorMsg.removeClass('errorLabel');

        msgInfo.removeClass('error');
        nameInfo.removeClass('error')
        sendToEmail.removeClass('error');
        contactInfo.removeClass('error');
        accountInfo.removeClass('error');


        $("#dvliveChatProspherePlus").off("click");
        $("#dvliveChatProspherePlus").click(function () {
            window.open(CONFIG.get('PRO_PLUS_LIVE_CHAT_URL'), 'Chat Window', 'width=475,height=400,resizable=yes')
        });
        $("#dvcloseImg").off("click");
        $("#dvcloseImg").click(function () {
            $("#dvprospherePlusPopup").hide();

            $('#blanket').hide();
            $('#dvBackgroundPopup').hide();
            GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
            GlobalInstance.popupInstance.disablePopup();
           // $("#aGetStarted").off('click');
        });

        $('#spContactInfoError').hide();
        $('#spEmailInfoError').hide();
        $('#spNameError').hide();
        $('#spMsgError').hide();
        $('#spAccountInfoError').hide();


        $(document).trigger("sendMessageProPlus", null);
        $("#dvMsgConfirmationProPlusPopup").hide();

    });
    
};

/**
*
*This method sends the message
*
*/
DualLaunch.prototype.sendEmailMessage = function (name, contactNumber, emailAddress, message, accountNumber) {
    var emailType = CONFIG.get("PRO_PLUS_EMAIL_TYPE");
    $.startProcess(true);
    var params = {
        name:name,
        phoneNumber:contactNumber,
        emailId:emailAddress,
        message: message,
        emailType: emailType,
        accountNumber:accountNumber
    };

    this.objCommHelper.callAjax(this.prospherePlusEmailUrl, 'POST', JSON.stringify(params), this.responseType, 
        null, this.handleEmailApiResponse.bind(this), null, null, null, null, null);
    
};
    // If message has been sent
    
DualLaunch.prototype.handleEmailApiResponse = function (response) {
    try {
        var emailResponseMessage = '';
        if (this.objUtility.validateResponseFormat(response, this.prospherePlusEmailUrl)) {
            $('#dvMsgRemainingCount').html(this.msgCount);
            $.doneProcess();
            $('#dvContainer').removeClass('disableElement');
            //Successfully Email Sent
            if (response.ResponseData.emailSent == CONFIG.get("PRO_PLUS_EMAIL_SENT_SUCCESS")) {
                $('#dvPropPlusform').find("input[type=text], textarea").val("");
                $("#dvMsgConfirmationProPlusPopup").css("color", "green").css("border", "1px solid green").html(MESSAGES.get("MESSAGE_PROSPHERE_PLUS_SUCCESS")).show();
            } else {
                
                $("#dvMsgConfirmationProPlusPopup").css("color", "red").css("border", "1px solid red").html(MESSAGES.get("MESSAGE_PROSPHERE_PLUS_FAILURE")).show();
                $.doneProcess();
                $('#dvContainer').removeClass('disableElement');
            }
        }
        else {
            $("#dvMsgConfirmationProPlusPopup").css("color", "red").css("border", "1px solid red").html(MESSAGES.get("MESSAGE_PROSPHERE_PLUS_FAILURE")).show();
            $.doneProcess();
            $('#dvContainer').removeClass('disableElement');
        }
       

    } catch (err) {
        $.doneProcess();
        $('#dvContainer').removeClass('disableElement');
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};



DualLaunch.prototype.visitLegacyConfiguator = function () {
    GlobalInstance.getUniformConfigurationInstance().setSkipAlertStatus(true);
};