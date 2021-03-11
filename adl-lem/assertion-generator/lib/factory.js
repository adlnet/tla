const mom = require("tla-mom-proto")
const axios = require("axios").default;

const factory = {
    
    /**
     * @typedef Alignment Alignment object containing a competency and a confidence level.
     * @property {String} competency Competency being aligned.
     * @property {Number} weight Numeric weight of this competency alignment.
     */
    /**
     * Build an assertion statement for a given actor and alignment.
     * @param {Object} statement Evidentiary statement whose actor's competency is being asserted.
     * @param {Alignment} alignment Competency alignment to assert.
     */
    buildAssertion: (statement, alignment, competencyDefinition) => {

        let scale = statement.result && statement.result.score && statement.result.score.scaled != undefined ? statement.result.score.scaled : 1

        if (!competencyDefinition)
            return null
        else {
            
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

            let history = statement.context.extensions["tla:history"]
            if (history == undefined)
                history = []

            return {
                actor: {...statement.actor},
                verb: {...mom.verbs.asserted},
                object: {
                    id: alignment.competency,
                    definition: {
                        type: mom.activityTypes.competency,
                        name: competencyDefinition.name ? {
                            "en-US": competencyDefinition.name
                        } : undefined,
                        description: competencyDefinition.description ? {
                            "en-US": competencyDefinition.description
                        } : undefined
                    }
                },
                context: {
                    extensions: {
                        [mom.contextExtensions.evidence]: [statement.id],
                        [mom.contextExtensions.confidence]: alignment.weight * scale,
                        "tla:source": source,
                        "tla:history": [...history, summary]
                    }
                }
            }
        }
            
    },
}

module.exports = factory