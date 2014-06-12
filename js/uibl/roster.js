/**
 * TWA proshpere configurator
 * 
 * roster.js is used to define roster related functions. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 *
 * @return void
 */
function Roster() {
    this.objUtility = new Utility();
    this.requestUrlForGarmentSize = WEB_SERVICE_URL.get("GET_GARMENT_SIZES");
    this.garmentSizes = new Object();
    this.objUtility = new Utility();
    this.responseType = 'json';
    this.isYouthExistsInRosterList = false;
    this.tblRosterPlayerBox = 'tblRosterPlayerBox';
    this.topSizeList = new Object();
    this.bottomSizeList = new Object();
    this.selectedStyle = new Object();
    this.youthSelectedStyle = new Object();
    this.designInfo = new Object();
    this.rosterList = new Object();
    this.savedRosterList = new Object();
    this.uploadRosterList = new Object();
    this.isSaveRosterList = false;
    this.isUploadRosterList = false;
    this.lastPlayerId = 1;
    this.ageCategory = '';
    this.fabricInfo = new Object();
    this.playerListForSizeProof = new Array();
    this.slectedPlayerRowNumber = new Array();
    this.dvTeamRosterInfoOnProof = 'dvTeamRosterInfoOnProof';
    this.isSetjcarousel = false;
    this.isFootballQBLearnMoreLinkVisible = false;
    this.isBasketballYouthBottomLabelToBeShown = false;
    this.firstTimeInit = true;
    this.selectedSizeForTop = null;
    this.selectedSizeForBottom = null;
    this.playerNameCheckCount = 0;
    this.currentSelectedSize = null;
    this.displayErrorTooltip = false;
    this.rosterUrl = "";
    this.currentObjectNumber = 0;
    this.isQuoteBtnClicked = false;
    this.isGotoShoppingCartClicked = false;
    this.isPreviewRosterClicked = false;
    this.isPrintButtonEnabled = false;
    this.saveRosterCallback = null;
    this.arrYouthSizeProofInfo = new Array();
    this.arrAdultSizeProofInfo = new Array();
}


/*
 * This method initialize the roster
 * @return void
 */
