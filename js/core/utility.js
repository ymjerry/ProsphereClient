/**
 * TWA proshpere configurator
 * 
 * utitlity.js is used to define common methods/augments used in application.
 * 
 * 
 * @package proshpere
 * @subpackage core
 */
//*******************DO NOT MODIFY THE BELOW CODE*******************************/
/**
 * Binding a function so that its property can be used
 * 
 * @oThis function body
 * @return function with applied arguments
 */

// code reference from the URL
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable
            // function
            throw new TypeError(
                    "Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
        }, fBound = function() {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
        };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
//*******************DO NOT MODIFY THE ABOVE CODE*******************************/

/**
 * Adds the value into the array
 * 
 * 
 * @return void
 */
Array.add = function(arrayToAdd, value) {
    arrayToAdd.push(value);
};

/**
 * Removes the value from the array
 * 
 * @param array arrayToCheck
 * @param mix elementToDelete
 * @returns void
 */
Array.remove = function(arrayToCheck, elementToDelete) {
    for (var i = 0; i < arrayToCheck.length; i++) {
        if (arrayToCheck[i] == elementToDelete)
            arrayToCheck.splice(i, 1);
    }
};

/**
 * Checks if the value exists in the array
 * 
 * @param array arrayToCheck
 * @param mix valueToFind
 * @returns Boolean
 */
Utility.isExist = function(arrayToCheck, valueToFind) {
    return $.inArray(valueToFind, arrayToCheck) > -1 ? true : false;
};


/**
 * Gets random value of an Array
 * 
 * 
 * @return Array value
 */
Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random() * this.length)];
};

/**
 * Class constructor to assign default values
 *
 * @return void
 */
function Utility() {
    this.requestType = 'GET';
    this.responseType = 'json';
    this.callingMethod = '';
}

/**
 * Performs minimum check character length operation on fields
 * 
 * @param fieldId field id to be checked with min character length
 * @param len length to be compared
 * 
 * @return void
 */
Utility.checkFieldMinLength = function(fieldId, len) {
    var fld = document.getElementById(fieldId);
    if ($('#' + fieldId).val().length < len) {
        fld.setCustomValidity(Messages._MESSAGE_MIN_LEN_REQUIRED + len);
    } else {
        fld.setCustomValidity('');
    }
};

/**
 * Performs maximum check character length operation on fields
 * 
 * @param fieldId field id to be checked with max character length
 * @param len length to be compared
 * 
 * @return void
 */
Utility.checkFieldMaxLength = function(fieldId, len) {
    var fld = document.getElementById(fieldId);
    if ($('#' + fieldId).val().length > len) {
        fld.setCustomValidity(Messages._MESSAGE_MAX_LEN_REQUIRED + len);
    } else {
        fld.setCustomValidity('');
    }
};
/**
 * Performs empty check on fields Sets the custom validator message in case of
 * empty field If the first character is space then reset the field value to blank
 * 
 * @param fieldId field id to be checked with empty value
 * 
 * @return boolean true and false
 */
Utility.checkFieldEmpty = function(fieldId) {
    if (!$.trim($('#' + fieldId).val()).length) {
        $('#' + fieldId).val('');
        return true;
    } else {
        return false;
    }
};

/**
 * Performs to regular expression check on field 
 * 
 * @param fieldId field id to be checked with regular expression
 * @param regexp regular expression
 * 
 * @return boolean true false
 */
Utility.checkRegularExpression = function(fieldId, regexp) {
    if (!(regexp.test($('#' + fieldId).val()))) {
        return false;
    } else {
        return true;
    }
};

/**
 * Performs to check valid email
 * 
 * @param fieldId field id to be check email 
 * 
 * @return boolean true false
 */
Utility.checkValidEmail = function(fieldId) {
    //var regexp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
  //  var regexp = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var regexp = /^[a-zA-Z][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/;
    if (Utility.checkRegularExpression(fieldId, regexp)) {
        return true;
    } else {
        return false;
    }
};
/**
 * Performs to check valid email
 * 
 * @param fieldId field id to be check email 
 * 
 * @return boolean true false
 */
