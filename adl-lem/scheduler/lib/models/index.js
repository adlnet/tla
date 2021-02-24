const sqlite = require("sqlite3").verbose();

const Tasks = require("./tasks")
const Approvals = require("./approvals")

const models = {
    tasks: new Tasks(),
    approvals: new Approvals(),

    init: async(db) => {
        
        await models.tasks.init(db);
        await models.approvals.init(db);
    }
}

module.exports = models