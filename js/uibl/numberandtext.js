/**
 * TWA proshpere configurator
 * 
 * 
 * @package proshpere
 * @subpackage uibl
 */

/* 
 * numberandtext.js handles the functionalities related to the change in number
 * and text.
 */

/*
 * Handle back button click event.
 */
$(document).on('click', '#dvIdBackOtherText ,#btnBackPlayerName, #btnBackPlayerNumber, #dvIdBackTeamName', function() {
    GlobalInstance.getNumberAndTextInstance().show();
});

/*
 * Constructor for number and text.
 */
function NumberAndText() {
}
/*
 * It shows the Home page and hide others.
 */
NumberAndText.prototype.show = function() {
    $("#secTeamName").hide();
    $("#secOtherText").hide();
    $("#secPlayerNumber").hide();
    $("#secPlayerName").hide();
    $("#secNumberAndTextPanel").show();
    $("#secNumberAndTextHome").show();
};

/*
 * Hides the Landing page.
 */
NumberAndText.prototype.hide = function() {
    $("#secNumberAndTextPanel").hide();

};

/*
 *Handles the click event on Player Number option. 
 *
 */
$(document).on('click', '#dvIdPlayerNumberOption', function() {
    GlobalInstance.getPlayerNumberInstance().show();
});

/*
 *Handles the click event on Player Name option. 
 *
 */
$(document).on('click', '#dvIdPlayerNameOption', function() {
    GlobalInstance.getPlayerNameInstance().show();
});

/*
 *Handles the click event on Team Name option. 
 *
 */
$(document).on('click', '#dvIdTeamNameOption', function() {
    GlobalInstance.getTeamNameInstance().show();
});

/*
 *Handles the click event on Other Text option. 
 *
 */
$(document).on('click', '#dvIdOtherTextOption', function() {
    GlobalInstance.getOtherTextInstance().show();
});
