module.exports = {
    
    root: "/competencies",
    secret: (process.env.API_SECRET || "some-long-secret"),

    kafka: {
        brokers: (process.env.KAFKA_BROKER || [
            "kafka-server.usalearning.net:19092",
            "kafka-server.usalearning.net:29092",
            "kafka-server.usalearning.net:39092"
        ].join(",")),
        
        saslUser: (process.env.KAFKA_SASL_USER || "kafka-user"),
        saslPass: (process.env.KAFKA_SASL_PASS || "kafka-pass"),
        
        consumerGroup: (process.env.KAFKA_CONSUMER_GROUP || "local-competencies"),
        topics: (process.env.KAFKA_CONSUMER_TOPICS || "authority-xapi").split(","),

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
