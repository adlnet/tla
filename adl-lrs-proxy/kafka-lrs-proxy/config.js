module.exports = {
    proxyTarget: (process.env.PROXY_LRS_ROOT || "http://lrs:8000/xAPI"),
    kafka: {
        brokers: (process.env.KAFKA_BROKER || [
            "kafka-server.usalearning.net:19092",
            "kafka-server.usalearning.net:29092",
            "kafka-server.usalearning.net:39092"
        ].join(",")),
        topics: [
            "test-1",
            "test-2",
            "test-3",
            "learner-xapi",
            "system-xapi"
        ],
        brokers: (process.env.KAFKA_BROKER || config.kafka.brokers.join(",")),
        sasl: {
            mechanism: 'plain', 
            username: (process.env.KAFKA_SASL_USER || "kafka-user"), 
            password: (process.env.KAFKA_SASL_PASS || "kafka-pass")
        },
        consumerGroup: "some-consumer-group",

        // Whether or not to start our consumer at the earliest possible offset,
        // this might cause serious performance issues 
        readAll: false,
    },

    retryMS: 5000,
}