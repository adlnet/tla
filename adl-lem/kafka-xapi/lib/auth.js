
const config = require("../config");
const btoa = require("btoa");
const keycloakAdapter = require("simple-keycloak-adapter");

const base64Credentials = btoa(`${config.auth.username}:${config.auth.password}`);
const expectedAuth = [`Basic ${base64Credentials}`];
const expectedVersions = ["1.0.0", "1.0.1", "1.0.2", "1.0.3", "2.0.0"];
const expectedContentType = ["application/json"];

const auth = {

    /**
     * Initialize the Keycloak portion of the auth setup.
     * @param {Express.Application} app 
     * @returns 
     */
    init: (app) => {
        if (config.useKeycloak)
            app.use(keycloakAdapter.init(config.keycloak, config.root + "/logout"));
    },

    /**
     * Checks a single header against a set of possible values.
     * @param {*} request Request object, just needs to have a .headers map.
     * @param {*} header Name of the header to compare.
     * @param {*} expectedValues Array of acceptable values.
     * @returns 
     */
    checkHeader: (request, header, expectedValues) => expectedValues.includes(request.headers[header]),

    /**
     * Check that the request has valid LRS headers.
     * @param {*} request Request object, just needs to have a .headers map.
     * @returns {Boolean} Whether or not all headers were valid with the configured Basic Auth values and LRS headers.
     */
    checkXAPIHeaders: (request) => {
        let validVersion = auth.checkHeader(request, "x-experience-api-version", expectedVersions);
        let validType = auth.checkHeader(request, "content-type", expectedContentType);
        let validAuth = auth.checkHeader(request, "authorization", expectedAuth);

        return validVersion && validType && validAuth;
    },

    /**
     * Middleware for handling basic auth for the LRS.
     */
    basicAuth: (req, res, next) => {

        let validHeaders = auth.checkXAPIHeaders(req);
        if (validHeaders)
            next()
        else
            res.status(400).send("Bad Request");
    },

    /**
     * Middleware for handling auth with Keycloak.
     */
    keycloakAuth: (req, res, next) =>
        config.useKeycloak
            ? keycloakAdapter.protect()(req, res, next)
            : next()
}

module.exports = auth;