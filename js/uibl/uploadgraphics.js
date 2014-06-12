/**
* TWA proshpere configurator
* 
 * emblemandgraphics.js is used to maintain emblem and graphics related functions.;
* @package proshpere
* @subpackage uibl
*/

/* 
 * Constructor for UploadGraphics
*/
function UploadGraphics() {
    this.secIdConfiguratorSelectGraphics = 'secConfiguratorSelectGraphics';
    this.secIdConfiguratorMyLocker = 'secConfiguratorMyLocker';
    this.secIdConfiguratorUploadGraphics = 'secConfiguratorUploadGraphics';
    this.secIdConfiguratorGraphicsHome = 'secConfiguratorGraphicsHome';
    this.secIdCustomizeGraphics = 'secCustomizeGraphics';
    this.btnBackUploadGraphics = 'dvIdBackUploadGraphics';
    this.bindUploadGraphicsScreenEvents();
    this.fileuploadObj = null;
    this.selectedUploadGraphicEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('email');
    this.validateRequestUrl = WEB_SERVICE_URL.get('VALIDATE_UPLOAD_GRAPHIC_URL', LOCAL);
    this.uploadRequestUrl = WEB_SERVICE_URL.get('UPLOAD_GRAPHIC_URL', LOCAL);
    this.objCommHelper = new CommunicationHelper();
    this.isUploadImageClicked = false;
    this.validateResponseData = null;
}
/**
* This method displays the specific configurator screen 
 * @returns {void}
*/
UploadGraphics.prototype.show = function() {
    $('#' + this.secIdConfiguratorGraphicsHome).hide();
    $('#' + this.secIdConfiguratorSelectGraphics).hide();
    $('#' + this.secIdConfiguratorMyLocker).hide();
    $('#' + this.secIdCustomizeGraphics).hide();
    $('#' + this.secIdConfiguratorUploadGraphics).show();
    $('#idUploadgraphicsFilename').val('');
    $("#uploadgraphicname").val('');

    this.fileuploadObj = null;
    this.selectedUploadGraphicEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('email');
};
/**
* This method hides the Configurator Upload Graphics
* @returns {void}
*/
UploadGraphics.prototype.hide = function() {
    $('#' + this.secIdConfiguratorUploadGraphics).hide();
};
/**
* This method handles and binds the graphics screen Events
* @returns {undefined}
*/
UploadGraphics.prototype.bindUploadGraphicsScreenEvents = function() {
    $(document).on('click', '#' + this.btnBackUploadGraphics, function() {
        GlobalInstance.getEmblemAndGraphicsInstance().show();
    });

    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    if (!this.selectedUploadGraphicEmail) {
        this.selectedUploadGraphicEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('email');
    }

    var thisObject = this;

    $('#idUploadgraphicsFilename').val('');
    $('#uploadgraphic').fileupload({ // Browse
        url: '',
        acceptFileTypes: /(\.|\/)(bmp|tiff|tif|png|jpg|jpeg|psd|ai|pdf|)$/i,
        acceptFileTypesError: CONFIG.get('MESSAGE_INVALID_UPLOADED_GRAPHIC_FORMATS'), 
        dataType: 'json',
        add: function(e, data) {
            if (data.files.length > 0) {
                $('#blanket').show();
                $.startProcess();
                $('#idUploadgraphicsFilename').val(data.files[0].name);
                thisObject.fileuploadObj = data;
                thisObject.handleValidation();
                //thisObj.handleUploadGraphicEmailPopup();
            }
        },
        done: function(e, data) {
            $('#blanket').hide();
            $.doneProcess();
            var result = JSON.parse(data._response.result);
            var responseData = result.ResponseData;
            var errorData = result.Error;
            
            if (errorData) {
                GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                GlobalInstance.dialogBoxInstance.funcCallBack = null;
                GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(TITLE.get('TITLE_ERROR'), errorData.ErrorDescription);
            } else if (responseData) {
                var isValid = responseData.HasCorrectResolution
                        && responseData.HasCorrectSize;
                
                if (isValid) {
                    
                    if (Utility.isExist(CONFIG.get('VECTOR_GRAPHICS_EXTENSTIONS'), responseData.FileExtension)) {
                        isValid = true;
                    }
                    
                    else if(Utility.isExist(CONFIG.get('RASTER_GRAPHICS_EXTENSTIONS'), responseData.FileExtension)){
                        if (responseData.ImageFormat == CONFIG.get('IMAGE_FORMAT_RASTER')) {
                            isValid = true;
                        }
                        else {
                            isValid = false;
                        }
                    }
                    else{
                        isValid = false;
                    }
                    
                    if (isValid) {
                        thisObject.showValidateGraphicSuccessPopup(responseData);
                    }
                    else {
                        thisObject.showValidateGraphicFailPopup(responseData);
                    }
                } else {
                    thisObject.showValidateGraphicFailPopup(responseData);
                }
            } else {
                //invalid response from server...
                GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                GlobalInstance.dialogBoxInstance.funcCallBack = null;
                GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(TITLE.get('TITLE_ERROR'), MESSAGES.get('MESSAGE_TECH_ERROR'));
            }
        },
        fail: function(e, data) {
            $.doneProcess();
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.funcCallBack = null;
            GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(TITLE.get('TITLE_ERROR'), MESSAGES.get('MESSAGE_TECH_ERROR'));
        },
        progressall: function(e, data) {
            $.doneProcess();
        }
    }).bind('fileuploadprocessfail', function(e, data) {
    })

            .prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');

    $(document).on('click', '#aUploadGraphics', function() {
        thisObject.handleUploadGraphicValidation();
        thisObject.isUploadImageClicked = true;
        GlobalFlags.setScreenFlags('isUploadGraphic', true);
        GlobalFlags.setScreenFlags('isLocker', false);
        return false;
    });

    
    myEmail = $("#uploadGraphicEmail");
    $(document).on('click', '#' + this.btnBackMyLocker, function() {
        GlobalInstance.getEmblemAndGraphicsInstance().show();
    });

    $(document).on('click', '#imgSaveUploadGraphic', function() {
        myEmail.removeClass("error");
        var bValid = true;
        if (bValid && (Utility.checkFieldEmpty("uploadGraphicEmail") || !Utility.checkValidEmail("uploadGraphicEmail"))) {
            bValid = false;
            myEmail.addClass('error');
        }

        if (bValid) {
            var myEmailValue = myEmail.val();
            GlobalInstance.getPopupInstance().disablePopup();// function close pop up
            $('#blanket').hide();//hide blanket
            thisObject.selectedUploadGraphicEmail = myEmailValue;
            thisObject.handleValidation();
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();

            if (thisObject.selectedUploadGraphicEmail) {
                GlobalInstance.uniformConfigurationInstance.setUserInfo('email', thisObject.selectedUploadGraphicEmail);
            }
        }
    });

    $(document).on('click', '#imgCancelUploadGraphic', function() {
        GlobalInstance.getPopupInstance().disablePopup();// function close pop up
        $('#blanket').hide();//hide blanket
        thisObject.cancelUpload($('#idUploadgraphicsFilename').val());
    });

    $(document).on('click', '#aGoToMyLocker', function() {
        GlobalInstance.getMyLockerInstance().show();
    });

    $(document).off('click', '.graphiclinkArea');
    $(document).on('click', '.graphiclinkArea', function () {

    });

    $(document).off('click', '#aHelpGuidefailure');
    $(document).on('click', '#aHelpGuidefailure', function () {
        $('.UploadedImageContentBox').hide();
        $('#idUploadAnotherBtnFailure').hide();
         $('#dvIdImageFailScreenHelpGuide').show();
        // $('#idUploadAnotherBtn').show();
         $('#idBtnBackFailure').show();
         $(this).hide();
    });

    $(document).off('click', '#aHelpGuideSuccess');
    $(document).on('click', '#aHelpGuideSuccess', function () {
        $('.UploadedImageContentBox').hide();
        $('#dvIdImageFailScreenHelpGuideSuccess').show();
        $('#idUploadAnotherBtn').hide();
        $('.doneBtn').hide();
       // $('#idUploadAnotherBtn').show();
        $('#idBtnBackSuccess').show();
        $(this).hide();
    });
  

    $(document).off('click', '#idBtnBackFailure');
    $(document).on('click', '#idBtnBackFailure', function () {
        $('.UploadedImageContentBox').show();
        $('#dvIdImageFailScreenHelpGuide').hide();
        $('#aHelpGuidefailure').show();
        $('#idUploadAnotherBtnFailure').show();
        $(this).hide();
    });

    $(document).off('click', '#idBtnBackSuccess');
    $(document).on('click', '#idBtnBackSuccess', function () {
        $('.UploadedImageContentBox').show();
        $('#dvIdImageFailScreenHelpGuideSuccess').hide();
        // $('#idUploadAnotherBtn').show();
        $('#aHelpGuideSuccess').show();
        $('#idUploadAnotherBtn').show();
        $('.doneBtn').show();
        $(this).hide();
    });
};

