/**
 * 
 TWA proshpere configurator
 * 
 * Othertext.js is used to define changes related other text screen. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/*
 * Constructor for OtherText class.
 */
function OtherText() {
    this.bindOtherTextScreenEvents();
    this.currentSelectedOtherTextAnchor = null;
    this.htmlSlashImg = '<div class="slashImage"> </div>';
    var text = GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('text') || '';
    if ((Utility.getObjectlength(GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('fontColor'), 'otjs18') > 0) && (text !== '')) {
        this.defaultOtherTextFontColorSelected = false;
    }
    else {
        this.defaultOtherTextFontColorSelected = true;
    }
    this.defaultFont = null;
    this.fontStrokeColor1 = 'ffffff';
    this.fontStrokeColor2 = '666666';
    this.fontBaseImgWidth = "60";
    this.fontBaseImgHeight = "40";
    this.fontColor = '000000';
}

/*
 * This method shoes the OtherText screen.
 * @return void
 */
OtherText.prototype.show = function() {
    $("#secNumberAndTextHome").hide();
    $("#secPlayerName").hide();
    $("#secPlayerNumber").hide();
    $("#secTeamName").hide();
    $("#secOtherText").show();
    this.getCurrentSelectedAnchorPointtObject();
    this.selectFontColor(this.getSelectedFontColor(null));
    this.selectFontOutline1Color(this.getSelectedFontOutline1Color(null));
    this.selectFontOutline2Color(this.getSelectedFontOutline2Color(null));
    this.selectFont(this.getSelectedFont(this.defaultFont), this.getDefaultFontUrl());
    previewOtherText();
};

/*
 * This method initialize the Fonts and colors in this screen
 * @return void
 */
OtherText.prototype.init = function() {
    //Bind Font List
    GlobalInstance.fontInstance = GlobalInstance.getFontInstance();
    GlobalInstance.fontInstance.addCallback(this.setHtmlAndBindFontListForOtherText.bind(this));

    //Bind Color List
    //GlobalInstance.colorInstance = GlobalInstance.getColorInstance(null, null, null);
    //GlobalInstance.colorInstance.addCallback(this.setHtmlAndBindColorOtherText.bind(this));

    this.setHtmlAndBindColorOtherText(GlobalInstance.getColorInstance(null, null, null).getColorList());

    GlobalInstance.textEffectInstance = GlobalInstance.getTextEffectInstance();
    GlobalInstance.textEffectInstance.addCallback(this.bindTextEffectCtrl.bind(this));
    Utility.imitatePlaceHolderForIE();
};

/*
 * This method hides the OtherText screen
 * @return void
 */
OtherText.prototype.hide = function() {
    $("#secOtherText").hide();
};

/*
 * This method binds html and events for text Orientation Combo box 
 * @params textEffectList specifies the list of selected text orientation effects
 * 
 * @return void
 */
OtherText.prototype.bindTextEffectCtrl = function(textEffectList) {
    this.bindTextEffectCtrlHTML(textEffectList);
    this.bindTextEffectCtrlEvents(textEffectList);

};

/*
 * This method binds html for text Orientation
 * @params textEffectList specifies the list of selected text orientation effects
 * @return void
 */
OtherText.prototype.bindTextEffectCtrlHTML = function(textEffectList) {
    var font = {
        "Name": "PS_CollegiateStd",
        "Id": "1004"
    };
    var oColor1 = {
        "id": "4",
        "name": "Black",
        "rgbValue": "10,10,10",
        "cmykValue": "70,55,55,100",
        "rgbHexadecimal": "#1A0000",
        "matchButtonColorID": "4",
        "matchThreadColorID": "4",
        "matchZipperColorID": "4"
    };
    var oColor2 = {
        "id": "4",
        "name": "Black",
        "rgbValue": "10,10,10",
        "cmykValue": "70,55,55,100",
        "matchButtonColorID": "4",
        "matchThreadColorID": "4",
        "matchZipperColorID": "4"
    };

    var oColor3 = {
        "id": "4",
        "name": "Black",
        "rgbValue": "10,10,10",
        "cmykValue": "70,55,55,100",
        "matchButtonColorID": "4",
        "matchThreadColorID": "4",
        "matchZipperColorID": "4"
    };
    var tempTextEffectHtml = '';
    var sFontName = font.Name || "PS_SportScriptMTStd";
    var sFontColor = oColor1.rgbHexadecimal || "white";
    sFontColor = sFontColor.replace("#", "");
    var sFontSize = "15";
    var sFontWidth = "10";
    var sBaseColor = "181616";
    var sBaseImgWidth = "60";
    var sBaseImgHeight = "17";
    var sCurveRadius = "75";
    var sCentreXCoordinate = "40";
    var sCentreYCoordinate = "87";
    var sTextEffect = "archUp";
    var sText = "Sample";

    var selectedTextEffect = null;
    var selectedTextEffectImageURL = null;
    selectedTextEffect = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('textOrientation');
    $.each(textEffectList, function(key, textEffect) {
        sFontName = font.Name;
        var textEffectName = textEffect ? textEffect.TextEffectCategorys[0].TextEffects[0].FileLocation : '';
        var textEffectURL = LiquidPixels.generateTextEffectPreviewURL(textEffect.TextEffectCategorys[0].TextEffects[0], textEffectName,
                sText,
                sFontName,
                font.Id,
                sFontColor,
                'ffffff',
                '666666',
                //oColor2.rgbHexadecimal,
                //oColor3.rgbHexadecimal,
                sBaseImgWidth,
                sBaseImgHeight
                );

        //When no exiting save values 
        if (selectedTextEffect == null
                || selectedTextEffect == undefined
                ) {
            selectedTextEffect = textEffect;
            selectedTextEffectImageURL = textEffectURL;
        }
        //When exiting saved values are present in Global parameters and are being fetched via retrival code 
        if (selectedTextEffect != null
                && selectedTextEffect != undefined
                && selectedTextEffect.TextEffectTypeId == textEffect.TextEffectTypeId
                ) {
            selectedTextEffect = textEffect;
            selectedTextEffectImageURL = textEffectURL;
        }
        tempTextEffectHtml += '<div style="vertical-align:middle; text-align:center" parentId="dvIdComboBoxTextEffectOtherText" id= "otherText_' + textEffect.TextEffectTypeId + '" class="comboDropdownListText" value="' + textEffect.Name + '" displayname="' + textEffect.Name + '"> <div class="fl">' + textEffect.Name + '</div><div class="fr" parentId="dvIdComboBoxTextEffectOtherText"> <img src="' + textEffectURL + '"/></div></div>';
    });
    $('#dvIdComboBoxTextEffectOtherTextList').html(tempTextEffectHtml);
    this.selectTextEffect(selectedTextEffect, selectedTextEffectImageURL);
};

