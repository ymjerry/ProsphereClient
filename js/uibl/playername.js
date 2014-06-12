/**
 * 
 TWA proshpere configurator
 * 
 * playername.js is used to define changes related player name screen . 
 * 
 * @package proshpere
 * @subpackage uibl
 */


/*
 * Constructor for Player Name class.
 */
function PlayerName() {
    this.myproperty = 'propertyname';
    this.bindPlayerNameScreenEvents();
    this.htmlSlashImg = '<div class="slashImage"> </div>';
    this.currentSelectedPlayerNameAnchor = null;
    var text = GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('text') || '';
    if ((Utility.getObjectlength(GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('fontColor')) > 0) && (text !== '')) {
        this.defaultPlayerNameFontColorSelected = false;
    }
    else {
        this.defaultPlayerNameFontColorSelected = true;
    }
    this.defaultFont = null;
    this.fontStrokeColor1 = 'ffffff';
    this.fontStrokeColor2 = '666666';
    this.fontBaseImgWidth = "60";
    this.fontBaseImgHeight = "40";
    this.fontColor = '000000';
}

/*
 * This method initializes the Fonts and colors in this screen
 * Binds the methods for further callbacks when data is fetched completely 
 * from API
 * 
 * @return void
 */
PlayerName.prototype.init = function() {
    //Bind Font List
    GlobalInstance.fontInstance = GlobalInstance.getFontInstance();
    GlobalInstance.fontInstance.addCallback(this.setHtmlAndBindFontListForPlayerName.bind(this));
    GlobalInstance.colorInstance = GlobalInstance.getColorInstance(null,null,null);
    
    this.setHtmlAndBindColorPlayerName(GlobalInstance.colorInstance.getColorList());
    
    GlobalInstance.textEffectInstance = GlobalInstance.getTextEffectInstance();
    GlobalInstance.textEffectInstance.addCallback(this.bindTextEffectCtrl.bind(this));
    GlobalInstance.anchorPointInstance = GlobalInstance.getAnchorPointInstance();
    GlobalInstance.anchorPointInstance.addCallback(this.fillAnchorPointColorCtrl.bind(this));
    Utility.imitatePlaceHolderForIE();
};

/*
 * This method fills AnchorPoint Color Controls for Player Name Anchor Point Screen 
 * @return void
 */
PlayerName.prototype.fillAnchorPointColorCtrl = function() {
    GlobalInstance.colorInstance = GlobalInstance.getColorInstance(null,null,null);
    
    var colors = this.getColorBoxHtml(GlobalInstance.colorInstance.getColorList());
    $('#ulColorComboBoxlistPlayerNameAnchorPointFillColor').html(colors.selected);
    $('#ulColorComboBoxlistPlayerNameAnchorPointOutlineFirst').html(colors.unselected + colors.selected);
    $('#ulColorComboBoxlistPlayerNameAnchorPointOutlineSecond').html(colors.unselected + colors.selected);
    this.bindAnchorPointColorCtrl();
};

/*
 * This method fills binds events  for Player Name color controls Anchor Point Screen 
 * @return void
 */
