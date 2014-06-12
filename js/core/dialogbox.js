/**
 * TWA proshpere configurator
 *
 * dialogbox.js contains the methods to show dialog boxes
 * 
 * @package proshpere
 * @subpackage core
 */

/**
 * Class constructor
 * 
 * @param {string} dvMessageBoxId
 * @returns void
 * 
 */function DialogBox(dvMessageBoxId)
{

    this.isModel = true;
    this.boxMaxHeight = 150;
    this.boxMaxWidth = 400;
    this.isDraggable = true;
    this.isResizableBox = false;
    this.dvMessageBoxId = dvMessageBoxId;
    this.hideCrossIcon = false;
    this.dialogTitle = '';
    this.funcCallBack = null;
    this.funcCallBackForCancel=null;
}


/**
 * Shows message on simple dialog box 
 * @param {object} args
 * Supported properties:
 * messageboxId refers the message div id
 * isModel, a boolean varaible default is true
 * boxMaxHeight used for DialogBox height attribute  
 * boxMaxWidth used for DialogBox width attribute 
 * isResizableBox is used to resize DialogBox  
 * isDraggable is used to drag DialogBox  
 * hideCrossIcon is used to hide cross icon of top most right corner    
 * dialogTitle is used Dialog show title 
 */
DialogBox.prototype.showMessage = function(args)
{
    var isModel = args.isModel ? args.isModel : this.isModel;
    var boxMaxHeight = args.boxMaxHeight ? args.boxMaxHeight : this.boxMaxHeight;
    var boxMaxWidth = args.boxMaxWidth ? args.boxMaxWidth : this.boxMaxWidth;
    var isDraggable = args.isDraggable ? args.isDraggable : this.isDraggable;
    var isResizableBox = args.isResizableBox ? args.isResizableBox : this.isResizableBox;
    var hideCrossIcon = args.hideCrossIcon ? args.hideCrossIcon : this.hideCrossIcon;
    var dialogTitle = args.dialogTitle ? args.dialogTitle : this.dialogTitle;
    var thisObject = this;
    $("#" + this.dvMessageBoxId).dialog({
        modal: isModel,
        width: boxMaxWidth,
        resizable: isResizableBox,
        title: dialogTitle,
        show: 'fade',
        hide: 'fade',
        buttons: {
            OK: function() {
                $(this).dialog("close");
                $(this).dialog("destroy");
                if (thisObject.funcCallBack != null) {
                    thisObject.funcCallBack();
                }

            }
        },
        open: function() {
            try {
                $(".ui-dialog").css({ 'position': 'absolute', 'top': '261.5px', 'left': '305px' });
                $(".ui-widget-content a").css('color', 'mediumblue');
            } catch (e) {
            }

            if (hideCrossIcon) {
                $(".ui-dialog-titlebar-close").hide();
            }
            ;
            $('.ui-widget-overlay', this).hide().fadeIn();

            $('.ui-icon-closethick').bind('click.close', function() {
                $('.ui-widget-overlay').fadeOut(function() {
                    $('.ui-icon-closethick').unbind('click.close');
                    $('.ui-icon-closethick').trigger('click');
                });
                return false;
            });
            setTimeout(function() {
                $('.ui-dialog-buttonset').children().first().addClass('okDialogBoxButton').text('').css(
                        {
                            height: '24px',
                            width: '70px'
                        });
            }, 10);

        }
    });
};
/**
 * Show notification without buttons 
 * @param {object} args
 * Supported properties:
 * messageboxId refers the message div id
 * isModel, a boolean varaible default is true
 * boxMaxHeight used for DialogBox height attribute  
 * boxMaxWidth used for DialogBox width attribute 
 * isResizableBox is used to resize DialogBox  
 * isDraggable is used to drag DialogBox  
 * hideCrossIcon is used to hide cross icon of top most right corner    
 * dialogTitle is used Dialog show title 
 */
