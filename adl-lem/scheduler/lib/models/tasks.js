const { Model, types } = require("sqliter-models");
const LoggingModel = require("./loggingModel");
const enums = require("../enums")

class Tasks extends LoggingModel 
{
    get id() { return "id" }
    get uri() { return "uri" }
    get user() { return "user" }
    get status() { return "status" }
    get timestamp() { return "timestamp" }

    constructor() {
        super("tasks");
        this.define({
            id: {
                name: "id",
                type: types.AUTO_ID,
            },
            uri: {
                name: "uri",
                type: types.TEXT,
                default: "" 
            }, 
            user: {
                name: "user",
                type: types.TEXT,
                default: 0,
            },
            timestamp: {
                name: "timestamp",
                type: types.TEXT
            },
            status: {
                name: "status",
                type: types.TEXT,
                default: "new",
                predefined: Object.keys(enums.taskStatusEnums)
            }
        })
    }
}

module.exports = Tasks