/**
 * 
 TWA proshpere configurator
 * 
 * teamname.js is used to define changes related team name screen. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/*
 * Constructor for TeamName class.
 * @return void
 */
function TeamName() {
    this.bindTeamNameScreenEvents();
    this.currentSelectedTeamNameAnchor = null;
    this.htmlSlashImg = '<div class="slashImage"> </div>';

    var text = GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('text') || '';
    if ((Utility.getObjectlength(GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('fontColor'), 'tnjs417') > 0) && (text !== '')) {
        this.defaultTeamNameFontColorSelected = false;
    }
    else {
        this.defaultTeamNameFontColorSelected = true;
    }
    this.defaultFont = null;
    this.fontStrokeColor1 = 'ffffff';
    this.fontStrokeColor2 = '666666';
    this.fontBaseImgWidth = "60";
    this.fontBaseImgHeight = "40";
    this.fontColor = '000000';
}

/*
 *This method shows TeamName screen and hide others.
 *@return void
 */
TeamName.prototype.show = function () {
    $("#secNumberAndTextHome").hide();
    $("#secPlayerName").hide();
    $("#secPlayerNumber").hide();
    $("#secOtherText").hide();
    $("#secTeamName").show();
    this.getCurrentSelectedAnchorPointtObject();
    this.selectFontColor(this.getSelectedFontColor(null));
    this.selectFontOutline1Color(this.getSelectedFontOutline1Color(null));
    this.selectFontOutline2Color(this.getSelectedFontOutline2Color(null));
    this.selectFont(this.getSelectedFont(this.defaultFont), this.getDefaultFontUrl());
    previewTeamName();
};

/*
 * This method hides the TeamName screen
 * @return void
 */
TeamName.prototype.hide = function () {
    $("#secTeamName").hide();
};


/*
 * This method initialize the Fonts and colors in this screen
 * @return void
 */
TeamName.prototype.init = function () {
    //Bind Color List
    GlobalInstance.colorInstance = GlobalInstance.getColorInstance(null, null, null);
    this.setHtmlAndBindColorTeamName(GlobalInstance.colorInstance.getColorList());
    GlobalInstance.fontInstance = GlobalInstance.getFontInstance();
    GlobalInstance.fontInstance.addCallback(this.setHtmlAndBindFontListForTeamName.bind(this));
    GlobalInstance.textEffectInstance = GlobalInstance.getTextEffectInstance();
    GlobalInstance.textEffectInstance.addCallback(this.bindTextEffectCtrl.bind(this));
    Utility.imitatePlaceHolderForIE();

};

/**
 * This method binds html and events for text Orientation Combo box 
 * @param {type} textEffectList
 * @return void
 */
TeamName.prototype.bindTextEffectCtrl = function (textEffectList) {
    this.bindTextEffectCtrlHTML(textEffectList);
    this.bindTextEffectCtrlEvents(textEffectList);

};
/**
 * This method binds html for text Orientation
 * @param {type} textEffectList
 * @return void
 */
TeamName.prototype.bindTextEffectCtrlHTML = function (textEffectList) {
    thisObj = this;
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
    var sBaseImgWidth = "60";
    var sBaseImgHeight = "17";
    var sText = "Sample";
    var selectedTextEffect = null;
    var selectedTextEffectImageURL = null;

    var textEffectURL = '';

    $.each(textEffectList, function (key, textEffect) {
        sFontName = font.Name;
        var textEffectName = textEffect ? textEffect.TextEffectCategorys[0].TextEffects[0].FileLocation : '';
        textEffectURL = LiquidPixels.generateTextEffectPreviewURL(
                textEffect.TextEffectCategorys[0].TextEffects[0] || null,
                textEffectName,
                sText,
                sFontName,
                font.Id,
                sFontColor,
                'ffffff',
                '666666',
                sBaseImgWidth,
                sBaseImgHeight
                );

        tempTextEffectHtml += '<div style="vertical-align:middle; text-align:center" parentId="dvIdComboBoxTextEffectTeamName" id= "teamName_' + textEffect.TextEffectTypeId + '" class="comboDropdownListText" value="' + textEffect.Name + '" displayname="' + textEffect.Name + '"> <div class="fl">' + textEffect.Name + '</div><div class="fr" parentId="dvIdComboBoxTextEffectTeamName"> <img src="' + textEffectURL + '"/></div></div>';
        //When no exiting save values 
        if (selectedTextEffect == null || selectedTextEffect == undefined) {
            selectedTextEffect = textEffect;
            selectedTextEffectImageURL = textEffectURL;
        }
        //When exiting saved values are present in Global parameters and are being fetched via retrieval code 
        if (selectedTextEffect != null && selectedTextEffect != undefined && selectedTextEffect.TextEffectTypeId == textEffect.TextEffectTypeId) {
            selectedTextEffect = textEffect;
            selectedTextEffectImageURL = textEffectURL;
        }
    });
    $('#dvIdComboBoxTextEffectTeamNameList').html(tempTextEffectHtml);
    this.selectTextEffect(selectedTextEffect, selectedTextEffectImageURL);
};

