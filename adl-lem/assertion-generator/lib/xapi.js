const axios = require("axios").default
const btoa = require("btoa")
const config = require("../config")

const auth = btoa(`${config.lrs.user}:${config.lrs.pass}`)

const xapi = {
    sendStatements: async(payload) => {
        try {
            let resp = await axios.post(config.lrs.endpoint + "statements", payload, {
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
    },
}

module.exports = xapi