PlayerName.prototype.bindAnchorPointColorCtrl = function() {
    //Color Combo Box Event Binding for Font Color
    $(document).off('click', '#dvIdFillColorPlayerNameAnchorPoint');
    $(document).on('click', '#dvIdFillColorPlayerNameAnchorPoint', function() {
        $('#dvIdColorBoxPlayerNameAnchorPointOutlineFirst').hide();
        $('#dvIdColorBoxPlayerNameAnchorPointOutlineSecond').hide();
        $('#dvIdColorBoxPlayerNameAnchorPoint').show();
    });

    $(document).off('click', '#dvIdColorBoxPlayerNameAnchorPoint ul li');
    $(document).on('click', '#dvIdColorBoxPlayerNameAnchorPoint ul li', function() {
        var clickedLi = $(this).children();
        $('#dvIdSelectedFillColorPlayerNameAnchorPoint').attr({
            'name': clickedLi.first().attr('data-name'),
            'matchButtonColorID': clickedLi.first().attr('data-matchButtonColorID'),
            'cmykValue': clickedLi.first().attr('data-cmykValue'),
            'rgbValue': clickedLi.first().attr('data-rgbValue'),
            'rgbHexadecimal': clickedLi.first().attr('rgbHexadecimal'),
            'alt': clickedLi.first().attr('alt'),
            'displayname': clickedLi.first().attr('name'),
            'style': clickedLi.first().attr('style')
        });
        $('#dvIdColorNamePlayerNameAnchorPointFont').html(clickedLi.first().attr('alt'));
        $('#dvIdSelectedFillColorPlayerName').attr({
            'name': clickedLi.first().attr('data-name'),
            'matchButtonColorID': clickedLi.first().attr('data-matchButtonColorID'),
            'cmykValue': clickedLi.first().attr('data-cmykValue'),
            'rgbValue': clickedLi.first().attr('data-rgbValue'),
            'rgbHexadecimal': clickedLi.first().attr('rgbHexadecimal'),
            'alt': clickedLi.first().attr('alt'),
            'displayname': clickedLi.first().attr('name'),
            'style': clickedLi.first().attr('style')
        });
        $('#dvIdColorNamePlayerNameFont').html(clickedLi.first().attr('alt'));
        $('#dvIdColorBoxPlayerNameAnchorPoint').hide();
    });

    //First Outline Color Combo Box Binding
    $(document).off('click', '#dvIdShowColorPlayerNameAnchorPointOutlineFirst');
    $(document).on('click', '#dvIdShowColorPlayerNameAnchorPointOutlineFirst', function() {
        $('#dvIdColorBoxPlayerNameAnchorPoint').hide();
        $('#dvIdColorBoxPlayerNameAnchorPointOutlineSecond').hide();
        $('#dvIdColorBoxPlayerNameAnchorPointOutlineFirst').show();
    });
    $(document).off('click', '#dvIdColorBoxPlayerNameAnchorPointOutlineFirst ul li');
    $(document).on('click', '#dvIdColorBoxPlayerNameAnchorPointOutlineFirst ul li', function() {
        var clickedLi = $(this).children();
        $('#dvIdSelectedFillColorPlayerNameAnchorPointOutlineFirst').attr({
            'name': clickedLi.first().attr('data-name'),
            'matchButtonColorID': clickedLi.first().attr('data-matchButtonColorID'),
            'cmykValue': clickedLi.first().attr('data-cmykValue'),
            'rgbValue': clickedLi.first().attr('data-rgbValue'),
            'rgbHexadecimal': clickedLi.first().attr('rgbHexadecimal'),
            'alt': clickedLi.first().attr('alt'),
            'displayname': clickedLi.first().attr('name'),
            'style': clickedLi.first().attr('style')
        });
        $('#dvIdColorNamePlayerNameAnchorPointOutlineFirst').html(clickedLi.first().attr('alt'));
        $('#dvIdSelectedFillColorPlayerNameOutlineFirst').attr({
            'name': clickedLi.first().attr('data-name'),
            'matchButtonColorID': clickedLi.first().attr('data-matchButtonColorID'),
            'cmykValue': clickedLi.first().attr('data-cmykValue'),
            'rgbValue': clickedLi.first().attr('data-rgbValue'),
            'rgbHexadecimal': clickedLi.first().attr('rgbHexadecimal'),
            'alt': clickedLi.first().attr('alt'),
            'displayname': clickedLi.first().attr('name'),
            'style': clickedLi.first().attr('style')
        });
        $('#dvIdColorNamePlayerNameOutlineFirst').html(clickedLi.first().attr('alt'));
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontOutline1Color', {
            'name': clickedLi.first().attr('data-name'),
            'matchButtonColorID': clickedLi.first().attr('data-matchButtonColorID'),
            'cmykValue': clickedLi.first().attr('data-cmykValue'),
            'rgbValue': clickedLi.first().attr('data-rgbValue'),
            'rgbHexadecimal': clickedLi.first().attr('rgbHexadecimal'),
            'alt': clickedLi.first().attr('alt'),
            'displayname': clickedLi.first().attr('name'),
            'style': clickedLi.first().attr('style')
        });
        $('#dvIdColorBoxPlayerNameAnchorPointOutlineFirst').hide();
        previewPlayerName();
    });


    //Second Outline Color Combo Box Binding
    $(document).off('click', '#dvIdShowColorPlayerNameAnchorPointOutlineSecond');
    $(document).on('click', '#dvIdShowColorPlayerNameAnchorPointOutlineSecond', function() {
        $('#dvIdColorBoxPlayerNameAnchorPoint').hide();
        $('#dvIdColorBoxPlayerNameAnchorPointOutlineFirst').hide();
        $('#dvIdColorBoxPlayerNameAnchorPointOutlineSecond').show();
    });

    $(document).off('click', '#dvIdColorBoxPlayerNameAnchorPointOutlineSecond ul li');
    $(document).on('click', '#dvIdColorBoxPlayerNameAnchorPointOutlineSecond ul li', function() {
        var clickedLi = $(this).children();
        $('#dvIdColorBoxPlayerNameAnchorPointOutlineSecond').hide();
        $('#dvIdSelectedFillColorPlayerNameAnchorPointOutlineSecond').attr({
            'name': clickedLi.first().attr('data-name'),
            'matchButtonColorID': clickedLi.first().attr('data-matchButtonColorID'),
            'cmykValue': clickedLi.first().attr('data-cmykValue'),
            'rgbValue': clickedLi.first().attr('data-rgbValue'),
            'rgbHexadecimal': clickedLi.first().attr('rgbHexadecimal'),
            'alt': clickedLi.first().attr('alt'),
            'displayname': clickedLi.first().attr('name'),
            'style': clickedLi.first().attr('style')
        });

        $('#dvIdColorNamePlayerNameAnchorPointOutlineSecond').html(clickedLi.first().attr('alt'));
        $('#dvIdSelectedFillColorPlayerNameOutlineSecond').attr({
            'name': clickedLi.first().attr('data-name'),
            'matchButtonColorID': clickedLi.first().attr('data-matchButtonColorID'),
            'cmykValue': clickedLi.first().attr('data-cmykValue'),
            'rgbValue': clickedLi.first().attr('data-rgbValue'),
            'rgbHexadecimal': clickedLi.first().attr('rgbHexadecimal'),
            'alt': clickedLi.first().attr('alt'),
            'displayname': clickedLi.first().attr('name'),
            'style': clickedLi.first().attr('style')
        });
        $('#dvIdColorNamePlayerNameOutlineSecond').html(clickedLi.first().attr('alt'));
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontOutline2Color', {
            'name': clickedLi.first().attr('data-name'),
            'matchButtonColorID': clickedLi.first().attr('data-matchButtonColorID'),
            'cmykValue': clickedLi.first().attr('data-cmykValue'),
            'rgbValue': clickedLi.first().attr('data-rgbValue'),
            'rgbHexadecimal': clickedLi.first().attr('rgbHexadecimal'),
            'alt': clickedLi.first().attr('alt'),
            'displayname': clickedLi.first().attr('name'),
            'style': clickedLi.first().attr('style')
        });
        previewPlayerNameAnchorPoint();
    });

};
/*
 * This method binds html and events for text Orientation Combo box 
 * @params textEffectList List of textEffects
 * 
 */
PlayerName.prototype.bindTextEffectCtrl = function(textEffectList) {
    this.bindTextEffectCtrlHTML(textEffectList);
    this.bindTextEffectCtrlEvents(textEffectList);
};
/*
 * This method binds html for text Orientation
 * @params textEffectList List of textEffects
 */
