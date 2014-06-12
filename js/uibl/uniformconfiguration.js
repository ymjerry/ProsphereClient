/**
 * TWA proshpere configurator
 * 
 * uniformconfiguration.js used to store configurator selection option which helps to build XML which is used to send at ATG
 * 
 * TWA proshpere configurator
 * @subpackage model
 */


/*
 * Constructor.
 */

function UniformConfiguration() {
    this.OrderName = null;

    this.RetrieveCode = '';
    this.TopAvailable = false;
    this.BottomAvailable = false;
    this.PantAvailable = false;
    this.UserId = null;

    //ATG stock decorator
    this.SessionVariable = '';
    this.WebOrderNumber = null;
    this.AccountNumber = null;

    this.CategoryId = null;
    this.CategoryName = null;
    this.GenderId = null;
    this.GenderName = null;
    this.YouthGenderId = null;
    this.YouthGenderName = null;

    this.StyleNumber = null;
    this.StyleId = null;
    this.YouthStyleId = null;
    this.YouthStyleNumber = null;
    this.DesignNumber = null;
    this.DesignId = null;
    this.YouthDesignNumber = null;
    this.YouthDesignId = null;

    this.ColorNumber = null;
    this.ContactNumber = null;

    this.PrimaryColorName = null;
    this.PrimaryColorId = null;
    this.isPrimaryFlourescent = null;
    this.SecondaryColorName = null;
    this.SecondaryColorId = null;
    this.TertiaryColorName = null;
    this.TertiaryColorId = null;

    this.FabricName = null;
    this.FabricId = null;

    this.PreviewFrontUrl = null;
    this.PreviewLeftUrl = null;
    this.PreviewBackUrl = null;
    this.PreviewRightUrl = null;
    this.Emailmemyproof = null;
    /************ Not Use now ******/
    this.DecorationCost = null;
    this.DecorationMethod = null;
    this.LargeSizePrice = null;
    this.RosterItems = null;
    this.RosterPlayers = null;
    this.CallType = null;

    this.userInfo = new Object(); //Type, Email, SendToEmail, FromEmail
    this.categoryInfo = new Object();
    this.genderInfo = new Object();
    this.youthGenderInfo = new Object();
    this.youthStyleInfo = new Object();
    this.youthDesignInfo = new Object();
    this.youthBottomStyleInfo = new Object();
    this.stylesInfo = new Object();
    this.designsInfo = new Object();
    this.colorsInfo = new Object();
    this.fabricsInfo = new Object();
    this.otherTextInfo = new Object();
    this.playerNumberInfo = new Object();
    this.playerNameInfo = new Object();
    this.teamNameInfo = new Object();
    this.graphicInfo = new Object();
    this.clickedGraphicInfo = new Object();
    this.rosterPlayerInfo = {};
    this.proofDataNodeInfo = new Object();
    this.previewUrls = new Object();
    this.setCallNumber = new Object();
    this.setEmailmemyproof = new Object();
    this.specialInstructions = '';
    this.referralCode = null;
    this.orderState = null;

    this.matchButtonColorID = null;
    this.matchThreadColorID = null;
    this.matchZipperColorID = null;

    this.uniformConfigVersion = null;
    this.selectedAnchorsMetadata = null;
    this.proofDataNode = null;

    this.applicationId = null;
    this.fabricList = null;
    this.previewOrientation = null;
    this.isCustomizeTabClicked = false;
    this.isFabricClicked = false;

    this.anchorpoints = []; //it keeps the array of AnchorPointData object
    this.clickedFabricId = 0;
    this.myLockerImage = new Object();
    this.uploadGraphicEmail = '';
    this.sessionInformation = null;
    this.birdEyeView = null;
    this.rosterBirdEyeView = null;
    this.isRosterTabClicked = false;
    this.flatCutSizeInfo = null;
    this.showInfoColorLink = null;
    this.uniformPrice = 0;
    this.previewUrlTagName = null;
    this.isSkipAlert = false;

    this.copiedYouthStyleInfo = new Object();
    this.copiedStyleInfo = new Object();
    this.copiedStyleDesignsInfo = new Object();
    this.copiedStyleYouthDesignsInfo = new Object();
    this.uniformlogoData = new Object();
    this.uniformlogoDataBottom = new Object();
    this.sublimatedTagData = new Object();
    this.sublimatedTagDataBottom = new Object();

    this.primaryTaaColorId = 0;
    this.secondaryTaaColorId = 0;
    this.TertiaryTaaColorId = 0;

    this.productionImages = new Array();
    this.anchroPointsUploadedImages = new Array();
}

/**
 * Setter method to save the color
 * 
 * @param key  to set the value in key 
 * @param user Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setUserInfo = function (key, user) {
    if (user !== undefined && user != null) {
        if (key == '' || key == null || key == undefined)
            this.userInfo = user;
        else if (key != '')
            this.userInfo[key] = user;
        Log.trace('User Info set: ' + key + '=' + user);
    }
};

/**
 * Setter method to save the retrieveCode
 * 
 * @param retrieveCode Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setRetrieveCode = function (retrieveCode) {
    if (this.RetrieveCode !== undefined) {
        this.RetrieveCode = retrieveCode;
    }
};
/**
 * Setter method to save the callType
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setCallType = function (value) {
    if (this.CallType !== undefined) {
        this.CallType = value;
    }
};
/**
 * Setter method to save the ferralCode
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setReferralCode = function (value) {
    if (this.ferralCode !== undefined) {
        this.ferralCode = value;
    }
};
/**
 * Setter Method to save specialInstructions
 * @param value Save instructions to be set
 * @returns void
 */
