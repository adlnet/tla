const ini = require("ini");
const db = require("./db-helpers");
const constants = require("./constants");
const Service = require("./service-class");

// Export JSON to browser
//
function exportJSON(serviceMap, savedMachines, req, res, next, serviceCallback, machineCallback){

    serviceCopy = JSON.parse(JSON.stringify(serviceMap));
    machineCopy = JSON.parse(JSON.stringify(savedMachines));

    // Get all of our machines
    var machineList = [];
    for (let ip in machineCopy) {
        if (machineCopy.hasOwnProperty(ip)) {
            machineList.push(machineCopy[ip]);
        }
    }

    // Get our services
    var serviceList = [];
    for (let serviceCode in serviceCopy) {
        if (serviceCopy.hasOwnProperty(serviceCode)) {
            serviceList.push(serviceCopy[serviceCode]);
        }
    }

    // Remove unnecessary properties before we send it back, this is to make editing
    // the JSON format less of a headache.  Each of these values will be reassigned
    // once it's returned to us.
    //
    for (let serviceName of constants.servicesArray) {
        if (serviceCopy[serviceName] !== undefined) {
            delete serviceCopy[serviceName].status;
            delete serviceCopy[serviceName].endpoint;
            delete serviceCopy[serviceName].lastChecked;
        }
    }

    // Create an object with services and machines combined
    res.send(JSON.stringify({
        "services": serviceList, 
        "machines": machineList
    }));
}

// Export INI to browser
//
function exportINI(serviceMap, savedMachines, req, res, next){

    serviceCopy = JSON.parse(JSON.stringify(serviceMap));

    // Get the unassigned services and list those at the top
    var headerComment = ""
    headerComment += ";---------------------------------------------------------------------------------;";
    headerComment += "\r\n;This is an INI file to configure the Service Registry"
    headerComment += "\r\n;";
    headerComment += "\r\n;A list of all expected service codes are listed below. "
    headerComment += "\r\n;";
    
    for (let serviceName of constants.servicesArray) {
        
        headerComment += ("\r\n; " + serviceName); 

        if (serviceCopy[serviceName] !== undefined) {
            delete serviceCopy[serviceName].name;
            delete serviceCopy[serviceName].status;
            delete serviceCopy[serviceName].endpoint;
            delete serviceCopy[serviceName].lastChecked;
        }
    }
    headerComment += "\r\n;";
    headerComment += "\r\n;To assign an IP and Port to a service, use the syntax below:";
    headerComment += "\r\n;";
    headerComment += "\r\n;[service_code]";
    headerComment += "\r\n;ip=127.0.0.1";
    headerComment += "\r\n;port=8000";
    headerComment += "\r\n;";
    headerComment += "\r\n;---------------------------------------------------------------------------------;";
    headerComment += "\r\n; Enter your IP / Port configuration below";
    headerComment += "\r\n;---------------------------------------------------------------------------------;";
    headerComment += "\r\n";

    // Create an object with services and machines combined
    res.send(headerComment + ini.stringify(serviceCopy));
}

// Import JSON from browser request to server-side
//
function importJSON(req, res, next){

    try {
        // Get the object we just received from the POST body
        var parsedJson = JSON.parse(req.body.data);

        // By now, a json parsing error would've left this block, 
        // so we have valid JSON and will clear everything we have
        // db.clearServices();
        // db.clearMachines();

        // Once we have this, go through our services
        for (let service of parsedJson.services) {

            // We've only required that the construction parameters are available,
            // this will let us rebuild the service object server-side 
            //
            let iterService = new Service(service.name, service.ip, service.port);

            // Assign this to our db
            db.addService(iterService, function(err) {
                if (err)
                    console.log("ERROR:", iterService, err);
            });
        }

        // Once we have this, go through our services
        for (let machine of parsedJson.machines) {

            // The machine objects are much simpler and do not require any added information
            db.addMachine(machine, function(err) {
                if (err)
                    console.log("ERROR:", machine, err);
            });
        }

        // No errors, nothing to return
        res.send('{}');

    } catch (err) {

        // Return the error
        res.statusCode = 400;
        res.send(JSON.stringify('{"error": ' + JSON.stringify(err) + '}'));
    }
}

// Import INI from browser request to server
//
function importINI(req, res, next){

    try {
        // Get the object we just received from the POST body
        var parsedINI = ini.parse(req.body.data);

        // We only need to clear services, as machines aren't included
        db.clearServices();

        // Once we have this, go through our services
        for (let serviceCode of constants.servicesArray) {

            // Make sure we have one at all here
            if (parsedINI[serviceCode] === undefined)
                continue;

            // We've only required that the construction parameters are available,
            // this will let us rebuild the service object server-side 
            //
            let iterService = new Service(serviceCode, parsedINI[serviceCode].ip, parsedINI[serviceCode].port);

            // Assign this to our db
            db.addService(iterService, function(err) {
                if (err)
                    console.log("ERROR:", iterService, err);
            });
        }

        // No errors, nothing to return
        res.send('{}');

    } catch (err) {
        // Create an object with services and machines combined
        res.statusCode = 400;
        res.send(JSON.stringify('{"error": ' + JSON.stringify(err) + '}'));
    }
}

module.exports = {
    importINI: importINI,
    importJSON: importJSON,

    exportINI: exportINI,
    exportJSON: exportJSON,
}