Roster.prototype.init = function () {
    this.isPreviewRosterClicked = false;
    this.getSavedRosterPlayer();
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    GlobalInstance.shoppingCartInstance = GlobalInstance.getShoppingCartInstance();
    // get Selected gender list
    var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
    this.fabricInfo = GlobalInstance.uniformConfigurationInstance.getFabricsInfo();
    this.selectedStyle = GlobalInstance.getStyleAndDesignInstance().getSelectedStyle();
    this.youthSelectedStyle = GlobalInstance.getStyleAndDesignInstance().getYouthStyleInfoByStyleId(this.selectedStyle.StyleId);
    //this.designInfo = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
    var isTopEmpty = false;
    var isBotttomEmpty = false;
    var maleId = CONFIG.get("SPORT_GENDER_ID_MALE");
    var boysId = CONFIG.get("SPORT_GENDER_ID_YOUTH_MALE");
    var womanId = CONFIG.get("SPORT_GENDER_ID_FEMALE");
    var girlId = CONFIG.get("SPORT_GENDER_ID_YOUTH_FEMALE");
    $('#txtNumberOfRosterPlayer').val('1');
    $("#txtNumberOfRosterPlayer").addClass('normalTextBox');
    //check that Youth Male or Female
    if (this.firstTimeInit) {
        this.ageCategory += '<option value="">Select</option>';
        if (genderInfo.Id == maleId) {
            if (Utility.getObjectlength(this.topSizeList["_" + maleId]) <= 0 && Utility.getObjectlength(this.topSizeList["_" + boysId]) <= 0) {
                isTopEmpty = true;
            }
            if (Utility.getObjectlength(this.bottomSizeList["_" + maleId]) <= 0 && Utility.getObjectlength(this.bottomSizeList["_" + boysId]) <= 0) {
                this.selectedStyle.MatchingBottomStyleId = 0;
                isBotttomEmpty = true;
            }
            this.ageCategory += '<option value="' + maleId + '">Men</option>';
            this.ageCategory += '<option value="' + boysId + '">Boys</option>';
        } else if (genderInfo.Id == womanId) {
            if (Utility.getObjectlength(this.topSizeList["_" + womanId]) <= 0 && Utility.getObjectlength(this.topSizeList["_" + girlId]) <= 0) {
                isTopEmpty = true;
            }
            if (Utility.getObjectlength(this.bottomSizeList["_" + womanId]) <= 0 && Utility.getObjectlength(this.bottomSizeList["_" + girlId]) <= 0) {
                this.selectedStyle.MatchingBottomStyleId = 0;
                isBotttomEmpty = true;
            }
            this.ageCategory += '<option value="' + womanId + '">Women</option>';
            this.ageCategory += '<option value="' + girlId + '">Girls</option>';
        }
        this.bindRosterScreenButtons();
    }
    if (isBotttomEmpty && isTopEmpty) {
        return false;
    }
    if (!(this.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM'))) {
        $('.bottomSize').hide();
    }

    //set html and design
    this.setHtmlAndBind();
    //display orientation    
    //display notification.
    this.displayRosterNotification();
    $(document).trigger("bindHelpButton", null);
    this.displayRosterFabric();
    this.displayRosterOrderName();
    this.displayRosterTeamName();
    this.displayPlayerNameAndNumber();

    //upload url
    this.rosterUploadUrl();
    var previewImages = GlobalInstance.getStyleAndDesignInstance().getBirdEyePreviewImageList();
    var totalViews = Utility.getObjectlength(previewImages['_' + this.selectedStyle.StyleId]);

    if (GlobalInstance.uniformConfigurationInstance.getBottomAvailable() == false) {
        $('.bottomSize').hide();
    } else {
        $('.bottomSize').show();
    }

    if (GlobalInstance.uniformConfigurationInstance.getTopAvailable() == false) {
        $('.topSize').hide();
    } else {
        $('.topSize').show();
    }

    this.customUniformTotal();

    //Check that if style is updated or not;
    var selectedStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo(); //Get the Selected Style
    var previousSelectedStyle = GlobalInstance.getStyleAndDesignInstance().previousSelectedStyle;
    if (Utility.getObjectlength(previousSelectedStyle) > 0 && selectedStyle.StyleId != previousSelectedStyle.StyleId) {
        var thisObject = this;
        this.saveRosterCallback = function () {
            //Update the Roster Information
            thisObject.updateRosterInformation(selectedStyle);
        }

        //Call the Save Roster to Get the Existing Player Information in the Roster List
        this.saveRoster(true);
    }

    $(document).trigger("hideCustomizeButtons");
};
/**
 * Sets the roster list HTML and binds the click event
 *
 * @return void
 */
Roster.prototype.setHtmlAndBind = function () {
    var thisObject = this;
    // add default player html 
    if (this.firstTimeInit) {
        this.addRosterPlayer(CONFIG.get('DEFAULT_ROSTER_PLAYER'), false);
        this.firstTimeInit = false;
    } else {
        this.changeFabricPrice();
    }
    var curPlayerId = 0;
    //$('.setRow ,.whiteRow ,.greyRow').on('click focus', function (e) {
    $(document).on('click focus', ".setRow ,.whiteRow ,.greyRow", function (e) {
        var playerId = $('#' + e.target.id).attr('playerid');
        if (curPlayerId != playerId) {
            var targetId = $('#rosterPlayer_' + $('#' + e.target.id).attr('playerid'));
            $('.setRow ,.whiteRow ,.greyRow').removeClass('active');
            $('#' + e.target.id).addClass('active');
            $('#rosterPlayer_' + $('#' + e.target.id).attr('playerid')).addClass('active');
            curPlayerId = playerId;
        }
    });
    // Bind event 
    // save data for test box
    $(document).on('change blur', ".playerName", function () {
        try {
            var currentPlayerId = $(this).parent().parent().attr('id');
            currentPlayerId = currentPlayerId ? currentPlayerId.replace('rosterPlayer_', '') : 0;
            thisObject.saveRosterPlayer(currentPlayerId);
            return false;
        } catch (err) {

        }
    });

 
    $(document).on('change blur', ".playerNumber", function () {
        
        var currentPlayerId = $(this).parent().parent().attr('id');
        //var specialCharInfor = CONFIG.get('NOT_ALLOWED_SPECIAL_CHARACTER_PLAYER_ROSTER');
        
        currentPlayerId = currentPlayerId ? currentPlayerId.replace('rosterPlayer_', '') : 0;
        thisObject.saveRosterPlayer(currentPlayerId);
        return false;
    });

    //Change the price and save 
    $(document).off('change', ".playerTopSize");
    $(document).on('change', ".playerTopSize", function () {
        // change the price with Qty.        
        var currentPlayerId = $(this).attr('id');
        currentPlayerId = currentPlayerId ? currentPlayerId.replace('selPlayerTopSize_', '') : 0;
        var currentSizeId = $('#selPlayerTopSize_' + currentPlayerId).val();
        var qty = $("#txtPlayerTopQuantity_" + currentPlayerId).val();
        var ageCategory = $('#selPlayerAgeCategory_' + currentPlayerId).val();
        var price = GlobalInstance.shoppingCartInstance.getFabricPrice(thisObject.topSizeList, ageCategory, currentSizeId);
        var totalPrice = (parseFloat(qty) > 1) ? parseFloat(price) * parseFloat(qty) : parseFloat(price);
        var toFixedTotalPrice = totalPrice.toFixed(2);
        $("#txtPlayerTopPrice_" + currentPlayerId).val('$' + toFixedTotalPrice);
        $('#txtPlayerTopPrice_' + currentPlayerId).attr({
            'alt': '$' + toFixedTotalPrice,
            'title': '$' + toFixedTotalPrice
        });
        //updated the price
        thisObject.subTotalTopPrice();
        thisObject.subTotalTopQuantity();
        thisObject.customUniformTotal();
        thisObject.saveRosterPlayer(currentPlayerId);
        return false;
    });
    //change the price and save 
    $(document).off('change', ".playerBottomSize");
    $(document).on('change', ".playerBottomSize", function () {
        //save 
        // change the price with Qty.        
        var currentPlayerId = $(this).attr('id');
        currentPlayerId = currentPlayerId ? currentPlayerId.replace('selPlayerBottomSize_', '') : 0;
        var currentSizeId = $('#selPlayerBottomSize_' + currentPlayerId).val();
        var qty = $("#txtPlayerBottomQuantity_" + currentPlayerId).val();
        var ageCategory = $('#selPlayerAgeCategory_' + currentPlayerId).val();
        var price = GlobalInstance.shoppingCartInstance.getFabricPrice(thisObject.bottomSizeList, ageCategory, currentSizeId);
        var totalPrice = (parseFloat(qty) > 1) ? parseFloat(price) * parseFloat(qty) : parseFloat(price);
        var toFixedTotalPrice = totalPrice.toFixed(2);
        $("#txtPlayerBottomPrice_" + currentPlayerId).val('$' + toFixedTotalPrice);
        $('#txtPlayerBottomPrice_' + currentPlayerId).attr({
            'alt': '$' + toFixedTotalPrice,
            'title': '$' + toFixedTotalPrice
        });
        thisObject.saveRosterPlayer(currentPlayerId);
        //updated the price
        thisObject.subTotalBottomPrice();
        thisObject.subTotalBottomQuantity();
        thisObject.customUniformTotal();
        thisObject.saveRosterPlayer(currentPlayerId);
        return false;
    });
    //********* If bottom avaiable ***********//
    // Age Category Change
    $(document).off('change', ".playerAgeCategory");
    $(document).on('change', ".playerAgeCategory", function () {
        Log.trace('Player age category change event called')
        var selected = $(this).val();
        var currentPlayerId = $(this).attr('id');
        currentPlayerId = currentPlayerId ? currentPlayerId.replace('selPlayerAgeCategory_', '') : 0;
        thisObject.bindPlayerSizeHtml(selected, currentPlayerId);
        //save 
        thisObject.saveRosterPlayer(currentPlayerId);
        return false;
    });
    //Show delete button
    $(document).off('click', ".deletePlayer");
    $(document).on('click', ".deletePlayer", function () {
        // Display confirmation dialog box.
        thisObject.playerNameCheckCount = 0;
        $("input[name='player[delete][]']").each(function () {
            if ($(this).is(":checked")) {
                thisObject.playerNameCheckCount++;
            }
        });
        if (thisObject.playerNameCheckCount > 0) {
            $('#btnDeletePlayer').addClass('deleteButton');
        } else {
            $('#btnDeletePlayer').removeClass('deleteButton');
        }
    });
    // Delete roster Player
    $(document).off('click', ".deleteButton");
    $(document).on('click', ".deleteButton", function () {
        // Display confirmation dialog box.
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = function () {
            $("input[name='player[delete][]']").each(function () {
                if ($(this).is(":checked")) {
                    thisObject.playerNameCheckCount--;
                    //display button 
                    var id = $(this).attr('id').substring($(this).attr('id').indexOf('_') + 1);
                    $('#rosterPlayer_' + id).remove();
                    currentPlayerId = $(this).parent().parent().attr('playerid');
                    delete thisObject.rosterList[currentPlayerId];
                    thisObject.lastPlayerId = parseInt(thisObject.lastPlayerId) - 1;
                }
            });
            //Show Hide the Delete button.
            if (thisObject.playerNameCheckCount === 0) {
                $('#btnDeletePlayer').removeClass('deleteButton');
            }
            //Update the price
            thisObject.subTotalTopPrice();
            thisObject.subTotalTopQuantity();
            thisObject.subTotalBottomPrice();
            thisObject.subTotalBottomQuantity();
            thisObject.customUniformTotal();
        };
        GlobalInstance.dialogBoxInstance.funcCallBackForCancel = null;
        GlobalInstance.dialogBoxInstance.displayConfirmationDialogBox(TITLE.get('TITLE_REMOVE_PLAYER'), MESSAGES.get('MESSAGE_REMOVE_PLAYER'));
        return false;
    });
    //subtotoal for Qty.
    $(document).on('keypress', '.playerTopQuantity', function (e) {
        var qty = $(this).val();
        if (qty == 0) {
            $(this).val('');
        }
        thisObject.subTotalTopQuantity();
    });
    $(document).on('keyup blur', ".playerTopQuantity", function (e) {
        //save         
        var currentPlayerId = $(this).parent().parent().attr('playerid');
        var qty = $(this).val();
        var regex = /^[0-9]{1,3}$/
        if (!Utility.checkRegularExpression(e.target.id, regex)) {
            $(this).val(0);
        }
        // get top price
        var playerTopPricePerSize = thisObject.getSelectedRecordPrice(currentPlayerId, true);
        if (!$.isNumeric(qty)) {
            $(this).val(0);
        }
        if (qty == '' && qty == null || playerTopPricePerSize == null || playerTopPricePerSize == '' || playerTopPricePerSize == 0) {
            return false;
        }

        var topPrice = (parseFloat(qty) * parseFloat(playerTopPricePerSize));
        var toFixedtopPrice = topPrice.toFixed(2);
        $('#txtPlayerTopPrice_' + currentPlayerId).val('$' + toFixedtopPrice).attr({
            'alt': '$' + toFixedtopPrice,
            'title': '$' + toFixedtopPrice
        });
        thisObject.saveRosterPlayer(currentPlayerId);
        thisObject.subTotalTopPrice();
        thisObject.subTotalTopQuantity();
        thisObject.customUniformTotal();
        return false;
    });
    $(document).on('keypress', '.playerBottomQuantity', function (e) {
        var qty = $(this).val();
        if (qty == 0) {
            $(this).val('');
        }
        thisObject.subTotalTopQuantity();
    });
    $(document).on('keyup blur', ".playerBottomQuantity", function (e) {
        var currentPlayerId = $(this).parent().parent().attr('playerid');
        var qty = $(this).val();
        var regex = /^[0-9]{1,3}$/
        if (!Utility.checkRegularExpression(e.target.id, regex)) {
            $(this).val(0);
        }
        var pricePerSize = thisObject.getSelectedRecordPrice(currentPlayerId, false);
        if (!$.isNumeric(qty)) {
            $(this).val(0);
        }
        if (qty == '' && qty == null || pricePerSize == null || pricePerSize == '' || pricePerSize == 0)
            return false;
        var bottomPrice = (parseFloat(qty) * parseFloat(pricePerSize));
        var toFixedbottomPrice = bottomPrice.toFixed(2);
        $('#txtPlayerBottomPrice_' + currentPlayerId).val('$' + toFixedbottomPrice);
        $('#txtPlayerBottomPrice_' + currentPlayerId).attr({
            'alt': '$' + toFixedbottomPrice,
            'title': '$' + toFixedbottomPrice
        });
        thisObject.saveRosterPlayer(currentPlayerId);
        //subtotoal for Qty.
        thisObject.subTotalBottomPrice();
        thisObject.subTotalBottomQuantity();
        thisObject.customUniformTotal();
    });
    //model preview event
    $(document).off('click', ".previewPlayer");
    $(document).on('click', ".previewPlayer", function () {
        var currentPlayerId = $(this).parent().parent().attr('playerid');
        thisObject.updateRosterModelPreview(currentPlayerId, true);
        //set 
        $('.rosterTableWhiteRow').removeClass('active');
        $('.rosterTableGreyRow').removeClass('active');
        $('#rosterPlayer_' + currentPlayerId).addClass('active');
        return false;
    });
    //addPlayerEmail
    $(document).off('click', ".addPlayerEmail");
    $(document).on('click', ".addPlayerEmail", function () {
        $('#blanket').show();
        var currentPlayerId = $(this).parent().parent().parent().attr('playerid');
        if (currentPlayerId == null || currentPlayerId == '') {
            return false;
        }
        $("#dvPlayerEmail_" + currentPlayerId).show();
        $(".rosterpupupEmailInput").focus();
        return false;
    });
    $(document).off('click', ".rosterpupupEmailInput");
    $(document).on('click', ".rosterpupupEmailInput", function () {
        $(".rosterpupupEmailInput ").css("outline-color", "#49aeec");
    });
    // change apply image
    $(document).on('keypress focus blur', ".playerEmail", function () {
        var currentPlayerId = $(this).attr('id');
        currentPlayerId = currentPlayerId ? currentPlayerId.replace('txtPlayerEmail_', '') : 0;
        if (!Utility.checkFieldEmpty("txtPlayerEmail_" + currentPlayerId)) {
            $('#playerEmailPupupokBtn_' + currentPlayerId).removeClass('EmailPupupokBtn').addClass('EmailPupupApplyBtn');
        } else {
            $('#playerEmailPupupokBtn_' + currentPlayerId).removeClass('EmailPupupApplyBtn').addClass('EmailPupupokBtn');
        }
    });
    //ok button functionality 
    //check email error 
    //save email 
    //close box    
    $(document).off('click', ".EmailPupupokBtn, .EmailPupupApplyBtn");
    $(document).on('click', ".EmailPupupokBtn, .EmailPupupApplyBtn", function () {
        var currentPlayerId = $(this).attr('id');
        currentPlayerId = currentPlayerId ? currentPlayerId.replace('playerEmailPupupokBtn_', '') : 0;
        //check email 
        if (!Utility.checkFieldEmpty("txtPlayerEmail_" + currentPlayerId) && !Utility.checkValidEmail("txtPlayerEmail_" + currentPlayerId)) {
            $(document).on("mouseover", ".rosterpupupEmailInput", function (e) {
                var emailId = $.trim($('#' + e.target.id).val());
                thisObject.EmailValidation(emailId, e.target.id, 'dvEmailErrorBoxRoster_' + currentPlayerId, false, true);
                return;
            });
            $(document).on("mouseout", ".rosterpupupEmailInput", function (e) {
                var emailId = $.trim($('#' + e.target.id).val());
                thisObject.EmailValidation(emailId, e.target.id, 'dvEmailErrorBoxRoster_' + currentPlayerId, false, false);
                return;
            });

            /* This code suppose to be there but commented because not in the client existing application
             $(document).on("input", ".rosterpupupEmailInput", function(e) {
             var emailId = $.trim($('#' + e.target.id).val());
             thisObject.EmailValidation(emailId, e.target.id, 'dvEmailErrorBoxRoster_' + currentPlayerId, false, true);
             return;
             });*/

            $('#txtPlayerEmail_' + currentPlayerId).addClass('error');
            return false;
        } else {
            $('#txtPlayerEmail_' + currentPlayerId).removeClass('error');
            var email = $('#txtPlayerEmail_' + currentPlayerId).val();
            //save email 
            thisObject.rosterList[currentPlayerId].setPlayerEmailFieldInfo(email);
            //close blanket 
            $('#blanket').hide();
            //close email popup
            $("#dvPlayerEmail_" + currentPlayerId).hide();
        }
    });
};
/**
 * Save Roster Player values
 * 
 * @return void
 */
Roster.prototype.saveRosterPlayer = function (playerId) {
    currentRow = this.rosterList[playerId];
    currentRow.setPlayerNameInfo($('#txtPlayerName_' + playerId).val());
    currentRow.setPlayerNumberInfo($('#txtPlayerNumber_' + playerId).val());
    //check seleted value 
    var playerAgeCategory = $('#selPlayerAgeCategory_' + playerId).val();
    var playerAgeCategoryValue = (playerAgeCategory != '' && playerAgeCategory != null) ? ($('#selPlayerAgeCategory_' + playerId + ' option:selected').text()) : null;
    var playerTopSize = $('#selPlayerTopSize_' + playerId + ' option:selected').val();
    currentRow.setPlayerAgeCategoryInfo(playerAgeCategoryValue);
    currentRow.setPlayerTopInfo('size', playerTopSize);
    currentRow.setPlayerTopInfo('quantity', $('#txtPlayerTopQuantity_' + playerId).val());
    var price = GlobalInstance.shoppingCartInstance.getFabricPrice(this.topSizeList, playerAgeCategory, playerTopSize);
    currentRow.setPlayerTopInfo('price', price);
    currentRow.setPlayerTopInfo('skuId', "");
    currentRow.setPlayerTopInfo('thumbnailUrl', "");
    currentRow.setPlayerTopInfo('productionUrl', "");
    if (this.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) {
        var playerBottomSize = $('#selPlayerBottomSize_' + playerId + ' option:selected').val();
        var price = GlobalInstance.shoppingCartInstance.getFabricPrice(this.bottomSizeList, playerAgeCategory, playerBottomSize);
        currentRow.setPlayerBottomInfo('size', playerBottomSize);
        currentRow.setPlayerBottomInfo('quantity', $('#txtPlayerBottomQuantity_' + playerId).val());
        currentRow.setPlayerBottomInfo('price', price);
        currentRow.setPlayerBottomInfo('skuId', "");
        currentRow.setPlayerBottomInfo('thumbnailUrl', "");
        currentRow.setPlayerBottomInfo('productionUrl', "");
    }
};
/**
 * Find out selected size for top from dropdown in roster screen 
 * 
 * @param selTag
 * @returns {void}
 */
function displayResultTop(selTag) {
    this.selectedSizeForTop = selTag.options[selTag.selectedIndex].text;
}
;

/**
 * Find out selected size fro bottomfrom dropdown in roster screen 
 * 
 * @param selTag
 * @returns {void}
 */
function displayResultBottom(selTag) {
    this.selectedSizeForBottom = selTag.options[selTag.selectedIndex].text;
}
;

/**
 * Add new Player Html 
 * 
 * @return void
 */
Roster.prototype.addRosterPlayer = function (numberOfRosterPlayer, isNew) {

    var thisObject = this;
    var numberOfPlayer = Utility.getObjectlength(this.rosterList);
    // make top and bottom list and bind with html.    
    if ((this.isSaveRosterList && !isNew) || (this.isUploadRosterList && !isNew)) {
        if (this.isSaveRosterList)
            var rosterList = thisObject.savedRosterList;
        if (this.isUploadRosterList) {
            var rosterList = thisObject.uploadRosterList;
        }
        var counter = 0;
        $.each(rosterList, function (k, rosterPlayerList) {
            if (rosterPlayerList != null) {
                counter = parseInt(counter) + 1;
                thisObject.getUniqueObjectNumber(numberOfPlayer);
                i = thisObject.currentObjectNumber;
                thisObject.rosterList[i] = new Player();
                var rosterListHtml = thisObject.perPlayerRowHtml(i);
                // make select ageCategory
                $('#' + thisObject.tblRosterPlayerBox + " table").append(rosterListHtml);
                var playerName = null;
                var playerNumber = null;
                var playerEmailField = null;
                var ageCategory = null;
                var topSize = null;
                var topQuantity = null;
                var bottomSize = null;
                var bottomQuantity = null;
                if (thisObject.isUploadRosterList && rosterPlayerList.PlayerName != undefined && rosterPlayerList.PlayerName != null) {
                    playerName = rosterPlayerList.PlayerName;
                } else if (rosterPlayerList.name != null) {
                    playerName = rosterPlayerList.name;
                }
                // player number 
                if (thisObject.isUploadRosterList && rosterPlayerList.PlayerNumber != undefined && rosterPlayerList.PlayerNumber != null) {
                    playerNumber = rosterPlayerList.PlayerNumber;
                } else if (rosterPlayerList.number != null) {
                    playerNumber = rosterPlayerList.number;
                }

                // player EmailField 
                if (thisObject.isUploadRosterList && rosterPlayerList.PlayerEmail != undefined && rosterPlayerList.PlayerEmail != null) {
                    playerEmailField = rosterPlayerList.PlayerEmail;
                } else if (rosterPlayerList.playerEmailField != null) {
                    playerEmailField = rosterPlayerList.playerEmailField;
                }

                // player EmailField 
                if (thisObject.isUploadRosterList && rosterPlayerList.GenderDisplayName != undefined && rosterPlayerList.GenderDisplayName != null) {
                    ageCategory = rosterPlayerList.GenderDisplayName;
                } else if (rosterPlayerList.ageCategory != null) {
                    ageCategory = rosterPlayerList.ageCategory;
                }

                // Player top  Size                
                if (thisObject.isUploadRosterList && rosterPlayerList.SizeNameTop != undefined && rosterPlayerList.SizeNameTop != null) {
                    topSize = rosterPlayerList.SizeNameTop;
                } else if (rosterPlayerList.top != undefined && (rosterPlayerList.top.size != null)) {
                    topSize = rosterPlayerList.top.size;
                }

                // Player top  quantity        
                if (thisObject.isUploadRosterList && rosterPlayerList.QuantityTop != undefined && rosterPlayerList.QuantityTop != null) {
                    topQuantity = rosterPlayerList.QuantityTop;
                } else if (rosterPlayerList.top != undefined && (rosterPlayerList.top.quantity != null)) {
                    topQuantity = rosterPlayerList.top.quantity;
                }

                // Player top  Size                
                if (thisObject.isUploadRosterList && rosterPlayerList.SizeNameBottom != undefined && rosterPlayerList.SizeNameBottom != null) {
                    bottomSize = rosterPlayerList.SizeNameBottom;
                } else if (rosterPlayerList.bottom != undefined && (rosterPlayerList.bottom.size != null)) {
                    bottomSize = rosterPlayerList.bottom.size;
                }

                // Player top  quantity                
                if (thisObject.isUploadRosterList && rosterPlayerList.QuantityBottom != undefined && rosterPlayerList.QuantityBottom != null) {
                    bottomQuantity = rosterPlayerList.QuantityBottom;
                } else if (rosterPlayerList.bottom != undefined && (rosterPlayerList.bottom.quantity != null)) {
                    bottomQuantity = rosterPlayerList.bottom.quantity;
                }

                if (playerName) {
                    $('#txtPlayerName_' + i).val(playerName);
                    thisObject.rosterList[i].setPlayerNameInfo(playerName);
                }
                if (playerNumber != null) {
                    $('#txtPlayerNumber_' + i).val(playerNumber);
                    thisObject.rosterList[i].setPlayerNumberInfo(playerNumber);
                }
                //bind email and 
                if (playerEmailField != null) {
                    $('#txtPlayerEmail_' + i).val(playerEmailField);
                    $('#playerEmailPupupokBtn_' + i).removeClass('EmailPupupokBtn').addClass('EmailPupupApplyBtn');
                    thisObject.rosterList[i].setPlayerEmailFieldInfo(playerEmailField);
                }
                if (ageCategory !== null && ageCategory !== undefined) {
                    thisObject.rosterList[i].setPlayerAgeCategoryInfo(ageCategory);
                    var ageCategoryObj = $('#selPlayerAgeCategory_' + i + " option").filter(function () {
                        if (this.text == ageCategory)
                            return this;
                    });
                    ageCategoryObj.attr('selected', true);
                    // bind bottom and top.                
                    var ageCategoryId = ageCategoryObj.val() || 1;
                    if ($.isNumeric(ageCategoryId)) {
                        thisObject.bindPlayerSizeHtml(ageCategoryId, i);
                    }
                }
                if (topQuantity != null && topSize != null && (GlobalInstance.uniformConfigurationInstance.getTopAvailable() != false)) {
                    if (topQuantity != null) {
                        $('#txtPlayerTopQuantity_' + i).val(topQuantity);
                    }
                    var topSizeObj = new Object;
                    if (topSize != null) {
                        var topSizeObj = $('#selPlayerTopSize_' + i + " option").filter(function () {
                            if (thisObject.isUploadRosterList) {
                                return $(this).text() == topSize;
                            } else {
                                return $(this).val() == topSize;
                            }
                        });
                        topSizeObj.attr('selected', true);
                    }
                    var topSizeNumber = (Utility.getObjectlength(topSizeObj) > 0) ? topSizeObj.val() : CONFIG.get('DEFAULT_PRICE_SHOPPING_CART_SIZE_NUMBER');
                    var price = GlobalInstance.shoppingCartInstance.getFabricPrice(thisObject.topSizeList, ageCategoryId, topSizeNumber);
                    thisObject.rosterList[i].setPlayerTopInfo('size', topSizeNumber);
                    // get updated price    
                    if (topQuantity != null) {
                        var totalPrice = (parseFloat(topQuantity) * parseFloat(price));
                        var toFixedTotalPrice = totalPrice.toFixed(2);
                        $('#txtPlayerTopPrice_' + i).val('$' + toFixedTotalPrice);
                        $('#txtPlayerTopPrice_' + i).attr({
                            'alt': '$' + toFixedTotalPrice,
                            'title': '$' + toFixedTotalPrice
                        });
                        thisObject.rosterList[i].setPlayerTopInfo('quantity', topQuantity);
                    }

                    thisObject.rosterList[i].setPlayerTopInfo('price', price);
                }
                if (bottomQuantity != null && bottomSize != null && (thisObject.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM') && GlobalInstance.uniformConfigurationInstance.getBottomAvailable() != false)) {
                    if (bottomQuantity != null) {
                        $('#txtPlayerBottomQuantity_' + i).val(bottomQuantity);
                    }
                    var bottomSizeObj = new Object;
                    if (bottomSize != null) {
                        var bottomSizeObj = $('#selPlayerBottomSize_' + i + " option").filter(function () {
                            if (thisObject.isUploadRosterList) {
                                return $(this).text() == bottomSize;
                            } else {
                                return $(this).val() == bottomSize;
                            }
                        });
                        bottomSizeObj.attr('selected', true);
                    }
                    var bottomSizeNumber = (Utility.getObjectlength(bottomSizeObj) > 0) ? bottomSizeObj.val() : CONFIG.get('DEFAULT_PRICE_SHOPPING_CART_SIZE_NUMBER');
                    var price = GlobalInstance.shoppingCartInstance.getFabricPrice(thisObject.bottomSizeList, ageCategoryId, bottomSizeNumber);
                    thisObject.rosterList[i].setPlayerBottomInfo('size', bottomSizeNumber);
                    // get updated price    
                    if (bottomQuantity != null) {
                        var totalPrice = (parseFloat(bottomQuantity) * parseFloat(price));
                        var toFixedTotalPrice = totalPrice.toFixed(2);
                        $('#txtPlayerBottomPrice_' + i).val('$' + toFixedTotalPrice);
                        $('#txtPlayerBottomPrice_' + i).attr({
                            'alt': '$' + toFixedTotalPrice,
                            'title': '$' + toFixedTotalPrice
                        });
                        thisObject.rosterList[i].setPlayerBottomInfo('quantity', bottomQuantity);
                    }

                    thisObject.rosterList[i].setPlayerBottomInfo('price', price);
                }
                numberOfPlayer = parseInt(numberOfPlayer) + 1;
            }
        });
        thisObject.changeFabricPrice();
        this.lastPlayerId = parseInt(this.lastPlayerId) + parseInt(counter) - 1;
        if (parseInt(CONFIG.get('DEFAULT_ROSTER_PLAYER')) > parseInt(numberOfPlayer)) {
            var numberOfPlayer = (parseInt(CONFIG.get('DEFAULT_ROSTER_PLAYER')) - parseInt(numberOfPlayer));
            thisObject.addRosterPlayer(numberOfPlayer, true);
        }
    } else {
        var numberOfPlayer = this.lastPlayerId;
        var totalNumberOfRecords = Utility.getObjectlength(this.rosterList) + numberOfRosterPlayer;
        if (totalNumberOfRecords > CONFIG.get('DEFAULT_ROSTER_PLAYER')) {
            $('#tblRosterPlayerBox').css('overflow-y', 'auto');
        }
        var firstPlayerId = parseInt(numberOfPlayer);
        var lastPlayerId = parseInt(numberOfPlayer) + parseInt(numberOfRosterPlayer);
        this.lastPlayerId = parseInt(this.lastPlayerId) + parseInt(numberOfRosterPlayer);
        for (k = firstPlayerId; k < parseInt(lastPlayerId) ; k++) {
            thisObject.getUniqueObjectNumber(numberOfPlayer);
            i = thisObject.currentObjectNumber;
            this.rosterList[i] = new Player();
            var rosterListHtml = thisObject.perPlayerRowHtml(i);
            $('#' + this.tblRosterPlayerBox + " table").append(rosterListHtml);
            numberOfPlayer = parseInt(numberOfPlayer) + 1;
        }
    }
    $.doneProcess();
    // add odd even class on row
    $('#' + this.tblRosterPlayerBox + " table tr:odd").addClass('rosterTableGreyRow greyRow setRow');
    $('#' + this.tblRosterPlayerBox + " table tr:even").addClass('rosterTableWhiteRow whiteRow setRow');
    thisObject.displayTopBottom();
};
/**
 * retrun player record html
 * 
 * @param  recordNumber
 * @returns {string}
 */
Roster.prototype.perPlayerRowHtml = function (recordNumber) {
    var i = recordNumber;
    var rosterListHtml = '';
    rosterListHtml = '<tr id="rosterPlayer_' + i + '" playerId=' + i + '>';
    rosterListHtml += '<td width="80"> <INPUT type="text" value="" class="txtInputField playerName setRow" id="txtPlayerName_' + i + '" name="player[Name][]" maxlength="16"' + ' playerId=' + i + '> </td>';
    rosterListHtml += '<td width="10"> <INPUT type="text" value="" class="numberInputField playerNumber setRow" id="txtPlayerNumber_' + i + '" name="player[Number][]" maxlength="2" size="2"' + ' playerId=' + i + '></td>';
    rosterListHtml += '<td width="60" > <select class="rosterCategoryDropDown playerAgeCategory setRow" id="selPlayerAgeCategory_' + i + '" name="player[ageCategory][]" alt="Please select a Category." title="Please select a Category."' + ' playerId=' + i + '>';
    rosterListHtml += this.ageCategory;
    rosterListHtml += '</select>';
    rosterListHtml += '</td>';
    //if (true /*|| GlobalInstance.uniformConfigurationInstance.getTopAvailable() != false*/) {
    rosterListHtml += '<td width="10" class="topSize"><INPUT type="text" value="0" class="numberInputField playerTopQuantity setRow" id="txtPlayerTopQuantity_' + i + '" name="playerTop[quantity][]" maxlength="3" size="2"' + ' playerId=' + i + '> </td>';
    rosterListHtml += '<td width="60" class="topSize"><select class="rosterSizeDropDown playerTopSize setRow" id="selPlayerTopSize_' + i + '" name="playerTop[size][]" alt="Please select a size." title="Please select a size."' + ' playerId=' + i + '>';
    rosterListHtml += '<option value="">Select</option>';
    rosterListHtml += '</select></td>';
    rosterListHtml += '<td width="10" class="topSize"><input type="text" value="$0.00" alt="$0.00" title="$0.00" style="cursor:default;" class="inputDisabled playerTopPrice" readonly="readonly" id="txtPlayerTopPrice_' + i + '" name="playerTop[price][]"' + ' playerId=' + i + '></td>';
    // check condition that it has bootom or not.
    //}
    //get value from config.            
    //if (true /*|| (this.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM') && GlobalInstance.uniformConfigurationInstance.getBottomAvailable() != false)*/) {
    rosterListHtml += '<td width="10" class="bottomSize"><INPUT type="text" value="0" class="numberInputField playerBottomQuantity setRow" id="txtPlayerBottomQuantity_' + i + '" name="playerBottom[quantity][]" maxlength="3" size="2"' + ' playerId=' + i + '> </td>';
    rosterListHtml += '<td width="60" class="bottomSize"><select class="rosterSizeDropDown playerBottomSize setRow" id="selPlayerBottomSize_' + i + '" name="playerBottom[size][]"' + ' playerId=' + i + '>';
    rosterListHtml += '<option value="">Select</option>';
    rosterListHtml += '</select></td>';
    rosterListHtml += '<td width="10" class="bottomSize"><input type="text" value="$0.00" alt="$0.00" title="$0.00" style="cursor:default;" class="inputDisabled playerBottomPrice" readonly="readonly" id="txtPlayerBottomPrice_' + i + '" name="playerBottom[price][]"' + ' playerId=' + i + '></td>';
    //}
    rosterListHtml += '<td width="10"><div class="addPlayerEmailContainer"><a tabindex="0" class="rosterMessageButton addPlayerEmail" alt="Click to Enter Email for Player" title="Click to Enter Email for Player"' + ' playerId=' + i + '></a>';
    rosterListHtml += '<span>' + this.displayPlayerEmailPopup(i) + '</span>';
    rosterListHtml += '</div></td>';
    rosterListHtml += '<td width="10"><input type="checkbox" id="chkPlayerDelete_' + i + '" name="player[delete][]" class="deletePlayer" alt="Mark here to Delete" title="Mark here to Delete" ' + ' playerId=' + i + ' style="cursor:pointer;"></td>';
    rosterListHtml += '<td><span href="" tabindex="0" class="rosterPreviewButton previewPlayer" alt="Click to Preview Player" title="Click to Preview Player"' + ' playerId=' + i + '></span></td>';
    rosterListHtml += '</tr>';
    return rosterListHtml;
};
/**
 * get Unique object number for rosterList
 * 
 * @param  val
 * @returns {Number}
 */
Roster.prototype.getUniqueObjectNumber = function (val) {
    var isFind = false;
    $.each(this.rosterList, function (k, rosterPlayerList) {
        if (val == k) {
            isFind = true;
        }
    });
    if (isFind) {
        val = parseInt(val) + 1;
        this.getUniqueObjectNumber(val);
    } else {
        this.currentObjectNumber = val;
        return true;
    }
};
/**
 * save on now email
 * 
 * @param  callme
 * @param  Emailmemyproof
 * @returns {Boolean}
 */
Roster.prototype.saveforNowEmail = function (callme, Emailmemyproof) {
    var callme = callme;
    var emailmemyproof = Emailmemyproof;
    //set value in uniform Configuration object       
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    GlobalInstance.uniformConfigurationInstance.setApproveLaterCallNumber(callme);
    GlobalInstance.uniformConfigurationInstance.setUserInfo('email', emailmemyproof);
    GlobalInstance.uniformConfigurationInstance.setUserInfo('ApproveLaterFwdEmail', emailmemyproof);
    // Call web server API to save configurator data.    
    GlobalInstance.saveConfigInstance = GlobalInstance.getSaveConfigurationInstance();
    GlobalInstance.saveConfigInstance.saveUniformConfigurationData();
    return true;
};
/**
 * get price for selected record
 * 
 * @param  currentPlayerId
 * @param {boolean} isTop
 * @returns {undefined}
 */
Roster.prototype.getSelectedRecordPrice = function (currentPlayerId, isTop) {
    var ageCategoryId = $('#selPlayerAgeCategory_' + currentPlayerId).val();
    var sizeNumber;
    var price = 0;
    if (isTop) {
        sizeNumber = $("#selPlayerTopSize_" + currentPlayerId + " option:selected").val();
        price = GlobalInstance.shoppingCartInstance.getFabricPrice(this.topSizeList, ageCategoryId, sizeNumber);
    }
    else {
        sizeNumber = $("#selPlayerBottomSize_" + currentPlayerId + " option:selected").val();
        price = GlobalInstance.shoppingCartInstance.getFabricPrice(this.bottomSizeList, ageCategoryId, sizeNumber);
    }
    return price;
};
/**
 * change the size price whenever fabric change 
 * 
 * @param  callme
 * @param  Emailmemyproof
 * @returns {Boolean}
 */
Roster.prototype.changeFabricPrice = function () {
    // loop on size 
    //playerTopSize
    //check the bottom and top.
    var thisObject = this;
    try {
        if (GlobalInstance.uniformConfigurationInstance.getTopAvailable() != false) {
            $('select.playerTopSize').each(function () {
                if ($(this).val()) {
                    var currentPlayerId = $(this).attr('id');
                    currentPlayerId = currentPlayerId ? currentPlayerId.replace('selPlayerTopSize_', '') : 0;
                    var ageCategoryId = $('#selPlayerAgeCategory_' + currentPlayerId).val();
                    var topSizeNumber = $("#" + $(this).attr('id') + " option:selected").val();
                    var price = GlobalInstance.shoppingCartInstance.getFabricPrice(thisObject.topSizeList, ageCategoryId, topSizeNumber);
                    var topQuantity = $('#txtPlayerTopQuantity_' + currentPlayerId).val();
                    var totalPrice = (parseFloat(topQuantity) * parseFloat(price));
                    var toFixedTotalPrice = totalPrice.toFixed(2);
                    $('#txtPlayerTopPrice_' + currentPlayerId).val('$' + toFixedTotalPrice);
                    $('#txtPlayerTopPrice_' + currentPlayerId).attr({
                        'alt': '$' + toFixedTotalPrice,
                        'title': '$' + toFixedTotalPrice
                    });
                }
            });
            this.subTotalTopPrice();
            this.subTotalTopQuantity();
            this.customUniformTotal();
        }
        if ((this.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) && GlobalInstance.uniformConfigurationInstance.getBottomAvailable() != false) {
            $('select.playerBottomSize').each(function () {
                if ($(this).val()) {
                    var currentPlayerId = $(this).attr('id');
                    currentPlayerId = currentPlayerId ? currentPlayerId.replace('selPlayerBottomSize_', '') : 0;
                    var ageCategoryId = $('#selPlayerAgeCategory_' + currentPlayerId).val();
                    var bottomSizeNumber = $("#" + $(this).attr('id') + " option:selected").val();
                    var price = GlobalInstance.shoppingCartInstance.getFabricPrice(thisObject.bottomSizeList, ageCategoryId, bottomSizeNumber);
                    var topQuantity = $('#txtPlayerBottomQuantity_' + currentPlayerId).val();
                    var totalPrice = (parseFloat(topQuantity) * parseFloat(price));
                    $('#txtPlayerBottomPrice_' + currentPlayerId).val('$' + totalPrice.toFixed(2));
                    $('#txtPlayerBottomPrice_' + currentPlayerId).attr({
                        'alt': '$' + totalPrice.toFixed(2),
                        'title': '$' + totalPrice.toFixed(2)
                    });
                }
            });
            this.subTotalBottomPrice();
            this.subTotalBottomQuantity();
            this.customUniformTotal();
        }
    } catch (e) {
    }
};
/**
 * Binding Player size, Quantity, price
 * 
 * @return void
 */
Roster.prototype.bindPlayerSizeHtml = function (selected, playerId) {
    // check empty
    if (selected === undefined || selected === '' || selected === null) {
        return;
    }
    this.slectedPlayerRowNumber.push(playerId);
    $("#selPlayerTopSize_" + playerId).html('');
    if (Utility.getObjectlength(this.topSizeList) > 0) {
        $.each(this.topSizeList["_" + selected], function (i, topSizeList) {
            var o = new Option(topSizeList.Name, topSizeList.SizeNumber);
            $(o).html(topSizeList.Name);
            $("#selPlayerTopSize_" + playerId).append(o);
        });
    }
    // set value like price 
    var price = GlobalInstance.shoppingCartInstance.getFabricPrice(this.topSizeList, selected, null, true);
    $('#txtPlayerTopQuantity_' + playerId).val(1);
    $('#txtPlayerTopPrice_' + playerId).val('$' + price.toFixed(2));
    $('#txtPlayerTopPrice_' + playerId).attr({
        'alt': '$' + price.toFixed(2),
        'title': '$' + price.toFixed(2)
    });
    this.subTotalTopPrice();
    this.subTotalTopQuantity();
    this.customUniformTotal();
    //set bottom 
    if (this.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) {
        $("#selPlayerBottomSize_" + playerId).html('');
        if (Utility.getObjectlength(this.bottomSizeList) > 0) {
            $.each(this.bottomSizeList["_" + selected], function (i, bottomSizeList) {
                var option = new Option(bottomSizeList.Name, bottomSizeList.SizeNumber);
                $(option).html(bottomSizeList.Name);
                $("#selPlayerBottomSize_" + playerId).append(option);
            });
        }
        var price = GlobalInstance.shoppingCartInstance.getFabricPrice(this.bottomSizeList, selected, null, false);
        $('#txtPlayerBottomQuantity_' + playerId).val(1);
        $('#txtPlayerBottomPrice_' + playerId).val('$' + price.toFixed(2));
        $('#txtPlayerBottomPrice_' + playerId).attr({
            'alt': '$' + price.toFixed(2),
            'title': '$' + price.toFixed(2)
        });
        try {
            var currentPlayerObject = this.rosterList[playerId];
            var bottomSizeNumber = $("#selPlayerBottomSize_" + playerId + " option:first").val();
            currentPlayerObject.setPlayerBottomInfo('size', bottomSizeNumber);
            currentPlayerObject.setPlayerBottomInfo('quantity', 1);
            currentPlayerObject.setPlayerBottomInfo('price', price);
        } catch (err) {
        }
        this.subTotalBottomPrice();
        this.subTotalBottomQuantity();
        this.customUniformTotal();
    }
};
/**
 * Binding buttons events
 * 
 * @return void
 */
Roster.prototype.rosterUploadUrl = function () {
    this.rosterUrl = "";
    //applicationId    
    var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
    var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
    var maleId = CONFIG.get("SPORT_GENDER_ID_MALE");
    var boysId = CONFIG.get("SPORT_GENDER_ID_YOUTH_MALE");
    var womanId = CONFIG.get("SPORT_GENDER_ID_FEMALE");
    var girlId = CONFIG.get("SPORT_GENDER_ID_YOUTH_FEMALE");
    var secondGenderId;
    //check gender is male or female
    if (genderInfo.Id == maleId) {
        secondGenderId = boysId;
    } else if (genderInfo.Id == womanId) {
        secondGenderId = girlId;
    }
    var youthInfo = JSON.parse(JSON.stringify(GlobalInstance.uniformConfigurationInstance.getYouthStylesInfo()));
    if (!youthInfo || youthInfo.StyleId == '' || youthInfo.StyleId == null) {
        youthInfo = {};
        secondGenderId = '';
        youthInfo.StyleId = '';
    }
    var serverParams = {
        'applicationId': GlobalInstance.uniformConfigurationInstance.getApplicationId(),
        'genderTypeId': genderInfo.Id + '|' + secondGenderId,
        'categoryId': categoryInfo.Id,
        'topstyleId': this.selectedStyle.StyleId + '|' + youthInfo.StyleId,
        'FabricId': this.fabricInfo.FabricId,
        'priceList': objApp.priceList,
        'markUpPrice': objApp.markUpPrice
    };
    var queryStringParam = "?applicationId=" + serverParams.applicationId + "&genderTypeId=" + serverParams.genderTypeId + "&categoryId=" + serverParams.categoryId + "&fabricId=" + serverParams.FabricId + "&priceList=" + serverParams.priceList + "&markUpPrice=" + serverParams.markUpPrice;
    // if top chooose then only top upload 
    if (GlobalInstance.uniformConfigurationInstance.getTopAvailable() != false) {
        queryStringParam += "&topstyleId=" + serverParams.topstyleId;
        //change template file
    }
    // if bottom choose and available then only top upload 
    if (this.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM') && GlobalInstance.uniformConfigurationInstance.getBottomAvailable() != false) {
        queryStringParam += "&bottomstyleId=" + this.selectedStyle.MatchingBottomStyleId + '|' + youthInfo.MatchingBottomStyleId;
        //change template file
    }

    if (this.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')
            && GlobalInstance.uniformConfigurationInstance.getTopAvailable() != false
            && GlobalInstance.uniformConfigurationInstance.getBottomAvailable() != false) {
        //change template file for both
    }
    /***************************File Upload*********************************/
    // Change this to the location of your server-side upload handler:
    this.rosterUrl = WEB_SERVICE_URL.get('ROSTER_UPLOAD_URL', 0) + queryStringParam;
};

Roster.prototype.addToCartAndRedirect = function () {
    GlobalInstance.saveConfigInstance.isMailEvent = false;
    GlobalInstance.saveConfigInstance.isSaveEvent = true;
    GlobalInstance.saveConfigInstance.isSaveEventFromCloseSession = true;
    GlobalInstance.uniformConfigurationInstance.setCallType('ADDTOCART');
    GlobalInstance.saveConfigInstance.funcCallBack = function () {
        var sessionInfo = objApp.sessionResponseData;
        var redirectUrl = sessionInfo.RedirectURL;
        if (objApp.fromSingleItemAPI) {
            window.parent.postMessage('AddToCart', "*");
        }
        else {
            if (redirectUrl && !redirectUrl.match(/^http([s]?):\/\/.*/)) {
                sessionInfo.RedirectURL = ('http://' + redirectUrl);
                window.location.href = sessionInfo.RedirectURL;
            } else {
                window.location.href = sessionInfo.RedirectURL;
            }
        }
    };
    GlobalInstance.saveConfigInstance.saveUniformConfigurationData();
}
/**
 * Binding buttons events
 * 
 * @return void
 */
Roster.prototype.bindRosterScreenButtons = function () {
    var thisObject = this;
    $('#fileupload').fileupload({
        url: thisObject.rosterUrl,
        acceptFileTypes: /(\.|\/)(xls|xlsx|csv)$/i,
        acceptFileTypesError: "Invalid file format. Only XLSX,XLS,CSV files are allowed",
        add: function (e, data) {
            if (data.files.length > 0) {
                var fileuploadObj = data;
                var url = thisObject.rosterUrl + '&fileName=' + fileuploadObj.files[0].name;
                fileuploadObj.url = url;
                fileuploadObj.submit();
            }
        },
        done: function (e, data) {
            if (data.result != undefined && data.result != null && data.result != '') {
                $("#dvUploadRoster").hide();
                $.startProcess(true);
                thisObject.bindUploadRosterData(data.result);
                $('#blanket').hide();
                $.doneProcess();
            }
        },
        fail: function (e, data) {

        },
        progressall: function (e, data) {
            $("#dvUploadRoster").hide();
            $('#blanket').show();
            $.startProcess(true);
        }
    }).bind('fileuploadprocessfail', function (e, data) {
        var message = "Invalid file format. Only XLSX,XLS,CSV files are allowed";
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = function () {
            return false;
        };
        GlobalInstance.dialogBoxInstance.displayErrorMessageDialogBox(TITLE.get('TITLE_UPLOAD_ROSTER_VALIDATION_ERROR'), message);
        return false;
    }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
    /************************************************************************************************/

    //$(document).off("click", "#dvModifyUnifrom,#proofRosterPlayer,#idQuoteBtn, #dvIdGoShoppingCartRedirect,#backToConfigurator, #dvAddRosterPlayer,#linkClearRoster,#modifyUniformFromProof, #dvIdFlatCutScreen, #dvViewShoppingCart, #spIdCancelSaveEmail ,#spIdSaveEmail");
    $(document).off('click', "#dvModifyUnifrom");
    $(document).on("click", "#dvModifyUnifrom", function () {

        $('#dvConfiguratorPanel').fadeIn(CONFIG.get('SCREEN_ANIMATION_SPEED'));
        $('#dvRosterPanel').hide();
        Validator.setIsRosterSelected(false);
        //call google Analytics 
        GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
        GlobalInstance.googleAnalyticsUtilInstance.modifyUniformClick();
        return false;
    });
    $(document).off("click", "#dvButtonFlatCutScreen");
    $(document).on("click", "#dvButtonFlatCutScreen", function () {
        $(document).trigger("flatCutScreen");
    });
    $(document).bind("flatCutScreen", function () {
        $.loadPage('dvFlatCutPanel', null, true, true, function () {
            $('#dvIdProofDocument').hide();
            GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
            GlobalInstance.popupInstance.loading(); // loading      

            setTimeout(function () { // then show popup, deley in .5 second
                $('#blanket').show();
                $('#ulAdultTop').html('');
                $('#ulYouthTop').html('');
                $('#ulAdultBottom').html('');
                $('#ulYouthBottom').html('');
                GlobalInstance.popupInstance.loadPopup('dvIdPopupFlatCut'); // function show popup 
                var selectedStyle = GlobalInstance.getStyleAndDesignInstance().getSelectedStyle();
                var selectedStyleForYouth = GlobalInstance.getUniformConfigurationInstance().getYouthStylesInfo();
                var selectedStyleForYouthBottom = null;
                var adultBottomStyLeInfo = null

                if (selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) {
                    adultBottomStyLeInfo = GlobalInstance.getStyleAndDesignInstance().getMatchingBottomStyle(selectedStyle); // Get the matching bottom style info for the respective style
                    selectedStyleForYouthBottom = GlobalInstance.getStyleAndDesignInstance().getYouthStyleInfoByStyleId(adultBottomStyLeInfo.StyleId);
                }
                var topStyleNumber = selectedStyle.StyleNumber;
                var bottomStyleNumber = '';
                var selectedSizes = new Object();
                var topStyleId = selectedStyle.StyleId;
                var bottomStyleId = '';
                var defaultBottomSize = '';
                var defalutBottomDisplayName = '';
                var isTopSelectedInCart = GlobalInstance.uniformConfigurationInstance.getTopAvailable();
                var isBottomSelectedInCart = GlobalInstance.uniformConfigurationInstance.getBottomAvailable();
                $.each(thisObject.playerSizeInfoForSizeProof, function (i, data) {
                    if (data) {
                        //fill top and bottom data
                        if (isTopSelectedInCart == true && isBottomSelectedInCart == true) {
                            selectedSizes[i + "_" + data.sizeNumber] = data;
                        }
                            //fill top data
                        else if (isTopSelectedInCart == true && data.isTop) {
                            selectedSizes[i + "_" + data.sizeNumber] = data;
                        }
                            //fill bottom data
                        else if (isBottomSelectedInCart == true && !data.isTop) {
                            selectedSizes[i + "_" + data.sizeNumber] = data;
                        }
                    }
                });

                if (thisObject.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) {
                    var bottomStyleID = selectedStyle.MatchingBottomStyleId;
                    var bottomStyleObject = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(bottomStyleID);
                    if (bottomStyleObject) {
                        bottomStyleNumber = bottomStyleObject.StyleNumber;
                        bottomStyleId = bottomStyleObject.StyleId;
                    }
                }

                var isTop = '';
                var styleNumber = '';
                var styleId = '';
                var styleToBeUsed = '';
                var counter = 0;
                var isAdultTopSizeAvailable = false;
                var isYouthTopSizeAvailable = false;
                var isAdultBottomSizeAvailable = false;
                var isYouthBottomSizeAvailable = false;

                for (var sizeNum in selectedSizes) {
                    var dataValue = selectedSizes[sizeNum];
                    var value = dataValue.displayName;
                    styleNumber = topStyleNumber;
                    styleId = topStyleId;
                    if (dataValue.isYouth) {
                        styleNumber = selectedStyleForYouth.StyleNumber;
                        styleId = selectedStyleForYouth.StyleId;
                    }
                    var parentContainer = $('<li style="width:30%">');
                    var container = $('<span>');
                    var radioButton = $('<input type="radio" class="sizes" styleNumber="' + styleNumber + '" id="' + sizeNum + '" name="check" alt="' + value + '" isTop="' + dataValue.isTop + '" styleId="' + styleId + '">');
                    var sizeNumber = '';
                    var sizeDisplayName = '';
                    container.attr('styleNumber', styleNumber);
                    container.css("fontSize", '10px;');
                    container.append(radioButton);
                    container.append(value);
                    parentContainer.append(container);
                    if (isTopSelectedInCart == true && dataValue.isTop) {
                        if (dataValue.isYouth) {
                            isYouthTopSizeAvailable = true;
                            $('#ulYouthTop').append(parentContainer).first().children().css("margin-right", "9px");
                        } else {
                            isAdultTopSizeAvailable = true;

                            $('#ulAdultTop').append(parentContainer).first().children().css("margin-right", "9px");
                        }
                    }

                    if (isBottomSelectedInCart == true && !dataValue.isTop) {
                        styleNumber = bottomStyleNumber;
                        styleId = bottomStyleId;
                        if (dataValue.isYouth && selectedStyleForYouthBottom) {
                            styleNumber = selectedStyleForYouthBottom.StyleNumber;
                            styleId = selectedStyleForYouthBottom.StyleId;
                        }
                        parentContainer = $('<li style="width:30%">');
                        container = $('<span>');
                        radioButton = $('<input type="radio" class="sizes"  styleNumber="' + styleNumber + '" id="' + sizeNum + '"name="check" alt="' + value + '" isTop="' + dataValue.isTop + '" styleId="' + styleId + '">');

                        sizeNumber = '';

                        container.attr('styleNumber', styleNumber);
                        container.append(radioButton);
                        container.append(value);
                        parentContainer.append(container);
                        if (dataValue.isYouth) {
                            isYouthBottomSizeAvailable = true;
                            $('#ulYouthBottom').append(parentContainer).first().children().css("margin-right", "9px");
                        } else {
                            isAdultBottomSizeAvailable = true;
                            $('#ulAdultBottom').append(parentContainer).first().children().css("margin-right", "9px");
                        }
                    }

                    if (counter == 0) {
                        radioButton.attr('checked', true);
                        sizeNumber = sizeNum;
                        sizeNumber = sizeNumber.substring(sizeNumber.indexOf("_") + 1);
                        sizeDisplayName = value;
                        styleToBeUsed = styleNumber;
                        GlobalInstance.uniformConfigurationInstance.setFlatCutSizeInfo(sizeNumber);
                        thisObject.updateFlatCutImages(sizeDisplayName, styleId, dataValue.isTop, styleToBeUsed);
                        thisObject.uniformEmblishmentsInfo('dvflatCutUniLabelTabel', sizeDisplayName, dataValue.isTop);
                    }

                    counter++;
                }
                if (isYouthTopSizeAvailable)
                    $('#trIdYouthTop').show();

                if (isAdultTopSizeAvailable)
                    $('#trIdAdultTop').show();

                if (isYouthBottomSizeAvailable)
                    $('#trIdYouthBottom').show();

                if (isAdultBottomSizeAvailable)
                    $('#trIdAdultBottom').show();

                $(".sizes").click(function () {

                    var checkedSize = $(".sizes:checked").attr('id')
                    $('.sizes').each(function () {
                        $('.sizes').attr('checked', false);
                    });
                    $("#" + checkedSize).prop('checked', true)

                    sizeNumber = $(this).attr('id');
                    sizeNumber = sizeNumber.substring(sizeNumber.indexOf("_") + 1);
                    sizeDisplayName = $(this).attr('alt');
                    styleToBeUsed = $(this).attr('styleNumber');
                    styleId = $(this).attr('styleId');
                    isTop = $(this).attr('isTop') == 'true' ? true : false;
                    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
                    GlobalInstance.uniformConfigurationInstance.setFlatCutSizeInfo(sizeNumber);
                    thisObject.updateFlatCutImages(sizeDisplayName, styleId, isTop, styleToBeUsed);
                    thisObject.uniformEmblishmentsInfo('dvflatCutUniLabelTabel', sizeDisplayName, isTop);
                });

                ;
                //print functionality
                $(document).off('click', "#dvPrintFlatCutBtn");
                $(document).on('click', "#dvPrintFlatCutBtn", function () {
                    //var printElementId = $(this).attr('printElementId');
                    var checkedSize = $(".sizes:checked").attr('id')
                    $("#" + checkedSize).attr("checked", true)
                    var printElementId = "dvIdPrintSizeProof";//

                    GlobalInstance.printElementInstance = GlobalInstance.getPrintElementInstance();
                    GlobalInstance.printElementInstance.printElementById(printElementId);
                });

                $(document).off('click', "#dvFlatCutBackButton");
                $(document).on('click', "#dvFlatCutBackButton", function () {
                    $('#dvIdPopupFlatCut').hide();
                    $('#dvIdProofDocument').show();
                });
            }, 500);
            $('#blanket').hide();
            $('#dvBackgroundPopup').hide();
        });
    });
    /*******  DO NOT DELETE -- FOR MODIFY UNIFORM BUTTON FROM PROOF SCREEN ***********/
    $(document).off('click', "#modifyUniformFromProof");
    $(document).on("click", "#modifyUniformFromProof", function () {
        try {
            GlobalInstance.getUniformConfigurationInstance().setSpecialInstructions('');
            $('#dvRosterPanel').hide();
            $('#dvIdProofDocument').hide();
            $('#blanket').hide();
            $('#dvBackgroundPopup').hide();
            GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
            GlobalInstance.popupInstance.disablePopup();
            $('#dvConfiguratorPanel').show();
            Validator.setIsRosterSelected(false);
            //call google Analytics 
            GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
            GlobalInstance.googleAnalyticsUtilInstance.modifyUniformClick();
            return false;
        } catch (err) {
            if (CONFIG.get('DEBUG') === true) {
                txt = "Error description: " + err.message + "\n\n";
                txt += "Error filename: " + err.fileName + "\n\n";
                txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                Log.error(txt);
            }
            return false;
        }
    });
    $(document).off('click', "#spIdCancelSaveEmail");
    $(document).on('click', '#spIdCancelSaveEmail', function () {
        thisObject.isGotoShoppingCartClicked = false;
        $("#blanket").show();
        $('#dvIdEmailPopUpShoppingCart').hide();
        var fadeInTime = 1;
        GlobalInstance.popupInstance.loadPopup('dvIdViewCartBanner', fadeInTime);
    });
    $(document).off('click', "#spIdSaveEmail");
    $(document).on('click', '#spIdSaveEmail', function () {
        var inpIdSaveEmail = $("#inpIdSaveEmail");
        //allFields = $([]).add(inpIdSaveEmail);
        //allFields.removeClass("error");
        var bValid = true;
        if (bValid && (Utility.checkFieldEmpty("inpIdSaveEmail") || !Utility.checkValidEmail("inpIdSaveEmail"))) {
            $(document).on("mouseover", "#inpIdSaveEmail", function () {
                var emailId = $.trim($('#inpIdSaveEmail').val());
                thisObject.EmailValidation(emailId, 'inpIdSaveEmail', 'dvEmailErrorBox', false, true);

                return;
            });
            $(document).on("mouseout blur", "#inpIdSaveEmail", function () {
                var emailId = $.trim($('#inpIdSaveEmail').val());
                thisObject.EmailValidation(emailId, 'inpIdSaveEmail', 'dvEmailErrorBox', false, false);

                return;
            });
            bValid = false;
            inpIdSaveEmail.addClass('error');
        }

        if (bValid) {
            var emailId = $.trim($('#inpIdSaveEmail').val());
            if (emailId !== '') {
                GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
                GlobalInstance.uniformConfigurationInstance.setUserInfo('email', emailId);
                //$('#dvIdGoShoppingCartRedirect').click();
                thisObject.addToCartAndRedirect();
            }

            $("#blanket").show();
            $('#blanket').css('zIndex', 10);
            $('#dvIdEmailPopUpShoppingCart').css('zIndex', 0);
        }
    });
    $(document).off('click', "#dvIdGoShoppingCartRedirect");
    $(document).on("click", "#dvIdGoShoppingCartRedirect", function () {
        try {
            var mailAddress = $.trim(GlobalInstance.uniformConfigurationInstance.getUserInfo('email'));

            if ((mailAddress != '') && thisObject.isGotoShoppingCartClicked) {
                return false;
            }

            thisObject.isGotoShoppingCartClicked = true;
            var inpIdSaveEmail = $('#inpIdSaveEmail');
            inpIdSaveEmail.removeClass('error');
            $('#inpIdSaveEmail').val('');
            //call google Analytics 
            GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
            GlobalInstance.googleAnalyticsUtilInstance.goToCart();
            GlobalInstance.saveConfigInstance = GlobalInstance.getSaveConfigurationInstance();
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            //set the status to show escape alert or not
            GlobalInstance.getUniformConfigurationInstance().setSkipAlertStatus(true);

            if ((mailAddress === undefined || mailAddress === null || mailAddress === '') && thisObject.isGotoShoppingCartClicked) {
                setTimeout(function () {
                    $("#blanket").show();
                    $('#blanket').css('zIndex', 101);
                    $('#dvIdEmailPopUpShoppingCart').css('display', 'block');
                    $('#dvIdEmailPopUpShoppingCart').show();
                }, 10);
            }
            else {
                thisObject.addToCartAndRedirect();
            }
        }
        catch (err) {
            if (CONFIG.get('DEBUG') === true) {
                txt = "Error description: " + err.message + "\n\n";
                txt += "Error filename: " + err.fileName + "\n\n";
                txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                Log.error("error" + txt);
            }
        }
    });
    $(document).off('click', "#dvViewShoppingCart");
    $(document).on("click", "#dvViewShoppingCart", function () {
        //call google Analytics 
        GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
        GlobalInstance.googleAnalyticsUtilInstance.approveNowOrLater(true);
        $(document).trigger("dvViewShoppingCart");
    });
    $(document).bind("dvViewShoppingCart", function () {

        $.loadPage('dvViewCartBanner', null, true, true, function () {
            $('#dvIdProofDocument').hide();
            GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
            GlobalInstance.popupInstance.loading(); // loading      
            $('#blanket').show();
            setTimeout(function () { // then show popup, deley in .5 second

                GlobalInstance.popupInstance.loadPopup('dvIdViewCartBanner'); // function show popup 

                $("#backToConfigurator").click(function () {
                    GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
                    GlobalInstance.popupInstance.disablePopup();
                    $('#blanket').hide(); // function close pop up                    
                    $('#dvConfiguratorPanel').show();
                    $('#dvRosterPanel').hide();
                    Validator.setIsRosterSelected(false);
                    //call google Analytics 
                    GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
                    GlobalInstance.googleAnalyticsUtilInstance.modifyUniformClick();
                    return false;
                });
            }, 500);
            $('#dvBackgroundPopup').hide();
            $(document).trigger("hideCustomizeButtons");
        });
    });
    /************************ Roster Order name Team name ***********************/
    $(document).on("mouseover", "#txtRosterProofOrderName", function () {
        var numberOfRosterPlayer = $(this).val();
        thisObject.orderNameTeamNameValidation(numberOfRosterPlayer, 'txtRosterProofOrderName', 'dvRosterOrderNameErrorBox', false, true);
        return;
    });
    $(document).on("mouseout blur", "#txtRosterProofOrderName", function () {
        var numberOfRosterPlayer = $(this).val();
        thisObject.orderNameTeamNameValidation(numberOfRosterPlayer, 'txtRosterProofOrderName', 'dvRosterOrderNameErrorBox', false, false);
        return;
    });
    $(document).on("mouseover", "#txtRosterProofTeamName", function () {
        var numberOfRosterPlayer = $(this).val();
        numberOfRosterPlayer = numberOfRosterPlayer ? parseInt(parseFloat(numberOfRosterPlayer)) : 0;
        thisObject.orderNameTeamNameValidation(numberOfRosterPlayer, 'txtRosterProofTeamName', 'dvRosterTeamNameErrorBox', false, true);
        return;
    });
    $(document).on("mouseout blur", "#txtRosterProofTeamName", function () {
        numberOfRosterPlayer = numberOfRosterPlayer ? parseInt(parseFloat(numberOfRosterPlayer)) : 0;
        var numberOfRosterPlayer = $(this).val();
        thisObject.orderNameTeamNameValidation(numberOfRosterPlayer, 'txtRosterProofTeamName', 'dvRosterTeamNameErrorBox', false, false);
        return;
    });
    /************************ Roster Order name Team name ***********************/

    $(document).on("focus", "#txtNumberOfRosterPlayer", function () {
        var numberOfRosterPlayer = $(this).val();
        numberOfRosterPlayer = numberOfRosterPlayer ? parseInt(parseFloat(numberOfRosterPlayer)) : 0;
        thisObject.addPlayerQuantityValidation(numberOfRosterPlayer, true, false);
        return;
    });
    $(document).on("mouseover", "#txtNumberOfRosterPlayer", function () {
        var numberOfRosterPlayer = $(this).val();
        numberOfRosterPlayer = numberOfRosterPlayer ? parseInt(parseFloat(numberOfRosterPlayer)) : 0;
        if (numberOfRosterPlayer < 1) {
            numberOfRosterPlayer = 1;
        }
        thisObject.addPlayerQuantityValidation(numberOfRosterPlayer, false, true);
        return;
    });
    $(document).on("mouseout blur", "#txtNumberOfRosterPlayer", function () {
        var numberOfRosterPlayer = $(this).val();
        numberOfRosterPlayer = numberOfRosterPlayer ? parseInt(parseFloat(numberOfRosterPlayer)) : 0;
        if (numberOfRosterPlayer < 1) {
            numberOfRosterPlayer = 1;
        }
        thisObject.addPlayerQuantityValidation(numberOfRosterPlayer, false, false);
        return;
    });
    /************************ Roster Order name Team name ***********************/
    /*$(document).on('click', function () {
     var numberOfRosterPlayer = $("#txtNumberOfRosterPlayer").val();
     thisObject.addPlayerQuantityValidation(numberOfRosterPlayer, false, false);
     });*/
    $(document).off('click', "#dvAddRosterPlayer");
    $(document).on("click", "#dvAddRosterPlayer", function () {
        var numberOfRosterPlayer = $("#txtNumberOfRosterPlayer").val();
        numberOfRosterPlayer = numberOfRosterPlayer ? parseInt(parseFloat(numberOfRosterPlayer)) : 0;
        if (!thisObject.addPlayerQuantityValidation(numberOfRosterPlayer, true, false)) {
            if (numberOfRosterPlayer < 1) {
                numberOfRosterPlayer = 1;
            }
            $("#txtNumberOfRosterPlayer").val(numberOfRosterPlayer);
            return;
        }
        var currentNumberOfRecords = Utility.getObjectlength(thisObject.rosterList);
        var totalNumberOfRecords = parseInt(currentNumberOfRecords) + numberOfRosterPlayer;
        if (parseInt(totalNumberOfRecords) > parseInt(CONFIG.get('MAX_ROSTER_PLAYER'))) {
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_MAX_ROSTER'), MESSAGES.get('MESSAGE_MAX_ROSTER_PLAYER'));
            return;
        }
        var statusText = 'Player Line Has Been Added To The Roster....';
        if (numberOfRosterPlayer > 1) {
            statusText = 'Player Lines Has Been Added To The Roster....';
        }

        thisObject.lastPlayerId = parseInt(thisObject.lastPlayerId) + 1;
        thisObject.addRosterPlayer(numberOfRosterPlayer, true);
        if (numberOfRosterPlayer < 1) {
            numberOfRosterPlayer = parseInt(numberOfRosterPlayer);
            $('#dvIdNumberOfPlayerAdd').text('....' + numberOfRosterPlayer + ' ' + statusText).show(500);
        } else {
            $('#dvIdNumberOfPlayerAdd').text('....' + numberOfRosterPlayer + ' ' + statusText).show(500);
        }
        setTimeout(function () {
            $('#dvIdNumberOfPlayerAdd').hide(500);
        }, 5000);
        $("#txtNumberOfRosterPlayer").val('1');
    });
    $(document).off('click', "#linkClearRoster");
    $(document).on('click', "#linkClearRoster", function () {
        thisObject.clearRoster();
        return false;
    });
    $(document).off('click', "#spanChangeFabric");
    $(document).on('click', "#spanChangeFabric", function () {
        $('#dvTabCustomize').click();
        $('#tbFabric').click();
        $('#dvRosterPanel').hide();
        $('#dvConfiguratorPanel').show();
        Validator.setIsRosterSelected(false);
        return false;
    });
    $(document).on('click focus', '#txtRosterTeamName', function () {
        $(this).addClass('active');
    });
    $(document).on('blur', '#txtRosterTeamName', function () {
        $(this).removeClass('active');
        var rosterTeamName = $.trim($("#txtRosterTeamName").val());
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('text', rosterTeamName);
    });
    $(document).on('click focus', '#txtRosterOrderName', function () {
        $(this).addClass('active');
    });
    $(document).on('blur', '#txtRosterOrderName', function () {
        $(this).removeClass('active');
        var rosterOrderName = $.trim($("#txtRosterOrderName").val());
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setOrderName(rosterOrderName);
    });
    $(document).off('click', "#btnUploadRoster");
    $(document).on('click', '#btnUploadRoster', function () {
        $("#dvUploadRoster").toggle();
        $('#blanket').show();
        // call google 
        GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
        GlobalInstance.googleAnalyticsUtilInstance.uploadRoster();
    });
    $(document).off('click', "#chkCallMe");
    $(document).on('click', '#chkCallMe', function () {
        if ($('#chkCallMe').is(':checked')) {
            $('#dvIdCallMe').prop('disabled', false);
        } else {
            $('#dvIdCallMe').prop('disabled', true);
        }
    });
    $(document).off('click', "#chkMailMe");
    $(document).on('click', '#chkMailMe', function () {
        if ($('#chkMailMe').is(':checked')) {
            $('#txtEmailProof').prop('disabled', false);
        } else {
            $('#txtEmailProof').prop('disabled', true);
        }
    });
    $(document).off('click', "#btnSaveForNow");
    $(document).on('click', '#btnSaveForNow', function () {

        GlobalInstance.saveConfigInstance = GlobalInstance.getSaveConfigurationInstance();
        GlobalInstance.saveConfigInstance.isApproveMailEvent = false;
        GlobalInstance.saveConfigInstance.isApproveContactEvent = false;
        var callme = '';
        var emailmemyproof = '';
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        //        if (!$('#chkMailMe').is(':checked') && !$('#chkCallMe').is(':checked')) {
        //            GlobalInstance.saveConfigInstance.isApproveContactEvent = false;
        //            GlobalInstance.saveConfigInstance.isApproveMailEvent = false;
        //            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        //            GlobalInstance.dialogBoxInstance.funcCallBack = null;
        //            GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(MESSAGES.get('TITLE_HOW_TO'), MESSAGES.get('MESSAGE_SAVE_FOR_NOW_VALIDATION'));
        //            return;
        //        }
        if ($('#chkCallMe').is(':checked')) {
            if (!Utility.checkFieldEmpty('dvIdCallMe') && Utility.isPhoneNumberValid("dvIdCallMe")) {
                GlobalInstance.uniformConfigurationInstance.setCallType('CONTACT');
                callme = $("#dvIdCallMe").val();
                GlobalInstance.saveConfigInstance.isApproveContactEvent = true;
            } else {
                GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                GlobalInstance.dialogBoxInstance.funcCallBack = null;
                GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(TITLE.get('TITLE_VALIDATE_CONTACT_NUMBER'), MESSAGES.get('MESSAGE_VALIDATE_CONTACT'));
                GlobalInstance.saveConfigInstance.isApproveContactEvent = false;
                return;
            }
        }
        //        if ($('#chkMailMe').is(':checked')) {
        if (!Utility.checkFieldEmpty('txtEmailProof') && Utility.checkValidEmail("txtEmailProof")) {
            GlobalInstance.uniformConfigurationInstance.setCallType('EMAIL');
            emailmemyproof = $("#txtEmailProof").val();
            GlobalInstance.saveConfigInstance.isApproveMailEvent = true;

        } else {
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.funcCallBack = null;
            GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(TITLE.get('TITLE_VALIDATE_MAIL_PROOF'), MESSAGES.get('MESSAGE_VALIDATE_MAIL_PROOF'));
            GlobalInstance.saveConfigInstance.isApproveMailEvent = false;
            return;
        }
        //        }
        //call google Analytics 
        GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
        GlobalInstance.googleAnalyticsUtilInstance.approveNowOrLater();
        GlobalInstance.getPopupInstance().disablePopup(); // function close pop up
        $('#blanket').hide(); //hide blanket
        if (thisObject.validateRoster()) {
            thisObject.saveforNowEmail(callme, emailmemyproof);
        }
    });
    $(document).off('click', "#dvProofRosterPlayer");
    $(document).on('click', '#dvProofRosterPlayer', function () {
        //Create the player size array for selected roster player
        thisObject.setPlayerSizeInfoForSizeProof();
        $(document).trigger("proofRosterPlayer");
    });
    $(document).off('click', "#idQuoteBtn");
    $(document).on('click', '#idQuoteBtn', function () {
        thisObject.isQuoteBtnClicked = true;
        thisObject.orderNameValidation(false);
        return false;
    });
    $(document).bind("proofRosterPlayer", function () {
        thisObject.isQuoteBtnClicked = false;
        thisObject.orderNameValidation(true);
    });
};

/**
 * Update the Flat Cuts for Selected Size in Roster
 * @param sizeNumber
 * @param styleId
 * @param isTop
 * @param playerName
 * @param palyerNumber
 * 
 * retuns void
 * */
Roster.prototype.updateFlatCutImages = function (sizeDisplayName, styleId, isTop, styleNumber) {
    var flatCutUrl = '';
    var playerName = '';
    var playerNumber = '';
    var tempHtml = '';
    var rosterSizeDisplayName = '';
    var sizeNumber = '';
    var tempRosterData = JSON.parse(JSON.stringify(this.rosterList));
    var flatCutimageUrlArray = new Object();
    if (Utility.getObjectlength(tempRosterData) > 0) {
        $.each(tempRosterData, function (i, data) {
            if (isTop) {
                rosterSizeDisplayName = $('#selPlayerTopSize_' + i + ' option:selected').text();
                sizeNumber = $('#selPlayerTopSize_' + i + ' option:selected').val();
            } else {
                rosterSizeDisplayName = $('#selPlayerBottomSize_' + i + ' option:selected').text();
                sizeNumber = $('#selPlayerBottomSize_' + i + ' option:selected').val();
            }
            if (rosterSizeDisplayName == sizeDisplayName) {

                playerName = (data.name != '') ? data.name : null;
                playerNumber = (data.number != '') ? data.number : null;
                flatCutimageUrlArray[i] = LiquidPixels.getFlatCutUrl(isTop, styleNumber, sizeNumber, playerName, playerNumber, styleId);
                tempHtml += '<img id="flatCutImagePreview_' + i + '"   src="" alt="" style=""/>'
                tempHtml += '<div class="flatCutImageBox"></div>'
                tempHtml += '<br/>'
            }

        });
        $('#dvIdImagFaltcut').html(tempHtml);

        for (var key in flatCutimageUrlArray) {
            LiquidPixels.transformUrl(flatCutimageUrlArray[key], function (shortPreviewImageSource, elementIdBeforeCall) {
                Utility.loadImage(elementIdBeforeCall, shortPreviewImageSource, null, null);

            }, 'flatCutImagePreview_' + key
            );
        }
    }
};

Roster.prototype.EmailValidation = function (emailId, inpIdSaveEmail, errorBoxId, displayWideBorder, displayToolTip) {
    // thisObject.EmailValidation(emailId, id, 'dvEmailErrorBox', false, true);
    var message = '';
    var controllerObject = $('#' + inpIdSaveEmail);
    var id = errorBoxId;
    var errorBoxId1 = $('#' + id);
    errorBoxId1.hide();


    if (emailId == '') {
        message = MESSAGES.get('MESSAGE_EMPTY_FIELD');
    }

    if (emailId != '') {
        if (emailId.indexOf("@") == -1) {
            message = MESSAGES.get('MESSAGE_MISSING_SYMBOL');
        }
        else {
            var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            if (!emailReg.test(emailId)) {
                message = MESSAGES.get('MESSAGE_MISSING_DOMAIN');
            } else {
                message = "";
            }
        }
    }

    if (message != '') {
        if (displayWideBorder) {
            controllerObject.removeClass('active');
            controllerObject.addClass('errorTextBox');
            controllerObject.addClass('errorTextBoxWideBorder');
        }
        if (displayToolTip) {
            //display tooltip
            errorBoxId1.html(message).show();
        } else {
            errorBoxId1.hide();
        }
        return false;
    } else {
        //hide tooltip if visible
        controllerObject.addClass('normalTextBox');
        controllerObject.addClass('active');
        errorBoxId1.html(message);
        errorBoxId1.hide();
        return true;
    }
};

/**
 * Add Player Quantity Validation 
 * @returns {void}
 */
Roster.prototype.addPlayerQuantityValidation = function (numberOfRosterPlayer, displayWideBorder, displayToolTip) {
    var message = '';
    if (numberOfRosterPlayer == '') {
        message = 'This filed is required.';
        $('#dvAddPlayerQuintityErrorBox').css('width', '150px');
    } else if (!$.isNumeric(numberOfRosterPlayer) || numberOfRosterPlayer < 1) {

        message = 'This input contains invalid characters.';
        $('#dvAddPlayerQuintityErrorBox').css('width', '200px');
    }
    if (message != '') {
        $("#txtNumberOfRosterPlayer").removeClass('active');
        $("#txtNumberOfRosterPlayer").addClass('errorTextBox');
        if (displayWideBorder) {
            $("#txtNumberOfRosterPlayer").addClass('errorTextBoxWideBorder');
        }
        if (displayToolTip) {
            $('#dvAddPlayerQuintityErrorBox').html(message);
            $('#dvAddPlayerQuintityErrorBox').show();
        } else {
            $('#dvAddPlayerQuintityErrorBox').hide();
        }
        return false;
    } else {
        //hide tooltip if visible
        $("#txtNumberOfRosterPlayer").removeClass('errorTextBoxWideBorder').removeClass('errorTextBox').addClass('normalTextBox');
        $('#dvAddPlayerQuintityErrorBox').html(message);
        $('#dvAddPlayerQuintityErrorBox').hide();
        return true;
    }
};
/**
 * Validation for Order name and Team Name before Proof 
 * @returns {void}
 */
Roster.prototype.orderNameTeamNameValidation = function (controllerValue, controllerId, errorBoxId, displayWideBorder, displayToolTip) {
    var message = '';
    var controllerObject = $('#' + controllerId);
    var errorBoxId = $('#' + errorBoxId);
    errorBoxId.hide();
    if (controllerValue == '') {
        message = 'This filed is required.';
    }
    if (message != '') {
        if (displayWideBorder) {
            controllerObject.removeClass('active');
            controllerObject.addClass('errorTextBox');
            controllerObject.addClass('errorTextBoxWideBorder');
        }
        if (displayToolTip && this.displayErrorTooltip) {
            //display tooltip
            errorBoxId.html(message).show();
        } else {
            errorBoxId.hide();
        }
        return false;
    } else {
        //hide tooltip if visible
        controllerObject.addClass('normalTextBox');
        controllerObject.addClass('active');
        errorBoxId.html(message);
        errorBoxId.hide();
        return true;
    }
};
/**
 * check Order name validation 
 * @returns {void}
 */
Roster.prototype.orderNameValidation = function (isForProof) {
    // check order name
    var thisObject = this;
    thisObject.displayErrorTooltip = false;
    $('#txtRosterProofOrderName').val('');
    $('#txtRosterProofOrderName').removeClass('errorTextBox').removeClass('errorTextBoxWideBorder').addClass('normalTextBox');
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    // get value from uniform configuration object 
    var orderName = GlobalInstance.uniformConfigurationInstance.getOrderName();
    //var orderName = $.trim($('#' + txtRosterProofOrderName).val());

    if (orderName == undefined || orderName == null || orderName == '') {
        //display dialog box for order name        
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = function (params) {
            //take ok value close box
            thisObject.displayErrorTooltip = true;
            var txtRosterProofOrderName = $.trim($('#txtRosterProofOrderName').val());
            if (thisObject.orderNameTeamNameValidation(txtRosterProofOrderName, 'txtRosterProofOrderName', 'dvRosterOrderNameErrorBox', true, false)) {
                GlobalInstance.uniformConfigurationInstance.setOrderName(txtRosterProofOrderName);
                thisObject.displayRosterOrderName();
                params.dialog("close");
                params.dialog("destroy");
                thisObject.teamNameValidation(isForProof);
            }

        };
        GlobalInstance.dialogBoxInstance.displayRosterModelDialogBox('dvRosterOrderNameDialogBox', TITLE.get('TITLE_ROSTER_DATA_VALIDATION'), '');
    } else {
        thisObject.teamNameValidation(isForProof);
    }

};
/**
 * check team name validation 
 * @returns {void}
 */
Roster.prototype.teamNameValidation = function (isForProof) {
    var thisObject = this;
    thisObject.displayErrorTooltip = false;
    $('#txtRosterProofTeamName').val('');
    $('#txtRosterProofTeamName').removeClass('errorTextBox').removeClass('errorTextBoxWideBorder').addClass('normalTextBox');
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    // get value from uniform configuration object 
    var teamNameInfo = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo();
    if ((Utility.getObjectlength(teamNameInfo) < 1) || (teamNameInfo.text == undefined || teamNameInfo.text == null || teamNameInfo.text == '')) {
        //display dialog box for order name        
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = function (params) {
            //take ok value close box
            thisObject.displayErrorTooltip = true;
            var txtRosterProofTeamName = $.trim($('#txtRosterProofTeamName').val());
            if (thisObject.orderNameTeamNameValidation(txtRosterProofTeamName, 'txtRosterProofTeamName', 'dvRosterTeamNameErrorBox', true, false)) {
                GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('text', txtRosterProofTeamName);
                thisObject.displayRosterTeamName();
                params.dialog("close");
                params.dialog("destroy");
                thisObject.rosterProof();
                //                if(isForProof){
                //                    thisObject.rosterProof();
                //                }else{
                //                    thisObject.rosterProof();
                //                    /*GlobalInstance.printInstance = GlobalInstance.getPrintInstance();
                //                    GlobalInstance.printInstance.showQuotepopup();*/
                //                }
            }
        };
        GlobalInstance.dialogBoxInstance.displayRosterModelDialogBox('dvRosterTeamNameDialogBox', TITLE.get('TITLE_ROSTER_DATA_VALIDATION'), '');
    } else {
        thisObject.rosterProof();
        /*
         if(isForProof){
         thisObject.rosterProof();
         }else{
         thisObject.rosterProof();
         //GlobalInstance.printInstance = GlobalInstance.getPrintInstance();
         //GlobalInstance.printInstance.showQuotepopup();
         }*/
        //rosterProof
    }
};
/**
 * roster proof functionality
 * 
 * @returns {void}
 */
Roster.prototype.rosterProof = function () {
    var thisObject = this;
    var isPlayerNumberAnchorPointExist = false;
    var isPlayerNameAnchorPointExist = false;
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var anchorPoints = GlobalInstance.uniformConfigurationInstance.getAnchorPoints();
    if (this.validateRoster('proof')) {
        //check for validation of anchor points
        var isRosterPlayerNameExist = true;
        var isRosterPlayerNumberExist = true;
        $.each(this.rosterList, function (i, player) {
            if (player.ageCategory) {
                if (!player.name) {
                    isRosterPlayerNameExist = false;
                }
                if (!player.number) {
                    isRosterPlayerNumberExist = false;
                }
            }
        });
        var isPlayerNumberAnchorPointExist = false;
        var isPlayerNameAnchorPointExist = false;
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var anchorPoints = GlobalInstance.uniformConfigurationInstance.getAnchorPoints();
        for (var key in anchorPoints) {
            var anchorPointObj = anchorPoints[key];
            if (anchorPointObj.id && anchorPointObj.type == 'playername') {
                isPlayerNameAnchorPointExist = true;
            }
            if (anchorPointObj.id && anchorPointObj.type == 'playernumber') {
                isPlayerNumberAnchorPointExist = true;
            }
        }

        this.validationAndErrorCheck(isRosterPlayerNameExist, isRosterPlayerNumberExist, isPlayerNumberAnchorPointExist, isPlayerNameAnchorPointExist);
    }
};
/**
 * This method validates the roster data with slected player name and player number anchor points ad hsows the appropriate error
 * @returns {undefined}
 */
Roster.prototype.validationAndErrorCheck = function (isRosterPlayerNameExist, isRosterPlayerNumberExist, isPlayerNumberAnchorPointExist, isPlayerNameAnchorPointExist) {
    var flag;
    var returnValue = false;
    var message;
    var thisObject = this;

    if (typeof objApp.landingPage != 'undefined' && objApp.landingPage == CONFIG.get('LANDING_PAGE_PROOF')) {
        thisObject.proofRosterhtml();
        return false;
    }

    if (isPlayerNameAnchorPointExist == false && isPlayerNumberAnchorPointExist == false) {
        //warning 
        flag = 1;
        if (isRosterPlayerNameExist == true && isRosterPlayerNumberExist == true) {
            //both message
            message = MESSAGES.get("MESSAGE_PROCEED_TO_CHECKOUT_WARNING_PLAYERNAME_AND_PLAYERNUMBER_NOT_SELECTED");
        }
        else if (isRosterPlayerNameExist == true) {
            message = MESSAGES.get("MESSAGE_PROCEED_TO_CHECKOUT_WARNING_PLAYERNAME_SELECTED");
        }
        else if (isRosterPlayerNumberExist == true) {
            message = MESSAGES.get("MESSAGE_PROCEED_TO_CHECKOUT_WARNING_PLAYERNUMBER_SELECTED");
        } else {
            returnValue = true;
        }
    }

        //both anchor point exists
    else if (isPlayerNameAnchorPointExist == true && isPlayerNumberAnchorPointExist == true) {
        //error cases
        flag = 2;
        if (isRosterPlayerNameExist == false && isRosterPlayerNumberExist == false) {
            //both not exist message
            message = MESSAGES.get("MESSAGE_PROCEED_TO_CHECKOUT_ERROR_PLAYERNAME_AND_PLAYERNUMBER_NOT_SELECTED");
            isRosterPlayerNameExist = true;
            isRosterPlayerNumberExist = true;
        }

        else if (isRosterPlayerNameExist == false) {
            //player name message
            message = MESSAGES.get("MESSAGE_PROCEED_TO_CHECKOUT_ERROR_PLAYERNAME_DOES_NOT_EXIST");
        }
        else if (isRosterPlayerNumberExist == false) {
            //player number message
            message = MESSAGES.get("MESSAGE_PROCEED_TO_CHECKOUT_ERROR_PLAYERNUMBER_DOES_NOT_EXIST");
        } else {
            returnValue = true;
        }

        isRosterPlayerNameExist = true;
        isRosterPlayerNumberExist = true;
    }

        //only player name anchor point exist
    else if (isPlayerNameAnchorPointExist) {
        flag = 2;
        if (isRosterPlayerNameExist == false) {
            //show error message
            message = MESSAGES.get("MESSAGE_PROCEED_TO_CHECKOUT_ERROR_PLAYERNAME_DOES_NOT_EXIST");
            isRosterPlayerNameExist = true;
        }
        else if (isRosterPlayerNumberExist == true) {
            //show warning message
            flag = 1;
            message = MESSAGES.get("MESSAGE_PROCEED_TO_CHECKOUT_WARNING_PLAYERNUMBER_SELECTED");
        } else {
            returnValue = true;
        }
    }

        //only player number anchor point exist
    else if (isPlayerNumberAnchorPointExist) {
        flag = 2;
        if (isRosterPlayerNumberExist == false) {
            //show error message
            message = MESSAGES.get("MESSAGE_PROCEED_TO_CHECKOUT_ERROR_PLAYERNUMBER_DOES_NOT_EXIST");
            isRosterPlayerNumberExist = true;
        }
        else if (isRosterPlayerNameExist) {
            //show warning
            flag = 1;
            message = MESSAGES.get("MESSAGE_PROCEED_TO_CHECKOUT_WARNING_PLAYERNAME_SELECTED");
        }
        else {
            returnValue = true;
        }
    }

    //show prrof page, if validated succcessfully
    if (returnValue == true) {
        if (thisObject.isQuoteBtnClicked) {
            GlobalInstance.printInstance = GlobalInstance.getPrintInstance();
            GlobalInstance.printInstance.showQuotepopup();
        } else {
            thisObject.proofRosterhtml();
        }
    } else {
        //show message
        if (flag == 1) {
            message += "<br><br>";
            message += "Do you still want to proceed and checkout?"
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.displayProceedToCheckoutConfirmationDialogBox(TITLE.get('TITLE_PROCEED_TO_CHECKOUT_WARNING'), message);
            GlobalInstance.dialogBoxInstance.funcCallBackForCancel = null;
            GlobalInstance.dialogBoxInstance.funcCallBack = function () {
                if (thisObject.isQuoteBtnClicked) {
                    GlobalInstance.printInstance = GlobalInstance.getPrintInstance();
                    GlobalInstance.printInstance.showQuotepopup();
                } else {
                    thisObject.proofRosterhtml();
                }
            };
            GlobalInstance.dialogBoxInstance.funcCallBackForCancel = null;
        } else if (flag == 2) {
            message += "<br><br>";
            message += "Would you like to go back and add it? "
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.displayProceedToCheckoutErrorConfirmationDialogBox(TITLE.get('TITLE_ROSTER_DATA_VALIDATION_ERROR'), message);
            GlobalInstance.dialogBoxInstance.funcCallBack = function () {
                thisObject.validationAndErrorCheck(isRosterPlayerNameExist, isRosterPlayerNumberExist, isPlayerNumberAnchorPointExist, isPlayerNameAnchorPointExist);
            };
        }
    }
};
Roster.prototype.proofRosterhtml = function () {
    var thisObject = this;
    $.loadPage('dvProofRosterPanel', null, true, true, function () {
        GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
        GlobalInstance.popupInstance.loading(); // loading      
        $('#spanFabric').hide();
        $('#blanket').show();
        $('#approvenow').attr('checked', false);
        $("#dvViewShoppingCart").hide();
        setTimeout(function () {
            // Saving roster info
            var isRoster = Validator.getIsRosterSelected();
            if (isRoster) {
                GlobalInstance.rosterInstance = GlobalInstance.getRosterInstance();
                if (GlobalInstance.rosterInstance.validateRoster()) {
                    GlobalInstance.rosterInstance.saveRoster();
                }
            }
            if (objApp.fromSingleItemAPI == true || objApp.userType == CONFIG.get('USER_TYPE_DEALER')) {
                $('#secApprovalOptions').show();
            } else {
                $('#secApprovalOptions').hide();
            }
            var colors = GlobalInstance.uniformConfigurationInstance.getColorsInfo();
            var cutName = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
            $('#tdIdSelectedCutName').html(cutName.StyleName);
            // then show popup, deley in .5 second
            GlobalInstance.popupInstance.loadPopup('dvIdProofDocument'); // function show popup 
            $('#dvIdShowEmailProofProp').hide();
            thisObject.addTeamRosterInfo(thisObject.dvTeamRosterInfoOnProof, false);
            var fabricObj = GlobalInstance.uniformConfigurationInstance.getFabricsInfo();
            var fabricName = fabricObj.Name;
            $('#tdIdPrimaryColorForProof').html(colors.uniformPrimaryColor.Name);
            $('#dvIdPrimaryColorForProofIdentification').html(colors.uniformPrimaryColor.Name);
            $('#tdIdSecondryColorForProof').html(colors.uniformSecondaryColor.Name);
            $('#dvIdSecondryColorForProofIdentification').html(colors.uniformSecondaryColor.Name);
            $('#tdIdTirtiaryColorForProof').html(colors.uniformTertiaryColor.Name);
            $('#dvIdTirtiaryColorForProofIdentification').html(colors.uniformTertiaryColor.Name);
            var tempBirdEyeViewList = "";
            var previewImages = GlobalInstance.getStyleAndDesignInstance().getBirdEyePreviewImageList();
            var selectedStyle = GlobalInstance.getStyleAndDesignInstance().getSelectedStyle();
            //get current current selected player name and payer number of active row
            var selectedPlayerObject = thisObject.getSelectedPlayerObject();
            var playerName = '';
            var playerNumber = '';
            if (selectedPlayerObject) {
                playerName = selectedPlayerObject.name;
                playerNumber = selectedPlayerObject.number;
            }

            if (Utility.getObjectlength(previewImages['_' + selectedStyle.StyleId]) > 0) {
                $("#idsecBox").css('min-height', 'auto');
                var iCount = 0;
                var imageUrl = null;
                var imageUrlArray = new Object();
                var imageLength = Utility.getObjectlength(previewImages['_' + selectedStyle.StyleId]);
                $.each(previewImages['_' + selectedStyle.StyleId], function (i, birdEyeView) {
                    imageUrl = LiquidPixels.generatePreviewUrl(null, null, '_', {
                        isSmallImagePrint: "true",
                        view: birdEyeView.Name.toLowerCase(),
                        birdEyeViewObject: birdEyeView
                    });
                    if (iCount == 0 && imageLength <= 3) {
                        tempBirdEyeViewList += '<div class="proofModelLeftImg" id=imageBirdEyeRoster_"' + iCount + '"><div class="showImageLoadingMessagePrint" id="dvIdShowImageLoadingMessageRoster_' + iCount + '">' + MESSAGES.get('MESSAGE_IMAGE_LOADING') + '</div><img id="proofPreviewImgRoster_' + iCount + '" currentindex="' + iCount + '" src="" style="visibility:hidden;"></div> ';
                    } else {
                        tempBirdEyeViewList += '<div class="proofModelLeftImg" id=imageBirdEyeRoster_"' + iCount + '"><div class="showImageLoadingMessagePrint" id="dvIdShowImageLoadingMessageRoster_' + iCount + '">' + MESSAGES.get('MESSAGE_IMAGE_LOADING') + '</div><img class="proofSmallPreviewImg" id="proofPreviewImgRoster_' + iCount + '" currentindex="' + iCount + '" src="" style="visibility:hidden;"></div> ';
                    }

                    imageUrlArray[iCount] = imageUrl;
                    iCount++;
                });
                var totalAlternateViews = Utility.getObjectlength(imageUrlArray);
                totalAternateViewsLoaded = 0;
                thisObject.isPrintButtonEnabled = false;
                $("#idsecBox").html('<div class="modelImgBox">' + tempBirdEyeViewList + '</div>');
                //load images
                for (var key in imageUrlArray) {
                    LiquidPixels.transformUrl(imageUrlArray[key], function (shortPreviewImageSource, elementIdBeforeCall) {
                        Utility.loadImage(elementIdBeforeCall, shortPreviewImageSource, function (elementId) {
                            var currentIndex = $('#' + elementId).attr('currentindex');
                            $("#dvIdShowImageLoadingMessageRoster_" + currentIndex).css('visibility', 'hidden');
                            totalAternateViewsLoaded++;
                            if (totalAternateViewsLoaded == totalAlternateViews) {
                                thisObject.isPrintButtonEnabled = true;
                            }
                        }, function (elementId) {
                            var currentIndex = $('#' + elementId).attr('currentindex');
                            $("#dvIdShowImageLoadingMessageRoster_" + currentIndex).css('visibility', 'hidden');
                        });

                    }, 'proofPreviewImgRoster_' + key
                    );
                }

            } else {
                $("#idsecBox").html('');
                $("#idsecBox").css('min-height', '364px');
            }

            var selectedDesignNameForProof = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
            $('#tdIdSelectedDesignName').html(selectedDesignNameForProof.DesignName);
            var bg_url = $('#dvIdFabricSelected').css('background-image');
            if (bg_url) {
                bg_url = bg_url.replace('url(', '').replace(')', '');
            }
            $('#spanFabric').hide();
            $('#tdIdSelectedFabricForProof').html('<img class="selectedSampleFabric" style="margin-left:0px;" src=' + bg_url + '>');
            $('#tdIdSelectedFabricForProof').append('<div style="" class="listDescription">' + fabricName + '</div>');
            /*******  DONOT DELETE CODE ****************/
            var primaryColor = encodeURIComponent(colors.uniformPrimaryColor.RgbHexadecimal);
            var secondaryColor = encodeURIComponent(colors.uniformSecondaryColor.RgbHexadecimal);
            var tertiaryColor = encodeURIComponent(colors.uniformTertiaryColor.RgbHexadecimal);
            $('.circlePrimary').html('<img src=' + LiquidPixels.getProofColorIdentificationImageUrl(primaryColor) + '>');
            $('.circleSecondary').html('<img src=' + LiquidPixels.getProofColorIdentificationImageUrl(secondaryColor) + '>');
            $('.circleTirtiary').html('<img src=' + LiquidPixels.getProofColorIdentificationImageUrl(tertiaryColor) + '>');

            //GEt the Emblishment Info
            thisObject.uniformEmblishmentsInfo('dvIdProofEmblishMentInfo');

            //Set The Color Identification
            GlobalInstance.printInstance = GlobalInstance.getPrintInstance();
            GlobalInstance.printInstance.getallColorsorPrint('dvIdProofColorsIdenfication');
            //Scroll to the top position
            $("div.dvTop").scrollTop(0);
            //var inputBox = document.getElementById('dvtextareaproof');
            /*inputBox.onkeyup = function() {
                $('#dvtextareaproofPrint').html(inputBox.value);
            }*/

            // var setSpecialInstructionsValue =inputBox.value;
            $(document).on('blur', "#dvtextareaproof", function () {
                var thisVal = $(this).val();
                GlobalInstance.getUniformConfigurationInstance().setSpecialInstructions(thisVal);
                $('#dvtextareaproofPrint').html(thisVal);
            });


            $(document).off('click', "#dvCloseApproveLater");
            $(document).on('click', "#dvCloseApproveLater", function () {
                $('#dvIdShowEmailProofProp').hide();
                $('#approvelater').prop('checked', false);

            });

            $("input[name=rdApprove]:radio").change(
                    function () {
                        var whichRadio = $(this).attr('id');
                        if (whichRadio == 'approvenow') {
                            $('#dvViewShoppingCart').show();
                            $("#txtEmailProof").val('');
                            $('#dvIdShowEmailProofProp').hide();
                        } else if (whichRadio == 'approvelater') {
                            $('#dvViewShoppingCart').hide();
                            $('#dvIdShowEmailProofProp').show();
                        }
                    });

            // print functionality
            $(document).off('click', "#dvPrintProofBtn");
            $(document).on('click', "#dvPrintProofBtn", function () {
                if (thisObject.isPrintButtonEnabled == true) {
                    $("#dvtextareaproof").hide();
                    $("#dvtextareaproofPrint").show();
                    $("div.dvTop").scrollTop(0);
                    var printElementId = $(this).attr('printElementId');
                    GlobalInstance.printElementInstance = GlobalInstance.getPrintElementInstance();
                    GlobalInstance.printElementInstance.printElementById(printElementId);
                } else {
                    GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_SAVE_VALIDATION'), MESSAGES.get('MESSAGE_WAIT_MODEL_PREVIEW_LOADING'));
                    GlobalInstance.dialogBoxInstance.funcCallBack = null;
                }
            });
            $(document).off('click', "#dvProofBackBtn");
            $(document).on('click', "#dvProofBackBtn", function () {
                GlobalInstance.getUniformConfigurationInstance().setSpecialInstructions('');
                GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
                GlobalInstance.popupInstance.disablePopup();
                $('#blanket').hide(); // function close pop up
                $('#dvIdProofDocument').hide(); // function close pop up

            });
            $(document).off('click', '#spanWhatsThisLinkProofPage');
            $(document).on('click', '#spanWhatsThisLinkProofPage', function () {
                $('#spnLinkProof').click();
            });
            //trigger the prrof page landing event
            //$(document).trigger("PageLanded", CONFIG.get('LANDING_PAGE_PROOF'));

            //trigger the prrof page landing event
            //$(document).trigger("PageLanded", CONFIG.get('LANDING_PAGE_PROOF'));

            $(document).trigger("PageLanded", CONFIG.get('LANDING_PAGE_PROOF'));
            $(document).trigger("hideCustomizeButtons");
        }
        , 500);
    });
};
/**
 * save roster in uniformconfiguration
 * @returns {void}
 */
Roster.prototype.saveRoster = function (isCallBackRequired) {
    try {
        var thisObject = this;
        isCallBackRequired = (typeof isCallBackRequired == 'undefined') ? false : isCallBackRequired;
        if (!isCallBackRequired) {
            if (this.validateRoster()) {
                this.fillRosterInformation(isCallBackRequired);
            }
        } else {
            this.fillRosterInformation(isCallBackRequired);
        }
    } catch (e) {
        Log.error('Error caught in save Roster -----' + e.message);
    }
};


/*
*This method fills the roseter data
*/
Roster.prototype.fillRosterInformation = function (isCallBackRequired) {
    try {
        var thisObject = this;
        var counter = 0;
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        //  Google Analytics Instance
        GlobalInstance.googleAnalyticsUtilInstance = GlobalInstance.getGoogleAnalyticsUtilInstance();
        var rosterPlayerData = {};
        var currentStyleInfo = null;
        var selectedStyleInfo = GlobalInstance.getUniformConfigurationInstance().getStylesInfo();
        var bottomStyleInfo = '';
        var tmpRosterList = JSON.parse(JSON.stringify(this.rosterList));
        $.each(tmpRosterList, function (i, rosterPlayer) {
            if ((Utility.getObjectlength(rosterPlayer.top) > 0 && rosterPlayer.top.size != null && rosterPlayer.top.size != '') || (Utility.getObjectlength(rosterPlayer.bottom) > 0 && rosterPlayer.bottom.size != null && rosterPlayer.bottom.size != '')) {
                rosterPlayer.seq = counter;
                currentStyleInfo = selectedStyleInfo;
                if (GlobalInstance.uniformConfigurationInstance.getTopAvailable() == false) {
                    delete rosterPlayer.top;
                }
                else if (Utility.getObjectlength(rosterPlayer.top) > 0 && rosterPlayer.top.size != null && rosterPlayer.top.size != '') {
                    rosterPlayer.top.skuId = thisObject.lookUpSkuID(rosterPlayer);
                    if (rosterPlayer.ageCategory == CONFIG.get('AGE_CATEGORY_BOYS') || rosterPlayer.ageCategory == CONFIG.get('AGE_CATEGORY_GIRLS')) {
                        currentStyleInfo = GlobalInstance.getUniformConfigurationInstance().getYouthStylesInfo();
                    }
                    if (currentStyleInfo) {
                        rosterPlayer.top.productionUrl = thisObject.getProductionUrl(true, currentStyleInfo.StyleNumber, rosterPlayer.top.size, rosterPlayer, currentStyleInfo.StyleId);
                    }
                }
                if (thisObject.selectedStyle.MatchingBottomStyleId <= CONFIG.get('MATCHING_STYLE_ID_BOTTOM') || GlobalInstance.uniformConfigurationInstance.getBottomAvailable() == false) {
                    delete rosterPlayer.bottom;
                }
                else if (Utility.getObjectlength(rosterPlayer.bottom) > 0 && rosterPlayer.bottom.size != null && rosterPlayer.bottom.size != '') {
                    rosterPlayer.bottom.skuId = thisObject.lookUpBottomSkuID(rosterPlayer);
                    bottomStyleInfo = GlobalInstance.getStyleAndDesignInstance().getMatchingBottomStyle(currentStyleInfo);
                    if (rosterPlayer.ageCategory == CONFIG.get('AGE_CATEGORY_BOYS') || rosterPlayer.ageCategory == CONFIG.get('AGE_CATEGORY_GIRLS')) {
                        bottomStyleInfo = GlobalInstance.getUniformConfigurationInstance().getBottomYouthStyleInfo();
                    }
                    if (bottomStyleInfo) {
                        rosterPlayer.bottom.productionUrl = thisObject.getProductionUrl(false, bottomStyleInfo.StyleNumber, rosterPlayer.bottom.size, rosterPlayer, bottomStyleInfo.StyleId);
                    }
                }
                if (rosterPlayer.playerEmailField != undefined && rosterPlayer.playerEmailField != null && rosterPlayer.playerEmailField != "") {
                    GlobalInstance.googleAnalyticsUtilInstance.trackEmailEntry(rosterPlayer.playerEmailField);
                }
                rosterPlayerData["_" + counter] = rosterPlayer;
                counter = counter + 1;
            }
        });

        //Call the SaveRosterCallback if it is not null;
        if (isCallBackRequired && this.saveRosterCallback) {
            GlobalInstance.uniformConfigurationInstance.RosterPlayers = null;
            GlobalInstance.uniformConfigurationInstance.setRosterPlayers(null, rosterPlayerData);
            this.saveRosterCallback();
        } else {
            // save data in unifrom configuration  
            GlobalInstance.uniformConfigurationInstance.setRosterPlayerInfo(null, rosterPlayerData);
        }
    }
    catch (e) {
        Log.trace('Error caught in fillRosterInformation ------' + e.message);
    }
}

/**
 * validation check for roster
 * 
 * @returns {Boolean}
 */
Roster.prototype.validateRoster = function (screenName) {
    var ret = true;
    var message = "";
    var haveName = false;
    var haveNumber = false;
    var quantityError = false;
    var ageCategoryError = false;
    var playerCount = 0;
    $.each(this.rosterList, function (i, player) {
        if ((Utility.getObjectlength(player.top) > 0 && player.top.quantity != null && player.top.quantity != 0) || (Utility.getObjectlength(player.bottom) > 0 && player.bottom.quantity != null && player.bottom.quantity != 0) || (player.name != null && player.name != '' && player.name.length > 0) || (player.number != null && player.number != '' && player.number.length > 0)) {
            if ((player.top.quantity == null || player.top.quantity == 0) && (player.bottom.quantity == 0 || player.bottom.quantity == 0))
                quantityError = true;
            if (player.name != null || player.name != '' || player.name.length > 0)
                haveName = true;
            if (player.number != null || player.number != '' || player.number.length > 0)
                haveNumber = true;
            if ((player.ageCategory == "" || player.ageCategory == null || player.ageCategory == undefined))
                ageCategoryError = true;
            playerCount++;
        }
    });
    if (ageCategoryError)
        message += MESSAGES.get('MESSAGE_ROSTER_AGE_CATEGORY_VALIDATE');
    if (quantityError)
        message += MESSAGES.get('MESSAGE_ROSTER_TOP_BOTTOM_VALIDATE');
    if (playerCount == 0 && screenName == 'proof')
        message += MESSAGES.get('MESSAGE_ROSTER_ADD_PLAYER_VALIDATE');
    if (screenName == 'proof') {
        ret = ret && !quantityError && !ageCategoryError && !(playerCount == 0);
    } else {
        ret = ret && !quantityError && !ageCategoryError;
    }
    if (!ret) {
        //display dialog box.
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.funcCallBack = function () {
            return true;
        };
        GlobalInstance.dialogBoxInstance.displayErrorMessageDialogBox(TITLE.get('TITLE_ROSTER_DATA_VALIDATION'), message);
    } else {
        //check for warnings about name/number entered but no name/number locations
        message = "";
        if (message != "") {
            //display dialog box.
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.funcCallBack = function () {
                return false;
            };
            GlobalInstance.dialogBoxInstance.displayErrorMessageDialogBox(TITLE.get('TITLE_ROSTER_DATA_VALIDATION'), message);
            ret = false;
        }
    }

    return ret;
};
/**
 * To clear the roster Player
 * 
 * @returns {void}
 */
Roster.prototype.clearRoster = function () {
    var thisObject = this;
    //display confirm dialogbox       
    GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
    GlobalInstance.dialogBoxInstance.funcCallBackForCancel = null;
    GlobalInstance.dialogBoxInstance.funcCallBack = function () {
        thisObject.lastPlayerId = 1;
        thisObject.rosterList = new Object();
        thisObject.playerNameCheckCount = 0;
        $('#' + thisObject.tblRosterPlayerBox + " table").find("tr:gt(0)").remove();
        $('#' + thisObject.tblRosterPlayerBox + " table").html('');
        thisObject.addRosterPlayer(CONFIG.get('DEFAULT_ROSTER_PLAYER'), true);
        $('#totalTopQuantity').html('0');
        $('#totalTopPrice').html('$0.00');
        $('#totalBottomPrice').html('$0.00');
        $('#totalBottomQuantity').html('0');
        $('#spanCustomUniformTotal').html('$0.00');
        //Hide the Delete button
        $('#btnDeletePlayer').removeClass('deleteButton');
        $('#dvIdNumberOfPlayerAdd').text('....' + 'Roster Has Been Cleared' + '.....').show(500);
        setTimeout(function () {
            $('#dvIdNumberOfPlayerAdd').hide(500);
        }, 5000);
        thisObject.setHtmlAndBind();
    };
    GlobalInstance.dialogBoxInstance.displayConfirmationDialogBox('Clear Roster', 'Are you sure you want to clear the complete Roster? Once you clear you will not be able to undo the changes.<br><br>Do you wish to continue?');
};
/**
 * Hide Top or bottom as per user choice 
 * 
 * @returns void
 */
Roster.prototype.displayTopBottom = function () {
    //show hide bottom components based on availability
    if (this.selectedStyle.MatchingBottomStyleId <= CONFIG.get('MATCHING_STYLE_ID_BOTTOM') || GlobalInstance.uniformConfigurationInstance.getBottomAvailable() == false) {
        $('.bottomSize').hide();
    } else {
        $('.bottomSize').show();
    }

    //show hide top components based on availability
    if (GlobalInstance.uniformConfigurationInstance.getTopAvailable() == false) {
        $('.topSize').hide();
    } else {
        $('.topSize').show();
    }
};
/**
 * Display top subtotoal Price
 *  
 * @returns {void}
 */
Roster.prototype.subTotalTopPrice = function () {
    //totalTopPrice
    var totalTopPrice = 0;
    $("input[name='playerTop[price][]']").each(function () {
        var val = $(this).val();
        totalTopPrice = parseFloat(totalTopPrice) + parseFloat(val.replace('$', ''));
    });
    $('#totalTopPrice').html('$' + totalTopPrice.toFixed(2));
};
/**
 * Display top subtotoal Price
 *  
 * @returns {void}
 */
Roster.prototype.subTotalTopQuantity = function () {
    //totalTopQuantity
    var totalTopQuantity = 0;
    $("input[name='playerTop[quantity][]']").each(function () {
        var val = $(this).val();
        if (val != null || val != '')
            totalTopQuantity = parseFloat(totalTopQuantity) + parseFloat(val);
    });
    $('#totalTopQuantity').html(totalTopQuantity);
};
/**
 * Display top subtotoal Price
 *  
 * @returns {void}
 */
Roster.prototype.subTotalBottomPrice = function () {
    //totalTopPrice
    var totalBottomPrice = 0;
    $("input[name='playerBottom[price][]']").each(function () {
        var val = $(this).val();
        if (val != null || val != '')
            totalBottomPrice = parseFloat(totalBottomPrice) + parseFloat(val.replace('$', ''));
    });
    $('#totalBottomPrice').html('$' + totalBottomPrice.toFixed(2));
};
/**
 * Display top subtotoal Price
 *  
 * @returns {void}
 */
Roster.prototype.subTotalBottomQuantity = function () {
    //totalTopQuantity
    var totalBottomQuantity = 0;
    $("input[name='playerBottom[quantity][]']").each(function () {
        var val = $(this).val();
        totalBottomQuantity = parseFloat(totalBottomQuantity) + parseFloat(val);
    });
    $('#totalBottomQuantity').html(totalBottomQuantity);
};
/**
 * Display top subtotoal Price
 *  
 * @returns {void}
 */
Roster.prototype.customUniformTotal = function () {
    var totalBottomPrice = $('#totalBottomPrice').html();
    var totalTopPrice = $('#totalTopPrice').html();
    totalTopPrice = parseFloat(totalTopPrice.replace('$', ''));
    totalBottomPrice = parseFloat(totalBottomPrice.replace('$', ''));
    var customUniformTotalPrice = 0;
    if (GlobalInstance.uniformConfigurationInstance.getTopAvailable()) {
        customUniformTotalPrice += totalTopPrice;
    }

    if (GlobalInstance.uniformConfigurationInstance.getBottomAvailable()) {
        customUniformTotalPrice += totalBottomPrice;
    }

    $('#spanCustomUniformTotal').html('$' + customUniformTotalPrice.toFixed(2));
};
/**
 * Display fabric
 *  
 * @returns {void}
 */
Roster.prototype.displayRosterFabric = function () {
    $('#spanFabricTitle').html(this.fabricInfo.Name);
    $("#dvViewRosterFabImg").html('<img src="' + LiquidPixels.getFabricUrl(35, 35, this.fabricInfo.ItemId) + '"/>');
};
/**
 * Display order name
 *  
 * @returns {void}
 */
Roster.prototype.displayRosterOrderName = function () {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    // get value from uniform configuration object 
    var orderName = GlobalInstance.uniformConfigurationInstance.getOrderName();
    if (orderName !== undefined && orderName !== null && orderName !== '') {
        $("#txtRosterOrderName").val(orderName);
    }

};
/**
 * Display order name
 *  
 * @returns {void}
 */
Roster.prototype.displayRosterTeamName = function () {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    // get value from uniform configuration object 
    var teamNameInfo = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo();
    if ((Utility.getObjectlength(teamNameInfo) > 0) && (teamNameInfo.text !== undefined && teamNameInfo.text !== null && teamNameInfo.text !== '')) {
        $("#txtRosterTeamName").val(teamNameInfo.text);
    }
};
/**
 * get top SkuID
 *  
 * @returns {string} skuId
 */
Roster.prototype.lookUpSkuID = function (playerObj) {
    var axaptaStyleId, axaptaColorId, playerSize, skuId = CONFIG.get('SKUID_DEFALUT_VALUE');
    try {
        if (Utility.getObjectlength(playerObj.top) > 0 && playerObj.top.size != null && playerObj.top.size != '') {
            if (playerObj.ageCategory == CONFIG.get('AGE_CATEGORY_BOYS') || playerObj.ageCategory == CONFIG.get('AGE_CATEGORY_GIRLS')) {
                axaptaStyleId = this.youthSelectedStyle.AxaptaStyle || '';
            } else {
                axaptaStyleId = this.selectedStyle.AxaptaStyle || '';
            }
            axaptaColorId = $.trim(this.fabricInfo.AxaptaColor);
            playerSize = playerObj.top.size;
            skuId = axaptaStyleId + '-' + axaptaColorId + '-' + playerSize;
        }

    } catch (e) {

    }
    return skuId;
};
/**
 * get bottom SkuID
 *  
 * @returns {string} skuId
 */
Roster.prototype.lookUpBottomSkuID = function (playerObj) {
    var axaptaStyleId, axaptaColorId, playerSize, skuId = "";
    if (Utility.getObjectlength(playerObj.bottom) > 0 && playerObj.bottom.size != null && playerObj.bottom.size != '') {
        GlobalInstance.styleAndDesignInstance = GlobalInstance.getStyleAndDesignInstance();
        var matchingBottomStyle = null;
        if (this.selectedStyle.MatchingBottomStyleId > CONFIG.get("MATCHING_STYLE_ID_BOTTOM")) {
            matchingBottomStyle = GlobalInstance.styleAndDesignInstance.getStyleByKey(this.selectedStyle.MatchingBottomStyleId);
        }
        if (matchingBottomStyle) {
            if (playerObj.ageCategory == CONFIG.get('AGE_CATEGORY_BOYS') || playerObj.ageCategory == CONFIG.get('AGE_CATEGORY_GIRLS')) {
                var youthStyleInfoForMatchingBootmStyle = GlobalInstance.getStyleAndDesignInstance().getYouthStyleInfoByStyleId(matchingBottomStyle.StyleId)
                if (Utility.getObjectlength(youthStyleInfoForMatchingBootmStyle) > 0) {
                    axaptaStyleId = youthStyleInfoForMatchingBootmStyle.AxaptaStyle || '';
                }
            } else {
                axaptaStyleId = matchingBottomStyle.AxaptaStyle || '';
            }
            var currentFabricId = this.fabricInfo.FabricId;
            if (matchingBottomStyle.Fabrics) {
                //var matchingBottomStyleFabricObj = jQuery.map(matchingBottomStyle.Fabrics, function(obj) {
                //    if (obj.FabricId == currentFabricId) {
                //        return obj;
                //    }
                //});
                //if (matchingBottomStyleFabricObj.length <= 0) {
                if (Utility.getObjectlength(matchingBottomStyle.Fabrics) > 0) {
                    matchingBottomStyleFabricObj = matchingBottomStyle.Fabrics[0];
                }
                //}
                try {
                    if (Utility.getObjectlength(matchingBottomStyleFabricObj) > 0) {
                        axaptaColorId = $.trim(matchingBottomStyleFabricObj.AxaptaColor);
                        playerSize = playerObj.bottom.size;
                        skuId = axaptaStyleId + '-' + axaptaColorId + '-' + playerSize;
                    }
                } catch (e) {

                }
            }
        }
    }
    return skuId;
};
/**
 * get ProductionUrl
 *  
 * @returns {string}
 */
Roster.prototype.getProductionUrl = function (isTop, currentStyleNumber, currentSize, rosterPlayer, styleId) {
    return LiquidPixels.getProductionUrl(isTop, currentStyleNumber, currentSize, rosterPlayer.ageCategory, rosterPlayer.name, rosterPlayer.number, styleId);
};
/**
 * get saved roster player
 * @returns {void}
 */
Roster.prototype.getSavedRosterPlayer = function () {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    this.savedRosterList = GlobalInstance.uniformConfigurationInstance.getRosterPlayerInfo();
    if (Utility.getObjectlength(this.savedRosterList) > 0) {
        this.isSaveRosterList = true;
        this.isUploadRosterList = false;
    }
};
/**
 * Display model preview
 *  
 * @returns {void}
 */
Roster.prototype.updateRosterModelPreview = function (currentPlayerId, isClickEvent) {
    var currentPlayerObject = this.rosterList[currentPlayerId];
    if (currentPlayerId != '') {
        var name = $('#txtPlayerName_' + currentPlayerId).val();
        var number = $('#txtPlayerNumber_' + currentPlayerId).val();
        if (name || number) {
            var params = {
                'Name': name,
                'Number': number,
                "currentPlayer": currentPlayerObject
            };
            //set the bird eye view accordingly
            var anchorPoints = GlobalInstance.uniformConfigurationInstance.getAnchorPoints();
            if (Utility.getObjectlength(anchorPoints) > 0) {
                var playerNamePerviewImageId = '';
                var playerNumberPerviewImageId = '';
                var playerNamePreviewImageName = '';
                var playerNumberPreviewImageName = '';
                for (var key in anchorPoints) {
                    var anchorPointObj = anchorPoints[key];
                    var type = anchorPointObj.type;
                    if (type == 'playername') {
                        playerNamePerviewImageId = anchorPointObj.PreviewImageID;
                        playerNamePreviewImageName = anchorPointObj.PreviewImageName;
                    }
                    if (type == 'playernumber') {
                        playerNumberPerviewImageId = anchorPointObj.PreviewImageID;
                        playerNumberPreviewImageName = anchorPointObj.PreviewImageName;
                    }
                }

                //set birds eye view
                var previewImageId = playerNamePerviewImageId || playerNumberPerviewImageId;
                var previewName = playerNamePreviewImageName || playerNumberPreviewImageName;
                if (previewImageId) {
                    var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
                    var currentStylePreviewImageId = jQuery.map(currentStyle.PreviewImages, function (obj) {
                        if (obj.Name == previewName) {
                            return obj.PreviewImageId;
                        }
                    });
                    if (currentStylePreviewImageId.length > 0) {
                        previewImageId = currentStylePreviewImageId[0];
                    }
                    $('.rosterBirdEyeViewDivTag').removeClass('active');
                    $('#rosterBirdPreview_' + previewImageId).parent().parent().addClass('active');
                    var styleId = $('#rosterBirdPreview_' + previewImageId).attr('styleid');
                    var selectedBirdView = GlobalInstance.styleAndDesignInstance.getBirdEyePreviewImageByImageId(styleId, previewImageId);
                    if (selectedBirdView) {
                        GlobalInstance.uniformConfigurationInstance.setBirdEyeView(selectedBirdView);
                        //update the state of birdeye view and model preview for front
                        $('.birdEyeViewDivTag').removeClass('active');
                        $('#birdPreview_' + selectedBirdView.PreviewImageId).parent().parent().addClass('active');
                        LiquidPixels.updateModelPreview('rosterjs 2465');
                    }
                }
            }

            LiquidPixels.updateRosterModelPreview(params, isClickEvent);
        }
        else {
            //display dialog box
            message = ("Please select a player to preview.", "User Input Required");
        }
    }
};
/**
 * Display model preview
 *  
 * @returns {void}
 */
Roster.prototype.displayPlayerEmailPopup = function (currentPlayerId) {
    var playerEmailHtml = '';
    var textMessage = "By entering your email you are requesting to <br/>receive exclusive e-communications unique only to our subscribers. Your personal information will never be rented or sold to third parties.";
    playerEmailHtml = '<div id="dvPlayerEmail_' + currentPlayerId + '" class="rosterPupupMsgQuesAllContainer" style="display:none">';
    playerEmailHtml += '<div class="rosterPupupMsgQues" id="dvDisplayToolTip_' + currentPlayerId + '" style="display:none">';
    playerEmailHtml += '<div class="msgcontenrBox">' + textMessage + ' </div>';
    playerEmailHtml += '<div class="closeBtnBox">   <div class="EmailPupupCloseBtn" id="dvEmailTooltipCloseBtn" onclick="javascript:$(\'#dvDisplayToolTip_' + currentPlayerId + '\').toggle(); $(\'#blanket\').css(\'opacity\',\'0.6\')"> </div>  </div>';
    playerEmailHtml += '</div>';
    playerEmailHtml += '<div class="rostermailPupupbox">';
    playerEmailHtml += '<div class="emailPupupArrow"> <img src="images/arrorosterpupup.png"> </div>';
    playerEmailHtml += '<div class="topLabelBox">';
    playerEmailHtml += '<div class="emailLabel"> Enter Player Email</div>';
    playerEmailHtml += '<div class="emailBtnBox">';
    playerEmailHtml += '<div class="EmailPupupQuestionBtn" onclick="javascript:$(\'#dvDisplayToolTip_' + currentPlayerId + '\').toggle(); $(\'#blanket\').css(\'opacity\',\'0.9\');"> </div>';
    playerEmailHtml += '<div class="EmailPupupCloseBtn" id="dvEmailPupupClose" onclick="javascript:$(\'#dvPlayerEmail_' + currentPlayerId + '\').toggle();$(\'#blanket\').hide();"> </div>';
    playerEmailHtml += '</div>';
    playerEmailHtml += '</div>';
    playerEmailHtml += '<div class="emailInputBox">';
    playerEmailHtml += '<input type="text" id="txtPlayerEmail_' + currentPlayerId + '" name="player[email][]" value="" class="rosterpupupEmailInput playerEmail" autofocus/>';
    playerEmailHtml += '</div>';
    playerEmailHtml += '<div class="EmailPupupokBtn" id="playerEmailPupupokBtn_' + currentPlayerId + '"></div>';
    playerEmailHtml += '<div id="dvEmailErrorBoxRoster_' + currentPlayerId + '" class="rosterErrorArrow_box_Email" style="display:none">This Field is required.</div>';
    playerEmailHtml += '</div>';
    playerEmailHtml += '</div>';
    return playerEmailHtml;
};
//<div id="dvEmailErrorBox" class="rosterErrorArrow_box" style="display: none;">Invalid Email</div>
/**
 * This method set the position for player email
 * @param  current currentlyselected Id to get the offset
 * 
 * @returns {undefined}
 */
Roster.prototype.setFabricEnlargeViewPosition = function (currentObject) {
    /* var currentPositionOffset = currentObject.parent().parent().offset();
     var childHeight = currentObject.parent().parent().find('.fabricBox').height();
     var childWidth = currentObject.parent().parent().find('.fabricBox').width();
     this.enlargeViewOffsetTop = currentPositionOffset.top - childHeight;
     this.enlargeViewOffsetLeft = currentPositionOffset.left + childWidth + FABRIC.get('ENLARGE_VIEW_OFFSET_LEFT');*/
};
/**
 * set Top Size Price List
 * @param  sizeList
 * @returns {void}
 */
Roster.prototype.setTopSizePriceList = function (sizeList) {
    this.topSizeList = sizeList;
};
/**
 * setBottomSizePriceList
 * @param  sizeList
 * @returns {void}
 */
Roster.prototype.setBottomSizePriceList = function (sizeList) {
    this.bottomSizeList = sizeList;
};
/**
 * get Top SizePriceList
 * @param  sizeList
 * @returns {void}
 */
Roster.prototype.getTopSizePriceList = function () {
    return this.topSizeList || null;
};
/**
 * getBottomSizePriceList
 * @param  sizeList
 * @returns {void}
 */
Roster.prototype.getBottomSizePriceList = function () {
    return this.bottomSizeList || null;
};
/**
 * getRosterList
 * @param  sizeList
 * @returns {void}
 */
Roster.prototype.getRosterList = function () {
    return this.rosterList;
};
/**
 * Bind model preview Orientation
 * 
 * @returns {void}
 */
Roster.prototype.setHtmlAndBindRosterBirdView = function (refresh) {
    var thisObject = this;
    if (!refresh) {
        //if bird eyeview panel is loaded and refresh is not needed return;
        var panel = $('#ulRosterBirdEyeList');
        if (panel.length) {
            return;
        }
    }
    //load bird eyeview panel
    $.loadPage('secRosterBirdEyeViewPanel', null, true, refresh, function () {
        var previewImages = GlobalInstance.styleAndDesignInstance.getBirdEyePreviewImageList();
        var selectedStyle = GlobalInstance.styleAndDesignInstance.getSelectedStyle();
        var selectedStylePreviewImages = previewImages['_' + selectedStyle.StyleId];
        var totalViews = 0;
        var fileName = '';
        var isBirdViewMatched = false;
        if (selectedStyle !== null) {
            var birdViewTag = '';
            var count = 0;
            var selectedBirdView = GlobalInstance.uniformConfigurationInstance.getBirdEyeView();
            var isUpdatedPreviewModelView = false;
            //var cntForProofShowBirdView = Utility.getObjectlength(previewImages['_' + selectedStyle.StyleId]);
            totalViews = Utility.getObjectlength(selectedStylePreviewImages);
            if (totalViews > 0) {
                try {
                    if (selectedBirdView) {
                        isBirdViewMatched = jQuery.map(selectedStylePreviewImages, function (obj) {
                            if (obj.Name.toLowerCase() == selectedBirdView.Name.toLowerCase()) {
                                return true;
                            } else {
                                return null;
                            }
                        });
                    }
                    isBirdViewMatched = isBirdViewMatched ? isBirdViewMatched[0] : false;
                } catch (err) {
                    if (CONFIG.get('DEBUG') === true) {
                        txt = "Error description: " + err.message + "\n\n";
                        txt += "Error filename: " + err.fileName + "\n\n";
                        txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                        Log.error(txt);
                    }
                }
                $.each(selectedStylePreviewImages, function (i, birdEyeView) {
                    count++;
                    var birdViewGridDetailsLength = parseInt(Utility.getObjectlength(birdEyeView.GridDetails));
                    if (birdViewGridDetailsLength > 0) {
                        //set the selected bird eye view as active
                        var stateSelectedClass = '';
                        if (selectedBirdView && selectedBirdView.PreviewImageId == birdEyeView.PreviewImageId) {
                            stateSelectedClass = 'active';
                        }

                        fileName = selectedStyle.StyleNumber + '_' + birdEyeView.Name.toLowerCase() + '_' + 'thumbnail.png';
                        birdViewTag += '<li><div class="rosterBirdEyeViewDivTag ' + stateSelectedClass + '"><a><img class="rosterBirdEyeSideImg" styleid= "' + selectedStyle.StyleId
                                + '" id="rosterBirdPreview_' + birdEyeView.PreviewImageId
                                + '" src="' + LiquidPixels.getBirdEyeViewImageUrl(selectedStyle.StyleNumber, birdEyeView.Name.toLowerCase()) + '"></a></div></li>';
                        //if for any reason bird eyeview is selected from another style selection, use the same orientation if match in current style
                        if (parseInt(Utility.getObjectlength(selectedBirdView)) > 0 && isUpdatedPreviewModelView == false && isBirdViewMatched == true) {
                            LiquidPixels.updateRosterModelPreview(null, false);
                            isUpdatedPreviewModelView = true;
                        }
                        else if (count === 1) { //select first bird eye view
                            GlobalInstance.uniformConfigurationInstance.setBirdEyeView(birdEyeView);
                            LiquidPixels.updateRosterModelPreview(null, false);
                        }
                        $('#rosterBirdPreview_' + birdEyeView.PreviewImageId).unbind();
                        $(document).on('click', '#rosterBirdPreview_' + birdEyeView.PreviewImageId, function () {
                            //set as active
                            $('.rosterBirdEyeViewDivTag').removeClass('active');
                            $(this).parent().parent().addClass('active');
                            var previewImageId = $(this).attr('id').split('_')[1];
                            var styleId = $(this).attr('styleid');
                            var selectedBirdView = GlobalInstance.styleAndDesignInstance.getBirdEyePreviewImageByImageId(styleId, previewImageId);
                            GlobalInstance.uniformConfigurationInstance.setBirdEyeView(selectedBirdView);
                            //LiquidPixels.updateRosterModelPreview(null);
                            var selectedPlayerObject = thisObject.getSelectedPlayerObject();
                            var params = null;
                            if (selectedPlayerObject) {
                                params = {
                                    'Name': selectedPlayerObject ? selectedPlayerObject.name || '' : '',
                                    'Number': selectedPlayerObject ? selectedPlayerObject.number || '' : '',
                                    "currentPlayer": selectedPlayerObject || ''
                                };
                            }
                            LiquidPixels.updateRosterModelPreview(params, true);
                            //update the state of birdeye view and model preview for front
                            $('.birdEyeViewDivTag').removeClass('active');
                            $('#birdPreview_' + selectedBirdView.PreviewImageId).parent().parent().addClass('active');
                            LiquidPixels.updateModelPreview('rosterjs 2658');
                            return false;
                        });
                    }
                });
                this.styleBirdEyePreviewListCount = totalViews;
                //fill the bird eve view and apply carousel effect
                $("#ulRosterBirdEyeList").html(birdViewTag);
                setTimeout(function () {
                    $('#ulRosterBirdEyeList').jcarousel();
                }, 100);
            }
        }
    });
};
/**
 * display Roster Notification
 * 
 * @returns {void}
 */
Roster.prototype.displayRosterNotification = function () {
    var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
    var tdRosterConditionalNotificationId = $("#tdRosterConditionalNotification");
    if (categoryInfo.Name != null && categoryInfo.Name != '') {
        var sportName = categoryInfo.Name;
        //Custom Code - Football QB Jersey
        if (sportName.toLowerCase() === "football") {
            //display content 
            tdRosterConditionalNotificationId.html('<span tabindex="0" class="rosterLink" id="spanFootBallSleeveRosterNotification" alt="See How To Order Your Sleeve" title="See How To Order Your Sleeve">FS or WS - Choose Your Sleeve</span>');
            $(document).off('click', "#spanFootBallSleeveRosterNotification");
            $(document).on('click', '#spanFootBallSleeveRosterNotification', function () {
                //display notification
                GlobalInstance.notificationsPopupInstance = GlobalInstance.getNotificationsPopupInstance();
                GlobalInstance.notificationsPopupInstance.RosterQBNotificationsPopup();
            });
        }
        else if (sportName.toLowerCase() === "basketball") {
            //display content
            tdRosterConditionalNotificationId.html('<span class="btmDescription">Youth Short Available in 7" inch Inseam Only</span>');
        }
    }

    // End - Custom Code    
};
/**
 * Display configurator Player name and number.
 * 
 * @returns {Boolean}
 */
Roster.prototype.displayPlayerNameAndNumber = function () {
    var name = '';
    var number = '';
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var anchorPoints = GlobalInstance.uniformConfigurationInstance.getAnchorPoints();
    for (key in anchorPoints) {
        var anchorPointObj = anchorPoints[key];
        if (anchorPointObj.id && anchorPointObj.type == 'playername') {
            name = anchorPointObj.Text;
        }
        if (anchorPointObj.id && anchorPointObj.type == 'playernumber') {
            number = anchorPointObj.Text;
        }
    }
    var playerId = $("#" + this.tblRosterPlayerBox + " table tr:nth-child(1)").attr('playerId');
    if (playerId != '' && playerId != null) {
        var currentName = $('#txtPlayerName_' + playerId).val();
        var currentNumber = $('#txtPlayerNumber_' + playerId).val();
        if (currentName == '' || currentName == null) {
            $('#txtPlayerName_' + playerId).val(name);
            this.rosterList[playerId].setPlayerNameInfo(name);
        }
        if (currentNumber == '' && currentNumber == null || currentNumber == 0) {
            $('#txtPlayerNumber_' + playerId).val(number);
            this.rosterList[playerId].setPlayerNumberInfo(number);
        }
    }
};
/**
 * data bind after upload roster file
 * 
 * @returns {Boolean}
 */
Roster.prototype.bindUploadRosterData = function (response) {
    response = jQuery.parseJSON(response);
    // check respone and display error.
    var thisObject = this;
    if (!thisObject.validateUploadRoster(response)) {
        return false;
    }
    this.clearBlankRosterListObject();
    this.isUploadRosterList = true;
    this.uploadRosterList = response.ResponseData;
    this.addRosterPlayer(CONFIG.get('DEFAULT_ROSTER_PLAYER'), false);
};
/**
 * Validates the Web service response 
 * 
 * @param res response object
 * 
 * @return Boolean true if response is valid, false otherwise
 */
Roster.prototype.validateUploadRoster = function (res) {
    var isValidResponse = true;
    try {
        if (res != '') {
            if (res.ResponseType == CONFIG.get('WEBSERVICE_FAILURE_CODE')) {
                isValidResponse = false;
            }
            if (isValidResponse == true && res.Error != undefined && res.Error.ErrorCode !== undefined && res.Error.ErrorCode != '') {
                isValidResponse = false;
            }
        } else {
            isValidResponse = false;
        }
        if (!isValidResponse) {
            $.doneProcess();
            //display error
            var message = res.Error.ErrorDescription;
            var arr = message.split("\r\n\r\n");
            message = arr.join("</br></br>");

            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.funcCallBack = function () {
                return false;
            };
            GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBoxHTML(TITLE.get('TITLE_UPLOAD_ROSTER_VALIDATION_ERROR'), message);
            return false;
        } else {
            // check for maximum limit 
            var currentNumberOfRecords = Utility.getObjectlength(this.rosterList);
            var numberOfRosterPlayer = Utility.getObjectlength(res.ResponseData);
            var totalNumberOfRecords = parseInt(currentNumberOfRecords) + parseInt(numberOfRosterPlayer);
            if (parseInt(totalNumberOfRecords) > parseInt(CONFIG.get('MAX_ROSTER_PLAYER'))) {
                GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                GlobalInstance.dialogBoxInstance.funcCallBack = function () {
                    return false;
                };
                GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_MAX_ROSTER'), MESSAGES.get('MESSAGE_MAX_ROSTER_PLAYER'));
                return false;
            }
        }
        return true;
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
        return isValidResponse;
    }
};
/**
 * used to clear blank rosterList object
 * 
 * @param res response object
 * 
 * @return Boolean true if response is valid, false otherwise
 */
Roster.prototype.clearBlankRosterListObject = function () {
    /*** clear roster player ****/
    var thisObject = this;
    var tmpPlayersList = this.rosterList;
    if (Utility.getObjectlength(tmpPlayersList) > 0 && Utility.getObjectlength(tmpPlayersList) > 0) {
        var counter = 1;
        $.each(tmpPlayersList, function (i, rosterPlayer) {
            if (((Utility.getObjectlength(rosterPlayer.top) > 0 && rosterPlayer.top.size != null && rosterPlayer.top.size != '') || (Utility.getObjectlength(rosterPlayer.bottom) > 0 && rosterPlayer.bottom.size != null && rosterPlayer.bottom.size != ''))) {
                counter = counter + 1;
            } else if ((rosterPlayer.name == null || rosterPlayer.name == '') && (rosterPlayer.number == null || rosterPlayer.number == '' || rosterPlayer.number == 0)) {
                if (Utility.getObjectlength(thisObject.rosterList[i])) {
                    delete thisObject.rosterList[i];
                    $("#rosterPlayer_" + i).remove();
                }
            }
        });
    }
    //return players;
};

/**
 * Class constructor to assign default values
 *
 * @return void
 */
function Player() {
    this.seq = null;
    this.name = null;
    this.number = null;
    this.ageCategory = null;
    this.advUniformType = null;
    this.top = new Object();
    this.bottom = new Object();
    this.playerEmailField = null;
}
;
/**
 * set player Seq
 * @param seq
 * @returns {void}
 */
Player.prototype.setPlayerSeqInfo = function (seq) {
    if (this.seq !== undefined) {
        this.seq = seq;
    }
};
/**
 * set player name
 * @param name
 * @returns {void}
 */
Player.prototype.setPlayerNameInfo = function (name) {
    if (this.name !== undefined) {
        this.name = name;
    }
};
/**
 * set player number
 * 
 * @param  number
 * @returns {void}
 */
Player.prototype.setPlayerNumberInfo = function (number) {
    if (this.number !== undefined) {
        this.number = number;
    }
};
/**
 * set player Age Category
 * 
 * @param  ageCategory
 * @returns {void}
 */
Player.prototype.setPlayerAgeCategoryInfo = function (ageCategory) {
    if (this.ageCategory !== undefined) {
        this.ageCategory = ageCategory;
    }
};
/**
 * set player advUniformType
 * @param  advUniformType
 * @returns {void}
 */
Player.prototype.setPlayerAdvUniformTypeInfo = function (advUniformType) {
    if (this.advUniformType !== undefined) {
        this.advUniformType = advUniformType;
    }
};
/**
 * set player EmailField
 * 
 * @param  playerEmailField
 * @returns {void}
 */
Player.prototype.setPlayerEmailFieldInfo = function (playerEmailField) {
    if (this.playerEmailField !== undefined) {
        this.playerEmailField = playerEmailField;
    }
};
/**
 * get player seq
 * @returns {void}
 */
Player.prototype.getPlayerSeqInfo = function () {
    return this.seq;
};
/**
 * This method is responsible for reteriving Player Name information 
 * 
 * @returns {name}
 */
Player.prototype.getPlayerNameInfo = function () {
    return this.name;
};
/*
 * This method is responsible for reteriving player number information
 * @returns {number}
 */
Player.prototype.getPlayerNumberInfo = function () {
    return this.number;
};
/**
 * This method is responsible for reteriving Player age category
 * @returns {ageCategory}
 */
Player.prototype.getPlayerAgeCategoryInfo = function () {
    return this.ageCategory;
};
/**
 * This method is responsible for reteriving Player uniform TyPe Information    
 * @returns {advUniformType}
 */
Player.prototype.getPlayerAdvUniformTypeInfo = function () {
    return this.advUniformType;
};
/**
 * This method is responsible for reteriving Player Email Feild Information
 * @returns {playerEmailField}
 */
Player.prototype.getPlayerEmailFieldInfo = function () {
    return this.playerEmailField;
};
/*************************************** TOP and Bottom Setter getter **********************/
/**
 * set Player top value
 * 
 * @param  key
 * @param  top
 * @returns {void}
 */
Player.prototype.setPlayerTopInfo = function (key, top) {
    if (this.top !== undefined) {
        this.top[key] = top;
    }
};
/*set Player bottom values
 * 
 * @returns {void}
 */
Player.prototype.setPlayerBottomInfo = function (key, bottom) {
    if (this.bottom !== undefined) {
        this.bottom[key] = bottom;
    }
};
/**
 * set Player full top object value
 *  
 * @param  top
 * @returns {void}
 */
Player.prototype.setPlayerAllTopInfo = function (top) {
    if (this.top !== undefined) {
        this.top = top;
    }
};
/** set Player full bottom object value
 * 
 * @returns {void}
 */
Player.prototype.setPlayerAllBottomInfo = function (bottom) {
    if (this.bottom !== undefined) {
        this.bottom = bottom;
    }
};
/**
 * This method is responsible for reteriving Player Top Information
 * @returns {top}
 */
Player.prototype.getPlayerTopInfo = function () {
    return this.top;
};
/**
 * This method is responsible for reteriving Player Bottom Information
 * @returns {bottom}
 */
Player.prototype.getPlayerBottomInfo = function () {
    return this.bottom;
};
/**
 * Binding buttons events
 * 
 * @return void
 */
Player.prototype.bindScreenButtons = function () {
};
/**
 * This method sets the TopSizeList
 * @param  sizeList
 * @returns {void}
 */
Roster.prototype.setTopSizePriceList = function (sizeList) {
    this.topSizeList = sizeList;
};
/**
 * This method sets the sizelist
 * @param  sizeList
 * @returns {void}
 */
Roster.prototype.setBottomSizePriceList = function (sizeList) {
    this.bottomSizeList = sizeList;
};
/**
 * This method is responsible for reteriving topSizeList
 * @returns {topSizeList or null}
 */
Roster.prototype.getTopSizePriceList = function () {
    return this.topSizeList || null;
};
/**
 * This method is responsible for reteriving bottomSizeList
 * @returns {bottomSizeList or null}
 */
Roster.prototype.getBottomSizePriceList = function () {
    return this.bottomSizeList || null;
};
/**
 * This method is responsible for reteriving rosterList
 * @returns {rosterList or null}
 */
Roster.prototype.getRosterList = function () {
    return this.rosterList;
};
/**
 * Add roster information on proof 
 * @returns {void}
 */
Roster.prototype.addTeamRosterInfo = function (divId, showMSRP) {
    var thisObject = this;
    var orderName = $('#txtRosterOrderName').val();
    var topTotalCount = 0;
    var topTotalPrice = 0;
    var bottomTotalCount = 0;
    var bottomTotalPrice = 0;
    var teamRosterInfoListHtml = '<table cellspacing="0" cellpadding="5" class="rosterTable">';
    if (orderName != undefined && orderName != null) {
        teamRosterInfoListHtml += '<tr style="background-color:#ccc" class="rosterTableLabel"> <td colspan="' + (showMSRP ? 9 : 7) + '"> <label class="orderNameLabel">Name of This Order: </label> <label id="orderNamelabel" class="orderName"> &nbsp;&nbsp; ' + orderName + '</label> </td></tr>';
    } else {
        teamRosterInfoListHtml += '<tr style="background-color:#ccc" class="rosterTableLabel"> <td colspan="' + (showMSRP ? 9 : 7) + '"> <label class="orderNameLabel">Name of This Order: </label> <label id="orderNamelabel" class="orderName"> &nbsp;&nbsp; ' + '' + '</label> </td></tr>';
    }
    teamRosterInfoListHtml += '<tr class="rosterTableHeader"><td  bgcolor="#323232" colspan="3" class="teamroster "><div class="pr">PLAYER  INFORMATION<div class="tabelDividerBar"></div></div></td><td colspan="' + (showMSRP ? 3 : 2) + '"  bgcolor="#323232" class="teamroster topSize"><div class="pr">TOP<div class="tabelDividerBar"></div></div></td><td colspan="' + (showMSRP ? 3 : 2) + '"  bgcolor="#323232" class="teamroster bottomSize">BOTTOM</td></tr>';
    teamRosterInfoListHtml += '<tr class="rosterTableHeader"><td bgcolor="#323232">Name</td><td bgcolor="#323232">#</td><td bgcolor="#323232">Category</td><td bgcolor="#323232" class="topSize">Qty</td><td bgcolor="#323232" class="topSize">Size</td>';
    if (showMSRP) {
        teamRosterInfoListHtml += '<td bgcolor="#323232" class="topSize">MSRP</td>';
    }
    teamRosterInfoListHtml += '<td bgcolor="#323232" class="bottomSize">Qty</td><td bgcolor="#323232" class="bottomSize">Size</td>';
    if (showMSRP) {
        teamRosterInfoListHtml += '<td bgcolor="#323232" class="bottomSize">MSRP</td>';
    }
    teamRosterInfoListHtml += '</tr>';
    if (this.objUtility.validateResponseFormat(this.rosterList)) {
        $.each(this.rosterList, function (i, teamRosterInfo) {
            if (teamRosterInfo.ageCategory && teamRosterInfo.top.quantity) {
                var gender = "";
                if (teamRosterInfo.ageCategory == CONFIG.get("AGE_CATEGORY_MEN") || teamRosterInfo.ageCategory == CONFIG.get("AGE_CATEGORY_FEMALE")) {
                    gender = CONFIG.get("AGE_CATEGORY_ADULT");
                } else {
                    gender = CONFIG.get("AGE_CATEGORY_YOUTH");
                }
                teamRosterInfoListHtml += '<tr class="rosterTableWhiteRow"> <td height="30">' + teamRosterInfo.name + '</td><td>' + teamRosterInfo.number + '</td>' + '<td>' + gender + '</td>';
                if (GlobalInstance.uniformConfigurationInstance.getTopAvailable()) {
                    teamRosterInfoListHtml += '<td>' + teamRosterInfo.top.quantity + '</td><td>' + teamRosterInfo.top.size.toUpperCase() + '</td>';
                    if (showMSRP) {
                        try {
                            topTotalCount += parseInt(teamRosterInfo.top.quantity);
                            var price = teamRosterInfo.top.price * parseInt(teamRosterInfo.top.quantity);
                            price = price.toFixed(2);
                            teamRosterInfoListHtml += '<td data="' + price + '" class="msrp">$' + price + '</td>';
                            topTotalPrice += parseFloat(price);
                        } catch (e) {
                        }
                    }
                }
                if (thisObject.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM') && GlobalInstance.uniformConfigurationInstance.getBottomAvailable() && teamRosterInfo.bottom) {
                    teamRosterInfoListHtml += '<td>' + teamRosterInfo.bottom.quantity + '</td><td>' + teamRosterInfo.bottom.size.toUpperCase() + '</td>';
                    if (showMSRP) {
                        try {
                            bottomTotalCount += parseInt(teamRosterInfo.bottom.quantity);
                            var price = teamRosterInfo.bottom.price * parseInt(teamRosterInfo.bottom.quantity);
                            price = price.toFixed(2);
                            bottomTotalPrice += parseFloat(price);
                            teamRosterInfoListHtml += '<td data="' + price + '" class="msrp">$' + price + '</td>';
                        } catch (e) {
                        }
                    }
                }
                teamRosterInfoListHtml += '</tr>';
            }
        });
    }

    if (showMSRP) {
        teamRosterInfoListHtml += '<tr class="rosterTableWhiteRow" style="background-color: #ccc;font-size:12px;"> <td height="30">Subtotals:</td><td></td><td></td>';
        if (GlobalInstance.uniformConfigurationInstance.getTopAvailable()) {
            teamRosterInfoListHtml += '<td class="topSize">' + topTotalCount + '</td><td></td><td data="' + topTotalPrice.toFixed(2) + '" class="topSize msrp">$' + topTotalPrice.toFixed(2) + '</td>';
        }
        if (thisObject.selectedStyle.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM') && GlobalInstance.uniformConfigurationInstance.getBottomAvailable()) {
            teamRosterInfoListHtml += '<td class="bottomSize">' + bottomTotalCount + '</td><td></td><td data="' + bottomTotalPrice.toFixed(2) + '" class="bottomSize msrp">$' + bottomTotalPrice.toFixed(2) + '</td></tr>';
        }
    }

    teamRosterInfoListHtml += '</table>';
    $("#" + divId).html(teamRosterInfoListHtml);
    if (showMSRP) {
        var totalPrice = topTotalPrice + bottomTotalPrice;
        totalPrice = totalPrice.toFixed(2);
        $('#spanQuoteTotal').html('$' + totalPrice);
        $('#spanQuoteTotal').attr('data', totalPrice);
    }

    thisObject.displayTopBottom();
};
/**
 * set uniform Emblishments information
 * @param ctrlId
 * @returns {void}
 */
Roster.prototype.uniformEmblishmentsInfo = function (ctrlId, sizeDisplayName, isTop) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var thisObject = this;
    //create table
    var uniformEmblishmentsHtml = '<table class="tableWidth" cellpadding="1" cellspacing="0" border="0" >';
    var uniformEmblishMentForPrintAndQoute = "";
    uniformEmblishMentForPrintAndQoute = '<table class="tableWidth" cellpadding="1" cellspacing="0" border="0" >';
    //add table header
    var anchorPoints = GlobalInstance.uniformConfigurationInstance.getAnchorPoints();
    if (Utility.getObjectlength(anchorPoints) > 0) {
        //add table rows
        var playerName = '';
        var playerNumber = '';
        var displayText = '';
        var sizeName = '';
        var tempRoster = JSON.parse(JSON.stringify(this.rosterList));

        for (var key in anchorPoints) {
            var anchorPointObj = anchorPoints[key];
            GlobalInstance.colorInstance = GlobalInstance.getColorInstance();
            var oColor1 = GlobalInstance.colorInstance.getColorByKey('_' + anchorPointObj.FontColor);
            var oColor2 = GlobalInstance.colorInstance.getColorByKey('_' + anchorPointObj.FontOutlineColor1);
            var oColor3 = GlobalInstance.colorInstance.getColorByKey('_' + anchorPointObj.FontOutlineColor2);
            var anchorPointSizeName = anchorPointObj.Size ? anchorPointObj.Size.Name : '';

            if (anchorPointObj.type == LOCATION_TYPE.get('secEmblemAndGraphicsPanel')) {
                var graphicId = anchorPointObj.GraphicId;
                var graphicObject = GlobalInstance.getSelectGraphicsInstance().getSelectedGraphicByGraphicId(graphicId);
				//If graphic object is undefined or null , then get the graphic information from Clicked graphic info
				if (!graphicObject) {
					graphicObject = GlobalInstance.getUniformConfigurationInstance().getClickedGraphicsInfo("_"+graphicId);
				}
                var numberOfClorSupported = 0;
                GlobalInstance.selectGraphicsInstance = GlobalInstance.getSelectGraphicsInstance();
                for (var key in graphicObject.Lys) {
                    var gData = graphicObject.Lys[key];
                    if (gData.ColorizeId == CONFIG.get('COLORIZEID_COLOR_1') || gData.ColorizeId == CONFIG.get('COLORIZEID_COLOR_2') || gData.ColorizeId == CONFIG.get('COLORIZEID_COLOR_3')) {
                        numberOfClorSupported++;
                    }
                }
                if (numberOfClorSupported == 3) {
                    //Graphic Support all colors
                } else if (numberOfClorSupported == 2) {
                    oColor3 = null;
                } else if (numberOfClorSupported == 1) {
                    oColor2 = null;
                    oColor3 = null;
                }
            }


            var fontName = anchorPointObj.FontName ? anchorPointObj.FontName : '';
            uniformEmblishMentForPrintAndQoute += '<tr class="rosterTableWhiteRow">';
            uniformEmblishMentForPrintAndQoute += '<td width="%" valign="top" class="thBorder">' + ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObj.type) + '</td>';
            uniformEmblishMentForPrintAndQoute += '<td width="100" valign="top" class="thBorder">' + anchorPointObj.displayName + '</td>';
            uniformEmblishMentForPrintAndQoute += '<td width="70" valign="top" class="thBorder">' + anchorPointSizeName + '</td>';
            uniformEmblishMentForPrintAndQoute += '<td width="70" valign="top" class="thBorder">' + fontName + '</td>';
            uniformEmblishMentForPrintAndQoute += '<td width="70" valign="top" class="thBorder">' + anchorPointObj.Text + '</td>';
            uniformEmblishMentForPrintAndQoute += '<td width="70" valign="top" class="thBorder">' + (oColor1 ? Utility.getTaaColorId(oColor1.ColorId) : '') + '</td>';
            uniformEmblishMentForPrintAndQoute += '<td width="70" valign="top" class="thBorder">' + (oColor2 ? Utility.getTaaColorId(oColor2.ColorId) : '') + '</td>';
            uniformEmblishMentForPrintAndQoute += '<td width="70" valign="top" class="thBorder">' + (oColor3 ? Utility.getTaaColorId(oColor3.ColorId) : '') + '</td></tr>';



            $.each(tempRoster, function (i, data) {
                playerName = $('#txtPlayerName_' + i).val();
                playerNumber = $('#txtPlayerNumber_' + i).val();
                if ((data.ageCategory == CONFIG.get('AGE_CATEGORY_BOYS') || data.ageCategory == CONFIG.get('AGE_CATEGORY_GIRLS')) && !anchorPointObj.isSameDimensionCheck) {
                    if (thisObject.arrYouthSizeProofInfo.length > 0) {
                        for (var key1 in thisObject.arrYouthSizeProofInfo) {
                            if (thisObject.arrYouthSizeProofInfo[key1]) {
                                if (anchorPointObj.type == thisObject.arrYouthSizeProofInfo[key1].type && anchorPointObj.id == thisObject.arrYouthSizeProofInfo[key1].anchorPointId) {
                                    anchorPointSizeName = thisObject.arrYouthSizeProofInfo[key1].sizeName;
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    if (thisObject.arrAdultSizeProofInfo.length > 0) {
                        for (var key2 in thisObject.arrAdultSizeProofInfo) {
                            if (thisObject.arrAdultSizeProofInfo[key2]) {
                                if (anchorPointObj.type == thisObject.arrAdultSizeProofInfo[key2].type && anchorPointObj.id == thisObject.arrAdultSizeProofInfo[key2].anchorPointId) {
                                    anchorPointSizeName = thisObject.arrAdultSizeProofInfo[key2].sizeName;
                                    break;
                                }
                            }
                        
                        }
                    }
                }
                if (isTop && Utility.getObjectlength(data.top) > 0 && anchorPointObj.isForTop) {
                    sizeName = $('#selPlayerTopSize_' + i + ' option:selected').text();
                    displayText = thisObject.getEmblishmentData(isTop, anchorPointObj, playerName, playerNumber);
                    if (sizeName == sizeDisplayName) {
                        var fontName = anchorPointObj.FontName ? anchorPointObj.FontName : '';
                        displayText = (anchorPointObj.type == LOCATION_TYPE.get('secMyLockerPanel')) ? "" : displayText;
                        uniformEmblishmentsHtml += '<tr class="rosterTableWhiteRow">';
                        uniformEmblishmentsHtml += '<td width="42" valign="top" class="thBorder">' + ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObj.type) + '</td>';
                        uniformEmblishmentsHtml += '<td width="45" valign="top" class="thBorder">' + anchorPointObj.displayName + '</td>';
                        uniformEmblishmentsHtml += '<td width="45" valign="top" class="thBorder">' + anchorPointSizeName + '</td>';
                        uniformEmblishmentsHtml += '<td width="90" valign="top" class="thBorder">' + fontName + '</td>';
                        uniformEmblishmentsHtml += '<td width="90" valign="top" class="thBorder">' + displayText + '</td>';
                        uniformEmblishmentsHtml += '<td width="60" valign="top" class="thBorder">' + (oColor1 ? oColor1.Name : '') + '</td>';
                        uniformEmblishmentsHtml += '<td width="60" valign="top" class="thBorder">' + (oColor2 ? oColor2.Name : '') + '</td>';
                        uniformEmblishmentsHtml += '<td width="60" valign="top" class="thBorder">' + (oColor3 ? oColor3.Name : '') + '</td></tr>';
                    }
                } else if (!isTop && Utility.getObjectlength(data.bottom) > 0 && !anchorPointObj.isForTop) {
                    sizeName = $('#selPlayerBottomSize_' + i + ' option:selected').text();
                    displayText = thisObject.getEmblishmentData(isTop, anchorPointObj, playerName, playerNumber);
                    if (sizeName == sizeDisplayName) {
                        var fontName = anchorPointObj.FontName ? anchorPointObj.FontName : '';
                        displayText = (anchorPointObj.type == LOCATION_TYPE.get('secMyLockerPanel')) ? "" : displayText;
                        uniformEmblishmentsHtml += '<tr class="rosterTableWhiteRow">';
                        uniformEmblishmentsHtml += '<td width="42" class="thBorder">' + ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObj.type) + '</td>';
                        uniformEmblishmentsHtml += '<td width="45" class="thBorder">' + anchorPointObj.displayName + '</td>';
                        uniformEmblishmentsHtml += '<td width="45" class="thBorder">' + anchorPointSizeName + '</td>';
                        uniformEmblishmentsHtml += '<td width="90" class="thBorder">' + fontName + '</td>';
                        uniformEmblishmentsHtml += '<td width="90" class="thBorder">' + displayText + '</td>';
                        uniformEmblishmentsHtml += '<td width="60" class="thBorder">' + (oColor1 ? oColor1.Name : '') + '</td>';
                        uniformEmblishmentsHtml += '<td width="60" class="thBorder">' + (oColor2 ? oColor2.Name : '') + '</td>';
                        uniformEmblishmentsHtml += '<td width="60" class="thBorder">' + (oColor3 ? oColor3.Name : '') + '</td></tr>';
                    }
                }
            })
        }
    }
    uniformEmblishmentsHtml += '</table>';
    uniformEmblishMentForPrintAndQoute += '</table>';
    $("#dvIdEmblishment").html(uniformEmblishmentsHtml);
    $("#dvIdQouteEmblishMentInfo , #dvIdProofEmblishMentInfo , #dvIdPrintEmblishMentInfo").html(uniformEmblishMentForPrintAndQoute);
    return;
};

Roster.prototype.getEmblishmentData = function (isTop, anchorPointObject, playerName, playerNumber) {
    var displayText = ''
    if (isTop) {
        if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_PLAYER_NAME')) {
            displayText = playerName != '' ? playerName : '';
        } else if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_PLAYER_NUMBER')) {
            displayText = playerNumber != '' ? playerNumber : '';
        }
        else if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_TEAM_NAME')) {
            displayText = anchorPointObject.Text;
        } else if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_OTHER_TEXT')) {
            displayText = anchorPointObject.Text;
        } else if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_GRAPHIC')) {
            displayText = anchorPointObject.GraphicSubCategoryName;
        } else if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_UPLOADED_GRAPHIC')) {
            var uploadGraphicName = anchorPointObject.GraphicName.substring(anchorPointObject.GraphicName.lastIndexOf('/') + 1);
            displayText = uploadGraphicName;
        }
        else {
            displayText = '';
        }
    } else {
        if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_PLAYER_NAME')) {
            displayText = playerName != '' ? playerName : '';
        } else if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_PLAYER_NUMBER')) {
            displayText = playerNumber != '' ? playerNumber : '';
        }
        else if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_TEAM_NAME')) {
            displayText = anchorPointObject.Text;
        } else if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_OTHER_TEXT')) {
            displayText = anchorPointObject.Text;
        } else if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_GRAPHIC')) {
            displayText = anchorPointObject.GraphicSubCategoryName;
        } else if (ANCHOR_LOCATION_NAME_FROM_TYPE.get(anchorPointObject.type) == CONFIG.get('PANEL_UPLOADED_GRAPHIC')) {
            var uploadGraphicName = anchorPointObject.GraphicName.substring(anchorPointObject.GraphicName.lastIndexOf('/') + 1);
            displayText = uploadGraphicName;
        }
        else {
            displayText = '';
        }
    }
    return displayText;
}

