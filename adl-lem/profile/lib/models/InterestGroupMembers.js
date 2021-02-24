const sqliter = require("sqliter-models");
const Model = sqliter.Model;
const types = sqliter.types;

const Person = require("./Person");
const InterestGroup = require("./InterestGroup");

class InterestGroupMembers extends Model {

    constructor()
    {
        super("interestGroupMembers");
        this.prettyName = "Interest Group Membership"

        this.define(this.props = {
            id: {
                name: "id",
                type: types.AUTO_ID,
            },
            
            groupId: {
                name: "groupId",
                type: types.INTEGER,
                foreign: {
                    model: new InterestGroup(),
                    key: "id",
                    strict: true
                },
                required: true,
            },
            memberId: {
                name: "memberId",
                type: types.INTEGER,
                foreign: {
                    model: new Person(),
                    key: "id",
                    strict: true
                },
                required: true,
            }
        });
    }
}

module.exports = InterestGroupMembers