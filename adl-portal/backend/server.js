/*
    Express server for TLA portal.

    To run: cd in 'server' directory, run 'node server.js'
*/

/*
    Express server for TLA portal.

    To run: type 'npm start'
*/

const express = require("express");
const path = require("path");
const keycloakHelper = require("simple-keycloak-adapter");
const config = require("./keycloak-config");

const app = express();
const port = 5000;

app.use(keycloakHelper.init(config.keycloak));

app.get(config.protocol, keycloakHelper.protect(), (req, res, next) => {
    res.render()
})




app.use(express.static(path.join(__dirname, 'build')));     

// unprotected routes
app.get("/", keycloakHelper.protect(), (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/visualizer", keycloakHelper.protect(), (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.get("/repositories", keycloakHelper.protect(), (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

// protected routes
app.get("/test", keycloakHelper.protect(), (req, res) => {
    res.send("This is to test if a user is authenticated");
});

//

app.listen(port, () => {
    console.log(`server started on port ${port}`);
})