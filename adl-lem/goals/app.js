// Entry Point for the LRS ReRoute Service.
//
// This is a NodeJS Express application 
//
const http = require("http")
const cors = require("cors")
const express = require("express");
const bodyParser = require("body-parser")
const keycloakAdapter = require("simple-keycloak-adapter");

const config = require("./config");
const kafka = require("./lib/kafka");
const goals = require("./lib/goal-gb");

const APP_PORT = (process.env.APP_PORT || 3000);

const app = express();
const server = http.createServer(app);

// Handler to allow for secret key instead of Keycloak auth
function auth(req, res, next) {
    if (req.query.secret == config.secret)
        next()
    else
        keycloakAdapter.protect()(req, res, next);
}

// Handler to confirm our request looks correct 
function validate(req, res, next) {
    let payload = (req.method == "GET") ? req.query : req.body;

    // Check the user is allowed to be doing this (needs secret or admin rights)
    if (payload.secret != config.secret && res.locals.user.admin == false && res.locals.user.id != payload.user)
        res.status(401).send(`Unauthorized: Admin or Secret access required to modify other users.`)
    
    // // Make sure they're passing a correct enum value
    // else if (payload.status && goals.statusEnum[payload.status] == undefined)
    //     res.status(400).send(`Invalid status: ${payload.status}.  'status' field must be one of the following: ${JSON.stringify(Object.keys(goals.statusEnum))}`)
    // else if (payload.type && goals.statusEnum[payload.type] == undefined)
    //     res.status(400).send(`Invalid type: ${payload.type}.  'type' field must be one of the following: ${JSON.stringify(Object.keys(goals.typeEnum))}`)
    else
        next();
}

/**
 * Lastly, configure that express instance to serve this page.
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

// Set up our keycloak adapter
app.use(keycloakAdapter.init(config.keycloak, config.root + "/logout"));

// // Create goals
// app.post(config.root + "/api/create", auth, validate, function(req, res, next) {
//     goals.createGoal(req.body.user, req.body.goal, req.body.type, req.body.status).then(data => res.json(data));
// });

// Read goals
app.get(config.root + "/api/read", auth, validate, function(req, res, next) {
    if (req.query.user == undefined)
        res.status(400).send("Your query must specify a 'user'");    
    else if (req.query.goal)
        goals.readGoal(req.query.user, req.query.goal).then(data => res.json(data));
    else
        goals.readGoals(req.query.user).then(data => res.json(data));
});

// // Update goals
// app.post(config.root + "/api/update", auth, validate, function(req, res, next) {

//     if (!req.body.user)
//         res.status(400).send("Your form must specify a 'user'");    
//     else if (!req.body.goal)
//         res.status(400).send("Your form must specify a 'goal'");
//     else if (!req.body.status || !goals.statusEnum[req.body.status])
//         res.status(400).send("Your form must specify a 'status'.  These are 'inactive', 'active', and 'satisfied'.");
//     else
//         goals.updateGoal(req.body.user, req.body.goal, req.body.status).then(data => res.json(data));
// });

// Delete goals
app.post(config.root + "/api/delete", auth, validate, function(req, res, next) {
    if (req.body.user == undefined)
        res.status(400).send("Your form must specify a 'user'");    
    else if (req.body.goal)
        goals.deleteGoal(req.body.user, req.body.goal).then(count => res.send(count.toString()));
    else
        goals.deleteGoals(req.body.user).then(count => res.send(count.toString()));
});

// Main page.
app.get(config.root, keycloakAdapter.protect(), function (req, res, next) {
    res.render("index.ejs", {
        root: config.root
    });
});

// Then start the server.
goals.init(__dirname + "/data/goals.db", error => {

    kafka.init();

    if (error) {
        console.error("[SQLITE] Client failed to connect ...", error)
    } else {
        console.log("[SQLITE] Client connected, starting server ...")
        server.listen(APP_PORT, () => {
            console.log(`[Goals] Listening on port ${APP_PORT}`)
        });
    }
})