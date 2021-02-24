// Entry Point for the LRS ReRoute Service.
//
// This is a NodeJS Express application 
//
const http = require("http")
const cors = require("cors")
const express = require("express");
const bodyParser = require("body-parser")

const sqlite = require("sqlite3").verbose();

const config = require("./config");
const models = require("./lib/models");
const routes = require("./routes");

const APP_PORT = (process.env.APP_PORT || 3000);

const app = express();
const server = http.createServer(app);

const dbPath = __dirname + "/data/scheduler.db";
const db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, err => console.error(err));

(async() => {

    await models.init(db);
    await routes.init(app, config);

    server.listen(APP_PORT, () => console.log(`[Profile] Listening on ${APP_PORT}`))
})()