/**
 *  This method binds events for text Orientation
 * @param textEffectList specifies the list of selected text orientation effect
 * 
 * @returns void
 */
OtherText.prototype.bindTextEffectCtrlEvents = function(textEffectList) {
    $('#dvIdComboBoxTextEffectOtherText').off("click");
    $('#dvIdComboBoxTextEffectOtherText').on("click", function() {
        $('#dvIdComboBoxTextEffectOtherTextList').toggle();
        var selecetedTextEffect = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('textOrientation');
        $('#dvIdComboBoxTextEffectOtherTextList').scrollTop($('#otherText_' + selecetedTextEffect.TextEffectTypeId).position().top);
        return false;
    });
    /**
     * Handles the click Events
     */
    $(document).on('click', '#dvIdComboBoxTextEffectOtherTextList div', function() {
        var thisElement = $(this);
        if (thisElement.attr('class') == 'fl' || thisElement.attr('class') == 'fr') {
            thisElement = $(this).parent();
        }
        $('#dvIdComboBoxTextEffectOtherText').html('<div>' + $(thisElement).html() + '</div>');
        $('#dvIdComboBoxTextEffectOtherText').attr("value", $(thisElement).attr('displayname'));
        $('#dvIdComboBoxTextEffectOtherTextList').hide();
        $('#dvIdComboBoxTextEffectOtherTextList div.comboDropdownListText').removeClass('active');
        $(this).addClass('active');
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('textOrientation',
                GlobalInstance.textEffectInstance.getTextEffectByKey('_' + $(thisElement).attr('id').split("_")[1]));
        //Previe text logic
        previewOtherText();
        return false;
    });
};

/*
 * This function binds the screen events.
 * @return void
 */
