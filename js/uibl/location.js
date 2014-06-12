/**
 * TWA proshpere configurator
 * 
 * location.js used for emblem and graphics screen
 * 
 * TWA proshpere configurator
 * @subpackage model
 */
var LOCATION = {
    CONSTANTS: {
        GRAPHIC_TYPE: "graphic",
        UPLOADED_GRAPHIC_TYPE: "uploadedgraphic",
        EMBLEM_TYPE: "emblem",
        PLAYER_NUMBER_TYPE: "playernumber",
        PLAYER_NAME_TYPE: "playername",
        TEAM_NAME_TYPE: "teamname",
        OTHER_TEXT_TYPE: "othertext"
    }
};
/**
 * Constructor for Locations
 * @returns {Locations}
 */

function Locations() {
    this.displayName = "";
    this.locationType = "";
    this.graphicId = "";
    this.graphicName = "";
    this.size = "";
    this.includeOutline = false;
    this.objColors = new Object();
    this.objPrimaryColors = new Object();
    this.objSecondaryColors = new Object();
    this.objTertiaryColors = new Object();
    this.textLines = new Object();
    // new ones
    this.emblemId = "";
    this.graphicProductionUrl = "";
    this.graphicPreviewUrl = "";
    this.emblemProductionUrl = "";
    this.emblemZoomPreviewUrl = "";
    this.emblemPreviewUrl = "";
    this.textProductionUrl = "";
    this.textPreviewUrl = "";
    this.emblemGraphicColor = new Object();
    this.emblemGraphicOutlineColor = new Object();
    this.emblemGraphicOutline2Color = new Object();
    this.emblemNoGraphic = new Boolean();
}
/**
 * This method is responsible to fetch graphic Display name
 * @returns {displayName}
 */
Locations.prototype.getGraphicDisplayName = function() {
    return this.displayName;
};
/**
 * This method is responsible to set the graphic's Display name
 * @param graphicDisplayName Name of the graphic to display on specific location
 * @returns {void}
 */
Locations.prototype.setGraphicsDisplayName = function(graphicDisplayName) {
    this.displayName = graphicDisplayName;
};
/**
 * This method is responsible to fetch the location type
 * @returns {locationType}
 */
Locations.prototype.getLocationType = function() {
    return this.locationType;
};
/**
 * This method is responsible to set the graphics Name according to the location type
 * @param  locationType
 * @returns {void}
 */
Locations.prototype.setGraphicsDisplayName = function(locationType) {
    this.locationType = locationType;
};
/**
 * This method is responsible to get the graphics id
 * @returns {graphicId}
 */
Locations.prototype.getGraphicId = function() {
    return this.graphicId;
};
/**
 * This method is responsible to set the graphics id
 * @param {type} graphicID
 * @returns {void}
 */
Locations.prototype.setGraphicId = function(graphicID) {
    this.graphicId = graphicID;
};
/**
 * This method is responsible for reteriving the Graphics name
 * @returns {graphicName}
 */
Locations.prototype.getGraphicName = function() {
    return this.graphicName;
};
/**
 * This method is responsible for setting the Graphics name
 * @param {type} graphicSize
 * @returns {void}
 */
Locations.prototype.setGraphicName = function(graphicName) {
    this.graphicName = graphicName;
};
/**
 * This method is responsible for reteriving the graphic's size
 * @returns {size}
 */
Locations.prototype.getGraphicSize = function() {
    return this.size;
};
/**
 * This method is responsible for setting the graphics name
 * @param {type} graphicSize
 * @returns {void}
 */
Locations.prototype.setGraphicName = function(graphicSize) {
    this.size = graphicSize;
};
/**
 * This method is responsible for reteriving include outline value
 * @returns {includeOutline}
 */
Locations.prototype.getIncludeOutlineValue = function() {
    return this.includeOutline;
};
/**
 * This method sets the include outline value
 * @param {type} includeOutline
 * @returns {void}
 */