DialogBox.prototype.showNotification = function(args)
{
    var isModel = args.isModel ? args.isModel : this.isModel;
    var boxMaxHeight = args.boxMaxHeight ? args.boxMaxHeight : this.boxMaxHeight;
    var boxMaxWidth = args.boxMaxWidth ? args.boxMaxWidth : this.boxMaxWidth;
    var isDraggable = args.isDraggable ? args.isDraggable : this.isDraggable;
    var isResizableBox = args.isResizableBox ? args.isResizableBox : this.isResizableBox;
    var hideCrossIcon = args.hideCrossIcon ? args.hideCrossIcon : this.hideCrossIcon;
    var dialogTitle = args.dialogTitle ? args.dialogTitle : this.dialogTitle;
    var thisObject = this;
    $("#" + this.dvMessageBoxId).dialog({
        modal: isModel,
        width: boxMaxWidth,
        resizable: isResizableBox,
        title: dialogTitle,
        show: 'fade',
        hide: 'fade',
        closeOnEscape: false,
        buttons: {
            OK: function() {
                $(this).dialog("close");
                $(this).dialog("destroy");
                if (thisObject.funcCallBack != null) {
                    thisObject.funcCallBack();
                }

            }
        },
        open: function() {
            try {
                $(".ui-dialog").css('position', 'absolute');
                $(".ui-dialog").css('top', '187px');
                $(".ui-dialog").css('left', '305px');
            } catch (e) {
            }

            if (hideCrossIcon) {
                $(".ui-dialog-titlebar-close").hide();
            }
            ;
            $('.ui-widget-overlay', this).hide().fadeIn();

            $('.ui-icon-closethick').bind('click.close', function() {
                $('.ui-widget-overlay').fadeOut(function() {
                    $('.ui-icon-closethick').unbind('click.close');
                    $('.ui-icon-closethick').trigger('click');
                });
                return false;
            });
            setTimeout(function() {
                $('.ui-dialog-buttonset').children().first().remove();
            }, 10);

        }
    });
};
/**
 * Show message on simple dialog box 
 * @param messageboxId refers the message div id
 * @param isModel, a boolean varaible default is true
 * @param boxMaxHeight used for DialogBox height attribute  
 * @param boxMaxWidth used for DialogBox width attribute 
 * @parma isResizableBox is used to resize DialogBox  
 * @parma isDraggable is used to drag DialogBox  
 * @parma hideCrossIcon is used to hide cross icon of top most right corner    
 * @parma dialogTitle is used Dialog show title 
 */
