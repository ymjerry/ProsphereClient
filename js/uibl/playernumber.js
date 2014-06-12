/**
 * 
 TWA proshpere configurator
 * 
 * playernumber.js is used to define changes related playernumber screen . 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/*
 * Constructor for PlayerNumber class.
 */
function PlayerNumber() {
    this.bindPlayerNumberScreenEvents();
    this.htmlSlashImg = '<div class="slashImage"> </div>';
    this.posLeftPlayerNumberColorBox = 0;
    this.posTopPlayerNumberColorBox = 0;
    this.uniformEmblishmentInfo = null;
    this.currentSelectedPlayerNumberAnchor = null;
    var text = GlobalInstance.getUniformConfigurationInstance().getPlayerNumberInfo('text') || '';
    if ((Utility.getObjectlength(GlobalInstance.getUniformConfigurationInstance().getPlayerNumberInfo('fontColor')) > 0) && (text !== '')) {
        this.defaultPlayerNumberFontColorSelected = false;
    }
    else {
        this.defaultPlayerNumberFontColorSelected = true;
    }
    this.defaultFont = null;
    this.fontStrokeColor1 = 'ffffff';
    this.fontStrokeColor2 = '666666';
    this.fontBaseImgWidth = "60";
    this.fontBaseImgHeight = "40";
    this.fontColor = '000000';
}

/*
 * This method initialize the Fonts and colors in this screen
 * @returns void
 */
PlayerNumber.prototype.init = function() {
    //Bind Font List
    GlobalInstance.fontInstance = GlobalInstance.getFontInstance();
    GlobalInstance.fontInstance.addCallback(this.setHtmlAndBindFontListForPlayerNumber.bind(this));
    GlobalInstance.colorInstance = GlobalInstance.getColorInstance(null,null,null);
    //GlobalInstance.colorInstance.addCallback(this.setHtmlAndBindColor.bind(this));
    
    
    this.setHtmlAndBindColor(GlobalInstance.colorInstance.getColorList());
    Utility.imitatePlaceHolderForIE();
};

/*
 * This method shows PlayerNumber Screen and hide others.
 * @return void
 */
PlayerNumber.prototype.show = function() {
    $("#secNumberAndTextHome").hide();
    $("#secPlayerName").hide();
    $("#secTeamName").hide();
    $("#secOtherText").hide();
    $("#secPlayerNumber").show();
    this.getCurrentSelectedAnchorPointtObject();
    this.selectFontColor(this.getSelectedFontColor(null));
    this.selectFontOutline1Color(this.getSelectedFontOutline1Color(null));
    this.selectFontOutline2Color(this.getSelectedFontOutline2Color(null));
    this.selectFont(this.getSelectedFont(this.defaultFont), this.getDefaultFontUrl());
    previewPlayerNumber();

};

/*
 * This method hides the PlayerNumber field.
 * @return void
 */
PlayerNumber.prototype.hide = function() {
    $("#secPlayerNumber").hide();
};

/*
 * This function binds the screen events.
 * @return void
 */
PlayerNumber.prototype.bindPlayerNumberScreenEvents = function () {
    var thisObject = this;
    $('#btnOtherTextPlayerNumber,#btnPlayerNamePlayerNumber ,#btnTeamNamePlayerNumber ').off('click');

    $(document).on('click', "#btnPlayerNamePlayerNumber", function() {
        GlobalInstance.getPlayerNumberInstance().hide();
        GlobalInstance.getTeamNameInstance().hide();
        GlobalInstance.getOtherTextInstance().hide();
        GlobalInstance.getPlayerNameInstance().show();
    });
    $(document).on('click', "#btnTeamNamePlayerNumber", function() {
        GlobalInstance.getPlayerNumberInstance().hide();
        GlobalInstance.getPlayerNameInstance().hide();
        GlobalInstance.getOtherTextInstance().hide();
        GlobalInstance.getTeamNameInstance().show();
    });
    $(document).on('click', "#btnOtherTextPlayerNumber", function() {
        GlobalInstance.getPlayerNumberInstance().hide();
        GlobalInstance.getPlayerNameInstance().hide();
        GlobalInstance.getTeamNameInstance().hide();
        GlobalInstance.getOtherTextInstance().show();
    });

    this.setDefaultText();
    $('#inputExamplePlayerNumber').bind('keypress', function(event) {
        var sText = $(this).val();
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        
        if (sText.length > 1 && (regex.test(key)) && $(this)[0].selectionStart == $(this)[0].selectionEnd) {
            event.preventDefault();
            return false;
        }
    });
    $("#inputExamplePlayerNumber").keyup(function() {
        //preview Image based on the values selected in Font and Colors or the global variables

        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('text', $('#inputExamplePlayerNumber').val());
        GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('text');
        previewPlayerNumber();
    });

    //Font Combo Box Event Binding 
    $(document).on('click', '#dvIdComboFontPlayerNumber', function() {
        if ($('#dvIdComboDropdownPlayerNumber').is(':visible')) {
            $('#dvIdComboDropdownPlayerNumber').hide();
        } else {
            $('#dvIdComboDropdownPlayerNumber').show();
            thisObject.selectFontInCombo();
        }
    });
    $(document).on('click', '#dvIdComboDropdownPlayerNumber div img , #dvIdComboDropdownPlayerNumber div', function() {
        var fontObject = new Object();
        this.uniformEmblishmentInfo = $(this).first().attr('displayname');
        fontObject.src =$(this).first().children().attr('src');
        if (!$(this).first().attr('displayname')) {
            fontObject.displayname = $(this).parent().attr('displayname');
        }
         if(!fontObject.src){
             fontObject.src  =$(this).attr('src');
         }
        if (!$(this).first().attr('value')) {
            fontObject.IPSID = $(this).parent().attr('value');
        }
        if (!$(this).first().attr('fontid')) {
            fontObject.fontId = $(this).parent().attr('fontid');
        }
        if (!$(this).first().attr('fileloc')) {
            fontObject.fileloc = $(this).parent().attr('fileloc');
        }

        $(this).first().attr({
            'displayname': $(this).first().attr('displayname') || fontObject.displayname,
            'IPSID': $(this).first().attr('value') || fontObject.IPSID
        });


        $('.comboDropdownFontListText').removeClass('active');
        $(this).addClass('active');
        var fontId = $(this).first().attr('fontid') || fontObject.fontId;
        //GlobalInstance.getUniformConfigurationInstance().setPlayerNumberInfo('font', GlobalInstance.fontInstance.getFontByKey(fontId));

        GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('font', {
            'name': $(this).first().attr('displayname') || fontObject.displayname,
            'displayname': $(this).first().attr('displayname') || fontObject.displayname,
            'IPSID': $(this).first().attr('value') || fontObject.IPSID,
            'fontid': $(this).first().attr('fontid') || fontObject.fontId,
            'fileloc': $(this).first().attr('fileloc') || fontObject.fileloc
        });
        GlobalInstance.fontSelectionInstance = GlobalInstance.getFontSelectionInstance();
        GlobalInstance.fontSelectionInstance.setModifiedFont(GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('font'));
        /*
        var sFontName =  $(this).first().attr('fileloc') || fontObject.fileloc
        sFontName = sFontName.substring(sFontName.indexOf('/') + 1);
        var fontId = $(this).first().attr('fontid');
        var sText = $(this).first().attr('displayname') || fontObject.displayname;
        var fileLoc = $(this).first().attr('fileloc') || fontObject.fileloc;
        
       
       var newURLLP = LiquidPixels.generateTextEffectPreviewURL(
                null,
                null,
                sText,
                sFontName,
                fontId,
                thisObject.fontColor,
                thisObject.fontStrokeColor1,
                thisObject.fontStrokeColor2,
                thisObject.fontBaseImgWidth,
                thisObject.fontBaseImgHeight
        );*/
        
        $('#dvIdComboFontPlayerNumber').html("<img src='" + fontObject.src + "' />");
        $('#dvIdComboFontPlayerNumber').attr('fileloc', $(this).first().attr('fileloc'));
        $('#dvIdComboDropdownPlayerNumber').hide();
        //Preview text logic
        previewPlayerNumber();
    });
};

