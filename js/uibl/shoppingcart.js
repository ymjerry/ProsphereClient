/**
 * TWA proshpere configurator
 * 
 * shoppingcart.js is used to define shoppingcart related functions. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 *
 * @return void
 */
function ShoppingCart() {

}

ShoppingCart.prototype.init = function() {
    this.bindShoppingCartCheckbox();
    this.bindScreenButtons();
};

/**
 * Binding buttons events
 * 
 * @return void
 */
ShoppingCart.prototype.bindScreenButtons = function() {
    $("#dvGoToRosterBtn").off('click');
    $(document).on('click', '#dvGoToRosterBtn', function() {
        if ($('.cartSelectedFabricLabel').is(':visible') && $('#dvIdFabricSelected').is(':visible') && Validator.isColorSelected()) {
            //hide configurator
            $.loadPage("dvRosterPanel", null, true, false, function() {
                //CHANGE THE BACKGROUND COLOR AT ROSTER
                try {
                    var catagoryInfo = GlobalInstance.uniformConfigurationInstance.getCategoryInfo();
                    //LiquidPixels.updateRosterModelPreview(null, false);// Update Model Preview On Every Time when Roster Panel is displayed ....False is set because roster model preview url is same as model preview
                    GlobalInstance.getRosterInstance().setHtmlAndBindRosterBirdView(true);
                    if (catagoryInfo) {
                        $('#rightBoxRoster').css('background-color', SPORTS_BACKGROUND_COLOR.get(catagoryInfo.Name));
                    }
                } catch (err) {
                    if (CONFIG.get('DEBUG') === true) {
                        txt = "Error description: " + err.message + "\n\n";
                        txt += "Error filename: " + err.fileName + "\n\n";
                        txt += "Error lineNumber: " + err.lineNumber + "\n\n";
                        window.console && console.log(txt);
                    }
                }

                GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
                if ((GlobalInstance.uniformConfigurationInstance.getUserId() != '' && GlobalInstance.uniformConfigurationInstance.getUserId() != null) || objApp.fromSingleItemAPI) {
                    $('#dvProofRosterPlayer').show();
                    $('#spnLinkProof').show();
                    $('#dvQuoteButtonBox').show();
                }

                Validator.setIsRosterSelected(true);
                GlobalInstance.emailPrintSaveInstance = GlobalInstance.getEmailPrintSaveInstance();
                GlobalInstance.emailPrintSaveInstance.bindScreenButtons();
                GlobalInstance.rosterInstance = GlobalInstance.getRosterInstance();
                GlobalInstance.rosterInstance.init();
                
                //show roster panel
                $('#secDefinePanel').waitForImages({
                    waitForAll: true,
                    finished: function() {
                        setTimeout(function(){
                            $('#dvConfiguratorPanel').hide();
                            $('#dvRosterPanel').show("fade", 300);
                            
                            //trigger the roster page landing event
                            $(document).trigger("PageLanded", CONFIG.get('LANDING_PAGE_ROSTER'));
                        },100);
                    }
                });
            });
        } else {
            // Validation dialogbox
            //Display Dialog Box.
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.funcCallBack = null;
            GlobalInstance.dialogBoxInstance.displayGoToRosterErrorMessageDialogBox(TITLE.get('TITLE_SAVE_VALIDATION'), null);
        }
    });
};

/**
 * Binds the checkboxes change event in shopping cart
 *
 * 
 * @return void
 */
ShoppingCart.prototype.bindShoppingCartCheckbox = function() {
    var thisObject = this;
    $('input[type=checkbox]').change(function() {
        thisObject.rebuildCart();
    });
};
/**
 * Rebuild the cart
 *
 * 
 * @return void
 */
