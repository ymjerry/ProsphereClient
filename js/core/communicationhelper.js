/**
 * TWA proshpere configurator
 * 
 * communicationhelper.js is used to communicate with proshpere configurator web services 
 * and define Ajax functionality related functions and used in
 * all calls for API. Using jquery version jquery-1.9.0.js
 * 
 * @package proshpere
 * @subpackage core
 */

// set the initial parameter before any Ajax calls
$.ajaxSetup({
    // Disable caching of AJAX responses
    cache: false
});

/**
 * Class constructor to assign default values
 * 
 * @return void
 */
function CommunicationHelper() {
    this.funcCallBack1 = null;
    this.funcCallBack2 = null;
    this.funcCallBack3 = null;

    this.pCallback1 = null;
    this.pCallback2 = null;
    this.pCallback3 = null;

    this.msgDivId = null;
    this.requestParam = null;
    this.funcBeforeSend = null;
    this.urlToSend = null;
    this.startTime = '';
    this.endTime = '';
    this.totalDuration = '';
}

/**
 * Used to make Ajax calls on the basis of different set of parameters. Sets the
 * callback method and its param in Ajax class variables which will be used
 * further after successful response to call callback methods along with params
 * 
 * 
 * @param urlToSend a valid url
 * @param requestType type of request (GET,POST,PUT,DELETE etc)
 * @param requestParam parameters to be sent with Ajax calls, accepts json format and querystring format
 * @param responseType type of response (json,xml,html etc)
 * @param funcBeforeSendMethod method body to process operation before sending Ajax request
 * @param fCallback1 call back method body 1 which will called on successful response
 * @param paramCallback1 if params is set, will be available to use with call back method1
 * @param fCallback2 if params is set, will be available to use here
 * @param paramCallback2 if params is set, will be available to use with call back method2
 * @param fCallback3 if params is set, will be available to use here
 * @param paramCallback3 if params is set, will be available to use with call back method3
 * 
 * @return void
 */
CommunicationHelper.prototype.callAjax = function (urlToSend, requestType, requestParam,
        responseType, funcBeforeSendMethod, fCallback1, paramCallback1,
        fCallback2, paramCallback2, fCallback3, paramCallback3) {
    try {
        if (fCallback1 !== null) {
            this.funcCallBack1 = fCallback1;
            this.pCallback1 = paramCallback1;
        }

        if (fCallback2 !== null) {
            this.funcCallBack2 = fCallback2;
            this.pCallback2 = paramCallback2;
        }

        if (fCallback3 !== null) {
            this.funcCallBack3 = fCallback3;
            this.pCallback3 = paramCallback3;
        }
        if (requestParam !== null) {
            this.requestParam = requestParam;
        }
        
        this.urlToSend = urlToSend;
        
        if (urlToSend != '') {
            Log.trace('Request --> ' + urlToSend)
            this.startTime = new Date();
            $.ajax({
                type: requestType,
                url: urlToSend,
                processData: true,
                data: requestParam,
                dataType: responseType,
                error: this.onError.bind(this),
                success: this.onSuccess.bind(this),
                beforeSend: funcBeforeSendMethod
            });
        }
    } catch (err) {
        var txt;
        txt = "Error description cm helper: " + err.message + "\n\n";
        txt += "Error filename: " + err.fileName + "\n\n";
        txt += "Error --lineNumber: " + err.lineNumber + "\n\n";
        Log.trace(txt);
        
    }
};

/**
 * Used to handle error occurred while processing Ajax calls
 * 
 * @param jqXHR XHR object
 * @param textStatus status of text
 * @param errorThrown error message thrown on request
 * 
 * @return void
 */
CommunicationHelper.prototype.onError = function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.readyState == 0) { // if readystate is 0, request not initialized. one of the reason is internet not working
        GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
        GlobalInstance.dialogBoxInstance.displayShowMessageDialogBox(TITLE.get('GENERAL_WARNING'), MESSAGES.get('MESSAGE_INTERNET_NOT_WORKING'));
    }
    Log.error('CommunicationHelper.OnError error thrown is: ' + errorThrown + ',\ntext status is ' + textStatus + '\nurl is: ' + this.urlToSend);
};

/**
 * A callback method which processes the success operation after fetching the
 * response from Ajax. It calls the class method associated with callback method
 * along with parameter if any sent with each and every Ajax response
 * 
 * @param response a valid response from Ajax
 * 
 * @return void
 */
CommunicationHelper.prototype.onSuccess = function (response) {
    try {
        this.endTime = new Date();

        //to profile milliseconds, just do 
        this.totalDuration = this.endTime - this.startTime;
        if (response && response != null) {
            Log.trace('Response --> ' + this.urlToSend + '\nRESPONSE time >> ' + this.totalDuration + ' ms')
            if (this.funcCallBack1 !== null) {
                this.funcCallBack1(response, this.pCallback1); // fill data
                // with response
            }
            if (this.funcCallBack2 !== null)
                this.funcCallBack2(this.pCallback2); // call with initialized
            // param

            if (this.funcCallBack3 !== null)
                this.funcCallBack3(this.pCallback3); // call with initialized
            // param
        }
    } catch (ex) {
        Log.error(" CommunicationHelper.onSuccess Exception : " + ex.message);
    }
};