UniformConfiguration.prototype.setSpecialInstructions = function (value) {
    if (this.specialInstructions !== undefined) {
        this.specialInstructions = value;
    }
};
/**
 * Setter method to save the orderState
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setOrderState = function (value) {
    if (this.orderState !== undefined) {
        this.orderState = value;
    }
};

UniformConfiguration.prototype.setFlatCutSizeInfo = function (value) {
    if (value) {
        this.flatCutSizeNumebr = value;
    }
};
UniformConfiguration.prototype.getFlatCutSizeInfo = function () {
    return this.flatCutSizeNumebr;
};

/**
 * Setter method to save the rosterTeamName
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setRosterTeamName = function (value) {
    if (this.rosterTeamName !== undefined) {
        this.rosterTeamName = value;
    }
};

/**
 * Setter Method to set uniform logo data of top
 * @param {type} value
 * @returns {undefined}
 */
UniformConfiguration.prototype.setUniformLogoData = function (value) {
    if (this.uniformlogoData !== undefined) {
        this.uniformlogoData = value;
    }
};
/**
 * Setter method to set uniform logo data of Bottom
 * @param {object} value
 * @returns void
 */
UniformConfiguration.prototype.setUniformLogoDataBottom = function (value) {
    if (this.uniformLogoDataBottom !== undefined) {
        this.uniformLogoDataBottom = value;
    }
};

/**
 * Setter method to set uniform sublimated tag
 * @param {object} value
 * @returns void
 */

UniformConfiguration.prototype.setUniformsubmilatedTagData = function (value) {
    if (this.sublimatedTagData !== undefined) {
        this.sublimatedTagData = value;
    }
};

/**
 * Stter method to set sublimated tag of Bottom
 * @param {object} value
 * @returns void
 */
UniformConfiguration.prototype.setUniformsubmilatedTagDataBottom = function (value) {
    if (this.sublimatedTagDataBottom !== undefined) {
        this.sublimatedTagDataBottom = value;
    }
};


/**
 * Setter method to save the colors
 * 
 * @param key like ('primaryColor', 'secondaryColor', 'tertiaryColor')
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setColorsInfo = function (key, value) {

    if (this.colorsInfo !== undefined && key != null) {
        this.colorsInfo[key] = value;
        switch (key) {
            case 'uniformPrimaryColor':
                this.PrimaryColorId = value.ColorId;
                this.PrimaryColorName = value.Name;
                this.primaryTaaColorId = value.TaaColorId;
                this.isPrimaryFlourescent = (value.CmykCmykFluor === true ? "Yes" : "No");
            case 'uniformSecondaryColor':
                this.SecondaryColorId = value.ColorId;
                this.SecondaryColorName = value.Name;
                this.secondaryTaaColorId = value.TaaColorId;
            case 'uniformTertiaryColor':
                this.TertiaryColorId = value.ColorId;
                this.TertiaryColorName = value.Name;
                this.TertiaryTaaColorId = value.TaaColorId;
        }
    }
};

/**
 * Setter method to save the style
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setStylesInfo = function (value) {
    if (this.stylesInfo !== undefined) {
        this.stylesInfo = value;
        this.StyleId = value.StyleId;
        this.StyleNumber = value.StyleNumber;
    }
};

/**
 * Setter method to save the designs
 *  
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setDesignsInfo = function (value) {
    if (this.designsInfo !== undefined) {
        this.designsInfo = value;
        this.DesignId = value.DesignId;
        this.DesignNumber = value.DesignNumber;
    }
};
/**
 * Setter method to save the style for Youth Gender
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setYouthStylesInfo = function (value) {
    if (value && this.youthStyleInfo !== undefined) {
        this.youthStyleInfo = value;
        this.YouthStyleId = value.StyleId;
        this.YouthStyleNumber = value.StyleNumber;
    } else if (value == null) {
        this.youthStyleInfo = value;
    }
};

/**
 * Setter method to save the bottom style info for Youth Gender
 *  
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setBottomYouthDStyleInfo = function (value) {
    if (this.youthBottomStyleInfo !== undefined) {
        this.youthBottomStyleInfo = value;
    }
};

/**
 * Setter method to save the fabric
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setFabricsInfo = function (value) {
    if (this.fabricsInfo !== undefined) {
        this.fabricsInfo = value;
        this.FabricId = value.FabricId;
        this.FabricName = value.Name;
    }
};


/**
 * Setter method to save the matchButtonColorID
 * 
 * @param matchButtonColorID Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setMatchButtonColorID = function (matchButtonColorID) {
    if (this.matchButtonColorID !== undefined) {
        this.matchButtonColorID = matchButtonColorID;
    }
};

/**
 * Setter method to save the matchThreadColorID
 * 
 * @param matchThreadColorID Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setMatchThreadColorID = function (matchThreadColorID) {
    if (this.matchThreadColorID !== undefined) {
        this.matchThreadColorID = matchThreadColorID;
    }
};

/**
 * Setter method to save the MatchZipperColorID
 * 
 * @param matchZipperColorID Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setMatchZipperColorID = function (matchZipperColorID) {
    if (this.matchZipperColorID !== undefined) {
        this.matchZipperColorID = matchZipperColorID;
    }
};


/**
 * Setter method to save the uniformConfigVersion
 * 
 * @param uniformConfigVersion Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setUniformConfigVersion = function (uniformConfigVersion) {
    if (this.uniformConfigVersion !== undefined) {
        this.UniformConfigVersion = uniformConfigVersion;
    }
};

/**
 * Setter method to save the thumbnailUrl
 * 
 * @param selectedAnchorsMetadata Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setSelectedAnchorsMetadata = function (selectedAnchorsMetadata) {
    if (this.selectedAnchorsMetadata !== undefined) {
        this.selectedAnchorsMetadata = selectedAnchorsMetadata;
    }
};

/**
 * Setter method to save the proofDataNode
 * 
 * @param proofDataNode Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setProofDataNode = function (proofDataNode) {
    if (this.proofDataNode !== undefined) {
        this.proofDataNode = proofDataNode;
    }
};

/************** ***********************/

