const sqliter = require("sqliter-models");
const Model = sqliter.Model;
const types = sqliter.types;
const config = require("../../config");

const Person = require("./Person");

class RolePersona extends Model {

    constructor()
    {
        super("rolePersona");
        this.prettyName = "Role Personas"

        this.define(this.props = {
            id: {
                name: "id",
                type: types.AUTO_ID,
            },

            handle: {
                name: "handle",
                type: types.REFACTOR(obj => config.uriBase + `/${this.name}/${obj.id}`),
                description: "URI constructed from the internal ID."
            },

            description: {
                name: "description",
                type: types.TEXT
            },
            authority: {
                name: "authority",
                type: types.INTEGER,
                description: "Authority determining membership of this role.",
                foreign: {
                    model: new Person(),
                    key: "id",
                    strict: false
                }
            },
            alias: {
                name: "alias",
                type: types.TEXT,
            }, 
            prerequisites: {
                name: "prerequisites",
                type: types.ARRAY()
            }
        });
    }
}

module.exports = RolePersona