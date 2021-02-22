/**
 * Simple NodeJS Express app to stand up a static file server.
 * 
 * This will behave similar to a barebones Apache2 server, with the exceptions of 
 * EJS and CORS support out of the box.
 * 
 * This project exists primarily to provide a simpler method of securing a static file
 * server behind a modern authentication provider like Keycloak.  Rather than including
 * a Keycloak.js adapter inside of each page, you can guarantee pre-flight security by
 * protecting resources at the request stage.
 */
const cors = require("cors");
const mom = require("tla-mom-proto")
const express = require('express');
const config = require("./config");
const keycloakHelper = require("simple-keycloak-adapter");

const resolver = require("./lib/resolver");

// Align PORT to an environment variable for Docker configuration
const PORT = (process.env.PORT || 3000);

// Create an instance of the express class and declare our port
const app = express();

// Set EJS as our view engine for partial templates
app.set("view engine", "ejs");
app.set('json spaces', 2);
app.set('views', [__dirname + '/files', __dirname +  "/views"]);

// Middleware
app.use(cors())

// We are allowing certain paths to be ignored by our Keycloak protection.  This
// will let us serve example content or use the TLA server for other demos without
// requiring everyone to have an account
//
for (let path of config.protected) {
    app.get(path, function(req, res, next){
        req._protected = true;
        next();
    });
}

// Protect if necessary
app.use(keycloakHelper.init(config.keycloak));
app.use((req, res, next) => req._protected ? keycloakHelper.protect({ protocol: config.protocol })(req, res, next) : next());

// Regardless, pass our EJS values:
app.get("*", function (req, res, next){ 
    res.locals.lrs = req._protected ? config.tlaLRS : config.publicLRS;
    res.locals.keycloak = {
        url: config.keycloak["auth-server-url"]
    }
    res.locals.mom = mom;
    next();
});

// We'll handle this in about the most naive way possible.
app.get("*", function (req, res, next) {
    resolver.resolve(__dirname, req, res, next);
});

// If they didn't supply an index.html themselves, use the backup
app.get("/", function(req, res, next){
    res.render("index", {
        
    });
});

// If we're still here, we didn't find anything
//
app.get("*", function(req, res, next){
    res.status(404).render("404", {
        path: req.url
    });
});

// Start the server
app.listen(PORT, function () {
    console.log(`\n[Server] listening on port ${PORT} ...`)
});