Utility.isPhoneNumberValid = function(fieldId) {
    //var regexp = /^(\+91[\-\s]?)?[89]\d{9}$/;
    var regexp = CONFIG.get("PRO_PLUS_PHONE_REGEX");
    //var regexpInternational = /^\(\d{3}\)\s?\d{3}-\d{4}$/;

    if (Utility.checkRegularExpression(fieldId, regexp)) {
        return true;
    } else {
        return false;
    }
};

/**
 * Shows the message in element passed
 * 
 * @param elementID element id in which message will be shown
 * @param msg message to be shown in element id
 * 
 * @return void
 */
Utility.showMessage = function(elementID, msg) {
    this.showHideElement(elementID, SHOW_ACTION);
    jQuery("#" + elementID).html(msg);

};

/**
 * Returns the screen resolution
 * 
 * 
 * @return Object Screen resolution with height and width
 */
Utility.getScreenResolution = function() {
    return {
        width: $(document).width(),
        height: $(document).height()
    };
};

/**
 * Returns the length of given object
 * @param object 
 * @return Integer Length of object
 */
Utility.getObjectlength = function(object, caller) {
    //Log.debug(caller ? "caller is " + caller : '???');
    try {
        if (typeof object === 'object') {
            return object ? $.map(object, function(n, i) {
                return i;
            }).length : 0;
        } else {
            return 0;
        }
    } catch (e) {
        window.console && console.debug(e.message);
        window.console && console.debug("in error caller is " + caller);
        return 0;
    }

};

/**
 * Validates the Web service response 
 * 
 * @param res response object
 * 
 * @return Boolean true if response is valid, false otherwise
 */
Utility.prototype.validateResponseFormat = function(res, webServiceUrl) {
    var isValidResponse = true;
    webServiceUrl = webServiceUrl ? webServiceUrl : '';
    try {
        if (res != '') {
            if (res.ResponseStatus == CONFIG.get('WEBSERVICE_FAILURE_CODE')) {
                Log.error(MESSAGES.get('MESSAGE_TECH_ERROR') + ' with webservice faliure code: ' + CONFIG.get('WEBSERVICE_FAILURE_CODE') + '\nWeb service url is: ' + webServiceUrl);
                isValidResponse = false;
            }

            if (isValidResponse == true && res.Error != undefined && res.Error.ErrorCode !== undefined && res.Error.ErrorCode >= 0) {
                Log.error(MESSAGES.get('MESSAGE_TECH_ERROR') + ' with webservice Error code' + JSON.stringify(res.Error) + CONFIG.get('WEBSERVICE_FAILURE_CODE') + '\nWeb service url is: ' + webServiceUrl);
                isValidResponse = false;
            }

            if (isValidResponse == true && res.ResponseData !== undefined && res.ResponseData != '' && res.ResponseData.length <= 0) {
                Log.error(MESSAGES.get('MESSAGE_INVALID_REQUEST') + CONFIG.get('WEBSERVICE_FAILURE_CODE') + '\nWeb service url is: ' + webServiceUrl);
                isValidResponse = false;
            }
        } else {
            isValidResponse = false;
        }
        return isValidResponse;
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description util: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
        return isValidResponse;
    }
};

/**
 * Fetch the request parameter 
 * 
 * @param name name of the request parameter
 * 
 * @return string value of request parameter if found else null
 */
Utility.getParameterByName = function(name) {
    var queryString = (location.search != '') ? location.search : '';
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)", 'i'),
            results = regex.exec(queryString);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

/**
 * Removes the parameter from the provided url and return back
 * 
 * @param paramName Name of parameter to be removed
 * @param sourceURL Url from which the parameter will be removed
 * 
 * @return URL
 */