/**
 * This method binds the font list to the Font Combo in Player Number screen
 * @param  fontList List of fonts
 * @returns void
 */
PlayerNumber.prototype.setHtmlAndBindFontListForPlayerNumber = function (fontList) {
    var thisObject = this;
    
    var tempFontHtml = '';
    this.defaultFont = null;
    var defaultUrl = ''
    var count = 0;
    
    var textdecalObj = null;

    $.each(fontList, function(i, font) {
        var decalList = GlobalInstance.getTextEffectInstance().getDecalList();
        textdecalObj = decalList["_" + font.FontId];
        var sText = textdecalObj.Name;
        var sFontName = font.FileLocation;
        sFontName = font.FileLocation.substring(font.FileLocation.indexOf('/') + 1);
        
        var newURLLP = LiquidPixels.generateTextEffectPreviewURL(
                null,
                null,
                sText,
                sFontName,
                font.FontId,
                thisObject.fontColor,
                thisObject.fontStrokeColor1,
                thisObject.fontStrokeColor2,
                thisObject.fontBaseImgWidth,
                thisObject.fontBaseImgHeight
        );
        if (thisObject.defaultFont == null) {
            thisObject.defaultFont = {
                'displayname': font.Name || font.displayname,
                'fileloc': font.FileLocation || font.fileloc,
                'fontid': font.FontId || font.fontid
            };
        }
       // var newURLLP = LiquidPixels.previewNumberText(oColor1.rgbHexadecimal, font.Name, 15, font.Name, font.FileLocation);
        if (count == 0) {
            defaultUrl = newURLLP;
            //    defaultUrl = LiquidPixels.previewNumberText(oColor1.rgbHexadecimal, font.Name, 13, font.Name, font.FileLocation);
        }
        count++;
        tempFontHtml += '<div style="vertical-align:middle; height: auto; max-width: 100%; text-align:center" id="dvPlayerNumberFontList_' + font.FontId + '" class="comboDropdownFontListText" value="' + font.Name + '" fileloc="' + font.FileLocation + '" displayname="' + font.Name + '" fontid="' + font.FontId + '">  <img src="' + newURLLP + '"/></div>';
    });
    $('#dvIdComboDropdownPlayerNumber').html(tempFontHtml);
    this.selectFont(this.getSelectedFont(this.defaultFont), defaultUrl);
};

/*
 * Array to Control the Windows which remains open even after clicking outside
 * that control
 */
