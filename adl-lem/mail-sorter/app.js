// Entry point for the LRS reroute service.
//
// This is a NodeJS Express application.
//
const http = require("http")
const express = require("express");
const keycloakHelper = require("simple-keycloak-adapter");

const kafka = require("./lib/kafka")
const config = require("./config");

const app = express();
const server = http.createServer(app);

app.set("view engine", "ejs");
app.use("*", function (req, res, next) {

    if (req.baseUrl.startsWith(config.root) == false)
        res.redirect(config.root.substr(1) + req.url);
    else
        next();
});

// Run static content ahead of the Keycloak route.
app.use(config.root, express.static("public"));
app.use(config.root, express.static("scripts"));
app.use(config.root, express.static("views"));

// Setup our Keycloak adapter.
app.use(keycloakHelper.init(config.keycloak));

// Main page.
app.get(config.root, keycloakHelper.protect(), function (req, res, next) {
    res.render("index.ejs", {
        root: config.root
    });
});

// Then start the server.
server.listen(3000, "0.0.0.0", function () {
    console.log("\nMail Sorter Socket listening on port %s", 3000);
});

kafka.filter((statement, type) => {
    console.log(`[Mail] Processed statement: ${statement.id}`);
})