/**
 * Setter method to save the orderName
 * 
 * @param orderName Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setOrderName = function (orderName) {
    if (this.OrderName !== undefined) {
        this.OrderName = orderName;
    }
};

/**
 * Setter method to save the category information
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setCategoryInfo = function (value) {
    if (this.categoryInfo !== undefined) {
        this.categoryInfo = value;
        this.CategoryId = value.Id;
        this.CategoryName = value.Name;
    }
};

/**
 * Setter method to save the topAvailable
 * 
 * @param isAvailable Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setTopAvailable = function (isAvailable) {
    if (this.TopAvailable !== undefined) {
        this.TopAvailable = isAvailable;
    }
};


/**
 * Setter method to save the bottomAvailable
 * 
 * @param isAvailable Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setBottomAvailable = function (isAvailable) {
    if (this.BottomAvailable !== undefined) {
        this.BottomAvailable = isAvailable;
    }
};


/**
 * Setter method to save the pantAvailable
 * 
 * @param isAvailable Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setPantAvailable = function (isAvailable) {
    if (this.PantAvailable !== undefined) {
        this.PantAvailable = isAvailable;
    }
};

/**
 * Setter method to save the sessionInfo
 * 
 * @param isAvailable Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setSessionInformation = function (sessionInfo) {
    if (sessionInfo !== undefined) {
        this.sessionInformation = sessionInfo;
    }
};


/**
 * Setter method to save the userId
 * 
 * @param userId Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setUserId = function (userId) {
    if (this.UserId !== undefined) {
        this.UserId = userId;
    }
};

/**
 * Method to set call number
 * @param {type} CallNumber
 * @returns {undefined}
 */
UniformConfiguration.prototype.setApproveLaterCallNumber = function (callme) {
    if (this.ContactNumber !== undefined) {
        this.ContactNumber = callme;
    }
};
/**
 * Method to get call number
 * @returns phine number that is provided in the ApproveLater.
 */
UniformConfiguration.prototype.getApproveLaterCallNumber = function () {
    return this.ContactNumber;

};
UniformConfiguration.prototype.setApproveLaterEmailmemyproof = function (Emailmemyproof) {
    if (this.Emailmemyproof !== undefined) {
        this.Emailmemyproof = Emailmemyproof;
    }
};
UniformConfiguration.prototype.getApproveLaterEmailmemyproof = function (Emailmemyproof) {
    return this.Emailmemyproof;

};


/**
 * Getter method To retrieve user information
 * 
 * @param key 
 * 
 * @return object
 */
UniformConfiguration.prototype.getUserInfo = function (key) {
    if (key != undefined && key != '' && this.userInfo != undefined)
        return (this.userInfo[key] != undefined) ? this.userInfo[key] : null;
    else
        return this.userInfo || null;


};

/**
 * Getter method To retrieve RetrieveCode information
 * 
 * @return object
 */
UniformConfiguration.prototype.getRetrieveCode = function () {
    return this.RetrieveCode || '';
};
/**
 * Getter method To retrieve CallType information
 * 
 * @return object
 */
UniformConfiguration.prototype.getCallType = function () {
    return this.CallType || null;
};
/**
 * Getter method To retrieve ReferralCode information
 * 
 * @return object
 */
UniformConfiguration.prototype.getReferralCode = function () {
    return this.referralCode;
};

/**
 * Gets special instructions
 * @returns text;
 */
UniformConfiguration.prototype.getSpecialInstructions = function () {
    return this.specialInstructions;
};
/**
 * Getter method To retrieve OderName information
 * 
 * @return object
 */
UniformConfiguration.prototype.getOrderName = function () {
    return this.OrderName || null;
};
/**
 * Getter method To retrieve OrderState information
 * 
 * @return object
 */
UniformConfiguration.prototype.getOrderState = function () {
    return this.orderState || null;
};
/**
 * Getter method To retrieve RosterTeamName information
 * 
 * @return object
 */
UniformConfiguration.prototype.getRosterTeamName = function () {
    return this.rosterTeamName;
};

/**
 * Getter Method to reterive Uniform logo data
 * @returns object
 */
UniformConfiguration.prototype.getUniformLogoData = function () {
    return this.uniformlogoData;
};

/**
 * Getter method to reterive uniform logo data of bottom
 * @returns object
 */
UniformConfiguration.prototype.getUniformLogoDataBottom = function () {
    return this.uniformlogoDataBottom;
};

/**
 * Getter method to retrive uniform sublimated tag data
 * @returns object 
 */
UniformConfiguration.prototype.getUniformsubmilatedTagData = function () {
    return this.sublimatedTagData;
};

/**
 * Getter method to reterive uniform sublimated tag data of bottom
 * @returns object
 */
UniformConfiguration.prototype.getUniformsubmilatedTagDataBottom = function () {
    return this.sublimatedTagDataBottom;
};
/**
 * Getter method To retrieve colors information
 * @param colorType like ('primaryColor', 'secondaryColor', 'tertiaryColor')
 * @return object
 */
UniformConfiguration.prototype.getColorsInfo = function (colorType) {
    if (colorType != undefined && colorType != '')
        return this.colorsInfo[colorType] || null;
    else
        return this.colorsInfo || null;
};

/**
 * Getter method To retrieve style information 
 * @return object
 */
UniformConfiguration.prototype.getStylesInfo = function () {
    return this.stylesInfo || null;
};

/**
 * Getter method To retrieve design information for Youth Gender
 * @return object
 */
