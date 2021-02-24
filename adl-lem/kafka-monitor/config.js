const topicDetails = [
    {
        "name": (process.env.KAFKA_XAPI_NOISY || "learner-xapi"),
        "pretty": "Learner xAPI",
        "bootstrap": "primary"
    },
    {
        "name": (process.env.KAFKA_XAPI_PENDING || "resolve-pending"),
        "pretty": "Resolution Needed",
        "bootstrap": "info"
    },
    {
        "name": (process.env.KAFKA_XAPI_TRANSACTIONAL || "resolved-xapi"),
        "pretty": "Transactional xAPI",
        "bootstrap": "success"
    },
    {
        "name": (process.env.KAFKA_XAPI_AUTHORITATIVE || "authority-xapi"),
        "pretty": "Authoritative xAPI",
        "bootstrap": "danger"
    }
]

module.exports = {
    
    /**
     * Root path of the service, so localhost:3000/this-value
     */
    root: "/monitor",

    /**
     * Root path of the service, so localhost:3000/this-value
     */
    websocket: {
        password: (process.env.WS_PASSWORD || "ws-password")
    },

    kafka: {
        brokers: (process.env.KAFKA_BROKERS || [
            "tla-dev-kafka.usalearning.net:19092",
            "tla-dev-kafka.usalearning.net:29092",
            "tla-dev-kafka.usalearning.net:39092"
        ].join(",")),
        
        saslUser: (process.env.KAFKA_SASL_USER || "kafka-user"),
        saslPass: (process.env.KAFKA_SASL_PASS || "kafka-pass"),
        
        consumerGroup: (process.env.KAFKA_CONSUMER_GROUP || "local-monitor"),
        topics: topicDetails.map(details => details.name),
    },

    /** UI-specifics for handling the Kafka topics */
    topicDetails: topicDetails,
}