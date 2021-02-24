const sqliter = require("sqliter-models");
const Model = sqliter.Model;
const types = sqliter.types;

const RolePersona = require("./RolePersona");
const Person = require("./Person");

class RoleMembers extends Model {

    constructor()
    {
        super("roleMembers");
        this.prettyName = "Role Membership"

        this.define(this.props = {
            
            id: {
                name: "id",
                type: types.AUTO_ID,
            },

            personId: {
                name: "personId",
                type: types.INTEGER,
                foreign: {
                    model: new Person(),
                    key: "id",
                    strict: true
                },
                required: true,
            },
            roleId: {
                name: "roleId",
                type: types.INTEGER,
                foreign: {
                    model: new RolePersona(),
                    key: "id",
                    strict: true
                },
                required: true,
            }
        });
    }
}

module.exports = RoleMembers