ShoppingCart.prototype.rebuildCart = function() {
    GlobalInstance.loadConfigurationInstance = GlobalInstance.getLoadConfigurationInstance();
    var cartInformation = this.getCartInformation();
    GlobalInstance.rosterInstance = GlobalInstance.getRosterInstance();
    var topPricesList = GlobalInstance.rosterInstance.getTopSizePriceList();
    var bottomPriceList = GlobalInstance.rosterInstance.getBottomSizePriceList();
    var bottomPrice = 0;
    var topPrice = 0;
    var genderInfo = GlobalInstance.uniformConfigurationInstance.getGenderInfo();
    var topPriceAvailable = Utility.getObjectlength(topPricesList["_" + genderInfo.Id],'shpjs115');
    var bottomPriceAvailable = Utility.getObjectlength(bottomPriceList["_" + genderInfo.Id],'shpjs116');
    
    var currentDesign = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();

    if (parseInt(topPriceAvailable) > 0) {
        topPrice = this.getFabricPrice(topPricesList, genderInfo.Id , currentDesign.PreviewDecalSizeNumber);
    }

    if (parseInt(bottomPriceAvailable) > 0) {
        bottomPrice = this.getFabricPrice(bottomPriceList, genderInfo.Id, currentDesign.PreviewDecalSizeNumber);
    }

    GlobalInstance.fabricInstance = GlobalInstance.getFabricInstance();
    var currentStyle = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
    var styleFabrics = GlobalInstance.fabricInstance.getFabricByStyleId(currentStyle.StyleId);
    var fabricLength = Utility.getObjectlength(styleFabrics,'shpjs131');

    if ((GlobalInstance.loadConfigurationInstance.isLoaded() && Validator.isFabricSelected())
            || (Validator.isFabricSelected() && GlobalInstance.uniformConfigurationInstance.getFabricClicked())
            || (fabricLength === 1 && GlobalInstance.uniformConfigurationInstance.getCustomizeTabClicked())
            || (fabricLength > 1 && (GlobalInstance.uniformConfigurationInstance.getFabricClicked() || GlobalInstance.uniformConfigurationInstance.getCustomizeTabClicked()))
            ) {
        $('#dvIdFabricSelected').show();
        $("#dvIdFabricSelectedCartbox").css("visibility","visible");
        $('.cartSelectedFabricLabel').show();
        $('.cartSelectedFabricItem').show();
    }
    else {
        $('#dvIdFabricSelected').hide();
        $('.cartSelectedFabricLabel').hide();
        $('.cartSelectedFabricItem').hide();
    }
    try {
        // check price is available or not

        var isTopVisible = $('#dvIdAdultClothTop').is(":visible");
        var isBottomVisible = $('#idAdultClothBottom').is(":visible");

        var isTopChecked = $('#chkTopCart').is(":checked");
        var isBottomChecked = $('#idChkBottomCart').is(":checked");

        if (isTopVisible && !isBottomVisible) {
            $('#chkTopCart').prop('checked', true);
            $('#chkTopCart').prop('disabled', true);
        }

        if (isBottomVisible && isTopVisible) {
            if (isTopChecked && isBottomChecked) {
                $('#chkTopCart').prop('disabled', false);
                $('#idChkBottomCart').prop('disabled', false);
            } else if (isTopChecked && !isBottomChecked) {
                $('#chkTopCart').prop('disabled', true);
            } else if (isBottomChecked && !isTopChecked) {
                $('#idChkBottomCart').prop('disabled', true);
            }
        }

        var pricePrecision = CONFIG.get('PRICE_PRECISION');
        $('#topPriceVal').html(CONFIG.get('PRICE_SYMBOL') + ((topPrice > 0) ? topPrice.toPrecision(pricePrecision) : 0));
        $('.cartSelectedFabricLabel').html('<span id="spanFabric" style="cursor:default;">Fabric:</span> <br>' + '<div class="wrapup" style="text-overflow:ellipsis; white-space:nowrap; width: 144px; cursor:default;" title="' + cartInformation.Name + '">' + cartInformation.Name + '</div>');
        $('#dvIdFabricSelected').css("backgroundImage", "url(" + LiquidPixels.getFabricUrl(FABRIC.get('CART_FABRIC_WIDTH'), FABRIC.get('CART_FABRIC_HEIGHT'), cartInformation.ItemId) + ")");

        topPrice = (topPrice > 0 ? parseFloat(topPrice) : 0);

        $('#idBottomPriceVal').html(CONFIG.get('PRICE_SYMBOL') + ((bottomPrice > 0) ? bottomPrice.toPrecision(pricePrecision) : 0));

        if ($('#idChkBottomCart').is(':checked')) {
            bottomPrice = ((bottomPrice > 0) ? parseFloat(bottomPrice) : 0);
        } else {
            bottomPrice = 0;
        }
        /***********************/
        if ($('#chkTopCart').is(':checked')) {
            topPrice = ((topPrice > 0) ? parseFloat(topPrice) : 0);
        } else {
            topPrice = 0;
        }
        /***********************/

        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var totalPrice = 0;
        if ($('#idChkBottomCart').is(":checked") == true) {
            GlobalInstance.uniformConfigurationInstance.setBottomAvailable($('#idChkBottomCart').is(":checked"));
            bottomPrice = (parseFloat(bottomPrice) > 0) ? parseFloat(bottomPrice) : 0;
            totalPrice = (parseFloat(topPrice) + parseFloat(bottomPrice));
            $('#totalPrice').html(CONFIG.get('PRICE_SYMBOL') + ((totalPrice > 0) ? totalPrice.toPrecision(pricePrecision) : 0));
        } else {
            $('#idBottomPriceVal').html(CONFIG.get('PRICE_SYMBOL') + '0');
            GlobalInstance.uniformConfigurationInstance.setBottomAvailable($('#idChkBottomCart').is(":checked"));
            bottomPrice = 0;
            totalPrice = (parseFloat(topPrice) + parseFloat(bottomPrice));
            $('#totalPrice').html(CONFIG.get('PRICE_SYMBOL') + ((totalPrice > 0) ? totalPrice.toPrecision(pricePrecision) : 0));
        }

        /***********************/
        if ($('#chkTopCart').is(":checked") == true) {
            GlobalInstance.uniformConfigurationInstance.setTopAvailable($('#chkTopCart').is(":checked"));
            //topPrice = parseFloat(topPrice);

            totalPrice = (parseFloat(topPrice) + parseFloat(bottomPrice));
            $('#totalPrice').html(CONFIG.get('PRICE_SYMBOL') + ((totalPrice > 0) ? totalPrice.toPrecision(pricePrecision) : 0));
        } else {
             $('#topPriceVal').html(CONFIG.get('PRICE_SYMBOL') + '0');
            GlobalInstance.uniformConfigurationInstance.setTopAvailable($('#chkTopCart').is(":checked"));
            topPrice = 0;
            totalPrice = (parseFloat(topPrice) + parseFloat(bottomPrice));
           //
            $('#totalPrice').html(CONFIG.get('PRICE_SYMBOL') + ((totalPrice > 0) ? totalPrice.toPrecision(pricePrecision) : 0));
        }
        /***********************/

        totalPrice = (parseFloat(topPrice) + parseFloat(bottomPrice));
        GlobalInstance.uniformConfigurationInstance.setTotalUniformPrice(totalPrice.toFixed(2));
        $('#totalPrice').html(CONFIG.get('PRICE_SYMBOL') + ((totalPrice > 0) ? totalPrice.toFixed(2) : 0));
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            window.console && console.log(txt);

        }
    }

};

