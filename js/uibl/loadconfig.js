/**
 * TWA proshpere configurator
 * 
 * loadconfig.js used to get configurator data from Server and set in unifrom configuration object
 * 
 * TWA proshpere configurator
 * @subpackage uibl
 */

/**
 * Class constructor to assign default values
 * 
 * @return {void}
 */
function LoadConfig() {
    this.loadConfigUrlByRetrievalId = WEB_SERVICE_URL.get('LOAD_CONFIG', LOCAL);
    this.loadConfigUrlByUserId = WEB_SERVICE_URL.get('LOAD_CONFIG_UID', LOCAL);
    this.getUpdatedUplodedGraphicInfoUrl = WEB_SERVICE_URL.get('GET_UPDATED_ANCHOR_POINT_IMAGES_INFO', LOCAL);
    this.responseType = 'json';
    this.objCommHelper = new CommunicationHelper();
    this.objUtility = new Utility();
    this.isConfigLoaded = false;
    this.isValidRetrieveCode = false;
    this.configResponse = null;
}

/**
 * Performs a fetching configurator data from server APIs and go to set the configurator data into the object
 * 
 * @param {intiger} rid
 * @returns {void}
 */
LoadConfig.prototype.getUniformConfiguration = function (rid) {
    var params = {
        "rid": rid
    };
    try {
        this.objCommHelper.callAjax(this.loadConfigUrlByRetrievalId, 'GET',
                params,
                this.responseType, null, this.loadUniformConfiguration.bind(this), params, null, null, null, null);
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description loadconfig 41:" + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
 * Fills the configurator data into the object after recieving the list from Web Service and load the pages 
 * 
 * @param {type} response from web server
 * @param {type} params
 * @returns {void}
 */
LoadConfig.prototype.loadUniformConfiguration = function (response, params) {
    try {
        if (this.objUtility.validateResponseFormat(response, this.loadConfigUrlByRetrievalId) && response.ResponseData[0] != null && response.ResponseData[0].UniformConfiguration != undefined) {
            GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
            this.configResponse = response;
            var anchorPointUploadImages = response.ResponseData[0].LocalConfiguration.uniformConfig.anchorPointsUploadedImages;


            if (typeof anchorPointUploadImages == 'undefined') {
                var anchorPointInfo = response.ResponseData[0].LocalConfiguration.uniformConfig.anchorpoints;
                if (anchorPointInfo) {
                    GlobalInstance.uniformConfigurationInstance.setAnchorPoints(anchorPointInfo);
                }
                this.setUniformConfiguration(response, null);
            } else {
                this.getUpdatedUplodedGraphicInfo(anchorPointUploadImages);
            }
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description loadconfig 73: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
 * Fills the configurator data into the object after recieving the list from Web Service and load the pages 
 * 
 * @param {type} response from web server
 * @param {type} params
 * @returns {void}
 */
LoadConfig.prototype.setUniformConfiguration = function (response, params) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();

    try {
        if (this.objUtility.validateResponseFormat(response, this.getUpdatedUplodedGraphicInfoUrl) && response.ResponseData[0] != null) {

            // var uniformConfigATG = response.ResponseData[0].UniformConfiguration.uniformConfig;
            var uniformConfigLocal = this.configResponse.ResponseData[0].LocalConfiguration.uniformConfig;
            var uniformConfigServer = this.configResponse.ResponseData[0];

            // update the updated upload graphic image in anchor points if GA fixed true
            this.updateAnchorPointUploadImage(response, uniformConfigLocal.anchorpoints);

            /****************************** Unifrom Config Client Required values *********************/
            GlobalInstance.uniformConfigurationInstance.setUserInfo(null, uniformConfigLocal.userInfo);
            if (objApp.sessionResponseData.FromSingleItemAPI ) {
                if(objApp.sessionResponseData.DealerEmail !=''){
                    GlobalInstance.uniformConfigurationInstance.setUserInfo('email', objApp.sessionResponseData.DealerEmail);
                }
                else{
                    GlobalInstance.uniformConfigurationInstance.setUserInfo('email', '');
                }
            } else if (objApp.sessionResponseData.UserType == CONFIG.get('USER_TYPE_CUSTOMER')) {
                GlobalInstance.uniformConfigurationInstance.setUserInfo('email', '');
            }
            
            GlobalInstance.uniformConfigurationInstance.setCategoryInfo(uniformConfigLocal.categoryInfo);
            GlobalInstance.uniformConfigurationInstance.setGenderInfo(uniformConfigLocal.genderInfo);
            GlobalInstance.uniformConfigurationInstance.setYouthGenderInfo(uniformConfigLocal.youthGenderInfo);
            GlobalInstance.uniformConfigurationInstance.setStylesInfo(uniformConfigLocal.stylesInfo);
            GlobalInstance.uniformConfigurationInstance.setYouthStylesInfo(uniformConfigLocal.youthStyleInfo);
            GlobalInstance.uniformConfigurationInstance.setDesignsInfo(uniformConfigLocal.designsInfo);
            GlobalInstance.uniformConfigurationInstance.setClickedGraphicsInfo('', uniformConfigLocal.clickedGraphicInfo); // Keep the clicked graphics info

            GlobalInstance.uniformConfigurationInstance.setColorsInfo('uniformPrimaryColor', uniformConfigLocal.colorsInfo.uniformPrimaryColor);
            GlobalInstance.uniformConfigurationInstance.setColorsInfo('uniformSecondaryColor', uniformConfigLocal.colorsInfo.uniformSecondaryColor);
            GlobalInstance.uniformConfigurationInstance.setColorsInfo('uniformTertiaryColor', uniformConfigLocal.colorsInfo.uniformTertiaryColor);

            if (uniformConfigLocal.fabricsInfo) {
                GlobalInstance.uniformConfigurationInstance.setFabricsInfo(uniformConfigLocal.fabricsInfo);
            }
            if (uniformConfigLocal.playerNumberInfo) {
                GlobalInstance.uniformConfigurationInstance.setPlayerNumberInfo(null, uniformConfigLocal.playerNumberInfo);
            }
            if (uniformConfigLocal.playerNameInfo) {
                GlobalInstance.uniformConfigurationInstance.setPlayerNameInfo(null, uniformConfigLocal.playerNameInfo);
            }
            if (uniformConfigLocal.teamNameInfo) {
                GlobalInstance.uniformConfigurationInstance.setTeamNameInfo(null, uniformConfigLocal.teamNameInfo);
            }
            if (uniformConfigLocal.otherTextInfo) {
                GlobalInstance.uniformConfigurationInstance.setOtherTextInfo(null, uniformConfigLocal.otherTextInfo);
            }
            if (uniformConfigLocal.rosterPlayerInfo) {
                GlobalInstance.uniformConfigurationInstance.setRosterPlayerInfo(null, uniformConfigLocal.rosterPlayerInfo);
            }
            if (uniformConfigLocal.graphicInfo) {
                GlobalInstance.uniformConfigurationInstance.setSelectGraphicInfo(null, uniformConfigLocal.graphicInfo);
            }

            /********************** Server Required Values **************************/
            GlobalInstance.uniformConfigurationInstance.setRetrieveCode(uniformConfigServer.RetrievalCode);
            if (objApp.sessionResponseData.FromSingleItemAPI) {
                GlobalInstance.uniformConfigurationInstance.setOrderName('');
            } else {
                GlobalInstance.uniformConfigurationInstance.setOrderName(uniformConfigServer.OrderName);
            }

            GlobalInstance.uniformConfigurationInstance.setTopAvailable(uniformConfigServer.TopAvailable);
            GlobalInstance.uniformConfigurationInstance.setBottomAvailable(uniformConfigServer.BottomAvailable);
            GlobalInstance.uniformConfigurationInstance.setPantAvailable(uniformConfigServer.PantAvailable);
            //GlobalInstance.uniformConfigurationInstance.setUserId(uniformConfigServer.UserId);
            var sessionInfoFromConfig = JSON.parse(JSON.stringify(uniformConfigLocal.sessionInformation));
            GlobalInstance.uniformConfigurationInstance.setBirdEyeView(uniformConfigLocal.birdEyeView);
            GlobalInstance.uniformConfigurationInstance.setRosterBirdEyeView(uniformConfigLocal.rosterBirdEyeView);

            if (sessionInfoFromConfig.RetrievalCode !== undefined)
                delete sessionInfoFromConfig.RetrievalCode;
            if (sessionInfoFromConfig.SessionVariable !== undefined)
                delete sessionInfoFromConfig.SessionVariable;

            GlobalInstance.uniformConfigurationInstance.setSessionInformation(sessionInfoFromConfig);

            this.isConfigLoaded = true;
        } else {
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.displayErrorMessageDialogBox(TITLE.get('TITLE_RESPONSE_VALID_RETRIEVAL_CODE'), MESSAGES.get('MESSAGE_RESPONSE_VALID_RETRIEVAL_CODE'));
        }
        isFirstTimeLoadFromRC = true;
        $(document).trigger("loadDefaults", null);
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description loadconfig 130: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};
/**
 * Performs a fetching dearler Uniform Configuration List using load config server api and go to set html 
 * 
 * @param {intiger} uid
 * @returns {void}
 */
LoadConfig.prototype.getUniformConfigurationList = function (uid) {
    try {
        var params = {
            "uid": uid
        };
        this.objCommHelper.callAjax(this.loadConfigUrlByUserId, 'GET', params, this.responseType, null, this.loadUniformConfigurationList.bind(this), params, null, null, null, null);
        return null;

    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description loadconfig 154: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};



/**
 * Loads the uniform configuration list into the object after recieving the list from Web Service and bind the click event
 *
 * @param {object} response Response from Web service in json format 
 * @param {object} params 
 * 
 * @return {void}
 */
LoadConfig.prototype.loadUniformConfigurationList = function (response, params) {
    GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
    //GlobalInstance.uniformConfigurationInstance.setUserId(params.uid);
    GlobalInstance.uniformConfigurationInstance.setAccountNumber(params.uid);

    var rows = new Array();
    if (this.objUtility.validateResponseFormat(response, this.loadConfigUrlByUserId)) {
        // set uid in unifrom configuration
        var savedUniform = response.ResponseData;
        //var uniformData = [];
        $(savedUniform).each(function (i, uniform) {
            var retrieveCode = uniform.RetrievalCode;
            var orderName = uniform.OrderName;
            var saveDate = uniform.SaveDate;
            var sport = uniform.CategoryName;
            var top = uniform.TopAvailable;
            var bottom = uniform.BottomAvailable;
            var pant = uniform.PantAvailable;

            var item = '';

            if (top)
                item += CONFIG.get('TOP_DISPLAY_NAME');
            if (bottom) {
                if (item)
                    item += '/';
                item += CONFIG.get('BOTTOM_DISPLAY_NAME');
            }

            saveDate = saveDate.split('T');

            rows.push({ "cell": [retrieveCode, orderName, sport, item, retrieveCode, saveDate[0]] });
            //uniformData.push([orderName, sport, item, retrieveCode, saveDate[0]]);
        });

        //add table
        $('#dvSavedUniformDG').html('<table class="flexme" style="display: block"></table>');

        //create table data objeect
        var data = {
            "total": rows.length,
            "page": "1",
            "rows": rows
        };

        $('.flexme').flexigrid({
            colModel: [
                { name: 'retrieval_code_hidden', display: 'Retrieval Code', sortable: true, width: 98, align: 'left', hide: true },
                { name: 'savedesign', display: 'Your Saved Designs', sortable: true, width: 110, align: 'left', hide: false },
                { name: 'sport', display: 'Sport', sortable: true, width: 48, align: 'left', hide: false },
                { name: 'items', display: 'Items', sortable: true, width: 78, align: 'left', hide: false },
                { name: 'retrieval', display: 'Retrieval Code', sortable: true, width: 98, align: 'left', hide: false },
                { name: 'date', display: 'Date', sortable: true, width: 56, align: 'left', hide: false }],
            sortable: true,
            useRp: true,
            sortname: 'date',
            sortorder: 'desc',
            resizable: false,
            height: '100',
            striped: false,
            singleSelect: true,
            showToggleBtn: false,
            nohresize: true,
            novresize: true,
            showTableToggleBtn: true,
            dataType: 'json',
            onChangeSort: function (name, order) {
                sortGrid(".flexme", order);
                setTimeout(function () {
                    $('.flexme').flexReload();
                }, 10);
            }
        });
        //add data and reload list
        $('.flexme').flexAddData(data).flexReload();

        //trigger the sorting event on table
        setTimeout(function () {
            sortGrid(".flexme", 'desc');
        }, 10);


        //set border style as none
        $('.flexigrid div.bDiv').css('border-style', 'none');
        $('.flexigrid div.hDiv').css('border-style', 'none');

        //bind row click event
        $(".flexme tbody tr").click(function (event) {
            try {
                var retrievalCode = $(this).children().eq(0).text().trim();
                $('#txtRetrievalCode').addClass('active').val(retrievalCode);
                $('#dvRetrieveUniform').trigger('click');
            } catch (e) {
            }
        });
    }
};
/**
 * Check uniform loaded or not
 * 
 * @return {boolean} true false
 */
LoadConfig.prototype.isLoaded = function () {
    return this.isConfigLoaded;
};

/**
 * Check Retrieve code valid or not by getting response from server
 * 
 * @param {intiger} rid
 * @returns {void}
 */
LoadConfig.prototype.validateRetrieveCode = function (rid) {
    var params = {
        "rid": rid
    };
    try {
        this.objCommHelper.callAjax(this.loadConfigUrlByRetrievalId, 'GET',
                params,
                this.responseType, null, this.checkValidRetrieveCode.bind(this), params, null, null, null, null);
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description loadconfig 294: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
 * Check Valid RetrieveCode or not and set flag
 * 
 * @param {object} response Response from Web service in json format 
 * @param {object} params
 * @returns {void}
 */
LoadConfig.prototype.checkValidRetrieveCode = function (response, params) {
    try {
        if (this.objUtility.validateResponseFormat(response, this.loadConfigUrlByRetrievalId) && response.ResponseData[0] != null && response.ResponseData[0].UniformConfiguration != undefined) {
            this.isValidRetrieveCode = true;
            if (this.isValidRetrieveCode) {
                GlobalInstance.uniformConfigurationInstance = GlobalInstance.getUniformConfigurationInstance();
                var sessionVariable = GlobalInstance.uniformConfigurationInstance.getSessionVariable();
                var querystring = '?rid=' + params.rid;
                if (sessionVariable != null && sessionVariable != '')
                    querystring += '&sessionVariable=' + sessionVariable;
                window.onbeforeunload = null;
                window.location.href = (window.location.href.split('?')[0]).replace(/#/, "") + querystring;
            }
        } else {
            GlobalInstance.dialogBoxInstance = GlobalInstance.getDialogBoxInstance();
            GlobalInstance.dialogBoxInstance.displayErrorMessageDialogBox(TITLE.get('TITLE_RESPONSE_VALID_RETRIEVAL_CODE'), MESSAGES.get('MESSAGE_RESPONSE_VALID_RETRIEVAL_CODE'));
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description loadconfig 328: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};

/**
 * return flag value that retrieveCode valid or not
 * 
 * @return {boolean} true false
 */
LoadConfig.prototype.isValidRetrieveCodeOrNot = function () {
    return this.isValidRetrieveCode;
};

/**
 * it is a local method used for sorting the table
 * @param {type} table
 * @param {type} order
 * @returns {undefined}
 */
function sortGrid(table, order) {
    // Remove all characters in c from s. 
    var stripChar = function (s, c) {
        var r = "";
        for (var i = 0; i < s.length; i++) {
            r += c.indexOf(s.charAt(i)) >= 0 ? "" : s.charAt(i);
        }
        return r;
    };

    // Test for characters accepted in numeric values. 
    var isNumeric = function (s) {
        var valid = "0123456789.,- ";
        var result = true;
        var c;
        for (var i = 0; i < s.length && result; i++) {
            c = s.charAt(i);
            if (valid.indexOf(c) <= -1) {
                result = false;
            }
        }
        return result;
    };

    // Sort table rows. 
    var asc = order == "asc";
    var rows = $(table).find("tbody > tr").get();
    var column = $(table).parent(".bDiv").siblings(".hDiv").find
            ("table tr th").index($("th.sorted", ".flexigrid:has(" + table +
            ")"));
    rows.sort(function (a, b) {
        var keyA = $(asc ? a : b).children("td").eq(column).text
                ().toUpperCase();
        var keyB = $(asc ? b : a).children("td").eq(column).text
                ().toUpperCase();
        if ((isNumeric(keyA) || keyA.length < 1) && (isNumeric(keyB) ||
                keyB.length < 1)) {
            keyA = stripChar(keyA, ", -");
            keyB = stripChar(keyB, ", -");
            if (keyA.length < 1)
                keyA = 0;
            if (keyB.length < 1)
                keyB = 0;
            keyA = new Number(parseFloat(keyA));
            keyB = new Number(parseFloat(keyB));
        }
        return keyA > keyB ? 1 : keyA < keyB ? -1 : 0;
    });

    // Rebuild the table body. 
    $.each(rows, function (index, row) {
        $(table).children("tbody").append(row);
    });

    // Fix styles 
    $(table).find("tr").removeClass("erow");  // Clear the striping. 
    $(table).find("tr:odd").addClass("erow"); // Add striping to odd numbered rows. 
    $(table).find("td.sorted").removeClass("sorted"); // Clear sortedclass from table cells. 
    $(table).find("tr").each(function () {
        $(this).find("td:nth(" + column + ")").addClass("sorted");  // Add sorted class to sorted column cells. 
    });
}


/**
 * Get Updated uploaded graphic images information which are placed in anchor points and reqired correction
 * 
 * @param {object} Object containing uploaded graphics info

 * @returns {void}
 */

LoadConfig.prototype.getUpdatedUplodedGraphicInfo = function (updatedUploadGraphicsInfo) {
    try {
        var params = updatedUploadGraphicsInfo;

        this.objCommHelper.callAjax(this.getUpdatedUplodedGraphicInfoUrl, 'POST', JSON.stringify(params), this.responseType, null, this.setUniformConfiguration.bind(this), null, null, null, null, null);

    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description loadconfig 154: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};


/**
 * Update the uploaded graphic images information which are corrected by Graphic analyst to be shown on Model preview
 * 
 * @param {object} Object containing updated upload graphics info

 * @returns {void}
 */

LoadConfig.prototype.updateAnchorPointUploadImage = function (updatedUploadGraphicsInfoResponse, anchorponintInfo) {
    try {
        var updatedUploadGraphicsInfo = updatedUploadGraphicsInfoResponse.ResponseData;
        if (Utility.getObjectlength(updatedUploadGraphicsInfo) > 0) {
            for (var key in updatedUploadGraphicsInfo) {
                if (updatedUploadGraphicsInfo[key] != undefined && Number(key)) {

                    updatedGraphics = updatedUploadGraphicsInfo[key];

                    for (var anchorKey in anchorponintInfo) {
                        if (updatedGraphics.AnchorPointId == anchorKey) {
                            if (updatedGraphics.GAFixed != undefined && updatedGraphics.GAFixed == true) {
                                anchorponintInfo[anchorKey].GraphicName = updatedGraphics.ImageUrl;
                                anchorponintInfo[anchorKey].GraphicUrl = updatedGraphics.ImageUrl;
                                break;
                            }
                        }
                    }
                }
            }

            if (anchorponintInfo) {
                GlobalInstance.uniformConfigurationInstance.setAnchorPoints(anchorponintInfo);
            }
        }
        else {
            if (anchorponintInfo) {
                GlobalInstance.uniformConfigurationInstance.setAnchorPoints(anchorponintInfo);
            }
        }
    } catch (err) {
        if (CONFIG.get('DEBUG') === true) {
            txt = "Error description loadconfig 498: " + err.message + "\n\n";
            txt += "Error filename: " + err.fileName + "\n\n";
            txt += "Error lineNumber: " + err.lineNumber + "\n\n";
            Log.error(txt);
        }
    }
};