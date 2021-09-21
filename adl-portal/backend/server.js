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
const config = require("./config");

const app = express();
const PORT = config.port;

app.use(keycloakHelper.init(config.keycloak));

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

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});