var arrayNumberAndTextToClose = new Array(
        "dvIdSelectedFillColorPlayerNumber , dvIdFillColorPlayerNumber , dvIdColorBoxPlayerNumber , ulColorComboBoxlistPlayerNumberFillColor ,whatThisLink",
        "dvIdSelectedFillColorPlayerNumberOutlineFirst , dvIdPlayerNumberOutlineFirst , dvIdColorBoxPlayerNumberOutlineFirst , ulColorComboBoxlistPlayerNumberOutlineFirst , whatThisLink",
        "dvIdSelectedFillColorPlayerNumberOutlineSecond , dvIdPlayerNumberOutlineSecond , dvIdColorBoxPlayerNumberOutlineSecond , ulColorComboBoxlistPlayerNumberOutlineSecond , whatThisLink",
        "dvIdSelectedFillColorTeamName , dvIdFillColorTeamName , dvIdColorBoxTeamName , ulColorComboBoxlistTeamNameFillColor , whatThisLink",
        "dvIdSelectedFillColorTeamNameOutlineFirst , dvIdTeamNameOutlineFirst , dvIdColorBoxTeamNameOutlineFirst , ulColorComboBoxlistTeamNameOutlineFirst , whatThisLink",
        "dvIdSelectedFillColorTeamNameOutlineSecond , dvIdTeamNameOutlineSecond , dvIdColorBoxTeamNameOutlineSecond , ulColorComboBoxlistTeamNameOutlineSecond , whatThisLink",
        "dvIdSelectedFillColorPlayerName , dvIdFillColorPlayerName ,dvIdColorBoxPlayerName , ulColorComboBoxlistPlayerNameFillColor , whatThisLink",
        "dvIdSelectedFillColorPlayerNameOutlineFirst , dvIdPlayerNameOutlineFirst , dvIdColorBoxPlayerNameOutlineFirst , ulColorComboBoxlistPlayerNameOutlineFirst , whatThisLink",
        "dvIdSelectedFillColorPlayerNameOutlineSecond , dvIdPlayerNameOutlineSecond , dvIdColorBoxPlayerNameOutlineSecond , ulColorComboBoxlistPlayerNameOutlineSecond , whatThisLink",
        "dvIdSelectedFillColorOtherText , dvIdFillColorOtherText , dvIdColorBoxOtherText , ulColorComboBoxlistOtherTextFillColor , whatThisLink",
        "dvIdSelectedFillColorOtherTextOutlineFirst , dvIdOtherTextOutlineFirst , dvIdColorBoxOtherTextOutlineFirst , ulColorComboBoxlistOtherTextOutlineFirst , whatThisLink",
        "dvIdSelectedFillColorOtherTextOutlineSecond , dvIdOtherTextOutlineSecond , dvIdColorBoxOtherTextOutlineSecond , ulColorComboBoxlistOtherTextOutlineSecond , whatThisLink",
        "dvIdComboFontPlayerNumber",
        "dvIdComboFontTeamName",
        "dvIdComboFontPlayerName",
        "dvIdComboBoxTextEffectPlayerName",
        "dvIdComboBoxTextEffectTeamName",
        "dvIdComboBoxTextEffectOtherText",
        "dvIdComboFontOtherText",
        "dvIdSelectedPrimaryColorCustomizeGraphic , dvIdPrimaryColorCustomizeGraphic ,dvIdColorBoxCustomizeGraphicPrimary , ulColorComboBoxlistCustomizeGraphicPrimary ,whatThisLink",
        "dvIdSelectedSecondaryColorCustomizeGraphic , dvIdSecondaryColorCustomizeGraphic , dvIdColorBoxCustomizeGraphicSecondary , ulColorComboBoxlistCustomizeGraphicSecondary , whatThisLink",
        "dvIdSelectedAccentColorCustomizeGraphic , dvIdAccentColorCustomizeGraphic , dvIdColorBoxCustomizeGraphicAccent , ulColorComboBoxlistCustomizeGraphicAccent , whatThisLink",
        "dvIdFillColorAnchorPoint, dvIdSelectedFillColorAnchorPoint , dvIdColorBoxAnchorPoint , ulColorComboBoxlistAnchorPointFillColor , whatThisLink",
        "dvIdSelectedFillColorAnchorPointOutlineFirst , dvIdAnchorPointOutlineFirst , dvIdColorBoxAnchorPointOutlineFirst , ulColorComboBoxlistAnchorPointOutlineFirst , whatThisLink",
        "dvIdSelectedFillColorAnchorPointOutlineSecond , dvIdAnchorPointOutlineSecond , dvIdColorBoxAnchorPointOutlineSecond , ulColorComboBoxlistAnchorPointOutlineSecond , whatThisLink",
        "anchorSizeBox , dvIdAnchorPointSelectedSize"
        );
var arrayDivColorWindow = new Array(
        "#dvIdColorBoxPlayerNumber",
        "#dvIdColorBoxPlayerNumberOutlineFirst",
        "#dvIdColorBoxPlayerNumberOutlineSecond",
        "#dvIdColorBoxTeamName",
        "#dvIdColorBoxTeamNameOutlineFirst",
        "#dvIdColorBoxTeamNameOutlineSecond",
        "#dvIdColorBoxPlayerName",
        "#dvIdColorBoxPlayerNameOutlineFirst",
        "#dvIdColorBoxPlayerNameOutlineSecond",
        "#dvIdColorBoxOtherText",
        "#dvIdColorBoxOtherTextOutlineFirst",
        "#dvIdColorBoxOtherTextOutlineSecond",
        "#dvIdComboDropdownPlayerNumber",
        "#dvIdComboDropdownTeamName",
        "#dvIdComboDropdownPlayerName",
        "#dvIdComboBoxTextEffectPlayerNameList",
        "#dvIdComboBoxTextEffectTeamNameList",
        "#dvIdComboBoxTextEffectOtherTextList",
        "#dvIdComboDropdownOtherText",
        "#dvIdColorBoxCustomizeGraphicPrimary",
        "#dvIdColorBoxCustomizeGraphicSecondary",
        "#dvIdColorBoxCustomizeGraphicAccent",
        "#dvIdColorBoxAnchorPoint",
        "#dvIdColorBoxAnchorPointOutlineFirst",
        "#dvIdColorBoxAnchorPointOutlineSecond",
        "#dvIdAnchorSizeComboDropdown"
        );

