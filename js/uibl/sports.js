/**
 * TWA proshpere configurator
 * 
 * sport.js is used to define sport/gender related functionality. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 *
 * @return void
 */
function Sports() {
    this.sportsList = new Object();
    this.requestUrl = WEB_SERVICE_URL.get('SPORT_LIST', LOCAL);
    this.responseType = 'json';
    this.objCommHelper = new CommunicationHelper();
    this.objUtility = new Utility();
    this.navIdSportsList = 'navSportsList';
}

/**
 * Performs a fetching sport list. If it fetches from web and go to set the sports list into the object and binds the click events with sports
 * If it fetches from cache, it returns the sport list object
 * 
 * @param isCache Returns the sports list if set to true, else fetches the data from web and sets into sports list object
 * @return Object
 */
Sports.prototype.getSportsList = function(isCache) {
    try {
        if (isCache === false) {
            var params = {
                "applicationId": GlobalInstance.uniformConfigurationInstance.getApplicationId()
            };

            this.objCommHelper.callAjax(this.requestUrl, 'GET', params, this.responseType, null, this.fillSportsList.bind(this), null, null, null, null, null);
            return null;
        }
        else {
            return this.sportsList;
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
 * Fills the sport list into the object after recieving the list from Web Service. After filling the data, it calls the function which loads the HTML and 
 * binds the click event on sports 
 *
 * @param response Response from Web service in json format containing sports list
 * @param params
 * 
 * @return void
 */
Sports.prototype.fillSportsList = function(response, params) {
    try {
        var thisObject = this;
        if (this.objUtility.validateResponseFormat(response, this.requestUrl)) {
            $.each(response.ResponseData, function(i, sportList) {
                if ((objApp.sid && (objApp.sid == sportList.Id || objApp.sid == 'ALL')) || (!objApp.sid)) {
                    thisObject.sportsList["_" + sportList.Id] = sportList;
                }
            });

            //set dynamic data and bind events
            this.setHtmlAndBind();
        } else {
            Log.error("Error in API and URL is " + this.requestUrl);
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
 * Sets the sports list HTML and binds the click event 
 *
 * @return {void}
 */
Sports.prototype.setHtmlAndBind = function() {
    var ulSportList = $('<ul>').attr('id', 'sportList');
    var thisObj = this;
    $.each(this.sportsList, function(i, sportsList)
    {
        var liSportList = $('<li/>')
                .appendTo(ulSportList);
        $('<a/>').attr({
            'sportId': sportsList.Id,
            'sportName': sportsList.Name
        })
                .text(sportsList.Name)
                .appendTo(liSportList);
    });
    $('#' + this.navIdSportsList).append(ulSportList);
    var sportsListLength = Utility.getObjectlength(this.sportsList, 'spjs105');
    if (sportsListLength > 0) {
        this.preCacheSportImage();
        if (sportsListLength == 1) {
            thisObj.sportsListImageSlider($("#" + this.navIdSportsList + " ul li").first().children('a'));
        }
    }

    
    

    $("#" + this.navIdSportsList + " ul li").on("mouseup",
            function() {
                thisObj.sportsListImageSlider($(this).children('a'));
                return false;
            });

    $("#" + this.navIdSportsList + " ul li").on("mousedown", function() {
        if ($(this).is('.active')) {
            return false;
        } else {
            $("#" + thisObj.navIdSportsList + " ul li").removeClass('active');
            $("#" + thisObj.navIdSportsList + " ul li").attr('clicked', '');
            $(this).addClass('active');
            return false;
        }

    });

};

/**
 * used to slides the sport background image 
 * 
 * @param {object} selected category obejct
 * @returns {void}
 */
Sports.prototype.sportsListImageSlider = function(params) {
    if ($("#dvSportGenderDisplayName").html() === params.attr("sportname")) {
        return false;
    }
    var sportsList = this.getSportsList(true);
    var sportId = params.attr("sportId");
    var sportName = sportsList["_" + sportId].Name;
    // Call Google Analytics
    GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
    GlobalInstance.googleAnalyticsUtilInstance.trackSportNameClicks(sportName);

    var imageUrl = CONFIG.get('BASE_URL') + CONFIG.get('IMAGE_DIR') + SPORTS_BACKGROUND_IMAGE.get(sportName);

    //Hide Click Sport To Begin container
    $("#dvClickSportToBegin").hide();
    var backdropImg = $("#secBackdropImg");
    var backdropImgFistLayer = $("#secBackdropImgFistLayer");
    var backdropImgSecondLayer = $("#secBackdropImgSecondLayer");
    var sportGenderContainer = $("#sportGenderContainer");
    backdropImg.css('opacity', '100');
    backdropImgFistLayer.css('height', '434');
    backdropImgSecondLayer.css('left', '-1000px');

    //Load html content and set dynamic data and bind events
    this.setSportGenderHTML(sportsList["_" + sportId]);
    //check to display effect on only first time for first image 
    if (GlobalConfigurationData.displaySlideImageFirstTime === 1) {
        backdropImgSecondLayer.css('background-image', "url('" + imageUrl + "')");
        backdropImgFistLayer.css('z-index', '100');
        backdropImgFistLayer.animate({
            height: '0px'
        }, {
            duration: 380,
            easing: 'linear',
            complete: function() {
            }
        });
        backdropImg.fadeTo(460, 0.3, function() {
            backdropImgSecondLayer.animate({
                //width : '+=823'
                left: '137px'
            }, {
                duration: 250,
                easing: 'linear',
                complete: function() {
                    backdropImgFistLayer.css('background-image', "url('" + imageUrl + "')");
                }
            });
        });
        backdropImgSecondLayer.css('z-index', '100');
        sportGenderContainer.appendTo("#secBackdropImgSecondLayer");

    } else {
        backdropImgFistLayer.css('z-index', '0');
        backdropImgSecondLayer.css('z-index', '100');
        sportGenderContainer.appendTo("#secBackdropImgSecondLayer");
        backdropImgSecondLayer.css('background-image', "url('" + imageUrl + "')");
        backdropImgFistLayer.css('background-image', "url('" + imageUrl + "')");
        backdropImgSecondLayer.animate({
            left: '137px'
        }, {
            duration: 400,
            easing: 'linear'
        });
        backdropImg.fadeTo(550, 0.3, function() {
        });
    }

    $("#dvSeparatorImg").show();
    $("#" + this.navIdSportsList + " ul li").each(function() {
        jQuery(this).removeClass('active');
    });
    $(params).parent().addClass('active');
    GlobalConfigurationData.displaySlideImageFirstTime = 1;
};

/**
 * Sets the HTML for Gender and binds click event
 * 
 * @param {sportGender} gender for selected sports
 * @returns {void}
 */
Sports.prototype.setSportGenderHTML = function(sportGender) {
    var thisObject = this;
    var genderText = '';
    var dvSportGenderDisplayName = $('#dvSportGenderDisplayName');
    var dvSportGenderList = $('#dvSportGenderList');
    var dvSportGenderCaption = $('#dvSportGenderCaption');
    dvSportGenderDisplayName.html(sportGender.Name);
    dvSportGenderList.html('');
    $.each(sportGender.GenderTypes, function(i, gender) {
        if (gender.Id == CONFIG.get('SPORT_GENDER_ID_MALE') || gender.Id == CONFIG.get('SPORT_GENDER_ID_FEMALE')) {
            if (genderText != '')
                genderText += "/";
            genderText += gender.Name;
            var genderClassName = '';
            if (gender.Id == CONFIG.get('SPORT_GENDER_ID_FEMALE')) {
                genderClassName = 'btnFemale';
            } else {
                genderClassName = 'btnMale';
            }

            $('<a/>').attr({
                'href': '',
                'class': 'btnGender ' + genderClassName,
                'genderId': gender.Id
            }).appendTo(dvSportGenderList);
        }
    });
    $('#dvSportGenderCaption').fadeOut();
    dvSportGenderCaption.html('Select ' + genderText + ' to Start Designing.');
    $('#dvSportGenderCaption').fadeIn(1000);

    $("#dvSportGenderList a").on("click", function() {
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var categoryInfo = {
            'Id': sportGender.Id,
            'Name': sportGender.Name,
            "GenderTypes": sportGender.GenderTypes,
            'showInfoColorLink': false
        };
        var genderId = $(this).attr('genderId');
        var youthGenderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_MALE');
        var genderInfo = jQuery.map(sportGender.GenderTypes, function(obj) {
            if (obj.Id == genderId) {
                return obj;
            }
        });
        genderInfo = {
            'Id': genderInfo[0].Id,
            'Name': genderInfo[0].Name
        };

        //youth gender cases
        if (genderId == CONFIG.get('SPORT_GENDER_ID_MALE')) {
            youthGenderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_MALE');  //youth male case
        } else {
            youthGenderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_FEMALE'); // youth feamale case
        }
        var youthGenderInfo = jQuery.map(sportGender.GenderTypes, function(obj) {
            if (obj.Id == youthGenderId) {
                return obj;
            }
        });
        youthGenderInfo = {
            'Id': youthGenderInfo[0].Id,
            'Name': youthGenderInfo[0].Name
        };

        if (categoryInfo.Name == CONFIG.get('BASEBALL_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(false);
            categoryInfo.showInfoColorLink = false;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = false;
            $('.configuratorPanel').css('background', 'url(images/Baseball_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Baseball_background.png)');
        } else if (categoryInfo.Name == CONFIG.get('BASKETBALL_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(true);
            categoryInfo.showInfoColorLink = true;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = true;
            $('.configuratorPanel').css('background', 'url(images/Basketball_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Basketball_background.png)');
        } else if (categoryInfo.Name == CONFIG.get('FANWAER_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(false);
            categoryInfo.showInfoColorLink = false;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = false;
            $('.configuratorPanel').css('background', 'url(images/Fanwear_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Fanwear_background.png)');
        } else if (categoryInfo.Name == CONFIG.get('FOOTBALL_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(true);
            categoryInfo.showInfoColorLink = true;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = true;
            $('.configuratorPanel').css('background', 'url(images/Football_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Football_background.png)');
        } else if (categoryInfo.Name == CONFIG.get('HOCKEY_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(false);
            categoryInfo.showInfoColorLink = false;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = false;
            $('.configuratorPanel').css('background', 'url(images/Hockey_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Hockey_background.png)');
        } else if (categoryInfo.Name == CONFIG.get('LACROSSE_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(true);
            categoryInfo.showInfoColorLink = true;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = true;
            $('.configuratorPanel').css('background', 'url(images/Lacrosse_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Lacrosse_background.png)');
        } else if (categoryInfo.Name == CONFIG.get('SIDELINE_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(false);
            categoryInfo.showInfoColorLink = false;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = false;
            $('.configuratorPanel').css('background', 'url(images/Sideline_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Sideline_background.png)');
        } else if (categoryInfo.Name == CONFIG.get('SOCCER_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(true);
            categoryInfo.showInfoColorLink = true;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = true;
            $('.configuratorPanel').css('background', 'url(images/Soccer_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Soccer_background.png)');
        } else if (categoryInfo.Name == CONFIG.get('SOFTBALL_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(true);
            categoryInfo.showInfoColorLink = true;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = true;
            $('.configuratorPanel').css('background', 'url(images/Softball_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Softball_background.png)');
        } else if (categoryInfo.Name == CONFIG.get('TRACK_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(true);
            categoryInfo.showInfoColorLink = true;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = true;
            $('.configuratorPanel').css('background', 'url(images/Track_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Track_background.png)');
        } else if (categoryInfo.Name == CONFIG.get('VOLLEYBALL_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(false);
            categoryInfo.showInfoColorLink = false;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = false;
            $('.configuratorPanel').css('background', 'url(images/Volleyball_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Volleyball_background.png)');
        } else if (categoryInfo.Name == CONFIG.get('WRESTLING_STRING')) {
            GlobalInstance.uniformConfigurationInstance.setShowInfoColorLink(false);
            categoryInfo.showInfoColorLink = false;
            thisObject.sportsList['_' + categoryInfo.Id].showInfoColorLink = false;
            $('.configuratorPanel').css('background', 'url(images/Wrestling_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Wrestling_background.png)');
        } else {
            $('.configuratorPanel').css('background', 'url(images/Football_background.png)');
            $('#dvRosterPanel').css('background', 'url(images/Football_background.png)');
        }

        /**************************************/
        $('#dvIdSportsNameDisplay').html(categoryInfo.Name.toUpperCase());
        //set category information
        GlobalInstance.uniformConfigurationInstance.setCategoryInfo(categoryInfo);
        //set gender information
        GlobalInstance.uniformConfigurationInstance.setGenderInfo(genderInfo);
        //Set Youth Gender information
        GlobalInstance.uniformConfigurationInstance.setYouthGenderInfo(youthGenderInfo);

        //$('#blanket').show();
        //$('#blanket').hide();
        GlobalInstance.styleAndDesignInstance = GlobalInstance.getStyleAndDesignInstance();
        GlobalInstance.styleAndDesignInstance.init();

        /****** Google Analytics ***********/
        // Call Google Analytics
        GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
        GlobalInstance.googleAnalyticsUtilInstance.trackSportGenderClicks(sportGender.Name, genderInfo.Name);
        GlobalInstance.googleAnalyticsUtilInstance.trackDefineClicks();

        return false;
    });
};

/**
 * Display effect on 'click sport to begin' text
 * 
 * @returns {void}
 */
Sports.prototype.displayEffectClickSportToBegin = function() {
    $("#dvClickSportToBegin").css('left', '0px');
    $("#dvClickSportToBegin").animate({
        height: '27px',
        width: '340px'
    }, {
        duration: 500,
        easing: 'swing'
    });
};

/**
 * This method is responsible for preloading of the Sports background and button images.
 * @return void
 */
Sports.prototype.preCacheSportImage = function() {
    var sportCategoryImgOnject = $('<div/>');
    var imgObject = $('<div/>');
    var arrSportsGenderImage = new Array();
    var imgPath = '';
    $.each(this.sportsList, function(i, sportsList) {
        imgPath = CONFIG.get('BASE_URL') + CONFIG.get('IMAGE_DIR') + SPORTS_BACKGROUND_IMAGE.get(sportsList.Name);
        $('<img/>').attr('src', imgPath).appendTo(sportCategoryImgOnject);
        $.each(sportsList.GenderTypes, function(j, gender) {
            arrSportsGenderImage[gender.Id] = gender.Id;
        });
    });
    var genderClassName = '';
    $.each(arrSportsGenderImage, function(j, genderId) {
        if (genderId) {
            if (genderId === CONFIG.get('SPORT_GENDER_ID_FEMALE')) {
                genderClassName = 'btnFemale';
            } else {
                genderClassName = 'btnMale';
            }
            var imgTag = $('<img/>').attr('class', 'btnGender ' + genderClassName).appendTo(imgObject);
        }
    });

    if (imgObject.length) {
        imgObject.remove();
    }

    var imageArray = this.getImageArray();
    imgPath = '';
    $.each(imageArray, function(i, image) {
        imgPath = CONFIG.get('BASE_URL') + CONFIG.get('IMAGE_DIR') + image;
        var imgTag = $('<img/>').attr('src', imgPath).appendTo(imgObject);
    });

    if (imgObject.length) {
        imgObject.remove();
    }

    if (sportCategoryImgOnject.length) {
        sportCategoryImgOnject.remove();
    }

};

/**
 * This method is responsible for returing the Sport Info 
 * @param sportId - Selected Sport Id 
 * @returns sportObject 
 */
Sports.prototype.getSelectedCategoryInfo = function(sportId) {
    return this.sportsList['_' + sportId];
};

/**
 * This method is responsible for returning the array that contains the all images that are present in the local directory
 * @returns imageArray 
 */
Sports.prototype.getImageArray = function() {
    var imageArray = ['liveChatButton.png', 'liveChatButton_hover.png', 'large_view_button_normal.png', 'large_view_button_hover.png', 'hover.png', 'visit_my_locker.png', 'visit_my_locker_hover.png', 'btnok.png', 'btnok_hover.png', 'active.png', 'inactive.png', 'Adult_bottom.png', 'Adult_top.png', 'Baseball_background.png', 'Basketball_background.png', 'Close_Box.png',
        'Fanwear_background.png', 'Football_background.png', 'Hockey_background.png', 'Lacrosse_background.png',
        'Rosterpupupbg.png', 'ShowMeButton.png', 'ShowMeButton_hover.png', 'Sideline_background.png', 'Soccer_background.png',
        'Softball_background.png', 'Track_background.png', 'Volleyball_background.png', 'Wrestling_background.png', 'active.png',
        'add.png', 'addHover.png', 'ancerPointBgImage.png', 'anchorPointPreviewImage.png', 'anchorPoint_available.png', 'anchorPoint_occupied.png',
        'anchorPoint_selected.png', 'applyOnUniform.png', 'applyOnUniformHover.png', 'apply_hover.png', 'applybtn.png', 'approvalOptionSectionHeading.png',
        'approvelater.png', 'approvenow.png', 'approveoptionlabel.png', 'arrorosterpupup.png', 'backBtn.png', 'backBtn_hover.png', 'back_button.png',
        'back_button_hover.png', 'bg-scrollbar-thumb-y.png', 'bg-scrollbar-track-y.png', 'bg-scrollbar-trackend-y.png', 'bird_eye_side.png', 'brows.png', 'browseButton.png',
        'browseButton_hover.png', 'browseButton_roster.png', 'btnContinue.png', 'btnContinue_hover.jpg', 'btnContinue_hover.png', 'btnCustomize.png',
        'btnCustomize_hover.png', 'btnEmail.png', 'btnFemaleSelected.png', 'btnFemaleUnselected.png', 'btnFinalSteps.png', 'btnFinalSteps_hover.png', 'btnMaleSelected.png',
        'btnMaleUnselected.png', 'btnPrint.png', 'btnSave.png', 'button.png', 'cancel.png', 'cancelButton.png', 'cancelHover.png', 'carouselbg_dummy.png',
        'cart.png', 'cartseperator.png', 'chooseYourFabricSectionBG.png', 'ciSectionHeading.png', 'clear_roster.png', 'clear_rosterHover.png', 'close.png',
        'closeHover.png', 'closeIcon.png', 'closeWindowHover.png', 'closeWindowNormal.png', 'closebox.png', 'closeboxNormal.png', 'closeboxhover.png', 'configuratorBG.png',
        'creatUnifoem.png', 'creatUnifoemHover.png', 'createuniformbutton.png', 'createuniformbutton_hover.png', 'currentSelectedTransperant.png', 'customizeGraphic.png', 'customizeGraphicHover.png',
        'cut_highlighted.png', 'dark-check-green.png', 'decorate_grayed_out.png', 'decorate_highlighted.png', 'delete.png', 'deleteButton.png', 'deleteHover.png', 'delete_button_hover.png', 'design_grayed_out.png',
        'email.png', 'emailHover.png', 'emailHeaderGraphic.gif', 'emailbtn.png', 'enlargeIcon.png', 'error-icon.png', 'flip.png', 'flipHover.png', 'fontDropDownBG.png', 'footballFittedSleeve.png', 'footballWideSleeve.png',
        'genderBox.png', 'goShopingCart.png', 'goShopingCartHover.png', 'go_button_hover.png', 'go_button_normal.png', 'gotocartbutton.png', 'gotocartbutton_hover.png', 'imageCriteria_Image_Pre.jpg', 'message.png', 'messageHover.png',
        'minus.png', 'modifyUniformBtn.png', 'modifyUniformBtn_hover.png', 'okButton.png', 'okButton_hover.png', 'okbtn.png', 'okbtnHover.png', 'personalize_highlighted.png', 'personlize_grayed_out.png', 'plus.png', 'pre.png', 'preHover.png'
                , 'printImageNormal.png', 'printImageHover.png', 'print_button.png', 'print_button_hover.png', 'proof.jpg', 'proofHover.png', 'proofModel.png', 'proofSectionHeading.png', 'saveButton.png', 'saveButtonHover.png', 'saveForNow.png',
        'saveHover.png', 'sizeProofBtn.png', 'sizeProofBtn_hover.png', 'theEye.png', 'theEyeHover.png', 'undo.png', 'undoHover.png', 'undoImage.png', 'undodisable.png', 'uploadButton.png', 'uploadButton_hover.png', 'uploadImage.png', 'uploadImageHover.png',
        'uploadroster_btn.png', 'uploadroster_btn_hover.png', 'specify_location_hover.png', 'mdify.jpg', 'mdifyhover.jpg', 'specify_location_size.png'];

    return imageArray;
};