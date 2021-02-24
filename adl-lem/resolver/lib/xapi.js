const axios = require("axios").default
const btoa = require("btoa")
const config = require("../config")

const auth = btoa(`${config.lrs.user}:${config.lrs.pass}`)

module.exports = {

    validStatement: statement => {
        return !(!statement.verb || !statement.verb.id 
            || !statement.actor || !statement.actor.account 
            || !statement.object) 
    },

    asDerivation: statement => {

        let source = {
            id: statement.id,
            authority: statement.authority
        }

        let summary = {
            verb: statement.verb.id,
            object: statement.object.id,
            source: source
        }

        statement.context = (statement.context || {})
        statement.context.extensions = (statement.context.extensions || {})
        statement.context.extensions["tla:source"] = source

        let history = statement.context.extensions["tla:history"]
        if (history == undefined)
            history = []
        
        statement.context.extensions["tla:history"] = [...history, summary]
        
        // Clean the readonly fields to send properly
        delete statement.id
        delete statement.authority
        delete statement.timestamp
        delete statement.stored
        delete statement.version

        return statement
    },

    sendStatements: async(statements) => {
        try {
            let resp = await axios.post(config.lrs.endpoint + "statements", statements, {
                headers: {
                    "X-Experience-API-Version": "1.0.3",
                    "Authorization": `Basic ${auth}`,
                    "Content-Type": "application/json"
                }
            })

            return resp.data
        } 

        catch (error) {
            if (error.response) 
                console.error("RESPONSE ERROR:", error.response.status);
              else if (error.request)
                console.error("REQUEST ERROR:", error.request);
              else 
                console.error("SETUP ERROR:", error.message);
              
            return null
        }        
    } 
}