DialogBox.prototype.getWarningConfirmationBox = function(args) {
    var thisObject = this;
    var isModel = args.isModel ? args.isModel : this.isModel;
    //var boxMaxHeight = args.boxMaxHeight ? args.boxMaxHeight : this.boxMaxHeight;
    var boxMaxWidth = args.boxMaxWidth ? args.boxMaxWidth : this.boxMaxWidth;
    //var isDraggable = args.isDraggable ? args.isDraggable : this.isDraggable;
    var isResizableBox = args.isResizableBox ? args.isResizableBox : this.isResizableBox;
    var hideCrossIcon = args.hideCrossIcon ? args.hideCrossIcon : this.hideCrossIcon;
    var dialogTitle = args.dialogTitle ? args.dialogTitle : this.dialogTitle;
    $("#" + this.dvMessageBoxId).dialog({
        modal: isModel,
        width: boxMaxWidth,
        resizable: isResizableBox,
        title: dialogTitle,
        show: 'fade',
        hide: 'fade',
        buttons: {
            Yes: function() {
                $(this).dialog("close");
                $(this).dialog("destroy");
                if (thisObject.funcCallBack != null) {
                    thisObject.funcCallBack();
                }
            },
            No: function() {
                $(this).dialog("close");
                $(this).dialog("destroy");
                if (thisObject.funcCallBackForCancel != null) {
                    thisObject.funcCallBackForCancel();
                }
            }
        },
        open: function() {
            try {
                $(".ui-dialog").css('position', 'absolute');
                $(".ui-dialog").css('top', '187px');
                $(".ui-dialog").css('left', '305px');
            } catch (e) {
            }

            if (hideCrossIcon) {
                $(".ui-dialog-titlebar-close").hide();
            }
            ;
            $('.ui-widget-overlay', this).hide().fadeIn();

            $('.ui-icon-closethick').bind('click.close', function() {
                $('.ui-widget-overlay').fadeOut(function() {
                    $('.ui-icon-closethick').unbind('click.close');
                    $('.ui-icon-closethick').trigger('click');
                });
                return false;
            });
            
            $('.ui-dialog-buttonset').children().first().addClass('yesBtnDialogBoxButton').text('').css({
                height: '24px',
                width: '70px'
            });
            
            $('.ui-dialog-buttonset button:nth-child(2)').addClass('noBtnDialogBoxButton').text('').css({
                height: '24px',
                width: '70px'
            });
            
        }

    });
};
/////////////////////////////
DialogBox.prototype.getWarningConfirmationBoxForRetvCode = function (args) {
    var thisObject = this;
    var isModel = args.isModel ? args.isModel : this.isModel;
    //var boxMaxHeight = args.boxMaxHeight ? args.boxMaxHeight : this.boxMaxHeight;
    var boxMaxWidth = args.boxMaxWidth ? args.boxMaxWidth : this.boxMaxWidth;
    //var isDraggable = args.isDraggable ? args.isDraggable : this.isDraggable;
    var isResizableBox = args.isResizableBox ? args.isResizableBox : this.isResizableBox;
    var hideCrossIcon = args.hideCrossIcon ? args.hideCrossIcon : this.hideCrossIcon;
    var dialogTitle = args.dialogTitle ? args.dialogTitle : this.dialogTitle;
    $("#" + this.dvMessageBoxId).dialog({
        modal: isModel,
        width: boxMaxWidth,
        resizable: isResizableBox,
        title: dialogTitle,
        show: 'fade',
        hide: 'fade',
        buttons: {
            Yes: function () {
                $(this).dialog("close");
                $(this).dialog("destroy");
                if (thisObject.funcCallBack != null) {
                    thisObject.funcCallBack();
                }
            },
            No: function () {
                $(this).dialog("close");
                $(this).dialog("destroy");
                if (thisObject.funcCallBackForCancel != null) {
                    thisObject.funcCallBackForCancel();
                }
            }
        },
        open: function () {
            try {
                $(".ui-dialog").css('position', 'absolute');
                $(".ui-dialog").css('top', '187px');
                $(".ui-dialog").css('left', '305px');
            } catch (e) {
            }

            if (hideCrossIcon) {
                $(".ui-dialog-titlebar-close").hide();
            }
            ;
            $('.ui-widget-overlay', this).hide().fadeIn();

            $('.ui-icon-closethick').bind('click.close', function () {
                $('.ui-widget-overlay').fadeOut(function () {
                    $('.ui-icon-closethick').unbind('click.close');
                    $('.ui-icon-closethick').trigger('click');
                });
                return false;
            });

            $('.ui-dialog-buttonset').children().first().addClass('OverwriteNormal').text('').css({
                height: '24px',
                width: '90px'
            }); 

            $('.ui-dialog-buttonset button:nth-child(2)').addClass('createNormal').text('').css({
                height: '24px',
                width: '90px'
            });

        }

    });
};
/////////////////////////////

