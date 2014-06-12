/**
 * TWA proshpere configurator
 * 
 * mylocker.js is used to contain all the functionality related to selection in the mylocker screen
 * @package proshpere
 * @subpackage uibl
 */

/* 
 * Constructor for Mylocker
 */
function MyLocker() {
    this.secIdConfiguratorSelectGraphics = 'secConfiguratorSelectGraphics';
    this.secIdConfiguratorMyLocker = 'secConfiguratorMyLocker';
    this.secIdConfiguratorUploadGraphics = 'secConfiguratorUploadGraphics';
    this.secIdConfiguratorGraphicsHome = 'secConfiguratorGraphicsHome';
    this.secIdCustomizeGraphics = 'secCustomizeGraphics';
    this.btnBackMyLocker = 'btnBackMyLocker';
    this.btnApplyOnUniform = 'aApplyOnUniform';
    this.myLockerRequestUrl = WEB_SERVICE_URL.get('MY_LOCKER_LIST', LOCAL);
    this.myLockerList = new Object();
    this.objComHelper = new CommunicationHelper();
    this.objUtility = new Utility();
    this.responseType = "json";
    this.selectedMyLocker = null;
    this.selectedMyEmail = null;
    this.selectedMyLocker = null;
    this.imageHeight = null;
    this.imageWidth = null;
    this.funcCallBack = $.Callbacks('memory');
    this.bindMyLockerScreenEvents();
}

/**
 * This method is responsible for calling the API GetLocketFileList.
 * @return void
 */
MyLocker.prototype.init = function() {
    var selectedMyLocker = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo();
    var selectedEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('email');
    this.selectedMyLocker = selectedMyLocker;
    if (selectedMyLocker && selectedMyLocker.email) {
        this.selectedMyEmail = selectedMyLocker.email;
    } else {
        this.selectedMyEmail = selectedEmail;
    }
};

/**
 * This method is responsible for displaying the Configurator Screen panels
 * @returns {void}
 */
MyLocker.prototype.show = function() {
    $('#' + this.secIdConfiguratorGraphicsHome).hide();
    $('#' + this.secIdConfiguratorSelectGraphics).hide();
    $('#' + this.secIdConfiguratorUploadGraphics).hide();
    $('#' + this.secIdCustomizeGraphics).hide();
    $('#' + this.secIdConfiguratorMyLocker).show();
    var selectedEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('email');
    if (!this.selectedMyEmail) {
        this.selectedMyEmail = selectedEmail;
    }
    this.handleMyLockerEmailPopup();
    this.requestMyLockerApi();
};

/**
 * This method is responsible to hide the MyLocker section
 * @returns {void}
 */

MyLocker.prototype.hide = function() {
    $('#' + this.secIdConfiguratorMyLocker).hide();
};
/**
 * This method binds and handle the screen events
 * @returns {void}
 */
MyLocker.prototype.bindMyLockerScreenEvents = function() {
    var thisObject = this;
    var myEmail = $("#myLockerEmail");
    $(document).on('click', '#' + this.btnBackMyLocker, function() {
        GlobalInstance.getEmblemAndGraphicsInstance().show();
    });
//Handles the click Events
    $(document).on('click', '#dvIdImgSaveMyLocker', function() {
        myEmail.removeClass("error");
        var bValid = true;
        if (bValid && (Utility.checkFieldEmpty("myLockerEmail") || !Utility.checkValidEmail("myLockerEmail"))) {
            bValid = false;
            myEmail.addClass('error');
        }

        if (bValid) {
            var myEmailValue = myEmail.val();
            GlobalInstance.getPopupInstance().disablePopup();// function close pop up
            $('#blanket').hide();//hide blanket
            thisObject.selectedMyEmail = myEmailValue;
            thisObject.selectedMyLocker.email = myEmailValue;
            thisObject.requestMyLockerApi();
        }
    });
//Handles the click Events
    $(document).on('click', '#dvIdImgCancelMyLocker', function() {
        GlobalInstance.getPopupInstance().disablePopup();// function close pop up
        $('#blanket').hide();//hide blanket
    });

};