UniformConfiguration.prototype.getDesignsInfo = function () {
    return this.designsInfo || null;
};
/**
 * Getter method To retrieve style information for Youth Gender
 * @return object
 */
UniformConfiguration.prototype.getYouthStylesInfo = function () {
    return this.youthStyleInfo || null;
};

/**
 * Getter method To retrieve bottom youth information 
 * @return object
 */
UniformConfiguration.prototype.getBottomYouthStyleInfo = function () {
    return this.youthBottomStyleInfo || null;
};


/**
 * Getter method To retrieve Fabric information 
 * @return object
 */
UniformConfiguration.prototype.getFabricsInfo = function () {
    return this.fabricsInfo || null;
};


/**
 * Getter method To retrieve MatchButtonColorID information
 * 
 * @return object
 */
UniformConfiguration.prototype.getMatchButtonColorID = function () {
    return this.matchButtonColorID;
};
/**
 * Getter method To retrieve MatchThreadColorID information
 * 
 * @return object
 */
UniformConfiguration.prototype.getMatchThreadColorID = function () {
    return this.matchThreadColorID;
};
/**
 * Getter method To retrieve MatchZipperColorID information
 * 
 * @return object
 */
UniformConfiguration.prototype.getMatchZipperColorID = function () {
    return this.matchZipperColorID;
};

/**
 * Getter method To retrieve Gender information
 * 
 * @return object
 */
UniformConfiguration.prototype.getGenderInfo = function () {
    return this.genderInfo;
};

/**
 * Getter method To retrieve Youth Gender information
 * 
 * @return object
 */
UniformConfiguration.prototype.getYouthGenderInfo = function () {
    return this.youthGenderInfo;
};

/**
 * Getter method To retrieve TeamName information
 * 
 * @return object
 */
UniformConfiguration.prototype.getTeamName = function () {
    return this.teamName;
};
/**
 * Getter method To retrieve UniformConfigVersion information
 * 
 * @return object
 */
UniformConfiguration.prototype.getUniformConfigVersion = function () {
    return this.uniformConfigVersion;
};
/**
 * Getter method To retrieve selectedAnchorsMetadata information
 * 
 * @return object
 */
UniformConfiguration.prototype.getSelectedAnchorsMetadata = function () {
    return this.selectedAnchorsMetadata;
};

/**
 * Getter method To retrieve proofDataNode information
 * 
 * @return object
 */
UniformConfiguration.prototype.getProofDataNode = function () {
    return this.proofDataNode;
};

/************** ***********************/


/**
 * Getter method To retrieve category information
 * 
 * @return object
 */
UniformConfiguration.prototype.getCategoryInfo = function () {
    return this.categoryInfo || null;
};
/**
 * Getter method To retrieve topAvailable information
 * 
 * @return object
 */

UniformConfiguration.prototype.getTopAvailable = function () {
    return this.TopAvailable || false;
};


/**
 * Getter method To retrieve bottomAvailable information
 * 
 * @return object
 */
UniformConfiguration.prototype.getBottomAvailable = function () {
    return this.BottomAvailable || false;
};


/**
 * Getter method To retrieve proofDataNode information
 * 
 * @return object
 */
UniformConfiguration.prototype.getPantAvailable = function () {
    return this.PantAvailable || false;
};

/**
 * Getter method To retrieve session information
 * 
 * @return object
 */
UniformConfiguration.prototype.getSessionData = function () {
    return this.sessionInformation;
};

/**
 * Getter method To retrieve userId information
 * 
 * @return object
 */
UniformConfiguration.prototype.getUserId = function () {
    return this.UserId || null;
};



//ATG stock decorator

/**
 * Setter method to save the SessionVariable
 * 
 * @param SessionVariable Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setSessionVariable = function (SessionVariable) {
    if (this.SessionVariable !== undefined) {
        this.SessionVariable = SessionVariable;
    }
};

/**
 * Setter method to save the WebOrderNumber
 * 
 * @param WebOrderNumber Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setWebOrderNumber = function (WebOrderNumber) {
    if (this.WebOrderNumber !== undefined) {
        this.WebOrderNumber = WebOrderNumber;
    }
};

/**
 * Setter method to save the AccountNumber
 * 
 * @param AccountNumber Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setAccountNumber = function (AccountNumber) {
    if (this.AccountNumber !== undefined) {
        this.AccountNumber = AccountNumber;
    }
};

/**
 * Setter method to save the StyleNumber
 * 
 * @param StyleNumber Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setStyleNumber = function (StyleNumber) {
    if (this.StyleNumber !== undefined) {
        this.StyleNumber = StyleNumber;
    }
};

/**
 * Setter method to save the ColorNumber
 * 
 * @param ColorNumber Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setColorNumber = function (ColorNumber) {
    if (this.ColorNumber !== undefined) {
        this.ColorNumber = ColorNumber;
    }
};

/**
 * Setter method to save the DecorationCost
 * 
 * @param DecorationCost Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setDecorationCost = function (DecorationCost) {
    if (this.DecorationCost !== undefined) {
        this.DecorationCost = DecorationCost;
    }
};

/**
 * Setter method to save the DecorationMethod
 * 
 * @param DecorationMethod Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setDecorationMethod = function (DecorationMethod) {
    if (this.DecorationMethod !== undefined) {
        this.DecorationMethod = DecorationMethod;
    }
};

/**
 * Setter method to save the LargeSizePrice
 * 
 * @param LargeSizePrice Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setLargeSizePrice = function (LargeSizePrice) {
    if (this.LargeSizePrice !== undefined) {
        this.LargeSizePrice = LargeSizePrice;
    }
};

/**
 * Setter method to save the RosterItems
 * 
 * @param RosterItems Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setRosterItems = function (RosterItems) {
    if (this.RosterItems !== undefined) {
        this.RosterItems = RosterItems;
    }
};

//Atg Stock decorator variable

/**
 * Getter method To retrieve SessionVariable information
 * 
 * @return object
 */
