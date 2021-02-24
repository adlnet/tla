// Entry Point for the LRS ReRoute Service.
//
// This is a NodeJS Express application 
//
const http = require("http")
const express = require("express");

const sqlite = require("sqlite3").verbose();

const config = require("./config");
const models = require("./lib/models");
const routes = require("./lib/routes");
const kafka = require("./lib/kafka");

const APP_PORT = (process.env.APP_PORT || 3000);

const app = express();
const server = http.createServer(app);

const dbPath = __dirname + "/data/scheduler.db";
const db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, err => console.error(err));

(async() => {
    kafka.init();
    await models.init(db);
    routes.init(app, [models.approvals, models.tasks]);
    
    server.listen(APP_PORT, () => console.log(`[SCHEDULER] Listening on ${APP_PORT}`))
})()