DialogBox.prototype.getConfirmationBox = function(args) {
    var thisObject = this;
    var isModel = args.isModel ? args.isModel : this.isModel;
    //var boxMaxHeight = args.boxMaxHeight ? args.boxMaxHeight : this.boxMaxHeight;
    var boxMaxWidth = args.boxMaxWidth ? args.boxMaxWidth : this.boxMaxWidth;
    //var isDraggable = args.isDraggable ? args.isDraggable : this.isDraggable;
    var isResizableBox = args.isResizableBox ? args.isResizableBox : this.isResizableBox;
    var hideCrossIcon = args.hideCrossIcon ? args.hideCrossIcon : this.hideCrossIcon;
    var dialogTitle = args.dialogTitle ? args.dialogTitle : this.dialogTitle;
    $("#" + this.dvMessageBoxId).dialog({
        modal: isModel,
        width: boxMaxWidth,
        resizable: isResizableBox,
        title: dialogTitle,
        show: 'fade',
        hide: 'fade',
        buttons: {
            OK: function() {
                $(this).dialog("close");
                $(this).dialog("destroy");
                if (thisObject.funcCallBack != null) {
                    thisObject.funcCallBack();
                }
            },
            Cancel: function() {
                $(this).dialog("close");
                $(this).dialog("destroy");
            }
        },
        open: function() {
            try {
                $(".ui-dialog").css('position', 'absolute');
                $(".ui-dialog").css('top', '187px');
                $(".ui-dialog").css('left', '305px');
            } catch (e) {
            }

            if (hideCrossIcon) {
                $(".ui-dialog-titlebar-close").hide();
            }
            ;
            $('.ui-widget-overlay', this).hide().fadeIn();

            $('.ui-icon-closethick').bind('click.close', function() {
                $('.ui-widget-overlay').fadeOut(function() {
                    $('.ui-icon-closethick').unbind('click.close');
                    $('.ui-icon-closethick').trigger('click');
                });
                return false;
            });
            $('.ui-dialog-buttonset').children().first().addClass('okDialogBoxButton').text('').css({
                height: '24px',
                width: '70px'
            });
            $('.ui-dialog-buttonset button:nth-child(2)').addClass('cancelDialogBoxButton').text('').css({
                height: '24px',
                width: '70px'
            });
        }

    });
};



DialogBox.prototype.getErrorConfirmationBox = function(args) {
    var thisObject = this;
    var isModel = args.isModel ? args.isModel : this.isModel;
    //var boxMaxHeight = args.boxMaxHeight ? args.boxMaxHeight : this.boxMaxHeight;
    var boxMaxWidth = args.boxMaxWidth ? args.boxMaxWidth : this.boxMaxWidth;
    //var isDraggable = args.isDraggable ? args.isDraggable : this.isDraggable;
    var isResizableBox = args.isResizableBox ? args.isResizableBox : this.isResizableBox;
    var hideCrossIcon = args.hideCrossIcon ? args.hideCrossIcon : this.hideCrossIcon;
    var dialogTitle = args.dialogTitle ? args.dialogTitle : this.dialogTitle;
    $("#" + this.dvMessageBoxId).dialog({
        modal: isModel,
        width: boxMaxWidth,
        resizable: isResizableBox,
        title: dialogTitle,
        show: 'fade',
        hide: 'fade',
        buttons: {
            Yes: function() {
                $(this).dialog("close");
                $(this).dialog("destroy");
                
            },
            No: function() {
                $(this).dialog("close");
                $(this).dialog("destroy");
                if (thisObject.funcCallBack != null) {
                    thisObject.funcCallBack();
                }
            }
        },
        open: function() {
            try {
                $(".ui-dialog").css('position', 'absolute');
                $(".ui-dialog").css('top', '187px');
                $(".ui-dialog").css('left', '305px');
            } catch (e) {
            }

            if (hideCrossIcon) {
                $(".ui-dialog-titlebar-close").hide();
            }
            ;
            $('.ui-widget-overlay', this).hide().fadeIn();

            $('.ui-icon-closethick').bind('click.close', function() {
                $('.ui-widget-overlay').fadeOut(function() {
                    $('.ui-icon-closethick').unbind('click.close');
                    $('.ui-icon-closethick').trigger('click');
                });
                return false;
            });
            $('.ui-dialog-buttonset').children().first().addClass('yesBtnDialogBoxButton').text('').css({
                height: '24px',
                width: '70px'
            });
            $('.ui-dialog-buttonset button:nth-child(2)').addClass('noBtnDialogBoxButton').text('').css({
                height: '24px',
                width: '70px'
            });
        }

    });
};


/**
 * Show custom model form dialog box
 * @param args
 * Supported properties:
 * messageboxId refers the message div id
 * isModel, a boolean varaible default is true
 * boxMaxHeight used for DialogBox height attribute  
 * boxMaxWidth used for DialogBox width attribute 
 * isResizableBox is used to resize DialogBox  
 * isDraggable is used to drag DialogBox  
 * hideCrossIcon is used to hide cross icon of top most right corner    
 * dialogTitle is used Dialog show title 
 */