UniformConfiguration.prototype.getSessionVariable = function () {
    return this.SessionVariable;
};
/**
 * Getter method To retrieve WebOrderNumber information
 * 
 * @return object
 */
UniformConfiguration.prototype.getWebOrderNumber = function () {
    return this.WebOrderNumber;
};

/**
 * Getter method To retrieve AccountNumber information
 * 
 * @return object
 */
UniformConfiguration.prototype.getAccountNumber = function () {
    return this.AccountNumber;
};

/**
 * Getter method To retrieve StyleNumber information
 * 
 * @return object
 */
UniformConfiguration.prototype.getStyleNumber = function () {
    return this.StyleNumber;
};

/**
 * Getter method To retrieve ColorNumber information
 * 
 * @return object
 */
UniformConfiguration.prototype.getColorNumber = function () {
    return this.ColorNumber;
};

/**
 * Getter method To retrieve DecorationCost information
 * 
 * @return object
 */
UniformConfiguration.prototype.getDecorationCost = function () {
    return this.DecorationCost;
};

/**
 * Getter method To retrieve DecorationMethod information
 * 
 * @return object
 */
UniformConfiguration.prototype.getDecorationMethod = function () {
    return this.DecorationMethod;
};

/**
 * Getter method To retrieve LargeSizePrice information
 * 
 * @return object
 */
UniformConfiguration.prototype.getLargeSizePrice = function () {
    return this.LargeSizePrice;
};

/**
 * Getter method To retrieve RosterItems information
 * 
 * @return object
 */
UniformConfiguration.prototype.getRosterItems = function () {
    return this.RosterItems;
};


//************************* new setter function *************/


/**
 * Setter method to save the gender
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setGenderInfo = function (value) {
    if (this.genderInfo !== undefined) {
        this.genderInfo = value;
        this.GenderId = value.Id;
        this.GenderName = value.Name;
    }
};

/**
 * Setter method to save the youth gender
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setYouthGenderInfo = function (value) {
    if (this.youthGenderInfo !== undefined) {
        this.youthGenderInfo = value;
        this.YouthGenderId = value.Id;
        this.YouthGenderName = value.Name;
    }
};


/**
 * Setter method to save the applicationId
 * 
 * @param applicationId Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setApplicationId = function (applicationId) {
    if (this.applicationId !== undefined) {
        this.applicationId = applicationId;
    }
};

/**
 * Getter method To retrieve applicationId information
 * 
 * @return object
 */
UniformConfiguration.prototype.getApplicationId = function () {
    return this.applicationId;
};



/**
 * Setter method to save the previewOrientation
 * 
 * @param previewOrientation Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setPreviewOrientation = function (previewOrientation) {
    if (this.previewOrientation !== undefined) {
        this.previewOrientation = previewOrientation;
    }
};


/**
 * Getter method To retrieve previewOrientation information
 * 
 * @return object
 */
UniformConfiguration.prototype.getPreviewOrientation = function () {
    return this.previewOrientation;
};

/******************************** Other Text  Setter/Setter*************************/
/**
 * Setter method to save the otherTextScreen
 * 
 * @param value Sets value in the form of object
 *  
 * @param key like
 *      text
 *      font
 *      fontColor
 *      fontOuline1Color
 *      fontOuline2Color
 *      textOrientation
 *      
 * @return void     
 */
UniformConfiguration.prototype.setOtherTextInfo = function (key, value) {
    if (this.otherTextInfo !== undefined) {
        if (key == '' || key == null)
            this.otherTextInfo = value;
        else if (key != '')
            this.otherTextInfo[key] = value;
    }
};

/**
 * Getter method To retrieve Other Text information
 * 
 * @param key 
 * @return object
 * Keys :
 *      text
 *      font
 *      fontColor
 *      fontOuline1Color
 *      fontOuline2Color
 *      textOrientation
 */
UniformConfiguration.prototype.getOtherTextInfo = function (key) {
    if (key !== undefined && key !== '' && key !== null) {
        return this.otherTextInfo[key];
    }
    else
        return this.otherTextInfo;
};




/******************************** Team Name  Setter*************************/
/**
 * Setter method to save the Team Name Screen
 * 
 * @param  Sets value in the form of object
 *  
 * @return void
 * Keys :
 *      text
 *      font
 *      fontColor
 *      fontOuline1Color
 *      fontOuline2Color
 *      textOrientation
 */
UniformConfiguration.prototype.setTeamNameInfo = function (key, value) {
    if (this.teamNameInfo !== undefined) {
        if (key == '' || key == null)
            this.teamNameInfo = value;
        else if (key != '')
            this.teamNameInfo[key] = value;
    }
};

/**
 * Getter method To retrieve Team Name Screen
 * 
 * @param key 
 * @return object
 * Keys :
 *      text
 *      font
 *      fontColor
 *      fontOuline1Color
 *      fontOuline2Color
 *      textOrientation
 */
UniformConfiguration.prototype.getTeamNameInfo = function (key) {
    if (key != undefined && key != '')
        return this.teamNameInfo[key];
    else
        return this.teamNameInfo;
};


/******************************** Player Name  Setter*************************/
/**
 * Setter method to save the Player Name Screen
 * 
 * @param  Sets value in the form of object
 *  
 * @return void
 * Keys :
 *      text
 *      font
 *      fontColor
 *      fontOuline1Color
 *      fontOuline2Color
 *      textOrientation
 */