Utility.removeParamFromUrl = function(paramName, sourceURL) {
    var url = sourceURL.split("?")[0],
            param,
            paramsArr = [],
            queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        paramsArr = queryString.split("&");
        for (var i = paramsArr.length - 1; i >= 0; i -= 1) {
            param = paramsArr[i].split("=")[0];
            if (param === paramName) {
                paramsArr.splice(i, 1);
            }
        }
        url = url + "?" + paramsArr.join("&");
    }
    return url;
};

/**
 * Shows and hides the element
 * 
 * @param elements Element list collection of elements id which needs to be shown or hidden
 * @param action Show or hide action
 * 
 * @return void
 */
Utility.showHideElement = function(elements, action) {

    $.each(elements, function(i, ele) {
        if (action == CONFIG.get('HIDE'))
            $("#" + ele).hide(10);
        else if (action == CONFIG.get('SHOW'))
            $("#" + ele).fadeIn(800);
    });
};

/**
 * Gets the querystring parameters from json object
 * 
 * @param requestParam Request parmaeters in the form of Json object
 * 
 * @return String parameter string for request
 */
Utility.getQuerystringByJson = function(requestParam) {
    if (requestParam) {
        return decodeURIComponent($.param(requestParam));
    }
    else {
        return '';
    }
};

/**
 * Checks if all colors are selected in color screen
 * 
 * 
 * @return boolean returns true if all three colors, false otherwise
 */
Utility.isColorSelected = function() {
    try {
        var objColor = GlobalInstance.uniformConfigurationInstance.getColorsInfo();
        return (objColor.uniformPrimaryColor && objColor.uniformSecondaryColor && objColor.uniformTertiaryColor);
    }
    catch (e) {
        return false;
    }
};




/**
 * Checks if all colors are selected in color screen
 * 
 * 
 * @return boolean returns true if all three colors, false otherwise
 */
Utility.imitatePlaceHolderForIE = function() {
    var input = document.createElement("input");
    if (('placeholder' in input) == false) {
        $('[placeholder]').focus(function() {
            var i = $(this);
            if (i.val() == i.attr('placeholder')) {
                i.val('').removeClass('placeholder');
                if (i.hasClass('password')) {
                    i.removeClass('password');
                    this.type = 'password';
                }
            }
        }).blur(function() {
            var i = $(this);
            if (i.val() == '' || i.val() == i.attr('placeholder')) {
                if (this.type == 'password') {
                    i.addClass('password');
                    this.type = 'text';
                }
                i.addClass('placeholder').val(i.attr('placeholder'));
            }
        }).blur().parents('form').submit(function() {
            $(this).find('[placeholder]').each(function() {
                var i = $(this);
                if (i.val() == i.attr('placeholder'))
                    i.val('');
            });
        });
    }
};

/**
 * Replace all occurence of search parameter in search string with given value
 *  * 
 * @return Replaced string
 */
Utility.replaceAll = function(toFind, valueToReplace, searchString) {
    return searchString.replace(new RegExp(toFind, "g"), valueToReplace);
};

/**
 * Handles the length limit of input type
 * @param {type} maxLength , limit length
 * @param {type} ta , html element of input type
 * @returns {undefined}
 */
Utility.handleLengthLimit = function(maxLength, ta) {
    try {
        if (ta.value.length > maxLength) {
            ta.value = ta.value.substring(0, maxLength);
        }
    } catch (e) {
    }
};

/**
 * Checks if browser is IE
 * 
 * @return Boolean True if browser is IE, false otherwise
 */
Utility.isBrowserIE = function() {
    return (navigator.userAgent.match(/msie/i) && document.domain != window.location.hostname);
};

/**
 * This method is responsible for counting the Layers for a selected grphic
 * @param  layerArray
 * @returns layerCount
 */
