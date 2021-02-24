const { Model, types, helpers } = require("sqliter-models");

class LoggingModel extends Model {

    constructor(name) {
        super(name);

        this.logModel = new Model(this.name + "_log")
        this.logModel.define({
            id: {
                name: "id",
                type: types.AUTO_ID,
            },
            record: {
                name: "record",
                type: types.INTEGER,
            }, 
            editor: {
                name: "editor",
                type: types.TEXT
            },
            action: {
                name: "action",
                type: types.TEXT,
                predefined: ["created", "updated", "deleted"]
            },
            payload: {
                name: "payload",
                type: types.TEXT
            }
        })

        this.logCreated = "created";
        this.logUpdated = "updated";
        this.logDeleted = "deleted";
    }

    async init(db) {
        await this.logModel.init(db);
        return super.init(db);
    }

    async appendLog(props, record, editor, action) {
        return this.logModel.insert({
            record, 
            editor: (editor || "SYSTEM"),
            action, 
            payload: JSON.stringify(this.preProcess(props))
        })
    }

    async insert(props, user) {

        let records = await super.insert(props)
        
        for (let id of records) {
            await this.appendLog(props, id, user, this.logCreated)
        }

        return records
    }

    async update(props, args, user) {

        let records = await super.update(props, args)
        
        for (let id of records) 
            await this.appendLog(props, id, user, this.logUpdated)

        return records
    }

    async delete(args, user) {

        let records = await super.delete(args)
        
        for (let id of records)
            await this.appendLog(null, id, user, this.logDeleted)

        return records;
    }
}

module.exports = LoggingModel;