UniformConfiguration.prototype.setPlayerNameInfo = function (key, value) {
    if (this.playerNameInfo !== undefined && this.playerNameInfo != null) {
        if (key == '' || key == null)
            this.playerNameInfo = value;
        else if (key != '')
            this.playerNameInfo[key] = value;
    }
};

/**
 * Getter method To retrieve Player Name Screen
 * 
 * @param key 
 * @return object
 * Keys :
 *      text
 *      font
 *      fontColor
 *      fontOuline1Color
 *      fontOuline2Color
 *      textOrientation
 */
UniformConfiguration.prototype.getPlayerNameInfo = function (key) {
    if (key != undefined && key != '')
        return this.playerNameInfo[key];
    else
        return this.playerNameInfo;
};





/******************************** Player Number  Setter*************************/
/**
 * Setter method to save the Player Number Screen
 * 
 * @param  Sets value in the form of object
 *  
 * @return void
 * Keys :
 *      text
 *      font
 *      fontColor
 *      fontOuline1Color
 *      fontOuline2Color
 *      textOrientation
 */
UniformConfiguration.prototype.setPlayerNumberInfo = function (key, value) {
    if (this.playerNumberInfo !== undefined) {
        if (key == '' || key == null)
            this.playerNumberInfo = value;
        else if (key != '')
            this.playerNumberInfo[key] = value;
    }
};

/**
 * Getter method To retrieve Player Number Screen
 * 
 * @param key 
 * @return object
 * Keys :
 *      text
 *      font
 *      fontColor
 *      fontOuline1Color
 *      fontOuline2Color
 *      textOrientation
 */
UniformConfiguration.prototype.getPlayerNumberInfo = function (key) {
    if (key != undefined && key != '')
        return this.playerNumberInfo[key];
    else
        return this.playerNumberInfo;
};


/**
 * Setter method To save customize tab click information
 * 
 * @return void
 */
UniformConfiguration.prototype.setCustomizeTabClicked = function () {
    this.isCustomizeTabClicked = true;
};

/**
 * Getter method To retrieve customize tab click information
 * 
 * @return boolean true if customize tab clicked, false otherwise
 */
UniformConfiguration.prototype.getCustomizeTabClicked = function () {
    return this.isCustomizeTabClicked;
};

/**
 * Setter method To save fabric selection click information
 * 
 * @return void
 */
UniformConfiguration.prototype.setFabricClicked = function () {
    this.isFabricClicked = true;
};

/**
 * Getter method To retrieve fabric selection click information
 * 
 * @return boolean true if fabric selection clicked, false otherwise
 */
UniformConfiguration.prototype.getFabricClicked = function () {
    return this.isFabricClicked;
};

/**
 * Setter method To save fabric id which is currently clicked not saved previously
 * 
 * @return void
 */
UniformConfiguration.prototype.setFabricIdOnClick = function (fabricId) {
    this.clickedFabricId = fabricId;
};

/**
 * Getter method To retrieve fabric id which is currently clicked not saved previously
 * 
 * @return integer currently clicked fabric id
 */
UniformConfiguration.prototype.getFabricIdOnClick = function () {
    return this.clickedFabricId;
};

function getConfigurationJsonObject(uniformConfigurationObject) {
    var objUniformConfigFinal = uniformConfigurationObject;
    return objUniformConfigFinal;
}

/**
 * Setter method to set anchor points array
 * @param {type} data array of AnchorPointData object
 * @returns {undefined}
 */
UniformConfiguration.prototype.setAnchorPoints = function (data) {
    this.anchorpoints = data;
};

/**
 * Getter method to retrieve anchor points array
 * 
 * @return object array of AnchorPointData object
 */
UniformConfiguration.prototype.getAnchorPoints = function () {
    return this.anchorpoints;
};

/******************************** roster Player Info Setter*************************/

/**
 * Setter method to save the Roster Player information
 * @param {type} key like - playerName, playerNumber 
 * @param {type} value
 * @returns void
 */
UniformConfiguration.prototype.setRosterPlayerInfo = function (key, value) {
    if (this.rosterPlayerInfo !== undefined) {
        if (key === '' || key === null)
            this.rosterPlayerInfo = value;
        else if (key !== '')
            this.rosterPlayerInfo[key] = value;
    }
};

/**
 * Getter method To retrieve Roster Player information
 * 
 * @param {type} key like - playerName, playerNumber 
 * @return object
 */
UniformConfiguration.prototype.getRosterPlayerInfo = function (key) {
    if (key !== undefined && key !== '')
        return this.rosterPlayerInfo[key] || null;
    else
        return this.rosterPlayerInfo;
};

/********* Preview URL setter/getter **********/
/**
 * Setter method to save the Preview Front Url information 
 * @param {type} PreviewFrontUrl value
 * @returns void
 */
UniformConfiguration.prototype.setPreviewFrontUrl = function (PreviewFrontUrl) {
    if (this.PreviewFrontUrl !== undefined) {
        this.PreviewFrontUrl = PreviewFrontUrl;
    }
};
/**
 * Setter method to save the Preview left Url information 
 * @param {type} PreviewLeftUrl value
 * @returns void
 */
UniformConfiguration.prototype.setPreviewLeftUrl = function (PreviewLeftUrl) {
    if (this.PreviewLeftUrl !== undefined) {
        this.PreviewLeftUrl = PreviewLeftUrl;
    }
};
/**
 * Setter method to save the Preview Back Url information 
 * @param {type} PreviewBackUrl value
 * @returns void
 */
UniformConfiguration.prototype.setPreviewBackUrl = function (PreviewBackUrl) {
    if (this.PreviewBackUrl !== undefined) {
        this.PreviewBackUrl = PreviewBackUrl;
    }
};
/**
 * Setter method to save the Preview Right Url information 
 * @param {type} PreviewRightUrl value
 * @returns void
 */
