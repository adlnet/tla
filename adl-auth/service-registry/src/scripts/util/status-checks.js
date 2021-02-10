// Set of predetermined requests that will check whether or not
// a given service is running correcting or not.
//
var axios = require("axios");
var constants = require("./constants");

// Abbreviate
var codes = constants.services;
var statCodes = constants.statusCodes;
var endpointTemplates = constants.endpointTemplates;

// Adjust the base 10 second timeout to something
axios.defaults.timeout = 4000;

// This is the main function we'll expose with exports.  It will use helper
// functions below for each specific service.
//
const checkStatus = async(serviceCode, ip, port) => {
    
    // See if we have a url template for this service
    if (endpointTemplates[serviceCode] !== undefined) {

        // If we do, replace the ip and port with whatever we got here
        let endpoint = endpointTemplates[serviceCode].replace("{ip}", ip).replace("{port}", port);

        // Axios will throw an exception if there's a 404 or some other exception warning,
        // including just taking too long to get a response
        //
        try {
            var res = await axios.get(endpoint, {

                // Reject only if the status code is greater than or equal to 500
                validateStatus: function (status) {
                    return status < 500; 
                }
            });

            if (res.status >= 200 && res.status < 300)
                return statCodes.OK;
                
            if (res.status >= 300 && res.status < 400)
                return statCodes.OTHER;
            
            if (res.status >= 400)
                return statCodes.ERROR;

            else 
                return statCodes.DOWN;

        } catch (error) {

            // This has some crossover with the ERROR just becuase of how axios handles
            // bad requests.
            return statCodes.DOWN;
        }
    } else {

        // If we didn't have one of those within the urls map, then return
        // the NOT_IMPLEMENTED code.
        return statCodes.NOT_IMPLEMENTED;            
    }
}

// Check all services known in a collection of endpoints.  These objects will have
// service codes mapped to Service instances (defined in /util/service-data.js)
const updateServiceStatuses = async(services) => {

    // Iterate through every object we have
    for (let serviceCode in services) {
        if (services.hasOwnProperty(serviceCode)) {

            let service = services[serviceCode];

            // Reassign its fill attribute
            service.status = await checkStatus(service.name, service.ip, service.port);
            service.lastChecked = Date.now();
        }
    }

    return services;
}

module.exports = {
    // We'll just call this 'update' for sanity
    update: updateServiceStatuses
};