/**
 * Returns the cart information
 * 
 * @return Object cart information
 */
ShoppingCart.prototype.getCartInformation = function() {

    GlobalInstance.fabricInstance = GlobalInstance.getFabricInstance();
    var fabricInfo = GlobalInstance.uniformConfigurationInstance.getFabricsInfo();
    var cartInformation = GlobalInstance.fabricInstance.getFabricByKey(fabricInfo.StyleId, fabricInfo.FabricId || null);
    if (typeof cartInformation == 'undefined' || cartInformation == null) {
        cartInformation = CONFIG.get('DEFAULT_CART_INFO');
    }
    return cartInformation;

};

/**
 * Returns the Price information on the basis of fabric
 * @param  sizePriceInfo Price information on the basis of size
 * @param  genderId Id of gender
 * @param  sizeNumber sizenumber
 * @return Object cart information
 */
ShoppingCart.prototype.getFabricPrice = function(sizePriceInfo, genderId, sizeNumber,isTop) {
    var sizeInfoForPriceLength = Utility.getObjectlength(sizePriceInfo["_" + genderId],'shpjs267');
    var price = 0;
    var priceInfo = null;
    if (sizeInfoForPriceLength > 0) {
        //sizeNumber = sizeNumber ? sizeNumber : CONFIG.get('DEFAULT_PRICE_SHOPPING_CART_SIZE_NUMBER');
        if (!sizeNumber) {
            if (isTop) {
                sizeNumber = sizePriceInfo["_" + genderId][0].SizeNumber;
            } else {
                sizeNumber = sizePriceInfo["_" + genderId][0].SizeNumber;
            }
        }
        sizeNumber = sizeNumber.toLowerCase();
        priceInfo = jQuery.map(sizePriceInfo["_" + genderId], function(size) {
            if (size.SizeNumber.toLowerCase() == sizeNumber) {
                return size;
            }
        });
    }
    if (Utility.getObjectlength(priceInfo,'shpjs278') > 0 && Utility.getObjectlength(priceInfo[0].FabricPrices,'shpjs278') > 0) {
        price = (priceInfo != undefined && priceInfo[0].FabricPrices != undefined && priceInfo[0].FabricPrices[0]) ? Utility.getFabricPrice(priceInfo[0].FabricPrices[0]) : 0;
    }
    return price;
};