/**
 * 
 * @returns {Roster.prototype.getSelectedPlayerObject.playerObj}
 */
Roster.prototype.getSelectedPlayerObject = function () {
    var selectedPlayerObject = null;
    var thisObject = this;
    try {
        var selectedRowId = $('#tblRosterPlayerBox tr.active').attr('playerid');
        var selectedPlayerObject = this.rosterList[selectedRowId];
        if (!selectedPlayerObject || !selectedPlayerObject.ageCategory) {
            //pick first row
            for (var key in thisObject.rosterList) {
                var playerObj = thisObject.rosterList[key];
                if (playerObj.ageCategory) {
                    selectedPlayerObject = playerObj;
                    break;
                }
            }
        }
    } catch (e) {
    }
    return selectedPlayerObject;
};

/**
 * This method sets the selected age category's size
 * @returns void -- Aronya
 */
Roster.prototype.setPlayerSizeInfoForSizeProof = function () {
    var thisObject = this;
    var youthObject = {};
    var adultObject = {};
    youthObject.isExist = false;
    this.playerSizeInfoForSizeProof = new Array();
    var tempRosterList = JSON.parse(JSON.stringify(this.rosterList));
    if (Utility.getObjectlength(tempRosterList) > 0) {
        var playerObject = {};
        $.each(tempRosterList, function (i, playerData) {
            playerObject = {};
            var isYouth = false;
            var genderId = -1;

            //Set the gender id
            if (playerData.ageCategory == CONFIG.get('AGE_CATEGORY_BOYS')) {
                genderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_MALE');
                youthObject.isExist = true;
                youthObject.ID = genderId;
            } else if (playerData.ageCategory == CONFIG.get('AGE_CATEGORY_MEN')) {
                genderId = CONFIG.get('SPORT_GENDER_ID_MALE');
                adultObject.ID = genderId;
            } else if (playerData.ageCategory == CONFIG.get('AGE_CATEGORY_FEMALE')) {
                genderId = CONFIG.get('SPORT_GENDER_ID_FEMALE');
                adultObject.ID = genderId;
            } else if (playerData.ageCategory == CONFIG.get('AGE_CATEGORY_GIRLS')) {
                genderId = CONFIG.get('SPORT_GENDER_ID_YOUTH_FEMALE');
                youthObject.isExist = true;
                youthObject.ID = genderId;
            }


            if (playerData.ageCategory == CONFIG.get('AGE_CATEGORY_BOYS') || playerData.ageCategory == CONFIG.get('AGE_CATEGORY_GIRLS')) {
                isYouth = true;
            }

            if (Utility.getObjectlength(playerData.top) > 0 && playerData.ageCategory) {
                playerObject.isTop = true;
                playerObject.isYouth = isYouth;
                playerObject.genderId = genderId;
                playerObject.sizeNumber = $('#selPlayerTopSize_' + i + ' option:selected').val();
                playerObject.displayName = $('#selPlayerTopSize_' + i + ' option:selected').text();
                playerObject.playerName = playerData.name;
                playerObject.playerNumber = playerData.number;
                playerObject.displayOrder = thisObject.getDisplayOrderOfSelectedSize(playerObject.isTop, playerObject.displayName, playerObject.genderId);

                //Insert or Update the sizeProof Array
                if (!thisObject.isExistSizeNumber(thisObject.playerSizeInfoForSizeProof, playerObject.displayName)) {
                    thisObject.playerSizeInfoForSizeProof.push(playerObject);
                }
            }

            if (Utility.getObjectlength(playerData.bottom) > 0 && playerData.ageCategory) {
                playerObject = {};
                playerObject.isTop = false;
                playerObject.isYouth = isYouth;
                playerObject.genderId = genderId;
                playerObject.sizeNumber = $('#selPlayerBottomSize_' + i + ' option:selected').val();
                playerObject.displayName = $('#selPlayerBottomSize_' + i + ' option:selected').text();
                playerObject.playerName = '';
                playerObject.playerNumber = '';
                playerObject.displayOrder = thisObject.getDisplayOrderOfSelectedSize(playerObject.isTop, playerObject.displayName, playerObject.genderId);

                //Insert or Update the sizeProof Array
                if (!thisObject.isExistSizeNumber(thisObject.playerSizeInfoForSizeProof, playerObject.displayName)) {
                    thisObject.playerSizeInfoForSizeProof.push(playerObject);
                }
            }
        });
    }

    try {
        //Call the GarmentSize API
        if (youthObject.isExist) {
            this.getGarmentSizes(youthObject, false);
        }
    } catch (e) {
        Log.error('Error caught in the calling the GetGarmentSizes------' + e.message);
    }
};

