const config = require("../config");
const mom = require("tla-mom-proto");
const kafkaConsumer = require("simple-kafka-consumer");
const kafkaProducer = require("simple-kafka-producer");

// Designated IRI for the 'confidence' extension.
const CONFIDENCE = "https://w3id.org/xapi/tla/extensions/confidence";

module.exports = {

    /**
     * Callback to pass back assertions (statements with the "asserted" verb).
     * @callback onAuthorityCallback
     * @param {Object} statement - The assertion statement in xAPI.
     */

    /**
     * Instruct the Kafka adapters to filter and relay assertions in xAPI.
     * @param {onAuthorityCallback} callback - Callback passing any assertions.
     */
    filter(callback) {
        
        kafkaProducer.configure(config.kafka)
        kafkaConsumer.configure(config.kafka)
        
        kafkaProducer.initProducer()
        kafkaConsumer.initConsumer((topic, offset, message) => {
            
            if (topic == "authority-xapi") {

                let statement = null;
                try {
                    statement = JSON.parse(message);
                } catch (err) {
                    console.error("[Kafka] Statement Parsing Error: ", message)
                    return;
                }

                if (statement && statement.verb) {
                    let assertion = statement.verb.id == mom.verbs.asserted.id;

                    // Debugs showing input we need.
                    console.log("Got verb: " + statement.verb.id);
                    console.log("Assertion is " + assertion);
                    
                    if (assertion) {
                        callback(statement);
                    }
                }
            }
        })
    }
}
