const axios = require("axios").default
const cache = require("./cache");
const config = require("../config")

const xi = {

    /**
     * Get all Experiences know to the XI.  This is a workaround as the `?content=` query managed
     * to break a week before PI meeting.  
     */
    getExperiences: async() => {

        let current = null

        // We will use the cache as a backup, in case the XI is either unreachable or 
        // we've made this request recently.
        if (cache.isCached("xi"))
            return cache.get("xi");

        // The XI returns a pretty ugly SQL response with `rows` being what we want.  This
        // request might have failed though, so we're appending the `.catch` to bastardize
        // the async/await + Promise setup a bit to avoid the uglier try/catch.
        //
        // Rows should also be an array, so we need to check for that too.
        //
        let res = await axios.get(`${config.xi.endpoint}/experiences?secret=${config.xi.secret}`).catch(console.error)
        if (res && res.data && Array.isArray(res.data))
            current = res.data
        else
            current = null

        // Assuming we got something, we'll just use that and cache it for next time.
        if (current != null) {
            cache.set("xi", current)
            return current
        }

        let previouslyCachedResult = cache.get("xi")
        
        return previouslyCachedResult ? previouslyCachedResult : [];
    },

    
    /**
     * Get all Experiences know to the XI.  This is a workaround as the `?content=` query managed
     * to break a week before PI meeting.  
     */
     getExperiencesFor: async(contentUrl) => {

        let cacheKey = `xi@${contentUrl}`;
        let current = null

        // We will use the cache as a backup, in case the XI is either unreachable or 
        // we've made this request recently.
        if (cache.isCached(cacheKey))
            return cache.get(cacheKey);

        // The XI returns a pretty ugly SQL response with `rows` being what we want.  This
        // request might have failed though, so we're appending the `.catch` to bastardize
        // the async/await + Promise setup a bit to avoid the uglier try/catch.
        //
        // Rows should also be an array, so we need to check for that too.
        //
        let res = await axios.get(`${config.xi.endpoint}/experiences?secret=${config.xi.secret}&url=${encodeURIComponent(contentUrl)}`).catch(console.error)
        if (res && res.data && Array.isArray(res.data))
            current = res.data
        else
            current = null

        // Assuming we got something, we'll just use that and cache it for next time.
        if (current != null) {
            cache.set(cacheKey, current)
            return current
        }

        let previouslyCachedResult = cache.get(cacheKey)
        
        return previouslyCachedResult ? previouslyCachedResult : [];
    },
}

module.exports = xi;