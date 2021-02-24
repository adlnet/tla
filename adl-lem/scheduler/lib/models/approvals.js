const { Model, types } = require("sqliter-models");
const LoggingModel = require("./loggingModel");
const enums = require("../enums")

class Approval extends LoggingModel 
{
    get id() { return "id" }
    get uri() { return "uri" }
    get subject() { return "subject" }
    get requester() { return "requester" }
    get status() { return "status" }

    constructor() {
        super("approvals");
        this.define({
            id: {
                name: "id",
                type: types.AUTO_ID,
            },
            uri: {
                name: "uri",
                type: types.TEXT,
            }, 
            subject: {
                name: "subject",
                type: types.TEXT
            },
            requester: {
                name: "requester",
                type: types.TEXT
            },
            timestamp: {
                name: "timestamp",
                type: types.TEXT
            },
            status: {
                name: "status",
                type: types.TEXT,
                default: "new",
                predefined: Object.keys(enums.approvalStatusEnums)
            }
        })
    }
}

module.exports = Approval