/**
 * 
 * @param Array in which data to be checked
 * @param sizeDisplayName - name to compare
 * @returns Boolean value
 */
Roster.prototype.isExistSizeNumber = function (arrayToCheck, displayName) {
    var isPresent = false;
    for (var i = 0; i < arrayToCheck.length; i++) {
        if (arrayToCheck[i]) {
            if (arrayToCheck[i].displayName == displayName) {
                isPresent = true;
                break;
            }
        }
    }
    return isPresent;
};


/**
 * Returns the display order of the size number
 * @param isTop - Check size for top or for bottom
 * @param sizeName - Size Name whose display order to be retrieved
 * @returns display order
 */
Roster.prototype.getDisplayOrderOfSelectedSize = function (isTop, sizeName, genderId) {
    var index = -1;
    var sizeObjectToCheck = null;
    if (isTop) {
        sizeObjectToCheck = jQuery.map(this.getTopSizePriceList(), function (n, i) {
            return (i == '_' + genderId ? n : null);
        });
    } else {
        sizeObjectToCheck = jQuery.map(this.getBottomSizePriceList(), function (n, i) {
            return (i == '_' + genderId ? n : null);
        });
    }

    $.each(sizeObjectToCheck, function (i, data) {
        if (data.Name == sizeName) {
            index = i;
        }
    });

    return index;
}

