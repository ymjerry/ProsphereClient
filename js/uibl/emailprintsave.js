/**
 * TWA proshpere configurator
 * 
 * emailprintsave.js used to email, save, print for configurator
 * 
 * TWA proshpere configurator
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 * 
 * @return void
 */
function EmailPrintSave() {
    // Uniform Configuration Global Instance
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    // get value from uniform configuration object 
    this.orderName = GlobalInstance.uniformConfigurationInstance.getOrderName();
    this.myEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('email');
    this.fromEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('formEmail');
    this.sendToEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('sendToEmail');
    this.retrieveCode = GlobalInstance.uniformConfigurationInstance.getRetrieveCode();
}
;
/**
 * Used to handle email functionality. 
 * set the data in uniform configuration Object and display the message dialog box
 * 
 * @param orderName Name of the Order
 * @param  fromEmail Sender's Email
 * @param  sendToEmail Receiver's Email
 * @returns {Boolean}
 */
EmailPrintSave.prototype.emailOrder = function(orderName, fromEmail, sendToEmail) {
    this.orderName = (orderName && orderName != '') ? orderName : this.orderName;
    this.fromEmail = (this.myEmail && this.myEmail != '') ? this.myEmail : fromEmail;
    this.sendToEmail = (this.sendToEmail != null) ? this.sendToEmail : sendToEmail;
    this.myEmail = (this.myEmail && this.myEmail != '') ? this.myEmail : fromEmail;

    //set value in uniformConfiguration        
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    GlobalInstance.uniformConfigurationInstance.setOrderName(this.orderName);
    GlobalInstance.uniformConfigurationInstance.setUserInfo('email', this.fromEmail);
    
    /***  Do not delete this code - r *********/
    //var info = GlobalInstance.uniformConfigurationInstance.sessionInformation;
    //if (info.DealerId != "" && info.DealerId != undefined) {
        GlobalInstance.uniformConfigurationInstance.setUserInfo('fromEmail', this.fromEmail);
    //} else {
      //  GlobalInstance.uniformConfigurationInstance.setUserInfo('fromEmail', '');
    //}
    GlobalInstance.uniformConfigurationInstance.setUserInfo('sendToEmail', this.sendToEmail);
    GlobalInstance.saveConfigInstance = GlobalInstance.getSaveConfigurationInstance();
    GlobalInstance.saveConfigInstance.isMailEvent = true;
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    GlobalInstance.uniformConfigurationInstance.setCallType('EMAIL');
    GlobalInstance.saveConfigInstance.saveUniformConfigurationData();
    return true;
};
/**
 * Used to save configurator order.
 * set the user data in uniform configuration object and call web server API.
 * 
 * @param  orderName Name of the order to be placed
 * @param myEmail  Email to save the order
 * @returns {Boolean}
 */
EmailPrintSave.prototype.saveOrder = function(orderName, myEmail) {
    this.orderName = (orderName && orderName  != '') ? orderName : this.orderName;
    this.myEmail = (this.myEmail && this.myEmail != '') ? this.myEmail : myEmail;

    //set value in uniform Configuration object       
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    GlobalInstance.uniformConfigurationInstance.setOrderName(this.orderName);
    var userId = GlobalInstance.uniformConfigurationInstance.getUserId();
    if (userId != '' && userId != null) {
        GlobalInstance.uniformConfigurationInstance.setUserInfo('type', 'dealer');
        GlobalInstance.uniformConfigurationInstance.setUserInfo('id', userId);
    }
    if (this.myEmail) {
        GlobalInstance.uniformConfigurationInstance.setUserInfo('email', this.myEmail);
    }
    // Call web server API to save configurator data.    
    GlobalInstance.saveConfigInstance = GlobalInstance.getSaveConfigurationInstance();
    GlobalInstance.saveConfigInstance.isSaveEvent = true;
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    GlobalInstance.uniformConfigurationInstance.setCallType('SAVE');
    GlobalInstance.saveConfigInstance.saveUniformConfigurationData();
    var isRoster = Validator.getIsRosterSelected();
    if (isRoster) {
        GlobalInstance.rosterInstance = GlobalInstance.getRosterInstance();
        GlobalInstance.rosterInstance.displayRosterOrderName();
    }
    return true;
};
/**
 * Binding the related Screen events.
 * Bind events for email, save to display to display box to get user input.  
 * 
 * @returns {void}
 */
