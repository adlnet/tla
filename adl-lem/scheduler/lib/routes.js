const cors = require("cors")
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const keycloak = require("simple-keycloak-adapter")
const sqliterRoutes = require("sqliter-routing")
const config = require("../config")

const routing = {
    /**
     * @param {express.Express} app Express Application
     */
    init: (app, models) => {

        let root = config.root;

        app.use(cors())
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
        app.set("view engine", "ejs");
        app.set("view engine", "ejs");
        app.set("views", path.join(__dirname, "../views"))
        
        app.use("*", function (req, res, next) {
            if (req.baseUrl.startsWith(root) == false)
                res.redirect(root + req.url);
            else
                next();
        });
        
        app.use(keycloak.init(config.keycloak, config.root + "/logout", config.root));
        app.use(routing.protect())
        
        app.use("*", function (req, res, next) {
            res.locals.root = root
            next();
        })
        
        for (let model of models) {
            routing.addModel(app, root, model, READ | DELETE)
        }
    },

    /**
     * @param {express.Express} app Express Application
     */
    addModel: (app, root, model, mask, ...middleware) => {

        let endpoint = path.join(root, model.name).replace(/\\/g, "/")
        
        if (mask & READ)
            app.get(endpoint, ...middleware, sqliterRoutes.read(model));
        if (mask & CREATE)
            app.post(endpoint + "/create", ...middleware, sqliterRoutes.create(model));
        if (mask & UPDATE)
            app.post(endpoint + "/update", ...middleware, sqliterRoutes.update(model));
        if (mask & DELETE)
            app.post(endpoint + "/delete", ...middleware, sqliterRoutes.delete(model));

        routing.announceModel(endpoint, model);

        if (model.logModel != undefined) {

            let logEndpoint = endpoint + "/log/:record"
            app.get(logEndpoint, ...middleware, async(req, res, next) => {
            
                let args = {
                    limit: req.query.limit,
                    offset: req.query.offset,
                    order: req.query.offset,
                    where: [`record=${req.params.record}`]
                }

                let records = await model.logModel.select("*", args)
                res.json(records)
            });
            
            routing.announceLog(logEndpoint, model.logModel)
        }
    },

    protect: () => {
        return (req, res, next) => {
            if (req.query.secret == config.secret)
                next()
            else
                keycloak.protect()(req, res, next);
        }
    },

    announceModel: (endpoint, model, mask) => {
        console.log(`
            [SCHEDULER] Added model "${model.name}" to routing with: 
                - GET ${endpoint}
                - POST ${endpoint}/delete
            `.replace(/  /g, "").replace(/\- /g, "\t- "))
    },

    announceLog: (endpoint, model) => {
        console.log(`
            [SCHEDULER] Added log "${model.name}" to routing with: 
                - GET ${endpoint}
            `.replace(/  /g, "").replace(/\- /g, "\t- "))
    }
}

const READ = 0b1
const CREATE = 0b01
const UPDATE = 0b001
const DELETE = 0b0001
const ALL = READ | CREATE | UPDATE | DELETE

module.exports = routing