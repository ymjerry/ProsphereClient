/**
 * TWA proshpere configurator
 * 
 * @package proshpere
 * @subpackage core
 */

/**
 * webservices.js is used to configure Web service URLs
 * 
 */

/**
 * Defines the Web service URLs
 * 
 */
var WEB_SERVICE_URL = {
    METHOD_NAME_STUB: {
        SPORT_LIST: 'stub_data/stubsportlist.html',
        CUT_STYLE: 'stub_data/stubCutDesign.json',
        DESIGN: '',
        COLOR_CONFIGURATOR: 'stub_data/stubcolorslist.html',
        SAVED_UNIFORM: 'stub_data/stubSavedUniform.json',
        LOAD_CONFIG: 'stub_data/UniformConfigurator.json',
        LOAD_CONFIG_UID: 'stub_data/stubSavedUniform.json', // FOR TESTING OTHERWISE IT WILL COME FROM SERVER
        SAVE_CONFIG: 'saveconfig',
        FABRIC_LIST: 'stub_data/stubCutDesign.html',
        FONT_LIBRARY: 'stub_data/fontlibrary.json',
        TEXT_EFFECT_LIBRARY: 'stub_data/texteffectlibrary.json',
        ANCHOR_POINT_LIBRARY: 'stub_data/anchorPoint.json',
        GRAPHIC_CATEGORY_LIST: 'stub_data/stubGraphicCategory.json',
        GRAPHIC_LIST: 'stub_data/stubGraphics.json',
        STYLE_SIZE_FABRIC_PRICE: 'stub_data/gender_style_size_top.json',
        ROSTER_UPLOAD_URL: 'ValidateRosterFile',
        TEXT_DECAL_LIST: 'stub_data/textdecallibrary.json',
        LOAD_SESSION_DATA: 'stub_data/loadsessiondata.json',
        MODEL_PREVIEW_IMAGE_URL: 'stub_data/textdecallibrary.json',
        MY_LOCKER_LIST:'stub_data/mylocker.json',
        GET_IMAGE_CORRECTION_STATUS:'stub_data/getImageCorrectionStatus.json',
        GET_YOUTH_DESIGN_SIZES: 'GetYouthDesignSizes',
        GET_PROSPHERE_PLUS_URL: 'stub_data/prosphereSendEmail.json',
        GET_GARMENT_SIZES: 'GetGarmentTextAndGraphicSizes',
        SERVER_LOG_URL: 'stub_data/updateLog.json',
        GET_UPDATED_ANCHOR_POINT_IMAGES_INFO: 'stub_data/getUpdatedAnchorPointImages.json'
    },
    METHOD_NAME_SERVER: {
        SPORT_LIST: 'GetSportCategoryList',
        CUT_STYLE: 'GetStyleList',
        DESIGN: '',
        COLOR_CONFIGURATOR: 'GetColorList',
        SAVED_UNIFORM: '',
        LOAD_CONFIG: 'LoadConfiguration',
        LOAD_CONFIG_UID: 'LoadConfiguration',
        SAVE_CONFIG: 'SaveConfiguration',
        FABRIC_LIST: 'GetStyleList',
        FONT_LIBRARY: 'GetFontList',
        TEXT_EFFECT_LIBRARY: 'GetTextEffectList',
        GRAPHIC_CATEGORY_LIST: 'GetGraphicCategoryList',
        GRAPHIC_LIST: 'GetGraphicList',
        STYLE_SIZE_FABRIC_PRICE: 'GetSizeFabricPriceList',
        ROSTER_UPLOAD_URL: 'ValidateRosterFile',
        MY_LOCKER_LIST: 'GetLockerFileList',
        VALIDATE_UPLOAD_GRAPHIC_URL: 'ValidateGraphicFile',
        UPLOAD_GRAPHIC_URL: 'UploadGraphicFile',
        TEXT_DECAL_LIST: 'GetTextDecalList',
        LOAD_SESSION_DATA: 'GetSessionData',
        GET_ANCHOR_POINTS: 'GetAnchorPoints',
        MODEL_PREVIEW_IMAGE_URL: 'GetModelPreviewImage',
        GET_IMAGE_CORRECTION_STATUS:'GetImageCorrectionStatus',
        GET_YOUTH_DESIGN_SIZES: 'GetStyleDesignsAndSizes',
        GET_PROSPHERE_PLUS_URL: 'SendProspherePlusEmail',
        GET_GARMENT_SIZES: 'GetGarmentTextAndGraphicSizes',
        SERVER_LOG_URL: '',
        GET_UPDATED_ANCHOR_POINT_IMAGES_INFO: 'GetUpdatedAnchorPointImages'
    },
    get: function(key, isLocal) {
        if (isLocal == 1) {
            return CONFIG.get('BASE_URL') + this.METHOD_NAME_STUB[key];
        }
        return CONFIG.get('SERVER_URL') + this.METHOD_NAME_SERVER[key];
    }
};