EmailPrintSave.prototype.bindScreenButtons = function() {
    $("#aIdEmailOrder, #dvIdSaveOrder, #dvIdPrintOrder,#imgEmailOrder,#idImgSaveOrder, .emailOrder, .saveOrder ,.saveImg, .emailImg ,.printImg").off('click');
    var currentStyle;
    var styleFabrics;
    var fabricLength;
    var thisObject = this;
    // Email event to display user input dialog box with validation check
    $(document).on("click","#aIdEmailOrder, .emailOrder ,.emailImg", function() {
        allFields.removeClass("error");
        // make blank by default
        //$(".labelEemailSaveOrderPopup").css("display","none");
        //$("#emailMyEmail").hide();
        
        $('#emailOrderName').val('');
        $('#emailMyEmail').val('');
        $('#sendToEmail').val('');
        currentStyle = GlobalInstance.getUniformConfigurationInstance().getStylesInfo();
        styleFabrics = GlobalInstance.getFabricInstance().getFabricByStyleId(currentStyle.StyleId);
        fabricLength = Utility.getObjectlength(styleFabrics,'empsjs119');
        // check color and fabric slected or not and display error dialog box.

        if ((($('.cartSelectedFabricLabel').is(':visible') && $('#dvIdFabricSelected').is(':visible')) || $('#dvViewRosterFabImg').is(':visible')) && Validator.isColorSelected()) { 
            var isRoster = Validator.getIsRosterSelected();
            if (isRoster && !GlobalInstance.rosterInstance.validateRoster()) {
                return false;
            }
            //Get saved email related value from unifrom configuration object 
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            // get order Name value 
            var uniformOrderName = GlobalInstance.uniformConfigurationInstance.getOrderName();
            // get email value
            var uniformMyEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('email');
            //if order name and email already in object hide related input box 
            if (uniformOrderName == undefined || uniformOrderName == null || uniformOrderName == '') {
                $("#dvIdEmailOrderName").show();
            } else {
                $("#dvIdEmailOrderName").hide();
            }
            if (uniformMyEmail == undefined || uniformMyEmail == null || uniformMyEmail == '') {
                //$("#dvIdEmailMyEmail").show();
                $("#dvIdEmailError").show();
            } else {
                $("#dvIdEmailError").hide();
                //$("#dvIdEmailMyEmail").hide();
            }
            // display user input dialog box
            GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
            GlobalInstance.popupInstance.loading(); // loading
            setTimeout(function() { // then show popup, deley in .5 second
                $('#blanket').show();
                GlobalInstance.popupInstance.loadPopup('dvIdEmailUniformDialogForm');
                // function show popup 
                $('#dvIdEmailUniformDialogForm').draggable({
                    containment: '#dvConfiguratorPanel',
                    cancel: "#imgCancelEmailOrder,#imgEmailOrder,#emailOrderName,#emailMyEmail,#sendToEmail"
                });
            }, 500); // .5 second
        } else {
            // Display validation Dialog Box
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.funcCallBack = null;
            GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_SAVE_VALIDATION'), MESSAGES.get('MESSAGE_SAVE_VALIDATION'));
        }
        return false;
    });
    // Email event to display user input dialog box with validation check
    $(".saveImg").on('click', function() {
        allFields.removeClass('error');
        // make black by default
        $('#orderName').val('');
        $('#myEmail').val('');
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var uniformOrderName = GlobalInstance.uniformConfigurationInstance.getOrderName();
        var uniformMyEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('email');
        currentStyle = GlobalInstance.getUniformConfigurationInstance().getStylesInfo();
        styleFabrics = GlobalInstance.getFabricInstance().getFabricByStyleId(currentStyle.StyleId);
        fabricLength = Utility.getObjectlength(styleFabrics,'empsjs177');
        var retrieveCode = GlobalInstance.uniformConfigurationInstance.getRetrieveCode();
        //if order name and email already in object hide related input box 
        if ((uniformOrderName == undefined || uniformOrderName == null || uniformOrderName == '')
                || (uniformMyEmail == undefined || uniformMyEmail == null || uniformMyEmail == '')) {
            if ((($('.cartSelectedFabricLabel').is(':visible') && $('#dvIdFabricSelected').is(':visible')) || $('#dvViewRosterFabImg').is(':visible')) && Validator.isColorSelected()) {
                var isRoster = Validator.getIsRosterSelected();
                if (isRoster && !GlobalInstance.rosterInstance.validateRoster()) {
                    return false;
                }

                //if order name and email already in object hide related input box 
                if (uniformOrderName == undefined || uniformOrderName == null || uniformOrderName == '') {
                    $("#dvIdOrderName").show();
                } else {
                    $("#dvIdOrderName").hide();
                    $('#orderName').val(uniformOrderName);
                }
                if (uniformMyEmail == undefined || uniformMyEmail == null || uniformMyEmail == '') {
                    $("#dvIdMyEmail").show();
                } else {
                    $("#dvIdMyEmail").hide();
                    $('#myEmail').val(uniformMyEmail);
                }

                GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
                GlobalInstance.popupInstance.loading(); // loading
                setTimeout(function() { // then show popup, deley in .5 second
                    $('#blanket').show();
                    GlobalInstance.popupInstance.loadPopup('dvIdSaveUniformDialogForm'); // function show popup 
                    $('#dvIdSaveUniformDialogForm').draggable({
                        containment: '#dvConfiguratorPanel',
                        cancel: "#imgCancelOrder,#idImgSaveOrder,#orderName,#myEmail"
                    });
                }, 500);
            } else {
                // Validation Dialog Box.
                GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                GlobalInstance.dialogBoxInstance.funcCallBack = null;
                GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_SAVE_VALIDATION'), MESSAGES.get('MESSAGE_SAVE_VALIDATION'));
            }
        } else {
            // if Roster Screen is set then go to roster save functionality else configurator save
            var isRoster = Validator.getIsRosterSelected();
            if (isRoster) {
                GlobalInstance.rosterInstance = GlobalInstance.getRosterInstance();
                if (GlobalInstance.rosterInstance.validateRoster()) {
                    GlobalInstance.rosterInstance.saveRoster();
                }
            }

            var dealerId = GlobalInstance.uniformConfigurationInstance.getUserId();
            GlobalInstance.saveConfigurationInstance = GlobalInstance.getSaveConfigurationInstance();
            if (retrieveCode !== '' && dealerId && objApp.sessionResponseData.UserType == CONFIG.get('USER_TYPE_DEALER')) {
                //Show the Dialog box for override the retrieval code
                GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                GlobalInstance.dialogBoxInstance.funcCallBack = function() {
                    GlobalInstance.saveConfigurationInstance.IsOverwrite = true;
                    GlobalInstance.getEmailPrintSaveInstance().saveOrder(uniformOrderName, uniformMyEmail);
                };
                GlobalInstance.dialogBoxInstance.funcCallBackForCancel = function() {
                    GlobalInstance.saveConfigurationInstance.IsOverwrite = false;
                    GlobalInstance.getEmailPrintSaveInstance().saveOrder(uniformOrderName, uniformMyEmail);
                };
                GlobalInstance.dialogBoxInstance.displayOverrideRetrievalDialogBox(TITLE.get('TITLE_OVERRRIDE_RETRIEVAL_CODE'), MESSAGES.get('MESSAGE_OVERRIDE_RETRIEVAL_CODE'));
            } else {
                GlobalInstance.saveConfigurationInstance.IsOverwrite = false;
                GlobalInstance.getEmailPrintSaveInstance().saveOrder(uniformOrderName, uniformMyEmail);
            }
        }
    });
    $("#dvIdPrintOrder").on('click', function() {
        if ($('.cartSelectedFabricLabel').is(':visible') && $('#dvIdFabricSelected').is(':visible') && Validator.isColorSelected()) {
            GlobalInstance.printInstance = GlobalInstance.getPrintInstance();
            GlobalInstance.printInstance.showPrintreview();
        } else
        {
            // Validation dialogbox .Display Dialog Box.
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.funcCallBack = null;
            GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_SAVE_VALIDATION'), MESSAGES.get('MESSAGE_SAVE_VALIDATION'));
        }
    });
    //Handles the click Event of button in roster screen
    $("#printRoaster").on('click', function() {
        GlobalInstance.printInstance = GlobalInstance.getPrintInstance();
        GlobalInstance.printInstance.showPrintreview();
        return false;
    });
    /*****************************************************/
    // set object 
    var orderName = $("#orderName"),
            myEmail = $("#myEmail"),
            emailOrderName = $("#emailOrderName"),
            emailMyEmail = $("#emailMyEmail"),
            sendToEmail = $("#sendToEmail"),
            allFields = $([]).add(orderName).add(myEmail).add(emailOrderName).add(emailMyEmail).add(sendToEmail);
    // user input box email button event used to validate user input and go to set uniform configuration object 
    $("#imgEmailOrder").on('click', function() {
        allFields.removeClass("error");
        // input validation

        var bValid = true;
        if (bValid && (Utility.checkFieldEmpty("emailOrderName") && $('#emailOrderName').is(':visible'))) {
            bValid = false;
            emailOrderName.addClass('error');
        }

        if (bValid && $('#emailMyEmail').is(':visible') && (Utility.checkFieldEmpty("emailMyEmail") || !Utility.checkValidEmail("emailMyEmail"))) {
            bValid = false;
            emailMyEmail.addClass('error');
        }
        if (bValid && (Utility.checkFieldEmpty("sendToEmail") || !Utility.checkValidEmail("sendToEmail"))) {
            bValid = false;
            sendToEmail.addClass('error');
        }
        // if valid go to set uniform configuration object 
        if (bValid) {
            var orderNameValue = emailOrderName.val() || null;
            var fromEmailValue = emailMyEmail.val() || null;
            var sendToEmailValue = sendToEmail.val() || null;
            GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
            GlobalInstance.popupInstance.disablePopup(); // function close pop up
            $('#blanket').hide(); //hide blanket

            var isRoster = Validator.getIsRosterSelected();
            if (isRoster) {
                // ('Roster Save');
                GlobalInstance.rosterInstance = GlobalInstance.getRosterInstance();
                if (GlobalInstance.rosterInstance.validateRoster()) {
                    GlobalInstance.rosterInstance.saveRoster();
                    // go to set uniform configuration object 
                    GlobalInstance.emailPrintSaveInstance = GlobalInstance.getEmailPrintSaveInstance();
                    GlobalInstance.emailPrintSaveInstance.emailOrder(orderNameValue, fromEmailValue, sendToEmailValue);
                }
            } else {
                // go to set uniform configuration object 
                GlobalInstance.emailPrintSaveInstance = GlobalInstance.getEmailPrintSaveInstance();
                GlobalInstance.emailPrintSaveInstance.emailOrder(orderNameValue, fromEmailValue, sendToEmailValue);
            }
            // if Roster Screen is set then go to roster email functionality else configurator email
        }
    });
    $(document).on('mousedown focus', '#emailOrderName', function() {
        $(this).addClass('inputTextFieldActive');
    });
    $(document).on('blur', '#emailOrderName', function() {
        $(this).removeClass('inputTextFieldActive');
        var bValid = true;
        if (bValid && $('#emailOrderName').is(':visible') && Utility.checkFieldEmpty("emailOrderName")) {
            bValid = false;
            emailOrderName.addClass('error');
        } else {
            emailOrderName.removeClass('error');
        }
    });
    $(document).on('mouseover', '#emailOrderName', function() {
        var className = $('#emailOrderName').attr('class');
        if (className == CONFIG.get('ERROR_CLASS_NAME')) {
            thisObject.disPlayErrorMessage('emailOrderName', false);
        }
    });
    $(document).on('mouseout', '#emailOrderName', function() {
        if ($('#dvIdSaveErrorBox').is(":visible")) {
            $('#dvIdSaveErrorBox').hide();
        }
    });
    $(document).on('mousedown focus', '#orderName', function() {
        $(this).addClass('inputTextFieldActive');
    });
    $(document).on('blur', '#orderName', function() {
        $(this).removeClass('inputTextFieldActive');
        var bValid = true;
        if (bValid && $('#orderName').is(':visible') && Utility.checkFieldEmpty("orderName")) {
            bValid = false;
            orderName.addClass('error');
        } else {
            orderName.removeClass('error');
        }
    });
    $(document).on('mouseover', '#orderName', function() {
        var className = $('#orderName').attr('class');
        if (className == CONFIG.get('ERROR_CLASS_NAME')) {
            thisObject.disPlayErrorMessage('orderName', true);
        }
    });
    $(document).on('mouseout', '#orderName', function() {
        if ($('#dvIdSaveErrorBox').is(":visible")) {
            $('#dvIdSaveErrorBox').hide();
        }
    });
    $(document).on('mousedown focus', '#myEmail', function() {
        $(this).addClass('inputTextFieldActive');
    });
    $(document).on('blur', '#myEmail', function() {
        $(this).removeClass('inputTextFieldActive');
        var bValid = true;
        if (bValid && $('#myEmail').is(':visible') && (Utility.checkFieldEmpty("myEmail") || !Utility.checkValidEmail("myEmail"))) {
            bValid = false;
            myEmail.addClass('error');
        } else {
            myEmail.removeClass('error');
        }
    });
    $(document).on('mouseover', '#myEmail', function() {
        var className = $('#myEmail').attr('class');
        if (className == CONFIG.get('ERROR_CLASS_NAME')) {
            thisObject.disPlayErrorMessage('myEmail', true);
        }
    });
    $(document).on('mouseout', '#myEmail', function() {
        if ($('#dvIdSaveErrorBox').is(":visible")) {
            $('#dvIdSaveErrorBox').hide();
        }
    });
    $(document).on('mousedown focus', '#emailMyEmail', function() {
        $(this).addClass('inputTextFieldActive');
    });
    $(document).on('blur', '#emailMyEmail', function() {
        $(this).removeClass('inputTextFieldActive');
        var bValid = true;
        if (bValid && $('#emailMyEmail').is(':visible') && (Utility.checkFieldEmpty("emailMyEmail") || !Utility.checkValidEmail("emailMyEmail"))) {
            bValid = false;
            emailMyEmail.addClass('error');
        } else {
            emailMyEmail.removeClass('error');
        }
    });
    $(document).on('mousedown focus', '#sendToEmail', function() {
        $(this).addClass('inputTextFieldActive');
    });
    $(document).on('blur', '#sendToEmail', function() {
         $(this).removeClass('inputTextFieldActive');
        var bValid = true;
        if (bValid && $('#sendToEmail').is(':visible') && (Utility.checkFieldEmpty("sendToEmail") || !Utility.checkValidEmail("sendToEmail"))) {
            bValid = false;
            sendToEmail.addClass('error');
        } else {
            sendToEmail.removeClass('error');
        }
    });
    $(document).on('mouseover', '#emailMyEmail', function() {
        var className = $('#emailMyEmail').attr('class');
        if (className == CONFIG.get('ERROR_CLASS_NAME')) {
            thisObject.disPlayErrorMessage('emailMyEmail', false);
        }
    });
    $(document).on('mouseout', '#emailMyEmail', function() {
        if ($('#dvIdEmailErrorBox').is(":visible")) {
            $('#dvIdEmailErrorBox').hide();
        }
    });
    $(document).on('mouseover', '#sendToEmail', function() {
        var className = $('#sendToEmail').attr('class');
        if (className == CONFIG.get('ERROR_CLASS_NAME')) {
            thisObject.disPlayErrorMessage('sendToEmail', false);
        }
    });
    $(document).on('mouseout', '#sendToEmail', function() {
        if ($('#dvIdEmailErrorBox').is(":visible")) {
            $('#dvIdEmailErrorBox').hide();
        }
    });
    // user input box save button event used to validate user input and go to set uniform configuration object, save to server
    $("#idImgSaveOrder").on('click', function() {
        allFields.removeClass("error");
        var bValid = true;
        if (bValid && Utility.checkFieldEmpty("orderName")) {
            bValid = false;
            orderName.addClass('error');
        }
        if (bValid && (Utility.checkFieldEmpty("myEmail") || !Utility.checkValidEmail("myEmail"))) {
            bValid = false;
            myEmail.addClass('error');
        }
        if (bValid) {
            var orderNameValue = orderName.val();
            var myEmailValue = myEmail.val();
            GlobalInstance.getPopupInstance().disablePopup(); // function close pop up
            $('#blanket').hide(); //hide blanket

            // if Roster Screen is set then go to roster save functionality else configurator save
            var isRoster = Validator.getIsRosterSelected();
            if (isRoster) {
                GlobalInstance.rosterInstance = GlobalInstance.getRosterInstance();
                if (GlobalInstance.rosterInstance.validateRoster()) {
                    GlobalInstance.rosterInstance.saveRoster();
                    GlobalInstance.getEmailPrintSaveInstance().saveOrder(orderNameValue, myEmailValue);
                }
            } else {
                GlobalInstance.getEmailPrintSaveInstance().saveOrder(orderNameValue, myEmailValue);
            }
        }
    });
    // cancel events input user box 
    $("#imgCancelOrder").on('click', function() {
        $('#blanket').hide();
    });
    $("#imgCancelEmailOrder").on('click', function() {
        $('#blanket').hide();
    });
};
/**
 * This method shows the error message on hovering the mouse on the element where validation fails.
 * @param errorFieldId - Id of the element where validation fails.
 * @returns void
 */