/*
*Update THe roster List if Style changes
*
*/
Roster.prototype.updateRosterInformation = function (selectedStyle) {
    try {
        var saveRosterList = GlobalInstance.getUniformConfigurationInstance().getRosterPlayers();
        var thisObject = this;
        var playerId = 0;
        var isAdult = true;
        var topSizeList = this.getTopSizePriceList();
        var bottomSizeList = this.getBottomSizePriceList();
        var mappedTopSize = {};
        var mappedBottomSize = {};
        var isDataValidate;
        var tempRosterList = JSON.parse(JSON.stringify(this.rosterList));
        if (Utility.getObjectlength(tempRosterList) > 0) {
            $.each(tempRosterList, function (i, data) {
                //playerId = data.seq + 1;
                isDataValidate = false;
                playerId = i;
                isAdult = true;
                if (data.ageCategory == CONFIG.get("AGE_CATEGORY_BOYS") || data.ageCategory == CONFIG.get("AGE_CATEGORY_GIRLS")) {
                    isAdult = false;
                }

                //Check that if top information is present or not
                if (Utility.getObjectlength(data.top) > 0) {
                    for (var key in topSizeList) {
                        var sizeData = topSizeList[key];
                        for (var s in sizeData) {
                            var sData = sizeData[s];
                            if ((sData.GenderTypeId == CONFIG.get("SPORT_GENDER_ID_MALE") || sData.GenderTypeId == CONFIG.get("SPORT_GENDER_ID_FEMALE")) && isAdult) {
                                if (data.top.size == sData.SizeNumber) {
                                    isDataValidate = true;
                                    mappedTopSize.sizeNumber = sData.SizeNumber;
                                    mappedTopSize.displayName = sData.Name;
                                    break;
                                }
                            } else if ((sData.GenderTypeId == CONFIG.get("SPORT_GENDER_ID_YOUTH_MALE") || sData.GenderTypeId == CONFIG.get("SPORT_GENDER_ID_YOUTH_FEMALE")) && !isAdult) {
                                if (data.top.size == sData.SizeNumber) {
                                    isDataValidate = true;
                                    mappedTopSize.sizeNumber = sData.SizeNumber;
                                    mappedTopSize.displayName = sData.Name;
                                    break;
                                }
                            } else {
                                isDataValidate = false;
                                break;
                            }
                            if (isDataValidate) {
                                break;
                            }
                        }
                    }
                }

                //Check that if bottom information is present or not
                if (Utility.getObjectlength(data.bottom) > 0) {
                    for (var key in bottomSizeList) {
                        var sizeData = bottomSizeList[key];
                        for (var s in sizeData) {
                            var sData = sizeData[s];
                            if ((sData.GenderTypeId == CONFIG.get("SPORT_GENDER_ID_MALE") || sData.GenderTypeId == CONFIG.get("SPORT_GENDER_ID_FEMALE")) && isAdult) {
                                if (data.bottom.size == sData.SizeNumber) {
                                    isDataValidate = true;
                                    mappedBottomSize.sizeNumber = sData.SizeNumber;
                                    mappedBottomSize.displayName = sData.Name;
                                    break;
                                }
                            } else if ((sData.GenderTypeId == CONFIG.get("SPORT_GENDER_ID_YOUTH_MALE") || sData.GenderTypeId == CONFIG.get("SPORT_GENDER_ID_YOUTH_FEMALE")) && !isAdult) {
                                if (data.bottom.size == sData.SizeNumber) {
                                    isDataValidate = true;
                                    mappedBottomSize.sizeNumber = sData.SizeNumber;
                                    mappedBottomSize.displayName = sData.Name;
                                    break;
                                }
                            } else {
                                isDataValidate = false;
                                break;
                            }
                            if (isDataValidate) {
                                break;
                            }
                        }
                    }
                }

                thisObject.updateRosterSizes(playerId, mappedTopSize, mappedBottomSize);
            });
        }
    } catch (e) {
        //Log.clear();
        Log.error('Error in the Update Roster Information ----' + e.message);
    }
};

