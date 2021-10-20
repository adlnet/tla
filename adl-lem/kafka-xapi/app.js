// Entry Point for the LRS ReRoute Service.
//
// This is a NodeJS Express application 
//
const http = require("http")
const cors = require("cors")
const express = require("express");
const bodyParser = require("body-parser")

const config = require("./config");
const kafka = require("./lib/kafka");
const auth = require("./lib/auth");


async function main() {

    const APP_PORT = 3000;

    const app = express();
    const server = http.createServer(app);

    /**
     * Lastly, configure that express instance to serve this page.
     */
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))
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

    auth.init(app);

    app.get(config.root, auth.keycloakAuth, function (req, res, next) {
        res.render("index.ejs", {
            root: config.root
        });
    });

    app.post(config.root + "/statements", auth.basicAuth, function (req, res, next) {
        let ids = kafka.handlePayload(req.body);
        res.status(200).json(ids);
    });

    kafka.init();
    server.listen(APP_PORT);
}

main();