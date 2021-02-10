// Entry Point for the Service Registry.
//
// This is a NodeJS Express application 
//
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const keycloakHelper = require("simple-keycloak-adapter");

const config = require("./config");

// Utility objects from our helper blocks
var posts = require("./scripts/util/posts");
var db = require("./scripts/util/db-helpers");
var helpers = require("./scripts/util/helpers");
var constants = require("./scripts/util/constants");
var transfers = require("./scripts/util/transfers");
var serviceUpdates = require("./scripts/util/status-checks");
var backwardsCompatability = require("./scripts/util/backwards-compatability");

// Initialize our db before moving on
db.init();

// Control how often we check the endpoints' statuses
var serviceUpdateInterval = 120000;

// Allow heroku or whatever provider to assign a port if necessary
var port = (process.env.PORT || 8085);

// Mapping for each server in use
var serviceMap = {};
var savedMachines = {};

// Create an instance of the express class and declare our port
var app = express();

// Set EJS as our view engine for partial templates
app.set("view engine", "ejs");

// Express makes it easier to parse our request body, removing the
// ugly callback system from the default http module
app.use(bodyParser.json())

// Since the point of this service is to receive and respond to requests
// from other services, we need to make sure the cross domain middleware
// is running
app.use(cors())

// Get our static files.  We're keeping these in a few different places, so this
// might get sort of confusing when looking directly at the href paths
app.use(express.static("public"));
app.use(express.static("scripts"));
app.use(express.static("views"));
app.use("/registry", express.static("public"));
app.use("/registry", express.static("scripts"));
app.use("/registry", express.static("views"));

// Keycloak integration
app.use(keycloakHelper.init(config.keycloak, "/registry/logout", "/registry"))
app.use(keycloakHelper.protect());

// Main index page.  Shows the registered services and their most recent statuses.
app.get("/registry/", function(req, res, next){
    res.render("index.ejs", {endpoints: serviceMap});
});

// Page with a brief explanation of the service's api and examples on how to use it.
app.get("/registry/help", function(req, res, next){
    res.render("help.ejs");
});

// Page with the standardized names expected by this service when another service 
// submits its registration information
app.get("/registry/codes", function(req, res, next){
    res.render("codes.ejs");
});

// Advanced page for configuring the endpoints manually.  This is an advanced feature 
// intended to be used if parties decide against self-registration.
app.get("/registry/manual", function(req, res, next){
    res.render("manual.ejs");
});

// Simple page for assigning names to machines / IP addresses.
app.get("/registry/machines", function(req, res, next){
    res.render("machines.ejs");
});

// // Pages to help import / export a premade or saved TLA configuration.
app.get("/registry/import", function(req, res, next){
    res.render("import.ejs");
});
app.get("/registry/export", function(req, res, next){
    res.render("export.ejs");
});

// Straightforward page showing server status across the TLA network.  Each service will
// be shown as its block diagram representation from the TLA documentation.
app.get("/registry/map", function(req, res, next){
    res.render("map.ejs");
});

// Send back the entire json object representing service endpoints.  Any null values
// should be interpretted as being unknown 
app.get("/registry/endpoints", function(req, res, next){
    db.getServices(function(services){
        res.send(JSON.stringify(services));
    }); 
});

// Return the saved machines
app.get("/registry/saved-machines", function(req, res, next){
    db.getMachines(function(machines){
        res.send(JSON.stringify(machines));
    }); 
});

// Small api endpoint to return the array of service triples (owner, code, name)
app.get("/registry/triples", function(req, res, next){
    res.send(JSON.stringify(constants.serviceNameTriples));
});

// Small api endpoint to return the array of service triples (owner, code, name)
app.get("/registry/server-ips", function(req, res, next){
    res.send(JSON.stringify(helpers.getServerAddresses()));
});

// Helper URL for the /export page.  This will serialize and return
// all of our services and machines to date in JSON format.
app.get("/registry/export/json",function(req, res, next){
    transfers.exportJSON(serviceMap, savedMachines, req, res, next);
});

// Helper URL for the /export page.  This will serialize and return
// all of our services in INI format.
app.get("/registry/export/ini", function(req, res, next){
    transfers.exportINI(serviceMap, savedMachines, req, res, next);
});