DialogBox.prototype.showModelFormDialogBox = function(args)
{
    var isModel = args.isModel ? args.isModel : this.isModel;
    var boxMaxHeight = args.boxMaxHeight ? args.boxMaxHeight : this.boxMaxHeight;
    var boxMaxWidth = args.boxMaxWidth ? args.boxMaxWidth : this.boxMaxWidth;
    var isDraggable = args.isDraggable ? args.isDraggable : this.isDraggable;
    var isResizableBox = args.isResizableBox ? args.isResizableBox : this.isResizableBox;
    var hideCrossIcon = args.hideCrossIcon ? args.hideCrossIcon : this.hideCrossIcon;
    var dialogTitle = args.dialogTitle ? args.dialogTitle : this.dialogTitle;
    var thisObject = this;

    $("#" + this.dvMessageBoxId).dialog({
        modal: isModel,
        height: 150,
        width: 300,
        resizable: isResizableBox,
        title: dialogTitle,
        show: 'fade',
        hide: 'fade',
        buttons: {
            OK: function() {
                //$( this ).dialog("close");
                var params = $(this);
                if (thisObject.funcCallBack != null) {
                    thisObject.funcCallBack(params);
                }

            }
        },
        open: function() {
            try {
                $(".ui-dialog").css('position', 'absolute');
                $(".ui-dialog").css('top', '187px');
                $(".ui-dialog").css('left', '305px');
            } catch (e) {
            }

            if (hideCrossIcon) {
                $(".ui-dialog-titlebar-close").hide();
            }
            ;
            $('.ui-widget-overlay', this).hide().fadeIn();

            $('.ui-icon-closethick').bind('click.close', function() {
                $('.ui-widget-overlay').fadeOut(function() {
                    $('.ui-icon-closethick').unbind('click.close');
                    $('.ui-icon-closethick').trigger('click');
                });
                return false;
            });
            $('.ui-dialog-buttonset').children().first().addClass('okDialogBoxButton').text('').css({
                height: '24px',
                width: '70px'
            });
        }
    });
};

/**
 * Common message Dialog box 
 * 
 * @param dialogTitle to display on dialog title.
 * @param message to display message on dialog box.
 * 
 * @return void
 */
DialogBox.prototype.displayShowMessageDialogBox = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvDialogBox';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").html(message);
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('alertIcon').removeClass('errorIcon').addClass('largeViewIcon');
    this.showMessage(args);
    return;
};


/**
 * Common Confirmation Dialog box 
 * 
 * @param dialogTitle to display on dialog title.
 * @param message to display message on dialog box.
 * 
 * @return void
 */
DialogBox.prototype.displayConfirmationDialogBox = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvDialogBox';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").html(message);
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('alertIcon').removeClass('errorIcon').addClass('informationIcon');
    this.getWarningConfirmationBox(args);
    return;
};
 /* Common Confirmation Dialog box 
 * 
 * @param dialogTitle to display on dialog title.
 * @param message to display message on dialog box.
 * 
 * @return void
 */
DialogBox.prototype.displayOverrideRetrievalDialogBox = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvIdOverrideRetrievalCode';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").html(message);
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('informationIcon').removeClass('errorIcon').addClass('alertIcon');
    this.getWarningConfirmationBoxForRetvCode(args);
    //this.getWarningConfirmationBox(args);
    return;
};


/**
*Confirmation Dialog box to overwritte anchor Points
*
* @param dialogTitle to display on dialog title.
* @param message to display message on dialog box.
*/
DialogBox.prototype.displayOverrideAnchorPointDialogBox = function (dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvIdOverrideRetrievalCode';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").html(message);
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('informationIcon').removeClass('errorIcon').addClass('alertIcon');
   // this.getWarningConfirmationBoxForRetvCode(args);
    this.getWarningConfirmationBox(args);
    return;
};




/**
 * Common Confirmation Dialog box 
 * 
 * @param dialogTitle to display on dialog title.
 * @param message to display message on dialog box.
 * 
 * @return void
 */
DialogBox.prototype.displayModelLargerViewDialogBox = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvDialogBox';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").html(message);
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('alertIcon').removeClass('errorIcon').addClass('largeViewIcon');
    this.getConfirmationBox(args);
    return;
};

