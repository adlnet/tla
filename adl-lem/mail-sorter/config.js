module.exports = {
    
    root: "/mail",
    secret: (process.env.API_SECRET || "some-long-secret"),

    xi: {
        endpoint: (process.env.XI_ENDPOINT || "https://tla-dev-acts.usalearning.net/")
    },
    
    kafka: {
        brokers: (process.env.KAFKA_BROKER || [
            "kafka-server.usalearning.net:19092",
            "kafka-server.usalearning.net:29092",
            "kafka-server.usalearning.net:39092"
        ].join(",")),
        
        saslUser: (process.env.KAFKA_SASL_USER || "kafka-user"),
        saslPass: (process.env.KAFKA_SASL_PASS || "kafka-pass"),
        
        consumerGroup: (process.env.KAFKA_CONSUMER_GROUP || "mail-sorting"),
        topics: (process.env.KAFKA_CONSUMER_TOPICS || "learner-xapi").split(","),
    },

    sortingTopics: {
        resolvePending: (process.env.KAFKA_XAPI_PENDING || "resolve-pending"),
        transactional: (process.env.KAFKA_XAPI_TRANSACTIONAL || "resolved-xapi"),
        authoritative: (process.env.KAFKA_XAPI_AUTHORITATIVE || "authority-xapi"),
    },

    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "tla"),
        "auth-server-url": (process.env.KEYCLOAK_ENDPOINT || "https://tla-dev-auth.usalearning.net/auth"),
        "ssl-required": "none",
        "resource": (process.env.KEYCLOAK_CLIENT || "default"),
        "public-client": true,
        "confidential-port": 0
    },
    
    retryMS: 5000,
}