/**
 * This method binds events for text Orientation
 * @param  textEffectList List of TextEffects
 * @returns void
 */
TeamName.prototype.bindTextEffectCtrlEvents = function (textEffectList) {
    $('#dvIdComboBoxTextEffectTeamName').on("click", function () {
        $('#dvIdComboBoxTextEffectTeamNameList').toggle();
        var selectedFont = GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('font');
        // var selectedTextEffect = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('textOrientation');
        //if(!selectedTextEffect.TextEffectTypeId)
        //  {
        $('#dvIdComboBoxTextEffectTeamNameList').scrollTop($('#teamName_' + selectedFont.fontid).position().top);

        var selectedTextEffect = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('textOrientation');
        if (selectedTextEffect != null || selectedTextEffect != undefined)
            //     }{
        {
            $('#dvIdComboBoxTextEffectTeamNameList').scrollTop($('#teamName_' + selectedTextEffect.TextEffectTypeId).position().top);
        }

    });
    $(document).off('click', '#dvIdComboBoxTextEffectTeamNameList div.comboDropdownListText');
    $(document).on('click', '#dvIdComboBoxTextEffectTeamNameList div', function () {
        var thisElement = $(this);
        if (thisElement.attr('class') == 'fl' || thisElement.attr('class') == 'fr') {
            thisElement = $(this).parent();
        }
        $('#dvIdComboBoxTextEffectTeamName').html('<div parentId="dvIdComboBoxTextEffectTeamName">' + thisElement.html() + '</div>');
        $('#dvIdComboBoxTextEffectTeamName').attr("value", thisElement.attr('displayname'));
        $('#dvIdComboBoxTextEffectTeamNameList').hide();
        $('#dvIdComboBoxTextEffectTeamNameList div.comboDropdownListText').removeClass('active');
        thisElement.addClass('active');
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var textEffectObject = GlobalInstance.textEffectInstance.getTextEffectByKey("_" + thisElement.attr('id').split("_")[1]);

        GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('textOrientation', textEffectObject);
        
        previewTeamName();
    });
};

/*
 * This function binds the screen events.
 * @return void
 */
TeamName.prototype.bindTeamNameScreenEvents = function () {
    var thisObject = this;
    $('#btnOtherTextTeamName ,#btnPlayerNumberTeamName ,#btnPlayerNameTeamName').off('click');
    $(document).on('click', "#btnPlayerNumberTeamName", function () {
        GlobalInstance.getTeamNameInstance().hide();
        GlobalInstance.getOtherTextInstance().hide();
        GlobalInstance.getPlayerNameInstance().hide();
        GlobalInstance.getPlayerNumberInstance().show();
    });
    $(document).on('click', "#btnPlayerNameTeamName", function () {
        GlobalInstance.getPlayerNumberInstance().hide();
        GlobalInstance.getOtherTextInstance().hide();
        GlobalInstance.getTeamNameInstance().hide();
        GlobalInstance.getPlayerNameInstance().show();
    });
    $(document).on('click', "#btnOtherTextTeamName", function () {
        GlobalInstance.getPlayerNumberInstance().hide();
        GlobalInstance.getPlayerNameInstance().hide();
        GlobalInstance.getTeamNameInstance().hide();
        GlobalInstance.getOtherTextInstance().show();
    });

    this.setDefaultText();
    $('#inputExampleTeamName').bind('keypress', function (event) {
        var thisElement = $(this);
        var sText = thisElement.val();
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (sText.length > 15 && (regex.test(key)) && thisElement[0].selectionStart == thisElement[0].selectionEnd) {
            event.preventDefault();
            return false;
        }
    });
    $("#inputExampleTeamName").keyup(function () {
        //preview Image based on the values selected in Font and Colors or the global variables        
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('text', $('#inputExampleTeamName').val());
        previewTeamName();

    });

    //Font Combo Box Event Binding 
    $(document).off('click', '#dvIdComboFontTeamName');
    $(document).on('click', '#dvIdComboFontTeamName', function () {
        if ($('#dvIdComboDropdownTeamName').is(':visible')) {
            $('#dvIdComboDropdownTeamName').hide();
        } else {
            $('#dvIdComboDropdownTeamName').show();
            thisObject.selectFontInCombo();
        }
    });
    $(document).on('click', '#dvIdComboDropdownTeamName div img ,#dvIdComboDropdownTeamName div', function () {
        var fontObject = new Object();
        var thisElement = $(this);
        fontObject.src = $(this).first().children().attr('src');
        if (!thisElement.first().attr('displayname')) {
            fontObject.displayname = thisElement.parent().attr('displayname');
        }
        if (!fontObject.src) {
            fontObject.src = thisElement.attr('src');
        }
        if (!thisElement.first().attr('value')) {
            fontObject.IPSID = thisElement.parent().attr('value');
        }
        if (!thisElement.first().attr('fontid')) {
            fontObject.fontId = thisElement.parent().attr('fontid');
        }
        if (!thisElement.first().attr('fileloc')) {
            fontObject.fileloc = thisElement.parent().attr('fileloc');
        }

        var displayName = thisElement.first().attr('displayname') || fontObject.displayname;
        var fileLoc = thisElement.first().attr('fileloc') || fontObject.fileloc;
        
        thisElement.first().attr({
            'displayname': displayName,
            'IPSID': thisElement.first().attr('value') || fontObject.IPSID,
            'fileloc': fileLoc
        });
        $('.comboDropdownFontListText').removeClass('active');
        thisElement.addClass('active');

        $('#dvIdComboFontTeamName').html("<img src='" + fontObject.src + "' />");
        $('#dvIdComboFontTeamName').attr('fileloc', thisElement.first().attr('fileloc'));
        $('#dvIdComboDropdownTeamName').hide();

        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('font', {
            'name': displayName,
            'displayname': displayName,
            'IPSID': thisElement.first().attr('value') || fontObject.IPSID,
            'fontid': thisElement.first().attr('fontid') || fontObject.fontId,
            'fileloc': thisElement.first().attr('fileloc') || fileLoc
        });
        GlobalInstance.fontSelectionInstance = GlobalInstance.getFontSelectionInstance();
        GlobalInstance.fontSelectionInstance.setModifiedFont(GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('font'));
        previewTeamName();
    });
};
/**
 * This method binds the font list to the Font Combo in Player Number screen
 * @returns void
 */
