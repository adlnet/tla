const sqliter = require("sqliter-models");
const Model = sqliter.Model;
const types = sqliter.types;

const config = require("../../config");
const RolePersona = require("./RolePersona");

class InterestGroup extends Model {

    constructor()
    {
        super("interestGroup");
        this.prettyName = "Interest Groups"

        this.define(this.props = {
            id: {
                name: "id",
                type: types.AUTO_ID,
            },

            collectiveAddress: {
                name: "collectiveAddress",
                type: types.REFACTOR(obj => config.uriBase + `/${this.name}/${obj.id}`),
                description: "URI handle for this group."
            },

            rolePersona: {
                name: "rolePersona",
                type: types.INTEGER,
                description: "Acting role of this interest group.",
                foreign: {
                    model: new RolePersona(),
                    key: "id",
                    strict: false
                }
            },

            protected: {
                name: "protected",
                type: types.BOOL,
                default: false,
            },
            isClassSession: {
                name: "isClassSession",
                type: types.BOOL,
                default: false,
            },
            candidateAudience: {
                name: "candidateAudience",
                type: types.BOOL,
                default: false
            }
        });
    }
}

module.exports = InterestGroup;