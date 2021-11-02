const kafka = require("simple-kafka-producer");
const helpers = require("./helpers");
const config = require("../config");
const uuid = require("uuid");

const kafkaInterop = {

    init: () => {
        kafka.configure(config.kafka)
        kafka.initProducer();
    },

    handleArray: (statementArray, dryRun = false) => {

        let ids = [];

        for (let statement of statementArray) {
            ids.push(statement.id);
            if (!dryRun)
                kafkaInterop.publishStatement(statement);
        }

        return ids;
    },

    handleStatement: (statement, dryRun = false) => {

        // Check for things that need to be set by the LRS.
        statement.id = statement.id || uuid.v4();
        statement.authority = statement.authority || statement.actor; // Default authority as self.
        statement.stored = statement.stored || helpers.getCurrentISOTime();
        statement.timestamp = statement.timestamp || helpers.getCurrentISOTime();

        if (!dryRun)
            kafkaInterop.publishStatement(statement);
        
        return [statement.id];
    },

    handlePayload: (payload, dryRun = false) => {
        if (Array.isArray(payload))
            return kafkaInterop.handleArray(payload, dryRun);
        else
            return kafkaInterop.handleStatement(payload, dryRun);
    },

    publishStatement: (statement) => {
        kafka.produceMessage(config.kafka.topic, statement);
    }
}

module.exports = kafkaInterop;