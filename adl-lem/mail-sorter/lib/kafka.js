const mom = require("tla-mom-proto");
const kafkaConsumer = require("simple-kafka-consumer");
const kafkaProducer = require("simple-kafka-producer");

const config = require("../config");
const filters = require("./filters")

module.exports = {

    /**
     * Callback to pass authoritative statements back.
     * @callback onAuthorityCallback
     * @param {Object} statement - The authoritative xAPI statement.
     */

    /**
     * Instruct the Kafka adapters to filter and relay authoritative xAPI.
     * @param {onAuthorityCallback} callback - Callback passing any authoritative statements.
     */
    filter(callback) {

        const produce = (statement, topic) => {
            kafkaProducer.produceMessage(topic, statement);
            callback(statement, topic);
        }

        kafkaProducer.configure(config.kafka);
        kafkaConsumer.configure(config.kafka);
        
        kafkaProducer.initProducer();
        kafkaConsumer.initConsumer((topic, offset, message) => {

            let statement = null;
            try {
                statement = JSON.parse(message);
            } catch (err) {
                return console.error("[Mail] Statement Parsing Error: ", topic, offset, message);
            }

            if (!statement.verb)
                return

            if (filters.isAuthoritative(statement)) 
                produce(statement, config.sortingTopics.authoritative);

            else if (filters.isResolution(statement))
                produce(statement, config.sortingTopics.transactional);

            else if (filters.needsResolution(statement)) 
                produce(statement, config.sortingTopics.resolvePending);

            else if (filters.isRelevant(statement))
                produce(statement, config.sortingTopics.transactional);

            else
                console.log("nothing for:", statement.verb);
        })
    }
}

