module.exports = {
    
    root: "/scheduler",
    secret: (process.env.API_SECRET || "some-long-secret"),

    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "tla"),
        "auth-server-url": (process.env.KEYCLOAK_ENDPOINT || "https://tla-dev-auth.usalearning.net/auth"),
        "ssl-required": "none",
        "resource": (process.env.KEYCLOAK_CLIENT || "default"),
        "public-client": true,
        "confidential-port": 0
    },
    
    retryMS: 5000,
    
    kafka: {
        brokers: (process.env.KAFKA_BROKER || [
            "kafka-server.usalearning.net:19092",
            "kafka-server.usalearning.net:29092",
            "kafka-server.usalearning.net:39092"
        ].join(",")),

        saslUser: (process.env.KAFKA_SASL_USER || "kafka-user"),
        saslPass: (process.env.KAFKA_SASL_PASS || "kafka-pass"),

        consumerGroup: (process.env.KAFKA_CONSUMER_GROUP || "local-scheduler"),
        topics: (process.env.KAFKA_CONSUMER_TOPICS || "resolved-xapi").split(","),

        // Whether or not to start our consumer at the earliest possible offset;
        // this might cause serious performance issues.
        readAll: false,
    },

    lrs: {
        user: (process.env.LRS_USER || "default"),
        pass: (process.env.LRS_PASS || "UrrR8uwOCrsKtYPi9c9PI5M1WJXHow"),
        endpoint: (process.env.LRS_ENDPOINT || "https://yet-lrs.usalearning.net/xapi/")
    },
}