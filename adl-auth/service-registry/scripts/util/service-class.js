const endpointTemplates = require("./constants").endpointTemplates;
const statusCodes = require("./constants").statusCodes;

// Simple object for keeping service data
//
// This will store the service name, ip, port, status,  
// the last time we checked its status, and the full endpoint.
//
class Service {

    // We'll need most of the information when we first build one,
    // 
    constructor(cName, cIp, cPort) {

        // We'll just have these directly
        this.name = cName;
        this.ip = cIp;
        this.port = cPort;
        
        // Start out with an Unknown status.  This will be changed later, but for 
        // right now we haven't checked for this service yet.
        this.status = "Unknown";
        this.lastChecked = Date.now();
        this.endpoint = endpointTemplates[this.name];

        // Check that we have something and format it
        if (this.endpoint !== undefined) {
            this.endpoint = this.endpoint.replace(/{ip}/i, this.ip);
            
            // If we received an empty port, replace the entire port convention and just use
            // the URL / IP provided.
            //
            if (this.port === "" || this.port === undefined) {
                this.endpoint = this.endpoint.replace(/:{port}/i, "");
            } else {
                this.endpoint = this.endpoint.replace(/{port}/i, this.port);
            }
        }
        else {
            this.endpoint = statusCodes.NOT_IMPLEMENTED;
        }
            
    }
}

module.exports = Service;