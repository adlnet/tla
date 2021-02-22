module.exports = {

    protected: [
        "/content/*", "/content"
    ],
    
    // Only use HTTPS for the Keycloak redirect_uri if we're on AWS / Docker.  
    protocol: process.env.KEYCLOAK_URL ? "https" : "http",

    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "tla"),
        "auth-server-url": (process.env.KEYCLOAK_URL || "https://tla-dev-auth.usalearning.net/auth"),
        "ssl-required": "none",
        "resource": (process.env.KEYCLOAK_CLIENT || "default"),
        "public-client": true,
        "confidential-port": 0
    },

    exts: [
        ".html",
        ".htm"
    ]
}
