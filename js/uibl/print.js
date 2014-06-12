/**
 * TWA proshpere configurator
 * 
 * modellargeView.js is used to display model larger view related functionality. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 *
 * @return void
 */
function print() {
    this.isPrintButtonEnabled = false;
}
/*
 * This method returns the number of Alternate Views 
 * @param divBoxId
 * @returns void
 */
print.prototype.getAllBirdEyePreviewUrlNumbers = function (divBoxId) {
    var tempBirdEyeViewList = "";
    var thisObject = this;
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    var previewImages = GlobalInstance.getStyleAndDesignInstance().getBirdEyePreviewImageList();
    var selectedStyle = GlobalInstance.getStyleAndDesignInstance().getSelectedStyle();
    if (Utility.getObjectlength(previewImages['_' + selectedStyle.StyleId]) > 0) {
        $("#" + divBoxId).css('min-height', 'auto');
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
                tempBirdEyeViewList += '<div class="proofModelLeftImg" id=imageBirdEye_"' + divBoxId + iCount + '"><div class="showImageLoadingMessagePrint" id="dvIdShowImageLoadingMessagePrint_' + divBoxId + iCount + '">' + MESSAGES.get('MESSAGE_IMAGE_LOADING') + '</div><img class="" id="proofPreviewImg_' + divBoxId + iCount + '" currentindex="' + iCount + '" src="" style="visibility:hidden"></div>';
            } else {
                tempBirdEyeViewList += '<div class="proofModelLeftImg" id=imageBirdEye_"' + divBoxId + iCount + '"><div class="showImageLoadingMessagePrint" id="dvIdShowImageLoadingMessagePrint_' + divBoxId + iCount + '">' + MESSAGES.get('MESSAGE_IMAGE_LOADING') + '</div><img class="proofSmallPreviewImg" id="proofPreviewImg_' + divBoxId + iCount + '" currentindex="' + iCount + '" src="" style="visibility:hidden"></div>';
            }

            imageUrlArray[iCount] = imageUrl;
            iCount++;
        });
        var totalAlternateViews = Utility.getObjectlength(imageUrlArray);
        totalAternateViewsLoaded = 0;
        thisObject.isPrintButtonEnabled = false;
        $("#" + divBoxId).html('<div class="modelImgBox">' + tempBirdEyeViewList + '</div>');
        
        //load images
        for (var key in imageUrlArray) {
            LiquidPixels.transformUrl(imageUrlArray[key], function (shortPreviewImageSource, elementIdBeforeCall) {
                Utility.loadImage(elementIdBeforeCall, shortPreviewImageSource, function (elementId) {
                    var currentIndex = $('#' + elementId).attr('currentindex');
                    $("#dvIdShowImageLoadingMessagePrint_" + divBoxId + currentIndex).css('visibility', 'hidden');
                    totalAternateViewsLoaded++;
                    if (totalAternateViewsLoaded == totalAlternateViews) {
                        thisObject.isPrintButtonEnabled = true;
                    }
                }, function (elementId) {
                    var currentIndex = $('#' + elementId).attr('currentindex');
                    $("#dvIdShowImageLoadingMessagePrint_" + divBoxId + currentIndex).css('visibility', 'hidden');
                });
            }, 'proofPreviewImg_' + divBoxId + key
            );
        }
    } else {
        $("#" + divBoxId).html('');
        $("#" + divBoxId).css('min-height', '364px');
    }
}

/**
* This method returns all the colors to display in the print page 

 * @param  id 
 * @returns {void} 
 * */
print.prototype.getallColorsorPrint = function(id) {
    GlobalInstance.colorInstance = GlobalInstance.getColorInstance();
    //GlobalInstance.colorInstance.getColorList();
    //var colorList = JSON.parse(JSON.stringify(GlobalInstance.colorInstance.getColorList()));
    var colorList = GlobalInstance.colorInstance.arrColorListForIdentification;
    var customColorList = GlobalInstance.colorInstance.arrCustomColorListForIdentification;
    // var thisObject = this;
    var tempColorsListHtml = '';
    var count = 1;
    var hexCode = '';
    colorList.sort(function (a, b) {
        return a.TaaColorId - b.TaaColorId;
    });

    $.each(colorList, function (i, color) {
        {
            hexCode = encodeURIComponent(color.RgbHexadecimal);
            tempColorsListHtml += '<div class="colorIdentification" id="#' + id + '">';
            tempColorsListHtml += '<img src=' + LiquidPixels.getColorIdentificationImageUrl(hexCode) + '>'
            tempColorsListHtml += '<span class="colorLabel" id=colorname"' + color.Name + '">' + Utility.getTaaColorId(color.ColorId) + ' ' + color.Name + '</span>';
            tempColorsListHtml += '</div>';
            count++;
        }
    });

    $.each(customColorList, function (i, color) {
        {
            hexCode = encodeURIComponent(color.RgbHexadecimal);
            tempColorsListHtml += '<div class="colorIdentification" id="#' + id + '">';
            tempColorsListHtml += '<img src=' + LiquidPixels.getColorIdentificationImageUrl(hexCode) + '>'
            tempColorsListHtml += '<span class="colorLabel" id=colorname"' + color.Name + '">' + Utility.getTaaColorId(color.ColorId) + ' ' + color.Name + '</span>';
            tempColorsListHtml += '</div>';
            count++;
        }
    });
    $('#' + id).html(tempColorsListHtml);
}

