/**
 * TWA proshpere configurator
 * 
 * @package proshpere
 * @subpackage core
 */

/**
 * configuration.js defines configure parameters commonly used in the application
 * 
 */

// Define variable to check if environment is set to DEBUG or not
var LOCAL = 0;
var PORT_NUMBER = 8080;
var BASE_URL = 'http://origin.thefanorama.com';
//BASE_URL = 'http://twa-api.india.rsystems.com';

/**
 * Returns the Base URL
 * 
 * @return string - Base URL
 */
getBaseUrl = function() {
    var baseUrlClient = location.protocol + "//" + location.hostname
            + (location.port && ":" + location.port) + "/";
    return baseUrlClient + '';
};
/**
 * Defines the configuration parameter
 * 
 */
var CONFIG = (function() {
    var CONSTANT = {
        GOOGLE_ANALYTICS_PROPERTY_ID: "UA-46163633-1",
        REQUEST_TIMEOUT: 15000, // 15 seconds for default request timeout
        DEBUG: false, // Debug mode
        DEBUG_STRING: '=== DEBUG MODE === DEBUG MODE === DEBUG MODE ===\n', // Debug
        BASE_URL: getBaseUrl(),
        HOME_URL: getBaseUrl() + 'index.html',
        SERVER_BASE_URL: BASE_URL ,
        SERVER_URL: BASE_URL + ':'+PORT_NUMBER + '/Services/DataServices/',
        IMAGE_DIR: "images/",
        WEBSERVICE_SUCCESS_CODE: 1,
        WEBSERVICE_FAILURE_CODE: 0,
        SHOW: 'S',
        HIDE: 'H',
        TOP_IMAGE_LINK: 2,
        NOTIFICATION_POPUP_FOOTBALL_TEXT: 'FOOTBALL',
        FABRIC_DEFAULT_COLOR: '#FFFFFF',
        DEFAULT_COLOR:'#FFFFFF',
        DEFAULT_COLOR_SEC:'#0A0A0A',
        DEFAULT_COLOR_TERTIARY:'#616365',
        BOTTOM_IMAGE_LINK: 3,
        PRICE_SYMBOL: "$",
        CONSUMER_HELP_URL: "http://www.teamworkathletic.com/media/design-uniform/htmlHelp/teamwork-ProSphere-help-consumer.html",
        DEALER_HELP_URL: "http://www.teamworkathletic.com/media/design-uniform/htmlHelp/teamwork-ProSphere-help.html",
        LIVE_CHAT_URL:'http://server.iad.liveperson.net/hc/32520865/?cmd=file&file=visitorWantsToChat&site=32520865&imageUrl=http://server.iad.liveperson.net/hcp/Gallery/ChatButton-Gallery/English/Consulting/3a&referrer=' + escape(document.location),
        DEFAULT_CART_INFO: {Price: 100.00, Name: "PREMIUM Stretch Spandex", ItemId: 'F102-5'},
        STYLE_ID_TOP: 2,
        STYLE_ID_BOTTOM: 3,
        MATCHING_STYLE_ID_BOTTOM: 1001,
        MATCHING_COPY_STYLE_ID: 1001,
        PROSHPERE_APPLICATION_ID: 2,
        PRICE_PRECISION: 4,
        VERSION: true,
        VERSION_NUMBER: "104",
        DEFAULT_MODEL_PREVIEW_WIDTH: 300,
        DEFAULT_MODEL_PREVIEW_HEIGHT: 562,
        LARGER_MODEL_PREVIEW_WIDTH: 560,
        LARGER_MODEL_PREVIEW_HEIGHT: 1024,
        ROSTER_MODEL_PREVIEW_WIDTH: 221,
        ROSTER_MODEL_PREVIEW_HEIGHT: 430,
        DEFAULT_ROSTER_PLAYER: 11,
        MAX_ROSTER_PLAYER: 1000,
        TOP_DISPLAY_NAME: "Jersey",
        BOTTOM_DISPLAY_NAME: "Shorts",
        STYLES_DESIGN_PER_PAGE: 8,
        SPORT_GENDER_ID_MALE: 2,
        SPORT_GENDER_ID_FEMALE: 4,
        SPORT_GENDER_ID_YOUTH_MALE: 1,
        TOOLTIP_DURATION: 10000,
        SPORT_GENDER_ID_YOUTH_FEMALE: 3,
        COLOR_COUNT: 37,
        CUSTOM_COLOR_COUNT: 7,
        DEFAULT_PRICE_LIST: "Standard",
        DEFAULT_MARKUP_PRICE: 0,
        DUMMY_AXAPTA_COLOR_ID: "5A",
        DEFAULT_PRICE_SHOPPING_CART_SIZE_NUMBER: "M",
        LANDING_PAGE_STYLE_DESIGN: 0,
        LANDING_PAGE_ROSTER: 1,
        LANDING_PAGE_PROOF: 2,
        LANDING_PAGE_FABRIC: 3,
        BASEBALL_STRING: "Baseball",
        BASKETBALL_STRING: "Basketball",
        FANWAER_STRING: "Fanwear",
        FOOTBALL_STRING: "Football",
        HOCKEY_STRING: "Hockey",
        LACROSSE_STRING: "Lacrosse",
        SIDELINE_STRING: "Sideline",
        SOCCER_STRING: "Soccer",
        SOFTBALL_STRING: "Softball",
        TRACK_STRING: "Track",
        VOLLEYBALL_STRING: "Volleyball",
        WRESTLING_STRING: "Wrestling",
        CURRENT_UNIFORM_CONFIG: 2,
        EMAIL_TYPE_NO_EMAIL: 0,
        EMAIL_TYPE_SAVE_EMAIL: 1,
        EMAIL_TYPE_FORWORD_EMAIL: 2,
        EMAIL_TYPE_APPROVE_LATER_CONTACT: 3,
        EMAIL_TYPE_APPROVE_LATER: 4,
        EMAIL_TYPE_APPROVE_LATER_BOTH: 5,
        BIRD_EYE_VIEW_ORIENTATION_FRONT: "front",
        BIRD_EYE_VIEW_ORIENTATION_BACK: "back",
        BIRD_EYE_VIEW_ORIENTATION_LEFT: "left",
        BIRD_EYE_VIEW_ORIENTATION_BIRDEYEVIEW: "birdseye",
        BIRD_EYE_VIEW_ORIENTATION_RIGHT: "right",
        MODEL_PREVIEW_SIZE_NUMBER: "l",
        MODEL_PREVIEW_SCALE: 0.048,
        MODEL_PREVIEW_LARGE_SCALE: 0.095,
        MODEL_PREVIEW_SIZE_SUFFIX: "300px",
        MODEL_PREVIEW_SIZE_LARGER_SUFFIX: "600px",
        MODEL_PREVIEW_STTYLE_HEIGHT: 13500,
        MODEL_PREVIEW_STTYLE_WIDTH: 6300,
        MODEL_PREVIEW_VIEW: 'front',
        DEFAULT_DESIGN_NUMBER: 'avenger',
        DEFAULT_SPORT: 'football',
        DEFAULT_STYLE_NUMBER: '00024r1',
        SPORT_BASEBALL_UPPER_CASE: 'BASEBALL',
        SPORT_BASKETBALL_UPPER_CASE: 'BASKETBALL',
        SPORT_FOOTBALL_UPPER_CASE: 'FOOTBALL',
        DEFAYLT_COLOR_TEXT: 'Choose Color',
        ADV_UNIFORM_TYPE: 'B',
        PAGE_TITLE: "Teamwork Athletic Apparel | Design Your Own Uniform",
        LIQUID_PIXEL_CHAIN_BASE_URL: "http://teamwork.liquifire.com/teamwork?",
        GRAPHIC_DEGREE: '270',
        GRAPHIC_WIDTH: '600',
        GRAPHIC_HEIGHT: '600',
        FABRIC_OPACITY: '70',
        STYLE_OPACITY: '255',
        FLATCUT_STYLEHEIGHT: '13500',
        FLATCUT_SCALE: '0.095',
        PRODUCTION_SCALE: '1',
        PRODUCTION_STYLE_HEIGHT: '12000',
        PRODUCTION_STYLE_WIDTH: '6300',
        FLATCUT_STYLEWIDTH: '6300',
        PRICE_VALUE_UNCHECK: '0.0',
        SPECIAL_CHARACTER_REGES: '^.*?(?=[\^#%&$\*:<>\?/\{\|\}]).*$',
        VALID_RESPONSE_FROM_API: 1,
        SCREEN_ANIMATION_SPEED: 'fast',
        GRAPHIC_3CLR_COLOR_1: '_3clr_color_1',
        GRAPHIC_3CLR_COLOR_2: '_3clr_color_2',
        GRAPHIC_3CLR_COLOR_3: '_3clr_color_3',
        GRID_FILE_TOP: "1",
        GRID_FILE_BOTTOM: "2",
        SKUID_DEFALUT_VALUE: "not found",
        AGE_CATEGORY_MEN: 'Men',
        AGE_CATEGORY_BOYS: 'Boys',
        AGE_CATEGORY_FEMALE: 'Women',
        AGE_CATEGORY_GIRLS: 'Girls',
        AGE_CATEGORY_ADULT: 'Adult',
        AGE_CATEGORY_YOUTH: 'Youth',
        DEFAULT_BIRD_EYE_VIEW_COUNT: 3,
        DEFAULT_ERROR_BOX_MARGIN_TOP: 30,
        ERROR_CLASS_NAME: 'error',
        DEFAULT_COLOR_ID: '1001',
        FOOTBALL_COLOR_LINK_TEXT: 'Can I design jerseys & pants to be in different colors?',
        OTHER_COLOR_LINK_TEXT: 'Can I design jerseys & shorts to be in different colors?',
        DEFAULT_DEALER_LOGO: 'sa.png',
        STYLE_COMBINE_ID: { 1083: 1161, 1103: 1160, 1104: 1159 },
        STYLE_HIDE: [1159, 1160, 1161],
        STYLE_SHOW: [1083, 1103, 1104],
        STYLE_COMBINE_ID_FEMALE: { 1171: 1088, 1172: 1087, 1173: 1085, 1184: 1181, 1183: 1180, 1182: 1179 },
        STYLE_HIDE_FEMALE: [1088, 1087, 1085, 1181, 1180, 1179],
        STYLE_SHOW_FEMALE: [1171, 1172, 1173, 1184, 1183, 1182],
        COLORID_ONE: 1,
        COLORID_TWO: 2,
        COLORID_THREE: 3,
        COLORID_FOUR: 4,
        STRING_TYPE_NAME: '1001',
        STRING_TYPE_NUMBER: '1002',
        USE_GRAPHIC_ANALYZER: 'true',
        ACCOUNT_URL: "http://www.teamworkathletic.com/taa/my-account/index.jsp",
        STRAIGHT_TEXT_NAME: "Straight",
        SIZE_SUFFIX: '600px',
        DEFAULT_SIZE: '4',
        DEFAULT_PRIMARY_COLOR: 'EEEEEE',
        DEFAULT_SECONDARY_COLOR: '999999',
        DEFAULT_ACCENT_COLOR: '333333',
        DEFAULT_GRAPHIC_HEIGHT: '50',
        ZERO_VALUE: '0',
        DEFAULT_TEXT_POSX: '11',
        DEFAULT_TEXT_POSY: '33',
        DEFAULT_HEIGHT: '223',
        DEFAULT_WIDTH: '1000',
        DEFAULT_TEXTBOX_HEIGHT: '151',
        DEFAULT_TEXTBOX_WIDTH: '976',
        DEFAULT_FONT_COLOR: '181616',
        DEFAULT_BASEIMG_WIDTH: "100",
        DEFAULT_BASEIMG_HEIGHT: '30',
        NONE_VALUE: "None",
        WIDTH_BLANK: '600',
        ANCHOR_RELATIONSHIP_ID: 2,
        ANCHOR_RELATIONSHIP_ABOVE: 3,
        ANCHOR_RELATIONSHIP_NONE: 1,
        SCALE_BACKGROUND: 1,
        CONTENT_ID_LOGO: 4,
        CONTENT_ID_TAG: 3,
        LOGO_POSITION: 0,
        MAGE_TYPE_PNG: 'png',
        MAGE_TYPE_GIF: 'gif',
        MAGE_TYPE_TIFF: 'tiff',
        MAGE_TYPE_TIF: 'tif',
        SCALE_DEALER_LOGO: '0.18',
        FLAG_PRECASH_BY_SERVICE: false,
        DEFAULT_LOGO_VALUE: 'DefaultPSLogo',
        SUPPORTED_IMAGE_TYPES_DEALER_LOGO: ['png', 'tif', 'tiff', 'gif'],
        NOT_ALLOWED_SPECIAL_CHARACTER_PLAYER_ROSTER : ['%','&'],
        DEFAULT_RETRIEVAL_CODE: 0,
        ANCHORORIGIN_ID_NORTH_CENTER_CASE: 1,
        ANCHORORIGIN_ID_CENTER_CENTER_CASE: 2,
        CORRECTION_FEE_FEATURE_REQUIRED: true,
        CORRECTION_FEE_AMOUNT: 25,
        CORRECTION_FEE_STRING: "Proceed with this Uploaded Image and use ProSphere's in house design service to fix your artwork for a $",
        CORRECTION_FEE_PROMOTION_APPLICABLE: false,
        PANEL_PLAYER_NAME: 'Player Name',
        PANEL_PLAYER_NUMBER: 'Player Number',
        PANEL_TEAM_NAME: 'Team Name',
        PANEL_OTHER_TEXT: 'Other Text',
        PANEL_GRAPHIC: 'Graphic',
        PANEL_UPLOADED_GRAPHIC: 'Uploaded Graphic',
        IMAGE_FORMAT_VECTOR: 'Vector',
        IMAGE_FORMAT_RASTER: 'Raster',
        DEFAULT_SIZE_VALUE: 3,
        USER_TYPE_CUSTOMER: 'Customer',
        USER_TYPE_DEALER: 'Dealer',
        UPDATE_LOG_ON_SERVER: false,
        //APPLY_CORRECTION_FEE_IN_DEV:false,
        COLORIZEID_NONE: 1,
        COLORIZEID_COLOR_1: 2,
        COLORIZEID_COLOR_2: 3,
        COLORIZEID_COLOR_3: 4,
        SUPPORTED_IMAGE_TYPES_UPLOAD_GRAPHICS: ['bmp', 'png', 'jpeg', 'jpg', 'psd', 'tif', 'tiff', 'ai', 'pdf'],
        VECTOR_GRAPHICS_EXTENSTIONS: [/*'eps'*/, 'ai', 'pdf'],
        RASTER_GRAPHICS_EXTENSTIONS: [/*'aco',*/'bmp', 'jpeg', 'jpg', 'png', 'tif', 'psd'],
        KNOCKOUT_CHAIN_APPLY_GRAPHIC_EXTENSTIONS: ['psd'],
        LOGO_ROTATION: 0,
        TAG_ROTATION: 0,
        SUPPORTED_NEW_FEATURES: ['New styles',
            'New designs',
            'New colors',
            'Tablet friendly',
            'Smart anchor technology <br> (prevents graphics from overlapping)',
            'Upload roster',
            'Proofs by size',
            'White background removal on uploaded graphics',
            'Birdseye View',
            'Flip graphic functionality'],
        NEW_DEALER: false,
        MODEL_PREVIEW_LENGTH: 1000,
        PROSPHERE_PLUS_SENT_MSG: "Your message has been sent!",
        TWA_CSA_EMAIL: "",
        PRO_PLUS_EMAIL_SUBJECT: "",
        PRO_PLUS_EMAIL_TYPE: 6,
        LEGACY_CONFIGURATOR_URL: "",
        PINTEREST_URL: "http://www.pinterest.com/teamworkapparel/prosphere/",
        NOT_SUPPORTED_RETRIEVAL_CODE: "RC",
        SUPPORTED_BENIFITS: ['Dedicated graphic designer to assist with all your design needs ',
                    'Custom designed uniforms for any sport',
                    'Custom changes to our existing design options',
                    'Replicated uniform designs',
                    '14 business day turnaround from proof approval'],
        PRO_PLUS_MESSAGE_LIMIT_COUNT: 250,
        PRO_PLUS_EMAIL_SENT_SUCCESS: 1,
        PRO_PLUS_PHONE_REGEX: /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
        LIVE_CHAT_CONTACT_NUMBER: '1.866.717.8278',
        CMYK_NONE: '#00000000FF',
        PRO_PLUS_LIVE_CHAT_URL: 'https://server.iad.liveperson.net/hc/32520865/?cmd=file&file=visitorWantsToChat&site=32520865&byhref=1',
        PRO_PLUS_DEALER_BANNER: "prospherePlusBanner_436x190.jpg",
        PRO_PLUS_CONSUMER_BANNER: "prospherePlusBannerConsumer.jpg",
        DEFAULT_LOGO_CHAIN: "/ASSETS/proSphereLogo_r0.chain",
        DEFAULT_SUBLIMATED_TAG_CHAIN: "/ASSETS/sublimatedTag_r0.chain",
        UNIFORM_LOGO_CHAIN_SUPPORTED_SPORTS_STYLES: {
            "sport": [
                        {
                            "id": 1008,//Hockey
                            "chain": "/ASSETS/accounts/easton/eastonLogo_r0.chain",
                            "supportedStyles": [
                                "00023r0",
                                "00047r0"
                            ]
                        }
            ]
        },
        SUBLIMATED_TAG_CHAIN_SUPPORTED_SPORTS_STYLES: {
            "sport": [
                        {
                            "id": 1008,//Hockey
                            "chain": "/ASSETS/accounts/easton/easton_subTag_r0.chain",
                            "supportedStyles": [
                                "00023r0",
                                "00047r0"
                            ]
                        }
            ]
        },
        INTERNET_EXPLORER_WEBSITE_LINK:"http://www.microsoft.com\\IE"
    };
    return {
        get: function(key) {
            return CONSTANT[key];
        }
    };
}());

