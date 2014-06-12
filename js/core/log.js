/**
 * TWA proshpere configurator
 * 
 * log.js is used to maintain logs
 * 
 * @package proshpere
 * @subpackage core
 */
/**
 * Constructor of Logger
 * @param {type} destinationTextarea
 * @param {type} isShowInTextBox
 * @returns {}
 */
function Logger(destinationTextarea, isShowInTextBox) {
    this.level = Log.Level.VERBOSE;
    this.textAreaOutPanel = destinationTextarea;

    this.isShowInTextBox = isShowInTextBox;
}
/**
 * This method is responsible for displaying logger textbox
 * @param {type} level
 * @param {type} text
 * @returns {}
 */
Logger.prototype.out = function (level, exception) {
    if (level > this.level) {
        return;
    }
    if (this.isShowInTextBox === true) {
        var eout = $("#" + this.textAreaOutPanel);
        var text = '';
        if (eout) {
            //if exception is an object, then it contains error/exception information
            if (Utility.getObjectlength(exception) > 0) {
                text = "Error description: " + exception.message + "\n\n";
                text += "Error filename: " + exception.fileName + "\n\n";
                text += "Error lineNumber: " + exception.lineNumber + "\n\n";
                text += "className: " + exception.className + "\n\n";
                text += "methodName: " + exception.methodName + "\n\n";
            } else {
                // if not object it is not error/exception and it is simple text
                text = exception;
            }
            eout.val(eout.val() + Log.Prefix[level] + ' ' + text + '\n');
            eout.attr('scrollTop', eout.attr('scrollHeight'));
        }
    } else {
        Log.updateLogOnServer(exception);// this will contain error/exception object
    }
};

/**
 * This method sets the level 
 * @param {type} level
 * @returns {nOldLevel}
 */
Logger.prototype.setLevel = function (level) {
    var nOldLevel = this.level;
    this.level = level;
    return nOldLevel;
};
/**
 * This method clears the log
 * @returns {void}
 */
Logger.prototype.clear = function () {

    if ($("#" + this.textAreaOutPanel).length > 0) {
        $("#" + this.textAreaOutPanel).val('');
    }
};

var Log = {
    instance: null,
    Level: {
        NONE: 1,
        FATAL: 2, // can not continue
        ERROR: 3, // bad enough
        WARNING: 4, // not good
        USERERROR: 5, // user mistakes
        DEBUG: 6, // use only for debugging, delete when not used
        INFO: 7, // few per sec
        IO: 8, // network I/O
        TRACE: 9, // (many) method calls
        VERBOSE: 10	// 100 per sec
    },
    Prefix: ['\n', '\n', '\nFATAL --> ', '\nERROR --> ', '\nWARN --> ', '\nUSER --> ', '\n##### --> ', '\nINFO --> ',
        '\nIO --> ', '\nTRACE -->', ' --> ' ],
    /**
     * To throw the run time fatal error
     * @param {type} sText
     * @returns {void}
     */
    fatal: function (sText) {
        if (Log.instance)
            Log.instance.out(Log.Level.FATAL, sText);
    },
    /**
     * To throw error
     * @param object objException
     * @returns void
     */
    error: function (objException) {
        if (Log.instance)
            Log.instance.out(Log.Level.ERROR, objException);
    },
    /**
     * To throw the warning
     * @param {type} sText
     * @returns {void}
     */
    warning: function (sText) {
        if (Log.instance)
            Log.instance.out(Log.Level.WARNING, sText);
    },
    /**
     * To throw the userError
     * @param {type} sText
     * @returns {void}
     */
    userError: function (sText) {
        if (Log.instance)
            Log.instance.out(Log.Level.USERERROR, sText);
    },
    /**
     * To throw the debug
     * @param {type} sText
     * @returns {vooid}
     */
    debug: function (sText) {
        if (Log.instance)
            Log.instance.out(Log.Level.DEBUG, sText);
    },
    /**
     * To display the info
     * @param {type} sText
     * @returns {void}
     */
    info: function (sText) {
        if (Log.instance)
            Log.instance.out(Log.Level.INFO, sText);
    },
    /**
     * 
     * @param {type} sText
     * @returns {void}
     */
    IO: function (sText) {
        if (Log.instance)
            Log.instance.out(Log.Level.IO, sText);
    },
    /**
     *to throw the trace 
     * @param {type} sText
     * @returns {undefined}
     */
    trace: function (sText) {
        try{
            if (Log.instance) {
                if (typeof sText == 'object') {
                    sText = JSON.stringify(sText);
                }
                Log.instance.out(Log.Level.TRACE, sText);
            }
        } catch (err) {
        }
    },
    /**
     * to throw the verbose
     * @param {type} sText
     * @returns {undefined}
     */
    verbose: function (sText) {
        if (Log.instance)
            Log.instance.out(Log.Level.VERBOSE, sText);
    },
    /**
     * 
     * @param {type} sDestinationTextarea
     * @param {type} isShowInTextBox
     * @returns {@exp;Log@pro;instance}
     */
    GetInstance: function (sDestinationTextarea, isShowInTextBox) {

        if (Log.instance == null) {
            Log.instance = new Logger(sDestinationTextarea, isShowInTextBox);
        }
        return Log.instance;
    },
    clear: function () {
        if (Log.instance)
            Log.instance.clear();
    },

    /**
     * Log the detials on the server
     * Example usage:
     *                "{loglevel: 'error', message:'Fetching json object in case of primary color ',fileName:'color.js', className:'Color', methodName:'setHtmlAndBind', lineNumber:'221'}"
     * @param object Object containing exception information to log on server
     * @returns void
    */
    updateLogOnServer: function (objException) {
        //if log flag is enabled, update logs on server
        // only the errors log will be updated to server
        if (CONFIG.get("UPDATE_LOG_ON_SERVER") && Log.instance.isShowInTextBox === false) {
            // if object is not null send logs to server
            if (Utility.getObjectlength(objException) > 0) {
                var requestURL = WEB_SERVICE_URL.get('SERVER_LOG_URL', 1);
                var objCommHelper = new CommunicationHelper();
                objCommHelper.callAjax(requestURL, 'POST', objException, 'json', null, function (objResponse) { alert(JSON.stringify(objResponse)); }, null, null, null, null, null);
            }

        }
    }
};