/*
*This method updated the Roster Sizes
*/
Roster.prototype.updateRosterSizes = function (playerId, topSize, bottomSize) {
    try {
        var thisObject = this;
        $(document).off('change', '#selPlayerAgeCategory_' + playerId);
        $(document).on('change', '#selPlayerAgeCategory_' + playerId, function () {
            Log.trace('Player age category change event called')
            var selected = $(this).val();
            var currentPlayerId = $(this).attr('id');
            currentPlayerId = currentPlayerId ? currentPlayerId.replace('selPlayerAgeCategory_', '') : 0;
            thisObject.bindPlayerSizeHtml(selected, currentPlayerId);
            //save 
            thisObject.saveRosterPlayer(currentPlayerId);
            return false;
        });
        $('#selPlayerAgeCategory_' + playerId).change();

        //If matching top size available
        if (Utility.getObjectlength(topSize) > 0) {
            var topSizeObj = $('#selPlayerTopSize_' + playerId + " option").filter(function () {
                return $(this).val() == topSize.sizeNumber;
            });
            topSizeObj.attr('selected', true);
            $(document).off('change', "#selPlayerTopSize_" + playerId);
            $(document).on('change', "#selPlayerTopSize_" + playerId, function () {
                // change the price with Qty.        
                var currentPlayerId = $(this).attr('id');
                currentPlayerId = currentPlayerId ? currentPlayerId.replace('selPlayerTopSize_', '') : 0;
                var currentSizeId = $('#selPlayerTopSize_' + currentPlayerId).val();
                var qty = $("#txtPlayerTopQuantity_" + currentPlayerId).val();
                var ageCategory = $('#selPlayerAgeCategory_' + currentPlayerId).val();
                var price = GlobalInstance.shoppingCartInstance.getFabricPrice(thisObject.topSizeList, ageCategory, currentSizeId);
                var totalPrice = (parseFloat(qty) > 1) ? parseFloat(price) * parseFloat(qty) : parseFloat(price);
                var toFixedTotalPrice = totalPrice.toFixed(2);
                $("#txtPlayerTopPrice_" + currentPlayerId).val('$' + toFixedTotalPrice);
                $('#txtPlayerTopPrice_' + currentPlayerId).attr({
                    'alt': '$' + toFixedTotalPrice,
                    'title': '$' + toFixedTotalPrice
                });
                //updated the price
                thisObject.subTotalTopPrice();
                thisObject.subTotalTopQuantity();
                thisObject.customUniformTotal();
                thisObject.saveRosterPlayer(currentPlayerId);
                return false;
            });
            $('#selPlayerTopSize_' + playerId).change();
        }

        //If matching bottom size available
        if (Utility.getObjectlength(bottomSize) > 0) {
            var bottomSizeObj = $('#selPlayerBottomSize_' + playerId + " option").filter(function () {
                return $(this).val() == bottomSize.sizeNumber;
            });
            bottomSizeObj.attr('selected', true);
            $(document).off('change', "#selPlayerBottomSize_" + playerId);
            $(document).on('change', "#selPlayerBottomSize_" + playerId, function () {
                // change the price with Qty.        
                var currentPlayerId = $(this).attr('id');
                currentPlayerId = currentPlayerId ? currentPlayerId.replace('selPlayerBottomSize_', '') : 0;
                var currentSizeId = $('#selPlayerBottomSize_' + currentPlayerId).val();
                var qty = $("#txtPlayerBottomQuantity_" + currentPlayerId).val();
                var ageCategory = $('#selPlayerAgeCategory_' + currentPlayerId).val();
                var price = GlobalInstance.shoppingCartInstance.getFabricPrice(thisObject.bottomSizeList, ageCategory, currentSizeId);
                var totalPrice = (parseFloat(qty) > 1) ? parseFloat(price) * parseFloat(qty) : parseFloat(price);
                var toFixedTotalPrice = totalPrice.toFixed(2);
                $("#txtPlayerBottomPrice_" + currentPlayerId).val('$' + toFixedTotalPrice);
                $('#txtPlayerBottomPrice_' + currentPlayerId).attr({
                    'alt': '$' + toFixedTotalPrice,
                    'title': '$' + toFixedTotalPrice
                });
                thisObject.saveRosterPlayer(currentPlayerId);
                //updated the price
                thisObject.subTotalBottomPrice();
                thisObject.subTotalBottomQuantity();
                thisObject.customUniformTotal();
                thisObject.saveRosterPlayer(currentPlayerId);
                return false;
            });
            $('#selPlayerBottomSize_' + playerId).change();
        }
    } catch (e) {
    }
}