/**
 * Defines the messages to be shown in alert box for the configurator
 * 
 */
var MESSAGES = (function() {
    var TEXT = {
        MESSAGE_INVALID_REQUEST: 'Invalid Request',
        MESSAGE_TECH_ERROR: 'Technical Error occurred',
        MESSAGE_EMAIL_SENT: 'Email has been sent',
        MESSAGE_SAVE_ORDER: 'Your uniform has been saved.\n Your uniform retrieval code is  ',
        MESSAGE_SAVE_VALIDATION: 'Fabric & Colors Required. Please Make a Selection For Each Option Before Proceedng.',
        MESSAGE_DESIGN_JERSY_PANT_DIFFERENT_COLOR: 'Yes. Configure just the jersey (check the "Top" check box) and add to cart.  Then click "Create an Away Uniform".  Configure just the pants (check the "Bottom" check box) and add to cart when done.',
        MESSAGE_HOW_TO: 'Updated Videos will be coming soon.',
        MESSAGE_ADD_CUSTOM_COLOR: 'Please contact your Teamwork Athletic Dealer to add a custom color.',
        MESSAGE_VALID_RETRIEVAL_CODE: 'Please enter a valid Uniform Retrieval Code.',
        MESSAGE_LARGER_VIEW: 'A larger view image will now be generated. This might take up to a minute.',
        MESSAGE_RESPONSE_VALID_RETRIEVAL_CODE: 'The Retrieval Code Cannot Be Found.',
        MESSAGE_WHAT_THIS_LINK_AT_NUMBER_TEXT_COLOR: 'Please contact your Teamwork Athletic at (800) 509-0194 to add a custom color.',
        MESSAGE_REMOVE_PLAYER: 'Are you sure you want to remove this player from the roster?',
        MESSAGE_GRAPHIC_EMPTY: 'Graphics are not present for the selected item.',
        MESSAGE_IN_PROGRESS: 'This functionality is in progress...',
        MESSAGE_GRAPHIC_VALIDATION: 'Please choose a graphic.',
        MESSAGE_ANCHOR_OVERWRITE: 'This Location is occupied. Do you want to overwrite what is in this location.',
        MESSAGE_MY_LOCKER_VALIDATION: 'Please choose a graphic.',
        MESSAGE_UPLOAD_GRAPHIC_VALIDATION: 'Please select a graphic.',
        MESSAGE_UPLOAD_GRAPHIC_NAME_VALIDATION: 'Please enter image name.',
        MESSAGE_MAX_ROSTER_PLAYER: 'You have exceeded the maximum number of Players that can be added.',
        MESSAGE_VALIDATE_CONTACT: 'Please provide a valid contact number',
        MESSAGE_VALIDATE_MAIL_PROOF: 'Please provide a valid Email',
        MESSAGE_ADD_ROSTER_PLAYER_INVALID_CHAR: 'The input contains invalid characters.',
        MESSAGE_ADD_ROSTER_PLAYER_EMPTY_VALUE: 'This field is required.',
        MESSAGE_ADD_ROSTER_PLAYER_NEGETIVE_VALUE: 'The amount may not be negetive.',
        MESSAGE_SAVE_FOR_NOW_VALIDATION: 'Please fill any of checkbox and enter respective text.',
        MESSAGE_ROSTER_AGE_CATEGORY_VALIDATE: "Player age category required for this uniform.\n",
        MESSAGE_ROSTER_ADD_PLAYER_VALIDATE: "Please add a player\n",
        MESSAGE_ROSTER_TOP_BOTTOM_VALIDATE: "Each player must have a top or bottom quantity \nthat is greater than 0.\n",
        MESSAGE_SESSION_VALIDATION_MSG: "Some of the essential arguments are missing to load the prosphere configurator. Please contact the admin.",
        MESSAGE_DESIGN_NUMBERTEXT_DIFFERENT_COLOR: 'Please select a font color.',
        MESSAGE_GRAPHIC_PRIMARY_COLOR_SELECTION: 'Please select a primary graphic color.,',
        MESSAGE_GRAPHIC_SECONDARY_COLOR_SELECTION: 'Please select a secondary graphic color.,',
        MESSAGE_GRAPHIC_ACCENT_COLOR_SELECTION: 'Please select a accent graphic color.,',
        MESSAGE_INTERNET_NOT_WORKING: "Please check, Your internet is not working.",
        MESSAGE_ERROR_RESPONSE: "Retrieval Code cannot be generated due to some technical error",
        MESSAGE_NUMBER_TEXT_FONT_COLOR_ERROR: "Please select a font color.",
        MESSAGE_PROCEED_TO_CHECKOUT_WARNING_PLAYERNAME_AND_PLAYERNUMBER_NOT_SELECTED: "You entered a player number and did not put one on your uniform.<br>You have a player name and did not put one on your uniform",
        MESSAGE_PROCEED_TO_CHECKOUT_WARNING_PLAYERNUMBER_SELECTED: "You entered a player number and did not put one on your uniform.",
        MESSAGE_PROCEED_TO_CHECKOUT_WARNING_PLAYERNAME_SELECTED: "You have entered a player name and did not put one on your uniform.",
        MESSAGE_PROCEED_TO_CHECKOUT_ERROR_PLAYERNAME_AND_PLAYERNUMBER_NOT_SELECTED: "You did not enter a Player Name/Number on one or more lines of your Roster. ",
        MESSAGE_PROCEED_TO_CHECKOUT_ERROR_PLAYERNAME_DOES_NOT_EXIST: "You did not enter a Player Name on one or more lines of your Roster. ",
        MESSAGE_PROCEED_TO_CHECKOUT_ERROR_PLAYERNUMBER_DOES_NOT_EXIST: "You did not enter a Player number on one or more lines of your Roster. ",
        MESSAGE_OVERRIDE_RETRIEVAL_CODE: 'Would you like to overwrite the previously saved uniform or create a new entry?',
        MESSAGE_INVALID_ROSTER_FORMAT: 'Invalid file format. Only XLSX,XLS,CSV files are allowed.',
        MESSAGE_EMPTY_FIELD: 'This field is required.',
        MESSAGE_MISSING_SYMBOL: 'An at sign (@) is missing in your e-mail address.',
        MESSAGE_MISSING_DOMAIN: 'The domain in your e-mail address is missing a period.',
        MESSAGE_INVALID_EMAIL_ADDRESS: 'The domain in your email address is incorrectly formatted.',
        MESSAGE_INVALID_CHARACTERS: 'Your e-mail address contains invalid chracters.',
        MESSAGE_IMAGE_LOADING: 'Image Loading... Please Wait!',
        // MESSAGE_PROCEED_TO_CHECKOUT_WARNING:"You have entered a player name and did\nnot put one on your uniform\nYou have entered a player number and did \n not put one on your uniform\n\nDo you still want to proceed and checkout?",
        MESSAGE_SESSION_EXPIRE: "Your session has expired. Please reload the page.",
        HEADING_ANCHOR_POINT_OVVERIDE: "Overwrite Anchor Point",
        MESSAGE_ANCHOR_POINT_OVVERIDE: "This location is occupied.  Do you want to overwrite what is in this location?",
        MESSAGE_CORRECTION_FEE_REQUIRED: "This graphic has $ image correction fee",
        MESSAGE_IMAGE_UPLOAD: "Please wait. Image upload progressing.",
        //UPLOADED_GRAPHIC_SUPPORT_FORMATS: "Invalid file format. Only bmp, gif, png, jpeg, psd, tif, ai and pdf files are allowed"
        MESSAGE_INVALID_UPLOADED_GRAPHIC_FORMATS: "Invalid file format. The supported files format are:\n" + CONFIG.get('SUPPORTED_IMAGE_TYPES_UPLOAD_GRAPHICS'),
        // MESSAGE_UPLOAD_GRAPHIC_IMAGE_IN_PROCESS:"Please wait image upload in progress.."
        MESSAGE_PROSPHERE_PLUS_SUCCESS: "Your request  has been sent!",
        MESSAGE_PROSPHERE_PLUS_FAILURE: "Your request  has not been sent! Please try again",
        MESSAGE_INVALID_CONTACT_NUMEBR_PROPLUS: "Enter a valid phone number",
        MESSAGE_INVALID_EMAIL_PROPLUS: "Enter a valid email address",
        MESSAGE_NOT_SUPPORTED_RETRIEVAL_CODE: 'Retrieval Codes without the "RC" prefix will not work in this experience',
        MESSAGE_WAIT_MODEL_PREVIEW_LOADING: 'Please wait, model preview images are being loaded',
        MESSAGE_WAIT_LARGER_MODEL_PREVIEW_LOADING: 'Please wait, Large model preview is being loaded',
        MESSAGE_REQUIRED_FIELD_NAME: "Name is required",
        MESSAGE_REQUIRED_FIELD_MSG: "Message is required",
        MESSAGE_REQUIRED_FIELD_CONTACT: "Phone Number is required",
        MESSAGE_REQUIRED_FIELD_EMAIL: "Email Address is required",
        MESSAGE_REQUIRED_FIELD_ACCOUNT: "Account Number is required",
        MESSAGE_REQUIRED_LEGACY_URL: "Legacy Configurator Url is not provided",
        MESSAGE_USE_UPGRADED_IE_VERSION: "We recognize that you&#39re currently using Internet Explorer 8 as your web browser. With the latest improvements to the ProSphere experience we recommend that you update your browser to Internet Explorer 11 by clicking the following link <br /><a id='aUpgradeBrowser' target='_blank' href='" + CONFIG.get('INTERNET_EXPLORER_WEBSITE_LINK') + "'>" + CONFIG.get('INTERNET_EXPLORER_WEBSITE_LINK') + "</a>" +
        "<br ><br >Continuing to use Internet Explorer 8 will greatly effect your ProSphere uniform configuration experience with longer then necessary wait times. Upgrading to Internet Explorer 11 will enable you to experience ProSphere at its fullest and fastest capabilities."

    };
    return {
        get: function(key) {
            return TEXT[key];
        }
    };
}());