PlayerName.prototype.bindTextEffectCtrlHTML = function(textEffectList) {

    var font = {
        "Name": "PS_CollegiateStd",
        "Id": "1004"
    };
    var oColor1 = {
        "id": "4",
        "name": "black",
        "rgbValue": "10,10,10",
        "cmykValue": "70,55,55,100",
        "rgbHexadecimal": "#1A0000",
        "matchButtonColorID": "4",
        "matchThreadColorID": "4",
        "matchZipperColorID": "4"
    };
    var oColor2 = {
        "id": "4",
        "name": "black",
        "rgbValue": "10,10,10",
        "cmykValue": "70,55,55,100",
        "matchButtonColorID": "4",
        "matchThreadColorID": "4",
        "matchZipperColorID": "4"
    };

    var oColor3 = {
        "id": "4",
        "name": "black",
        "rgbValue": "10,10,10",
        "cmykValue": "70,55,55,100",
        "matchButtonColorID": "4",
        "matchThreadColorID": "4",
        "matchZipperColorID": "4"
    };
    var tempTextEffectHtml = '';

    var sFontName = font.Name || "PS_SportScriptMTStd";
    sFontName = sFontName.substring(sFontName.indexOf('/') + 1);
    var sFontColor = oColor1.rgbHexadecimal || "white";
    sFontColor = sFontColor.replace("#", "");
    
    var sBaseImgWidth = "60";
    var sBaseImgHeight = "17";
    var sTextEffect = "archUp";
    var sText = "Sample";
    var selectedTextEffect = null;
    var selectedTextEffectImageURL = null;
    selectedTextEffect = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('textOrientation');
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
                sBaseImgWidth,
                sBaseImgHeight
                );
        tempTextEffectHtml += '<div style="vertical-align:middle; text-align:center" id= "playerName_' + textEffect.TextEffectTypeId + '" class="comboDropdownListText" value="' + textEffect.Name + '" displayname="' + textEffect.Name + '" parentId="dvIdComboBoxTextEffectPlayerName"> <div class="fl">' + textEffect.Name + '</div><div class="fr" parentId="dvIdComboBoxTextEffectPlayerName"> <img src="' + textEffectURL + '"/></div></div>';
        //When no exiting save values 
        if (selectedTextEffect == null || selectedTextEffect == undefined) {
            selectedTextEffect = textEffect;
            selectedTextEffectImageURL = textEffectURL;
        }
        //When exiting saved values are present in Global parameters and are being fetched via retrival code 
        if (selectedTextEffect != null && selectedTextEffect != undefined && selectedTextEffect.TextEffectTypeId == textEffect.TextEffectTypeId                ) {
            selectedTextEffect = textEffect;
            selectedTextEffectImageURL = textEffectURL;
        }
    });
    $('#dvIdComboBoxTextEffectPlayerNameList').html(tempTextEffectHtml);
    this.selectTextEffect(selectedTextEffect, selectedTextEffectImageURL);
};

/**
 * This method binds events for text Orientation
 * @param  textEffectList List of textEffects
 * @returns void
 */
PlayerName.prototype.bindTextEffectCtrlEvents = function(textEffectList) {
    $(document).on('click', '#dvIdComboBoxTextEffectPlayerName', function() {
        $('#dvIdComboBoxTextEffectPlayerNameList').toggle();
        var selectedTextEffect = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('textOrientation');
        $('#dvIdComboBoxTextEffectPlayerNameList').scrollTop($('#playerName_' + selectedTextEffect.TextEffectTypeId).position().top);
    });

    //Font Combo Box Event Binding
    $(document).on('click', '#dvIdComboBoxTextEffectPlayerNameList div', function() {
        var thisElement = $(this);
        if(thisElement.attr('class') == 'fl' || thisElement.attr('class') =='fr'){
            thisElement = $(this).parent();
        }
        $('#dvIdComboBoxTextEffectPlayerName').html('<div parentId="dvIdComboBoxTextEffectPlayerName">' + $(thisElement).html() + '</div>');
        $('#dvIdComboBoxTextEffectPlayerName').attr("value", $(thisElement).attr('displayname'));
        $('#dvIdComboBoxTextEffectPlayerNameList').hide();
        $('#dvIdComboBoxTextEffectPlayerNameList div.comboDropdownListText').removeClass('active');
        $(thisElement).addClass('active');
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('textOrientation', GlobalInstance.textEffectInstance.getTextEffectByKey('_' + $(thisElement).attr('id').split("_")[1]));
        //Previe text logic
        previewPlayerName();
    });
};

/*
 * This method shows PlayerName Screen and hide others.
 */
PlayerName.prototype.show = function() {
    $("#secNumberAndTextHome").hide();
    $("#secPlayerName").hide();
    $("#secTeamName").hide();
    $("#secOtherText").hide();
    $("#secPlayerName").show();
    this.getCurrentSelectedAnchorPointtObject();
    this.selectFontColor(this.getSelectedFontColor(null));
    this.selectFontOutline1Color(this.getSelectedFontOutline1Color(null));
    this.selectFontOutline2Color(this.getSelectedFontOutline2Color(null));
    this.selectFont(this.getSelectedFont(this.defaultFont), this.getDefaultFontUrl());
    previewPlayerName();
};

/*
 * This method hides the PlayerName field.
 */
PlayerName.prototype.hide = function() {
    $("#secPlayerName").hide();
};

/*
 * This function binds the screen events.
 */
PlayerName.prototype.bindPlayerNameScreenEvents = function () {
    var thisObject = this;
    $('#btnOtherTextPlayerName ,#btnPlayerNumberPlayerName, #btnTeamNamePlayerName ').off('click');
    $(document).on('click', "#btnPlayerNumberPlayerName", function() {
        GlobalInstance.getTeamNameInstance().hide();
        GlobalInstance.getOtherTextInstance().hide();
        GlobalInstance.getPlayerNameInstance().hide();
        GlobalInstance.getPlayerNumberInstance().show();
    });
    $(document).on('click', "#btnTeamNamePlayerName", function() {
        GlobalInstance.getPlayerNumberInstance().hide();
        GlobalInstance.getPlayerNameInstance().hide();
        GlobalInstance.getOtherTextInstance().hide();
        GlobalInstance.getTeamNameInstance().show();
    });
    $(document).on('click', "#btnOtherTextPlayerName", function() {
        GlobalInstance.getPlayerNumberInstance().hide();
        GlobalInstance.getPlayerNameInstance().hide();
        GlobalInstance.getTeamNameInstance().hide();
        GlobalInstance.getOtherTextInstance().show();
    });
    this.setDefaultText();
    /*****************************************************************/
    $('#inputExamplePlayerName').bind('keypress', function(event) {
        var sText = $(this).val();
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        
        if (sText.length > 15 && (regex.test(key)) && $(this)[0].selectionStart == $(this)[0].selectionEnd) {
            event.preventDefault();
            return false;
        }
    });
    $("#inputExamplePlayerName").keyup(function() {
        //preview Image based on the values selected in Font and Colors or the global variables
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('text', $(this).val());
        previewPlayerName();
    });

    //Font Combo Box Event Binding 
    $(document).on('click', '#dvIdComboFontPlayerName', function() {
        if ($('#dvIdComboDropdownPlayerName').is(':visible')) {
            $('#dvIdComboDropdownPlayerName').hide();
        } else {
            $('#dvIdComboDropdownPlayerName').show();
            thisObject.selectFontInCombo();
        }
    });

    //Handle click event on the Font item in the font dropdown.
    $(document).on('click', '#dvIdComboDropdownPlayerName div img , #dvIdComboDropdownPlayerName div', function() {
        var fontObject = new Object();
         var thisElement = $(this);
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
        var displayName = $(this).first().attr('displayname') || fontObject.displayname;
        var fileLoc = $(this).first().attr('fileloc') || fontObject.fileloc;

        $('#dvIdComboFontPlayerName').html("<img src='" + fontObject.src + "' />");
        $('#dvIdComboFontPlayerName').attr('fileloc', $(this).first().attr('fileloc'));
        $('#dvIdComboDropdownPlayerName').hide();

        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        //Set selected font in the UniformConfigurator file.
        GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('font', {
            'name': $(this).first().attr('displayname') || fontObject.displayname,
            'displayname': $(this).first().attr('displayname') || fontObject.displayname,
            'IPSID': $(this).first().attr('value') || fontObject.IPSID,
            'fontid': $(this).first().attr('fontid') || fontObject.fontId,
            'fileloc': $(this).first().attr('fileloc') || fileLoc
        });
        GlobalInstance.fontSelectionInstance = GlobalInstance.getFontSelectionInstance();
        GlobalInstance.fontSelectionInstance.setModifiedFont(GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('font'));

        //Previe text logic
        previewPlayerName();

    });
};