OtherText.prototype.bindOtherTextScreenEvents = function () {
    var thisObject = this;
    $('#btnPlayerNumberOtherText ,#btnPlayerNameOtherText ,#btnTeamNameOtherText').off('click');
    $(document).on('click', "#btnPlayerNumberOtherText", function() {
        GlobalInstance.getPlayerNameInstance().hide();
        GlobalInstance.getTeamNameInstance().hide();
        GlobalInstance.getOtherTextInstance().hide();
        GlobalInstance.getPlayerNumberInstance().show();
        return false;
    });
    /**
     * Handles the click Event On Player name Button
     */
    $(document).on('click', "#btnPlayerNameOtherText", function() {
        GlobalInstance.getPlayerNumberInstance().hide();
        GlobalInstance.getTeamNameInstance().hide();
        GlobalInstance.getOtherTextInstance().hide();
        GlobalInstance.getPlayerNameInstance().show();
        return false;
    });
    /**
     * Handles the click Event on Team Name Button
     */
    $(document).on('click', "#btnTeamNameOtherText", function() {
        GlobalInstance.getPlayerNumberInstance().hide();
        GlobalInstance.getPlayerNameInstance().hide();
        GlobalInstance.getOtherTextInstance().hide();
        GlobalInstance.getTeamNameInstance().show();
        return false;
    });
    /**
     * Handles the click Event on Other Text Buton
     */
    $(document).on('click', "#btnOtherText", function() {
        GlobalInstance.getPlayerNumberInstance().hide();
        GlobalInstance.getPlayerNameInstance().hide();
        GlobalInstance.getTeamNameInstance().hide();
        GlobalInstance.getOtherTextInstance().show();
        return false;
    });

    this.setDefaultText();
    $('#inputExampleOtherText').bind('keypress', function(event) {
        var sText = $(this).val();
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (sText.length > 15 && (regex.test(key)) && $(this)[0].selectionStart == $(this)[0].selectionEnd) {
            event.preventDefault();
            return false;
        }
    });
    $("#inputExampleOtherText").keyup(function() {
        //preview Image based on the values selected in Font and Colors or the global variables
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('text', $('#inputExampleOtherText').val());
        previewOtherText();
    });

    //Font Combo Box Event Binding 
    $(document).on('click', '#dvIdComboFontOtherText', function() {
        if ($('#dvIdComboDropdownOtherText').is(':visible')) {
            $('#dvIdComboDropdownOtherText').hide();
        } else {
            $('#dvIdComboDropdownOtherText').show();
            var selectedFont = GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('font');
            thisObject.selectFontInCombo();
        }
        return false;
    });

    $(document).on('click', '#dvIdComboDropdownOtherText div img ,#dvIdComboDropdownOtherText div', function() {
        var fontObject = new Object();
        var thisElement = $(this);
        this.uniformEmblishmentInfo = $(this).first().attr('displayname');
        fontObject.src = $(this).first().children().attr('src');
        if (!$(this).first().attr('displayname')) {
            fontObject.displayname = $(this).parent().attr('displayname');
        }
        if (!fontObject.src) {
            fontObject.src = $(this).attr('src');
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
        
        var displayName = $(this).first().attr('displayname') || fontObject.displayname;
        var fileLoc = $(this).first().attr('fileloc') || fontObject.fileloc;
        $(this).first().attr('displayname');
        $(this).first().attr({
            'displayname': $(this).first().attr('displayname') || displayName,
            'IPSID': $(this).first().attr('value') || fontObject.IPSID,
            'fileloc': $(this).first().attr('fileloc') || fileLoc
        });

        $('.comboDropdownFontListText').removeClass('active');
        $(this).addClass('active');
        // var newURLLP = LiquidPixels.previewNumberText(oColor1.rgbHexadecimal, displayName, 13, displayName, fileLoc);

        $('#dvIdComboFontOtherText').html("<img src='" + fontObject.src + "' />");
        $('#dvIdComboFontOtherText').attr('fileloc', $(this).first().attr('fileloc'));
        $('#dvIdComboDropdownOtherText').hide();
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('font', {
            'name': $(this).first().attr('displayname') || displayName,
            'displayname': $(this).first().attr('displayname') || displayName,
            'IPSID': $(this).first().attr('value') || fontObject.IPSID,
            'fontid': $(this).first().attr('fontid') || fontObject.fontId,
            'fileloc': $(this).first().attr('fileloc') || fileLoc
        });
        GlobalInstance.fontSelectionInstance = GlobalInstance.getFontSelectionInstance();
        GlobalInstance.fontSelectionInstance.setModifiedFont(GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('font'));
        previewOtherText();
        return false;
    });


};

/**
 * This method binds the font list to the Font Combo in Player Number screen
 * @param fontList fontList specific fontlist 
 * @returns void
 */
OtherText.prototype.setHtmlAndBindFontListForOtherText = function(fontList) {
    var thisObject = this;
    var tempFontHtml = '';
    var defaultFont = null;
    var defaultUrl = ''
    var count = 0;
    var textdecalObj = null;

    $.each(fontList, function (i, font) {
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

        if (count == 0) {
            defaultUrl = newURLLP;
        }
        count++;
        tempFontHtml += '<div class="comboDropdownFontListText" id="dvOtherTextrFontList_' + font.FontId + '" value="' + font.Name + '" displayname="' + font.Name + '" fileloc="' + font.FileLocation + '" fontid="' + font.FontId + '" >  <img src="' + newURLLP + '"/></div>';
    });
    $('#dvIdComboDropdownOtherText').html(tempFontHtml);
    this.selectFont(this.getSelectedFont(this.defaultFont), defaultUrl);
};

/**
 * This method binds the color list to the Fill Color Combo.
 * @param  colorList selected colorlist
 * @returns void
 */
OtherText.prototype.setHtmlAndBindColorOtherText = function() {
    var colorList = GlobalInstance.getColorInstance(null, null, null).getColorList();
    var tempColorsListHtml = '';
    var tempCustomColorListHtml = '';
    var tempColorsListUnselectHtml = '';
    tempColorsListUnselectHtml += '<li id= "colorid_0" colorid="0" style="background-color:; background-image:url(\'images/slash.png\');"><a id="0" \n\
                            data-name="" \n\
                            data-matchButtonColorID="" colorid="0" \n\
                            data-cmykValue="" \n\
                            data-rgbValue="" \n\
                            rgbHexadecimal="" \n\
                            alt="Optional" \n\
                            class="in-active" \n\
                            style="background-color:"></a></li>';
    var defaultFontColor = null;
    $.each(colorList, function(i, color) {
        if (defaultFontColor == null) {
            defaultFontColor = color;
        }
        if (color.CustomerId != null && color.CustomerId != '' && color.CustomerId != undefined) {
            tempCustomColorListHtml += '<li  TaaColorId="' + color.TaaColorId + '" id="colorid_' + color.ColorId + '" colorid="' + color.ColorId + '" style="cursor:pointer; background-color:' + color.RgbHexadecimal + '" class="colorItems" alt="' + color.Name + '"  title="' + color.Name + '"><a id=' + color.ColorId + ' \n\
                            data-name="' + color.name + '" \n\
                            data-matchButtonColorID="' + color.MatchingButtonColorId + '" \n\
                            data-cmykValue="' + color.Cyan + ',' + color.Magenta + ',' + color.Yellow + ',' + color.Black + '" \n\
                            data-rgbValue="' + color.Red + ',' + color.Green + ',' + color.Blue + '" \n\
                            rgbHexadecimal="' + color.RgbHexadecimal + '" \n\\n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            alt="' + color.Name + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        }
        else {
            tempColorsListHtml += '<li  TaaColorId="' + color.TaaColorId + '" id="colorid_' + color.ColorId + '" colorid="' + color.ColorId + '" style="cursor:pointer; background-color:' + color.RgbHexadecimal + '" class="colorItems" alt="' + color.Name + '"  title="' + color.Name + '"><a id=' + color.ColorId + ' \n\
                            data-name="' + color.name + '" \n\
                            data-matchButtonColorID="' + color.MatchingButtonColorId + '" \n\
                            data-cmykValue="' + color.Cyan + ',' + color.Magenta + ',' + color.Yellow + ',' + color.Black + '" \n\
                            data-rgbValue="' + color.Red + ',' + color.Green + ',' + color.Blue + '" \n\
                            rgbHexadecimal="' + color.RgbHexadecimal + '" \n\\n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            alt="' + color.Name + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        }
    });
    $('#ulColorComboBoxlistOtherTextFillColor').html(tempColorsListHtml);
    $('#ulColorComboBoxlistOtherTextOutlineFirst').html(tempColorsListUnselectHtml + tempColorsListHtml);
    $('#ulColorComboBoxlistOtherTextOutlineSecond').html(tempColorsListUnselectHtml + tempColorsListHtml);

    //Custom Color Case
    var customerId = GlobalInstance.uniformConfigurationInstance.getAccountNumber();
    if (customerId !== 0 && customerId !== undefined) {
        $('#ulIdOtherTextPrimaryCustomColor').html(tempCustomColorListHtml);
        $('#ulIdOtherTextOutlineFirstCustomColor').html(tempCustomColorListHtml);
        $('#ulIdOtherTextOutlineSecondCustomColor').html(tempCustomColorListHtml);
    }

    /************************ BEGIN Writing Common Function for all Drop boxes for Colors ******************************/

    this.selectFontColor(this.getSelectedFontColor(defaultFontColor));

    //Color Combo Box Event Binding for FontColor Comobo Box
    $('#dvIdColorBoxOtherText').draggable({
        containment: '#dvConfiguratorPanel'
    });
    $(document).off('click', '#dvIdFillColorOtherText');
    $(document).on('click', '#dvIdFillColorOtherText', function() {
        $("#dvIdFillColorOtherText").css({left: '', top: ''});
        $('#dvIdColorBoxOtherTextOutlineFirst').hide();
        $('#dvIdColorBoxOtherTextOutlineSecond').hide();

        if ($('#dvIdColorBoxOtherText').is(':visible')) {
            $('#dvIdColorBoxOtherText').hide();
        } else {
            thisObject.setDefaultUniformColor();
            setTimeout(function() {
                $('#dvIdColorBoxOtherText').show();
            }, 10);
        }
        return false;
    });

    $(document).off('click', '#dvIdColorBoxOtherText > .numberandTextColorBoxScrolling ul li , #dvIdOtherTextPrimaryCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxOtherText > .numberandTextColorBoxScrolling ul li , #dvIdOtherTextPrimaryCustomColor ul li', function () {
        $("#dvIdColorBoxOtherText").css({left: '', top: ''});
        var clickedLi = $(this).children();
        $('#dvIdColorBoxOtherText ul li').attr({
            'class': 'in-active'
        });

        $('#dvIdOtherTextPrimaryCustomColor ul li').attr({
            'class': 'in-active'
        });


        $(this).attr({
            'class': 'active'
        });
        if (clickedLi.first().attr('colorid') != 0) {
            var colorid = "" + $(this).attr('colorid');
            $('#dvIdSelectedFillColorOtherText').attr({
                'alt': clickedLi.first().attr('alt'),
                'colorid': colorid,
                'style': clickedLi.first().attr('style')
            });
            $('#dvIdColorNameOtherTextFont').html(clickedLi.first().attr('alt'));
            $('#dvIdColorBoxOtherText').hide();
            thisObject.defaultOtherTextFontColorSelected = false;
            var selectedColor = GlobalInstance.colorInstance.getColorByKey('_' + colorid);
            GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
            GlobalInstance.colorRetainInstance.setModifiedColors(true, false, false, selectedColor);// Update the primary color in the application that has primary color support
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontColor',
                    GlobalInstance.colorInstance.getColorByKey('_' + colorid)
                    );

            previewOtherText();
        }
        return false;
    });

    //First Outline Color Combo Box Binding
    this.selectFontOutline1Color(this.getSelectedFontOutline1Color(null));
    $('#dvIdColorBoxOtherTextOutlineFirst').draggable({
        containment: '#dvConfiguratorPanel'
    });
    $(document).off('click', '#dvIdOtherTextOutlineFirst');
    $(document).on('click', '#dvIdOtherTextOutlineFirst', function() {
        $("#dvIdColorBoxOtherTextOutlineFirst").css({left: '', top: ''});
        $('#dvIdColorBoxOtherText').hide();
        $('#dvIdColorBoxOtherTextOutlineSecond').hide();
        if ($('#dvIdColorBoxOtherTextOutlineFirst').is(':visible')) {
            $('#dvIdColorBoxOtherTextOutlineFirst').hide();
        } else {
            thisObject.setDefaultUniformColor();
            setTimeout(function() {
                $('#dvIdColorBoxOtherTextOutlineFirst').show();
            }, 10);
        }
        return false;
    });

    var thisObject = this;
    $(document).off('click', '#dvIdColorBoxOtherTextOutlineFirst > .numberandTextColorBoxScrolling ul li , #dvIdOtherTextOutlineFirstCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxOtherTextOutlineFirst > .numberandTextColorBoxScrolling ul li , #dvIdOtherTextOutlineFirstCustomColor ul li', function (e) {

        if (e.target.id == "colorid_0") {
            $("#dvIdSelectedFillColorOtherTextOutlineFirst").addClass("slashImage color_box_selected");
        }

        $("#dvIdColorBoxOtherTextOutlineFirst").css({left: '', top: ''});
        var clickedLi = $(this).children();
        $('#dvIdColorBoxOtherTextOutlineFirst ul li').attr({
            'class': 'in-active'
        });

        $('#dvIdOtherTextOutlineFirstCustomColor ul li').attr({
            'class': 'in-active'
        });

        $(this).attr({
            'class': 'active'
        });
        $('#dvIdColorNameOtherTextOutlineFirst').css('color', '#C3C3C3');
        if (clickedLi.first().attr('colorid') != 0) {
            $("#dvIdSelectedFillColorOtherTextOutlineFirst").removeClass("slashImage");
            $('#dvIdColorNameOtherTextOutlineFirst').css('color', '#000');
        }
        var colorid = $(this).attr('colorid');
        $('#dvIdSelectedFillColorOtherTextOutlineFirst').attr({
            'alt': clickedLi.first().attr('alt'),
            'colorid': colorid,
            'style': clickedLi.first().attr('style')
        });
        $('#dvIdColorNameOtherTextOutlineFirst').html(clickedLi.first().attr('alt'));
        $('#dvIdColorBoxOtherTextOutlineFirst').hide();
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var selectedColorObject = GlobalInstance.colorInstance.getColorByKey('_' + colorid);
        if (!selectedColorObject) {
            selectedColorObject = null;
        }

        GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
        GlobalInstance.colorRetainInstance.setModifiedColors(false, true, false, selectedColorObject); // Update the secondary color in the application that has secondary color support
        GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontOutline1Color', selectedColorObject);
        previewOtherText();
        return false;
    });

    //First Outline Color Combo Box Binding
    this.selectFontOutline2Color(this.getSelectedFontOutline2Color(null));
    //Second Outline Color Combo Box Binding
    $('#dvIdColorBoxOtherTextOutlineSecond').draggable({
        containment: '#dvConfiguratorPanel'
    });
    $(document).off('click', '#dvIdOtherTextOutlineSecond');
    $(document).on('click', '#dvIdOtherTextOutlineSecond', function() {
        $("#dvIdColorBoxOtherTextOutlineSecond").css({left: '', top: ''});
        $('#dvIdColorBoxOtherText').hide();
        $('#dvIdColorBoxOtherTextOutlineFirst').hide();

        if ($('#dvIdColorBoxOtherTextOutlineSecond').is(':visible')) {
            $('#dvIdColorBoxOtherTextOutlineSecond').hide();
        } else {
            thisObject.setDefaultUniformColor();
            setTimeout(function() {
                $('#dvIdColorBoxOtherTextOutlineSecond').show();
            }, 10);
        }
        return false;
    });
    var thisObject = this;
    $(document).off('click', '#dvIdColorBoxOtherTextOutlineSecond > .numberandTextColorBoxScrolling ul li.#dvIdOtherTextOutlineSecondCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxOtherTextOutlineSecond > .numberandTextColorBoxScrolling ul li ,#dvIdOtherTextOutlineSecondCustomColor ul li', function (e) {

        if (e.target.id == "colorid_0") {
            $("#dvIdSelectedFillColorOtherTextOutlineSecond").addClass("slashImage color_box_selected");
        }

        $("#ulColorComboBoxlistOtherTextOutlineSecond").css({left: '', top: ''});
        var clickedLi = $(this).children();
        $('#dvIdColorBoxOtherTextOutlineSecond ul li').attr({
            'class': 'in-active'
        });

        $('#dvIdOtherTextOutlineSecondCustomColor ul li').attr({
            'class': 'in-active'
        });

        $(this).attr({
            'class': 'active'
        });
        $('#dvIdColorNamePlayerNameOutlineFirst').css('color', '#C3C3C3');
        if (clickedLi.first().attr('colorid') != 0) {
            $("#dvIdSelectedFillColorOtherTextOutlineSecond").removeClass("slashImage");
            $('#dvIdColorNameOtherTextOutlineSecond').css('color', '#000');
        }
        var colorid = $(this).attr('colorid');
        $('#dvIdColorBoxOtherTextOutlineSecond').hide();
        $('#dvIdSelectedFillColorOtherTextOutlineSecond').attr({
            'title': clickedLi.first().attr('alt'),
            'alt': clickedLi.first().attr('alt'),
            'colorid': colorid,
            'style': clickedLi.first().attr('style')
        });
        $('#dvIdColorNameOtherTextOutlineSecond').html(clickedLi.first().attr('alt'));
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var selectedColorObject = GlobalInstance.colorInstance.getColorByKey('_' + colorid);
        if (!selectedColorObject) {
            selectedColorObject = null;
        }
        GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
        GlobalInstance.colorRetainInstance.setModifiedColors(false, false, true, selectedColorObject); // Update the accent color in the application that has accent color support
        GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontOutline2Color', selectedColorObject);
        previewOtherText();

        return false;
    });
    previewOtherText();
};

