const sqliter = require("sqliter-models");
const Model = sqliter.Model;
const types = sqliter.types;
const LoggingModel = require("../loggingModel");

const config = require("../../config");

const uxRoles = [
    "Administrator",
    "Learner",
    "Observer",
    "Instructor",
    "Controller",
    "Supervisor",
    "Curriculum Manager",
    "Competency Manager"
]

class Person extends Model {

    constructor() {
        super("person");
        this.prettyName = "Person"

        this.define(this.props = {

            id: {
                name: "id",
                type: types.AUTO_ID
            },

            uuid: {
                name: "uuid",
                type: types.TEXT,
                description: "Keycloak UUID for this individual.",
                readonly: true,
                required: true,
            },

            handle: {
                name: "handle",
                type: types.REFACTOR(obj => config.uriBase + `/${this.name}/${obj.id}`),
                description: "URI constructed from the internal ID."
            },

            uxRoles: {
                name: "uxRoles",
                type: types.ARRAY({
                    predefined: uxRoles
                }),
                predefined: uxRoles,
                description: "Roles available to this individual."
            },

            // Config Record through Logging
            // Career Trajectory through Goal logging?
            // Competency from external service 

            learnerState: {
                name: "learnerState",
                type: types.ENUM,
                description: "Current learner state of this individual.",
                predefined: [
                    "abandoned",
                    "approved",
                    "asserted",
                    "assessed",
                    "assessed",
                    "augmented",
                    "captured",
                    "certified",
                    "clarified",
                    "completed",
                    "conferred",
                    "contextualized",
                    "curated",
                    "demoted",
                    "denied",
                    "detailed",
                    "directed",
                    "employed",
                    "evaluated",
                    "explored",
                    "failed",
                    "inferred",
                    "initialized",
                    "launched",
                    "located",
                    "mobilized",
                    "organized",
                    "passed",
                    "planned",
                    "prioritized",
                    "projected",
                    "projected",
                    "promoted",
                    "qualified",
                    "recommended",
                    "recruited",
                    "regulated",
                    "released",
                    "requested",
                    "satisfied",
                    "scheduled",
                    "screened",
                    "selected",
                    "socialized",
                    "surveyed",
                    "terminated",
                    "tracked",
                    "transitioned",
                    "validated",
                    "verified",
                    "waived"
                ]
            },

            // Credentials: external
            // Job_Duty_Gig: external from Goal system
            // Learner Task: external from Task system (Scheduler)

        });
    }
}

module.exports = Person;