/**
 * This method is responsible handlng the popup of my email.
 * @return boolean
 */
MyLocker.prototype.handleMyLockerEmailPopup = function() {
    if (!this.selectedMyEmail) {
        GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
        GlobalInstance.popupInstance.loading(); // loading
        setTimeout(function() { // then show popup, deley in .5 second
            $('#blanket').show();
            GlobalInstance.popupInstance.loadPopup('dvSaveMyLockerEmailDialogForm'); // function show popup 
            $('#dvSaveMyLockerEmailDialogForm').draggable({
                containment: '#dvConfiguratorPanel'
            });
        }, 300);
        return false;
    }
    return true;
};

/**
 * This method is responsible  calling the API GetLocketFileList.
 * @return void
 */
MyLocker.prototype.requestMyLockerApi = function() {

    try {

        if (this.selectedMyEmail) {
            var accountNumber = GlobalInstance.getUniformConfigurationInstance().getAccountNumber();
            if (!accountNumber) {
                accountNumber = '';
            }
            var params = {
                "emailId": this.selectedMyEmail,
                "dealerId": accountNumber
            };
            this.objComHelper.callAjax(this.myLockerRequestUrl, 'GET', params, this.responseType, null, this.createMyLocker.bind(this), null, null, null, null, null);
        }
    } catch (e) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description mylocker 148: " + e.message + "\n\n";
            txt += "Error filename: " + e.fileName + "\n\n";
            txt += "Error lineNumber: " + e.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};


/**
 * This method is responsible for creating dynamic html based on response that comes from the API.
 * @return void
 */
MyLocker.prototype.setHtmlAndBindMyLocker = function() {
    var thisObject = this;
    var ulMyLocker = $('#ulMyLockerId');
    var liMyLocker = '';
    //var imageSource = CONFIG.get('SERVER_BASE_URL') + '/UploadedImage/';
    // removing the content of locker container
    ulMyLocker.html('');
    var isCorrectionFeeFeatureRequired = objApp.correctionFeeFeatureRequired == 1 ? true : false;
    var isCorrectionFeePromotionApplicable = objApp.correctionFeePromotionApplicable == 0 ? false : true;
    var correctionFeeMessage = MESSAGES.get('MESSAGE_CORRECTION_FEE_REQUIRED');
    correctionFeeMessage = correctionFeeMessage.replace('$', '$' + objApp.correctionFeeAmount);
    if (isCorrectionFeePromotionApplicable == true) {
        correctionFeeMessage = '<del>' + correctionFeeMessage + '</del>'
    }
    var userEmail = GlobalInstance.getUniformConfigurationInstance().getUserInfo('email');
    userEmail = userEmail ? userEmail : ''
    var dealerId = GlobalInstance.getUniformConfigurationInstance().getUserId();
    dealerId = dealerId ? dealerId : ''

    var imageTitle = userEmail || dealerId; // give preference to email
    var imageName = '';
    $.each(this.myLockerList, function(i, lockerImageInfo) {
        var lockerImageName = lockerImageInfo.ImageUrl;
        imageName = lockerImageInfo.ImageName.replace(/ /g, '_');
        liMyLocker = $('<li title=' + imageTitle + '/' + imageName + '>');
        imageMyLocker = $('<img title=' + imageTitle + '/' + imageName + '>');

        if (thisObject.selectedMyLocker && lockerImageName == thisObject.selectedMyLocker.src) {
            liMyLocker.addClass('active');
        }
        //lockerImage = lockerImage.replace(" ","_");
        var ext = lockerImageName.substring(lockerImageName.lastIndexOf(".") + 1); // get extension of locker image file
        var knockOutGraphicUrl = '';
        var graphicUrl='';
        if (Utility.isExist(CONFIG.get('KNOCKOUT_CHAIN_APPLY_GRAPHIC_EXTENSTIONS'), ext)) {
            graphicUrl = LiquidPixels.getbackgroundKnockoutUrl(lockerImageName);
            lockerImageName = LiquidPixels.getAnyFileUrl(LiquidPixels.getbackgroundKnockoutUrl(lockerImageName));
        }else{
            graphicUrl = lockerImageName;
            lockerImageName =LiquidPixels.getAnyFileUrl(lockerImageName);
        }
        imageMyLocker.attr('src', lockerImageName);
        correctionFeeInfo = $('<div>').addClass('correctionFee').html((lockerImageInfo.FeeCharged == false && lockerImageInfo.GAVerificationRequired == true && isCorrectionFeeFeatureRequired == true) ? correctionFeeMessage : '&nbsp;');

        liMyLocker.append(imageMyLocker).append(correctionFeeInfo);

        // handle the click event for my locker images
        liMyLocker.click(function() {
            thisObject.selectedMyLocker = {
                'src': lockerImageName,
                'index': i,
                'email': thisObject.selectedMyEmail,
                'url': graphicUrl
            };

            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            thisObject.saveSelectedMyLocker();
        });

        ulMyLocker.append(liMyLocker);
    });

    //fire the event for required callbacks
    this.funcCallBack.fire();
};

