/*
    This is the KeyCloak config page.
*/

// const session = require('express-session');
// const Keycloak = require('keycloak-connect')

// const keyCloakConfig = {
//     realm: process.env.KEYCLOAK_REALM,
//     'bearer-only': true,
//     'auth-server-url': process.env.KEYCLOAK_URL,
//     resource: process.env.KEYCLOAK_CLIENT,
//     'confidential-port': 0,
// };

// let keycloak;

// module.exports.initKeycloak = () => {
//     if (keycloak) {
//         console.log('Returning existing Keycloak instance.');
//         return keycloak;
//     }

//     console.log('Initializing Keycloak.');
//     const memoryStore = new sessionStorage.MemoryStore();
//     keycloak = new Keycloak({
//         store: memoryStore,
//         secret: process.env.KEYCLOAK_SECRET,
//         resave: false,
//         saveUninitialized: true,
//     }, keyCloakConfig);
//     return keycloak;
// }

/* */

module.exports = {
    
    port: (process.env.PORT || 3000),
    secret: (process.env.API_SECRET || "some-long-secret"),

    protected: [
        "/", "/visualizer/*",
        "/visualizer", "/test"
    ],

    protocol: process.env.KEYCLOAK_URL ? "https" : "http",

    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "tla"),
        "auth-server-url": (process.env.KEYCLOAK_URL || "https://tla-dev-auth.usalearning.net/auth"),
        "ssl-required": "all",
        "resource": (process.env.KEYCLOAK_CLIENT || "default"),
        "public-client": true,
        "confidential-port": 0
    },

    exts: [
        ".html",
        ".htm"
    ]
}