/**
 * Performs a fetching Preview Text.  
 * Updates Preview on Other Text String
 * @return void
 */
previewOtherText = function() {
    try {
        var objTextEffect = getTextEffectObjOtherText();
        var sTextEffect = objTextEffect && objTextEffect.FileLocation ? objTextEffect.FileLocation : "";
        /*if (objTextEffect) {
         sTextEffect = objTextEffect.FileLocation || '';
         }*/
        var sText = getTextOtherText() || "";
        var fontObj = getFontObjOtherText();
        var sFontName = '';
        if (fontObj.fileloc) {
            sFontName = fontObj.fileloc.substring(fontObj.fileloc.indexOf('/') + 1);
        }
        var sFont = getFontOtherText();
        var oColor1 = getColorOtherText();
        var oColor2 = getOutline1ColorOtherText();
        var oColor3 = getOutline2ColorOtherText();

        if (!oColor1) {
            oColor1 = GlobalInstance.colorInstance.getColorByKey('_' + $('#dvIdColorBoxOtherText ul>:first-child').first().attr('colorid'))
        }
        ;
        var primaryColorHexCode = (oColor1.rgbHexadecimal) ? oColor1.rgbHexadecimal : oColor1.RgbHexadecimal;
        if (!primaryColorHexCode) {
            primaryColorHexCode = oColor1.background.substring(oColor1.background.indexOf(':') + 1);
        }
        if (sFont != "" && oColor1 != undefined && (primaryColorHexCode) != undefined) {
            if (sText != "") {
                var sFontSize = "50";
                var sFontColor = (primaryColorHexCode).replace("#", "");
                var colorOutline1 = "None";
                if (oColor2 && oColor2 != null && (oColor2.ColorId || oColor2.colorid)) {
                    var secondaryHexCode = (oColor2.rgbHexadecimal) ? oColor2.rgbHexadecimal : oColor2.RgbHexadecimal;
                    if (!secondaryHexCode) {
                        secondaryHexCode = oColor2.background.substring(oColor2.background.indexOf(':') + 1);
                    }
                    colorOutline1 = secondaryHexCode;
                    colorOutline1 = colorOutline1.substring(colorOutline1.indexOf('#') + 1);

                }
                var colorOutline2 = "None";
                if (oColor3 && oColor3 != null && (oColor3.ColorId || oColor3.colorid)) {
                    var accentColorHexCode = (oColor3.rgbHexadecimal) ? oColor3.rgbHexadecimal : oColor3.RgbHexadecimal;
                    if (!accentColorHexCode) {
                        accentColorHexCode = oColor3.background.substring(oColor3.background.indexOf(':') + 1);
                    }
                    colorOutline2 = accentColorHexCode;
                    colorOutline2 = colorOutline2.substring(colorOutline2.indexOf('#') + 1);
                }
                var sFontWidth = "50";
                var sBaseColor = "ffffff";
                var sBaseImgWidth = "360";
                var sBaseImgHeight = "100";
                var sCurveRadius = "100";
                var sCentreXCoordinate = "180";
                var sCentreYCoordinate = "150";
                var newURL = LiquidPixels.generateTextEffectPreviewURL(objTextEffect, sTextEffect,
                        sText,
                        sFontName,
                        fontObj.fontid,
                        sFontColor,
                        colorOutline1,
                        colorOutline2,
                        sBaseImgWidth,
                        sBaseImgHeight
                        );

                $.startProcess(true);
                var image = new Image();
                image.onload = function() {
                    $('#imgPreviewTextIdOtherText').css('visibility', 'visible');
                    $('#imgPreviewTextIdOtherText').attr('src', image.src);
                    $.doneProcess();
                }
                image.onerror = function() {
                    $.doneProcess();
                };
                image.src = newURL;


                //$('#imgPreviewTextIdOtherText').attr("src", newURL);
            } else {
                $('#imgPreviewTextIdOtherText').attr("src", "");
                $('#imgPreviewTextIdOtherText').css('visibility', 'hidden');
            }
        }
    } catch (err) {

    }

};

