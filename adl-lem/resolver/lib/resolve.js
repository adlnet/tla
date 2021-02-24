const axios = require("axios").default
const config = require("../config")
const cache = require("./cache")
const xi = require("./xi")

const resolve = {

    // buildEndpoint: contentURI => {
    //     return `${config.xi.endpoint}/learningexperience?content=${encodeURIComponent(contentURI)}`
    // },

    relevantExperiences: async(statement) => {

        // let contentURI = statement.object.id

        // if (cache.isCached(contentURI)) 
        //     return cache.get(contentURI)
        
        // let endpoint = resolve.buildEndpoint(contentURI)

        // try {
        //     let resp = await axios.get(endpoint)
            
        //     let entries = !!resp.data && Array.isArray(resp.data.rows) ? resp.data.rows.map(row => row.handle) : undefined
        //     if (entries != undefined)
        //         cache.set(contentURI, entries)

        //     return entries
        // } 
        // catch (error) {
        //     console.error(`[Resolver] Error resolving experiences for: ${contentURI}\n`, error)
        //     return undefined
        // }
        let contentURI = statement.object.id

        let entries = await xi.getExperiences();
        if (entries) 
            return entries.filter(entry => Array.isArray(entry.contentlist) && entry.contentlist.includes(contentURI))
        else
            []
    }
}

module.exports = resolve