UniformConfiguration.prototype.setPreviewRightUrl = function (PreviewRightUrl) {
    if (this.PreviewRightUrl !== undefined) {
        this.PreviewRightUrl = PreviewRightUrl;
    }
};


/**
 * Getter method To retrieve Preview Front Url information
 * 
 * @return object
 */
UniformConfiguration.prototype.getPreviewFrontUrl = function () {
    return this.PreviewFrontUrl;
};
/**
 * Getter method To retrieve Preview left Url information
 * 
 * @return object
 */
UniformConfiguration.prototype.getPreviewLeftUrl = function () {
    return this.PreviewLeftUrl;
};
/**
 * Getter method To retrieve Preview back Url information
 * 
 * @return object
 */

UniformConfiguration.prototype.getPreviewBackUrl = function () {
    return this.PreviewBackUrl;
};
/**
 * Getter method To retrieve Preview right Url information
 * 
 * @return object
 */
UniformConfiguration.prototype.getPreviewRightUrl = function () {
    return this.PreviewRightUrl;
};

/*****************************Getter and Setter for Select A Graphic**************************************************/
/**
 * This method is used for saviong data of Select Graphic
 * @param {type} key
 * @param {type} value
 * @returns void
 */
UniformConfiguration.prototype.setSelectGraphicInfo = function (key, value) {
    if (key !== undefined) {
        if (key === '' || key === null) {
            this.graphicInfo = value;
        } else {
            this.graphicInfo[key] = value;
        }
    }
};
/**
 * This method is used for returning selected graphics object
 * @param {type} key
 * @returns select selcted graphic object
 */
UniformConfiguration.prototype.getSelectGraphicInfo = function (key) {
    if (key === undefined) {
        return this.graphicInfo;
    }
    return this.graphicInfo[key];
};


/*****************************Getter and Setter for my locker**************************************************/
/**
 * This method is used for saviong data of my locker image
 * @param {type} key
 * @param {type} value
 * @returns void
 */
UniformConfiguration.prototype.setMyLockerInfo = function (key, value) {
    if (key !== undefined) {
        if (key === '' || key === null) {
            this.myLockerImage = value;
        } else {
            this.myLockerImage[key] = value;
        }
    }
};
/**
 * This method is used for returning mylocker image
 * @param {type} key
 * @returns mylocker image
 */
UniformConfiguration.prototype.getMyLockerInfo = function (key) {
    if (key === undefined) {
        return this.myLockerImage;
    }
    return this.myLockerImage[key];
};

/*****************************Getter and Setter for proof Data Node**************************************************/
/**
 * This method is used for saviong proof Data Node
 * @param {type} key
 * key <previewImageURLLeft />
 * <previewImageURLFront />
 * <previewImageURLBack />
 * <styleNameForProof></styleNameForProof>
 * <fabricTileURLForProof></fabricTileURLForProof>
 * <proofApprovedOnline></proofApprovedOnline>
 * <proofApproveLaterEmail />
 * @param {type} value
 * @returns void
 */
UniformConfiguration.prototype.setProofDataNodeInfo = function (key, value) {
    if (key !== undefined) {
        if (key === '' || key === null) {
            this.proofDataNodeInfo = value;
        } else {
            this.proofDataNodeInfo[key] = value;
        }
    }
};
/**
 * This method is used for returning proof Data Node
 * @param {type} key
 * @returns select selcted proof Data Node
 */
UniformConfiguration.prototype.getProofDataNodeInfo = function (key) {
    if (key === undefined) {
        return this.proofDataNodeInfo;
    }
    return this.proofDataNodeInfo[key];
};


/*****************************Getter and Setter for preview Url**************************************************/
/**
 * This method is used for saving preview urls
 * @param {type} key
 * previewUrl1
 * previewUrl2
 * @param {type} value
 * @returns void
 */
UniformConfiguration.prototype.setPreviewUrls = function (key, value) {
    if (key !== undefined) {
        if (key === '' || key === null) {
            this.previewUrls = value;
        } else {
            this.previewUrls[key] = value;
        }
    }
};
/**
 * This method is used for returning preview url
 * @param {type} key
 * @returns select selcted graphic object
 */
UniformConfiguration.prototype.getPreviewUrls = function (key) {
    if (key === undefined) {
        return this.previewUrls;
    }
    return this.previewUrls[key];
};

/**
 * This method is used for saving selected bird eye view
 * 
 * @param value bird eye view object
 * @returns void
 */
UniformConfiguration.prototype.setBirdEyeView = function (value) {
    this.birdEyeView = value;
};
/**
 * This method is used for returning selected bird eye view
 * 
 * @returns select selcted bird eye view object
 */
UniformConfiguration.prototype.getBirdEyeView = function () {
    return this.birdEyeView || null;
};

/**
 * This method is used for saving selected bird eye view saved in roster screen
 * 
 * @param value bird eye view object
 * @returns void
 */
UniformConfiguration.prototype.setRosterBirdEyeView = function (value) {
    this.rosterBirdEyeView = value;
};
/**
 * This method is used for returning selected bird eye view saved in roster screen
 * 
 * @returns select selcted bird eye view object
 */
UniformConfiguration.prototype.getRosterBirdEyeView = function () {
    return this.rosterBirdEyeView || null;
};
/**
 * Setter method To save Roster tab click information
 * 
 * @return void
 */
UniformConfiguration.prototype.setRosterTabClicked = function () {
    this.isRosterTabClicked = true;
};

/**
 * Getter method To retrieve Roster tab click information
 * 
 * @return boolean true if Roster tab clicked, false otherwise
 */
UniformConfiguration.prototype.getRosterTabClicked = function () {
    return this.isRosterTabClicked;
};