//Function used to close all the toolbars if clicked outside the panel
$(document).off('click', '*');
$(document).on('click', '*', function(event) {
    try {
        //Color and Font Windows
        for (var i = 0; i < arrayNumberAndTextToClose.length; i++)
        {
            var parentNodeValue = "";
            if (event.target && event.target.parentNode && event.target.parentNode.attributes && event.target.parentNode.attributes.parentId) {
                parentNodeValue = event.target.parentNode.attributes.parentId.value;
            }

            var parentId = null;
            if (event.target.parentNode) {
                parentId = event.target.parentNode.id || parentNodeValue;
            }

            if (event.target.id) {
                if (arrayNumberAndTextToClose[i].indexOf(event.target.id) < 0)
                {
                    if ($(arrayDivColorWindow[i]).is(':visible')) {
                        $(arrayDivColorWindow[i]).hide();
                        return false;
                    }
                }
            } else if (arrayNumberAndTextToClose[i].indexOf(parentId) < 0 && parentId != null) {
                if ($(arrayDivColorWindow[i]).is(':visible') && parentId != arrayDivColorWindow[i]) {
                    $(arrayDivColorWindow[i]).hide();
                    return false;
                }
            } else if (!event.target.id && !parentId) {
                if ($(arrayDivColorWindow[i]).is(':visible')) {
                    $(arrayDivColorWindow[i]).hide();
                    return false;
                }
            }
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description pnum 394: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
});

/**
 * This method binds the color list to the Fill Color Combo.
 * @param  colorList 
 * @returns void
 */
PlayerNumber.prototype.setHtmlAndBindColor = function(colorList) {
    var tempColorsListHtml = '';
    var tempCustomColorsListHtml = '';
    var tempColorsListUnselectHtml = '';
    var thisObject = this;
    tempColorsListUnselectHtml += '<li  id= "colorid_0"  style="cursor:pointer; background-image:url(\'images/slash.png\');">\n\
<a  ColorId="0" \n\
rgbHexadecimal="" alt="Optional" class="colorItems in-active" background-image:url(\'../images/slash.png\');\n\
style="background-color:"></a></li>';
    var defaultFontColor = null;
    $.each(colorList, function (i, color) {
        if (color.CustomerId != null && color.CustomerId != '' && color.CustomerId != undefined) {
            tempCustomColorsListHtml += '<li  TaaColorId="' + color.TaaColorId + '" id="colorid_' + color.ColorId + '" colorid="' + color.ColorId + '" style="margin-bottom:0px;background-color:' + color.RgbHexadecimal + '" class="colorItems in-active" alt="' + color.Name + '"  title="' + color.Name + '"><a ColorId=' + color.ColorId + ' \n\
                            alt="' + color.Name + '" \n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        } else {
            tempColorsListHtml += '<li  TaaColorId="' + color.TaaColorId + '" id="colorid_' + color.ColorId + '" colorid="' + color.ColorId + '" style="cursor:pointer;margin-bottom:0px; background-color:' + color.RgbHexadecimal + '" class="colorItems in-active" alt="' + color.Name + '"  title="' + color.Name + '"><a ColorId=' + color.ColorId + ' \n\
                            alt="' + color.Name + '" \n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        }
        if (defaultFontColor == null) {
            defaultFontColor = color;
        }

    });
    $('#ulColorComboBoxlistPlayerNumberFillColor').html(tempColorsListHtml);
    $('#ulColorComboBoxlistPlayerNumberOutlineFirst').html(tempColorsListUnselectHtml + tempColorsListHtml);
    $('#ulColorComboBoxlistPlayerNumberOutlineSecond').html(tempColorsListUnselectHtml + tempColorsListHtml);

    //Custom Color Case
    var customerId = GlobalInstance.uniformConfigurationInstance.getAccountNumber();
    if (customerId !== 0 && customerId !== undefined) {
        $('#ulIdPlayerNumberPrimaryCustomColor').html(tempCustomColorsListHtml);
        $('#ulIdPlayerNumberOutlineFirstCustomColor').html(tempCustomColorsListHtml);
        $('#ulIdPlayerNumberOutlineSecondCustomColor').html(tempCustomColorsListHtml);
    }

    this.selectFontColor(this.getSelectedFontColor(defaultFontColor));
    this.selectFontOutline1Color(this.getSelectedFontOutline1Color(null));
    this.selectFontOutline2Color(this.getSelectedFontOutline2Color(null));
    $("#dvIdColorBoxPlayerNumber").draggable({});

    //Color Combo Box Event Binding for Font Color
    $('#dvIdColorBoxPlayerNumber').draggable({
        containment: '#dvConfiguratorPanel'
    });
    $(document).off('click', '#dvIdFillColorPlayerNumber');
    $(document).on('click', '#dvIdFillColorPlayerNumber', function() {
        $("#dvIdColorBoxPlayerNumber").css({left: '', top: ''});
        $("#dvIdColorBoxPlayerNumberOutlineFirst").hide();
        $("#dvIdColorBoxPlayerNumberOutlineSecond").hide();
        if ($('#dvIdColorBoxPlayerNumber').is(':visible')) {
            $('#dvIdColorBoxPlayerNumber').hide();
        } else {
            thisObject.setDefaultUniformColor();
            setTimeout(function() {
                $('#dvIdColorBoxPlayerNumber').show();
            }, 10);
        }
        return false;
    });

    $(document).off('click', '#dvIdColorBoxPlayerNumber > .numberandTextColorBoxScrolling ul li ,#dvIdPlayerNumberPrimaryCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxPlayerNumber > .numberandTextColorBoxScrolling ul li ,#dvIdPlayerNumberPrimaryCustomColor ul li', function () {
        var clickedLi = $(this).children();
        $('#dvIdColorBoxPlayerNumber ul li').attr({
            'class': 'in-active'
        });

        $('#dvIdPlayerNumberPrimaryCustomColor ul li').attr({
            'class': 'in-active'
        });

        $(this).attr({
            'class': 'active'
        });
        if (clickedLi.first().attr('colorid') != 0) {
            $('#dvIdSelectedFillColorPlayerNumber').attr({
                'title': clickedLi.first().attr('alt'),
                'alt': clickedLi.first().attr('alt'),
                'style': clickedLi.first().attr('style')
            });
            $('#dvIdColorNamePlayerNumberFont').html(clickedLi.first().attr('alt'));
            $('#dvIdColorBoxPlayerNumber').hide();
            var selectedColorObject = GlobalInstance.colorInstance.getColorByKey('_' + clickedLi.first().attr('colorid'));
            GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
            GlobalInstance.colorRetainInstance.setModifiedColors(true, false, false, selectedColorObject);// Update the primary color in the application that has primary color support
            thisObject.defaultPlayerNumberFontColorSelected = false;
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontColor',
                    GlobalInstance.colorInstance.getColorByKey('_' + clickedLi.first().attr('colorid'))
                    );
            previewPlayerNumber();
        }
    });


    //First Outline Color Combo Box Binding
    $('#dvIdColorBoxPlayerNumberOutlineFirst').draggable({
        containment: '#dvConfiguratorPanel'
    });
    $(document).off('click', '#dvIdPlayerNumberOutlineFirst');
    $(document).on('click', '#dvIdPlayerNumberOutlineFirst', function() {
        $("#dvIdColorBoxPlayerNumberOutlineFirst").css({left: '', top: ''});
        $('#dvIdColorBoxPlayerNumber').hide();
        $('#dvIdColorBoxPlayerNumberOutlineSecond').hide();
        if ($('#dvIdColorBoxPlayerNumberOutlineFirst').is(':visible')) {
            $('#dvIdColorBoxPlayerNumberOutlineFirst').hide();
        } else {
            thisObject.setDefaultUniformColor();
            setTimeout(function() {
                $('#dvIdColorBoxPlayerNumberOutlineFirst').show();
            }, 10);
        }
        return false;
    });
    var thisObject = this;
    $(document).off('click', '#dvIdColorBoxPlayerNumberOutlineFirst > .numberandTextColorBoxScrolling ul li ,#dvIdPlayerNumberOutlineFirstCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxPlayerNumberOutlineFirst > .numberandTextColorBoxScrolling ul li ,#dvIdPlayerNumberOutlineFirstCustomColor ul li', function (e) {
        
        if(e.target.id == "colorid_0"){
            $("#dvIdSelectedFillColorPlayerNumberOutlineFirst").addClass("slashImage color_box_selected");
        }
        $("#dvIdColorBoxPlayerNumberOutlineFirst").css({left: '', top: ''});
        var clickedLi = $(this).children();
        $('#dvIdColorBoxPlayerNumberOutlineFirst ul li').attr({
            'class': 'in-active'
        });

        $('#dvIdPlayerNumberOutlineFirstCustomColor ul li').attr({
            'class': 'in-active'
        });

        $(this).attr({
            'class': 'active'
        });
        if (clickedLi.first().attr('colorid') != 0) {
            $("#dvIdSelectedFillColorPlayerNumberOutlineFirst").removeClass("slashImage");
            $('#dvIdColorNamePlayerNumberOutlineFirst').removeClass("slashImage")
        }
        $('#dvIdSelectedFillColorPlayerNumberOutlineFirst').attr({
            'title': clickedLi.first().attr('alt'),
            'alt': clickedLi.first().attr('alt'),
            'style': clickedLi.first().attr('style')
        });
        if (clickedLi.first().attr('colorid') === "0") {
            $('#dvIdColorNamePlayerNumberOutlineFirst').css('color', '#C3C3C3');
        } else {
            $('#dvIdColorNamePlayerNumberOutlineFirst').css('color', '#000');
        }
        $('#dvIdColorNamePlayerNumberOutlineFirst').html(clickedLi.first().attr('alt'));

        $('#dvIdColorBoxPlayerNumberOutlineFirst').hide();
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var selectedColorObject = GlobalInstance.colorInstance.getColorByKey('_' + clickedLi.first().attr('colorid'));
        if (!selectedColorObject) {
            selectedColorObject = null;
        }
        GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
        GlobalInstance.colorRetainInstance.setModifiedColors(false,true,false,selectedColorObject);// Update the secondary color in the application that has secondary color support
        GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontOutline1Color', selectedColorObject);
        previewPlayerNumber();
        return false;
    });


    //Second Outline Color Combo Box Binding
    $('#dvIdColorBoxPlayerNumberOutlineSecond').draggable({
        containment: '#dvConfiguratorPanel'
    });
    $(document).off('click', '#dvIdPlayerNumberOutlineSecond');
    $(document).on('click', '#dvIdPlayerNumberOutlineSecond', function() {
        $("#dvIdColorBoxPlayerNumberOutlineSecond").css({left: '', top: ''});
        $('#dvIdColorBoxPlayerNumber').hide();
        $('#dvIdColorBoxPlayerNumberOutlineFirst').hide();

        if ($('#dvIdColorBoxPlayerNumberOutlineSecond').is(':visible')) {
            $('#dvIdColorBoxPlayerNumberOutlineSecond').hide();
        } else {
            thisObject.setDefaultUniformColor();
            setTimeout(function() {
                $('#dvIdColorBoxPlayerNumberOutlineSecond').show();
            }, 10);
        }
        return false;
    });
    $(document).off('click', '#dvIdColorBoxPlayerNumberOutlineSecond > .numberandTextColorBoxScrolling ul li ,#dvIdPlayerNumberOutlineSecondCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxPlayerNumberOutlineSecond > .numberandTextColorBoxScrolling ul li ,#dvIdPlayerNumberOutlineSecondCustomColor ul li', function (e) {
        //alert("456")
        if(e.target.id == "colorid_0"){
            $("#dvIdSelectedFillColorPlayerNumberOutlineSecond").addClass("slashImage color_box_selected");
        }
        
        $("#dvIdColorBoxPlayerNumberOutlineSecond").css({left: '', top: ''});
        var clickedLi = $(this).children();
        $('#dvIdColorBoxPlayerNumberOutlineSecond ul li').attr({
            'class': 'in-active'
        });

        $('#dvIdPlayerNumberOutlineSecondCustomColor ul li').attr({
            'class': 'in-active'
        });


        $(this).attr({
            'class': 'active'
        });
        if (clickedLi.first().attr('colorid') != 0) {
            $("#dvIdSelectedFillColorPlayerNumberOutlineSecond").removeClass("slashImage");
            $('#dvIdColorNamePlayerNumberOutlineSecond').removeClass("slashImage");
        }
        $('#dvIdColorBoxPlayerNumberOutlineSecond').hide();
        $('#dvIdSelectedFillColorPlayerNumberOutlineSecond').attr({
            'title': clickedLi.first().attr('alt'),
            'alt': clickedLi.first().attr('alt'),
            'style': clickedLi.first().attr('style')
        });
        if (clickedLi.first().attr('colorid') === "0") {
            $('#dvIdColorNamePlayerNumberOutlineSecond').css('color', '#C3C3C3');
        } else {
            $('#dvIdColorNamePlayerNumberOutlineSecond').css('color', '#000');
        }
        $('#dvIdColorNamePlayerNumberOutlineSecond').html(clickedLi.first().attr('alt'));

        selectedColorOutlineSecond = GlobalInstance.colorInstance.getColorByKey('_' + clickedLi.first().attr('colorid'));
        GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
        GlobalInstance.colorRetainInstance.setModifiedColors(false, false, true, selectedColorOutlineSecond);// Update the accent color in the application that has accent color support
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        if (!selectedColorOutlineSecond) {
            selectedColorOutlineSecond = null;
        }
        GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontOutline2Color', selectedColorOutlineSecond);
        previewPlayerNumber();
        return false;
        });
    this.bindSelectedUniformColors();
    previewPlayerNumber();
};


/**
 * Performs a binding colors to Primary Secondary and Tertiary controls .  
 * Updates Preview on Player Number String
 * @return void
 */
PlayerNumber.prototype.bindSelectedUniformColors = function() {

    var colors = GlobalInstance.uniformConfigurationInstance.getColorsInfo();
    if (colors.uniformPrimaryColor) {
        $('.uniformColorBoxPrimary').css({"background": colors.uniformPrimaryColor.RgbHexadecimal, 'cursor': 'pointer'});
        $('.uniformColorBoxPrimary').attr('title', colors.uniformPrimaryColor.Name);
        $('.uniformColorBoxPrimary').attr('alt', colors.uniformPrimaryColor.Name);
    } else {
        $('.uniformColorBoxPrimary').css('cursor', 'pointer');
        $('.uniformColorBoxPrimary').attr('title', TITLE.get('TITLE_UNIFORM_COLOR_CHOOSE'));
        $('.uniformColorBoxPrimary').attr('alt', TITLE.get('TITLE_UNIFORM_COLOR_CHOOSE'));
    }
    if (colors.uniformSecondaryColor) {
        $('.uniformColorBoxSecondary').css({"cursor": 'pointer', "background": colors.uniformSecondaryColor.RgbHexadecimal});
        $('.uniformColorBoxSecondary').attr('title', colors.uniformSecondaryColor.Name);
        $('.uniformColorBoxSecondary').attr('alt', colors.uniformSecondaryColor.Name);
    } else {
        $('.uniformColorBoxSecondary').attr('title', TITLE.get('TITLE_UNIFORM_COLOR_CHOOSE'));
        $('.uniformColorBoxSecondary').attr('alt', TITLE.get('TITLE_UNIFORM_COLOR_CHOOSE'));
        $('.uniformColorBoxSecondary').css('cursor', 'pointer');
    }
    if (colors.uniformTertiaryColor) {
        $('.uniformColorBoxTertiary').css({"cursor": 'pointer', "background": colors.uniformTertiaryColor.RgbHexadecimal});
        $('.uniformColorBoxTertiary').attr('title', colors.uniformTertiaryColor.Name);
        $('.uniformColorBoxTertiary').attr('alt', colors.uniformTertiaryColor.Name);
    } else {
        $('.uniformColorBoxTertiary').attr('title', TITLE.get('TITLE_UNIFORM_COLOR_CHOOSE'));
        $('.uniformColorBoxTertiary').attr('alt', TITLE.get('TITLE_UNIFORM_COLOR_CHOOSE'));
        $('.uniformColorBoxTertiary').css('cursor', 'pointer');
    }
}
/**
 * Performs a fetching Preview Text.  
 * Updates Preview on Player Number String
 * @return void
 */
previewPlayerNumber = function() {
    try {
        var fontObj = getFontObjPlayerNumber();
        var sFontName = '';
        if (fontObj.fileloc) {
            sFontName = fontObj.fileloc.substring(fontObj.fileloc.indexOf('/') + 1);
        }
        var sText = getTextPlayerNumber() || "";
        var sFont = getFontPlayerNumber();
        var oColor1 = getColorPlayerNumber();
        var oColor2 = getOutline1ColorPlayerNumber();
        var oColor3 = getOutline2ColorPlayerNumber();

        if (!oColor1) {
            oColor1 = GlobalInstance.colorInstance.getColorByKey('_' + $('#dvIdColorBoxPlayerNumber ul>:first-child').first().attr('colorid'))
        }
        ;
        var primaryColorHexCode = (oColor1.rgbHexadecimal) ? oColor1.rgbHexadecimal : oColor1.RgbHexadecimal;
        if(!primaryColorHexCode){
            primaryColorHexCode =oColor1.background.substring(oColor1.background.indexOf(':')+1);
        }
        if (sFont != "" && oColor1 != undefined && (primaryColorHexCode) != undefined) {
            if (sText != "") {
                var baseColor = "None";
                var colorOutline1 = "None";
                var colorOutline2 = "None";
                var iHeight = 120;
                var sBaseImgWidth = "360";
                var sBaseImgHeight = "100";

                if (oColor1 != undefined) {
                    baseColor = primaryColorHexCode.substring(primaryColorHexCode.indexOf('#') + 1);
                }
                if (oColor2 && oColor2 != null && (oColor2.ColorId || oColor2.colorid)) {
                    var secondaryHexCode = (oColor2.rgbHexadecimal) ? oColor2.rgbHexadecimal : oColor2.RgbHexadecimal;
                    if(!secondaryHexCode){
                        secondaryHexCode =oColor2.background.substring(oColor2.background.indexOf(':')+1);
                    }
                    colorOutline1 = secondaryHexCode;
                    colorOutline1 = colorOutline1.substring(colorOutline1.indexOf('#') + 1);
                }
                if (oColor3 && oColor3 != null && (oColor3.ColorId || oColor3.colorid)) {
                    var accentColorHexCode = (oColor3.rgbHexadecimal) ? oColor3.rgbHexadecimal : oColor3.RgbHexadecimal;
                    if(!accentColorHexCode){
                        accentColorHexCode =oColor3.background.substring(oColor3.background.indexOf(':')+1);
                    }
                    colorOutline2 = accentColorHexCode;
                    colorOutline2 = colorOutline2.substring(colorOutline2.indexOf('#') + 1);
                }

                var newURL = '';
                newURL = LiquidPixels.generateTextEffectPreviewURL(null, null,
                        sText,
                        sFontName,
                        fontObj.fontid,
                        baseColor,
                        colorOutline1,
                        colorOutline2,
                        sBaseImgWidth,
                        sBaseImgHeight);

                $.startProcess(true);
                var image = new Image();
                image.onload = function() {
                    $('#imgPreviewTextIdPlayerNumber').css('visibility', 'visible');
                    $('#imgPreviewTextIdPlayerNumber').attr('src', image.src);
                    $.doneProcess();
                };
                image.onerror = function() {
                    $.doneProcess();
                };
                image.src = newURL;

            } else {
                $('#imgPreviewTextIdPlayerNumber').attr('src', "");
                $('#imgPreviewTextIdPlayerNumber').css('visibility', 'hidden');
            }
        }
    } catch (err) {
    }
};

/**
 * Performs a fetching of Font Color 
 * @return color object for player number
 */
getColorPlayerNumber = function() {
    return GlobalInstance.getUniformConfigurationInstance().getPlayerNumberInfo('fontColor');
}
/**
 * Performs a fetching of Ouline 1 Color 
 * @return outline color object for player number
 * 
 */
getOutline1ColorPlayerNumber = function() {
    return GlobalInstance.getUniformConfigurationInstance().getPlayerNumberInfo('fontOutline1Color');
}
/**
 * Performs a fetching of Ouline 2 Color 
 * @return 
 * 
 */
getOutline2ColorPlayerNumber = function() {
    return GlobalInstance.getUniformConfigurationInstance().getPlayerNumberInfo('fontOutline2Color');
}
/**
 * Performs a fetching of Ouline 2 Color 
 * 
 */
getFontPlayerNumber = function() {
    if (GlobalInstance.getUniformConfigurationInstance().getPlayerNumberInfo('font') == undefined) {
        return null;
    }
    else {
        return GlobalInstance.getUniformConfigurationInstance().getPlayerNumberInfo('font').displayname;
    }
}

/*
 * This method fetches Font Object for PlayerNumber  
 */
getFontObjPlayerNumber = function() {
    return GlobalInstance.getUniformConfigurationInstance().getPlayerNumberInfo('font');
};

/*
 * This method fetches Text for Player Number  
 */
getTextPlayerNumber = function() {
    return GlobalInstance.getUniformConfigurationInstance().getPlayerNumberInfo('text');
};
/*
 * This method select the specific font as per font Id and sets the same in Global 
 * @param font Font object 
 * 
 * @return void
 */
PlayerNumber.prototype.selectFont = function(font, fontUrl) {

    if (font) {
        $("#dvIdComboFontPlayerNumber").attr({
            'fileloc': font.fileloc || font.FileLocation
        });
        $("#dvIdComboFontPlayerNumber").html("<img src='" + fontUrl + "' />");

        GlobalInstance.getUniformConfigurationInstance().setPlayerNumberInfo('font', {
            'fileloc': font.FileLocation || font.fileloc,
            'displayname': font.displayname || font.Name,
            'fontid': font.fontid || font.FontId

        });
    }
};

/**
 * Fetches the selected Font from uniform configuration (memory)
 * @param defaultFont Firt Font in the Font List
 * 
 * @return Object Selected style
 */
PlayerNumber.prototype.getSelectedFont = function(defaultFont) {
    var font = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('font');
    if (font) {
        return font;
    }
    return defaultFont;
}

/*
 * This method select the specific font Color and sets the same in Global 
 * @param (fontColor) object 
 * 
 * @return void
 */
PlayerNumber.prototype.selectFontColor = function(color) {
   var colorName ='' ;
   var rgbHexaDecimal='';
   var colorId ='';
   if (color) {
        colorName = (color.Name) ? color.Name : color.colorName;
        rgbHexaDecimal =(color.RgbHexadecimal)?color.RgbHexadecimal:color.background.substring(color.background.indexOf(':')+1);
        colorId = (color.ColorId) ? color.ColorId :color.colorid;
        $("#dvIdSelectedFillColorPlayerNumber").attr({
            'title': colorName,
            'alt': colorName,
            'displayname': colorName,
            'style': "background-color:" + rgbHexaDecimal

        });

        if (Utility.getObjectlength(GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('fontColor')) > 0) {
            GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo('fontColor', color);
            if (!this.defaultPlayerNumberFontColorSelected) {
                $("#dvIdColorNamePlayerNumberFont").html(colorName);
            }
            $('#dvIdColorBoxPlayerNumber ul li').attr({'class': 'in-active'});
            $("#ulColorComboBoxlistPlayerNumberFillColor li#colorid_" + colorId).attr("class", "active");
            $("#ulIdPlayerNumberPrimaryCustomColor li#colorid_" + colorId).attr("class", "active");
        } else {
            var defaultColorInfo = GlobalInstance.getColorInstance().getColorByKey('_' + CONFIG.get('DEFAULT_COLOR_ID'));
            $('#dvIdColorNamePlayerNumberFont').css('color', rgbHexaDecimal);
            $("#dvIdColorNamePlayerNumberFont").html(CONFIG.get("DEFAYLT_COLOR_TEXT"));
        }
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param defaultFontColor First FontColor 
 * 
 * @return Object Selected style
 */
PlayerNumber.prototype.getSelectedFontColor = function(defaultFontColor) {
    var fontColor = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('fontColor');
    if (fontColor) {
        this.defaultPlayerNumberFontColorSelected = false;
        return fontColor;
    }
    return defaultFontColor;
}

/*
 * This method select the specific font Color and sets the same in Global 
 * @param fontColor object 
 * 
 * @return void
 */
PlayerNumber.prototype.selectFontOutline1Color = function(color) {
    $('#dvIdColorBoxPlayerNumberOutlineFirst ul li').attr({
        'class': 'in-active'
    });

    $("#dvIdColorNamePlayerNumberOutlineFirst").html("");
    if (color) {
        var colorName = (color.Name) ? color.Name : color.colorName;
        var rgbHexaDecimal = (color.RgbHexadecimal) ? color.RgbHexadecimal : color.background.substring(color.background.indexOf(':') + 1);
        var colorId = (color.ColorId) ? color.ColorId : color.colorid;
        if (colorId) {
            $("#dvIdSelectedFillColorPlayerNumberOutlineFirst").removeClass("slashImage");
            $("#dvIdSelectedFillColorPlayerNumberOutlineFirst").attr({
                'title': colorName,
                'alt': colorName,
                'displayname': colorName,
                'style': "background-color:" + rgbHexaDecimal
            });
            $("#dvIdColorNamePlayerNumberOutlineFirst").html(colorName);
            $('#dvIdColorNamePlayerNumberOutlineFirst').css('color', '#000');
            $("#ulColorComboBoxlistPlayerNumberOutlineFirst li#colorid_" + colorId).attr("class", "active");
            $("#ulIdPlayerNumberOutlineFirstCustomColor li#colorid_" + colorId).attr("class", "active");
        } else {
            $("#dvIdSelectedFillColorPlayerNumberOutlineFirst").attr({
                'style': ""
            });
            $("#dvIdSelectedFillColorPlayerNumberOutlineFirst").addClass("slashImage color_box_selected");
            $("#dvIdColorNamePlayerNumberOutlineFirst").html("Optional");
            $('#dvIdColorNamePlayerNumberOutlineFirst').css('color', '#C3C3C3');
        }
        GlobalInstance.getUniformConfigurationInstance().setPlayerNumberInfo('fontOutline1Color', color);
    }
    else {
        $("#dvIdSelectedFillColorPlayerNumberOutlineFirst").attr({
            'style': ""
        });
        $("#dvIdSelectedFillColorPlayerNumberOutlineFirst").addClass("slashImage color_box_selected");
        $("#dvIdColorNamePlayerNumberOutlineFirst").html("Optional");
        $('#dvIdColorNamePlayerNumberOutlineFirst').css('color', '#C3C3C3');
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param defaultOutline1Color First Outline color
 * 
 * @return Object Selected style
 */
PlayerNumber.prototype.getSelectedFontOutline1Color = function(defaultOutline1Color) {
    var color = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('fontOutline1Color');
    if (color) {
        return color;
    }
    return defaultOutline1Color;
}

/*
 * This method select the specific font Color and sets the same in Global 
 * @param fontColor object 
 * 
 * @return void
 */
PlayerNumber.prototype.selectFontOutline2Color = function(color) {
    $('#dvIdColorBoxPlayerNumberOutlineSecond ul li').attr({
        'class': 'in-active'
    });

    $("#dvIdColorNamePlayerNumberOutlineSecond").html("");
    
    if (color) {
        var colorName = (color.Name) ? color.Name : color.colorName;
        var rgbHexaDecimal = (color.RgbHexadecimal) ? color.RgbHexadecimal : color.background.substring(color.background.indexOf(':') + 1);
        var colorId = (color.ColorId) ? color.ColorId : color.colorid;
        if (colorId) {
            $("#dvIdSelectedFillColorPlayerNumberOutlineSecond").removeClass("slashImage");
            $("#dvIdSelectedFillColorPlayerNumberOutlineSecond").attr({
                'title': colorName,
                'alt': colorName,
                'displayname': colorName,
                'style': "background-color:" + rgbHexaDecimal
            });
            $("#dvIdColorNamePlayerNumberOutlineSecond").html(colorName);
            $('#dvIdColorNamePlayerNumberOutlineSecond').css('color', '#000');
            $("#ulColorComboBoxlistPlayerNumberOutlineSecond li#colorid_" + colorId).attr("class", "active");
            $("#ulIdPlayerNumberOutlineSecondCustomColor li#colorid_" + colorId).attr("class", "active");
        } else {
            $("#dvIdSelectedFillColorPlayerNumberOutlineSecond").attr({
                'style': ""
            });
            $("#dvIdSelectedFillColorPlayerNumberOutlineSecond").addClass("slashImage color_box_selected");
            $("#dvIdColorNamePlayerNumberOutlineSecond").html("Optional");
            $('#dvIdColorNamePlayerNumberOutlineSecond').css('color', '#C3C3C3');
        }
        GlobalInstance.getUniformConfigurationInstance().setPlayerNumberInfo('fontOutline2Color', color);
    }
    else {
        $("#dvIdSelectedFillColorPlayerNumberOutlineSecond").attr({
            'style': ""
        });
        $("#dvIdSelectedFillColorPlayerNumberOutlineSecond").addClass("slashImage color_box_selected");
        $("#dvIdColorNamePlayerNumberOutlineSecond").html("Optional");
        $('#dvIdColorNamePlayerNumberOutlineSecond').css('color', '#C3C3C3');
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param defaultOutline2Color First FontColor 
 * 
 * @return Object Selected style
 */
PlayerNumber.prototype.getSelectedFontOutline2Color = function(defaultOutline2Color) {
    var color = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('fontOutline2Color');
    if (color) {
        return color;
    } else {
        return defaultOutline2Color;
    }
}

/**
 * Fetches the selected text from memory and sets the same 
 * 
 * @return Object Selected style
 */
PlayerNumber.prototype.setDefaultText = function() {
    var text = GlobalInstance.uniformConfigurationInstance.getPlayerNumberInfo('text');
    if (text) {
        $('#inputExamplePlayerNumber').val(text);
    }
};

/**
 * Fetches the set the default uniform color
 * 
 * @return Object Selected style
 */
PlayerNumber.prototype.setDefaultUniformColor = function () {
    var currentStyle = GlobalInstance.getUniformConfigurationInstance().getStylesInfo();
    var styleFabrics = GlobalInstance.getFabricInstance().getFabricByStyleId(currentStyle.StyleId);
    var fabricLength = Utility.getObjectlength(styleFabrics);
    var colorObject = GlobalInstance.getUniformConfigurationInstance().getColorsInfo();
    if (!(fabricLength > 1 && (GlobalInstance.getUniformConfigurationInstance().getFabricClicked() || GlobalInstance.getUniformConfigurationInstance().getCustomizeTabClicked()))
            && Utility.getObjectlength(colorObject.uniformSecondaryColor) < 1 && Utility.getObjectlength(colorObject.uniformTertiaryColor) < 1) {
        $('.uniformColorBoxSecondary').css('background', '#000000')
        $('.uniformColorBoxTertiary').css('background', '#000000')
    }
};


/*
*
*This method returns currently selected anchorpoint object of player number type
*
*/

PlayerNumber.prototype.getCurrentSelectedAnchorPointtObject = function () {
    try {
        var thisObject = this;
        var savedAnchorPoints = GlobalInstance.getUniformConfigurationInstance().getAnchorPoints();
        var currentSelectedAnchorObject = GlobalInstance.getAnchorPointInstance().getSelectedAnchorObj();
        for (key in savedAnchorPoints) {
            var apData = savedAnchorPoints[key];
            if (apData.id == currentSelectedAnchorObject.id && apData.type == LOCATION_TYPE.get('secPlayerNumberAnchorPanel')) {
                thisObject.currentSelectedPlayerNumberAnchor = apData;
                break;
            }
        }
    } catch (e) {
        Log.trace('PlayerNumber.prototype.getCurrentSelectedAnchorPoinytObject  ------' + e.message);
    }
};

PlayerNumber.prototype.getDefaultFontUrl = function () {

    var font = GlobalInstance.getUniformConfigurationInstance().getPlayerNumberInfo('font');
    var sFontName = font.fileloc;
    sFontName = font.fileloc.substring(font.fileloc.indexOf('/') + 1);

    var fontUrl = LiquidPixels.generateTextEffectPreviewURL(
                null,
                null,
                font.displayname,
                sFontName,
                font.fontid,
                this.fontColor,
                this.fontStrokeColor1,
                this.fontStrokeColor2,
                this.fontBaseImgWidth,
                this.fontBaseImgHeight
        );

    return fontUrl;
};

PlayerNumber.prototype.selectFontInCombo = function () {
    var selectedFont = GlobalInstance.getUniformConfigurationInstance().getPlayerNumberInfo('font');
    if (selectedFont.fontid !== undefined) {
        $('#dvIdComboDropdownPlayerNumber').scrollTop($('#dvPlayerNumberFontList_' + selectedFont.fontid).position().top);
        $('#dvPlayerNumberFontList_' + selectedFont.fontid).addClass('active');
    } else {
        $('#dvIdComboDropdownPlayerNumber').scrollTop(true);
        $('#dvIdComboDropdownPlayerNumber div:eq(0)').addClass('active');
    }
};
