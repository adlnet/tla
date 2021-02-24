// Entry point for the LRS re-route service.
//
// This is a NodeJS Express application.
//
const http = require("http");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const keycloakAdapter = require("simple-keycloak-adapter");

const config = require("./config");
const comps = require("./lib/comp-db");
const kafka = require("./lib/kafka");

const APP_PORT = (process.env.APP_PORT || 3000);

const app = express();
const server = http.createServer(app);

// Handler to allow for secret key instead of Keycloak auth.
function auth(req, res, next) {
    if (req.query.secret == config.secret)
        next();
    else
        keycloakAdapter.protect()(req, res, next);
}

// Handler to confirm our request looks correct.
function validate(req, res, next) {
    let payload = (req.method == "GET") ? req.query : req.body;

    console.log("Payload:", payload)

    // Check the user is allowed to be doing this (needs secret or admin rights).
    if (payload.secret != config.secret && res.locals.user.admin == false && res.locals.user.id != payload.user)
        //next();
        res.status(401).send(`Unauthorized: Admin or Secret access required to modify other users.`)
    else
        next();
}

/**
 * Lastly, configure that Express instance to serve this page.
 */
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.set("view engine", "ejs");
app.use(config.root, express.static("public"));
app.use(config.root, express.static("scripts"));
app.use(config.root, express.static("views"));
app.use("*", function (req, res, next) {
    if (req.baseUrl.startsWith(config.root) == false)
        res.redirect(config.root + req.url);
    else
        next();
});

// Set up our Keycloak adapter.
app.use(keycloakAdapter.init(config.keycloak, config.root + "/logout"));

// Create competencies.
/*app.post(config.root + "/api/create", auth, validate, function(req, res, next) {
    comps.createComp(req.body.user, req.body.competencyID, req.body.confidence).then(data => res.json(data));
});*/

// Read competencies.
app.get(config.root + "/api/read", auth, validate, function(req, res, next) {
    if (req.query.user == undefined) {
        res.status(400).send("Your query must specify a 'user'");
        //comps.readAll().then(data => res.json(data));
    }
    else if (req.query.competencyID)
        comps.readComp(req.query.user, req.query.competencyID).then(data => res.json(data));
    else
        comps.readComps(req.query.user).then(data => res.json(data));
});

// Update competencies.
app.post(config.root + "/api/update", auth, validate, function(req, res, next) {

    if (!req.body.user)
        res.status(400).send("Your form must specify a 'user'");    
    else if (!req.body.competencyID)
        res.status(400).send("Your form must specify a 'competencyID'");
    else if (!req.body.confidence || isNaN(req.body.confidence))
        res.status(400).send("Your form must specify a confidence level.");
    else
        comps.updateComp(req.body.user, req.body.competencyID, req.body.confidence).then(data => res.json(data));
});

// Delete competencies.
app.post(config.root + "/api/delete", auth, validate, function(req, res, next) {
    if (req.body.user == undefined)
        res.status(400).send("Your form must specify a 'user'");    
    else if (req.body.competencyID)
        comps.deleteComp(req.body.user, req.body.competencyID).then(count => res.send(count.toString()));
    else
        comps.deleteComps(req.body.user).then(count => res.send(count.toString()));
});

// Main page.
app.get(config.root, keycloakAdapter.protect(), function (req, res, next) {
    res.render("index.ejs", {
        root: config.root
    });
});

// Then start the server.
comps.init(__dirname + "/data/comps.db", error => {
    if (error) {
        console.error("[SQLITE] Client failed to connect ...", error)
    } else {
        console.log("[SQLITE] Client connected, starting server ...")
        server.listen(APP_PORT, function () {
            console.log("[HTTP] Keycloak Helper service started on port %s", APP_PORT);
        });
    }
})

kafka.filter(statement => {

    if (!statement) {
        console.warn("[LP] Junk Statement?:", statement)
        return;
    }

    console.log("[LP] Received assertion statement:", statement.id);

    if (statement.actor && statement.actor.account && statement.actor.account.name)
    {
        let user = statement.actor.account.name;
        let comp = statement.object.id;
        let time = statement.timestamp;
        let conf = 1; // statement.context.extensions.CONFIDENCE;

        comps.createComp(user, comp, conf, time).then(record => {
            console.log("[LP] Created record for", user, comp, record, time);
        })
    }
    else
        console.warn("[LP] Skipping invalid Actor entry for Statement", statement.id);
})