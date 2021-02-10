const statusCodes = require("./constants").statusCodes;

// Set of functions to mirror the API functionality of the service registry
//
function getOldFormat(category, view, serviceMap, req, res, next) {

    // Check what they're looking for
    let service = serviceMap[category];

    // Assume we found nothing
    let data = "No data found!";

    // If we don't have a service matching that category, we'll skip this
    // and just return garbage
    if (service !== undefined) {

        // Assume they wanted the endpoint
        if (service.endpoint === statusCodes.NOT_IMPLEMENTED) {}

        // If they just wanted the name for some reason
        else if (view.toLowerCase() === "name") {
            data = service.name;
        } 
        
        // Return the endpoint itself
        else {
            data = service.endpoint;
        }
    }

    // Then return based on the content type
    //
    // JSON
    if (req.headers["content-type"] == "application/json") {
        res.send(encodeJson(data));
        return;
    }

    // Plain Text
    else if (req.headers["content-type"] == "text/plain") {
        res.send(data);
        return;
    }
        
    // HTML
    else if (req.headers["content-type"] == "text/xml") {
        res.send(encodeXml(data, req.params.category, req.params.view));
    }
        
    // XML / Default
    else {
        res.send(encodeHtml(data, req.params.category, req.params.view));
    }
}

// If the URL is requested with a browser
//
function encodeHtml(data, category, view) {
    
    // Return these as an html table
    let htmlResponse = "<html><body><table border='1'><TH>" + category + "</TH>";
    htmlResponse += "<tr><td>" + view + "</td><td>" + data + "</td></tr>";    
    htmlResponse += "</table></body></html>";
    return htmlResponse;		
}

// This will be the most common request format.
//
function encodeJson(data) {
    return JSON.stringify([data]);
}

// I don't know what all is expecting to get an XML response, but we'll
// just copy / paste the original setup
//
function encodeXml(data, category, view) {

    // More or less identical to the HTML version.
    let xmlResponse = '<?xml version="1.0"?><' + category + ' type="array">';
    xmlResponse += "<" + view + ">" + data + "</" + view + ">";    
    xmlResponse += "</" + category + ">";
    return xmlResponse;
}

module.exports = {
    getOldFormat: getOldFormat,
}