/**
* Validation of upload graphics.
* @return boolean
*/
UploadGraphics.prototype.handleUploadGraphicValidation = function() {
    //validate the uploaded graphic image
    if (!this.validateResponseData) {
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = null;
        GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(
                TITLE.get('TITLE_UPLOAD_GRAPHIC_VALIDATION'),
                MESSAGES.get('MESSAGE_UPLOAD_GRAPHIC_VALIDATION')
                );

        return false;
    }

    //validate the uploaded graphic name
    var uploadImage = $("#uploadgraphicname");
    uploadImage.removeClass("error");
    var imageName = $.trim(uploadImage.val());
    
    var bValid = true;
    if (!imageName) {
        bValid = false;
        uploadImage.addClass('error');
    }

    if (!bValid) {
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = null;
        GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(
                TITLE.get('TITLE_UPLOAD_GRAPHIC_VALIDATION'),
                MESSAGES.get('MESSAGE_UPLOAD_GRAPHIC_NAME_VALIDATION')
                );
        return false;
    }

    if (!this.selectedUploadGraphicEmail) {
        this.handleUploadGraphicEmailPopup();
    } else if (this.fileuploadObj) {
        if (bValid) {
            //get the extension from file
            //call upload api, 
            $.startProcess(true);
            $('#blanket').show();
            var filename = this.fileuploadObj.files[0].name; //get uploaded file name
            var ext = filename.substring(filename.indexOf(".") + 1); // get extension of uploaded file
            this.validateResponseData.FileName = imageName + "." + ext; //update the name of image
            var imageUrl = CONFIG.get('SERVER_BASE_URL') +this.validateResponseData.FileURL;
            imageUrl = imageUrl.replace(/\\/g, "/");
            
            imageUrl = $('#chkDontRmvBackColor').is(':checked') ? imageUrl : LiquidPixels.getbackgroundKnockoutUrl(imageUrl);
            this.validateResponseData.FileURL = imageUrl; //update the name of image
            var accountNumber = objApp.sessionResponseData.AccountNumber || '';
            this.validateResponseData.AccountNumber = accountNumber;
            this.objCommHelper.callAjax(this.uploadRequestUrl, 'POST', JSON.stringify(this.validateResponseData), 'json', null, this.handleUploadGraphicsCallback.bind(this), null, null, null, null, null);
            this.validateResponseData = null;
        }
    } else {
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = null;
        GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(
            TITLE.get('TITLE_UPLOAD_GRAPHIC_VALIDATION'),
            MESSAGES.get('MESSAGE_UPLOAD_GRAPHIC_VALIDATION')
        );

        return false;
    }
};

