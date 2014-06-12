/**
 * TWA proshpere configurator
 * 
 * global.js is used to maintain app related functions;
 * @package proshpere
 * @subpackage uibl
 */

/**
 * Setting the Global Instance for various screens, It returns the single object on each call instead of creating new objects everytime
 * 
 */
var GlobalInstance = {
    sportsInstance: null,
    styleAndDesignInstance: null,
    colorInstance: null,
    uniformConfigurationInstance: null,
    fabricInstance: null,
    uniformConfigurationListInstance: null,
    loadConfigurationInstance: null,
    saveConfigurationInstance: null,
    emblemGraphicsInstance: null,
    selectGraphicsInstance: null,
    uploadGraphicsInstance: null,
    myLockerInstance: null,
    numberAndTextInstance: null,
    otherTextInstance: null,
    playerNameInstance: null,
    playerNumberInstance: null,
    teamNameInstance: null,
    fontInstance: null,
    textEffectInstance: null,
    anchorPointInstance: null,
    emailPrintSaveInstance: null,
    shoppingCartInstance: null,
    dialogBoxInstance: null,
    popupInstance: null,
    modelLargerViewInstance: null,
    notificationsPopupInstance: null,
    rosterInstance: null,
    printInstance: null,
    printElementInstance: null,
    googleAnalyticsUtilInstance: null,
    colorRetainInstance:null,
    dualLaunchInstance: null,
    fontSelectionInstance: null,
    /**
     * This method creates the instance of sports
     * @returns {@exp;GlobalInstance@pro;sportsInstance}
     * 
     */
    getSportsInstance: function() {
        if (GlobalInstance.sportsInstance == null) {
            GlobalInstance.sportsInstance = new Sports();
        }
        return GlobalInstance.sportsInstance;
    },
    /**
     * This method creates the instance of color
     * 
     * @param  ctrId id of primary color panel
     * @param  secondaryColorPanelId id of secondary color panel
     * @param  tertiaryColorPanelId id of tertiary color panel
     * 
     * @returns {@exp;GlobalInstance@pro;colorInstance}
     * 
     */
    getColorInstance: function(ctrId, secondaryColorPanelId, tertiaryColorPanelId) {
        if (GlobalInstance.colorInstance == null) {
            GlobalInstance.colorInstance = new Color(ctrId, secondaryColorPanelId, tertiaryColorPanelId);
        }
        return GlobalInstance.colorInstance;
    },
    /**
     * This method creates and returns the instance of Fabrics
     * @returns {@exp;GlobalInstance@pro;fabricInstance}
     * 
     */
    getFabricInstance: function() {
        if (GlobalInstance.fabricInstance == null) {
            GlobalInstance.fabricInstance = new Fabrics();
        }
        return GlobalInstance.fabricInstance;
    },
    /**
     * This method creates and returns the instance of Uniform configuration
     * @returns {@exp;GlobalInstance@pro;uniformConfigurationInstance}
     * 
     */
    getUniformConfigurationInstance: function() {
        if (GlobalInstance.uniformConfigurationInstance == null) {
            GlobalInstance.uniformConfigurationInstance = new UniformConfiguration();
        }
        return GlobalInstance.uniformConfigurationInstance;
    },
    /**
     * This method creates and returns the instance of Load Configuration 
     * @returns {@exp;GlobalInstance@pro;loadConfigurationInstance}
     * 
     */
    getLoadConfigurationInstance: function() {
        if (GlobalInstance.loadConfigurationInstance == null) {
            GlobalInstance.loadConfigurationInstance = new LoadConfig();
        }
        return GlobalInstance.loadConfigurationInstance;
    },
    /**
     * This method creates and returns the instance of Save configuration
     * @returns {@exp;GlobalInstance@pro;saveConfigurationInstance}
     */
    getSaveConfigurationInstance: function() {
        if (GlobalInstance.saveConfigurationInstance == null) {
            GlobalInstance.saveConfigurationInstance = new SaveConfig();
        }
        return GlobalInstance.saveConfigurationInstance;
    },
    /**
     * This method creates and Returns the instance of Style and Design
     * @returns {@exp;GlobalInstance@pro;styleAndDesignInstance}
     */
    getStyleAndDesignInstance: function() {
        if (GlobalInstance.styleAndDesignInstance == null) {
            GlobalInstance.styleAndDesignInstance = new StyleAndDesign();
        }
        return GlobalInstance.styleAndDesignInstance;
    },
    /**
     * This method creates and returns the instance of Emblem and graphics
     * @returns {@exp;GlobalInstance@pro;emblemGraphicsInstance}
     */
    getEmblemAndGraphicsInstance: function() {
        if (GlobalInstance.emblemGraphicsInstance == null) {
            GlobalInstance.emblemGraphicsInstance = new EmblemGraphics();
        }
        return GlobalInstance.emblemGraphicsInstance;
    },
    /**
     * This method creates and returns the instancde of select a graphcis
     * @returns {@exp;GlobalInstance@pro;selectGraphicsInstance}
     * 
     */
    getSelectGraphicsInstance: function() {
        if (GlobalInstance.selectGraphicsInstance == null) {
            GlobalInstance.selectGraphicsInstance = new Graphics();
        }
        return GlobalInstance.selectGraphicsInstance;
    },
    /**
     * This method creates and returns the instance of the upload graphics
     * @returns {@exp;GlobalInstance@pro;uploadGraphicsInstance}
     */
    getUploadGraphicsInstance: function() {
        if (GlobalInstance.uploadGraphicsInstance == null) {
            GlobalInstance.uploadGraphicsInstance = new UploadGraphics();
        }
        return GlobalInstance.uploadGraphicsInstance;
    },
    /**
     * This method creates and returns the instance of My locker
     * @returns {@exp;GlobalInstance@pro;myLockerInstance}
     */
    getMyLockerInstance: function() {
        if (GlobalInstance.myLockerInstance == null) {
            GlobalInstance.myLockerInstance = new MyLocker();
        }
        return GlobalInstance.myLockerInstance;
    },
    /**
     * This method creates and returns the instance of number and Text 
     * @returns {@exp;GlobalInstance@pro;numberAndTextInstance}
     * 
     */
    getNumberAndTextInstance: function() {
        if (GlobalInstance.numberAndTextInstance == null) {
            GlobalInstance.numberAndTextInstance = new NumberAndText();
        }
        return GlobalInstance.numberAndTextInstance;
    },
    /**
     * This method creates and returns the instance of OtherText
     * @returns {@exp;GlobalInstance@pro;otherTextInstance}
     */
    getOtherTextInstance: function() {
        if (GlobalInstance.otherTextInstance == null) {
            GlobalInstance.otherTextInstance = new OtherText();
        }
        return GlobalInstance.otherTextInstance;
    },
    /**
     * This method creates and returns the instance of Player name
     * @returns {@exp;GlobalInstance@pro;playerNameInstance}
     */
    getPlayerNameInstance: function() {
        if (GlobalInstance.playerNameInstance == null) {
            GlobalInstance.playerNameInstance = new PlayerName();
        }
        return GlobalInstance.playerNameInstance;
    },
    /**
     * This method creates and returns the effect of Player number
     * @returns {@exp;GlobalInstance@pro;playerNumberInstance}
     */
    getPlayerNumberInstance: function() {
        if (GlobalInstance.playerNumberInstance == null) {
            GlobalInstance.playerNumberInstance = new PlayerNumber();
        }
        return GlobalInstance.playerNumberInstance;
    },
    /**
     * This method creates and return the instance of Team name
     * @returns {@exp;GlobalInstance@pro;teamNameInstance}
     */
    getTeamNameInstance: function() {
        if (GlobalInstance.teamNameInstance == null) {
            GlobalInstance.teamNameInstance = new TeamName();
        }
        return GlobalInstance.teamNameInstance;
    },
    /**
     * This method creates and returns the instance of Font
     * @returns {@exp;GlobalInstance@pro;fontInstance}
     */
    getFontInstance: function() {
        if (GlobalInstance.fontInstance == null) {
            GlobalInstance.fontInstance = new Font();
        }
        return GlobalInstance.fontInstance;
    },
    /**
     * This method creates and returns the instance of Text Effect
     * @returns {@exp;GlobalInstance@pro;textEffectInstance}
     */
    getTextEffectInstance: function() {
        if (GlobalInstance.textEffectInstance == null) {
            GlobalInstance.textEffectInstance = new TextEffect();
        }
        return GlobalInstance.textEffectInstance;
    },
    /**
     * This method creates and returns the instance of EmailPrintSave.js
     * @returns {@exp;GlobalInstance@pro;emailPrintSaveInstance}
     */
    getEmailPrintSaveInstance: function() {
        if (GlobalInstance.emailPrintSaveInstance == null) {
            GlobalInstance.emailPrintSaveInstance = new EmailPrintSave();
        }
        return GlobalInstance.emailPrintSaveInstance;
    },
    /**
     * This method creates and returns the instance of Shopping cart
     * @returns {@exp;GlobalInstance@pro;shoppingCartInstance}
     */
    getShoppingCartInstance: function() {
        if (GlobalInstance.shoppingCartInstance == null) {
            GlobalInstance.shoppingCartInstance = new ShoppingCart();
        }
        return GlobalInstance.shoppingCartInstance;
    },
    /**
     * This method creates and returns the instance of DialogBox
     * @returns {@exp;GlobalInstance@pro;dialogBoxInstance}
     */
    getDialogBoxInstance: function() {
        if (GlobalInstance.dialogBoxInstance == null) {
            GlobalInstance.dialogBoxInstance = new DialogBox();
        }
        return GlobalInstance.dialogBoxInstance;
    },
    /**
     * This method creates and returns the instance of AnchorPoint
     * @returns {@exp;GlobalInstance@pro;anchorPointInstance}
     */
    getAnchorPointInstance: function() {
        if (GlobalInstance.anchorPointInstance == null) {
            GlobalInstance.anchorPointInstance = new AnchorPoint();
        }
        return GlobalInstance.anchorPointInstance;
    },
    /**
     * This method creates and retuns the instance of POPUP
     * @returns {@exp;GlobalInstance@pro;popupInstance}
     */
    getPopupInstance: function() {
        if (GlobalInstance.popupInstance == null) {
            GlobalInstance.popupInstance = new Popup();
        }
        return GlobalInstance.popupInstance;
    },
    /**
     * This method creates and returns the instance of Model largeview
     * @returns {@exp;GlobalInstance@pro;modelLargerViewInstance}
     */
    getModelLargerViewInstance: function() {
        if (GlobalInstance.modelLargerViewInstance == null) {
            GlobalInstance.modelLargerViewInstance = new ModelLargerView();
        }
        return GlobalInstance.modelLargerViewInstance;
    },
    /**
     * This method creates and returns the instance of Notification Popup
     * @returns {@exp;GlobalInstance@pro;notificationsPopupInstance}
     */
    getNotificationsPopupInstance: function() {
        if (GlobalInstance.notificationsPopupInstance == null) {
            GlobalInstance.notificationsPopupInstance = new NotificationsPopup();
        }
        return GlobalInstance.notificationsPopupInstance;
    },
    /**
     * This method creates and returns the instance of Print
     * @returns {@exp;GlobalInstance@pro;printInstance}
     */
    getPrintInstance: function() {
        if (GlobalInstance.printInstance === null) {
            GlobalInstance.printInstance = new print();
        }
        return GlobalInstance.printInstance;
    },
    /**
     * This method creates and returns the instance of Roaster
     * @returns {@exp;GlobalInstance@pro;rosterInstance}
     */
    getRosterInstance: function() {
        if (GlobalInstance.rosterInstance === null) {
            GlobalInstance.rosterInstance = new Roster();
        }
        return GlobalInstance.rosterInstance;
    },
    /**
     * This method creates and returns the instance of print element
     * @returns {@exp;GlobalInstance@pro;printElementInstance}
     */
    getPrintElementInstance: function() {
        if (GlobalInstance.printElementInstance === null) {
            GlobalInstance.printElementInstance = new PrintElement();
        }
        return GlobalInstance.printElementInstance;
    },
    /**
     * This method creates and returns the instance of google Analytics class object
     * @returns {@exp;GlobalInstance@pro;googleAnalyticsUtilInstance}
     */
    getGoogleAnalyticsUtilInstance: function() {
        if (GlobalInstance.googleAnalyticsUtilInstance === null) {
            GlobalInstance.googleAnalyticsUtilInstance = new GoogleAnalyticsUtil();
        }
        return GlobalInstance.googleAnalyticsUtilInstance;
    },
    /**
     * This method creates and returns the instance of colorRetain class object
     * @returns {@exp;GlobalInstance@pro;getColorRetainInstance}
     */
    getColorRetainInstance: function() {
        if (GlobalInstance.colorRetainInstance === null) {
            GlobalInstance.colorRetainInstance = new ColorRetain();
        }
        return GlobalInstance.colorRetainInstance;
    },
    
    /**
     * This method creates and returns the instance of dualLaunch class object
     * @returns {@exp;GlobalInstance@pro;dualLaunchInstance}
     */
    getDualLaunchInstance: function() {
        if (GlobalInstance.dualLaunchInstance === null) {
            GlobalInstance.dualLaunchInstance = new DualLaunch();
        }
        return GlobalInstance.dualLaunchInstance;
    },
    /**
     * This method creates and returns the instance of fontSelection class object
     * @returns {@exp;GlobalInstance@pro;FontSelection}
     */
    getFontSelectionInstance: function () {
        if (GlobalInstance.fontSelectionInstance === null) {
            GlobalInstance.fontSelectionInstance = new FontSelection();
        }
        return GlobalInstance.fontSelectionInstance;
    },
    


};

/**
 * Sets Global Screen flags and return which different screen has set the options
 * 
 */
var GlobalFlags = {
    screen: {
        isLocker: false,
        isUploadGraphic: false,
        isFabricScreenLoaded: false,
        isAnchorPointDataRecieved: false,
        isLargerModelPreviewLoaded:false
    },
    setScreenFlags: function(screenFlag, isWorked) {
        this.screen[screenFlag] = isWorked;
    },
    getScreenFlags: function(screenFlag) {
        return this.screen[screenFlag];
    }
};
var GlobalConfigurationData = {
    colorId: 0,
    genderId: 0,
    categoryId: 0,
    sport: '',
    styleId: 0,
    designId: 0,
    fabricId: 0,
    applicationId: 2,
    customerId: 100000,
    fabricList: null,
    displaySlideImageFirstTime: 0
};
