module.exports = {
    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "realm"),
        "auth-server-url": (process.env.KEYCLOAK_ENDPOINT || "https://keycloak_server/auth"),
        "ssl-required": "none",
        "resource": (process.env.KEYCLOAK_CLIENT || "default"),
        "public-client": true,
        "confidential-port": 0
    },

    api: {
        secret: (process.env.API_SECRET || "some-secret"),
        header: "X-TLA-POST-KEY"
    }
}