/**
 * This method fetches Font Color for OtherText  
 * @returns color object in Other Text
 */
getColorOtherText = function() {
    var fontColor = GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('fontColor');
    if (fontColor) {
        return fontColor;
    } else {
        return  null;
    }
}
/*
 * This method fetches Font Outline 1 Color for OtherText  
 * @return outline first object in Other Text 
 */
getOutline1ColorOtherText = function() {
    var fontOutline1Color = GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('fontOutline1Color');
    if (fontOutline1Color) {
        return fontOutline1Color;
    } else {
        return  null;
    }
};

/*
 * This method fetches Font Outline 2 Color for OtherText  
 * @return outline second object in Other text
 */
getOutline2ColorOtherText = function() {
    var fontOutline2Color = GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('fontOutline2Color');
    if (fontOutline2Color) {
        return fontOutline2Color;
    } else {
        return  null;
    }

};
/*
 * This method fetches Font text for OtherText  
 * @return font object's display name in Other Text
 */
getFontOtherText = function() {
    if (GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('font') == undefined) {
        return null;
    }
    else {
        return GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('font').displayname;
    }

};

/*
 * This method fetches Font Object for OtherText  
 * @return font object in other text
 */
getFontObjOtherText = function() {
    return GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('font');
};

/*
 * This method fetches Text for Other Text
 * @return text object in other text
 */