var FABRIC = (function() {
    var SETTTING = {
        ENLARGE_VIEW_OFFSET_LEFT: 15,
        FABRIC_BOX_WIDTH: 62,
        FABRIC_BOX_HEIGHT: 62,
        ENLARGE_VIEW_WIDTH: 200,
        ENLARGE_VIEW_HEIGHT: 200,
        CART_FABRIC_WIDTH: 40,
        CART_FABRIC_HEIGHT: 40
    };
    return {
        get: function(key) {
            return SETTTING[key];
        }
    };
}());

/**
 * Defines the titles to be shown.
 * 
 */
var TITLE = (function() {
    var TEXT = {
        TITLE_ANCHOR_PLAYER_NUMBER: 'Place Your Player Number',
        TITLE_ANCHOR_TEAM_NAME: 'Place Your Team Name',
        TITLE_ANCHOR_PLAYER_NAME: 'Place Your Player Name',
        TITLE_ANCHOR_OTHER_TEXT: 'Place Your Other Text',
        TITLE_ANCHOR_EMBLEM_GRAPHIC: 'Place Your Graphic',
        TITLE_UNIFORM_COLOR_CHOOSE: "please choose",
        TITLE_MY_LOCKER_VALIDATION: 'No Graphics',
        TITLE_UPLOAD_GRAPHIC_VALIDATION: 'No Graphics',
        TITLE_ANCHOR_GRAPHIC: 'Place Your Graphic',
        TITLE_ANCHOR_UPLOADED_GRAPHIC: 'Place Your Uploaded Graphic',
        TITLE_ERROR: 'Error',
        TITLE_ROSTER_DATA_VALIDATION: "Roster Data Validation Error",
        TITLE_EMAIL_SENT: 'Uniform Email Confirmation',
        TITLE_SAVE_ORDER: 'Uniform Save Confirmation',
        TITLE_SAVE_VALIDATION: 'User Input Required',
        TITLE_UPLOAD_IMAGE: 'Upload Image',
        TITLE_HOW_TO: 'Information',
        TITLE_VALID_RETRIEVAL_CODE: 'User Input Required',
        TITLE_ADD_CUSTOM_COLOR: 'Information',
        TITLE_LARGER_VIEW: 'Information',
        TITLE_RESPONSE_VALID_RETRIEVAL_CODE: 'Error Loading Retrieval Code',
        TITLE_REMOVE_PLAYER: 'Remove Player',
        TITLE_GRAPHIC_EMPTY: 'No Graphics',
        TITLE_GRAPHIC_VALIDATION: 'Select A Graphic Validation',
        TITLE_ANCHOR_OVERWRITE: 'Overwrite Anchor Point',
        TITLE_MAX_ROSTER: 'Player Name',
        TITLE_VALIDATE_CONTACT_NUMBER: 'Contact Number',
        TITLE_VALIDATE_MAIL_PROOF: 'Email',
        TITLE_ERROR_RESPONSE: 'Error',
        TITLE_PROCEED_TO_CHECKOUT_WARNING: "Proceed-To-Checkout Warning",
        TITLE_ROSTER_DATA_VALIDATION_ERROR: "Roster Data Validation Error",
        TITLE_UPLOAD_ROSTER_VALIDATION_ERROR: "Roster Upload Data Validation",
        TITLE_OVERRRIDE_RETRIEVAL_CODE: 'Override Retrieval Code',
        TITLE_GENERAL_WARNING: "Warning",
        TITLE_PLEASE_WAIT: "Please wait",
        TITLE_OLD_VERSION_IE:"Warning"
       // TITLE_UPLOAD_GRAPHIC_IN_PROGRESS:"Upload in Progress"
    };
    return {
        get: function(key) {
            return TEXT[key];
        }
    };
}());