/**
 * This method binds the font list to the Font Combo in Player Number screen
 * @param  fontList list of font
 * @returns void
 */
PlayerName.prototype.setHtmlAndBindFontListForPlayerName = function(fontList) {
    var thisObject = this;
    var tempFontHtml = '';
    var defaultFont = null;
    var defaultUrl = ''
    var count = 0;
    var textdecalObj = null;
    
    $.each(fontList, function(key, font) {
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
        tempFontHtml += '<div class="comboDropdownFontListText" id="dvPlayerNameFontList_' + font.FontId + '" value="' + font.Name + '" displayname="' + font.Name + '" fileloc="' + font.FileLocation + '" fontid="' + font.FontId + '">  <img src="' + newURLLP + '"/></div>';
    });
    $('#dvIdComboDropdownPlayerName').html(tempFontHtml);
    this.selectFont(this.getSelectedFont(this.defaultFont), defaultUrl);
};

/**
 * This method 
 * @param  colorList List of all colors
 * @returns {PlayerName.prototype.getColorBoxHtml.Anonym$10}
 */
PlayerName.prototype.getColorBoxHtml = function(colorList) {
    var tempColorsListHtml = '';
    var tempCustomColorListHtml = '';
    var tempColorsListUnselectHtml = '';
    tempColorsListUnselectHtml += '<li id= "colorid_0" ColorId="0" style="cursor:pointer; background-color:; background-image:url(\'images/slash.png\');">\n\
<a ColorId="0" \n\
rgbHexadecimal="" alt="Optional1" class="in-active" \n\
style="background-color:"></a></li>';
    var defaultFontColor = null;
    $.each(colorList, function(i, color) {
        if (defaultFontColor == null) {
            defaultFontColor = color;
        }
        if (color.CustomerId != null && color.CustomerId != '' && color.CustomerId != undefined) {
            tempCustomColorListHtml += '<li  TaaColorId="' + color.TaaColorId + '" id="colorid_' + color.ColorId + '" colorid= "' + color.ColorId + '"style="cursor:pointer; background-color:' + color.RgbHexadecimal + '" class="in-active" alt="' + color.Name + '"  title="' + color.Name + '"><a ColorId=' + color.ColorId + ' \n\
                            alt="' + color.Name + '" \n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        }
        else {
            tempColorsListHtml += '<li  TaaColorId="' + color.TaaColorId + '" id="colorid_' + color.ColorId + '" colorid= "' + color.ColorId + '"style="cursor:pointer; background-color:' + color.RgbHexadecimal + '" class="in-active" alt="' + color.Name + '"  title="' + color.Name + '"><a ColorId=' + color.ColorId + ' \n\
                            alt="' + color.Name + '" \n\
                            TaaColorId="' + color.TaaColorId + '" \n\
                            style="background-color:' + color.RgbHexadecimal + '"></a></li>';
        }

    });
    return {
        "unselected": tempColorsListUnselectHtml,
        "selected": tempColorsListHtml,
        "custom":tempCustomColorListHtml,
        "defaultFontColor": defaultFontColor
    };
};
/**
 * This method binds the color list to the Fill Color Combo.
 * @param  colorList List of all colors
 * @returns void
 */
PlayerName.prototype.setHtmlAndBindColorPlayerName = function(colorList) {
    var colors = this.getColorBoxHtml(colorList);
    var thisObject = this;
    $('#ulColorComboBoxlistPlayerNameFillColor').html(colors.selected);
    $('#ulColorComboBoxlistPlayerNameOutlineFirst').html(colors.unselected + colors.selected);
    $('#ulColorComboBoxlistPlayerNameOutlineSecond').html(colors.unselected + colors.selected);

    //Custom Color Case
    var customerId = GlobalInstance.uniformConfigurationInstance.getAccountNumber();
    if (customerId !== 0 && customerId !== undefined) {
        $('#ulIdPlayerNamePrimaryCustomColor').html(colors.custom);
        $('#ulIdPlayerNameOutlineFirstCustomColor').html(colors.custom);
        $('#ulIdPlayerNameOutlineSecondCustomColor').html(colors.custom);
    }

    this.selectFontColor(this.getSelectedFontColor(colors.defaultFontColor));
    this.selectFontOutline1Color(this.getSelectedFontOutline1Color(null));
    this.selectFontOutline2Color(this.getSelectedFontOutline2Color(null));

    //Color Combo Box Event Binding for Font Color
    $(document).off('click', '#dvIdColorBoxPlayerName > .numberandTextColorBoxScrolling ul li ,#dvIdFillColorPlayerName ,#dvIdPlayerNamePrimaryCustomColor ul li');
    $(document).on('click', '#dvIdFillColorPlayerName', function() {
        $("#dvIdColorBoxPlayerName").css({left: '', top: ''});
        $("#dvIdColorBoxPlayerNameOutlineFirst").hide();
        $("#dvIdColorBoxPlayerNameOutlineSecond").hide();
        if ($('#dvIdColorBoxPlayerName').is(':visible')) {
            $('#dvIdColorBoxPlayerName').hide();
        } else {
            thisObject.setDefaultUniformColor();
            $('#dvIdColorBoxPlayerName').show();
        }
        return false;
    });

    $('#dvIdColorBoxPlayerName').draggable({
        containment: '#dvConfiguratorPanel'
    });
    /**
     * Handles the click Event
     */
    $(document).on('click', '#dvIdColorBoxPlayerName > .numberandTextColorBoxScrolling  ul li ,#dvIdPlayerNamePrimaryCustomColor ul li', function () {
        $("#dvIdColorBoxPlayerName").css({left: '', top: ''});
        var clickedLi = $(this).children();
        $('#dvIdColorBoxPlayerName ul li').attr({
            'class': 'in-active'
        });

        $('#dvIdPlayerNamePrimaryCustomColor ul li').attr({
            'class': 'in-active'
        });

        $(this).attr({
            'class': 'active'
        });
        if (clickedLi.first().attr('colorid') != 0) {
            $('#dvIdSelectedFillColorPlayerName').attr({
                'alt': clickedLi.first().attr('alt'),
                'style': clickedLi.first().attr('style')
            });

            $('#dvIdColorNamePlayerNameFont').html(clickedLi.first().attr('alt'));
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            $('#dvIdColorBoxPlayerName').hide();
            thisObject.defaultPlayerNameFontColorSelected = false;
            var selectedColor = GlobalInstance.colorInstance.getColorByKey('_' + clickedLi.first().attr('colorid'));
            GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
            GlobalInstance.colorRetainInstance.setModifiedColors(true, false, false, selectedColor);// Update the primary color in the application that has primary color support
            GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontColor',
                    GlobalInstance.colorInstance.getColorByKey('_' + clickedLi.first().attr('colorid'))
                    );
            previewPlayerName();
        }
    });


    //First Outline Color Combo Box Binding
    $(document).off('click', '#dvIdPlayerNameOutlineFirst');
    $(document).on('click', '#dvIdPlayerNameOutlineFirst', function() {
        $("#dvIdColorBoxPlayerNameOutlineFirst").css({left: '', top: ''});
        $('#dvIdColorBoxPlayerNameOutlineSecond').hide();
        if ($('#dvIdColorBoxPlayerNameOutlineFirst').is(':visible')) {
            $('#dvIdColorBoxPlayerNameOutlineFirst').hide();
        } else {
            thisObject.setDefaultUniformColor();
            $('#dvIdColorBoxPlayerNameOutlineFirst').show();
        }
        return false;
    });
    $('#dvIdColorBoxPlayerNameOutlineFirst').draggable({
        containment: '#dvConfiguratorPanel'
    });
    $(document).off('click', '#dvIdColorBoxPlayerNameOutlineFirst > .numberandTextColorBoxScrolling  ul li ,#dvIdPlayerNameOutlineFirstCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxPlayerNameOutlineFirst > .numberandTextColorBoxScrolling  ul li ,#dvIdPlayerNameOutlineFirstCustomColor ul li', function (e) {
        
        if(e.target.id == "colorid_0"){
            $("#dvIdSelectedFillColorPlayerNameOutlineFirst").addClass("slashImage color_box_selected");
        }
        
        $("#dvIdColorBoxPlayerNameOutlineFirst").css({left: '', top: ''});
        var clickedLi = $(this).children();
        $('#dvIdColorBoxPlayerNameOutlineFirst ul li').attr({
            'class': 'in-active'
        });

        $('#dvIdPlayerNameOutlineFirstCustomColor ul li').attr({
            'class': 'in-active'
        });

        $(this).attr({
            'class': 'active'
        });
        if (clickedLi.first().attr('colorid') != 0) {
            $("#dvIdSelectedFillColorPlayerNameOutlineFirst").removeClass("slashImage");
        }
        $('#dvIdSelectedFillColorPlayerNameOutlineFirst').attr({
            'title': clickedLi.first().attr('alt'),
            'alt': clickedLi.first().attr('alt'),
            'style': clickedLi.first().attr('style')
        });


        $('#dvIdColorNamePlayerNameOutlineFirst').html(clickedLi.first().attr('alt'));
        if (clickedLi.first().attr('colorid') === "0") {
            $('#dvIdColorNamePlayerNameOutlineFirst').css('color', '#C3C3C3');
        } else {
            $('#dvIdColorNamePlayerNameOutlineFirst').css('color', '#000');
        }

        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        var selectedColorObject = GlobalInstance.colorInstance.getColorByKey('_' + clickedLi.first().attr('colorid'));
        if (!selectedColorObject) {
            selectedColorObject = null;
        }
        GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
        GlobalInstance.colorRetainInstance.setModifiedColors(false, true, false, selectedColorObject);// Update the secondary color in the application that has secondary color support
        GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontOutline1Color', selectedColorObject);

        $('#dvIdColorNamePlayerNameOutlineFirst').html(clickedLi.first().attr('alt'));
        $('#dvIdSelectedFillColorPlayerNameOutlineFirst').attr({
            'alt': clickedLi.first().attr('alt'),
            'style': clickedLi.first().attr('style')
        });

        $('#dvIdColorNamePlayerName').html(clickedLi.first().attr('alt'));
        $('#dvIdColorBoxPlayerNameOutlineFirst').hide();
        //show PlayerName 
        previewPlayerName();

    });

    //Second Outline Color Combo Box Binding
    $(document).off('click', '#dvIdPlayerNameOutlineSecond');
    $(document).on('click', '#dvIdPlayerNameOutlineSecond', function() {
        $("#dvIdColorBoxPlayerNameOutlineSecond").css({left: '', top: ''});
        if ($('#dvIdColorBoxPlayerNameOutlineSecond').is(':visible')) {
            $('#dvIdColorBoxPlayerNameOutlineSecond').hide();
        } else {
            thisObject.setDefaultUniformColor();
            $('#dvIdColorBoxPlayerNameOutlineSecond').show();
        }
        return false;
    });
    $('#dvIdColorBoxPlayerNameOutlineSecond').draggable({
        containment: '#dvConfiguratorPanel'
    });

    //Handles the click event on the Outline Color second
    $(document).off('click', '#dvIdColorBoxPlayerNameOutlineSecond > .numberandTextColorBoxScrolling  ul li ,#dvIdPLayerNameOutlineSecondCustomColor ul li');
    $(document).on('click', '#dvIdColorBoxPlayerNameOutlineSecond > .numberandTextColorBoxScrolling  ul li ,#dvIdPlayerNameOutlineSecondCustomColor ul li', function (e) {
        
        if(e.target.id == "colorid_0"){
            $("#dvIdSelectedFillColorPlayerNameOutlineSecond").addClass("slashImage color_box_selected");
        }
        
        $("#dvIdColorBoxPlayerNameOutlineSecond").css({left: '', top: ''});
        var clickedLi = $(this).children();
        $('#dvIdColorBoxPlayerNameOutlineSecond ul li').attr({
            'class': 'in-active'
        });

        $('#dvIdPlayerNameOutlineSecondCustomColor ul li').attr({
            'class': 'in-active'
        });

        $(this).attr({
            'class': 'active'
        });
        if (clickedLi.first().attr('colorid') != 0) {
            $("#dvIdSelectedFillColorPlayerNameOutlineSecond").removeClass("slashImage");
        }
        $('#dvIdColorBoxPlayerNameOutlineSecond').hide();
        $('#dvIdSelectedFillColorPlayerNameOutlineSecond').attr({
            'alt': clickedLi.first().attr('alt'),
            'style': clickedLi.first().attr('style')
        });

        if (clickedLi.first().attr('colorid') == "0") {
            $('#dvIdColorNamePlayerNameOutlineSecond').css('color', '#C3C3C3');
        } else {
            $('#dvIdColorNamePlayerNameOutlineSecond').css('color', '#000');
        }
        $('#dvIdColorNamePlayerNameOutlineSecond').html(clickedLi.first().attr('alt'));
        var selectedColorObject = GlobalInstance.colorInstance.getColorByKey('_' + clickedLi.first().attr('colorid'));
        if (!selectedColorObject) {
            selectedColorObject = null;
        }
        GlobalInstance.colorRetainInstance = GlobalInstance.getColorRetainInstance();
        GlobalInstance.colorRetainInstance.setModifiedColors(false, false, true, selectedColorObject);// Update the accent color in the application that has accent color support
        GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
        GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontOutline2Color', selectedColorObject);

        var clickedLi = $(this).children();
        $('#dvIdColorBoxPlayerNameAnchorPointOutlineSecond').hide();
        $('#dvIdSelectedFillColorPlayerNameAnchorPointOutlineSecond').attr({
            'name': clickedLi.first().attr('data-name'),
            'matchButtonColorID': clickedLi.first().attr('data-matchButtonColorID'),
            'cmykValue': clickedLi.first().attr('data-cmykValue'),
            'rgbValue': clickedLi.first().attr('data-rgbValue'),
            'rgbHexadecimal': clickedLi.first().attr('rgbHexadecimal'),
            'alt': clickedLi.first().attr('alt'),
            'displayname': clickedLi.first().attr('name'),
            'style': clickedLi.first().attr('style')
        });
        $('#dvIdColorNamePlayerNameAnchorPointOutlineSecond').html(clickedLi.first().attr('alt'));
        previewPlayerName();

    });
    previewPlayerName();

};