Locations.prototype.setIncludeOutlineValue = function(includeOutline) {
    this.includeOutline = includeOutline;
};
/**
 * This method is responsible for reteriving the value for primary color
 * @returns {objPrimaryColors}
 */
Locations.prototype.getPrimaryColor = function() {
    return this.objPrimaryColors;
};
/**
 * This method sets the primary color value;
 * @param {type} primaryColor
 * @returns {void}
 */
Locations.prototype.setPrimaryColor = function(primaryColor) {
    this.objPrimaryColors = primaryColor;
};
/**
 * This method is responsible for reteriving the value for secondary color
 * @returns {objSecondaryColors}
 */
Locations.prototype.getSecondaryColor = function() {
    return this.objSecondaryColors;
};
/**
 * This method sets the secondary color value
 * @param {type} secondaryColor
 * @returns {void}
 */
Locations.prototype.setSecondaryColor = function(secondaryColor) {
    this.objSecondaryColors = secondaryColor;
};
/**
 * This method is respondible for reteriving tertiary color
 * @returns {objTertiaryColors}
 */
Locations.prototype.getTertiaryColor = function() {
    return this.objTertiaryColors;
};
/**
 * This method sets the tertiary color
 * @param {type} tertiaryColor
 * @returns {undefined}
 */
Locations.prototype.setTertiaryColor = function(tertiaryColor) {
    this.objTertiaryColors = tertiaryColor;
};
/**
 * This methods returns the colors 
 * @returns {objColors}
 */
Locations.prototype.getColors = function() {
    return this.objColors;
};
/**
 * This method sets the colors
 * @param  colors
 * @returns {void}
 */
Locations.prototype.setColors = function(colors) {
    this.objColors = colors;
};
/**
 * This method is responsible for reteriving textlines
 * @returns {textLines}
 */
Locations.prototype.getTextLines = function() {
    return this.textLines;
};
/**
 * This method is responsible to set the textLines
 * @param  textLines
 * @returns {void}
 */
Locations.prototype.setTextLines = function(textLines) {
    this.textLines = textLines;
};
/**
 * This method is responsible for reteriving Emblem Id
 * @returns {emblemId}
 */
Locations.prototype.getEmblemId = function() {
    return this.emblemId;
};
/**
 * This method sets the EmblemId
 * @param  emblemId
 * @returns {void}
 */
Locations.prototype.setEmblemId = function(emblemId) {
    this.emblemId = emblemId;
};
/**
 * This method is responsible for reteriving the graphics production URL
 * @returns {graphicProductionUrl}
 */
Locations.prototype.getGraphicProductionUrl = function() {
    return this.graphicProductionUrl;
};
/**
 * This method is responsible to set the graphics production URL
 * @param  graphicProductionURL
 * @returns {void}
 */
Locations.prototype.setGraphicProductionURL = function(graphicProductionURL) {
    this.graphicProductionUrl = graphicProductionURL;
};
/**
 * This method is responsible for reteriving Graphics Preview URL
 * @returns {graphicPreviewUrl}
 */
Locations.prototype.getGraphicPreviewUrl = function() {
    return this.graphicPreviewUrl;
};
/**
 * This method sets the graphic Preview URL
 * @param graphicPreviewUrl
 * @returns {void}
 */
Locations.prototype.setgraphicPreviewUrl = function(graphicPreviewUrl) {
    this.graphicPreviewUrl = graphicPreviewUrl;
};
/**
 * This method is responsible for reteriving Email Production URL
 * @returns {emblemProductionUrl}
 */
Locations.prototype.getEmblemProductionUrl = function() {
    return this.emblemProductionUrl;
};
/**
 * This method is responsible to set the Emblem Production URL
 * @param emblemProductionUrl
 * @returns {void}
 */
Locations.prototype.setEmblemProductionUrl = function(emblemProductionUrl) {
    this.emblemProductionUrl = emblemProductionUrl;
};
/**
 * This method is responsible for reteriving Emblem Zoom Preview URL
 * @returns {emblemZoomPreviewUrl}
 */
