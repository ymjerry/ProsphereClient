/**
 * TWA proshpere configurator
 * 
 * font.js is used to define sport related functions. 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 *
 * @return void
 */
function TextEffect() {
    this.textEffectList = new Object();
    this.textDecalList = new Object();
    this.requestUrl = WEB_SERVICE_URL.get('TEXT_EFFECT_LIBRARY', LOCAL);   //WEB_SERVICE_URL.get('TEXT_EFFECT_LIBRARY', useLocal);//
    this.requestUrlForTextDecal = WEB_SERVICE_URL.get('TEXT_DECAL_LIST', LOCAL);
    this.responseType = 'json';
    this.objCommHelper = new CommunicationHelper();
    this.objUtility = new Utility();
    this.funcCallBack = $.Callbacks('memory');
    this.objStraight = {
        "Name":CONFIG.get("STRAIGHT_TEXT_NAME"),//this value is used in case of straight text 
        "TextEffectCategorys": [
            {
                "TextEffectCategoryId": "s_eff",
                "Name": "Text",
                "TextEffects": [
                    {
                        "Width": 1898,
                        "Height": 929,
                        "TextBoxWidth": 1875,
                        "TextBoxHeight": 750,
                        "OffsetX": 12,
                        "OffsetY": 83,
                        FileLocation:null,
                        Name:CONFIG.get("STRAIGHT_TEXT_NAME")//this value is used in case of straight text 
                    }
                ]
            }
        ]
    };
}
;

/**
 * Performs a fetching sport list. If it fetches from web and go to set the sports list into the object and binds the click events with sports
 * If it fetches from cache, it returns the sport list object
 * 
 * @param isCache Returns the sports list if set to true, else fetches the data from web and sets into sports list object
 * @return Object
 */
TextEffect.prototype.init = function() {
    try {

        var params = {"applicationId": GlobalConfigurationData.applicationId, "customerId": null};
        this.objCommHelper.callAjax(this.requestUrl, 'GET', params, this.responseType, null, this.createTextEffectList.bind(this), null, null, null, null, null);
        
        //get text decal list
        this.getTextDecalList();
    }
    catch (err) {
    }
};

TextEffect.prototype.getTextDecalList = function() {
    var params = {"applicationId": GlobalInstance.getUniformConfigurationInstance().getApplicationId(), "customerId": null};
    var objCommHelperTextDecal = new CommunicationHelper();
    objCommHelperTextDecal.callAjax(this.requestUrlForTextDecal, 'GET', params, this.responseType, null, this.createTextDecalList.bind(this), null, null, null, null, null);
};

/**
 * Fills the sport list into the object after recieving the list from Web Service. After filling the data, it loads the HTML and 
 * binds the click event on sports name
 *
 * @param response Response from Web service in json format containing sports list
 * @param params
 * 
 * @return void
 */
TextEffect.prototype.createTextEffectList = function(response, params) {
    var thisObject = this;
    try {
        if (this.objUtility.validateResponseFormat(response, this.requestUrl)) {
            var tempObj = new Array();
            tempObj[0] = this.objStraight;
            $.each(response.ResponseData, function(key, textEffect) {
                tempObj[key + 1] = textEffect;
            });
           var textEffectList = tempObj;
            
            $.each(textEffectList, function(i, textEffect) {
                thisObject.textEffectList["_" + textEffect.TextEffectTypeId] = textEffect;
            });
            
            thisObject.funcCallBack.fire(textEffectList);
        } else {
            Log.error("Error in API >> " + this.requestUrl);
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
 * Fills the sport list into the object after recieving the list from Web Service. After filling the data, it loads the HTML and 
 * binds the click event on sports name
 *
 * @param response Response from Web service in json format containing sports list
 * @param params
 * 
 * @return void
 */
TextEffect.prototype.createTextDecalList = function(response, params) {
    var thisObject = this;
    try {
        if (this.objUtility.validateResponseFormat(response, this.requestUrlForTextDecal)) {
            $.each(response.ResponseData, function(i, textDecal) {
                thisObject.textDecalList["_" + textDecal.TextDecalFontId] = textDecal;
            });
             //thisObject.funcCallBack.fire(response.ResponseData);
        } else {
            Log.error("Error in API");
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
 * Adds the event binded on text effect list load completion to be fired 
 *@param  funcName selected function to add callback
 * @return void
 */
TextEffect.prototype.addCallback = function(funcName) {
    this.funcCallBack.add(funcName);
};
/**
 * removes the event binded on text effect list load completion to be fired 
 * @params funcName selected function to remove callback
 *
 * @return void
 */
TextEffect.prototype.removeCallback = function(funcName) {
    this.funcCallBack.remove(funcName);
};
/**
 * This method returns the text effect list
 * 
 * @returns {textEffectList}
 * 
 */
TextEffect.prototype.getTextEffectList = function() {
    return this.textEffectList;
};

TextEffect.prototype.getDecalList = function() {
    return this.textDecalList;
};

/**
 * This method returns the text effect by key
 * @param {type} key
 * @returns textEffectList
 * 
 */
TextEffect.prototype.getTextEffectByKey = function(key) {
    return this.textEffectList[key] || null;
};
/**
 * This method returns the text effect by key
 * @param {type} key
 * @returns textEffectList
 * 
 */
TextEffect.prototype.getTextDecalByKey = function(key) {
    return this.textDecalList[key] || null;
};