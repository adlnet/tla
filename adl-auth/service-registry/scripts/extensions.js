// Taken from a StackOverflow question and the extension itself
// is actually code from StackOverflow itself
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

/**
 * Services to show on our dropdown.
 */
window.serviceCodes = {
    
    // Unused code for example posts
    CODE_EXAMPLE: "tla_example",

    // ADL
    CODE_LRS: "lrs",
    CODE_LOGGING_LRS: "logging_lrs",
    CODE_LAUNCH: "launch",
    CODE_LAUNCH_CLIENT: "launch_client",
    CODE_KEYCLOAK: "keycloak",
    CODE_DISCOVERY: "discovery",
    CODE_Registry: "registry",
    CODE_AMQP_FORWARDING: "amqp",
    CODE_STATIC_CONTENT_VIEWER: "static_content_viewer",
    CODE_VIDEO_PLAYER: "video_player",
    CODE_MOODLE: "moodle",
    CODE_PALMS: "palms",
    
    // SoarTech
    CODE_RECOMMENDER_UI: "recommender_ui",
    CODE_RECOMMENDER_UI_SUPPORT: "recommender_ui_support",
    CODE_RECOMMENDER_ENGINE: "recommender_engine",
    CODE_LEARNER_ANALYTICS: "learner_analytics",
    CODE_LEARNER_ANALYTICS_STORE: "learner_analytics_store",
    CODE_LEARNER_INFERENCE: "learner_inference",
    CODE_ACTIVITY_INDEX: "activity_index",
    CODE_ASSESSMENT_QUIZ: "assessment_quiz",
    
    // Eduworks
    CODE_CASS: "cass",
    CODE_PEBL: "pebl",

    // Perigean
    CODE_SERO: "sero",

    // All
    CODE_STATIC_CONTENT: "static_content",

    // Added for 2019
    CODE_PERLS: "perls",
    CODE_ADL: "adl",
    CODE_KAFKA: "kafka",
    CODE_CONTENT: "content",
    CODE_NILE: "nile",
}


// IP Validation function, taken from: 
// https://stackoverflow.com/questions/4460586/javascript-regular-expression-to-check-for-ip-addresses
//
window.isValidIp = function(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
        return true;
    }  
    return false;
}

// Check the current security key the user has entered.
//
window.checkKey = function() {

    // JQuery is loaded before this, so we are fine using it
    return $("#headerTLAKeyInput").val().trim();
}

// Just check that this can be a number
//
function isValidPort(port) {  

    // We might have gotten garbage
    try {
        
        var portNumber = Number(port);
        return (portNumber > 1 && portNumber < 65535);

    } catch (err) {}
    
    return false;
}
