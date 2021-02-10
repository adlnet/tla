// Small set of utility functions for managing our sqlite3 database.
//
const sqlite3 = require("sqlite3").verbose();

const path = require('path');
const dbPath = path.resolve(__dirname, './data/data.sqlite')

var db = new sqlite3.Database(dbPath);

// Create our tables and DB file
function init() {

    // Services table
    db.run(`CREATE TABLE IF NOT EXISTS services (name TEXT PRIMARY KEY, ip TEXT, port TEXT, status TEXT, lastChecked TEXT, endpoint TEXT);`, function(err) {
        if (err) console.log(err);
    });

    // Machines table
    db.run(`CREATE TABLE IF NOT EXISTS machines (name TEXT PRIMARY KEY, ip TEXT);`, function(err) {
        if (err) console.log(err);
    });
}

// Add the given service to our database.  If there's already an entry for this service,
// we will replace it
function addService(service, callback) {

    // Replace our possible nulls
    for (var prop in service) {
        if (service.hasOwnProperty(prop) && service[prop] === undefined) {
            service[prop] = "";
        }   
    }
    
    let sql = db.prepare(`INSERT OR REPLACE INTO 
        services (name, ip, port, status, lastChecked, endpoint)
        values (?, ?, ?, ?, ?, ?)`);

    // Replace this entry if it's already here
    sql.run([service.name, service.ip, service.port, service.status, service.lastChecked, service.endpoint], callback);
}

// Get all endpoints
function getServices(callback) {
    
    // Use a callback for this
    db.all("SELECT * FROM services;", function(err, rows) {

        // Return a JSON object mapping service names to their objects
        services = {}

        if (err) 
            console.log(err);
        else {
            
            // The query returns table rows in JSON format.
            for (let k=0; k < rows.length; k++ ) {
                services[rows[k].name] = rows[k];
            }
        }

        // Return with the callback
        callback(services);
    });
}

// Add the given service to our database.  If there's already an entry for this service,
// we will replace it
function addMachine(machine, callback) {

    console.log("adding: ", machine);

    // Replace our possible nulls
    if (machine.name === undefined)
        machine.name = "UNDEFINED";
    
    // Replace this entry if it's already here
    let sql = db.prepare(`INSERT OR REPLACE INTO machines (name, ip) values (?, ?)`);

    // Replace this entry if it's already here
    sql.run([machine.name, machine.ip], callback);
}

// Get all machines
function getMachines(callback) {
    
    // Use a callback for this
    db.all("SELECT * FROM machines;", function(err, rows) {

        // Return an array of available machines that have been registered
        machines = {}

        if (err) 
            console.log(err);
        else {
            
            // The query returns table rows in JSON format.
            for (let k=0; k < rows.length; k++ ) {
                machines[rows[k].ip] = rows[k];
            }
        }
        
        // Return with callback
        callback(machines);
    });
}

// Clear a single service
//
function clearService(serviceName) {

    // DELETE command with a WHERE argument
    let sql = db.prepare("DELETE FROM services WHERE name = ?;");
    sql.run([serviceName]);
}

// Clear a single machine
//
function clearMachine(machineName) {

    // DELETE command with a WHERE argument
    let sql = db.prepare("DELETE FROM machines WHERE name = ?;");
    sql.run([machineName]);
}


// Clear all endpoints
//
// This will delete EVERYTHING from services.  This should not be used unless
// the user is absolutely sure of what they are doing.
//
function clearServices() {

    // DELETE command without a WHERE argument
    db.run("DELETE FROM services;", function(result){
        console.log("CLEARED ALL SERVICES");
    });
}


// Clear all machines
//
// This will delete EVERYTHING from services.  This should not be used unless
// the user is absolutely sure of what they are doing.
//
function clearMachines() {

    // DELETE command without a WHERE argument
    db.run("DELETE FROM machines;", function(result){
        console.log("CLEARED ALL MACHINES");
    });
}

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

// Initialize our db before returning
init();

module.exports = {
    "addService": addService,
    "addMachine": addMachine,
    "getServices": getServices,
    "getMachines": getMachines,
    "clearService": clearService,
    "clearMachine": clearMachine,
    "clearServices": clearServices,
    "clearMachines": clearMachines,

    "init": init,
}
