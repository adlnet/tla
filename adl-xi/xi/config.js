module.exports = {

    secret: (process.env.API_SECRET || "some-long-secret"),

    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "tla"),
        "auth-server-url": (process.env.KEYCLOAK_URL || "http://localhost:8080/auth"),
        "ssl-required": "none",
        "resource": (process.env.KEYCLOAK_CLIENT || "static-content-viewer"),
        "public-client": true,
        "confidential-port": 0
    },

    mongo: {
        host: (process.env.DB_CONTAINER || "mongo"),
        db: (process.env.DB_NAME || "xi"),
        collection: (process.env.COLLECTION_NAME || "records"),
        
        /**
         * Require exact matching with the resolution queries for 
         * content and competency URIs?
         * 
         * If FALSE, string subsets will be accepted.
         * if TRUE, only exact equality will work.
         */
        exactMatching: (process.env.EXACT_RESOLUTION_MATCH || false),
    },

    HOSTNAME: process.env.HOSTNAME,
    ROOT: (process.env.ROOT) ? `/${process.env.ROOT}` : "/xi" ,
    APP_PORT: (process.env.APP_PORT || 5000),
    siteName: (process.env.SITE_NAME || "Experience Index Lite"),
    siteColor: (process.env.SITE_COLOR || ""),
}
