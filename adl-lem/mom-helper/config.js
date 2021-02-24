module.exports = {
    
    uriBase: `https://${(process.env.HOSTNAME || "kafka-server.usalearning.net")}/mom`,
    root: "/mom",
    secret: (process.env.API_SECRET || "some-long-secret"),

    kafka: {
        brokers: (process.env.KAFKA_BROKERS || [
            "kafka-server.usalearning.net:19092",
            "kafka-server.usalearning.net:29092",
            "kafka-server.usalearning.net:39092"
        ].join(",")),
        
        saslUser: (process.env.KAFKA_SASL_USER || "kafka-user"),
        saslPass: (process.env.KAFKA_SASL_PASS || "kafka-pass"),
        
        consumerGroup: (process.env.KAFKA_CONSUMER_GROUP || "local-competencies"),
        topics: (process.env.KAFKA_CONSUMER_TOPICS || "learner-xapi").split(","),

    },

    keycloak: {
        "realm": (process.env.KEYCLOAK_REALM || "tla"),
        "auth-server-url": (process.env.KEYCLOAK_ENDPOINT || "https://tla-dev-auth.url.example/auth"),
        "root": (process.env.KEYCLOAK_ROOT || "https://tla-dev-auth.url.example"),
        "ssl-required": "none",
        "resource": (process.env.KEYCLOAK_CLIENT || "default"),
        "public-client": true,
        "confidential-port": 0
    },
    
    retryMS: 5000,

    lrs: {
        user: (process.env.LRS_USER || "tom"),
        pass: (process.env.LRS_PASS || "1234"),
        endpoint: (process.env.LRS_ENDPOINT || "https://tla-dev-lrs.url.example/xAPI")
    },

    endpoints: {
        xi: (process.env.XI_ENDPOINT || "https://tla-dev-acts.usalearning.example"),
    },
    
    retryMS: 5000,
}