/**
 * Performs a fetching Preview Text.  
 * Updates Preview on Other Text String
 */
previewPlayerName = function() {
    try {
        var objTextEffect = getTextEffectObjPlayerName();
        //var objTextEffect = getTextEffectObjPlayerName() || "Straight";
        var sTextEffect = objTextEffect && objTextEffect.FileLocation ? objTextEffect.FileLocation : "";
        
        var sText = getTextPlayerName() || "";
        var fontObj = getFontObjPlayerName();
        var sFontName = '';
        if (fontObj.fileloc) {
            sFontName = fontObj.fileloc.substring(fontObj.fileloc.indexOf('/') + 1);
        }
        var sFont = getFontPlayerName();
        var oColor1 = getColorPlayerName();
        var oColor2 = getOutline1ColorPlayerName();
        var oColor3 = getOutline2ColorPlayerName();

        if (!oColor1) {
            oColor1 = GlobalInstance.colorInstance.getColorByKey('_' + $('#dvIdColorBoxPlayerName ul>:first-child').first().attr('colorid'));
        }
        ;
        var primaryColorHexCode = (oColor1.rgbHexadecimal) ? oColor1.rgbHexadecimal : oColor1.RgbHexadecimal;
        if(!primaryColorHexCode){
            primaryColorHexCode =oColor1.background.substring(oColor1.background.indexOf(':')+1);
        }
        if (sFont != "" && oColor1 != undefined && (primaryColorHexCode) != undefined) {
            if (sText != "") {
                var iHeight = 50;
                var sFontSize = "50";
                var colorOutline1 = "None";
                var colorOutline2 = "None";
                var sFontColor = (primaryColorHexCode).replace("#", "");

                var sFontWidth = "50";
                var sBaseColor = "ffffff";
                var sBaseImgWidth = "300";
                var sBaseImgHeight = "100";
                var sCurveRadius = "100";
                var sCentreXCoordinate = "180";
                var sCentreYCoordinate = "150";


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
                var newURL = "";

                newURL = LiquidPixels.generateTextEffectPreviewURL(objTextEffect, sTextEffect,
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
                    $('#imgPreviewTextIdPlayerName').css('visibility', 'visible');
                    $('#imgPreviewTextIdPlayerName').attr('src', image.src);
                    $.doneProcess();
                };
                image.onerror = function() {
                    $.doneProcess();
                };
                image.src = newURL;

            } else {
                $('#imgPreviewTextIdPlayerName').attr("src", "");
                $('#imgPreviewTextIdPlayerName').css('visibilty', 'hidden');
            }
        }
    } catch (err) {

    }
};