getTextOtherText = function() {
    return GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('text');
};

/*
 * This method select the specific font as per font Id and sets the same in Global 
 * @param (font) object 
 * 
 * @return void
 */
OtherText.prototype.selectFont = function(font, fontUrl) {

    if (font) {
        $("#dvIdComboFontOtherText").attr({
            'fileloc': font.fileloc || font.FileLocation
        });
        $("#dvIdComboFontOtherText").html("<img src='" + fontUrl + "' />");
        GlobalInstance.getUniformConfigurationInstance().setOtherTextInfo('font', {
            'fileloc': font.FileLocation || font.fileloc,
            'displayname': font.displayname || font.Name,
            'name': font.Name,
            'fontid': font.fontid || font.FontId
        });
    }
};

/**
 * Fetches the selected Font from uniform configuration (memory)
 * @param (defaultFont) Firt Font in the Font List
 * 
 * @return Object Selected style
 */
OtherText.prototype.getSelectedFont = function(defaultFont) {
    var font = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('font');
    if (font) {
        return font;
    }
    return defaultFont;
}

/*
 * This method select the specific text Effect as per text Effect Id and sets the same in Global 
 * @param textEffect specific TexteffectID
 *  
 * @params textEffectURL contains the Liquid Pixel URL
 * 
 * @return void
 */
OtherText.prototype.selectTextEffect = function(textEffect, textEffectURL) {
    if (textEffect != undefined) {
        $("#dvIdComboBoxTextEffectOtherText").attr({
            'TextEfffectId': textEffect.TextEffectTypeId || textEffect.TextEffectTypeId
        });
        $("#dvIdComboBoxTextEffectOtherText").html('<div class="fl" style="line-height:2;">' + textEffect.Name + '</div><div class="fr" parentId="dvIdComboBoxTextEffectOtherText"> <img src="' + textEffectURL + '"/></div>');
        GlobalInstance.getUniformConfigurationInstance().setOtherTextInfo('textOrientation', textEffect);
        $("#otherText_" + textEffect.TextEffectTypeId).addClass('active');
    }
};

