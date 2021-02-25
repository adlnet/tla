/****
 *  ADL Example Experience Index
 * 
 *  This App stores Experience/Course metadata and via UI provides the ability to assign competency. 
 *  
 *  Course Schema: https://schema.org/Course
 *  
 ****/
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const ejs = require('ejs');
const cors = require('cors');
const keycloakAdapter = require("simple-keycloak-adapter");

const config = require("./config");
const mongo = require("./util/mongo");
const app = express();

app.use(config.ROOT, express.static(path.join(__dirname, './frontend/public')));
app.set('views', path.join(__dirname, './frontend/views'));
app.set('view engine', 'ejs');

app.use(keycloakAdapter.init(config.keycloak, config.ROOT + "/logout"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //to recieve bootstrap formdata
app.use("*", function (req, res, next) {
    if (req.query.secret === config.secret)
        next();
    else
        keycloakAdapter.protect({})(req, res, next);
});


/***
 * Frontend Routes
***/
app.all("/", function (req, res, next) {
    res.redirect(config.ROOT);
});

//CSV learner data import UI
app.get(config.ROOT, async function (req, res, next) {
    let username = (res.locals.user.name) ? res.locals.user.name : "user";
    res.render('pages/main', {
        title: config.siteName,
        color: config.siteColor,
        customPath: config.ROOT,
        hostname: config.HOSTNAME,
        username: username
    });
});

app.get(config.ROOT + "/about", async function (req, res, next) {
    let username = (res.locals.user.name) ? res.locals.user.name : "user";
    res.render('pages/about', {
        title: config.siteName,
        color: config.siteColor,
        customPath: config.ROOT,
        hostname: config.HOSTNAME,
        username: username
    });
});

app.get(config.ROOT + "/courses", async function (req, res, next) {
    let username = (res.locals.user.name) ? res.locals.user.name : "user";
    res.render('pages/courses', {
        title: config.siteName,
        color: config.siteColor,
        customPath: config.ROOT,
        hostname: config.HOSTNAME,
        username: username
    });
});


/***
 * Service API's
***/

//recieves JSON 
app.post(config.ROOT + "/api/v1/experiences", async function (req, res, next) {
    let data = req.body;
    console.log(data);
    let results = await mongo.post([data], false).catch(
        err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
    res.status(200).json(results);
});

app.put(config.ROOT + "/api/v1/experiences", async function (req, res, next) {
    let results = await mongo.put(req.body["_id"], req.body);

    console.log(results);

    res.json(results);
});

app.get(config.ROOT + "/api/v1/experiences", async function (req, res, next) {
    let options = {
        "limit": (Number(req.query.limit) || 1000),
        "skip": (Number(req.query.offset) || 0),
        "sort": "_id"
    }

    let content = (req.query.url || req.query.contentUrl || req.query.contentURL || undefined);
    let competency = (req.query.competency || req.query.educationalAlignment || undefined);

    let results = await mongo.get(options, competency, content).catch(
        err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });

    for (let result of results) {
        result.handle = `https://${config.HOSTNAME}${config.ROOT}/api/v1/experiences/${result._id}`
    }

    res.json(results);
});

app.get(config.ROOT + "/api/v1/experiences/:id", async function (req, res, next) {

    let id = req.params.id
    let result = await mongo.getUnique(id).catch(
        err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
        
    result.handle = `https://${config.HOSTNAME}${config.ROOT}/api/v1/experiences/${result._id}`

    res.json(result);
});

app.delete(config.ROOT + "/api/v1/experiences/:id", async function (req, res, next) {

    let id = req.params["id"];
    let results = await mongo.delete(id);
    res.json(results);
});


/***
 * Start server
 ***/
(async () => {

    await mongo.init();

    app.listen(config.APP_PORT, function () {
        console.log(`[HTTP] MongoDB Experience Index service started on port ${config.APP_PORT}. AND url IS ${config.ROOT}`);
    });

})()