const kafkaConsumer = require("simple-kafka-consumer");
const mom = require("tla-mom-proto")
const config = require("../config")

kafkaConsumer.configure({
    brokers: (process.env.KAFKA_BROKER || config.kafka.brokers.join(",")),
    saslUser: (process.env.KAFKA_SASL_USER || config.kafka.sasl.username),
    saslPass: (process.env.KAFKA_SASL_PASS || config.kafka.sasl.password),
    topics: config.kafka.topics,
    consumerGroup: config.kafka.consumerGroup
})

const interop = {

    /**
     * @callback onAssertionCandidate
     * @param {Object} statement MOM-compliant evidentiary statement that should trigger an assertion.
     * entry referenced in the evidentiary statement. 
     */
    /**
     * Monitor xAPI statements on the configured Kafka topic and  
     * @param {onAssertionCandidate} callback Callback carrying the evidentiary 
     * statement and the competency being attributed.
     */
    listen: async(callback) => {

        kafkaConsumer.initConsumer((topic, offset, message) => {

            //reads the message to be a JSON object
            let statement = null
            try {
                statement = JSON.parse(message);
            }
            catch(err) {
                return console.error("[Assertion] Non-xAPI Message:", message);
            }

            let assertionRelevant = false

            // let conformant = mom.conformance.conformant(statement)
            // if (conformant) {
                if (statement.verb.id == mom.verbs.completed.id) {
                    if (statement.result && statement.object.definition)
                        assertionRelevant = (statement.result.success == true && statement.object.definition.type == mom.activityTypes.activity);
                }
                else if (statement.verb.id == mom.verbs.passed.id)
                    assertionRelevant = true;
            // }

            if (assertionRelevant)
                callback(statement);
        })
    }
}

module.exports = interop