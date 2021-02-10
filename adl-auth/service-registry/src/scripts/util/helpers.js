// Helper functions for the server side
//
'use strict';
var os = require('os');

// IP Validation function, taken from: 
// https://stackoverflow.com/questions/4460586/javascript-regular-expression-to-check-for-ip-addresses
//
function isValidIp(ipaddress) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {  
        return true;
    }  
    return false;
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

// Use the local network to determine the IP in use by this server.  This will 
// print out the individual IP4 addresses for each attached network adapter
//
// Taken from a SO response: https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
//
function printServerAddress() {

    // Use the function below for the lifting
    var ips = getServerAddresses();

    // Header
    console.log("Server IP Addresses:")

    // Each entry will be in the form IFNAME,IFACE.ADDRESS
    for (let k=0; k < ips.length; k++) {

        let pieces = ips[k].split(",");
        console.log("  -", pieces[0], pieces[1]);
    }
}

// Return all IPs we're using as a list
//
function getServerAddresses() {

    // Assign these to a list
    var ips = []

    // Get every network interface available to the system
    var ifaces = os.networkInterfaces();

    // Iterate through each of these
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;
        
        // There might be several addresses for this single interface.  We'll
        // keep track of those with the alias counter
        ifaces[ifname].forEach(function (iface) {

            // Skip anything that isn't IP4
            if ('IPv4' !== iface.family || iface.internal !== false)
                return;

            // Add it to our list
            ips.push(ifname + "," + iface.address);
            
            ++alias;
        });
    });

    return ips;
}

module.exports = {
    "isValidIp": isValidIp,
    "isValidPort": isValidPort,
    "printServerAddress": printServerAddress,
    "getServerAddresses": getServerAddresses,
}