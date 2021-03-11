// Entry Point for the LRS ReRoute Service.
//
// This is a NodeJS Express application 
//
const express = require("express");
const axios = require("axios").default;
const mom = require("tla-mom-proto")
const APP_PORT = (process.env.APP_PORT || 3000);

const config = require("./config");
const kafka = require("./lib/kafka");
const routes = require("./lib/routes");
const factory = require("./lib/factory");
const mapping = require("./lib/mapping");
const xapi = require("./lib/xapi");

const app = express();

const assertionVerbs = [
    mom.verbs.completed.id,
    mom.verbs.passed.id
]

const relevantForAssertions = (statement) => {
    if (!statement.verb)
        return false
    else
        return assertionVerbs.includes(statement.verb.id)
}

const main = async() => {

    // The Kafka consumer is listening for statements on the `resolved-xapi` topic.  These
    // statements will be using Experience Index entries as their `object.id` value, ensuring
    // that we can infer competency alignments.
    //
    kafka.listen(async(evidentiaryStatement) => {

        let relevant = relevantForAssertions(evidentiaryStatement)
        if (relevant == false)
            return
        
        console.log(`[Assertions] Processing relevant statement: ${evidentiaryStatement.id}`);
    
        let alignments = await mapping.getStatementAlignments(evidentiaryStatement)
        if (alignments) {

            console.log(` ✔️ Statement has ${alignments.length} alignments ...`);

            // Filter our alignments based on whether or not they are from allowed domains.
            let allowedAlignments = await mapping.getAllowedAlignments(alignments);
            let definitionPromises = allowedAlignments.map(alignment => axios.get(alignment.competency));
            let definitionResponses = await Promise.all(definitionPromises);
            let competencyDefinitions = definitionResponses.map(res => res.data);

            // Build an assertion statement for each alignment we have and use the evidentiary statement
            // to build out the actor and evidentiary MOM properties for an Assertion
            //
            let assertions = [];

            for (let k=0; k<allowedAlignments.length; k++) {
                let alignment = allowedAlignments[k];
                let definition = competencyDefinitions[k];

                let assertion = factory.buildAssertion(evidentiaryStatement, alignment, definition);
                assertions.push(assertion)
            }

            // We may have used some problematic competency definitions here, in which case the assertion
            // factory should have returned a null value.  
            //
            let validAssertions = assertions.filter(assertion => assertion != null)
            if (validAssertions.length > 0) {
                let lrsResponse = await xapi.sendStatements(validAssertions)
                let count = validAssertions.length
                console.log(` ✔️ Asserted ${count} competenc${count == 1 ? "y" : "ies"} from ${evidentiaryStatement.id}:`)
                console.log(" 📚 " + validAssertions.map(statement => statement.object.id).join("\n 📚 "))
            }

            // We might've gotten some bad alignments, so let's go ahead and print those here
            let badIndices = assertions.map((assertion, index) => assertion == null ? index : null).filter(index => index != null)
            if (badIndices.length > 0) {
                console.error(` 🔥 [Error] Bad Alignments: `)
                for (let badIndex of badIndices)
                    console.error("   ❌ ", alignments[badIndex].competency)
            }
        }

        else {
            console.log(" 👻 no alignments found.")
        }
    })

    routes.init(app, APP_PORT, () => {
        console.log(`[Assertions] HTTP check is listening on port ${APP_PORT}`)
    })
}   

main()