/**
 * This method fectes Text Color for Player Name  
 * @returns PlayerName Object that contain font color
 */
getColorPlayerName = function() {
    return GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('fontColor');
};

/**
 * This method fetches Ouline1  Color for Player Name  
 * @returns playerName object that contain first outline color details
 */
getOutline1ColorPlayerName = function() {
    return GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('fontOutline1Color');
};

/**
 *This method fetches Ouline2  Color for Player Name   
 * @returns PlayerName object that contains second outline color details
 */
getOutline2ColorPlayerName = function() {
    return GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('fontOutline2Color');
};

/**
 *This method fetches Font for Player Name   
 * @returns } PlayerName object that contains Font details
 */
getFontPlayerName = function() {
    if (GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('font') == undefined) {
        return null;
    }
    else {
        return GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('font').displayname;
    }
};

/**
 * This method fetches Font Object for Player Name  
 * @returns Font object for player name
 */
getFontObjPlayerName = function() {
    return GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('font');
};

/**
 * This method fetches Text for Player Name  
 * @returns text object for player name
 */
getTextPlayerName = function() {
    return GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('text');
};


/**
 * This method fetches Font Object for Player Name  
 * @returns text effect object for Player Name
 */
getTextEffectObjPlayerName = function() {
    var objTextOrientation = GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('textOrientation');
    if (Utility.getObjectlength(objTextOrientation) > 0) {
        var textOrientation = objTextOrientation;
        var textEffectObj = textOrientation ? textOrientation.TextEffectCategorys[0].TextEffects[0] : null;
        return textEffectObj;
    } else {
        return null;
    }
};

