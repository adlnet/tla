const express = require("express")
const keycloakHelper = require("simple-keycloak-adapter")
const config = require("../config")

module.exports = {

    init: async(app, port, onListening) => {

        // Static boiler plate
        app.set("view engine", "ejs");
        app.use(express.static("public"));
        app.use(express.static("scripts"));
        app.use(express.static("views"));
        app.use(config.root, express.static("public"));
        app.use(config.root, express.static("scripts"));
        app.use(config.root, express.static("views"));

        app.use("*", function (req, res, next) {
            if (req.baseUrl.startsWith(config.root) == false)
                res.redirect(config.root.substr(1) + req.url);
            else
                next();
        });

        // Setup our keycloak adapter
        app.use(keycloakHelper.init(config.keycloak));

        // Main page.
        app.get(config.root, keycloakHelper.protect(), function (req, res, next) {
            res.render("index.ejs", {
                root: config.root
            });
        });

        // Then start the server.
        app.listen(port, onListening);
    }
}