/**
 * This method is responsible for creating the my locker list.
 * @param  response - response that comes from the API GetLocketFileList
 * @param  params - extra parameter that should be needed for this method 
 * @return void
 */
MyLocker.prototype.createMyLocker = function(response, params) {
    var thisObject = this;
    try {
        if (this.objUtility.validateResponseFormat(response, this.myLockerRequestUrl)) {
            thisObject.myLockerList = response.ResponseData;
            if (this.selectedMyEmail) {
                GlobalInstance.uniformConfigurationInstance.setUserInfo('email', this.selectedMyEmail);
            }
            this.setHtmlAndBindMyLocker(this);
        } else {
            Log.error("Error in API: " + this.myLockerRequestUrl);
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description mylocker 248: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.debug(txt);
        }
    }
};

/**
 * This method is responsible for storing currently selected mylocker image
 * @param  selectedGraphicId - Id of the selected Graphic
 * @return void
 */
MyLocker.prototype.saveSelectedMyLocker = function() {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    GlobalInstance.uniformConfigurationInstance.setMyLockerInfo(null, this.selectedMyLocker);
    if (this.selectedMyEmail) {
        GlobalInstance.uniformConfigurationInstance.setUserInfo('email', this.selectedMyEmail);
    }

    this.UpdateSelectedMyLockerGraphicWidthAndHeight(null);
};

/**
 * Add the call back function.
 * @return void
 */
MyLocker.prototype.addCallback = function(funcName) {
    this.funcCallBack.add(funcName);
};

/**
 * Remove the call back function.
 * @return void
 */
MyLocker.prototype.removeCallback = function(funcName) {
    this.funcCallBack.remove(funcName);
};

MyLocker.prototype.UpdateSelectedMyLockerGraphicWidthAndHeight = function(callback) {
    var imgSource = GlobalInstance.uniformConfigurationInstance.getMyLockerInfo('src');
    var newImg = new Image();
    newImg.onload = function() {
        var height = (newImg.height)?newImg.height:0;
        var width = (newImg.width)?newImg.width:0;
        GlobalInstance.uniformConfigurationInstance.setMyLockerInfo('width', width);
        GlobalInstance.uniformConfigurationInstance.setMyLockerInfo('height', height);
        if (callback) {
            callback(true);
        }
        Log.debug('In Image Load \n Height--' + height + '\n Width--' + width);
    };
    newImg.onerror = function() {
        GlobalInstance.uniformConfigurationInstance.setMyLockerInfo('width', 0);
        GlobalInstance.uniformConfigurationInstance.setMyLockerInfo('height', 0);
        if (callback) {
            callback(false);
        }
        Log.debug('In Image Load Error');
    };
    newImg.src = LiquidPixels.getAnyFileUrl(imgSource);
};