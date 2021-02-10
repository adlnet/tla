// Entry Point for the LRS ReRoute Service.
//
// This is a NodeJS Express application 
//
const http = require("http")
const cors = require("cors")
const express = require("express");
const keycloakAdapter = require("simple-keycloak-adapter");

const config = require("./config");
const db = require("./lib/keycloak-db");

const APP_PORT = (process.env.APP_PORT || 3000);

const app = express();
const server = http.createServer(app);

function auth(req, res, next) {
    if (req.query.secret == config.secret)
        next()
    else
        keycloakAdapter.protect()(req, res, next);
}

/**
 * Lastly, configure that express instance to serve this page.
 */
app.set("view engine", "ejs");
app.use(cors())
app.use(config.root, express.static("public"));
app.use(config.root, express.static("scripts"));
app.use(config.root, express.static("views"));
app.use("*", function (req, res, next) {
     
    if (req.baseUrl.startsWith(config.root) == false)
        res.redirect(config.root + req.url);
    else
        next();
});

// Set up our keycloak adapter
app.use(keycloakAdapter.init(config.keycloak));

app.get(config.root + "/api/users", auth, function(req, res, next) {
    db.getUsers(users => {
        console.log(users);
        res.json(users);   
    });
});

app.get(config.root + "/api/everyone", auth, function(req, res, next) {
    db.getAllUsers(users => {
        console.log(users);
        res.json(users);   
    });
});

// Main page.
app.get(config.root, keycloakAdapter.protect(), function (req, res, next) {
    res.render("index.ejs", {
        root: config.root
    });
});

// Then start the server.
db.init(error => {
    if (error) {
        console.error("[PG] Client failed to connect ...", error)
    } else {
        console.log("[PG] Client connected, starting server ...")
        server.listen(APP_PORT, "0.0.0.0", function () {
            console.log("[HTTP] Keycloak Helper service started on port %s", APP_PORT);
        });
    }
})