/**
 *This method used to display popup and bind content 
 *  
 * @return void
 */
print.prototype.showPrintreview = function () {
    var thisObject = this;
    $.loadPage('dvprintBtn', null, true, false, function () {
        GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
        GlobalInstance.popupInstance.loading();
        $('#blanket').show();
        setTimeout(function () { // then show popup, deley in .5 second
            GlobalInstance.popupInstance.loadPopup('dvIdPrintpopup');
            // Handles the click event of print button placed in the top
            $(document).off('click', "#dvSendToPrinterTop");
            $(document).on('click', "#dvSendToPrinterTop", function () {
                if (thisObject.isPrintButtonEnabled == true) {
                    $("div.dvTop").scrollTop(0);
                    var printElementId = $(this).attr('printElementId');
                    GlobalInstance.printElementInstance = GlobalInstance.getPrintElementInstance();
                    GlobalInstance.printElementInstance.printElementById(printElementId);
                } else {
                    GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                    GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_SAVE_VALIDATION'), MESSAGES.get('MESSAGE_WAIT_MODEL_PREVIEW_LOADING'));
                    GlobalInstance.dialogBoxInstance.funcCallBack = null;
                }
            });
            //Handles the click event of print button in the bottom
            $(document).on('click', "#dvSendToPrinterBottom", function () {
                if (thisObject.isPrintButtonEnabled == true) {
                    $("div.dvTop").scrollTop(0);
                    var printElementId = $(this).attr('printElementId');
                    GlobalInstance.printElementInstance = GlobalInstance.getPrintElementInstance();
                    GlobalInstance.printElementInstance.printElementById(printElementId);
                } else {
                    GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
                    GlobalInstance.dialogBoxInstance.displayWarningMessageDialogBox(TITLE.get('TITLE_SAVE_VALIDATION'), MESSAGES.get('MESSAGE_WAIT_MODEL_PREVIEW_LOADING'));
                    GlobalInstance.dialogBoxInstance.funcCallBack = null;
                }
            });
            thisObject.getAllBirdEyePreviewUrlNumbers('idsecBoxPrint');
            var fabricObj = GlobalInstance.uniformConfigurationInstance.getFabricsInfo();
            var fabricName = fabricObj.Name;

            $('#fabricDescriptionPrint').html(fabricName);
            var bg_url = $('#dvIdFabricSelected').css('background-image');
            if (bg_url) {
                bg_url = bg_url.replace('url(', '').replace(')', '');
            }
            $('#spanFabric').hide();
            $('#dvIdSelectedFabricForPrint').html('<img class="selectedSampleFabric" style="margin-left:0px;" src=' + bg_url + '>');
            // var designName
            GlobalInstance.colorInstance = GlobalInstance.getColorInstance();
            var selectedColorInstance = GlobalInstance.getUniformConfigurationInstance().getColorsInfo();

            var primaryColorObject = GlobalInstance.colorInstance.getColorByKey("_" + selectedColorInstance.uniformPrimaryColor.ColorId);
            var primaryColorForPrint = primaryColorObject.Name;
            $('#primaryColorForPrint').html(primaryColorForPrint);
            $('#dvIdPrimaryColorForPrintIdentification').html(primaryColorForPrint);

            var secondaryColorObject = GlobalInstance.colorInstance.getColorByKey("_" + selectedColorInstance.uniformSecondaryColor.ColorId);
            var secondaryColorForPrint = secondaryColorObject.Name;
            $('#secondaryColorForPrint').html(secondaryColorForPrint);
            $('#dvIdSecondryColorForPrintIdentification').html(secondaryColorForPrint);

            var tertiaryColorObject = GlobalInstance.colorInstance.getColorByKey("_" + selectedColorInstance.uniformTertiaryColor.ColorId);
            var tirtiaryColorForPrint = tertiaryColorObject.Name;
            $('#tirtiaryColorForPrint').html(tirtiaryColorForPrint);
            $('#dvIdTirtiaryColorForPrintIdentification').html(tirtiaryColorForPrint);

            //Set the Color Image
            var primaryColor = encodeURIComponent(primaryColorObject.RgbHexadecimal);
            var secondaryColor = encodeURIComponent(secondaryColorObject.RgbHexadecimal);
            var tertiaryColor = encodeURIComponent(tertiaryColorObject.RgbHexadecimal);

            $('.circlePrimary').html('<img src=' + LiquidPixels.getProofColorIdentificationImageUrl(primaryColor) + '>');
            $('.circleSecondary').html('<img src=' + LiquidPixels.getProofColorIdentificationImageUrl(secondaryColor) + '>');
            $('.circleTirtiary').html('<img src=' + LiquidPixels.getProofColorIdentificationImageUrl(tertiaryColor) + '>');

            var selectedCutForPrint = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
            $('#tdSelectedCutForPrint').html(selectedCutForPrint.StyleName);
            var selectedDesignNameForPrint = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
            $('#selectedDesignNameForPrint').html(selectedDesignNameForPrint.DesignName);
            thisObject.getallColorsorPrint('dvIdPrintColorsIdenfication');
            GlobalInstance.roasterInstance = GlobalInstance.getRosterInstance();
            GlobalInstance.roasterInstance.addTeamRosterInfo('dvTeamRosterInfoOnPrint', false);
            GlobalInstance.roasterInstance.uniformEmblishmentsInfo('dvIdPrintEmblishMentInfo');

            $("#dvIdPrintClose").click(function () {
                GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
                GlobalInstance.popupInstance.disablePopup();
                $('#blanket').hide();// function close pop up
            });
        }, 500); // .5 second
    });
};