/*
 * This method select the specific font as per font Id and sets the same in Global 
 * @param (font) Font object
 * 
 * @return void
 */
PlayerName.prototype.selectFont = function(font, fontUrl) {
    if (font) {
        //GlobalInstance.getUniformConfigurationInstance().setPlayerNumberInfo('font',font) ;
        $("#dvIdComboFontPlayerName").attr({
            'fileloc': font.fileloc || font.FileLocation
        });
        $("#dvIdComboFontPlayerName").html("<img src='" + fontUrl + "' />");

        GlobalInstance.getUniformConfigurationInstance().setPlayerNameInfo('font', {
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
PlayerName.prototype.getSelectedFont = function(defaultFont) {
    var font = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('font');
    if (font) {
        return font;
    }
    return defaultFont;
};

/*
 * This method select the specific text Effect as per text Effect Id and sets the same in Global 
 * @param textEffect Selected TextEffect
 * @param textEffectURL  LiquidPixel URL
 * 
 * @return void
 */
PlayerName.prototype.selectTextEffect = function(textEffect, textEffectURL) {
    if (textEffect != undefined) {
        $("#dvIdComboBoxTextEffectPlayerName").attr({
            'TextEfffectId': textEffect.TextEffectTypeId || textEffect.TextEffectTypeId
        });
        $("#dvIdComboBoxTextEffectPlayerName").html('<div class="fl" style="line-height:2;" parentId="dvIdComboBoxTextEffectPlayerName">' + textEffect.Name + '</div><div class="fr" style="line-height:2;" parentId="dvIdComboBoxTextEffectPlayerName"> <img src="' + textEffectURL + '"/></div>');
        GlobalInstance.getUniformConfigurationInstance().setPlayerNameInfo('textOrientation', textEffect);
        $("#playerName_" + textEffect.TextEffectTypeId).addClass('active');
    }
};

/*
 * This method select the specific font Color and sets the same in Global 
 * @param (fontColor) object 
 * 
 * @return void
 */
PlayerName.prototype.selectFontColor = function(color) {
    if (color) {
        var colorName = (color.Name) ? color.Name : color.colorName;
        var rgbHexaDecimal = (color.RgbHexadecimal) ? color.RgbHexadecimal : color.background.substring(color.background.indexOf(':') + 1);
        var colorId = (color.ColorId) ? color.ColorId : color.colorid;
        $("#dvIdSelectedFillColorPlayerName").attr({
            'title': colorName,
            'alt': colorName,
            'displayname': colorName,
            'style': "background-color:" + rgbHexaDecimal
        });
        if (Utility.getObjectlength(GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontColor')) > 0) {
            GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo('fontColor', color);
            if (!this.defaultPlayerNameFontColorSelected) {
                $("#dvIdColorNamePlayerNameFont").html(colorName);
            }
            $('#dvIdColorBoxPlayerName ul li').attr({ 'class': 'in-active' });
            $('#dvIdPlayerNamePrimaryCustomColor ul li').attr({ 'class': 'in-active' });
            $("#ulColorComboBoxlistPlayerNameFillColor li#colorid_" + colorId).attr("class", "active");
            $("#ulIdPlayerNamePrimaryCustomColor li#colorid_" + colorId).attr("class", "active");
        } else {
            var defaultColorInfo = GlobalInstance.getColorInstance().getColorByKey('_' + CONFIG.get('DEFAULT_COLOR_ID'));
            $('#dvIdColorNamePlayerNameFont').css('color', defaultColorInfo.RgbHexadecimal);
            $("#dvIdColorNamePlayerNameFont").html(CONFIG.get("DEFAYLT_COLOR_TEXT"));
        }
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param (defaultFontColor) First FontColor 
 * 
 * @return Object Selected style
 */
PlayerName.prototype.getSelectedFontColor = function(defaultFontColor) {
    var fontColor = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontColor');
    if (fontColor) {
        this.defaultPlayerNameFontColorSelected = false;
        return fontColor;
    }
    return defaultFontColor;
};


/*
 * This method select the specific font Color and sets the same in Global 
 * @param (fontColor) object 
 * 
 * @return void
 */
PlayerName.prototype.selectFontOutline1Color = function(color) {
    $('#dvIdColorBoxPlayerNameOutlineFirst ul li').attr({
        'class': 'in-active'
    });

    $('#dvIdPlayerNameOutlineFirstCustomColor ul li').attr({
        'class': 'in-active'
    });

    $("#dvIdColorNamePlayerNameOutlineFirst").html("");
    if (color) {
        var colorName = (color.Name) ? color.Name : color.colorName;
        var rgbHexaDecimal = (color.RgbHexadecimal) ? color.RgbHexadecimal : color.background.substring(color.background.indexOf(':') + 1);
        var colorId = (color.ColorId) ? color.ColorId : color.colorid;
        if (colorId) {
            $("#dvIdSelectedFillColorPlayerNameOutlineFirst").removeClass("slashImage");
            $("#dvIdSelectedFillColorPlayerNameOutlineFirst").attr({
                'title': colorName,
                'alt': colorName,
                'displayname': colorName,
                'style': "background-color:" + rgbHexaDecimal
            });

            $("#ulColorComboBoxlistPlayerNameOutlineFirst li#colorid_" + colorId).attr("class", "active");
            $("#ulIdPlayerNameOutlineFirstCustomColor li#colorid_" + colorId).attr("class", "active");
            $('#dvIdColorNamePlayerNameOutlineFirst').css('color', '#000');
            $("#dvIdColorNamePlayerNameOutlineFirst").html(colorName);
        } else {
            $("#dvIdSelectedFillColorPlayerNameOutlineFirst").attr({
                'style': ""
            });
            $("#dvIdSelectedFillColorPlayerNameOutlineFirst").addClass("slashImage color_box_selected");
            $("#dvIdColorNamePlayerNameOutlineFirst").html("Optional");
            $('#dvIdColorNamePlayerNameOutlineFirst').css('color', '#C3C3C3');
        }
        GlobalInstance.getUniformConfigurationInstance().setPlayerNameInfo('fontOutline1Color', color);
    }
    else {
        $("#dvIdSelectedFillColorPlayerNameOutlineFirst").attr({
            'style': ""
        });
        $("#dvIdSelectedFillColorPlayerNameOutlineFirst").addClass("slashImage color_box_selected");
        $("#dvIdColorNamePlayerNameOutlineFirst").html("Optional");
        $('#dvIdColorNamePlayerNameOutlineFirst').css('color', '#C3C3C3');
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param (defaultFontColor) First FontColor 
 * btnPlayerNumber
 * @return Object Selected style
 */
PlayerName.prototype.getSelectedFontOutline1Color = function(defaultOutline1Color) {
    var color = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline1Color');
    if (color) {
        return color;
    }
    return defaultOutline1Color;
};

/*
 * This method select the specific font Color and sets the same in Global 
 * @param (fontColor) object 
 * 
 * @return void
 */
PlayerName.prototype.selectFontOutline2Color = function(color) {
    $('#dvIdColorBoxPlayerNameOutlineSecond ul li').attr({
        'class': 'in-active'
    });

    $('#dvIdPlayerNameOutlineSecondCustomColor ul li').attr({
        'class': 'in-active'
    });

    $("#dvIdColorNamePlayerNameOutlineSecond").html("");

    if (color) {
        var colorName = (color.Name) ? color.Name : color.colorName;
        var rgbHexaDecimal = (color.RgbHexadecimal) ? color.RgbHexadecimal : color.background.substring(color.background.indexOf(':') + 1);
        var colorId = (color.ColorId) ? color.ColorId : color.colorid;
        if (colorId) {
            $("#dvIdSelectedFillColorPlayerNameOutlineSecond").removeClass("slashImage")
            $("#dvIdSelectedFillColorPlayerNameOutlineSecond").attr({
                'alt': colorName,
                'displayname': colorName,
                'style': "background-color:" + rgbHexaDecimal

            });
            $("#dvIdColorNamePlayerNameOutlineSecond").html(colorName);
            $('#dvIdColorNamePlayerNameOutlineSecond').css('color', '#000');
            $("#ulColorComboBoxlistPlayerNameOutlineSecond li#colorid_" + colorId).attr("class", "active");
            $("#ulIdPlayerNameOutlineSecondCustomColor li#colorid_" + colorId).attr("class", "active");
        } else {
            $("#dvIdSelectedFillColorPlayerNameOutlineSecond").attr({
                'style': ""
            });
            $("#dvIdSelectedFillColorPlayerNameOutlineSecond").addClass("slashImage color_box_selected");
            $("#dvIdColorNamePlayerNameOutlineSecond").html("Optional");
            $('#dvIdColorNamePlayerNameOutlineSecond').css('color', '#C3C3C3');
        }
        GlobalInstance.getUniformConfigurationInstance().setPlayerNameInfo('fontOutline2Color', color);
    }
    else {
        $("#dvIdSelectedFillColorPlayerNameOutlineSecond").attr({
            'style': ""
        });
        $("#dvIdSelectedFillColorPlayerNameOutlineSecond").addClass("slashImage color_box_selected");
        $("#dvIdColorNamePlayerNameOutlineSecond").html("Optional");
        $('#dvIdColorNamePlayerNameOutlineSecond').css('color', '#C3C3C3');
    }
};

/**
 * Fetches the selected fontColor from uniform configuration (memory)
 * @param (defaultFontColor) First FontColor 
 * 
 * @return Object Selected style
 */
PlayerName.prototype.getSelectedFontOutline2Color = function(defaultOutline2Color) {
    var color = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('fontOutline2Color');
    if (color) {
        return color;
    }
    return defaultOutline2Color;
};

/**
 * Fetches the selected text from memory and sets the same 
 *  
 * @return Object Selected style
 */
PlayerName.prototype.setDefaultText = function() {
    var text = GlobalInstance.uniformConfigurationInstance.getPlayerNameInfo('text');
    if (text) {
        $('#inputExamplePlayerName').val(text);
    }
};
/**
 * This method sets the default uniform color
 * @returns {undefined}
 */

PlayerName.prototype.setDefaultUniformColor = function() {
    var currentStyle = GlobalInstance.getUniformConfigurationInstance().getStylesInfo();
    var styleFabrics = GlobalInstance.getFabricInstance().getFabricByStyleId(currentStyle.StyleId);
    var fabricLength = Utility.getObjectlength(styleFabrics);
    var colorObject = GlobalInstance.getUniformConfigurationInstance().getColorsInfo();
    if (!(fabricLength > 1 && (GlobalInstance.getUniformConfigurationInstance().getFabricClicked() || GlobalInstance.getUniformConfigurationInstance().getCustomizeTabClicked()))
            && Utility.getObjectlength(colorObject.uniformSecondaryColor) < 1 && Utility.getObjectlength(colorObject.uniformTertiaryColor) < 1) {
        $('.uniformColorBoxSecondary').css('background', '#000000');
        $('.uniformColorBoxTertiary').css('background', '#000000');
    }
};

/*
*
*This method returns currently selected anchorpoint object of player number type
*
*/

PlayerName.prototype.getCurrentSelectedAnchorPointtObject = function () {
    try {
        var thisObject = this;
        var savedAnchorPoints = GlobalInstance.getUniformConfigurationInstance().getAnchorPoints();
        var currentSelectedAnchorObject = GlobalInstance.getAnchorPointInstance().getSelectedAnchorObj();
        for (key in savedAnchorPoints) {
            var apData = savedAnchorPoints[key];
            if (apData.id == currentSelectedAnchorObject.id && apData.type == LOCATION_TYPE.get('secPlayerNameAnchorPanel')) {
                thisObject.currentSelectedPlayerNameAnchor = apData;
                break;
            }
        }
    } catch (e) {
        Log.error('PlayerNumber.prototype.getCurrentSelectedAnchorPoinytObject  ------' + e.message);
    }
};

PlayerName.prototype.getDefaultFontUrl = function () {

    var font = GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('font');
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

PlayerName.prototype.selectFontInCombo = function () {
    var selectedFont = GlobalInstance.getUniformConfigurationInstance().getPlayerNameInfo('font');
    if (selectedFont.fontid !== undefined) {
        $('#dvIdComboDropdownPlayerName').scrollTop($('#dvPlayerNameFontList_' + selectedFont.fontid).position().top);
        $('#dvPlayerNameFontList_' + selectedFont.fontid).addClass('active');
    } else {
        $('#dvIdComboDropdownPlayerName').scrollTop(true);
        $('#dvIdComboDropdownPlayerName div:eq(0)').addClass('active');
    }
};
