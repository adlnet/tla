// Entry Point for the LRS ReRoute Service.
//
// This is a NodeJS Express application 
//
const express = require("express");
const proxy = require("express-http-proxy");
const bodyParser = require("body-parser");
const kafkaProducer = require("simple-kafka-producer")

const config = require("./config");

const intercept = require("./lib/intercept");
const helpers = require("./lib/proxy-helpers");

// Configure our Kafka producer
kafkaProducer.configure({
    brokers: config.kafka.brokers,
    saslUser: config.kafka.sasl.username,
    saslPass: config.kafka.sasl.password
})

// Topic we're producing to
const KAFKA_XAPI_TOPIC = (process.env.KAFKA_XAPI_TOPIC || "learner-xapi");

// Set up our proxy using either config or env
//
const PROXY_LRS_ROOT = (process.env.PROXY_LRS_ROOT || config.proxyTarget);
const PROXY_INFER = (process.env.PROXY_INFER || "true");
const CAN_INFER = (PROXY_INFER.toString().toLowerCase() == "true")
const REDIRECT_URL = PROXY_LRS_ROOT.endsWith("/") ? PROXY_LRS_ROOT.substring(0, PROXY_LRS_ROOT.length - 1) : PROXY_LRS_ROOT;

// Create an instance of the express class and declare our port
const PORT = (process.env.PORT || 8085);
const app = express();

// Parse everything as text.  It might be tempting to use a JSON parser here,
// but this actually causes quite a few issues with spec conformance as our
// requests aren't ever guaranteed to be in JSON.  Even if we only specify the 
// application/json content-type, oddly enough there are still issues.
app.use(bodyParser.text({
    type: "*/*"
}));

// Main index page.  Shows the registered services and their most recent statuses.
app.use("/", proxy(REDIRECT_URL, {

    // This was originally called "intercept", but the proxy library changed.  It's going
    // to let us check the proxied server's response to the request and this will enable
    // us to see if a statement was sent to the LRS and accepted.
    userResDecorator: function (proxyRes, proxyResData, req, res) {

        // The actual process of parsing the response is a bit involved, so we're doing this
        // with a promise chain to make sure the response from our server gets back asap.  
        intercept(req, proxyRes, proxyResData)
            .then(promisePayload => {

                // This could've been a request we don't care about, in which case there 
                // isn't anything to do here at all.  Skip these.
                if (promisePayload == undefined || promisePayload.ids == undefined)
                    return;

                // This is the problematic case: we weren't able to definitely determine the statements from
                // the request/response interaction.  This can happen because of a weird mismatch or from an
                // issue with our hand-rolled multipart parser.
                if (promisePayload.statements == undefined) {

                    // Regardless, notify the log that we're doing this
                    console.log("[Proxy]: Manually retrieving statements for:", promisePayload.ids.map(id => "\n\t-" + id))
                    
                    // The payload should always include the IDs for our statements though, so we'll use these
                    // to determine which statements need to be retrieved from our LRS.
                    promisePayload.ids.forEach(id => {
                        helpers.statementFromLRS(REDIRECT_URL, req, id, statement => publishStatement(statement))
                    })
                }
                
                // If nothing weird happened, then we should already have the statements back as-inferred
                // from our original LRS request.  We can just publish them to Kafka without needing another request.
                else {
                    promisePayload.statements.forEach(statement => publishStatement(statement));
                }

            })
            .catch(error => console.log("[Proxy Error]: Statement error:\n", error))

        return proxyResData;
    }
}));

// Set up our Kafka stuff.  This is largely boilerplate / streamlined so we don't need ti here.
kafkaProducer.initProducer();
kafkaProducer.setCallback((topic, offset, statement) => {
    console.log(`[Kafka] Produced statement ${statement.id}`);
})

/**
 * Publish the statement to the configured Kafka topic.
 * @param {Object} statement - xAPI Statement we're producing to Kafka. 
 */
function publishStatement(statement) {

    kafkaProducer.produceMessage(KAFKA_XAPI_TOPIC, JSON.stringify(statement))
}

// Then start the server.
app.listen(PORT, "0.0.0.0", function(){

    console.log("\n[Proxy]: LRS Wrapper Service listening on port %s", PORT);
    console.log("[Proxy]: Relaying traffic to %s", REDIRECT_URL);

    if (CAN_INFER == true)
        console.log("[Proxy]: INFERENCE MODE: Proxy will infer statements instead of polling LRS.")
    else
        console.log("[Proxy]: LITERAL MODE: Proxy will poll statements from the LRS.")
});