/**
 * for google Analytics 
 * 
 *  // Page Type AND page detail
 * 
 */
var GOOGLE_ANALYTICS_STR = (function() {
    var TEXT = {
        // USER TYPE
        CONSUMER: "consumer",
        DEALER: "dealer",
        GATC_ON_OFF: "ON",
        // Page Type Constants
        LANDING_STR: "landing",
        DESIGN_STR: "design",
        ADV_EXP_STR: "express",
        // Page Detail Constants
        DEFINE_STR: "define",
        CUSTOMIZE_STR: "customize",
        COLOR_STR: "color",
        FABRIC_STR: "fabric",
        EMBELEMS_AND_GRAPHIC_STR: "emblemsandgraphic",
        GRAPHIC_STR: "graphic",
        EMBLEM_STR: "emblem",
        UPLOADED_GRAPHIC_STR: "ugraphic",
        MY_LOCKER_STR: "mylocker",
        NUMBER_AND_TEXT_STR: "numberandtext",
        PLAYER_NUMBER_STR: "plnum",
        PLAYER_NAME_STR: "plname",
        TEAM_NAME_STR: "tname",
        OTHER_TEXT_STR: "otext",
        ROSTER_STR: "roster",
        PROOF_STR: "proof",
        QUOTINGTOOL_STR: "quote",
        ADV_CUT_STR: "cut",
        ADV_DESIGN_STR: "design",
        ADV_DECORATING_TEMPLATE_STR: "dtemp",
        ADV_PERSONALIZE_STR: "personalize",
        ADV_ROSTER_STR: "roster",
        ADV_PROOF_STR: "proof",
        ADV_QUOTINGTOOL_STR: "quote",
        UPLOAD_ROSTER: "uploadroster",
        FLAT_CUT: "flatcut",
        "PS_PLUS_THANKS_NEW_EXP_LATER":"pspthanksbutton",
        "PS_PLUS_START_FORM":"pspgetstarted",
        "PS_PLUS_YES_SWITCH_TO_OLD_APP": "pspyes",
        "PS_PLUS_NO_NEW_PS":"psno",
        "PS_PLUS_SEND_EMAIL":"pspsendemail"
    };
    return {
        get: function(key) {
            return TEXT[key];
        }
    };
}());


