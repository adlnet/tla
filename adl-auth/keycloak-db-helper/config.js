module.exports = {
    
    root: "/helper",
    secret: (process.env.API_SECRET || "some-long-secret"),

    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "tla"),
        "auth-server-url": (process.env.KEYCLOAK_ENDPOINT || "https://tla-dev-auth.usalearning.net/auth"),
        "ssl-required": "none",
        "resource": (process.env.KEYCLOAK_CLIENT || "default"),
        "public-client": true,
        "confidential-port": 0
    },

    pg: {
        db: (process.env.POSTGRES_DB || "pg_keycloak_db"),
        user: (process.env.POSTGRES_USER || "pg_user"),
        pass: (process.env.POSTGRES_PASSWORD || "pg_password"),
        host: (process.env.POSTGRES_ENDPOINT || "docker_postgres"),
        port: 5432,
    },

    cacheMS: 5000,
}