Utility.getGraphicLayerCount = function(layerArray) {
    var layerCount = 0;
    GlobalInstance.selectGraphicsInstance = GlobalInstance.getSelectGraphicsInstance()
    GlobalInstance.selectGraphicsInstance.colorizedId1 = CONFIG.get('COLORIZEID_NONE');
    GlobalInstance.selectGraphicsInstance.colorizedId2 = CONFIG.get('COLORIZEID_NONE');
    GlobalInstance.selectGraphicsInstance.colorizedId3 = CONFIG.get('COLORIZEID_NONE');
    for (var i = 0; i < layerArray.length; i++) {
        if (layerArray[i].ColorizeId != CONFIG.get('COLORIZEID_NONE')) {
            layerCount++;
            if (layerArray[i].ColorizeId == CONFIG.get('COLORIZEID_COLOR_1')) {
                GlobalInstance.selectGraphicsInstance.colorizedId1 = layerArray[i].ColorizeId;
            }
            if (layerArray[i].ColorizeId == CONFIG.get('COLORIZEID_COLOR_2')) {
                GlobalInstance.selectGraphicsInstance.colorizedId2 = layerArray[i].ColorizeId;
            }
            if (layerArray[i].ColorizeId == CONFIG.get('COLORIZEID_COLOR_3')) {
                GlobalInstance.selectGraphicsInstance.colorizedId3 = layerArray[i].ColorizeId;
            }
        }
    }
    return layerCount;
};

/**
 * This method loads the image
 * @param elementId - id where image to be set
 * @param  src - imaage source
 * @param  callBackSuccess - on success case
 * @param  callBackError - on error case
 
 * @returns void
 */
Utility.loadImage = function(elementId, src, callBackSuccess, callBackError) {
    var imageObject = new Image();
    $.startProcess();
    imageObject.onload = function() {
        //$('#' + elementId).show();
        
        $('#' + elementId).css('visibility', 'visible');
        $('#' + elementId).attr('src', imageObject.src);
        if (callBackSuccess) {
            callBackSuccess(elementId, imageObject);
        }
        $.doneProcess();
    };
    imageObject.onerror = function() {
        if (callBackError) {
            callBackError(elementId);
            $.doneProcess();
        }
    };
    imageObject.src = src;
};

/**
 * Returns the suitable price from price object
 * @param {type} FabricPriceObject
 * @returns {Number}
 */
Utility.getFabricPrice = function(FabricPriceObject) {
    try {
        if (objApp.priceList) {
            return parseFloat(FabricPriceObject[PRICE_MAPPING.get(objApp.priceList)]);
        } else {
            return parseFloat(FabricPriceObject[PRICE_MAPPING.get('Standard')]);
        }
    } catch (e) {
        return 0;
    }
};

/**
 * return the price list mapping to be used
 * @returns {String|@exp;PRICE_LIST_MAPPING@call;get}
 */
Utility.getFabricPriceList = function() {
    try {
        if (objApp.priceList) {
            return PRICE_LIST_MAPPING.get(objApp.priceList);
        } else {
            return '';
        }
    } catch (e) {
        return '';
    }
};


/**
 * 
 * @param {type} styleId
 * @param {type} designNumber
 * @param {type} isYouth
 * @param {type} useCopiedStyle
 * @returns Object
 */