EmailPrintSave.prototype.disPlayErrorMessage = function(errorFieldId, isFromSave) {
    try {
        var positionOfTheParent = null;
        var positionOfChild = null;
        var topMargin = 0;
        var value = '';
        var errorMessage = '';
        var specialCharacterRegex =/^.*?(?=[\^#%&$\*:<>\?/\{\|\}]).*$/;
        if (!Utility.checkValidEmail(errorFieldId)) {
            //Set the error message for respective validation fails
            value = $('#' + errorFieldId).val();
            var subStr = value.substring(value.indexOf('@')+1,value.lastIndexOf('.'));
            var subStrAfter =value.substring(value.lastIndexOf('.')+1);
            if (Utility.checkFieldEmpty(errorFieldId)) {
                errorMessage = MESSAGES.get('MESSAGE_EMPTY_FIELD');
            } else if (value.indexOf('@') < 0) {
                errorMessage = MESSAGES.get('MESSAGE_MISSING_SYMBOL');
            }else if (value.lastIndexOf('.') < 0) {
                errorMessage = MESSAGES.get('MESSAGE_MISSING_DOMAIN');
            }else if(specialCharacterRegex.test(subStr)){
                errorMessage = MESSAGES.get('MESSAGE_INVALID_CHARACTERS');
            }else if(subStrAfter == ''){
                errorMessage = MESSAGES.get('MESSAGE_INVALID_EMAIL_ADDRESS');
            }else if(Utility.checkRegularExpression(errorFieldId,specialCharacterRegex)){
                errorMessage = MESSAGES.get('MESSAGE_INVALID_EMAIL_ADDRESS');
            }
              
        } else {
            value = $('#' + errorFieldId).val();
            if (Utility.checkFieldEmpty(errorFieldId)) {
                errorMessage = MESSAGES.get('MESSAGE_EMPTY_FIELD');
            }
            
        }
        //Find the position where error message should be displayed
        positionOfTheParent = $('#dvIdEmailUniformDialogForm').offset();
        if (isFromSave) {
            positionOfTheParent = $('#dvIdSaveUniformDialogForm').offset();
        }
        positionOfChild = $('#' + errorFieldId).offset();
        topMargin = positionOfChild.top - positionOfTheParent.top;
        topMargin = topMargin - CONFIG.get('DEFAULT_ERROR_BOX_MARGIN_TOP');
        if (isFromSave) {
            $('#dvIdSaveErrorBox').css({"margin-top": topMargin}).html(errorMessage).show();
        } else {
            $('#dvIdEmailErrorBox').css({"margin-top": topMargin}).html(errorMessage).show();
        }

    } catch (e) {
    }
};