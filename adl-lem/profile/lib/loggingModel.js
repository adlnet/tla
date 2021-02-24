const sqliter = require("sqliter-models");
const Model = sqliter.Model;
const types = sqliter.types;

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

    async appendLog(db, props, record, editor, action) {
        return this.logModel.insert(db, {
            record, 
            editor: (editor || "SYSTEM"),
            action, 
            payload: JSON.stringify(this.preProcess(props))
        })
    }

    async insert(db, props, user) {

        let records = await super.insert(db, props)
        
        for (let record of records)
            await this.appendLog(db, props, record.id, user, this.logCreated)

        return records
    }

    async update(db, props, wheres, user) {

        let records = await super.update(db, props, wheres)
        
        for (let record of records)
            await this.appendLog(db, props, record.id, user, this.logUpdated)

        return records
    }

    async delete(db, wheres, user) {

        let records = await super.delete(db, wheres)
        
        for (let record of records)
            await this.appendLog(db, null, record.id, user, this.logDeleted)

        return records;
    }
}

module.exports = LoggingModel;