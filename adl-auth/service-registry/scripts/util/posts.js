const ini = require("ini");
const db = require("./db-helpers");
const constants = require("./constants");
const Service = require("./service-class");
const helpers = require("./helpers");

// Post an endpoint to our service
//
function postEndpoint(serviceMap, savedMachines, req, res, next){

    // Get what required headers they passed in.  Node takes headers in lowercase.
    var serviceName = req.headers[constants.HEADER_SERVICE_NAME] || req.headers[constants.HEADER_SERVICE_NAME.toLowerCase()];
    var serviceIp = req.headers[constants.HEADER_SERVICE_IP] || req.headers[constants.HEADER_SERVICE_IP.toLowerCase()];
    var servicePort = req.headers[constants.HEADER_SERVICE_PORT] || req.headers[constants.HEADER_SERVICE_PORT.toLowerCase()];

    // Allow an empty port
    if (servicePort === undefined)
        servicePort = "";

    // Make sure the service name is present and that it's one of the required ones
    if (serviceName === undefined || constants.servicesArray.indexOf(serviceName) < 0) {

        res.statusCode = 400;
        res.send('{"error": "Invalid Service Name: ' + serviceName + '.  Valid names include: ' + constants.servicesArray.join(", ") + '"}');
        return;
    }
    // We don't need for the request to contain an IP or PORT, but ideally they do provide one.
    //
    // If either of these are missing, we will just use the local IP / PORT.
    if (serviceIp === undefined || serviceIp.trim() === "") {
        res.statusCode = 400;
        res.send(JSON.stringify({"error": "Invalid Service IP / URL: " + serviceIp}));
        return;
    } 

    // For the PORT, Make sure they sent something.  We'll accept valid ports or an empty string.
    if (helpers.isValidPort(servicePort) === false && servicePort !== "") {
        res.statusCode = 400;
        res.send('{"error": "Invalid Service Port: ' + servicePort + '"}');
        return;
    }

    // Now that we've either validated the service submitted, rejected it, or replaced endpoint values,
    // we can add this to our map
    serviceMap[serviceName] = new Service(serviceName, serviceIp, servicePort);
    serviceMap[serviceName].lastChecked = Date.now();

    // Add this to our DB 
    db.addService(serviceMap[serviceName], function(err) {

        // If we had an issue with adding that endpoint, we'll return an empty object
        if (err) {
            res.send('{"error": "Database Error."}');
            return;
        
        // If nothing bad happened, return the current entries in our db
        } else {
            db.getServices(function(services){
                serviceMap = services;
                res.send(JSON.stringify(services));
            })
        }
    });
}

// Post a machine to our service
//
function postMachine(serviceMap, savedMachines, req, res, next){

    // Get what required headers they passed in.  Node takes headers in lowercase.
    var machineName = req.headers[constants.HEADER_MACHINE_NAME] || req.headers[constants.HEADER_MACHINE_NAME.toLowerCase()];
    var machineIp = req.headers[constants.HEADER_MACHINE_IP] || req.headers[constants.HEADER_MACHINE_IP.toLowerCase()];

    // Make sure the service name is present and that it's one of the required ones
    if (machineName === undefined || machineName.trim() === "") {

        res.statusCode = 400;
        res.send('{"error": "Empty Machine Name."}');
        return;
    }

    // Now that we've either validated the service submitted, rejected it, or replaced endpoint values,
    // we can add this to our map
    savedMachines[machineIp] = {name: machineName, ip: machineIp}

    // Add this to our DB 
    db.addMachine(savedMachines[machineIp], function(err) {

        // If we had an issue with adding that endpoint, we'll return an empty object
        if (err) {
            res.send('{"error": "Database Error."}');
            return;
        
        // If nothing bad happened, return the current entries in our db
        } else {
            db.getMachines(function(machines){
                savedMachines = machines;
                res.send(JSON.stringify(machines));
            })
        }
    });
}

module.exports = {
    postEndpoint: postEndpoint,
    postMachine: postMachine,
}