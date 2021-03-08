const dotenv = require("dotenv").config();

module.exports = {
    
    root: "/generator",

    cacheExpirationMS: 60000,

    kafka: {
        brokers: (process.env.KAFKA_BROKER || [
            "kafka-server.usalearning.net:19092",
            "kafka-server.usalearning.net:29092",
            "kafka-server.usalearning.net:39092"
        ].join(",")),

        saslUser: (process.env.KAFKA_SASL_USER || "kafka-user"),
        saslPass: (process.env.KAFKA_SASL_PASS || "kafka-pass"),

        consumerGroup: (process.env.KAFKA_CONSUMER_GROUP || "local-assertion-generator"),
        topics: (process.env.KAFKA_CONSUMER_TOPICS || "resolved-xapi").split(","),
    },

    safety: {
        approvedDomains: (process.env.APPROVED_DOMAINS || "https://credentialengine.org,https://credreg.net").split(",")
    },

    lrs: {
        user: (process.env.LRS_USER || "tla-user"),
        pass: (process.env.LRS_PASS || "tla-pass"),
        endpoint: (process.env.LRS_ENDPOINT || "https://tla-dev-lrs.usalearning.net/xAPI/")
    },

    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "tla"),
        "auth-server-url": (process.env.KEYCLOAK_ENDPOINT || "https://tla-dev-auth.usalearning.net/auth"),
        "ssl-required": "none",
        "resource": (process.env.KEYCLOAK_CLIENT || "default"),
        "public-client": true,
        "confidential-port": 0
    },
}
