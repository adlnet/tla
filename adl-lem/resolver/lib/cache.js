const config = require("../config")
const cache = {}

/**
 * Simple caching system to reduce request load.
 */
module.exports = {

    /**
     * Check if a given key is cached within the expiration time.
     * @param {string} key The key to check.
     */
    isCached: key => {
        return cache[key] ? cache[key].time - Date.now() < config.cacheExpirationMS : false
    },

    /**
     * Assign a key-value pair to this cache.
     * @param {string} key The key to assign.
     * @param {any} value The value you're mapping to this key.
     */
    set: (key, value) => {
        cache[key] = {
            value: value,
            time: Date.now()
        }
    },
    
    /**
     * Get a value from this cache.
     * @param {string} key The key to assign.
     */
    get: key => {
        return cache[key] ? cache[key].value : undefined
    }   
}