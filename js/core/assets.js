/**
 * TWA proshpere configurator
 * 
 * @package proshpere
 * @subpackage core
 */


/**
 * Defines background images for sports catagories
 * 
 */
var SPORTS_BACKGROUND_IMAGE = (function () {
    var IMAGES = {
        "BASEBALL": "proSphere_emo_baseball.png",
        "BASKETBALL": "proSphere_emo_basketball.png",
        "FANWEAR": "proSphere_emo_fanwear.png",
        "FOOTBALL": "proSphere_emo_football.png",
        "HOCKEY": "proSphere_emo_hockey.png",
        "LACROSSE": "proSphere_emo_lacrosse.png",
        "SIDELINE": "proSphere_emo_sideline.png",
        "SOCCER": "proSphere_emo_soccer.png",
        "SOFTBALL": "proSphere_emo_softball.png",
        "TRACK": "proSphere_emo_track.png",
        "VOLLEYBALL": "proSphere_emo_volleyball.png",
        "WRESTLING": "proSphere_emo_wrestling.png"
    };
    return {
        get: function (key) {
            return IMAGES[key.toUpperCase()];
        }
    };
}());

/**
 * Defines background color for sports catagories
 * 
 */
var SPORTS_BACKGROUND_COLOR = (function () {
    var COLORS = {
        "BASEBALL": "#68191B",
        "BASKETBALL": "#005952",
        "FANWEAR": "#AGA7AA",
        "FOOTBALL": "#3D6C47",
        "HOCKEY": "#072153",
        "LACROSSE": "#184869",
        "SIDELINE": "#9C8F63",
        "SOCCER": "#400048",
        "SOFTBALL": "#A13520",
        "TRACK": "#2E7598",
        "VOLLEYBALL": "#A9752A",
        "WRESTLING": "#E1B62E"
    };
    return {
        get: function (key) {
            return COLORS[key.toUpperCase()];
        }
    };
}());

/**
 * Defines background images for sports catagories
 * 
 */
var NOTIFICATION_BACKGROUND_IMAGE = (function () {
    var IMAGES = {
        "FSS": "frontQB2.png",
        "WSS": "frontQB.png"
    };
    return {
        get: function (key) {
            return IMAGES[key.toUpperCase()];
        }
    };
}());