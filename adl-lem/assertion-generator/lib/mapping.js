const axios = require("axios").default;
const config = require("../config");

const mapping = {

    /**
     * @typedef Alignment Alignment object containing a competency and a confidence level.
     * @property {String} competency Competency being aligned.
     * @property {Number} weight Numeric weight of this competency alignment.
     */
    /**
     * Get an array of competency mappings from the given Experience Index entry.
     * @returns {Alignment[]} Array of competency alignments.
     */
    getCompetencyMappings: async(experience) => {
        
        let alignments = []

        if (Array.isArray(experience.educationalalignment))
            alignments = experience.educationalalignment

        else if (Array.isArray(experience.educationalAlignment))
            alignments = experience.educationalAlignment

        return alignments
    },
    
    /**
     * Filters the given alignments for only those from allowed domains.
     * @param {Alignment[]} alignments Resolved and evidentiary xAPI statement.
     * @returns {Alignment[]} Array of competency alignments.
     */
     getAllowedAlignments: async(alignments) => {

        return alignments.filter(alignment => {
            for (let approvedDomain of config.safety.approvedDomains) {
                if (alignment.competency.startsWith(approvedDomain)) { 
                    return true;
                }
            }

            return false;
        });
    },

    /**
     * Get all relevant experiences for the given resolved xAPI statement.
     * @param {Object} statement Resolved and evidentiary xAPI statement.
     * @returns {Object} The experience associated with this statement.
     */
    getRelevantExperience: async(statement) => {

        let entryUri = statement.object.id;
        let entryEndpoint = entryUri;
        
        for (let xi of config.xiDomains) {
            if (entryUri.startsWith(xi.endpoint)) {
                if (entryUri.indexOf("?") >= 0)
                    entryEndpoint += `&secret=${xi.secret}`
                else
                    entryEndpoint += `?secret=${xi.secret}`
                break;
            }
        }

        let res = await axios.get(entryEndpoint, {
            method: 'GET',
            headers: {  'Accept': 'application/json',}
        })
        let result = res.data

        console.log(result);
        console.log(entryEndpoint);

        if (result != null)
        {
            if (Array.isArray(result) && result.length > 0)
                return result[0]
            else if (Array.isArray(result.educationalAlignment))
                return result;
        }

        return null;
    },

    /**
     * Get all relevant experiences for the given resolved xAPI statement.
     * @param {Object} statement Resolved and evidentiary xAPI statement.
     */
    getStatementAlignments: async(statement) => {

        let experience = await mapping.getRelevantExperience(statement)

        console.log("STATEMENT HAS EXPERIENCE: ", experience);

        if (experience)
            return await mapping.getCompetencyMappings(experience)
        else
            return null
    },

    
}

module.exports = mapping