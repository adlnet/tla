// Entry Point for the LRS ReRoute Service.
//
// This is a NodeJS Express application 
//
const http = require("http")
const express = require("express");

const config = require("./config");
const routes = require("./routes");

const APP_PORT = (process.env.APP_PORT || 3000);

const app = express();
const server = http.createServer(app);

(async() => {

    await routes.init(app, config);

    server.listen(APP_PORT, () => console.log(`[Profile] Listening on ${APP_PORT}`))
})()
