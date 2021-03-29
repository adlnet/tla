const dotenv = require("dotenv").config();

module.exports = {
    
    root: "/resolver",

    cacheExpirationMS: 10000,

    xi: {
        secret: (process.env.XI_SECRET || "some-long-string"),
        endpoint: (process.env.XI_ENDPOINT || "https://tla-dev-acts.usalearning.net/api/v1")
    },

    kafka: {
        config: {
            brokers: (process.env.KAFKA_BROKER || [
                "kafka-server.usalearning.net:19092",
                "kafka-server.usalearning.net:29092",
                "kafka-server.usalearning.net:39092"
            ].join(",")),

            saslUser: (process.env.KAFKA_SASL_USER || "kafka-user"),
            saslPass: (process.env.KAFKA_SASL_PASS || "kafka-pass"),

            consumerGroup: (process.env.KAFKA_CONSUMER_GROUP || "local-resolver"),
            topics: (process.env.KAFKA_CONSUMER_TOPICS || "resolve-pending").split(","),
        },

        // Whether or not to start our consumer at the earliest possible offset,
        // this might cause serious performance issues 
        readAll: false,
    },

    lrs: {
        user: (process.env.LRS_USER || "tom"),
        pass: (process.env.LRS_PASS || "1234"),
        endpoint: (process.env.LRS_ENDPOINT || "https://tla-dev-lrs.usalearning.net/xAPI")
    },
}