TeamName.prototype.setHtmlAndBindFontListForTeamName = function () {
    GlobalInstance.fontInstance = GlobalInstance.getFontInstance();
    var fontList = GlobalInstance.fontInstance.getFontList();
    var thisObject = this;
    
    var tempFontHtml = '';
    this.defaultFont = null;
    var defaultUrl = ''
    var count = 0;
    
    var textdecalObj = null;
    $.each(fontList, function (key, font) {
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
        tempFontHtml += '<div class="comboDropdownFontListText" id="dvTeamNameFontList_' + font.FontId + '" value="' + font.Name + '"  fileloc="' + font.FileLocation + '" displayname="' + font.Name + '" fontid="' + font.FontId + '">  <img src="' + newURLLP + '"/></div>';
    });

    $('#dvIdComboDropdownTeamName').html(tempFontHtml);
    this.selectFont(this.getSelectedFont(this.defaultFont), defaultUrl);

};

/**
 * This method binds the color list to the Fill Color Combo.
 * @param  colorList List of colors
 * @returns void
 */
TeamName.prototype.setHtmlAndBindColorTeamName = function (colorList) {
    var tempColorsListHtml = '';
    var tempCustomColorsListHtml = '';
    var tempColorsListUnselectHtml = '';
    tempColorsListUnselectHtml += '<li id= "colorid_0" colorid="0" style="cursor:pointer; background-color:; background-image:url(\'images/slash.png\');"><a id="0" \n\
                            data-name="" \n\
                            data-matchButtonColorID="" colorid="0" \n\
                            data-cmykValue="" \n\
                            data-rgbValue="" \n\
                            rgbHexadecimal="" \n\
                            alt="Optional" \n\
                            class="colorItems in-active" \n\
                            style="background-color1:"></a></li>';
    var defaultFontColor = null;
    $.each(colorList, function (i, color) {
        if (defaultFontColor == null) {
            defaultFontColor = color;
        }
        if (color.CustomerId != null && color.CustomerId != '' && color.CustomerId != undefined) {
            tempCustomColorsListHtml += '<li  TaaColorId="' + color.TaaColorId + '" id="colorid_' + color.ColorId + '" colorid="' + color.ColorId + '" style="cursor:pointer; background-color:' + color.RgbHexadecimal + '" class="colorItems" alt="' + color.Name + '"  title="' + color.Name + '"><a id=' + color.ColorId + ' \n\
                            data-name="' + color.name + '" \n\
                            data-matchButtonColorID="' + color.MatchingButtonColorId + '" \n\
                            data-cmykValue="' + color.Cyan + ',' + color.Magenta + ',' + color.Yellow + ',' + color.Black + '" \n\
                            data-rgbValue="' + color.Red + ',' + color.Green + ',' + color.Blue + '" \n\
                            colorid="' + color.ColorId + '" \n\\n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            rgbHexadecimal="' + color.RgbHexadecimal + '" \n\
                            alt="' + color.Name + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        } else {
            tempColorsListHtml += '<li  TaaColorId="' + color.TaaColorId + '" id="colorid_' + color.ColorId + '" colorid="' + color.ColorId + '" style="cursor:pointer; background-color:' + color.RgbHexadecimal + '" class="colorItems" alt="' + color.Name + '"  title="' + color.Name + '"><a id=' + color.ColorId + ' \n\
                            data-name="' + color.name + '" \n\
                            data-matchButtonColorID="' + color.MatchingButtonColorId + '" \n\
                            data-cmykValue="' + color.Cyan + ',' + color.Magenta + ',' + color.Yellow + ',' + color.Black + '" \n\
                            data-rgbValue="' + color.Red + ',' + color.Green + ',' + color.Blue + '" \n\
                            colorid="' + color.ColorId + '" \n\\n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            rgbHexadecimal="' + color.RgbHexadecimal + '" \n\
                            alt="' + color.Name + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        }
    });
    $('#ulColorComboBoxlistTeamNameFillColor').html(tempColorsListHtml);
    $('#ulColorComboBoxlistTeamNameOutlineFirst').html(tempColorsListUnselectHtml + tempColorsListHtml);
    $('#ulColorComboBoxlistTeamNameOutlineSecond').html(tempColorsListUnselectHtml + tempColorsListHtml);

    //Custom Color Case
    var customerId = GlobalInstance.uniformConfigurationInstance.getAccountNumber();
    if (customerId !== 0 && customerId !== undefined) {
        $('#ulIdTeamNamePrimaryCustomColor').html(tempCustomColorsListHtml);
        $('#ulIdTeamNameOutlineFirstCustomColor').html(tempCustomColorsListHtml);
        $('#ulIdTeamNameOutlineSecondCustomColor').html(tempCustomColorsListHtml);
    }

    this.selectFontColor(this.getSelectedFontColor(defaultFontColor));
    this.selectFontOutline1Color(this.getSelectedFontOutline1Color(null));
    this.selectFontOutline2Color(this.getSelectedFontOutline2Color(null));

    //Color Combo Box Event Binding for Font Color
    $(document).off('click', '#dvIdFillColorTeamName');
    $(document).on('click', '#dvIdFillColorTeamName', function () {
        $("#dvIdColorBoxTeamName").css({ left: '', top: '' });
        $('#dvIdColorBoxTeamNameOutlineSecond').hide();
        $('#dvIdColorBoxTeamNameOutlineFirst').hide();

        if ($('#dvIdColorBoxTeamName').is(':visible')) {
            $('#dvIdColorBoxTeamName').hide();
        } else {
            // thisObject.setDefaultUniformColor();
            $('#dvIdColorBoxTeamName').show();
        }
        return false;
    });
    $('#dvIdColorBoxTeamName').draggable({
        containment: '#dvConfiguratorPanel'
    });
    var thisObject = this;
    $(document).off('click', '#dvIdColorBoxTeamName > .numberandTextColorBoxScrolling ul li, #dvTeamNamePrimaryCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxTeamName > .numberandTextColorBoxScrolling ul li, #dvTeamNamePrimaryCustomColor ul li', function () {
        $("#dvIdColorBoxTeamName").css({ left: '', top: '' });
        var clickedLi = $(this).children();
        //Frist reset all 
        $('#dvIdColorBoxTeamName ul li').attr({
            'class': 'in-active'
        });
        $('#dvTeamNamePrimaryCustomColor ul li').attr({
            'class': 'in-active'
        });

        $(this).attr({
            'class': 'active'
        });
        if (clickedLi.first().attr('colorid') != 0) {
            $('#dvIdSelectedFillColorTeamName').attr({
                'title': clickedLi.first().attr('alt'),
                'alt': clickedLi.first().attr('alt'),
                'style': clickedLi.first().attr('style')
            });
            $('#dvIdColorNameTeamNameFont').html(clickedLi.first().attr('alt'));
            $('#dvIdColorBoxTeamName').hide();
            thisObject.defaultTeamNameFontColorSelected = false;
            var selectedColor = GlobalInstance.colorInstance.getColorByKey('_' + clickedLi.first().attr('colorid'));
            GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
            GlobalInstance.colorRetainInstance.setModifiedColors(true, false, false, selectedColor);// Update the primary color in the application that has primary color support
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontColor', GlobalInstance.colorInstance.getColorByKey("_" + clickedLi.first().attr('colorid'))
                    );
            previewTeamName();
        }
    });


    //First Outline Color Combo Box Binding

    $(document).off('click', '#dvIdTeamNameOutlineFirst');
    $(document).on('click', '#dvIdTeamNameOutlineFirst', function () {
        $("#dvIdColorBoxTeamNameOutlineFirst").css({ left: '', top: '' });
        $('#dvIdColorBoxTeamName').hide();
        $('#dvIdColorBoxTeamNameOutlineSecond').hide();
        if ($('#dvIdColorBoxTeamNameOutlineFirst').is(':visible')) {
            $('#dvIdColorBoxTeamNameOutlineFirst').hide();
        } else {
            thisObject.setDefaultUniformColor();
            $('#dvIdColorBoxTeamNameOutlineFirst').show();
        }
        return false;
    });
    $('#dvIdColorBoxTeamNameOutlineFirst').draggable({
        containment: '#dvConfiguratorPanel'
    });

    $(document).off('click', '#dvIdColorBoxTeamNameOutlineFirst > .numberandTextColorBoxScrolling ul li, #dvIdTeamNameOutlineFirstCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxTeamNameOutlineFirst > .numberandTextColorBoxScrolling ul li, #dvIdTeamNameOutlineFirstCustomColor ul li', function (e) {
        if (e.target.id == "colorid_0") {
            $("#dvIdSelectedFillColorTeamNameOutlineFirst").addClass("slashImage color_box_selected");
        }

        $("#dvIdColorBoxTeamNameOutlineFirst").css({ left: '', top: '' });
        var clickedLi = $(this).children();
        $('#dvIdColorBoxTeamNameOutlineFirst ul li').attr({
            'class': 'in-active'
        });

        $('#dvIdTeamNameOutlineFirstCustomColor ul li').attr({
            'class': 'in-active'
        });

        $(this).attr({
            'class': 'active'
        });
        if (clickedLi.first().attr('colorid') != 0) {
            $("#dvIdSelectedFillColorTeamNameOutlineFirst").removeClass("slashImage");
        }
        $('#dvIdSelectedFillColorTeamNameOutlineFirst').attr({
            'title': clickedLi.first().attr('alt'),
            'alt': clickedLi.first().attr('alt'),
            'colorid': clickedLi.first().attr('colorid'),
            'style': clickedLi.first().attr('style')
        });
        $('#dvIdColorNameTeamNameOutlineFirst').html(clickedLi.first().attr('alt'));
        $('#dvIdColorBoxTeamNameOutlineFirst').hide();
        if (clickedLi.first().attr('colorid') == "0") {
            $('#dvIdColorNameTeamNameOutlineFirst').css('color', '#C3C3C3');
        } else {
            $('#dvIdColorNameTeamNameOutlineFirst').css('color', '#000');
        }
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var selectedColorObject = GlobalInstance.colorInstance.getColorByKey("_" + clickedLi.first().attr('colorid'));
        if (!selectedColorObject) {
            selectedColorObject = null;
        }
        GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
        GlobalInstance.colorRetainInstance.setModifiedColors(false, true, false, selectedColorObject);// Update the secondary color in the application that has secondary color support
        GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontOutline1Color', selectedColorObject);

        previewTeamName();

    });

    //Second Outline Color Combo Box Binding
    $(document).off('click', '#dvIdTeamNameOutlineSecond');
    $(document).on('click', '#dvIdTeamNameOutlineSecond', function () {
        $("#dvIdColorBoxTeamNameOutlineSecond").css({ left: '', top: '' });
        $('.labelOutlineOptionalSecond').css('color', '#000');
        if ($('#dvIdColorBoxTeamNameOutlineSecond').is(':visible')) {
            $('#dvIdColorBoxTeamNameOutlineSecond').hide();
        } else {
            thisObject.setDefaultUniformColor();
            $('#dvIdColorBoxTeamNameOutlineSecond').show();
        }
        return false;
    });
    $('#dvIdColorBoxTeamNameOutlineSecond').draggable({
        containment: '#dvConfiguratorPanel'
    });

    $(document).off('click', '#dvIdColorBoxTeamNameOutlineSecond > .numberandTextColorBoxScrolling ul li, #dvIdTeamNameOutlineSecondCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxTeamNameOutlineSecond > .numberandTextColorBoxScrolling ul li,#dvIdTeamNameOutlineSecondCustomColor ul li', function (e) {

        if (e.target.id == "colorid_0") {
            $("#dvIdSelectedFillColorTeamNameOutlineSecond").addClass("slashImage color_box_selected");
        }

        $("#dvIdColorBoxTeamNameOutlineSecond").css({ left: '', top: '' });
        $('#dvIdColorNameTeamNameOutlineSecond').css('color', '#000');
        var clickedLi = $(this).children();
        $('#dvIdColorBoxTeamNameOutlineSecond').hide();
        $('#dvIdColorBoxTeamNameOutlineSecond ul li').attr({
            'class': 'in-active'
        });

        $('#dvIdTeamNameOutlineSecondCustomColor ul li').attr({
            'class': 'in-active'
        });

        $(this).attr({
            'class': 'active'
        });
        if (clickedLi.first().attr('colorid') != 0) {
            $("#dvIdSelectedFillColorTeamNameOutlineSecond").removeClass("slashImage");
        }
        $('#dvIdSelectedFillColorTeamNameOutlineSecond').attr({
            'title': clickedLi.first().attr('alt'),
            'alt': clickedLi.first().attr('alt'),
            'colorid': clickedLi.first().attr('colorid'),
            'style': clickedLi.first().attr('style')
        });
        if (clickedLi.first().attr('colorid') == "0") {
            $('#dvIdColorNameTeamNameOutlineSecond').css('color', '#C3C3C3');
        } else {
            $('#dvIdColorNameTeamNameOutlineSecond').css('color', '#000');
        }
        $('#dvIdColorNameTeamNameOutlineSecond').html(clickedLi.first().attr('alt'));
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var selectedColorObject = GlobalInstance.colorInstance.getColorByKey("_" + clickedLi.first().attr('colorid'));
        if (!selectedColorObject) {
            selectedColorObject = null;
        }
        GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
        GlobalInstance.colorRetainInstance.setModifiedColors(false, false, true, selectedColorObject);// Update the accent color in the application that has accent color support
        GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontOutline2Color', selectedColorObject);

        previewTeamName();
    });
    previewTeamName();
};

