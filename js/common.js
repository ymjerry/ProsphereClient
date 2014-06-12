
/**
 * Config.js is used to configure commonly used parameters in the application
 * and debug mode
 */
jQuery(document).ready(function () {



    jQuery('.leftBoxTab').click(function () {
        jQuery('.leftBoxTab').each(function () {
            jQuery(this).removeClass('active');
        });
        jQuery(this).addClass('active');
    });

    jQuery('.leftBoxTab').click(function () {
        jQuery('.leftBoxTab').each(function () {
            jQuery(this).removeClass('active');
        });
        jQuery(this).addClass('active');
    });

    jQuery('#feedbackCloseButton').click(function () {
        jQuery("#dvFeedBackBox").hide();
    });

    jQuery('#feedbackLink').click(function () {
        jQuery("#dvFeedBackBox").show();
        return false;
    });

    jQuery('#dvDealerLoginCloseButton').click(function () {
        jQuery("#secloginArea").hide();
    });

    jQuery('#dealerLoginLink').click(function () {
        jQuery("#secloginArea").slideDown();
    });
});