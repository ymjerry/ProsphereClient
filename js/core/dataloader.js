/**
 * TWA proshpere configurator
 * 
 * dataloader.js fetches the html data from content xml. 
 * 
 * @package proshpere
 * @subpackage core
 */


var __loadedcontentcache = {};
var ___loaded_static_files = {};

/**
 * Sets the content to the container
 * @param {object} options
 * @returns {unresolved}
 */
$.fn.setContent = function(options) {
    return $(this).loadContent($.extend({action: "set"}, options));
};

/**
 * Appends the content to the container
 * 
 * @param {object} options
 * @returns 
 */
$.fn.appendContent = function(options) {
    return $(this).loadContent($.extend({action: "append"}, options));
};

/**
 * Renders xml content
 * 
 * @param {object} options
 * @returns object
 */
$.fn.renderXmlContent = function(options) {
    var p = "";

    var inlinescript = {};
    var inlinestyle = {};
    var externalstyle = {};
    var externalscript = {};

    var inst = $(this);
    var xml = $(options.xml);

    xml.find("content").each(function() {
        p += $(this).text();
    });

    xml.find("inlinescript").each(function() {
        if ($("script#" + $(this).attr("id")).length > 0)
            return;
        inlinescript[$(this).attr("id")] = $(this).text();
    });
    xml.find("inlinestyle").each(function() {
        if ($("style#" + $(this).attr("id")).length > 0)
            return;
        inlinestyle[$(this).attr("id")] = $(this).text();
    });
    xml.find("externalstyle").each(function() {
        if ($("link#" + $(this).attr("id")).length > 0)
            return;
        externalstyle[$(this).attr("id")] = $(this).attr("href");
    });
    xml.find("externalscript").each(function() {
        if ($("script#" + $(this).attr("id")).length > 0)
            return;
        externalscript[$(this).attr("id")] = $(this).attr("href");
    });

    var apnh = "";
    for (var e in externalstyle)
        apnh += "<l" + "ink rel=\"stylesheet\" type=\"text/css\" href=\"" + externalstyle[e] + "\" id=\"" + e + "\"/>";
    for (var e in inlinestyle)
        apnh += "<s" + "tyle id=\"" + e + "\">" + inlinestyle[e] + "</st" + "yle>";

    $("head").append(apnh);

    if (options.action == "append") {
        $(inst).append(p);
    }
    else if (options.action == "replace") {
        $(inst).before(p);
        $(inst).remove();
    }
    else {
        $(inst).html(p);
    }

    apnh = "";
    for (var e in externalscript)
        apnh += "<sc" + "ript src=\"" + externalscript[e] + "\" type=\"text/javascript\" id=\"" + e + "\"></sc" + "ript>";
    for (var e in inlinescript)
        apnh += "<s" + "cript id=\"" + e + "\">" + inlinescript[e] + "</s" + "cript>";
    $("body").append(apnh);

    return this;
};
/**
 * Load xml content to defined container
 * @param {object} options
 * @return object
 */
$.fn.loadContent = function(options) {

    options = $.extend({
        start: function() {
        },
        done: function() {
        },
        always: function() {
        },
        fail: function() {
        },
        useCache: false,
        type: "GET",
        args: {},
        blocking: true
    }, options);

    var inst = $(this);

    options.start.call(inst);
    if (options.useCache && __loadedcontentcache[options.url]) {
        options.xml = __loadedcontentcache[options.url];
        inst.renderXmlContent(options);
        options.done.call(inst, __loadedcontentcache[options.url]);
        options.always.call(inst);
        return $(this);
    }

    $.ajax({type: options.type, data: options.args, url: options.url + ((options.url.indexOf("?") == -1) ? "?__r=" : "&__r=") + Math.random(), dataType: "xml"})
            .done(function(d) {
        __loadedcontentcache[options.url] = d;
        options.xml = d;
        inst.renderXmlContent(options);
        options.done.call(inst, d);
    })
            .fail(function(d) {
        options.fail.call(inst, d);
    })
            .always(function(d) {
        options.always.call(inst, d);
    });

    return $(this);
};