Utility.getDesignObject = function(styleId, designNumber, isYouth, useCopiedStyle) {
    if (typeof (useCopiedStyle) == 'undefined') {
        var useCopiedStyle = true;
    }
    var copyOfStyleDesigns = null;
    if(isYouth){
        copyOfStyleDesigns = GlobalInstance.uniformConfigurationInstance.getCopyOfStyleYouthDesignsInfo();
    }else{
        copyOfStyleDesigns = GlobalInstance.uniformConfigurationInstance.getCopyOfStyleDesignsInfo();    
    }
    
    if (!$.isEmptyObject(copyOfStyleDesigns) && useCopiedStyle == true && styleId == copyOfStyleDesigns.StyleId) {
        return copyOfStyleDesigns;
    }
    else {
    if (styleId && designNumber) {
            var matchingDesigns = null;
            if (isYouth) {
                matchingDesigns = GlobalInstance.getStyleAndDesignInstance().youthStyleDesigns["_" + styleId];
//                var copiedYouthStyleInfo = GlobalInstance.uniformConfigurationInstance.getCopiedYouthStylesInfo();
//                if (copiedYouthStyleInfo && useCopiedStyle && copiedYouthStyleInfo.StyleId == styleId) {
//                    matchingDesigns = copiedYouthStyleInfo.Designs;
//                } else {
//                    matchingDesigns = GlobalInstance.getStyleAndDesignInstance().youthStyleDesigns["_" + styleId];
//                }
            } else {
                var copiedStyleInfo = GlobalInstance.uniformConfigurationInstance.getCopiedStylesInfo();
                if (copiedStyleInfo && useCopiedStyle && copiedStyleInfo.StyleId == styleId) {
                    matchingDesigns = copiedStyleInfo.Designs
                } else {
                    matchingDesigns = GlobalInstance.getStyleAndDesignInstance().styleDesigns["_" + styleId];
                }
            }

            if (matchingDesigns) {
                for (var key in matchingDesigns) {
                    var designObject = matchingDesigns[key];
                    if (designObject.DesignNumber == designNumber) {
                        if (isYouth) {
                            GlobalInstance.uniformConfigurationInstance.setCopyOfStyleYouthDesignsInfo(designObject);
                        }
                        else{
                            GlobalInstance.uniformConfigurationInstance.setCopyOfStyleDesignsInfo(designObject);
                        }
                        return designObject;
                    }
                }
            }
        }
    }

    return null;
};

Utility.stringToBoolean = function(string) {
    switch (string.toLowerCase()) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
        case null:
            return false;
        default:
            return Boolean(string);
    }
}

/*
* Retuens TaaColorId of a color if exist , otherwise return its colorId
**/
Utility.getTaaColorId = function (colorId) {
    if (colorId) {
        var colorObject = GlobalInstance.getColorInstance().getColorByKey('_' + colorId);
        return (colorObject.TaaColorId) ? colorObject.TaaColorId : colorId;
    } else {
        return "";
    }
};


/*
*This method converts cmyk to hex cmyk
*/

Utility.cmykToHexCmyk = function (data) {
    try {
        var cyan = -1, magenta = -1, yellow = -1, black = -1;
        var cmykHexadecimal = '';
        cyan = data.Cyan;
        magenta = data.Magenta;
        yellow = data.Yellow;
        black = data.Black;
        if ((cyan >= 0) && (cyan <= 100) && (magenta >= 0) && (magenta <= 100) && (yellow >= 0) && (yellow <= 100) && (black >= 0) && (black <= 100)) {
            cmykHexadecimal = Utility.decimalToHex(Math.floor((cyan / 16) * 2.55)) + Utility.decimalToHex(Math.floor((cyan * 2.55) % 16))
                + Utility.decimalToHex(Math.floor((magenta / 16) * 2.55)) + Utility.decimalToHex(Math.floor((magenta * 2.55) % 16))
                + Utility.decimalToHex(Math.floor((yellow / 16) * 2.55)) + Utility.decimalToHex(Math.floor((yellow * 2.55) % 16))
                + Utility.decimalToHex(Math.floor((black / 16) * 2.55)) + Utility.decimalToHex(Math.floor((black * 2.55) % 16))
                + '00';
        }
    } catch (e) {
        Log.error("Error in converting CMYK to CMYK Hex-----" + e.message);
    }
    return "#" + cmykHexadecimal;
}

/*
*This method converts decimal to hex
*/
Utility.decimalToHex = function (decimalColorCode, padding) {
    try {
        var hex = Number(decimalColorCode).toString(16);
        padding = typeof (padding) === 'undefined' || padding === null ? padding = 1 : padding;
        while (hex.length < padding)
            hex = '0' + hex;
    } catch (e) {
        Log.trace('Error in Decimal to Hex in Utility-----' + e.message);
    }
    return hex.toUpperCase();
}