/**
 * This method is responsible for storing ShowInfoColorLink status
 * @param {type} status
 * @return void
 */
UniformConfiguration.prototype.setShowInfoColorLink = function (status) {
    this.showInfoColorLink = status;
};

/**
 * This method is responsible for returing ColorLink Status
 * @returns status of the ColorLink
 */
UniformConfiguration.prototype.getShowInfoColorLink = function () {
    return this.showInfoColorLink;
};

/**
 * This method is responsoble for saving the total UniformPrice.
 * @param totalPrice - Total Price of unifoem
 * @returns void
 */
UniformConfiguration.prototype.setTotalUniformPrice = function (totalPrice) {
    this.uniformPrice = totalPrice;
};

/**
 * This method is responsible returning the total UniformPrce
 * @returns uniformPrice - Total Price of the uniform
 */
UniformConfiguration.prototype.getTotalUniformPrice = function () {
    return this.uniformPrice;
};

/**
 * This method saves PreviewUrlTag
 * @param  url - Thumbnail Url
 * @returns void
 */
UniformConfiguration.prototype.setPreviewUrlTagName = function (tagName) {
    if (tagName) {
        this.previewUrlTagName = tagName;
    }
};

/**
 * This method returns the saved PreviewUrlTag
 * @returns thumbnailUrl
 */
UniformConfiguration.prototype.getPreviewUrlTagName = function () {
    return this.previewUrlTagName;
};

/**
 * This method set the status to show alert or not on page reload
 * @param status - Boolean Value
 * @returns void
 */
UniformConfiguration.prototype.setSkipAlertStatus = function (status) {
    this.isSkipAlert = status;
};

/**
 * This method retuens the status to show alert messag eon page reload
 * @returns Boolean value
 */
UniformConfiguration.prototype.getSkipAlertStatus = function () {
    return this.isSkipAlert;
};

/**
 * Setter method to save the copied style if any
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setCopiedStylesInfo = function (value) {
    if (this.copiedStyleInfo !== undefined) {
        this.copiedStyleInfo = value;
    }
};

/**
 * Setter method to save the copied style designs
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setCopyOfStyleDesignsInfo = function (value) {
    if (this.copiedStyleDesignsInfo !== undefined) {
        this.copiedStyleDesignsInfo = value;
    }
};

/**
 * Setter method to save the copied style designs for youth
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setCopyOfStyleYouthDesignsInfo = function (value) {
    if (this.copiedStyleYouthDesignsInfo !== undefined) {
        this.copiedStyleYouthDesignsInfo = value;
    }
};

/**
 * Setter method to save the copied youth style if any
 * 
 * @param value Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.setCopiedYouthStylesInfo = function (value) {
    if (this.copiedYouthStyleInfo !== undefined) {
        this.copiedYouthStyleInfo = value;
    }
};

/**
 * Getter method To retrieve copied style information 
 * @return object
 */
UniformConfiguration.prototype.getCopiedStylesInfo = function () {
    return this.copiedStyleInfo || null;
};

/**
 * Getter method To retrieve copied youth style information 
 * @return object
 */
UniformConfiguration.prototype.getCopiedYouthStylesInfo = function () {
    return this.copiedYouthStyleInfo || null;
};

/**
 * Getter method To retrieve copied style Design information 
 * @return object
 */
UniformConfiguration.prototype.getCopyOfStyleDesignsInfo = function () {
    return this.copiedStyleDesignsInfo || null;
};

/**
 * Getter method To retrieve copied style Youth Designinformation 
 * @return object
 */
UniformConfiguration.prototype.getCopyOfStyleYouthDesignsInfo = function () {
    return this.copiedStyleYouthDesignsInfo || null;
};


/**
 * Setter method to save the Roster Player information
 * @param {type} key like - playerName, playerNumber 
 * @param {type} value
 * @returns void
 */
UniformConfiguration.prototype.setRosterPlayers = function (key, value) {
    if (this.RosterPlayers !== undefined) {
        if (key === '' || key === null)
            this.RosterPlayers = value;
        else if (key !== '')
            this.RosterPlayers[key] = value;
    }
};

/**
 * Getter method to save the RosterItems
 * 
 * @param RosterItems Sets value in the form of object
 * 
 * @return void
 */
UniformConfiguration.prototype.getRosterPlayers = function (key) {
    if (key !== undefined && key !== '')
        return this.RosterPlayers[key] || null;
    else
        return this.RosterPlayers;
};

/*
*Setter method for clicked graphic info
*/
UniformConfiguration.prototype.setClickedGraphicsInfo = function (key, value) {
    if (key !== undefined) {
        if (key === '' || key === null) {
            this.clickedGraphicInfo = value;
        } else {
            this.clickedGraphicInfo["_"+key] = value;
        }
    }
};

/*
*Getter method for clicked graphics info
*/
UniformConfiguration.prototype.getClickedGraphicsInfo = function (key) {
    if (key === undefined) {
        return this.clickedGraphicInfo;
    }
	key = key.replace("_","");
    return this.clickedGraphicInfo["_"+key];
}

/*
*Setter method for image array for production
*/
UniformConfiguration.prototype.setImagesForProduction = function (arrImages) {
    this.productionImages = arrImages;
};

/*
*Getter method for image array for production
*/
UniformConfiguration.prototype.getImagesForProduction = function () {
    return this.productionImages;
};

/*
*Setter method for upload image array related to anchor points
*/
UniformConfiguration.prototype.setAnchorPointuploadedImagesForProduction = function (arrImages) {
    this.anchroPointsUploadedImages = arrImages;
};

/*
*Getter method upload image array related to anchor points
*/
UniformConfiguration.prototype.getAnchorPointuploadedImagesForProduction = function () {
    return this.anchroPointsUploadedImages;
};