/**
* This method is responsible handlng the validation of upload graphics.
* @return boolean
*/
UploadGraphics.prototype.handleValidation = function(obj) {
    var thisObject = this;
    //validation
    //validate the uploaded graphic image
    if (!thisObject.fileuploadObj) {
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = null;
        GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(
                TITLE.get('TITLE_UPLOAD_GRAPHIC_VALIDATION'),
                MESSAGES.get('MESSAGE_UPLOAD_GRAPHIC_VALIDATION')
                );

        return false;
    }

    //validate the uploaded graphic name
    var uploadImage = $("#uploadgraphicname");
    uploadImage.removeClass("error");
    var bValid = true;
    if (!thisObject.selectedUploadGraphicEmail) {
        this.handleUploadGraphicEmailPopup();
    } else if (thisObject.fileuploadObj) {
        if (bValid) {
            //get the extension from file
            var filename = thisObject.fileuploadObj.files[0].name;
            var ext = filename.substring(filename.indexOf(".") + 1);
            var randomNumber = new Date().getTime();
            var fileUpdatedName = randomNumber + "." + ext;

            var serverParams = {
                'applicationId': GlobalInstance.uniformConfigurationInstance.getApplicationId()
            };
            var accountNumber = objApp.sessionResponseData.AccountNumber || '';
            var useGraphicAnalyzer = CONFIG.get('USE_GRAPHIC_ANALYZER');
            var queryStringParam = "?applicationId=" + serverParams.applicationId + '&emailId=' + thisObject.selectedUploadGraphicEmail + '&fileName=' + fileUpdatedName + "&useGraphicAnalyzer=" + useGraphicAnalyzer + '&AccountNumber=' + accountNumber;
            var Url = this.validateRequestUrl + queryStringParam;
            thisObject.fileuploadObj.url = Url;
            thisObject.fileuploadObj.submit();
            $.startProcess(true);
        }
    } else {
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = null;
        GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(
                TITLE.get('TITLE_UPLOAD_GRAPHIC_VALIDATION'),
                MESSAGES.get('MESSAGE_UPLOAD_GRAPHIC_VALIDATION')
                );

        return false;
    }

};

