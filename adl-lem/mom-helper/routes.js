const cors = require("cors")
const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const keycloak = require("simple-keycloak-adapter")

const mom = require("tla-mom-proto")
const config = require("./config");

const sections = [
    {
        file: "verbs.ejs",
        title: "MOM Verbs",
        text: "Displays all MOM verbs and provides an API link to use them externally.",
        icon: "menu_book",
        path: config.root + "/verbs"
    },
    {
        file: "sender.ejs",
        title: "MOM Sender",
        text: `A simple page for sending personalized MOM-compliant xAPI statements.
            Use this page to check whether statements produce appropriate responses in other TLA services.`,
        icon: "send",
        path: config.root + "/sender"
    }
]

const routing = {
    /**
     * @param {express.Express} app Express Application
     */
    init: async(app) => {

        let root = config.root

        app.use(cors())
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
        app.use(expressLayouts);
        app.set("view engine", "ejs");
        app.set("views", path.join(__dirname, "/views"))
        app.set("layout", "layouts/layout.ejs")
        app.use(root, express.static("public"));
        app.use(root, express.static("scripts"));
        app.use(root, express.static("views"));

        app.use("*", function (req, res, next) {
            if (req.baseUrl.startsWith(root) == false)
                res.redirect(root + req.url);
            else
                next();
        });
        
        app.use(keycloak.init(config.keycloak, config.root + "/logout", config.root));
        app.use(routing.protect())

        app.use("*", function (req, res, next) {
            res.locals.root = root;
            res.locals.secret = config.secret;
            res.locals.sections = sections;
            res.locals.actor = {
                account: {
                    name: res.locals.user.id,
                    homePage: config.keycloak["auth-server-url"],
                }
            };
            res.locals.verbs = JSON.stringify(mom.verbs);
            res.locals.lrs = config.lrs;
            res.locals.keycloak = config.keycloak;
            res.locals.endpoints = config.endpoints;
            next();
        })

        for (let section of sections) {
            app.get(section.path, async(req, res, next) => {
                res.render(section.file) 
            })
        }

        app.get(config.root + "/api/verbs", async(req, res, next) => {
            res.json(mom.verbs)
        })

        app.get(config.root + "/api/verbs/:verb", async(req, res, next) => {
            let verb = mom.verbs[req.params.verb]
            if (verb && verb.id)
                res.json(verb)
            else
                res.status(400).send("Unknown verb: " + req.params.verb)
        })
        
        app.get(root, function(req, res, next) {
            res.render("index");
        })

    },

    protect: () => {
        return (req, res, next) => {
            if (req.query.secret == config.secret)
                next()
            else
                keycloak.protect()(req, res, next);
        }
    },
}

module.exports = routing