const dotenv = require("dotenv").parse();

module.exports = {
    
    root: "/mom",

    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "tla"),
        "auth-server-url": (process.env.KEYCLOAK_ENDPOINT || "https://tla-dev-auth.url.example/auth"),
        "ssl-required": "none",
        "resource": (process.env.KEYCLOAK_CLIENT || "default"),
        "public-client": true,
        "confidential-port": 0
    },
    
    retryMS: 5000,

    lrs: {
        user: (process.env.LRS_USER || "tom"),
        pass: (process.env.LRS_PASS || "1234"),
        endpoint: (process.env.LRS_ENDPOINT || "https://tla-dev-lrs.url.example/xAPI")
    },

    endpoints: {
        xi: (process.env.XI_ENDPOINT || "https://tla-dev-acts.usalearning.example"),
    },
    
    retryMS: 5000,
}