/**
* This method is responsible handlng the popup of upload graphic.
* @return boolean
*/
UploadGraphics.prototype.handleUploadGraphicEmailPopup = function() {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    if (!this.selectedUploadGraphicEmail) {
        this.selectedUploadGraphicEmail = GlobalInstance.uniformConfigurationInstance.getUserInfo('email');
    }

    if (!this.selectedUploadGraphicEmail || !this.selectedUploadGraphicEmail) {
        GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
        GlobalInstance.popupInstance.loading(); // loading
        setTimeout(function() { // then show popup, deley in .5 second
            $('#blanket').show();
            GlobalInstance.popupInstance.loadPopup('dvSaveUploadGraphicEmailDialogForm'); // function show popup 
            $('#dvSaveUploadGraphicEmailDialogForm').draggable({
                containment: '#dvConfiguratorPanel'
            });
        }, 300);
        return false;
    }
    return true;
};

/**
* This method shows the validate success popup and bind all the button events on the screen with the actions required on each event.
* 
 * @param {type} responseData data recieved from validate api
* @returns {undefined}
*/
UploadGraphics.prototype.showValidateGraphicSuccessPopup = function(responseData) {
    var thisObj = this;

    //set the uploaded image in popup
    var imageUrl = CONFIG.get('SERVER_BASE_URL') + responseData.FileURL;
    imageUrl = imageUrl.replace(/\\/g, "/");
    $('#idValidateUploadSuccPopuImg').attr('src', '');
    thisObj.setRemovedBackgroundImage('idValidateUploadSuccPopuImg', imageUrl);
    
    GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
    GlobalInstance.popupInstance.loading(); // loading
    setTimeout(function() { // then show popup, deley in .3 second
        $('#blanket').show();
        //change the state of check box based on recieved response
        $('#idCheckBoxValidateColorMatch').prop('checked', responseData.UseColorConversion);

        //show the popup
        GlobalInstance.popupInstance.loadPopup('dvUploadGraphicsSuccessPopup'); // function show popup 
        $('.UploadedImageContentBox').show();
        $('#dvIdImageFailScreenHelpGuideSuccess').hide();
        $('#aHelpGuideSuccess').show();
        $('#idUploadAnotherBtn').show();
        $('#idBtnBackSuccess').hide();
        $('.doneBtn').show();
         $('#chkDontRmvBackColor').prop('checked', false);
        ///$('#myCheckbox').attr('checked', false);
        
    }, 300);

    //handle close button click
    $('#dvIdValidateSuccessCloseBtn').off();
    $('#dvIdValidateSuccessCloseBtn').on('click', function() {
        GlobalInstance.popupInstance.disablePopup();
        $('#blanket').hide();
    });

    //Handle the Checkbox of don't remove image background
    $('#chkDontRmvBackColor').off();
    $('#chkDontRmvBackColor').on('change', function() {
        if ($(this).is(':checked')) {
            thisObj.setAnyFileUrlImage('idValidateUploadSuccPopuImg', imageUrl);
        } else {
            thisObj.setRemovedBackgroundImage('idValidateUploadSuccPopuImg', imageUrl);
        }
    });

    //handle done button click
    $('#btnUploadDone').off();
    $('#btnUploadDone').on('click', function() {
        //update the reponsponse data which is needed to passed in upload api
        if ($('#chkDontRmvBackColor').is(':checked')) {
            responseData.RemoveBackground = false;
        } else
        {
            responseData.RemoveBackground = true;
        }
        responseData.UseColorConversion = $('#idCheckBoxValidateColorMatch').is(':checked');
        GlobalInstance.popupInstance.disablePopup();
        $('#blanket').hide();

    });

    $('#idUploadAnotherBtn').off();
    $('#idUploadAnotherBtn').on('click', function() {
        GlobalInstance.popupInstance.disablePopup();
        $('#blanket').hide();
        thisObj.cancelUpload($('#idUploadgraphicsFilename').val());
    });

    thisObj.validateResponseData = responseData;
};