/**
 * Common Warning message Dialog box 
 * 
 * @param dialogTitle to display on dialog title.
 * @param message to display message on dialog box.
 * 
 * @return void
 */
DialogBox.prototype.displayWarningMessageDialogBox = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvDialogBox';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").html(message);
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('informationIcon').removeClass('errorIcon').addClass('alertIcon');
    this.showMessage(args);
    return;
};

DialogBox.prototype.displayWarningMessageDialogBoxHTML = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvDialogBox';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").html(message);
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('informationIcon').removeClass('errorIcon').addClass('alertIcon');
    this.showMessage(args);
    return;
};

DialogBox.prototype.displayWarningMessageDialogBoxForVaccantRTVCode = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvDialogBox';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").text(message);
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('informationIcon').removeClass('alertIcon').addClass('alertIcon');
    this.showMessage(args);
    return;
};
/**
 * Common Error message Dialog box 
 * 
 * @param dialogTitle to display on dialog title.
 * @param message to display message on dialog box.
 * 
 * @return void
 */
DialogBox.prototype.displayErrorMessageDialogBox = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvDialogBox';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").text(message);
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('informationIcon').removeClass('alertIcon').addClass('errorIcon');
    this.showMessage(args);
    return;
};

/**
 * Display Go to roster Error message Dialog box 
 * 
 * @param dialogTitle to display on dialog title.
 * @param message to display message on dialog box.
 * 
 * @return void
 */
DialogBox.prototype.displayGoToRosterErrorMessageDialogBox = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvGoToRosterDialogBox';
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('informationIcon').removeClass('errorIcon').addClass('alertIcon');
    this.showMessage(args);
    return;
};

/**
 * Display roster Order name and Team name Dialog box 
 * 
 * @param dialogTitle to display on dialog title.
 * @param message to display message on dialog box.
 * 
 * @return void
 */
DialogBox.prototype.displayRosterModelDialogBox = function(divId, dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '300';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = divId;
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('informationIcon').removeClass('errorIcon').addClass('alertIcon');
    this.showModelFormDialogBox(args);
    return;
};

/**
 * Common Error message Dialog box 
 * 
 * @param dialogTitle to display on dialog title.
 * @param message to display message on dialog box.
 * 
 * @return void
 */
DialogBox.prototype.displayErrorNotificationDialogBox = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvDialogBox';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").text(message);
    $('#' + this.dvMessageBoxId + " #notify").removeClass('informationIcon').removeClass('alertIcon').addClass('errorIcon');
    this.showNotification(args);
    return;
};

/**
 * Common Confirmation Dialog box 
 * 
 * @param dialogTitle to display on dialog title.
 * @param message to display message on dialog box.
 * 
 * @return void
 */
DialogBox.prototype.displayProceedToCheckoutConfirmationDialogBox = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvProceedToCheckoutDialogBox';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").html(message);
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('informationIcon').removeClass('errorIcon').addClass('alertIcon');
    this.getWarningConfirmationBox(args);
    return;
};

DialogBox.prototype.displayProceedToCheckoutErrorConfirmationDialogBox = function(dialogTitle, message) {
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvProceedToCheckoutErrorDialogBox';
    $('#' + this.dvMessageBoxId + " #dvAlertPopupMessage").html(message)
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('errorIcon').removeClass('informationIcon').addClass('alertIcon');
    this.getErrorConfirmationBox(args);
    return;
};

DialogBox.prototype.displayGraphicColorValidationDialogBox = function (dialogTitle){
    var args = {};
    args.isModel = true;
    args.boxMaxHeight = '80';
    args.boxMaxWidth = '350';
    args.isResizableBox = 'false';
    args.hideCrossIcon = 'true';
    args.dialogTitle = dialogTitle || "Information";
    this.dvMessageBoxId = 'dvIdGraphicColorValidation';
    $('#' + this.dvMessageBoxId + " #idNotify").removeClass('informationIcon').removeClass('alertIcon').addClass('alertIcon');
    this.showMessage(args);
    return;
}