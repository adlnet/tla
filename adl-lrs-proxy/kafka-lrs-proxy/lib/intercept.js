const multipart = require("./multipart");
const helpers = require("./proxy-helpers");
const config = require("../config");

/**
 * 
 * @param {Request} req - Request we're scanning
 * @param {Response} proxyRes - Response from our proxied server
 * @param {String} req - Response data from our proxied server
 * @return {Promise<{ids:String[], statements:Object[]}>} - A promise containing the array of intercepted statements
 */
function intercept(req, proxyRes, proxyResData, cb) {

    return new Promise((resolve, reject) => {

        let promisePayload = {};

        // Check what the response code was from our LRS
        let status = proxyRes.statusCode;

        // Check what we sent there
        let payload = req.body;

        // Only check requests made as POST / PUT where something is sending a statement
        // into this LRS.  Per the spec, POST returns 200 and PUT returns 204
        if (req.method == "POST" && status == 200) {

            // Only POST will have anything interesting, so just check these here
            let ctype = req.get("Content-Type");
            let response = proxyResData.toString('utf8');

            // Accordingly, we only care about requests aimed at the LRS's statement resource
            if (req.url.indexOf("/statements") >= 0) {

                // The response for a successful request should have been an array of IDs
                promisePayload.ids = JSON.parse(response);
                let statementPayload = undefined;

                // If this is JSON, then things are straightforward
                if (ctype.toLowerCase().startsWith("application/json")) {
                    statementPayload = JSON.parse(payload);
                }

                // If it's a multipart, then life gets a little complicated.  We can clean
                // this up a bit with regular expressions, but, for the sake of not contaminating
                // this scope with those comments, those functions are in the /lib/multipart file
                else if (ctype.startsWith("multipart")) {

                    // Get each of the parts here, we're looking specifically for one with the 
                    // application/json type.  This is required by xAPI spec, but not by the RFC1341
                    // spec governing multipart requests, so this is a little sticky.
                    let boundary = multipart.parseBoundary(req);
                    let parts = multipart.parseParts(boundary, payload);
                    for (let part of parts) {
                        if (part.contentType == "application/json") {
                            statementPayload = JSON.parse(part.body);
                            break;
                        }
                    }
                } 
                
                // Report that we got a weird Content-Type and didn't do anything with it.
                else {
                    console.log("[Proxy]:", "Unexpected Content-Type:", ctype);
                }

                // Once we're done processing those, we can clean those results up and generate
                // our statement array.
                if (statementPayload != undefined) {

                    // If we only got a single statement, we'll still need it as an array
                    // to clean up the process of aligning it with the IDs returned
                    if (Array.isArray(statementPayload) == false)
                        promisePayload.statements = [statementPayload]
                    else
                        promisePayload.statements = statementPayload;

                    // Make sure these ended up being the same size...
                    if (promisePayload.ids.length == promisePayload.statements.length) {
                        for (let k=0; k<promisePayload.statements.length; k++) {
                            
                            let id = promisePayload.ids[k];
                            let statement = promisePayload.statements[k];

                            statement.id = id;
                            statement.version = (statement.version || "1.0.0");
    
                            statement.stored = (statement.stored || new Date().toISOString());
                            statement.timestamp = (statement.timestamp || new Date().toISOString());
    
                            statement.authority = (statement.authority || {
                                "name": "ADL Kafka Proxy",
                                "account": {
                                    "name": "Proxy",
                                    "homePage": config.proxyTarget,
                                },
                                "objectType": "Agent"
                            });
                        }
                    } else {
                        console.log("[Proxy Surprise]: ID ARRAY DOES NOT MATCH STATEMENT ARRAY");
                        console.log("[Proxy Surprise]: FORCING MANUAL RETRIEVAL");

                    }

                } else {
                    console.log(`[Proxy Surprise]:\n\t${ctype}\n\t${promisePayload.ids}\n\t${payload}`);
                }
            }
        }

        // Alternate request syntax
        else if (req.method == "POST" && status == 204 && req.query.method == "PUT") {

            // Check if this was an alternate request syntax
            if (req.query.method != undefined)
            {
                console.log("ALTERNATE REQUEST SYNTAX:")
                console.log("DATA:", proxyResData)
                console.log(req.query.content)

                return proxyResData;
            }
        }

        // The PUT is pretty simple as there's only one statement and nothing weird
        else if (req.method == "PUT" && status == 200) {

            let id = req.query.statementId
            let statement = JSON.parse(payload)

            statement.id = id;
            statement.version = (statement.version || "1.0.0");

            statement.stored = (statement.stored || new Date().toISOString());
            statement.timestamp = (statement.timestamp || new Date().toISOString());

            promisePayload.ids = [id]
            promisePayload.statements = [statement]
        }

        resolve(promisePayload);
    });
}

module.exports = intercept;