/**
* This method shows the validate fail popup and bind all the button events on the screen with the actions required on each event.
* 
 * @param {type} responseData data recieved from validate api
* @returns {undefined}
*/
UploadGraphics.prototype.showValidateGraphicFailPopup = function(responseData) {
    var thisObj = this;
    $('#spIdCorrectionFee').html('');
    GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
    GlobalInstance.popupInstance.loading(); // loading

    var correctionString = CONFIG.get('CORRECTION_FEE_STRING') + objApp.correctionFeeAmount + ' fee.';

    //set the uploaded image url in popup
    var imageUrl = CONFIG.get('SERVER_BASE_URL') + responseData.FileURL;
    imageUrl = imageUrl.replace(/\\/g, "/");
    $('#idValidateUploadImg').attr('src', '');
    //$('#idValidateUploadImg').attr('src', LiquidPixels.getAnyFileUrl(imageUrl));
    //$('#idValidateUploadImg').attr('src', LiquidPixels.getAnyFileUrl(imageUrl));
    thisObj.setRemovedBackgroundImage('idValidateUploadImg', imageUrl);

    setTimeout(function () { // then show popup, deley in .5 second
        $('#blanket').show();
        $('#idBtnNextStep').hide();
        //update the state of checkbox in popup
        $('#idCheckTaaFix').prop('checked', responseData.FixImageByTWA);
        $('#idRemoveBackgroundValidateFailPopup').prop('checked', responseData.RemoveBackground);
        GlobalInstance.popupInstance.loadPopup('dvUploadGraphicsFailPopup'); // function show popup 
        $('.UploadedImageContentBox').show();
        $('#dvIdImageFailScreenHelpGuide').hide();
        $('#aHelpGuidefailure').show();
        $('#idUploadAnotherBtnFailure').show();
        //$('#idUploadAnotherBtn').hide();
        $('#idBtnBackFailure').hide();
        // $(this).hide();

        $('#spIdCorrectionFee').html(correctionString);
    }, 300);

    //handle close popup button
    $('#dvIdValidateFailCloseBtn, #idFixAndUploadLaterBtn').off();
    $('#dvIdValidateFailCloseBtn, #idFixAndUploadLaterBtn').on('click', function() {
        
        thisObj.cancelUpload($('#idUploadgraphicsFilename').val());
        GlobalInstance.popupInstance.disablePopup();
        $('#blanket').hide();
    });

//Handles the click event of upload Another Image Button
    $('#idUploadAnotherBtnFailure').off();
    $('#idUploadAnotherBtnFailure').on('click', function () {
        /*$(".imageCriteriaContainer").hide();
         $("#blanket").hide();
         $("#dvBackgroundPopup").hide();*/
        GlobalInstance.popupInstance.disablePopup();
        $('#blanket').hide();

        thisObj.cancelUpload($('#idUploadgraphicsFilename').val());
    });

    //handle next step button
    $('#idBtnNextStep').off();
    $('#idBtnNextStep').on('click', function() {
        //set the data based on checkbox states
        responseData.RemoveBackground = $('#idRemoveBackgroundValidateFailPopup').is(':checked');
        responseData.FixImageByTWA = $('#idCheckTaaFix').is(':checked');


        GlobalInstance.popupInstance.disablePopup();
        thisObj.showValidateGraphicSuccessPopup(responseData);
    });

    $('#idCheckTaaFix').change(function() {
        if ($(this).is(':checked')) {
            $('#idBtnNextStep').show();
        } else {
            $('#idBtnNextStep').hide();
        }
    });
};

