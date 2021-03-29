const xi = require("./xi")

const resolve = {

    relevantExperiences: async(statement) => {

        let contentUrl = statement.object.id

        return await xi.getExperiencesFor(contentUrl);
    }
}

module.exports = resolve