/*
*This method get the garment sizes
*
*/
Roster.prototype.getGarmentSizes = function (genderObject, isForAdult) {
    try {
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var categoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
        var selectedAdultStyleInfo = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
        var selectedYouthStyleInfo = GlobalInstance.uniformConfigurationInstance.getYouthStylesInfo();
        var arrYouthStyleId = new Array();
        var arrAdultStyleId = new Array();
        var objCommHelper = null;
        var thisObject = this;
        //this.garmentSizes = new Object();

        //Adult Case
        if (Utility.getObjectlength(selectedAdultStyleInfo) > 0) {
            arrAdultStyleId.push(selectedAdultStyleInfo.StyleId);
            if (selectedAdultStyleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                arrAdultStyleId.push(selectedAdultStyleInfo.CopyOfStyleId);
            }
        }
        var adultBottomStyleInfo = null;
        if (selectedAdultStyleInfo.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) {
            arrAdultStyleId.push(selectedAdultStyleInfo.MatchingBottomStyleId);
            adultBottomStyleInfo = GlobalInstance.getStyleAndDesignInstance().getStyleByKey(selectedAdultStyleInfo.MatchingBottomStyleId);
            if (adultBottomStyleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                arrAdultStyleId.push(adultBottomStyleInfo.CopyOfStyleId);
            }
        }


        //Youth Case
        if (Utility.getObjectlength(selectedYouthStyleInfo) > 0) {
            arrYouthStyleId.push(selectedYouthStyleInfo.StyleId);
            if (selectedYouthStyleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                arrYouthStyleId.push(selectedYouthStyleInfo.CopyOfStyleId);
            }
        }

        var bottomYouthStyleInfo = null;
        if (selectedAdultStyleInfo.MatchingBottomStyleId > CONFIG.get('MATCHING_STYLE_ID_BOTTOM')) {
            bottomYouthStyleInfo = GlobalInstance.getStyleAndDesignInstance().getYouthStyleInfoByStyleId(selectedAdultStyleInfo.MatchingBottomStyleId);
            if (Utility.getObjectlength(bottomYouthStyleInfo) > 0) {
                arrYouthStyleId.push(bottomYouthStyleInfo.StyleId);
                if (bottomYouthStyleInfo.CopyOfStyleId > CONFIG.get('MATCHING_COPY_STYLE_ID')) {
                    arrYouthStyleId.push(bottomYouthStyleInfo.CopyOfStyleId);
                }
            }
        }

        var params = {
            'applicationId': GlobalInstance.uniformConfigurationInstance.getApplicationId(),
            'categoryId': categoryInfo.Id,
            'genderTypeId': genderObject.ID,
            'styleId': ''
        };

        var arrToUse = new Array();
        if (isForAdult) {
            arrToUse = arrAdultStyleId;
        } else {
            arrToUse = arrYouthStyleId;
        }

        if (arrToUse.length > 0) {
            for (var i = 0 ; i < arrToUse.length ; i++) {
                objCommHelper = new CommunicationHelper();
                params.styleId = arrToUse[i];
                objCommHelper.callAjax(thisObject.requestUrlForGarmentSize, 'GET', params, thisObject.responseType, null, thisObject.handleWebRequestCallbackForGarmentSize.bind(thisObject, params.styleId), null, null, null, null, null);
            }
        }

    } catch (e) {
        Log.error('Error caught in the getGarmentSize api called from roster.js ----' + e.message);
    }
}

