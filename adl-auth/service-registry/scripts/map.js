// Background logic for the map page
//
// The elements here are SVG components.  We've only taken the shapes, not the font.  
// Moreover, these elements are not all a common type, but do all have a common
// attribute of "fill" for their colors.  We'll use JQuery to change this based on
// what the server determines their status to be.
//
var mapElements = window.mapElements || {

    // SVG elements.  We need to use the bracket notation so that JS knows
    // we're using variables as property names.
    //
    [window.serviceCodes.CODE_LRS]: window.$("#blockLRS"),
    [window.serviceCodes.CODE_CASS]: window.$("#blockCASS"),
    [window.serviceCodes.CODE_SOL_DATA]: window.$("#blockSOLData"),
    [window.serviceCodes.CODE_KEYCLOAK]: window.$("#blockKeycloak"),
    [window.serviceCodes.CODE_DISCOVERY]: window.$("#blockDiscovery"),
    [window.serviceCodes.CODE_REGISTRY]: window.$("#blockRegistry"),
    [window.serviceCodes.CODE_ACTIVITY_INDEX]: window.$("#blockActivityIndex"),
    [window.serviceCodes.CODE_LAUNCH]: window.$("#blockLaunchService"),
    [window.serviceCodes.CODE_LEARNER_ANALYTICS]: window.$("#blockLearnerAnalytics"),
    [window.serviceCodes.CODE_LEARNER_INFERENCE]: window.$("#blockLearnerInference"),
    [window.serviceCodes.CODE_TASK_SCORE_PREDICTOR]: window.$("#blockTaskScorePredictor"),
    [window.serviceCodes.CODE_RECOMMENDER_ENGINE]: window.$("#blockRecommendationEngine"),
    [window.serviceCodes.CODE_LEARNER_ANALYTICS_STORE]: window.$("#blockLearningAnalyticsStore"),

    // Then the refresh button
    refreshMapButton: window.$("#refreshMapButton"),
}

// Map colors we'll be using
var mapColors = {
    OK: "#00FFAA",
    DOWN: "#FF4444",
    OTHER: "#FFFF77",
    ERROR: "#FFA500",
    NOT_IMPLEMENTED: "#FFC0CB",
}

// Set the color for one of these SVG elements
function setColor(element, colorHex) {

    element.attr("fill", colorHex);
}

// Clear the map colors
function clearMap() {
    
    // Just iterate through the object
    for (let element in mapElements) {
        if (mapElements.hasOwnProperty(element)) {

            // Reassign its fill attribute
            setColor(mapElements[element], mapColors.UNKNOWN);
        }
    }
}

// Combination of the definitions above to redraw the map based on a json
// object containing our service data from the /endpoints api
function redrawMap(services) {

    // Clear the current map
    clearMap();

    console.log("redrawing map: ", services);

    // Just iterate through the object
    for (let serviceCode in services) {
        if (services.hasOwnProperty(serviceCode) && mapElements[serviceCode] !== undefined) {

            // Reassign its fill attribute based on the status code
            let service = services[serviceCode];
            setColor(mapElements[service.name], mapColors[service.status] || mapColors.UNKNOWN);

            console.log(serviceCode, mapColors[service.status], service.status);
        }
    }
}

// Now that our objects are defined and can be accessed easily, we need to get the
// service data from the service registry server and use that to populate the chart.
//
function updateMap() {

    // Make a promise chain to get our registered services
    fetch("/registry/endpoints", {
        method: "GET",
        headers: {
            Accept: "application/json",
        }
    })
    .then( response => response.json())
    .then( services => {

        // Clear the map and redraw everything
        redrawMap(services);
    })
    .catch(function(reason) {
        console.log("Error when updating map:", reason);
    });
}

// Assign that function to our button
mapElements.refreshMapButton.click(updateMap);

// Do this when we load
setTimeout(updateMap, 250);
