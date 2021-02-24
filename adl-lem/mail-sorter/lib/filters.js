const mom = require("tla-mom-proto");
const config = require("../config");

const taskVerbs = [
    mom.verbs.requested.id,
    mom.verbs.approved.id,
    mom.verbs.directed.id,
    mom.verbs.scheduled.id
]

const goalVerbs = [
    mom.verbs.prioritized.id,
    mom.verbs.conferred.id
]

const providerVerbs = [
    mom.verbs.initialized.id,
    mom.verbs.passed.id,
    mom.verbs.failed.id,
    mom.verbs.completed.id
]

const momVerbs = Object.keys(mom.verbs).map(key => mom.verbs[key].id)

module.exports = {

    isAuthoritative: statement => mom.isStatementAuthoritative(statement),

    isRelevant: statement => {
        return momVerbs.includes(statement.verb.id)
    },

    isResolution: statement => {
        if (statement.context && statement.context.extensions)
            return statement.context.extensions["tla:source"] != undefined
        else
            return false
    },

    needsResolution: statement => {
        return providerVerbs.includes(statement.verb.id) && !statement.object.id.startsWith(config.xi.endpoint)
    },
}