/**
* Cancle Uploaded 
* Should be called in case of 'I'll Fix & upload later' OR 
* 'Upload another Image'
*/
UploadGraphics.prototype.cancelUpload = function (url) {
    // TODO
    // need to make a service call to remove temp images

    $('#uploadgraphicname').val('');
    $('#idUploadgraphicsFilename').val('');
};


/**
* Handles the Upload Graphcis CallBack function
* @param response
* @param  params
* @returns {void}
*/
UploadGraphics.prototype.handleUploadGraphicsCallback = function(response, params) {
    var responseType = response.ResponseType;
    if (responseType == 1) {
        //save the details on uniform configuration
        var imageUrl = response.ResponseData;
        imageUrl = imageUrl.replace(/\\/g, "/");
        var ext = imageUrl.substring(imageUrl.lastIndexOf(".") + 1); // get extension of uploaded file
        
        GlobalInstance.uniformConfigurationInstance.setMyLockerInfo('src', imageUrl);
        GlobalInstance.uniformConfigurationInstance.setMyLockerInfo('url', imageUrl);
        GlobalInstance.uniformConfigurationInstance.setMyLockerInfo('index', 0);
        GlobalInstance.uniformConfigurationInstance.setMyLockerInfo('email', this.selectedUploadGraphicEmail);
        GlobalInstance.uniformConfigurationInstance.setUserInfo('email', this.selectedUploadGraphicEmail);
        GlobalInstance.getMyLockerInstance().UpdateSelectedMyLockerGraphicWidthAndHeight(function(isSuccess) {
            //show anchor point screen
            $.doneProcess();
            $('#blanket').hide();
            if (isSuccess) {
                GlobalInstance.emblemAndGraphicsInstance = GlobalInstance.getEmblemAndGraphicsInstance();
                GlobalInstance.numberAndTextInstance = GlobalInstance.getNumberAndTextInstance();
                GlobalInstance.emblemAndGraphicsInstance.hide();
                GlobalInstance.myLockerInstance.hide();
                GlobalInstance.numberAndTextInstance.hide();
                GlobalInstance.anchorPointInstance.hide();
                GlobalInstance.anchorPointInstance.setBackScreenId(GlobalInstance.myLockerInstance);
                GlobalInstance.anchorPointInstance.show('secMyLockerPanel');
            } else {
                $('#blanket').hide();
                return false;
            }
        });
        
    } else {
        $.doneProcess();
        $('#blanket').hide();
        //set the selected values as blank
        $('#uploadgraphicname').val('');
        $('#idUploadgraphicsFilename').val('');
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = null;
        GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_ERROR'), response.Error.ErrorDescription);
    }
    GlobalInstance.popupInstance.disablePopup();
};

/**
* Handles the background CallBack function
* @param imageId Id of the image object
* @param imageUrl Url of image
* @returns void
*/
UploadGraphics.prototype.setRemovedBackgroundImage = function(imageId, imageUrl) {
    $.startProcess(true);
    var imageObj = $('#' + imageId);
    //var imageUrl = imageObj.attr('src');
    //apply knockout url on image
    var image = new Image();
    image.onload = function () {
        imageObj.css('visibility', 'visible');
        imageObj.attr('src', image.src);
        $.doneProcess();
    };
    image.onerror = function() {
        $.doneProcess();
    };
    imageObj.attr('src', '');
    imageObj.css('visibility', 'hidden');
    image.src = LiquidPixels.getbackgroundKnockoutUrl(imageUrl);
    
};

/**
* Set the image source with getAnyFile URL support
* @param imageId Id of the image object
* @param imageUrl Url of image
* @returns void
*/
UploadGraphics.prototype.setAnyFileUrlImage = function (imageId, imageUrl) {
    $.startProcess(true);
    var imageObj = $('#' + imageId);
    
    var image = new Image();
    image.onload = function () {
        imageObj.css('visibility', 'visible');
        imageObj.attr('src', image.src);
        $.doneProcess();
    };
    image.onerror = function () {
        $.doneProcess();
    };
    imageObj.attr('src', '');
    imageObj.css('visibility', 'hidden');
    image.src = LiquidPixels.getAnyFileUrl(imageUrl);
};