module.exports = {

    protected: [
        "/video/*", "/video",
        "/pdf/*", "/pdf",
        "/sjt/*", "/sjt",
        "/"
    ],
    
    // Only use HTTPS for the Keycloak redirect_uri if we're on AWS / Docker.  
    protocol: process.env.KEYCLOAK_URL ? "https" : "http",

    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "tla"),
        "auth-server-url": (process.env.KEYCLOAK_URL || "https://tla-dev-auth.usalearning.net/auth"),
        "ssl-required": "all",
        "resource": (process.env.KEYCLOAK_CLIENT || "default"),
        "public-client": true,
        "confidential-port": 0
    },

    publicLRS: {
        user: "tom",
        pass: "1234",
        endpoint: "https://lrs.adlnet.gov/xapi/"
    },

    tlaLRS: {
        user: (process.env.LRS_USER || "tla-dev"),
        pass: (process.env.LRS_PASS || "tla-forever"),
        endpoint: (process.env.LRS_ENDPOINT || "https://tla-dev-lrs.usalearning.net/xAPI/")
    },

    exts: [
        ".html",
        ".htm"
    ]
}