// SECURITY
//
// Before accepting any POST, we need to make sure the person is actually
// supposed to be making changes.  
app.post("/registry/*", function(req, res, next){

    // Get the header value
    var key = req.headers[config.api.header] || req.headers[config.api.header.toLowerCase()];

    // We'll just authenticate with a valid header
    if (key == config.api.secret) {
        next();
    } else {

        var errorMessage = "POST requests require a valid API key";

        // Then they shouldn't be here
        res.status(400);
        res.send(JSON.stringify({error: errorMessage}));
    }
});

// When someone requests /endpoints with POST, we need to parse what they sent
// and register the service that they claimed to represent
//
// This can be moved to a helper function at some point, but for now intellisense works
// much better when within app.js
//
app.post("/registry/endpoints", function(req, res, next){
    posts.postEndpoint(serviceMap, savedMachines, req, res, next);
});

// Allow the webpage to register machines
//
app.post("/registry/machines", function(req, res, next){
    posts.postMachine(serviceMap, savedMachines, req, res, next);
});

// Import routines for the /import page.  
// These are defined in /scripts/util/file-transfer.js
//
app.post("/registry/import/ini", transfers.importINI);
app.post("/registry/import/json", transfers.importJSON);

// Allow the service to clear the endpoints and machine stores
//
app.post("/registry/clear-services", function(req, res) {
    db.clearServices();
    res.send("{}");
});
app.post("/registry/clear-machines", function(req, res) {
    db.clearMachines();
    res.send("{}");
});

// Backwards Compatibility with the 2017 Service Registry
//
app.get("/registry/list/:category/:view", function(req, res, next) {
    db.getServices(function(services){
        backwardsCompatability.getOldFormat(req.params.category, req.params.view, services, req, res, next);
    });
});

// This is a catchall for any stray local paths the user tried to visit.  
// These will redirect to the index page and give a 404 message.
app.get("/registry/*", function(req, res){
    res.statusCode = 404;
    res.render("index.ejs", {"path": req.path, "endpoints": serviceMap});
});

// Additionally, we'll want to keep track of each status once its registered.  We'll
// set up an interval here that will check each service 
const update = async() => {

    // Check our machine and endpoint maps.  This is how we'll be updating the service map
    // to prevent queries from overloading response times.
    db.getMachines(function(machinesFromDB){
        savedMachines = machinesFromDB;
    });
    db.getServices(function(servicesFromDB){
        serviceMap = servicesFromDB; 
    });

    // This will apply the updates to the object used in this scope
    serviceMap = await serviceUpdates.update(serviceMap);

    // This part is a bit complicated.  We may very well have made DB changes since that async 
    // operation started, but we don't want to overwrite them by telling the DB that our status
    // checks are now truth data.
    //
    // We need to write these status updates to the DB, but ONLY if the service, ip, and port
    // have not changed.
    //
    db.getServices(function(servicesFromDB){

        // Go through the service map we just updated
        for (let serviceCode in serviceMap) {
            if (serviceMap.hasOwnProperty(serviceCode)) {
                
                // Sanity
                let iterService = serviceMap[serviceCode]
                let dbService = servicesFromDB[serviceCode];
                
                // Compare this recently-updated one with the most recent version in the DB
                // We don't need to check the service code, as the code mapping was how we chose
                // these two services to begin with.
                //
                if (dbService !== undefined && dbService.ip === iterService.ip && dbService.port === iterService.port) {
                    
                    // Now that we know these are representing the same service, we can
                    // go ahead and write the status / lastChecked data here
                    db.addService(iterService, function(err){
                        if (err)
                            console.log("Error updating service status for ", serviceCode, err);
                    });
                }
            }
        }
    });

    setTimeout(update, serviceUpdateInterval);
}

// Then start the server.
app.listen(port, "0.0.0.0", function(){

    console.log("\nService Registry listening on port %s", port);
    helpers.printServerAddress();
});

// Load the last endpoints we used.
setTimeout(function() {
    db.getServices(function(result){
        serviceMap = result;
    });
    db.getMachines(function(result){
        savedMachines = result;
    });
}, 1000);


// Start the update cycle
setTimeout(update, 5000);