/*
*This method handles the callback of getGarmentSize
*/
Roster.prototype.handleWebRequestCallbackForGarmentSize = function (styleId, response) {
    try {
        var thisObject = this;
        if (this.objUtility.validateResponseFormat(response, this.requestUrlForGarmentSize)) {
            thisObject.garmentSizes['_' + styleId] = response.ResponseData;
        }
    } catch (e) {
        Log.trace('Error caught in the getGarmentSize response---' + e.message);
    }
}

/*
* This method checks if selected size is to be overwritten or not
*/
Roster.prototype.getUpdatedSize = function (sizeObject, style, sizeNumber, isGraphicCase, isText, isRelativeAnchorSelected) {
    try {
        var relatedSizes = this.garmentSizes['_' + style.StyleId];
        var newDecalSizeId = 0;
        var newGraphicSizeObject = new Object();
        var isSizeMatched;
        isRelativeAnchorSelected = (typeof isRelativeAnchorSelected == "undefined") ? false : isRelativeAnchorSelected;
        if (!isGraphicCase) {
            for (var key in relatedSizes.TextSizes) {
                isSizeMatched = false;
                var sData = relatedSizes.TextSizes[key];
                if (sData.TextDecalSizeId == sizeObject.SizeId) {
                    for (var obj in sData.GarmentTextSizes) {
                        var oData = sData.GarmentTextSizes[obj];
                        if (oData.SizeNumber == sizeNumber && typeof oData.OverridingTextDecalSizeId != 'undefined' && typeof oData.OverridingTextDecalSizeId != 'boolean') {
                            newDecalSizeId = oData.OverridingTextDecalSizeId
                            isSizeMatched = true;
                            break;
                        }
                    }
                }
                if (isSizeMatched) {
                    break;
                }
            }
        } else {
            for (var key in relatedSizes.GraphicSizes) {
                isSizeMatched = false;
                var sData = relatedSizes.GraphicSizes[key];
                if (sData.GraphicSizeId == sizeObject.SizeId) {
                    for (var obj in sData.GarmentGraphicSizes) {
                        var oData = sData.GarmentGraphicSizes[obj];
                        if (oData.SizeNumber == sizeNumber) {
                            newGraphicSizeObject = oData;
                            isSizeMatched = true;
                            break;
                        }
                    }
                } else if (isRelativeAnchorSelected) {
                    if (sData.Name == sizeObject.Name) {
                        for (var obj in sData.GarmentGraphicSizes) {
                            var oData = sData.GarmentGraphicSizes[obj];
                            if (oData.SizeNumber == sizeNumber) {
                                newGraphicSizeObject = oData;
                                isSizeMatched = true;
                                break;
                            }
                        }
                    }
                }
                if (isSizeMatched) {
                    break;
                }
            }
        }
        if (isGraphicCase) {
            return newGraphicSizeObject;
        } else {
            return newDecalSizeId;
        }
    } catch (e) {
        Log.error('Error caugth in getUpdatedSize called from LiquidPixel.getFlatCutAnchorPointChainUrlPart() -----' + e.message);
    }
}