/*
 * For Price list Mapping
 */
var PRICE_LIST_MAPPING = (function() {
    var TEXT = {
        // USER TYPE
        Standard: "Standard",
        Consumer: "Standard",
        Dealer: "Standard",
        DealerCC: "Standard",
        Premium_Dealer_1: "Premium 1",
        Premium_Dealer_2: "Premium 2",
        Premium_Dealer_3: "Premium 3",
        Premium_Dealer_4: "Premium 4",
        Premium_Dealer_5: "Premium 5",
        Premium_Dealer_6: "Premium 6",
        Premium_Dealer_1_CC: "Premium 1",
        Premium_Dealer_2_CC: "Premium 2",
        Premium_Dealer_3_CC: "Premium 3",
        Premium_Dealer_4_CC: "Premium 4",
        Premium_Dealer_5_CC: "Premium 5",
        Premium_Dealer_6_CC: "Premium 6"
    };
    return {
        get: function(key) {
            return TEXT[key];
        }
    };
}());

/**
 * For Price Mapping
 * 
 * */
var PRICE_MAPPING = (function() {
    var TEXT = {
        // USER TYPE
        Standard: "Msrp",
        Consumer: "Msrp",
        Dealer: "Price",
        DealerCC: "CcPrice",
        Premium_Dealer_1: "Price",
        Premium_Dealer_2: "Price",
        Premium_Dealer_3: "Price",
        Premium_Dealer_4: "Price",
        Premium_Dealer_5: "Price",
        Premium_Dealer_6: "Price",
        Premium_Dealer_1_CC: "CcPrice",
        Premium_Dealer_2_CC: "CcPrice",
        Premium_Dealer_3_CC: "CcPrice",
        Premium_Dealer_4_CC: "CcPrice",
        Premium_Dealer_5_CC: "CcPrice",
        Premium_Dealer_6_CC: "CcPrice"
    };
    return {
        get: function(key) {
            var value = TEXT[key];
            if(!value){
                value = TEXT['Consumer'];
            }
            return value;
        }
    };
}());
