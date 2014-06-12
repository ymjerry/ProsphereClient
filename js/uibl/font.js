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
function Font() {
    this.fontList = new Object();
    this.requestUrl = WEB_SERVICE_URL.get('FONT_LIBRARY', LOCAL);
    this.responseType = 'json';
    this.objCommHelper = new CommunicationHelper();
    this.objUtility = new Utility();
    this.funcCallBack = $.Callbacks('memory');
}
;

/**
 * Initialize the font web service call
 * 
 * @return voide
 */
Font.prototype.init = function() {
    try {
        var params = {
            "applicationId": GlobalInstance.uniformConfigurationInstance.getApplicationId(),
            "customerId": null
        };
        this.objCommHelper.callAjax(this.requestUrl, 'GET', params, this.responseType, null, this.createFontList.bind(this), null, null, null, null, null);
    }
    catch (err) {
    }
};

/**
 * Fills the font list into the object after recieving the list from Web Service. 
 *
 * @param response Response from Web service in json format containing font list
 * @param params
 * 
 * @return void
 */
Font.prototype.createFontList = function(response, params) {
    var thisObject = this;
    try {
        if (this.objUtility.validateResponseFormat(response, this.requestUrl)) {
            $.each(response.ResponseData, function(i, font) {
                thisObject.fontList["_" + font.FontId] = font;
            });
            thisObject.funcCallBack.fire(thisObject.fontList);
        } else {
            Log.error("Error in API");
        }
    } catch (err) {
    }
};

/**
 * Sets the font Library HTML and binds the click event
 *
 * @return void
 */
Font.prototype.setHtmlAndBind = function() {
};

/**
 *To get font list 
 * @return object Font list
 */
Font.prototype.getFontList = function() {
    return this.fontList;
};

/**
 *To get font list based on key
 *@param key 
 * @return object selected font object
 */
Font.prototype.getFontByKey = function(key) {
    return this.fontList['_' + key] || null;
};


/**
 * Adds the event binded on Font list load completion to be fired 
 *@param funcName function name which needs to add the callback
 *
 * @return void
 */
Font.prototype.addCallback = function(funcName) {
    this.funcCallBack.add(funcName);
};
/**
 * removes the event binded on Font list load completion to be fired 
 *@param funcName function name which needs to remove the callback
 *
 * @return void
 */
Font.prototype.removeCallback = function(funcName) {
    this.funcCallBack.remove(funcName);
};
