module.exports = {
    
    uriBase: `https://${(process.env.HOSTNAME || "kafka-server.usalearning.net")}/profile`,
    root: "/profile",
    secret: (process.env.API_SECRET || "some-long-secret"),

    endpoints: {
        goals: (process.env.ENDPOINT_GOALS || "http://goals:3000/goals"),
        competencies: (process.env.ENDPOINT_COMPETENCIES || "http://competencies:3000/competencies"),
        scheduler: (process.env.ENDPOINT_SCHEDULER || "http://scheduler:3000/scheduler"),
    },

    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "tla"),
        "auth-server-url": (process.env.KEYCLOAK_ENDPOINT || "https://tla-dev-auth.usalearning.net/auth"),
        "ssl-required": "none",
        "resource": (process.env.KEYCLOAK_CLIENT || "default"),
        "public-client": true,
        "confidential-port": 0
    },

    lrsPool: [
        {
            user: (process.env.LRS_USER || "tom"),
            pass: (process.env.LRS_PASS || "1234"),
            endpoint: (process.env.LRS_ENDPOINT || "https://tla-dev-lrs.usalearning.net/xAPI")
        }
    ],
    
    retryMS: 5000,
}