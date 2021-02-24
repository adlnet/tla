const cors = require("cors")
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const keycloak = require("simple-keycloak-adapter")
const sqliterRoutes = require("sqliter-routing")

const config = require("./config");

const models = require("./lib/models");
const me = require("./lib/me");
const explain = require("./lib/explain");

const knownUsers = {}

const ensureUserExists = async(id) => {
    let userRecords = await models.person.select("*", {
        where: [`uuid=${id}`],
        limit: 1
    })

    if (userRecords.length == 0) 
        await createUserAsStudent(id);
    
    knownUsers[id] = true
}

const createUserAsStudent = async(id) => {
    return await models.person.insert({ 
        uuid: id,
        uxRoles: ["Learner"],
        learnerState: "initialized"
    })
}

const routing = {
    /**
     * @param {express.Express} app Express Application
     */
    init: async(app, config) => {

        let root = config.root
        let apiRoot = path.join(root, "/api").replace(/\\/g, "/")
        let docRoot = path.join(root, "/docs").replace(/\\/g, "/")

        app.use(cors())
        app.use(bodyParser.urlencoded({extended: false}))
        app.use(bodyParser.json())
        app.set("view engine", "ejs");
        app.set("views", path.join(__dirname, "/views"))
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
            res.locals.models = models.objects
            res.locals.root = root
            next();
        })

        app.get("*", async(req, res, next) => {

            let queried = req.query.user
            if (queried)
                await ensureUserExists(queried)
            
            let logged = res.locals.user ? res.locals.user.id : undefined
            if (logged)
                await ensureUserExists(logged)
            
            let uuid = req.query.uuid
            if (uuid)
                await ensureUserExists(uuid)

            next();
        });

        routing.modelAPI(app, apiRoot, models.person, routing.masks.ALL);
        routing.modelAPI(app, apiRoot, models.rolePersona, routing.masks.ALL);
        routing.modelAPI(app, apiRoot, models.interestGroup, routing.masks.ALL);

        routing.modelAPI(app, apiRoot, models.roleMembers, routing.masks.ALL);
        routing.modelAPI(app, apiRoot, models.interestGroupMembers, routing.masks.ALL);

        app.get(docRoot + "/:model", function(req, res, next) {
            let model = models[req.params.model]
            res.render("doc-page", {
                model: model,
                title: model.prettyName
            });
        });

        app.get(docRoot, (req, res, next) => {
            res.redirect(docRoot + "/person")
        })
        
        app.get(root + "/view",  async(req, res, next) => {
            res.render("view");
        });

        app.get(root + "/me",  async(req, res, next) => {
            let cb = await routing.me();
            cb(req, res, next);
        });

        app.get(root + "/me/explain",  async(req, res, next) => {
            let cb = await routing.explain();
            cb(req, res, next);
        });

        app.get(root, function(req, res, next) {
            res.render("index", {
                root: root
            });
        })

    },

    /**
     * @param {express.Express} app Express Application
     */
    modelAPI: (app, root, model, mask, ...middleware) => {

        let endpoint = path.join(root, model.name).replace(/\\/g, "/")
        
        if (mask & routing.masks.READ)
            app.get(endpoint, ...middleware, sqliterRoutes.read(model));
        if (mask & routing.masks.CREATE)
            app.post(endpoint + "/create", ...middleware, sqliterRoutes.create(model));
        if (mask & routing.masks.UPDATE)
            app.post(endpoint + "/update", ...middleware, sqliterRoutes.update(model));
        if (mask & routing.masks.DELETE)
            app.post(endpoint + "/delete", ...middleware, sqliterRoutes.delete(model));

        routing.announceModel(endpoint, model, mask);

        if (model.logModel != undefined) {

            let logEndpoint = endpoint + "/log/:record"
            app.get(logEndpoint, ...middleware, async(req, res, next) => {
            
                let args = {
                    limit: req.query.limit,
                    offset: req.query.offset,
                    order: req.query.offset,
                    where: []
                }

                if (req.params.record)
                    args.where.push(`record=${req.params.record}`)

                let records = await model.select(model.db, "*", args)
                res.json(records)

            });
            
            routing.announceLog(logEndpoint, model.logModel)
        }
    },

    announceModel: (endpoint, model, mask) => {
        console.log(`
            [Profile] Added model "${model.name}" to routing with: 
                - GET ${endpoint}
                - POST ${endpoint}/create
                - POST ${endpoint}/update
                - POST ${endpoint}/delete
            `.replace(/  /g, "").replace(/\- /g, "\t- "))
    },

    announceLog: (endpoint, model) => {
        console.log(`
            [Profile] Added log "${model.name}" to routing with: 
                - GET ${endpoint}
            `.replace(/  /g, "").replace(/\- /g, "\t- "))
    },

    protect: () => {
        return (req, res, next) => {
            if (req.query.secret == config.secret && !req.url.endsWith("/me"))
                next()
            else
                keycloak.protect()(req, res, next);
        }
    },

    me: async() => {
        return async(req, res, next) => {
            let user = null;

            if (res.locals.user && res.locals.user.id)
                user = res.locals.user.id
            else if (req.query.user)
                user = req.query.user
            
            if (!user) {
                res.status(400).send("User not provided.  Use `?secret={secret}&user={keycloak-id}` when using secret key.");
                return;
            }
            
            userRecords = await models.person.select("*", {
                where: [`uuid=${user}`],
                limit: 1
            })

            let record = userRecords[0];
            let extra = await me(user);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({...record, ...extra}, null, 3));
        }
    },

    explain: async() => {
        return async(req, res, next) => {
            let user = null;

            if (res.locals.user && res.locals.user.id)
                user = res.locals.user.id
            else if (req.query.user)
                user = req.query.user
            
            if (!user) {
                res.status(400).send("User not provided.  Use `?secret={secret}&user={keycloak-id}` when using secret key.");
                return;
            }

            let extra = await explain(user);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(extra, null, 3));
        }
    },

    masks: {
        READ: 0b1,
        CREATE: 0b01,
        UPDATE: 0b001,
        DELETE: 0b0001,
        ALL: 0b1111
    }
}

module.exports = routing