/*
 * This method select the specific font Color and sets the same in Global 
 * @param (color) object 
 * 
 * @return void
 */
OtherText.prototype.selectFontColor = function(color) {
    $('#dvIdColorBoxOtherText ul li').attr({
        'class': 'in-active'
    });

    $('#dvIdOtherTextPrimaryCustomColor ul li').attr({
        'class': 'in-active'
    });

    if (color) {
        var colorName = (color.Name) ? color.Name : color.colorName;
        var rgbHexaDecimal = (color.RgbHexadecimal) ? color.RgbHexadecimal : color.background.substring(color.background.indexOf(':') + 1);
        var colorId = (color.ColorId) ? color.ColorId : color.colorid;
        $("#dvIdSelectedFillColorOtherText").attr({
            'title': colorName,
            'alt': colorName,
            'displayname': colorName,
            'colorid': colorId,
            'style': "background-color:" + rgbHexaDecimal
        });
        if (Utility.getObjectlength(GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('fontColor'), 'otjs875') > 0) {
            GlobalInstance.uniformConfigurationInstance.setOtherTextInfo('fontColor', color);
            if (!this.defaultOtherTextFontColorSelected) {
                $("#dvIdColorNameOtherTextFont").html(colorName);
            }
            $("#ulColorComboBoxlistOtherTextFillColor li#colorid_" + colorId).attr("class", "active");
            $("#ulIdOtherTextPrimaryCustomColor li#colorid_" + colorId).attr("class", "active");
        } else {
            var defaultColorInfo = GlobalInstance.getColorInstance(null, null, null).getColorByKey('_' + CONFIG.get('DEFAULT_COLOR_ID'));
            $('#dvIdColorNameOtherTextFont').css('color', defaultColorInfo.RgbHexadecimal);
            $("#dvIdColorNameOtherTextFont").html(CONFIG.get("DEFAYLT_COLOR_TEXT"));
        }
        //  GlobalInstance.getUniformConfigurationInstance().setOtherTextInfo('fontColor', color);
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param (defaultFontColor) First FontColor 
 * 
 * @return Object Selected style
 */
OtherText.prototype.getSelectedFontColor = function(defaultFontColor) {
    var fontColor = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('fontColor');
    if (fontColor) {
        this.defaultOtherTextFontColorSelected = false;
        return fontColor;
    }
    return defaultFontColor;
}
/*
 * This method select the specific font Color and sets the same in Global 
 * @param (fontColor) object 
 * 
 * @return void
 */
OtherText.prototype.selectFontOutline1Color = function(color) {
    $('#dvIdColorBoxOtherTextOutlineFirst ul li').attr({
        'class': 'in-active'
    });

    $('#dvIdOtherTextOutlineFirstCustomColor ul li').attr({
        'class': 'in-active'
    });

    $("#dvIdColorNameOtherTextOutlineFirst").html("");

    if (color) {

        var colorName = (color.Name) ? color.Name : color.colorName;
        var rgbHexaDecimal = (color.RgbHexadecimal) ? color.RgbHexadecimal : color.background.substring(color.background.indexOf(':') + 1);
        var colorId = (color.ColorId) ? color.ColorId : color.colorid;
        if (colorId) {
            $("#dvIdSelectedFillColorOtherTextOutlineFirst").attr({
                'title': colorName,
                'alt': colorName,
                'colorid': colorId,
                'displayname': colorName,
                'style': "background-color:" + rgbHexaDecimal
            });
            $("#dvIdSelectedFillColorOtherTextOutlineFirst").removeClass("slashImage");
            $("#dvIdColorNameOtherTextOutlineFirst").html(colorName);
            $('#dvIdColorNameOtherTextOutlineFirst').css('color', '#000');
            $("#ulColorComboBoxlistOtherTextOutlineFirst li#colorid_" + color.ColorId).attr("class", "active");
            $("#ulIdOtherTextOutlineFirstCustomColor li#colorid_" + color.ColorId).attr("class", "active");
        } else {
            $("#dvIdSelectedFillColorOtherTextOutlineFirst").addClass("slashImage color_box_selected");
            $("#dvIdSelectedFillColorOtherTextOutlineFirst").attr({
                'style': ""
            });
            $("#dvIdColorNameOtherTextOutlineFirst").html("Optional");
            $('#dvIdColorNameOtherTextOutlineFirst').css('color', '#C3C3C3');
        }
        GlobalInstance.getUniformConfigurationInstance().setOtherTextInfo('fontOutline1Color', color);
    }
    else {
        $("#dvIdSelectedFillColorOtherTextOutlineFirst").addClass("slashImage color_box_selected");
        $("#dvIdSelectedFillColorOtherTextOutlineFirst").attr({
            'style': ""
        });
        $("#dvIdColorNameOtherTextOutlineFirst").html("Optional");
        $('#dvIdColorNameOtherTextOutlineFirst').css('color', '#C3C3C3');
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param (defaultFontColor) First FontColor 
 * 
 * @return Object Selected style
 */
OtherText.prototype.getSelectedFontOutline1Color = function(defaultOutline1Color) {
    var color = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('fontOutline1Color');
    if (color) {
        return color;
    }
    return defaultOutline1Color;
}
/*
 * This method select the specific font Color and sets the same in Global 
 * @param (fontColor) object 
 * 
 * @return void
 */
OtherText.prototype.selectFontOutline2Color = function(color) {
    $('#dvIdColorBoxOtherTextOutlineSecond ul li').attr({
        'class': 'in-active'
    });

    $('#dvIdOtherTextOutlineSecondCustomColor ul li').attr({
        'class': 'in-active'
    });

    $("#dvIdColorNameOtherTextOutlineSecond").html("");

    if (color) {
        var colorName = (color.Name) ? color.Name : color.colorName;
        var rgbHexaDecimal = (color.RgbHexadecimal) ? color.RgbHexadecimal : color.background.substring(color.background.indexOf(':') + 1);
        var colorId = (color.ColorId) ? color.ColorId : color.colorid;
        if (colorId) {
            $("#dvIdSelectedFillColorOtherTextOutlineSecond").attr({
                'title': colorName,
                'alt': colorName,
                'displayname': colorName,
                'style': "background-color:" + rgbHexaDecimal

            });
            $("#dvIdSelectedFillColorOtherTextOutlineSecond").removeClass("slashImage");
            $("#dvIdColorNameOtherTextOutlineSecond").html(colorName);
            $('#dvIdColorNameOtherTextOutlineSecond').css('color', '#000');
            $("#ulColorComboBoxlistOtherTextOutlineSecond li#colorid_" + colorId).attr("class", "active");
            $("#ulIdOtherTextOutlineSecondCustomColor li#colorid_" + colorId).attr("class", "active");
        } else {
            $("#dvIdSelectedFillColorOtherTextOutlineSecond").addClass("slashImage color_box_selected");
            $("#dvIdSelectedFillColorOtherTextOutlineSecond").attr({
                'style': ""
            });
            $("#dvIdColorNameOtherTextOutlineSecond").html("Optional");
            $('#dvIdColorNameOtherTextOutlineSecond').css('color', '#C3C3C3');
        }
        GlobalInstance.getUniformConfigurationInstance().setOtherTextInfo('fontOutline2Color', color);
    }
    else {
        $("#dvIdSelectedFillColorOtherTextOutlineSecond").addClass("slashImage color_box_selected");
        $("#dvIdSelectedFillColorOtherTextOutlineSecond").attr({
            'style': ""
        });
        $("#dvIdColorNameOtherTextOutlineSecond").html("Optional");
        $('#dvIdColorNameOtherTextOutlineSecond').css('color', '#C3C3C3');
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param (defaultFontColor) First FontColor 
 * 
 * @return Object Selected style
 */
OtherText.prototype.getSelectedFontOutline2Color = function(defaultOutline2Color) {
    var color = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('fontOutline2Color');
    if (color) {
        return color;
    }
    return defaultOutline2Color;
}
/**
 * Fetches the selected text from memory and sets the same 
 *  
 * @return Object Selected style
 */
OtherText.prototype.setDefaultText = function() {
    var text = GlobalInstance.uniformConfigurationInstance.getOtherTextInfo('text');
    if (text) {
        $('#inputExampleOtherText').val(text);
    }
}

/**
 * This method fetches Font Object for Team Name  
 * @returns text effect object for Team Name
 */
getTextEffectObjOtherText = function() {
    var objTextOrientation = GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('textOrientation');
    if (Utility.getObjectlength(objTextOrientation, 'otjs1016') > 0) {
        var textOrientation = objTextOrientation;
        var textEffectObj = textOrientation ? textOrientation.TextEffectCategorys[0].TextEffects[0] : null;
        return textEffectObj;
    } else {
        return null;
    }
};

/**
 * This method set the default uniform color  
 * @returns default color
 */
OtherText.prototype.setDefaultUniformColor = function() {
    var currentStyle = GlobalInstance.getUniformConfigurationInstance().getStylesInfo();
    var styleFabrics = GlobalInstance.getFabricInstance().getFabricByStyleId(currentStyle.StyleId);
    var fabricLength = Utility.getObjectlength(styleFabrics, 'otjs1032');
    var colorObject = GlobalInstance.getUniformConfigurationInstance().getColorsInfo();
    if (!(fabricLength > 1 && (GlobalInstance.getUniformConfigurationInstance().getFabricClicked() || GlobalInstance.getUniformConfigurationInstance().getCustomizeTabClicked()))
            && Utility.getObjectlength(colorObject.uniformSecondaryColor, 'otjs1034') < 1 && Utility.getObjectlength(colorObject.uniformTertiaryColor, 'otjs1035') < 1) {
        $('.uniformColorBoxSecondary').css('background', '#000000')
        $('.uniformColorBoxTertiary').css('background', '#000000')
    }
}

/*
*
*This method returns currently selected anchorpoint object of player number type
*
*/

OtherText.prototype.getCurrentSelectedAnchorPointtObject = function () {
    try {
        var thisObject = this;
        var savedAnchorPoints = GlobalInstance.getUniformConfigurationInstance().getAnchorPoints();
        var currentSelectedAnchorObject = GlobalInstance.getAnchorPointInstance().getSelectedAnchorObj();
        for (key in savedAnchorPoints) {
            var apData = savedAnchorPoints[key];
            if (apData.id == currentSelectedAnchorObject.id && apData.type == LOCATION_TYPE.get('secOtherTextAnchorPanel')) {
                thisObject.currentSelectedOtherTextAnchor = apData;
                break;
            }
        }
    } catch (e) {
        Log.trace('PlayerNumber.prototype.getCurrentSelectedAnchorPoinytObject  ------' + e.message);
    }
};

OtherText.prototype.getDefaultFontUrl = function () {

    var font = GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('font');
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

OtherText.prototype.selectFontInCombo = function () {
    var selectedFont = GlobalInstance.getUniformConfigurationInstance().getOtherTextInfo('font');
    if (selectedFont.fontid !== undefined) {
        $('#dvIdComboDropdownTeamName').scrollTop($('#dvTeamNameFontList_' + selectedFont.fontid).position().top);
        $('#dvTeamNameFontList_' + selectedFont.fontid).addClass('active');
    } else {
        $('#dvIdComboDropdownTeamName').scrollTop(true);
        $('#dvIdComboDropdownTeamName div:eq(0)').addClass('active');
    }
};