/**
 * Performs a fetching Preview Text.  
 * Updates Preview on Other Text String
 * @return void
 */
previewTeamName = function () {
    try {
        var objTextEffect = getTextEffectObjTeamName();
        var sTextEffect = objTextEffect && objTextEffect.FileLocation ? objTextEffect.FileLocation : "";
        var teamInfo = GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo();
        var sText = teamInfo['text'] || "";
        var fontObj = teamInfo['font'];
        var sFontName = '';
        if (fontObj !== undefined) {
            sFontName = fontObj.fileloc.substring(fontObj.fileloc.indexOf('/') + 1);
        }
        var sFont = getFontTeamName();
        var oColor1 = getColorTeamName();
        var oColor2 = getOutline1ColorTeamName();
        var oColor3 = getOutline2ColorTeamName();

        if (!oColor1) {
            oColor1 = GlobalInstance.colorInstance.getColorByKey('_' + $('#dvIdColorBoxPlayerNumber ul>:first-child').first().attr('colorid'))
        }
        ;
        var primaryColorHexCode = (oColor1.rgbHexadecimal) ? oColor1.rgbHexadecimal : oColor1.RgbHexadecimal;
        if (!primaryColorHexCode) {
            primaryColorHexCode = oColor1.background.substring(oColor1.background.indexOf(':') + 1);
        }
        if (sFont != "" && oColor1 != undefined && (primaryColorHexCode) != undefined) {
            if (sText != "") {

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
                var sBaseImgWidth = "360";
                var sBaseImgHeight = "100";
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
                image.onload = function () {
                    $('#imgPreviewTextIdTeamName').css('visibility', 'visible');
                    $('#imgPreviewTextIdTeamName').attr('src', image.src);
                    $.doneProcess();
                };
                image.onerror = function () {
                    $.doneProcess();
                };
                image.src = newURL;


            } else {
                $('#imgPreviewTextIdTeamName').attr("src", "");
                $('#imgPreviewTextIdTeamName').css('visibility', 'hidden');
            }
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "previewTeamName Error description: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};


/**
 * Fetches Font Color  Object  for Team Name  
 * @returns color object for team name
 */
getColorTeamName = function () {

    return GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('fontColor');

};
/**
 *Fetches Outline 1 Color  Object Name for Team Name  
 * @returns first outline color 
 */
getOutline1ColorTeamName = function () {
    return GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('fontOutline1Color');
};


/* 
 * Outline 2 Color  Object Name for Team Name  
 * @return second outline color object in team name
 */
getOutline2ColorTeamName = function () {
    return GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('fontOutline2Color');
};
/*
 * This method fetches Font Name for Team Name  
 * @return  font object in team name 
 */
getFontTeamName = function () {
    if (GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('font') == undefined) {
        return null;
    }
    else {
        return GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('font').displayname;
    }
};

/*
 * This method fetches Font Object for Team Name  
 * @return font object in team name
 */
getFontObjTeamName = function () {
    return GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('font');
};

/*
 * This method fetches Text Effect  for Team Name  
 * @return text effect object in team name 
 */
getTextEffectTeamName = function () {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    return GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('textOrientation').Name;
};


/*
 * This method fetches Text for Team Name
 * @return text for team name
 */
getTextTeamName = function () {
    return GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('text');
};

/*
 * This method select the specific font as per font Id and sets the same in Global 
 * @param (font) object 
 * 
 * @return void
 */
TeamName.prototype.selectFont = function (font, fontUrl) {
    if (font) {
        $("#dvIdComboFontTeamName").attr({
            'fileloc': font.fileloc || font.FileLocation
        });

        $("#dvIdComboFontTeamName").html("<img src='" + fontUrl + "' />");


        GlobalInstance.getUniformConfigurationInstance().setTeamNameInfo('font', {
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
TeamName.prototype.getSelectedFont = function (defaultFont) {
    var font = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('font');
    if (font) {
        return font;
    }
    return defaultFont;
}

/*
 * This method select the specific text Effect as per text Effect Id and sets the same in Global 
 * @param textEffect,textEffectURL
 * 
 * @return void
 */

TeamName.prototype.selectTextEffect = function (textEffect, textEffectURL) {
    if (textEffect != undefined) {
        $("#dvIdComboBoxTextEffectTeamName").attr({
            'TextEfffectId': textEffect.TextEffectTypeId || textEffect.TextEffectTypeId
        });
        $("#dvIdComboBoxTextEffectTeamName").html('<div class="fl" style="line-height:2;" parentId="dvIdComboBoxTextEffectTeamName">' + textEffect.Name + '</div><div class="fr" parentId="dvIdComboBoxTextEffectTeamName"> <img src="' + textEffectURL + '"/></div>');
        GlobalInstance.getUniformConfigurationInstance().setTeamNameInfo('textOrientation', textEffect);
        $("#teamName_" + textEffect.TextEffectTypeId).addClass('active');
    }
};

/*
 * This method select the specific font Color and sets the same in Global 
 * @param fontColor object 
 * 
 * @return void
 */
TeamName.prototype.selectFontColor = function (color) {
    $('#dvIdColorBoxTeamName ul li').attr({
        'class': 'in-active'
    });
    $('#dvTeamNamePrimaryCustomColor ul li').attr({
        'class': 'in-active'
    });
    if (color) {
        var colorName = (color.Name) ? color.Name : color.colorName;
        var rgbHexaDecimal = (color.RgbHexadecimal) ? color.RgbHexadecimal : color.background.substring(color.background.indexOf(':') + 1);
        var colorId = (color.ColorId) ? color.ColorId : color.colorid;
        $("#dvIdSelectedFillColorTeamName").attr({
            'title': colorName,
            'alt': colorName,
            'displayname': colorName,
            'style': "background-color:" + rgbHexaDecimal
        });

        if (Utility.getObjectlength(GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('fontColor'), 'tnjs868') > 0) {
            GlobalInstance.uniformConfigurationInstance.setTeamNameInfo('fontColor', color);
            if (!this.defaultTeamNameFontColorSelected) {
                $("#dvIdColorNameTeamNameFont").html(colorName);
            }
            $("#ulColorComboBoxlistTeamNameFillColor li#colorid_" + colorId).attr("class", "active");
            $("#ulIdTeamNamePrimaryCustomColor li#colorid_" + colorId).attr("class", "active");
        } else {
            var defaultColorInfo = GlobalInstance.getColorInstance().getColorByKey('_' + CONFIG.get('DEFAULT_COLOR_ID'));
            $('#dvIdColorNameTeamNameFont').css('color', defaultColorInfo.RgbHexadecimal);
            $("#dvIdColorNameTeamNameFont").html(CONFIG.get("DEFAYLT_COLOR_TEXT"));
        }
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param defaultFontColor First FontColor 
 * 
 * @return Object Selected style
 */
TeamName.prototype.getSelectedFontColor = function (defaultFontColor) {
    var fontColor = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('fontColor');
    if (fontColor) {
        this.defaultTeamNameFontColorSelected = false;
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
TeamName.prototype.selectFontOutline1Color = function (color) {
    $('#dvIdColorBoxTeamNameOutlineFirst ul li').attr({
        'class': 'in-active'
    });

    $('#dvIdTeamNameOutlineFirstCustomColor ul li').attr({
        'class': 'in-active'
    });

    $("#dvIdColorNameTeamNameOutlineFirst").html("");
    if (color) {
        var colorName = (color.Name) ? color.Name : color.colorName;
        var rgbHexaDecimal = (color.RgbHexadecimal) ? color.RgbHexadecimal : color.background.substring(color.background.indexOf(':') + 1);
        var colorId = (color.ColorId) ? color.ColorId : color.colorid;
        if (colorId) {
            $("#dvIdSelectedFillColorTeamNameOutlineFirst").attr({
                'title': colorName,
                'alt': colorName,
                'displayname': colorName,
                'style': "background-color:" + rgbHexaDecimal
            });
            $("#dvIdSelectedFillColorTeamNameOutlineFirst").removeClass("slashImage");
            $("#dvIdColorNameTeamNameOutlineFirst").html(colorName);
            $('#dvIdColorNameTeamNameOutlineFirst').css('color', '#000');
            $("#ulColorComboBoxlistTeamNameOutlineFirst li#colorid_" + colorId).attr("class", "active");
            $("#ulIdTeamNameOutlineFirstCustomColor li#colorid_" + colorId).attr("class", "active");
        } else {
            $("#dvIdSelectedFillColorTeamNameOutlineFirst").addClass("slashImage color_box_selected");
            $("#dvIdSelectedFillColorTeamNameOutlineFirst").attr({ 'style': "" });
            $("#dvIdColorNameTeamNameOutlineFirst").html("Optional");
            $('#dvIdColorNameTeamNameOutlineFirst').css('color', '#C3C3C3');
        }
        GlobalInstance.getUniformConfigurationInstance().setTeamNameInfo('fontOutline1Color', color);
    }
    else {
        $("#dvIdSelectedFillColorTeamNameOutlineFirst").addClass("slashImage color_box_selected");
        $("#dvIdSelectedFillColorTeamNameOutlineFirst").attr({ 'style': "" });
        $("#dvIdColorNameTeamNameOutlineFirst").html("Optional");
        $('#dvIdColorNameTeamNameOutlineFirst').css('color', '#C3C3C3');
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param defaultOutline1Color First default outline color 
 * 
 * @return Object Selected style
 */
TeamName.prototype.getSelectedFontOutline1Color = function (defaultOutline1Color) {
    var color = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('fontOutline1Color');
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
TeamName.prototype.selectFontOutline2Color = function (color) {
    $('#dvIdColorBoxTeamNameOutlineSecond ul li').attr({
        'class': 'in-active'
    });

    $('#dvIdTeamNameOutlineSecondCustomColor ul li').attr({
        'class': 'in-active'
    });

    $("#dvIdColorNameTeamNameOutlineSecond").html("");
    if (color) {
        var colorName = (color.Name) ? color.Name : color.colorName;
        var rgbHexaDecimal = (color.RgbHexadecimal) ? color.RgbHexadecimal : color.background.substring(color.background.indexOf(':') + 1);
        var colorId = (color.ColorId) ? color.ColorId : color.colorid;
        if (colorId) {
            $("#dvIdSelectedFillColorTeamNameOutlineSecond").attr({
                'title': colorName,
                'alt': colorName,
                'displayname': colorName,
                'style': "background-color:" + rgbHexaDecimal
            });
            $("#dvIdSelectedFillColorTeamNameOutlineSecond").removeClass("slashImage");
            $("#dvIdColorNameTeamNameOutlineSecond").html(colorName);
            $('#dvIdColorNameTeamNameOutlineSecond').css('color', '#000');
            $("#ulColorComboBoxlistTeamNameOutlineSecond li#colorid_" + colorId).attr("class", "active");
            $("#ulIdTeamNameOutlineSecondCustomColor li#colorid_" + colorId).attr("class", "active");
        } else {
            $("#dvIdSelectedFillColorTeamNameOutlineSecond").addClass("slashImage color_box_selected");
            $("#dvIdSelectedFillColorTeamNameOutlineSecond").attr({ 'style': "" });
            $('#dvIdColorNameTeamNameOutlineSecond').css('color', '#C3C3C3');
            $("#dvIdColorNameTeamNameOutlineSecond").html("Optional");
        }
        GlobalInstance.getUniformConfigurationInstance().setTeamNameInfo('fontOutline2Color', color);
    }
    else {
        $("#dvIdSelectedFillColorTeamNameOutlineSecond").addClass("slashImage color_box_selected");
        $("#dvIdSelectedFillColorTeamNameOutlineSecond").attr({ 'style': "" });
        $("#dvIdColorNameTeamNameOutlineSecond").html("Optional");
        $('#dvIdColorNameTeamNameOutlineSecond').css('color', '#C3C3C3');
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param defaultOutline2Color First default second outlineColor 
 * 
 * @return Object Selected style
 */
TeamName.prototype.getSelectedFontOutline2Color = function (defaultOutline2Color) {
    var color = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('fontOutline2Color');
    if (color) {
        return color;
    }
    return defaultOutline2Color;
}

/**
 * Fetches the selected text from memory and sets the same 
 * @param 
 * 
 * @return Object Selected style
 */
TeamName.prototype.setDefaultText = function () {
    var text = GlobalInstance.uniformConfigurationInstance.getTeamNameInfo('text');
    if (text) {
        $('#inputExampleTeamName').val(text);
    }

}
/**
 * This method fetches Font Object for Team Name  
 * @returns text effect object for Team Name
 */

getTextEffectObjTeamName = function () {
    var objTextOrientation = GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('textOrientation');
    if (Utility.getObjectlength(objTextOrientation, 'tnjs1003') > 0) {
        var textOrientation = objTextOrientation;
        var textEffectObj = textOrientation ? textOrientation.TextEffectCategorys[0].TextEffects[0] : null;
        return textEffectObj;
    } else {
        return null;
    }

};

/**
 * This method sets the Default Uniform color
 * @returns {void}
 */
TeamName.prototype.setDefaultUniformColor = function () {
    var currentStyle = GlobalInstance.getUniformConfigurationInstance().getStylesInfo();
    var styleFabrics = GlobalInstance.getFabricInstance().getFabricByStyleId(currentStyle.StyleId);
    var fabricLength = Utility.getObjectlength(styleFabrics, 'tnjs1020');
    var colorObject = GlobalInstance.getUniformConfigurationInstance().getColorsInfo();
    if (!(fabricLength > 1 && (GlobalInstance.getUniformConfigurationInstance().getFabricClicked() || GlobalInstance.getUniformConfigurationInstance().getCustomizeTabClicked()))
            && Utility.getObjectlength(colorObject.uniformSecondaryColor, 'tnjs1023') < 1 && Utility.getObjectlength(colorObject.uniformTertiaryColor, 'tnjs1023') < 1) {
        $('.uniformColorBoxSecondary').css('background', '#000000')
        $('.uniformColorBoxTertiary').css('background', '#000000')
    }
}


/*
*
*This method returns currently selected anchorpoint object of player number type
*
*/

TeamName.prototype.getCurrentSelectedAnchorPointtObject = function () {
    try {
        var thisObject = this;
        var savedAnchorPoints = GlobalInstance.getUniformConfigurationInstance().getAnchorPoints();
        var currentSelectedAnchorObject = GlobalInstance.getAnchorPointInstance().getSelectedAnchorObj();
        for (key in savedAnchorPoints) {
            var apData = savedAnchorPoints[key];
            if (apData.id == currentSelectedAnchorObject.id && apData.type == LOCATION_TYPE.get('secTeamNameAnchorPanel')) {
                thisObject.currentSelectedTeamNameAnchor = apData;
                break;
            }
        }
    } catch (e) {
        Log.trace('PlayerNumber.prototype.getCurrentSelectedAnchorPoinytObject  ------' + e.message);
    }
};

TeamName.prototype.getDefaultFontUrl = function () {

    var font = GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('font');
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

TeamName.prototype.selectFontInCombo = function () {
    var selectedFont = GlobalInstance.getUniformConfigurationInstance().getTeamNameInfo('font');
    if (selectedFont.fontid !== undefined) {
        $('#dvIdComboDropdownTeamName').scrollTop($('#dvTeamNameFontList_' + selectedFont.fontid).position().top);
        $('#dvTeamNameFontList_' + selectedFont.fontid).addClass('active');
    } else {
        $('#dvIdComboDropdownTeamName').scrollTop(true);
        $('#dvIdComboDropdownTeamName div:eq(0)').addClass('active');
    }
};