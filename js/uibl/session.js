/**
 * Constructor of Session
 * @returns {Session}
 */
function Session() {
    this.sessionInfo = new Object();
    this.requestUrl = WEB_SERVICE_URL.get('LOAD_SESSION_DATA', LOCAL);
    this.responseType = 'json';
    this.objCommHelper = new CommunicationHelper();
    this.objUtility = new Utility();
}
/**
 * This method is responsible to load Session
 * @param  isCache
 * @param sessionVariable
 * @returns {sessionInfo}
 */
Session.prototype.loadSession = function(isCache, sessionVariable) {
    try {
        if (sessionVariable != undefined && sessionVariable !== '' && sessionVariable !== null) {

            if (sessionVariable == 'Mock') {    //jer
                this.sessionInfo.AccountNumber = "";

                this.sessionInfo.AccountURL =
                    "";

                this.sessionInfo.AllowCustomization =
                    true;

                this.sessionInfo.CorrectionFeeAmount =
                    "25";

                this.sessionInfo.CorrectionFeeFeatureRequired =
                    "1";

                this.sessionInfo.CorrectionFeePromotionApplicable =
                    "0";

                this.sessionInfo.CreatedDate = Date.now();
                    //"2014-06-09T11:49:53.0780169-07:00";

                this.sessionInfo.DealerEmail =
                    "";

                this.sessionInfo.DealerId =
                    "";

                this.sessionInfo.DealerLogoPath =
                    "";

                this.sessionInfo.FromSingleItemAPI =
                    true; // false;

                this.sessionInfo.IsNewDealer =
                    true;

                this.sessionInfo.LPUrlGetMaxLength =
                    1000;

                this.sessionInfo.LandingPage =
                    "0";

                this.sessionInfo.LegacyProsphereConfiguratorUrl =
                    "";

                this.sessionInfo.MarkUpPrice =
                    0;

                this.sessionInfo.NewRetrievalCode =
                    "";

                this.sessionInfo.PriceList =
                    "Consumer";

                this.sessionInfo.RedirectURL =
                    "";

                this.sessionInfo.RedirectURLCancel =
                    "";

                this.sessionInfo.RetrievalCode =
                    "RC3AC6C0064F"; //"RC58C8A51EE2";

                this.sessionInfo.SessionVariable =
                    "j123";

                this.sessionInfo.SupportedSports =
                    "";

                this.sessionInfo.UserType =
                    "Customer";

                this.sessionInfo.WebOrderNumber =
                    "";
                
                objApp.init(this.sessionInfo);
            } else {               
                this.requestUrl += '?SessionVariable=' + sessionVariable;
                if (isCache === false) {
                    this.objCommHelper.callAjax(this.requestUrl, 'GET', null, this.responseType, null, this.fillSessionInfo.bind(this), null, null, null, null, null);
                    return null;
                }
                else {
                    return this.sessionInfo;
                }
            }
            
        } else {
            $('blanket').show();
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.displayErrorMessageDialogBox(TITLE.get('TITLE_ERROR'), MESSAGES.get('MESSAGE_SESSION_VALIDATION_MSG'));
            $('#dvLog').hide();
            return;
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
 * This method is responsible to fill session information
 * @param  response
 * @param  params
 * @returns {}
 */
Session.prototype.fillSessionInfo = function(response, params) {
    try {
        if (this.objUtility.validateResponseFormat(response)) {

            this.sessionInfo = response.ResponseData || null;
            this.sessionVariable = response.ResponseData.SessionVariable || null;

            objApp.init(this.sessionInfo);
        } else {
            Log.error("Error in API: Could not load session information");
            $('blanket').show();
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            // on session expire, show message box and on click ok, reload the parent url if accessible
            /*GlobalInstance.dialogBoxInstance.funcCallBack = function () {
                var curTime = (new Date()).getTime();
                if (location.href) {
                    var parentUrl = Utility.removeParamFromUrl('ts', parent.location.href);
                    parent.location.href = parentUrl + 'ts='+curTime;
                }
            };*/
            GlobalInstance.dialogBoxInstance.displayErrorMessageDialogBox(TITLE.get('TITLE_ERROR'), MESSAGES.get('MESSAGE_SESSION_EXPIRE'));
            $('#dvLog').hide();
            return;
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
 * This method is to initialize the load session
 * @param sessionVariable
 * @returns void
 */
Session.prototype.init = function(sessionVariable) {
    this.loadSession(false, sessionVariable);
};