/**
 *This method used to display popup and bind content 
 *  
 * @return void
 */
print.prototype.showQuotepopup = function () {
    var thisObject = this;
    $.loadPage('dvQuotePanel', null, true, false, function () {
        GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
        GlobalInstance.popupInstance.loading();
        $('#blanket').show();
        setTimeout(function () { // then show popup, deley in .5 second
            GlobalInstance.popupInstance.loadPopup('dvIdQuotepopup');
            $('#dvIdQoutePage').scrollTop(0);
            // print functionality
            $(document).off('click', "#dvSendToPrinterTopQuote");
            $(document).on('click', "#dvSendToPrinterTopQuote", function () {
                $("#dvquoteTxtInputField").hide();
                $("#dvQuoteTextArea").hide();
                $("#dvquoteTxtInputFieldForPrint").show();
                $("#dvQuoteTextAreaForPrint").show();
                var printElementId = $(this).attr('printElementId');
                GlobalInstance.printElementInstance = GlobalInstance.getPrintElementInstance();
                GlobalInstance.printElementInstance.printElementById(printElementId);
            });

            var cutName = GlobalInstance.uniformConfigurationInstance.getStylesInfo();
            $('#idCutNameQuote').html(cutName.StyleName);

            $(document).off('click', "#dvSendToPrinterBottomQuote");
            $(document).on('click', "#dvSendToPrinterBottomQuote", function () {
                $("#dvquoteTxtInputField").hide();
                $("#dvQuoteTextArea").hide();
                $("#dvquoteTxtInputFieldForPrint").show();
                $("#dvQuoteTextAreaForPrint").show();
                var printElementId = $(this).attr('printElementId');
                GlobalInstance.printElementInstance = GlobalInstance.getPrintElementInstance();
                GlobalInstance.printElementInstance.printElementById(printElementId);
            });
            $(document).on('click', '#dvquoteTxtInputField', function () {
                $(this).addClass('active');
            });
            $(document).on('blur', '#dvquoteTxtInputField', function () {
                $(this).removeClass('active');
            });
            //handles the keyup event for the textbox area 
            $(document).on('keyup', '#dvquoteTxtInputField', function () {
                $('#dvquoteTxtInputFieldForPrint').html(($(this).val()));
            });
            $(document).on('click', '#dvQuoteTextArea', function () {
                $(this).addClass('active');
            });
            $(document).on('blur', '#dvQuoteTextArea', function () {
                $(this).removeClass('active');
            });
            //handles the keyup event for the textbox area 
            $(document).on('keyup', '#dvQuoteTextArea', function () {
                $('#dvQuoteTextAreaForPrint').html(($(this).val()));
            });
            var fabricName = $('.cartSelectedFabricLabel').html();
            $('#fabricDescriptionQuote').html(fabricName);
            var bg_url = $('#dvIdFabricSelected').css('background-image');
            if (bg_url) {
                bg_url = bg_url.replace('url(', '').replace(')', '');
            }
            $('#spanFabric').hide();
            $('#dvIdSelectedFabricForQuote').html('<img class="selectedSampleFabric" style="margin-left:0px;" src=' + bg_url + '>');
            GlobalInstance.colorInstance = GlobalInstance.getColorInstance();
            var selectedColorInstance = GlobalInstance.getUniformConfigurationInstance().getColorsInfo();
            var primaryColorObject = GlobalInstance.colorInstance.getColorByKey("_" + selectedColorInstance.uniformPrimaryColor.ColorId);
            var primaryColorForPrint = primaryColorObject.Name;
            $('#primaryColorForQuote').html(primaryColorForPrint);
            $('#dvIdPrimaryColorForQouteIdentification').html(primaryColorForPrint);

            var secondaryColorObject = GlobalInstance.colorInstance.getColorByKey("_" + selectedColorInstance.uniformSecondaryColor.ColorId);
            var secondaryColorForPrint = secondaryColorObject.Name;
            $('#secondaryColorForQuote').html(secondaryColorForPrint);
            $('#dvIdSecondryColorForQouteIdentification').html(secondaryColorForPrint);

            var tertiaryColorObject = GlobalInstance.colorInstance.getColorByKey("_" + selectedColorInstance.uniformTertiaryColor.ColorId);
            var tirtiaryColorForPrint = tertiaryColorObject.Name;
            $('#tirtiaryColorForQuote').html(tirtiaryColorForPrint);
            $('#dvIdTirtiaryColorForQouteIdentification').html(tirtiaryColorForPrint);


            //Set the Color Image
            var primaryColor = encodeURIComponent(primaryColorObject.RgbHexadecimal);
            var secondaryColor = encodeURIComponent(secondaryColorObject.RgbHexadecimal);
            var tertiaryColor = encodeURIComponent(tertiaryColorObject.RgbHexadecimal);

            $('.circlePrimary').html('<img src=' + LiquidPixels.getProofColorIdentificationImageUrl(primaryColor) + '>');
            $('.circleSecondary').html('<img src=' + LiquidPixels.getProofColorIdentificationImageUrl(secondaryColor) + '>');
            $('.circleTirtiary').html('<img src=' + LiquidPixels.getProofColorIdentificationImageUrl(tertiaryColor) + '>');

            var selectedDesignNameForPrint = GlobalInstance.uniformConfigurationInstance.getDesignsInfo();
            $('#selectedDesignNameForQuote').html(selectedDesignNameForPrint.DesignName);

            thisObject.getallColorsorPrint('dvIdQuoteColorsIdenfication');
            GlobalInstance.roasterInstance = GlobalInstance.getRosterInstance();
            GlobalInstance.roasterInstance.addTeamRosterInfo('dvTeamRosterInfoOnQuote', true);
            GlobalInstance.roasterInstance.uniformEmblishmentsInfo('dvIdQouteEmblishMentInfo');
            thisObject.getAllBirdEyePreviewUrlNumbers('idsecBoxQuote');
            $("#dvIdQuoteClose").click(function () {
                GlobalInstance.popupInstance = GlobalInstance.getPopupInstance();
                GlobalInstance.popupInstance.disablePopup();
                $('#blanket').hide();// function close pop up
            });

            $('#checkBoxMSRP1').attr("checked", true);
            $('#checkBoxMSRP2').attr("checked", true);
            $('#checkBoxMSRP1 , #checkBoxMSRP2').off('change');
            $('#checkBoxMSRP1 , #checkBoxMSRP2').on('change', function () {
                var isChecked = $(this).is(':checked');
                $('#checkBoxMSRP1').attr("checked", isChecked);
                $('#checkBoxMSRP2').attr("checked", isChecked);

                if (isChecked) {
                    //show prices
                    $.each($(".msrp"), function () {
                        $(this).html('$' + $(this).attr('data'));
                    });
                    $('#spanQuoteTotal').css('visibility', 'visible');
                } else {
                    //hide prices
                    $.each($(".msrp"), function () {
                        $(this).html(''); //set blank text
                    });
                    $('#spanQuoteTotal').css('visibility', 'hidden');
                }
            });

        }, 500); // .5 second
    });
};