Locations.prototype.getEmblemZoomPreviewUrl = function() {
    return this.emblemZoomPreviewUrl;
};
/**
 * This method is responsible to set the Emblem Zoom Preview URL
 * @param  emblemZoomPreviewUrl
 * @returns {void}
 */
Locations.prototype.setEmblemZoomPreviewUrl = function(emblemZoomPreviewUrl) {
    this.emblemZoomPreviewUrl = emblemZoomPreviewUrl;
};
/**
 * This method is responsible for reteriving Emblem Preview URL
 * @returns {emblemPreviewUrl}
 */
Locations.prototype.getEmblemPreviewUrl = function() {
    return this.emblemPreviewUrl;
};
/**
 * This method sets the Emblem Preview URL
 * @param  emblemPreviewUrl
 * @returns {void}
 */
Locations.prototype.setemblemPreviewUrl = function(emblemPreviewUrl) {
    this.emblemPreviewUrl = emblemPreviewUrl;
};
/**
 * This method is responsible for reteriving Text Production URL
 * @returns {textProductionUrl}
 */
Locations.prototype.getTextProductionUrl = function() {
    return this.textProductionUrl;
};
/**
 * This method is responsible to set the Text Production URL
 * @param  textProductionUrl
 * @returns {void}
 */
Locations.prototype.setTextProductionUrl = function(textProductionUrl) {
    this.textProductionUrl = textProductionUrl;
};
/**
 *This method is responsible to reteriving the Text Preview URL 
 * @returns {textPreviewUrl}
 */
Locations.prototype.getTextPreviewUrl = function() {
    return this.textPreviewUrl;
};
/**
 * This method is responsible to set the Text Preview URL
 * @param  textPreviewUrl
 * @returns {void}
 */
Locations.prototype.setTextPreviewUrl = function(textPreviewUrl) {
    this.textPreviewUrl = textPreviewUrl;
};
/**
 * This method is responsible for reteriving Emblem Graphic Color
 * @returns {emblemGraphicColor}
 */
Locations.prototype.getEmblemGraphicColor = function() {
    return this.emblemGraphicColor;
};
/**
 * This method is responsible to set the Emblem Graphic Color
 * @param  emblemGraphicColor
 * @returns {void}
 */
Locations.prototype.setEmblemGraphicColor = function(emblemGraphicColor) {
    this.emblemGraphicColor = emblemGraphicColor;
};
/**
 * This method is responsible for reteriving the Emblem Graphics Outline Color
 * @returns {emblemGraphicOutlineColor}
 */
Locations.prototype.getEmblemGraphicOutlineColor = function() {
    return this.emblemGraphicOutlineColor;
};
/**
 * This method is responsible to set the Emblem Graphics Outline Color
 * @param {type} emblemGraphicOutlineColor
 * @returns {void}
 */
Locations.prototype.setEmblemGraphicOutlineColor = function(emblemGraphicOutlineColor) {
    this.emblemGraphicOutlineColor = emblemGraphicOutlineColor;
};
/**
 * This methos is responsible for reteriving Emblem Graphics Outline 2nd color
 * @returns {emblemGraphicOutline2Color}
 */
Locations.prototype.getEmblemGraphicOutline2Color = function() {
    return this.emblemGraphicOutline2Color;
};
/**
 * This method is responsible to set the Emblems Graphics Outline 2nd color
 * @param {type} emblemGraphicOutline2Color
 * @returns {void}
 */
Locations.prototype.setEmblemGraphicOutline2Color = function(emblemGraphicOutline2Color) {
    this.emblemGraphicOutline2Color = emblemGraphicOutline2Color;
};

Locations.prototype.getEmblemNoGraphic = function() {
    return this.emblemNoGraphic;
};
Locations.prototype.setEmblemNoGraphic = function(emblemNoGraphic) {
    this.emblemNoGraphic = emblemNoGraphic;
};