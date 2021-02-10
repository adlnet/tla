module.exports = {
    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "realm"),
        "auth-server-url": (process.env.KEYCLOAK_URL || "https://keycloak_server/auth"),
        "ssl-required": "none",
        "resource": "realm-resource",
        "public-client": true,
        "confidential-port": 0
    }
}